const { z } = require("zod");

// Creating validation schema for Customer model
const customerSchema = z.object({
  customerName: z
    .string({ required_error: "Customer name is required" })
    .trim()
    .min(2, { message: "Customer name must be at least 2 characters long" })
    .max(50, { message: "Customer name must not exceed 50 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" }),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits",
    }),

  dateOfBirth: z
    .string({ required_error: "Date of birth is required" }) // Accept as ISO string
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),

  role: z
    .string()
    .optional()
    .default("user")
    .refine((value) => ["user", "admin"].includes(value), {
      message: "Invalid role. Allowed roles are 'user' and 'admin'",
    }),

  password: z
    .string({ required_error: "Password is required" })
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(255, { message: "Password must not exceed 255 characters" }),

  password_confirmation: z
    .string({ required_error: "Password confirmation is required" }),
})
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password confirmation must match the password",
    path: ["password_confirmation"], // This is important for pointing errors
  });

module.exports = customerSchema;
