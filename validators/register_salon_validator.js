const { z } = require("zod");

const barberSchema = z.object({
  barberName: z.string().min(1, { message: "Barber name is required." }),
  role: z.string().default("barber"),
  phoneNo: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must not exceed 15 digits." })
    .optional(),
  gender: z.enum(["male", "female", "other", "prefer not to say"], {
    message: "Gender must be one of 'male', 'female', 'other', or 'prefer not to say'.",
  }),
  status: z.enum(["available", "unavailable"], {
    message: "Status must be 'available' or 'unavailable'.",
  }),
  age: z.number().min(18, { message: "Age must be at least 18." }),
  experience: z
    .number()
    .nonnegative({ message: "Experience must be a non-negative number." }),
  photo: z.string().url().optional(),
});

const salonSchema = z.object({
  salonName: z.string().min(1, { message: "Salon name is required." }),
  salonEmail: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  phoneNo: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must not exceed 15 digits." }),
  city: z.string().min(1, { message: "City is required." }),
  pinCode : z.string().min(6, { message: "Pin code must be at least 6 characters." }),
  barbers: z.array(barberSchema).optional(),
});

module.exports = {
  salonSchema,
};