const mongoose = require("mongoose");

const operationalHoursSchema = new mongoose.Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    monday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: false },
    },
    tuesday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: false },
    },
    wednesday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: false },
    },
    thursday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: false },
    },
    friday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: false },
    },
    saturday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: false },
    },
    sunday: {
        shifts: [{ start: String, end: String }],
        isClosed: { type: Boolean, default: true },
    }
});

module.exports = mongoose.model("OperationalHours", operationalHoursSchema);
