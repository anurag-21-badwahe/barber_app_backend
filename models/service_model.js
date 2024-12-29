const { salonSchema } = require("../validators/register_salon_validator");

const ServiceSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["Hair", "Nails", "Skin", "Massage"],
      required: true,
    },
    description: String,
    popularity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
