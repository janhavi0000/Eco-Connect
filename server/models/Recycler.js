const mongoose = require('mongoose');

const recyclerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Official address is required'],
      trim: true
    },
    latitude: {
      type: Number,
      default: 28.6139
    },
    longitude: {
      type: Number,
      default: 77.2090
    },
    serviceAreas: {
      type: [String],
      default: ['Campus Area', 'Metro Core', 'Green Valley District']
    },
    supportedCategories: {
      type: [String],
      required: [true, 'At least one supported e-waste category is required'],
      default: [
        'Mobile Phones',
        'Chargers / Cables',
        'Batteries',
        'Laptops / Computers',
        'Keyboards',
        'Earphones / Headphones',
        'Tablets',
        'Monitors',
        'Other Electronic Devices'
      ]
    },
    description: {
      type: String,
      default: 'Authorized community e-waste collection and certified recycling partner.'
    },
    pickupSpots: [
      {
        name: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, default: 28.6139 },
        longitude: { type: Number, default: 77.2090 }
      }
    ],
    availability: {
      days: {
        type: [String],
        default: ['Monday', 'Wednesday', 'Friday', 'Saturday']
      },
      timeSlots: {
        type: [String],
        default: ['09:00 - 11:00 AM', '11:00 - 01:00 PM', '02:00 - 04:00 PM', '04:00 - 06:00 PM']
      }
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    verifiedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
recyclerSchema.index({ verificationStatus: 1 });
recyclerSchema.index({ organizationName: 'text', address: 'text' });

module.exports = mongoose.model('Recycler', recyclerSchema);
