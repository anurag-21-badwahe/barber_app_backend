const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon", 
      required: true,
    },
    barberName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "barber",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    phoneNo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    age: {
      type: Number,
      required: false, 
    },
    experience: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required : true,
      default: null, 
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber;
