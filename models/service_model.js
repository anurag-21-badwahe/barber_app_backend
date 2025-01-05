const mongoose = require("mongoose");

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

module.exports =  mongoose.model("Service", ServiceSchema);

