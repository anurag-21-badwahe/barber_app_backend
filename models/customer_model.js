const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    age: {
      type: Number, // Storing age
      required: false,
    },
    city : {
      type: String,
      required: true,
    },
    pinCode : {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    verifyCode: {
      type: String,
      default: null,
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
    timestamps: true,
  }
);

// Middleware to calculate age before saving
customerSchema.pre("save", function (next) {
  if (this.dateOfBirth) {
    const ageDifMs = Date.now() - this.dateOfBirth.getTime();
    const ageDate = new Date(ageDifMs);
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  next();
});

// Export the model
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
