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
    // Validate request body using Zod schema
    const validatedData = customerSchema.parse(req.body);

    // Check if email already exists
    const existingCustomer = await Customer.findOne({
      email: validatedData.email,
    });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create the customer object for saving to the database
    const newCustomer = new Customer({
      customerName: validatedData.customerName,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber,
      dateOfBirth: validatedData.dateOfBirth,
      role: validatedData.role || "customer",
      password: hashedPassword,
    });

    // Save to database
    await newCustomer.save();

    // Respond with success
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    // Handle validation errors or unexpected issues
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
        role: customer.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Respond with token
    return res.status(200).json({
      message: "Login successful",
      token,
      customer: {
        id: customer._id,
        name: customer.customerName,
        email: customer.email,
        role: customer.role,
      },
    });
  } catch (error) {
    console.error("Error during customer login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
};
