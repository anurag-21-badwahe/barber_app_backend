const SalonSetting = require('../../models/salon_setting'); // Adjust the path based on your project structure

// Create a new salon setting
const createSalonSetting = async (req, res) => {
  try {
    const { salonId } = req.params;
    const {settings} = req.body;

    // Check if salonId and settings are provided
    if (!salonId) {
      return res.status(400).json({ message: 'Salon ID is required' });
    }
    if (!settings) {
      return res.status(400).json({ message: 'Salon Setting  is required' });
    }

    const newSalonSetting = new SalonSetting({
      salonId,
      settings,
    });

    const savedSalonSetting = await newSalonSetting.save();
    res.status(201).json(savedSalonSetting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating salon setting', error: error.message });
  }
};

// Get salon settings by salonId
const getSalonSetting = async (req, res) => {
  try {
    const { salonId } = req.params;

    const salonSetting = await SalonSetting.findOne({ salonId }).populate('salonId');
    if (!salonSetting) {
      return res.status(404).json({ message: 'Salon setting not found' });
    }

    res.status(200).json(salonSetting);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching salon setting', error: error.message });
  }
};

// Update salon settings
const updateSalonSetting = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({ message: 'Settings data is required' });
    }

    const updatedSalonSetting = await SalonSetting.findOneAndUpdate(
      { salonId },
      { $set: { settings } },
      { new: true }
    );

    if (!updatedSalonSetting) {
      return res.status(404).json({ message: 'Salon setting not found' });
    }

    res.status(200).json(updatedSalonSetting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating salon setting', error: error.message });
  }
};

// Delete salon settings
const deleteSalonSetting = async (req, res) => {
  try {
    const { salonId } = req.params;

    const deletedSalonSetting = await SalonSetting.findOneAndDelete({ salonId });

    if (!deletedSalonSetting) {
      return res.status(404).json({ message: 'Salon setting not found' });
    }

    res.status(200).json({ message: 'Salon setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting salon setting', error: error.message });
  }
};


module.exports = {
  createSalonSetting,
  getSalonSetting,
  updateSalonSetting,
  deleteSalonSetting,
};