import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
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
    photo: {
      type: String,
      default: null, // Can store Cloudinary or S3 URL
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
      default: null, // Optional field for email/phone verification code
    },
    verifyCodeExpiry: {
      type: Date,
      default: null, // Optional field for expiry time
    },
    resetPasswordCode: {
      type: String,
      default: null, // Optional field for password reset
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
