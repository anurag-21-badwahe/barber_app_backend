const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const {
  createSalon,
  getSalonDetails,
} = require("../controllers/salon/salon_basic_controller");
const {
  setOperationalHours,
  getOperationalHours,
  deleteOperationalHours,
} = require("../controllers/salon/salon_operation_hours_controller");
const {
  createSalonSetting,
  getSalonSetting,
  updateSalonSetting,
} = require("../controllers/salon/salon_setting_controller");
const {
  createService,
  getServicesBySalon,
  updateService,
  deleteService,
} = require("../controllers/salon/salon_services_controller");
const verifyToken = require("../middleware/authMiddleware");

// Salon Registration Flow

router.post("/register/basics", upload, createSalon);

router.post("/:salonId/operation-hours", setOperationalHours);

router.get("/:salonId/operation-hours", getOperationalHours);

router.delete("/:salonId/operation-hours", deleteOperationalHours);

router.get("/:id", getSalonDetails);

router.post("/:salonId/create-salon-setting", createSalonSetting);

router.get("/:salonId/salon-setting", getSalonSetting);

router.put("/:salonId/update-salon-setting", updateSalonSetting);

router.post("/:salonId/create-salon-service", createService);

router.get("/:salonId/salon-service", getServicesBySalon);

router.put("/:salonId/update-salon-service", updateService);

router.delete("/:salonId/delete-salon-service",deleteService);

// // Salon Login
// router.post("/salon/login", loginSalon);

// //get all salons
// router.get("/salon", getAllSalons);

//get salon by id

// //update salon details
// router.put("/salons/:id", upload, updateSalon);

// //delete salon
// router.delete("/salons/:id", deleteSalon);

// //assign salon to owner
// router.put("/salons/:id/assign", assignSalonToOwner);

module.exports = router;
