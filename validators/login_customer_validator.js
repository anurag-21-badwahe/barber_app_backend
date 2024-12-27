const { z } = require("zod");

const loginCustomerSchema = z.object({
  login: z.string().min(1, "Login is required"), // Ensure login is a non-empty string
  password: z.string().min(8, "Password must be at least 8 characters long") // Ensure password is at least 8 characters long
});

module.exports = loginCustomerSchema;