const {z} =  require('zod');

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
      .array(barberSchema)
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