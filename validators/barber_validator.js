const { z } = require("zod");

const barberSchema = z.object({
  name: z
    .string({ required_error: "Barber name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),

  phoneNo: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits",
    }),

  status: z
    .enum(["available", "unavailable"])
    .optional()
    .default("available"), // Defaults to "available" if not provided
});

module.exports = barberSchema;
