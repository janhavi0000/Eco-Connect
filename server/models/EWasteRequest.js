const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'E-waste category is required'],
      enum: [
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
    itemType: {
      type: String,
      required: [true, 'Item type/model is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    weight: {
      type: Number, // in kg, optional
      default: 0
    },
    condition: {
      type: String,
      enum: ['Working', 'Partially Working', 'Dead / Damaged', 'Scrap / Unusable'],
      default: 'Dead / Damaged'
    },
    description: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'ACCEPTED', 'SCHEDULED', 'COLLECTED', 'REJECTED', 'CANCELLED']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      default: ''
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { _id: false }
);

const eWasteRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recyclerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recycler'
    },
    items: {
      type: [itemSchema],
      validate: [
        (val) => val.length > 0,
        'At least one e-waste item must be registered in the request'
      ]
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 1
    },
    estimatedWeight: {
      type: Number,
      default: 0
    },
    preferredDisposalMethod: {
      type: String,
      enum: ['Eco Recycling', 'Refurbishment / Reuse', 'Safe Scrapping'],
      default: 'Eco Recycling'
    },
    pickupMethod: {
      type: String,
      enum: ['Doorstep Pickup', 'Nearby Pickup Point', 'Community Collection Drive'],
      default: 'Doorstep Pickup'
    },
    pickupLocation: {
      address: {
        type: String,
        required: [true, 'Pickup location address is required']
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
      }
    },
    preferredDate: {
      type: String,
      required: [true, 'Preferred pickup date is required']
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred pickup time slot is required']
    },
    selectedPickupSpot: {
      name: String,
      address: String,
      latitude: Number,
      longitude: Number
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'SCHEDULED', 'COLLECTED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING'
    },
    statusHistory: [statusHistorySchema],
    cancellationReason: {
      type: String
    },
    collectorNotes: {
      type: String
    },
    collectedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
eWasteRequestSchema.index({ userId: 1, createdAt: -1 });
eWasteRequestSchema.index({ recyclerId: 1, status: 1 });
eWasteRequestSchema.index({ status: 1 });

module.exports = mongoose.model('EWasteRequest', eWasteRequestSchema);
