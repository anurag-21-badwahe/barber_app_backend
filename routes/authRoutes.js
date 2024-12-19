const express = require("express");
const router = express.Router();
const {loginCustomer} = require('../controllers/auth_customer_controller');
const {registerCustomer} = require('../controllers/auth_customer_controller');
const {loginSalon} = require('../controllers/auth_salon_controller');
const {registerSalon} = require('../controllers/auth_salon_controller');



// Customer Register
router.post("/customer/register",registerCustomer);

// Customer Login
router.post("/customer/login", loginCustomer);

// Salon Login
router.post("/salon/login", loginSalon);

// Salon Register
router.post("/salon/register",registerSalon);

module.exports = router;
