const Salon = require("../../models/salon_model");
const Owner = require("../../models/owner_model");
const Barber = require("../../models/barber_model");
const uploadToCloudinary = require("../../utils/cloudinary");

// Register a new salon
const createSalon = async (req, res) => {

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

  try {
    const {
      ownerId,
      name,
      location,
      contact,
      typeOfSalon,
    } = req.body;

     // Validate owner existence
     const owner = await Owner.findById(ownerId);
     if (!owner) {
       return res.status(404).json({ message: "Owner not found" });
     }
 
     if (!req.files || !req.files.salonImages) {
      return res.status(400).json({ 
        message: "Please upload between 3 and 5 salon images" 
      });
    }

    const uploadedFiles = req.files.salonImages;
    if (uploadedFiles.length < 3 || uploadedFiles.length > 5) {
      return res.status(400).json({
        message: "Please upload between 3 and 5 salon images"
      });
    }

    // Upload images to Cloudinary
    const photoUrls = [];
    for (const file of uploadedFiles) {
      const result = await uploadToCloudinary(file.path);
      photoUrls.push(result.secure_url);
    }
    // Create and save a new salon
    const salon = new Salon({
      ownerId,
      name,
      location,
      contact,
      typeOfSalon,
      photos : photoUrls
    });

    await salon.save();

    res.status(201).json({
      message: "Salon registered successfully.",
      salon,
    });
  } catch (error) {
    console.error("Error registering salon:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get salon details and populate barbers
const getSalonDetails = async (req, res) => {
  try {
    const { id } = req.params; // Salon ID

    // Find the salon and populate barbers
    const salon = await Salon.findById(id).exec();

    if (!salon) {
      return res.status(404).json({ message: "Salon not found." });
    }

    // Find all barbers for this salon
    const barbers = await Barber.find({ salonId: id });

    res.status(200).json({ salon, barbers });
  } catch (error) {
    console.error("Error fetching salon details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};



module.exports = {createSalon,getSalonDetails}
