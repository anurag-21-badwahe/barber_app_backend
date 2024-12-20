const z = require('zod');

const salonSchema = z.object({
  salonName: z.string().min(3),
  salonEmail: z.string().email(),
  password: z.string().min(6),
  phoneNo: z.string().min(10).max(15),
  barbers: z.array(z.object({
    barberName: z.string(),
    phoneNo: z.string(),
    status: z.enum(['available', 'unavailable']),
    age: z.number().min(18),
    experience: z.number(),
  })),
});

module.exports = { salonSchema };  // Ensure it is being exported correctly
