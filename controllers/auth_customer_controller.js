const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const registerCustomerSchema = require("../validators/register_customer_validator");
const loginCustomerSchema = require('../validators/login_customer_validator')
const Customer = require('../models/customer_model')
const { z } = require("zod"); // Ensure zod is installed
const jwt = require("jsonwebtoken")
// const { sendOTP } = require("../services/verificatonEmailTwillo");
const {sendVerificationEmail} = require("../services/verificationEmail");
const { sendResetPasswordEmail } = require("../services/resetPasswordEmail");


const router = express.Router();

// Register route
const registerCustomer = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = registerCustomerSchema.parse(req.body);

    // Check if phone number or email already exists
    const existingCustomer = await Customer.findOne({
      $or: [
        { phoneNumber: validatedData.phoneNumber },
        { email: validatedData.email },
      ],
    });

    if (existingCustomer) {
      return res.status(400).json({
        error: "Phone number or email already registered",
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();


    // 1 hour timing for otp code expiry
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);

  

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);


   

    // Create a new customer object (don't save it yet)
    const newCustomer = new Customer({
      customerName: validatedData.customerName,
      phoneNumber: validatedData.phoneNumber,
      email: validatedData.email,
      gender: validatedData.gender,
      city : validatedData.city,
      pinCode: validatedData.pinCode,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      password: hashedPassword,
      photo: null, 
      isVerified: false, // Default for new registrations
      verifyCode: otp, 
      verifyCodeExpiry: otpExpiry,
      resetPasswordCode: null,
    });

    // Send the OTP to the email first
    const emailResult = await sendVerificationEmail(validatedData.email, validatedData.customerName, otp);

    if (!emailResult.success) {
      // If email sending failed, return an error and do not save the customer
      return res.status(500).json({ error: emailResult.message });
    }

    // If email is sent successfully, save the customer to the database
    await newCustomer.save();

    const token = jwt.sign(
      {
        id: newCustomer._id,
        role: newCustomer.role,
        isVerified: false
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"  // Token expires in 1 hour, same as OTP
      }
    );

    // Respond with success
    res.status(201).json({ 
      message: "Customer registered successfully", 
      token,  // Include token in response
      email: newCustomer.email // Optionally include email for display purposes
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during customer registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    // console.log("Request Body:", req.body); 
    // Ensure that the request body is valid
    const validatedData = loginCustomerSchema.parse(req.body);  // Parse using zod

    // Your logic to check the login credentials
    const customer = await Customer.findOne({
      $or: [
        { customerEmail: validatedData.login },
        { phoneNo: validatedData.login }
      ]
    });

    if (!customer) {
      return res.status(400).json({ error: "Invalid email or phone number" });
    }

    // Check password here (assuming you're using bcrypt for hashing)
    const isPasswordValid = await bcrypt.compare(validatedData.password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: customer._id,
        role: customer.role,
        isVerified : customer.isVerified
      },
      process.env.JWT_SECRET, // Ensure this environment variable is set
      {
        expiresIn: "1h", // Token validity
      }
    );
    
    // If credentials are valid, generate a token or return success
    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    // Handle validation errors or unexpected issues
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyCustomer = async (req, res) => {
  try {
    // Validate that we only receive the 6-digit code
    const verifySchema = z.object({
      verificationCode: z.string().length(6)
    });

    // Get token from authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }

    // Validate the verification code from request body
    const validatedData = verifySchema.parse(req.body);

    // Find the customer using the ID from JWT
    const customer = await Customer.findById(decodedToken.id);

    if (!customer) {
      return res.status(404).json({
        error: "Customer not found"
      });
    }

    // Check if customer is already verified
    if (customer.isVerified) {
      return res.status(400).json({
        error: "Customer is already verified"
      });
    }

    // Check if verification code matches and hasn't expired
    if (customer.verifyCode !== validatedData.verificationCode) {
      return res.status(400).json({
        error: "Invalid verification code"
      });
    }

    if (new Date() > customer.verifyCodeExpiry) {
      return res.status(400).json({
        error: "Verification code has expired",
        canResend: true
      });
    }

    // Update customer verification status
    customer.isVerified = true;
    customer.verifyCode = null;      // Clear the verification code
    customer.verifyCodeExpiry = null; // Clear the expiry
    await customer.save();

    // Generate a new JWT token with updated verification status
    const newToken = jwt.sign(
      {
        id: customer._id,
        role: customer.role,
        isVerified: true
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // Return success response with new token
    return res.status(200).json({
      message: "Email verified successfully",
      token: newToken
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during verification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    // Validate email from request body
    const resetRequestSchema = z.object({
      email: z.string().email()
    });

    const validatedData = resetRequestSchema.parse(req.body);

    // Find the customer
    const customer = await Customer.findOne({ email: validatedData.email });

    if (!customer) {
      // For security, we still return 200 even if email doesn't exist
      return res.status(200).json({
        message: "If your email is registered, you will receive a reset code"
      });
    }

    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 30 minutes expiry for reset code
    const resetCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);

    // Update customer with reset code
    customer.resetPasswordCode = resetCode;
    customer.resetPasswordExpiry = resetCodeExpiry;
    
    // Send the reset code to email first before saving
    const emailResult = await sendResetPasswordEmail(
      customer.email,
      customer.customerName,
      resetCode,
    );

    if (!emailResult.success) {
      return res.status(500).json({ error: emailResult.message });
    }

    // Save the customer with reset code after email is sent
    await customer.save();

    // Return success message
    return res.status(200).json({
      message: "If your email is registered, you will receive a reset code"
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error in password reset request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reset password with code
const resetPassword = async (req, res) => {
  try {
    // Validate reset code and new password
    const resetPasswordSchema = z.object({
      email: z.string().email(),
      resetCode: z.string().length(6),
      newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    });

    const validatedData = resetPasswordSchema.parse(req.body);

    // Find customer with matching email and valid reset code
    const customer = await Customer.findOne({
      email: validatedData.email,
      resetPasswordCode: validatedData.resetCode,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!customer) {
      return res.status(400).json({
        error: "Invalid or expired reset code"
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Update customer with new password and clear reset code fields
    customer.password = hashedPassword;
    customer.resetPasswordCode = null;
    customer.resetPasswordExpiry = null;
    await customer.save();

    // Generate new JWT token
    const token = jwt.sign(
      {
        id: customer._id,
        role: customer.role,
        isVerified: customer.isVerified
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    // Return success with new token
    return res.status(200).json({
      message: "Password reset successful",
      token
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error in password reset:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};







module.exports = {
  registerCustomer,
  loginCustomer,
  verifyCustomer,
  requestPasswordReset,
  resetPassword  
};
