const ReviewSchema = new mongoose.Schema({
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
  },
  customerName: { type: String, required: true },
  comment: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
