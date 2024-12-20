const { z } = require("zod");

// Define the schema for login
const loginSalonSchema = z.object({
  login: z
    .string()
    .refine((val) => /^[0-9]{10,15}$/.test(val) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: "Login must be a valid phone number (10-15 digits) or a valid email address",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
      message: "Password must contain at least one letter and one number",
    }),
});

module.exports = { loginSalonSchema };
