const express = require("express");
const bcrypt = require("bcrypt"); // For password hashing
const customerSchema = require("../validators/register_customer_validator");
const loginSchema = require('../validators/login_customer_validator')
const Customer = require('../models/customer_model')
const { z } = require("zod"); // Ensure zod is installed

const router = express.Router();

// Register route
const registerCustomer = async (req, res) => {
  try {
    // Validate the request body using Zod schema
    const validatedData = customerSchema.parse(req.body);

    // Check if customer email or phone number already exists
    const existingCustomer = await Customer.findOne({
      $or: [
        { email: validatedData.email },
        { phoneNumber: validatedData.phoneNumber },
      ],
    });

    if (existingCustomer) {
      return res.status(400).json({ error: "Email or phone number already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create the customer object for saving to the database
    const newCustomer = new Customer({
      fullname: validatedData.fullname,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber,
      dateOfBirth: validatedData.dateOfBirth || null, // Optional field
      photo: validatedData.photo || null, // Optional field
      isVerified: false, // Default value for new registrations
      password: hashedPassword,
      verifyCode: null, // Initially null, set later during verification process
      verifyCodeExpiry: null, // Initially null
      resetPasswordCode: null, // Initially null
    });

    // Save to the database
    await newCustomer.save();

    // Respond with success
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    // Handle validation errors or unexpected issues
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during customer registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const loginCustomer = async (req, res) => {
  try {
    // Validate and extract email and password from request body
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;  // Extract email and password from validated data

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if customer is verified (optional)
    if (!customer.isVerified) {
      return res.status(403).json({ error: "Customer account is not verified" });
    }

    // Generate token (if required)
    const token = jwt.sign({ id: customer._id, email: customer.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with success
    res.status(200).json({ message: "Customer logged in successfully", token });
  } catch (error) {
    console.error("Error during customer login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  registerCustomer,
  loginCustomer,
};
