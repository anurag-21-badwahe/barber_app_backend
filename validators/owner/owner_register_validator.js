const { z } = require("zod");

const registerOwnerValidator = z.object({
  fullname: z
    .string()
    .min(2, "Fullname must be at least 2 characters long")
    .max(50, "Fullname must not exceed 50 characters"),
  email: z
    .string()
    .email("Invalid email format"),
  phoneNo: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
});

module.exports = registerOwnerValidator;
