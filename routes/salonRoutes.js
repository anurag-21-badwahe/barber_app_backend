const express = require("express");
const router = express.Router();
const Salon = require("../models/salon_model");
const upload = require("../middleware/multerMiddleware");
const { registerSalon } = require("../controllers/auth_salon_controller");

// Salon Register 
router.post("/salon/register",upload,registerSalon);


// Salon Login
router.post("/salon/login", loginSalon);

//get all salons
router.get("/salons", getAllSalons);

//get salon by id
router.get("/salons/:id", getSalonById);


//update salon details
router.put("/salons/:id", upload, updateSalon);


//delete salon
router.delete("/salons/:id", deleteSalon);


//assign salon to owner
router.put("/salons/:id/assign", assignSalonToOwner);