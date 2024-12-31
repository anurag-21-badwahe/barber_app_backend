const Owner = require("../../models/owner_model");

const deleteOwner = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the owner
      const owner = await Owner.findByIdAndDelete(id);
      if (!owner) {
        return res.status(404).json({ message: "Owner not found." });
      }
  
      return res.status(200).json({ message: "Owner deleted successfully." });
    } catch (error) {
      console.error("Error deleting owner:", error);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  };
  
  module.exports = { deleteOwner };
  