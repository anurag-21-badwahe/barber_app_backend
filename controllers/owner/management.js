const Owner = require("../../models/owner_model");


const getSalonsByOwnerId = async (req, res) => {
  try {
    // Extract ownerId from request parameters
    const { ownerId } = req.params;

    // Validate that ownerId is provided
    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    // Fetch salons where the owner matches the ownerId
    const salons = await Salon.find({ owner: ownerId }).populate("employees").exec();

    // Check if salons were found
    if (!salons || salons.length === 0) {
      return res.status(404).json({ message: "No salons found for this owner" });
    }

    // Return the salons as a response
    res.status(200).json({ salons });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching salons:", error);
    res.status(500).json({ error: "An error occurred while fetching salons" });
  }
};

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

module.exports = { deleteOwner,getSalonsByOwnerId };
  