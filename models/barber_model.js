const mongoose = require("mongoose");

// Barber Schema as a submodel for the Salon schema
const barberSchema = new mongoose.Schema(
  {
    barberName: {
      type: String,
      required: true,
      trim: true,
    },
    role : {
      type: String,
      default: "Barber",
    },
    phoneNo: {
      type: String,
      required: true,
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
  },
  { _id: false } // Prevents auto-generating an _id for subdocuments
);

module.exports = barberSchema;
