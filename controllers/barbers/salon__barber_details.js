const Barber = require("../../models/barber_model");
const barberSchema = require("../../validators/barber_validator");
const mongoose = require('mongoose');
const uploadToCloudinary = require("../../utils/cloudinary");

const createBarber = async (req, res) => {
  try {
    const { salonId } = req.params;
    let barbers = req.body.barbers;

    // Parse JSON if barbers is sent as string
    if (typeof barbers === "string") {
      try {
        barbers = JSON.parse(barbers);
        console.log("Parsed barbers:", barbers);
      } catch (parseError) {
        return res.status(400).json({
          error: "Invalid barbers data format",
          details: parseError.message,
          receivedData: req.body.barbers,
        });
      }
    }

    if (!Array.isArray(barbers) || barbers.length === 0) {
      return res.status(400).json({
        message: "Invalid barber data provided. Please provide a valid array of barbers.",
      });
    }

    // Handle file uploads - Check barberImages array
    const uploadedFiles = req.files.barberImages;
    console.log("Uploaded files:", uploadedFiles);

    if (!uploadedFiles || uploadedFiles.length !== barbers.length) {
      return res.status(400).json({
        message: "Number of uploaded files does not match the number of barbers.",
        filesCount: uploadedFiles ? uploadedFiles.length : 0,
        barbersCount: barbers.length
      });
    }

    // Upload images to Cloudinary and add URLs to barbers
    for (let i = 0; i < barbers.length; i++) {
      const result = await uploadToCloudinary(uploadedFiles[i].path);
      barbers[i].photo = result.secure_url;
    }

    // Add salonId to each barber and save to DB
    const newBarbers = barbers.map((barber) => ({ ...barber, salonId }));
    const savedBarbers = await Barber.insertMany(newBarbers);
    res.status(201).json({ 
      message: "Barbers created successfully", 
      barbers: savedBarbers 
    });

  } catch (error) {
    console.error("Error creating barbers:", error);
    res.status(500).json({ 
      message: "Error creating barbers", 
      error: error.message 
    });
  }
};

// Get all barbers for a salon
const getAllBarbers = async (req, res) => {
  try {
    const { salonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(salonId)) {
      return res.status(400).json({ message: "Invalid salon ID format" });
    }
    const barbers = await Barber.find({ salonId });
    res.status(200).json(barbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single barber by ID
const getBarberById = async (req, res) => {
  try {
    const { id } = req.params;
    const barber = await Barber.findById(id);

    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.status(200).json(barber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a barber
const updateBarber = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBarber = await Barber.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBarber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.status(200).json(updatedBarber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a barber
const deleteBarber = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBarber = await Barber.findByIdAndDelete(id);

    if (!deletedBarber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.status(200).json({ message: "Barber deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber,
};
