const { z } = require('zod');

// Assuming you have a barbers schema somewhere else
// const barberSchema = require('./barberSchema'); // Example import if needed

const salonSchema = z.object({
  salonName: z
    .string({ required_error: "Salon name is required" })
    .trim()
    .min(3, { message: "Salon name must be at least 3 characters long" })
    .max(100, { message: "Salon name must not exceed 100 characters" }),

  salonEmail: z
    .string({ required_error: "Salon email is required" })
    .trim()
    .email({ message: "Invalid email address" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(5, { message: "Password must be at least 5 characters long" })
    .max(255, { message: "Password must not exceed 255 characters" }),

  role: z
    .string()
    .optional()
    .default("salon")
    .refine((value) => value === "salon", {
      message: "Role must be 'salon'",
    }),

  phoneNo: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits",
    }),

  photo: z
    .string()
    .url({ message: "Photo must be a valid URL" })
    .optional(),

  isVerified: z.boolean().default(false), // Default to false if not provided

  barbers: z
    .array(z.object({
      // Example schema for barbers; this should match the actual barber schema structure
      name: z.string(),
      specialization: z.string().optional(),
    }))
    .optional()
    .default([]), // Default to an empty array if not provided

  verifyCode: z
    .string()
    .optional()
    .nullable(), // Accept null or undefined for optional fields

  verifyCodeExpiry: z
    .string()
    .optional()
    .nullable()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date format for verifyCodeExpiry",
    }),

  resetPasswordCode: z.string().optional().nullable(),
});

module.exports = salonSchema;
