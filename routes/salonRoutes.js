const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const { createSalon,getSalonDetails } = require("../controllers/salon/salon_basic_controller");
const {setOperationalHours,getOperationalHours,deleteOperationalHours} = require("../controllers/salon/salon_operation_hours_controller");
const verifyToken = require("../middleware/authMiddleware");

// Salon Registration Flow

router.post("/register/basics", upload, createSalon);

router.post("/:salonId/operation-hours",setOperationalHours);

router.get("/:salonId/operation-hours",getOperationalHours);

router.delete("/:salonId/operation-hours",deleteOperationalHours);




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