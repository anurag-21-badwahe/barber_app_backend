const mongoose = require("mongoose");

const SalonSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    }, // Relation to Owner model
    name: {
      type: String,
      required: [true, "Salon name is required"],
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        default: "India",
      },
      pinCode: {
        type: String,
        required: [true, "Pin Code is required"],
      },
      coordinates: {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
          validate: {
            validator: function (v) {
              return v.length === 2; // Ensure the array has two numbers
            },
            message: "Coordinates should include [longitude, latitude]",
          },
        },
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Invalid phone number format"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      website: {
        type: String,
        match: [/^https?:\/\/.+\..+$/, "Invalid website URL format"],
      },
      socialMedia: {
        instagram: {
          type: String,
          match: [
            /^https?:\/\/(www\.)?instagram\.com\/.+$/,
            "Invalid Instagram URL",
          ],
        },
        youtube : {
          type: String,
          match: [
            /^https?:\/\/(www\.)?youtube\.com\/.+$/,
            "Invalid Youtube URL",
          ],
        },
      },
    },
    typeOfSalon : {
      type: String,
      enum: ["male", "female", "unisex"],
      required: true,
    },
    photos: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length >= 3 && v.length <= 5;
        },
        message: "Photos must contain between 3 and 5 URLs",
      },
      match: [/^https?:\/\/.+\..+$/, "Invalid photo URL format"],
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barber",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Salon = mongoose.model("Salon", SalonSchema);
module.exports = Salon;
