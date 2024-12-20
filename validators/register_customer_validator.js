const { z } = require("zod");

// Creating validation schema for Customer model
const registerCustomerSchema = z.object({
  customerName: z.string().min(3, "Customer name is required and must be at least 3 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
    path: ["dateOfBirth"],
  }),
  photo: z.string().url().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

module.exports = registerCustomerSchema;
