const mongoose = require('mongoose');

const bookedSlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    bookedCount: { type: Number, default: 1 }
  },
  { _id: false }
);

const pickupSpotSchema = new mongoose.Schema(
  {
    recyclerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recycler',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Pickup spot name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Pickup spot address is required'],
      trim: true
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      default: 28.6139
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      default: 77.2090
    },
    availableDates: {
      type: [String],
      default: []
    },
    availableTimeSlots: {
      type: [String],
      default: ['09:00 - 11:00 AM', '11:00 - 01:00 PM', '02:00 - 04:00 PM', '04:00 - 06:00 PM']
    },
    slotCapacity: {
      type: Number,
      default: 5
    },
    bookedSlots: [bookedSlotSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    instructions: {
      type: String,
      default: 'Drop off near the designated green EcoConnect collection kiosk.'
    }
  },
  {
    timestamps: true
  }
);

pickupSpotSchema.index({ recyclerId: 1 });
pickupSpotSchema.index({ isActive: 1 });

module.exports = mongoose.model('PickupSpot', pickupSpotSchema);
