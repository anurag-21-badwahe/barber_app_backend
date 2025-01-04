const express = require("express");
const router = express.Router();
// const Salon = require("../models/salon_model");
const upload = require("../middleware/multerMiddleware");
const { createSalon,getSalonDetails } = require("../controllers/salon/salon_basic_controller");

// Salon Registration Flow

router.post("/register/basics", upload, createSalon);
// // router.post("/register/barbers", verifyToken, addBarbers);
// // router.post("/register/services", verifyToken, addServices);
// // router.post("/register/operation-hours", verifyToken, addOperationHours);
// // router.post("/register/images", verifyToken, addImages);
// // router.post("/register/setting", verifyToken, addSettings);
// // router.post("/register/booking", verifyToken, addBooking);



// // Salon Login
// router.post("/salon/login", loginSalon);

// //get all salons
// router.get("/salon", getAllSalons);

//get salon by id
router.get("/:id", getSalonDetails);


// //update salon details
// router.put("/salons/:id", upload, updateSalon);


// //delete salon
// router.delete("/salons/:id", deleteSalon);


// //assign salon to owner
// router.put("/salons/:id/assign", assignSalonToOwner);


module.exports = router;