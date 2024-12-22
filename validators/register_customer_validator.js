const { z } = require("zod");

// Creating validation schema for Customer model
const registerCustomerSchema = z.object({
  customerName: z.string().min(3, "Customer name is required and must be at least 3 characters"),
  phoneNumber: z.string().regex(/^\+91\d{10}$/, "Invalid phone number, must start with +91 followed by 10 digits"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
    path: ["dateOfBirth"],
  }),
  gender: z.enum(["male", "female", "other", "prefer not to say"], {
    errorMap: () => ({ message: "Invalid gender" }),  // Custom error message
  }),
  photo: z.string().url().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

module.exports = registerCustomerSchema;
