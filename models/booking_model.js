const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },
    customerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    appointmentTime: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "InProgress",
        "Completed",
        "Cancelled",
        "NoShow",
      ],
      default: "Pending",
    },
    stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Barber" },
    notes: String,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
