const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  verifyCustomer,
  loginCustomer,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth_customer_controller");

// Customer Register
router.post("/customer/register", registerCustomer);

// Customer Login
router.post("/customer/login", loginCustomer);

router.post("/customer/verify", verifyCustomer);

//Request reset password code
router.post("/customer/request-reset", requestPasswordReset);

//reset password
router.post("/customer/reset-password", resetPassword);

module.exports = router;
