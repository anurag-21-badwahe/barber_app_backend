import mongoose from "mongoose";

// we are using this schema as the sub model for salon schema
// Barber Schema
const barberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
  },
  { _id: false } // Prevents auto-generating an _id for subdocuments
);

export default barberSchema;
