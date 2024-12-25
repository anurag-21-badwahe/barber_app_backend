const { z } = require("zod");

// Creating validation schema for Customer model
const registerCustomerSchema = z
  .object({
    customerName: z
      .string()
      .min(3, "Customer name is required and must be at least 3 characters"),
    phoneNumber: z
      .string()
      .regex(
        /^\+91\d{10}$/,
        "Invalid phone number, must start with +91 followed by 10 digits"
      ),
    email: z.string().email("Invalid email address"),
    dateOfBirth: z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format",
      path: ["dateOfBirth"],
    }),
    gender: z.enum(["male", "female", "other", "prefer not to say"], {
      errorMap: () => ({ message: "Invalid gender" }), // Custom error message
    }),
    photo: z.string().url().optional(),
    city: z.string().nonempty("City cannot be empty"),
    pinCode : z.string().min(6, "Pin code must be at least 6 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    password_confirmation: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

module.exports = registerCustomerSchema;
