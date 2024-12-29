const mongoose = require('mongoose');


const salonSettingSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true,
    },
    settings: {
        allowOnlineBooking: {
          type: Boolean,
          default: true,
        },
        maxAdvanceBookingDays: {
          type: Number,
          default: 30,
          min: [1, "Advance booking days must be at least 1"],
        },
        cancelationPolicy: {
          type: String,
          trim: true,
        },
        notifications: {
          sms: {
            type: Boolean,
            default: true,
          }
        },
    }
});

const SalonSetting = mongoose.model('SalonSetting', salonSettingSchema);