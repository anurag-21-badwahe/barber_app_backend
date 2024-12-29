const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema(
  {
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
      required: false, // Assuming age is required
    },
    experience: {
      type: Number,
      required: true, // Assuming experience is required in years
    },
    photo: {
      type: String,
      required : true,
      default: null, // Optional: For storing a photo URL (like Cloudinary or S3)
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon", // Reference to the Salon collection
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber;
