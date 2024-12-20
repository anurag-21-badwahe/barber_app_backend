const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const registerCustomerSchema = require("../validators/register_customer_validator");
const loginCustomerSchema = require('../validators/login_customer_validator')
const Customer = require('../models/customer_model')
const { z } = require("zod"); // Ensure zod is installed

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create a new customer object
    const newCustomer = new Customer({
      customerName: validatedData.customerName,
      phoneNumber: validatedData.phoneNumber,
      email: validatedData.email,
      dateOfBirth: new Date(validatedData.dateOfBirth),
      password: hashedPassword,
      photo: null, // Can be updated later with an upload service
      isVerified: false, // Default for new registrations
      verifyCode: null, // Can implement email/phone verification later
      verifyCodeExpiry: null,
      resetPasswordCode: null,
    });

    // Save the customer to the database
    await newCustomer.save();

    // Respond with success
    res.status(201).json({ message: "Customer registered successfully" });
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

    // If credentials are valid, generate a token or return success
    res.status(200).json({ message: "Login successful", customer });

  } catch (error) {
    // Handle validation errors or unexpected issues
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = {
  registerCustomer,
  loginCustomer,
};
