const {z} = require("zod"); 

// Zod schema to validate individual barber 
// 
const barberValidator = z.object({
  barberName: z.string().min(1, "Barber name is required."),
  age: z.number().min(12, "Age must be 12 or older."),
  experience: z.number().refine(
    (val, ctx) => val <= ctx.parent.age - 12,
    {
      message: "Experience cannot be greater than age minus 12.",
    }
  ),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be 'male' or 'female'." }),
  }),
  phoneNo: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits."),
  photo: z.string().min(1, "Photo is required."),
});

module.exports = barberValidator;

