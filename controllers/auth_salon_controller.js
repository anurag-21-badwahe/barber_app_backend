const Salon = require("../models/Salon");
const { generateToken } = require("../utils/generateToken");
const { comparePassword } = require("../utils/bcryptUtils");
const { validateLogin } = require("../validators/register_salon_validator");
const { registerCustomer } = require("./auth_customer_controller");

const loginSalon = async (req, res) => {
  try {
    // Validate input with Zod
    const { email, password } = validateLogin(req.body);

    // Find salon by email
    const salon = await Salon.findOne({ salonEmail: email });
    if (!salon) {
      return res.status(404).json({ error: "Salon not found" });
    }

    // Check password
    const isMatch = await comparePassword(password, salon.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken({ id: salon._id, userType: "salon" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const registerCustomer = async (req, res) => {
  console.log("Hello");
};

module.exports = {loginSalon, registerCustomer };
