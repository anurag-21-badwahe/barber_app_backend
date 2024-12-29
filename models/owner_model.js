const mongoose = require("mongoose");

const OwnerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    role: { type: String, default: "owner" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", OwnerSchema);
