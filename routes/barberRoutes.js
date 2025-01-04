const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const {
    createBarber,
    getAllBarbers,
    getBarberById,
    updateBarber,
    deleteBarber
} = require("../controllers/barbers/salon__barber_details");


// Create a new barber for a specific salon
router.post("/:salonId",upload,createBarber);

// Get all barbers for a specific salon
router.get("/:salonId",getAllBarbers);

// Get a specific barber by ID
router.get("/:salonId/barbers/:barberId", getBarberById);

// Update a barber's information
router.put("/:salonId/barbers/:barberId",updateBarber);

// Delete a barber by ID
router.delete("/:salonId/barbers/:barberId",deleteBarber);

module.exports = router;
