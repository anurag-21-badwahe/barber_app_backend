const { z } = require("zod");

// Helper functions for validation
const isValidEmail = (value) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
};

const isValidPhone = (value) => {
  return /^[0-9]{10}$/.test(value);  // Limited to 10 digits for better accuracy
};

// Password validation schema
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Login credentials schema with refined validation
const loginOwnerValidator = z.object({
  login: z
    .string()
    .min(1, { message: "Login credential is required." })
    .transform((val) => val.trim())  // No automatic lowercase to avoid issues with case-sensitive emails
    .refine((val) => isValidEmail(val) || isValidPhone(val), {
      message: "Please enter a valid email or phone number.",
    }),
  password: passwordSchema
});

module.exports = loginOwnerValidator;
