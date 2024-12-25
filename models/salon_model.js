const mongoose = require("mongoose")
const barberSchema = require('./barber_model')// Import Barber schema

// Define the Salon schema
const salonSchema = new mongoose.Schema(
  {
    salonName: {
      type: String,
      required: true,
      trim: true,
    },
    role : {
      type: String,
      default: "salon",
    },
    salonEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    photo: {
      type: [String], // Changed from String to Array of Strings
      required: true,
    },
    city: { 
      type: String,
      required: true,
    },
    pinCode : {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    barbers: {
      type: [barberSchema], 
      required : true,
      default: []
    },
    verifyCode: {
      type: String,
      default: null, // Optional: For verification codes
    },
    verifyCodeExpiry: {
      type: Date,
      default: null,
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model
const Salon = mongoose.model("Salon", salonSchema);

module.exports = Salon;
