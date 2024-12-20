// const { generateToken } = require("../utils/generateToken");
// const { comparePassword } = require("../utils/bcryptUtils");
const {z} = require("zod")
const bcrypt = require('bcrypt');
const Salon = require('../models/salon_model'); // Assuming Salon model is in this path
const { salonSchema } = require('../validators/register_salon_validator'); // Ensure this path is correct
const {loginSalonSchema} = require("../validators/login_salon_validator")

const registerSalon = async (req, res) => {
  // console.log(req.body)
  try {
    const validatedData = salonSchema.parse(req.body); // Validate using Zod

    // Check if salon email or phone number already exists
    const existingSalon = await Salon.findOne({
      $or: [
        { salonEmail: validatedData.salonEmail },
        { phoneNo: validatedData.phoneNo },
      ],
    });

    if (existingSalon) {
      return res.status(400).json({ error: "Email or phone number already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create the salon object for saving to the database
    const newSalon = new Salon({
      salonName: validatedData.salonName,
      salonEmail: validatedData.salonEmail,
      password: hashedPassword,
      phoneNo: validatedData.phoneNo,
      photo: validatedData.photo || null, // Optional field
      barbers: validatedData.barbers || [], // Optional field, defaults to empty array
      isVerified: false, // Default to false for new registrations
      verifyCode: null, // Initially null
      verifyCodeExpiry: null, // Initially null
      resetPasswordCode: null, // Initially null
    });

    // Save to the database
    await newSalon.save();

    // Respond with success
    res.status(201).json({
      message: "Salon registered successfully",
      salon: {
        salonName: newSalon.salonName,
        salonEmail: newSalon.salonEmail,
        phoneNo: newSalon.phoneNo,
        // Optionally return more fields
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginSalon = async (req, res) => {
  try {
    // console.log("Request Body:", req.body); 
    // Ensure that the request body is valid
    const validatedData = loginSalonSchema.parse(req.body);  // Parse using zod

    // Your logic to check the login credentials
    const salon = await Salon.findOne({
      $or: [
        { salonEmail: validatedData.login },
        { phoneNo: validatedData.login }
      ]
    });

    if (!salon) {
      return res.status(400).json({ error: "Invalid email or phone number" });
    }

    // Check password here (assuming you're using bcrypt for hashing)
    const isPasswordValid = await bcrypt.compare(validatedData.password, salon.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // If credentials are valid, generate a token or return success
    res.status(200).json({ message: "Login successful", salon });

  } catch (error) {
    // Handle validation errors or unexpected issues
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





module.exports = {loginSalon, registerSalon };
