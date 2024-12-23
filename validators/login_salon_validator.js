const { z } = require("zod");

// Define the schema for login
const loginSalonSchema = z.object({
  login: z
    .string()
    .refine((val) => /^[0-9]{10,15}$/.test(val) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: "Login must be a valid phone number (10-15 digits) or a valid email address",
    }),
  password:z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

module.exports = { loginSalonSchema };
