// const { generateToken } = require("../utils/generateToken");
// const { comparePassword } = require("../utils/bcryptUtils");
const z = require("zod")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const Salon = require('../models/salon_model'); // Assuming Salon model is in this path
const Barber = require('../models/barber_model'); // Assuming Barber model is in this path
const { salonSchema } = require('../validators/register_salon_validator'); // Ensure this path is correct
const {loginSalonSchema} = require("../validators/login_salon_validator");
const uploadOnCloudinary = require("../utils/cloudinary");


const registerSalon = async (req, res) => {
  try {
    if (typeof req.body.barbers === 'string') {
      try {
        req.body.barbers = JSON.parse(req.body.barbers);
      } catch (parseError) {
        return res.status(400).json({
          error: "Invalid barbers data format",
          details: parseError.message,
          receivedData: req.body.barbers
        });
      }
    }

    const validatedData = salonSchema.parse(req.body);
    const barberImages = req.files?.barberImages || [];
    const salonImages = req.files?.salonImages;

    // Validate barber images count matches barbers count
    if (barberImages.length !== validatedData.barbers.length) {
      return res.status(400).json({ 
        error: `Expected ${validatedData.barbers.length} barber images, got ${barberImages.length}` 
      });
    }

    // Validate salon images
    if (!salonImages || salonImages.length < 3 || salonImages.length > 5) {
      return res.status(400).json({ 
        error: "Salon must upload at least 3 and at most 5 images" 
      });
    }

    console.log("Salon Images:", salonImages);
    salonImages.forEach(image => console.log(image.path));
    console.log("Barber Images:", barberImages);

    // Upload salon images
    const salonImgUrls = [];
    for (const image of salonImages) {
      const uploadedImage = await uploadOnCloudinary(image.path);
      if (!uploadedImage) {
        return res.status(400).json({ error: "Failed to upload salon images" });
      }
      salonImgUrls.push(uploadedImage.url);
    }

    // Upload barber images and map to barbers
    const barbersWithPhotos = await Promise.all(
      validatedData.barbers.map(async (barber, index) => {
        const uploadedImage = await uploadOnCloudinary(barberImages[index].path);
        if (!uploadedImage) {
          return res.status(400).json({ 
            error: `Failed to upload image for barber ${barber.barberName}` 
          });
        }
        return {
          ...barber,
          photo: uploadedImage.url
        };
      })
    );

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newSalon = new Salon({
      salonName: validatedData.salonName,
      salonEmail: validatedData.salonEmail,
      password: hashedPassword,
      phoneNo: validatedData.phoneNo,
      photo: salonImgUrls,
      city: validatedData.city,
      pinCode: validatedData.pinCode,
      barbers: barbersWithPhotos,
      isVerified: false,
      verifyCode: null,
      verifyCodeExpiry: null,
      resetPasswordCode: null,
    });

    await newSalon.save();

    res.status(201).json({
      message: "Salon registered successfully",
      salon: {
        salonName: newSalon.salonName,
        salonEmail: newSalon.salonEmail,
        phoneNo: newSalon.phoneNo,
        photo: newSalon.photo,
        barbers: newSalon.barbers
      },
    });
  } catch (error) {
    console.error(error);
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

    const token = jwt.sign(
      {
        id: Salon._id,
        role: Salon.role,
        isVerified : Salon.isVerified
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





module.exports = {loginSalon, registerSalon };
