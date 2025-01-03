const Salon = require("../models/salon_model");

// Register a new salon
const registerSalon = async (req, res) => {
  try {
    const {
      ownerId,
      name,
      location,
      contact,
      typeOfSalon,
      photos,
      employees,
    } = req.body;

    // Create and save a new salon
    const salon = new Salon({
      ownerId,
      name,
      location,
      contact,
      typeOfSalon,
      photos,
      employees,
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

const getSalonDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      const salon = await Salon.findById(id).populate("barber").exec();
  
      if (!salon) {
        return res.status(404).json({ message: "Salon not found." });
      }
  
      res.status(200).json({ salon });
    } catch (error) {
      console.error("Error fetching salon details:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
};

module.exports = {registerSalon,getSalonDetails}
