const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    phoneNo: { type: String, required: true, unique: true },
    isPhoneVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    role: { type: String, default: "owner" },

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
    resetPasswordCodeExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", OwnerSchema);
