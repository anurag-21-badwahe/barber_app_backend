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



// Salon Register


// Salon Register - use upload middleware directly
router.post('/salon/register', upload, registerSalon);

// Customer Login
router.post("/customer/login", loginCustomer);

router.post("/customer/verify", verifyCustomer);

// Salon Login
router.post("/salon/login", loginSalon);

// Salon Register
router.post("/customer/register", registerCustomer);

//Request reset password code
router.post("/customer/request-reset", requestPasswordReset);

//reset password
router.post("/customer/reset-password", resetPassword);

module.exports = router;
