const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth_customer_controller");
const { registerCustomer } = require("../controllers/auth_customer_controller");
const { loginSalon } = require("../controllers/auth_salon_controller");
const { registerSalon } = require("../controllers/auth_salon_controller");
const { verifyCustomer } = require("../controllers/auth_customer_controller");
const upload = require("../middleware/multerMiddleware");
const { get } = require("mongoose");





// Owner registration
router.post('/owners/register', registerOwner);

// Owner Login
router.post("/owners/login", loginOwner);

// Owner Verify
router.post("/owners/verify", verifyOwner);

// Get all salons by owner id
router.get("/owners/:id/salons", getSalonsByOwnerId);

//Update owner details
// router.put("/owners/:id", updateOwner);

//Request reset password code
router.post("/owner/request-reset", requestPasswordReset);

//reset password
router.post("/owner/reset-password", resetPassword);

//Delete owner details
router.delete("/owners/:id", deleteOwner);

module.exports = router;
