const mongoose = require('mongoose');

const salonRatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRating: {
    type: Number,
    default: 0
  },
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  review: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SalonRating = mongoose.model('SalonRating', salonRatingSchema);

module.exports = SalonRating;