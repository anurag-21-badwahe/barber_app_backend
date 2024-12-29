const bcrypt = require("bcryptjs");
const Owner = require("../../models/owner_model");
const jwt = require("jsonwebtoken");  
const registerOwnerValidator = require("../validators/registerOwnerValidator");   
const loginOwnerValidator = require("../../validators/owner/owner_login_validator");

// Register Owner Controller
const registerOwner = async (req, res) => {
  try {
    const { fullname, email, phoneNo, password } = req.body;

    const validatedData = registerOwnerValidator.parse(req.body);

    // Validate required fields
    if (!fullname || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email or phone already exists
    const existingOwner = await Owner.findOne({
      $or: [{ email }, { phoneNo }],
    });
    if (existingOwner) {
      return res.status(400).json({ message: "Email or phone number already in use." });
    }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();


      // 1 hour timing for otp code expiry
      const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new owner instance
    const newOwner = new Owner({
      fullname,
      email,
      phoneNo,
      password: hashedPassword,
      isVerified: false, 
      verifyCode: otp, 
      verifyCodeExpiry: otpExpiry,
      resetPasswordCode: null,      
    });

    // Save the owner to the database
    
    
    const emailResult = await sendVerificationEmail(validatedData.email, validatedData.OwnerName, otp);
    
    if (!emailResult.success) {
        // If email sending failed, return an error and do not save the owner
        return res.status(500).json({ error: emailResult.message });
    }
    
    const savedOwner = await newOwner.save();

     const token = jwt.sign(
          {
            id: newOwner._id,
            role: newOwner.role,
            isVerified: false
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h"  // Token expires in 1 hour, same as OTP
          }
        );

    // Send success response
    return res.status(201).json({
      message: "Owner registered successfully.",
      owner: {
        id: savedOwner._id,
        fullname: savedOwner.fullname,
        email: savedOwner.email,
        phoneNo: savedOwner.phoneNo,
        role: savedOwner.role,
        token : token
      },
    });
  } catch (error) {
    console.error("Error registering owner:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const loginOwner = async (req, res) => {
  try {
    // console.log("Request Body:", req.body); 
    // Ensure that the request body is valid
    const validatedData = loginOwnerValidator.parse(req.body);  // Parse using zod

    // Your logic to check the login credentials
    const owner = await Owner.findOne({
      $or: [
        { email: validatedData.login },
        { phoneNumber: validatedData.login }
      ]
    });

    if (!owner) {
      return res.status(400).json({ error: "Invalid email or phone number" });
    }

    // Check password here (assuming you're using bcrypt for hashing)
    const isPasswordValid = await bcrypt.compare(validatedData.password, owner.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: owner._id,
        role: owner.role,
        isVerified : owner.isVerified
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

const verifyOwner = async (req, res) => {
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
  
      // Find the owner using the ID from JWT
      const owner = await Owner.findById(decodedToken.id);
  
      if (!owner) {
        return res.status(404).json({
          error: "Owner not found"
        });
      }
  
      // Check if owner is already verified
      if (owner.isVerified) {
        return res.status(400).json({
          error: "Owner is already verified"
        });
      }
  
      // Check if verification code matches and hasn't expired
      if (owner.verifyCode !== validatedData.verificationCode) {
        return res.status(400).json({
          error: "Invalid verification code"
        });
      }
  
      if (new Date() > owner.verifyCodeExpiry) {
        return res.status(400).json({
          error: "Verification code has expired",
          canResend: true
        });
      }
  
      // Update owner verification status
      owner.isVerified = true;
      owner.verifyCode = null;      // Clear the verification code
      owner.verifyCodeExpiry = null; // Clear the expiry
      await owner.save();
  
      // Generate a new JWT token with updated verification status
      const newToken = jwt.sign(
        {
          id: owner._id,
          role: owner.role,
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
  

module.exports = { registerOwner,loginOwner,verifyOwner };
