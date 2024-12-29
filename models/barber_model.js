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
      enum: ["male", "female", "other", "prefer not to say"],
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
      required: true, // Assuming age is required
    },
    experience: {
      type: Number,
      required: true, // Assuming experience is required in years
    },
    photo: {
      type: String,
      default: null, // Optional: For storing a photo URL (like Cloudinary or S3)
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon", // Reference to the Salon collection
      required: true,
    },
    schedule: {
      monday: { shifts: [{ start: String, end: String }], isOff: Boolean },
      tuesday: { shifts: [{ start: String, end: String }], isOff: Boolean },
      wednesday: { shifts: [{ start: String, end: String }], isOff: Boolean },
      thursday: { shifts: [{ start: String, end: String }], isOff: Boolean },
      friday: { shifts: [{ start: String, end: String }], isOff: Boolean },
      saturday: { shifts: [{ start: String, end: String }], isOff: Boolean },
      sunday: { shifts: [{ start: String, end: String }], isOff: Boolean },
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber;
