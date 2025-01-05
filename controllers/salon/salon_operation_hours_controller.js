const OperationalHoursModel = require("../../models/operation_model");

const setOperationalHours = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Params:", req.params);

  const { salonId } = req.params;
  const operationalHours = req.body;

  if (!operationalHours || Object.keys(operationalHours).length === 0) {
    return res
      .status(400)
      .json({ message: "Operational hours data is required" });
  }

  try {
    let operationalHoursEntry = await OperationalHoursModel.findOne({
      salonId,
    });

    if (operationalHoursEntry) {
      operationalHoursEntry.set(operationalHours); // Updating directly
      await operationalHoursEntry.save();
      return res
        .status(200)
        .json({ message: "Operational hours updated successfully" });
    } else {
      const newOperationalHours = new OperationalHoursModel({
        salonId,
        ...operationalHours,
      });
      await newOperationalHours.save();
      return res
        .status(201)
        .json({ message: "Operational hours created successfully" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Get operational hours by salonId
const getOperationalHours = async (req, res) => {
    const { salonId } = req.params;

    try {
        const operationalHours = await OperationalHoursModel.findOne({ salonId });
        if (!operationalHours) {
            return res.status(404).json({ message: "Operational hours not found" });
        }
        res.status(200).json(operationalHours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete operational hours by salonId
const deleteOperationalHours = async (req, res) => {
    const { salonId } = req.params;

    try {
        const deletedEntry = await OperationalHoursModel.findOneAndDelete({ salonId });
        if (!deletedEntry) {
            return res.status(404).json({ message: "Operational hours not found" });
        }
        res.status(200).json({ message: "Operational hours deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  setOperationalHours,
  getOperationalHours,
  deleteOperationalHours,
};
