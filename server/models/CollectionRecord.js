const mongoose = require('mongoose');

const collectionRecordSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EWasteRequest',
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recyclerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recycler',
      required: true
    },
    userName: {
      type: String
    },
    recyclerName: {
      type: String
    },
    items: [
      {
        category: String,
        itemType: String,
        quantity: Number,
        weight: Number,
        condition: String
      }
    ],
    primaryCategory: {
      type: String
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 1
    },
    totalWeight: {
      type: Number,
      default: 0
    },
    pickupLocation: {
      address: String,
      latitude: Number,
      longitude: Number
    },
    collectionDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'COLLECTED'
    },
    requestCreatedAt: {
      type: Date
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

collectionRecordSchema.index({ collectionDate: -1 });
collectionRecordSchema.index({ primaryCategory: 1 });
collectionRecordSchema.index({ recyclerId: 1 });
collectionRecordSchema.index({ userId: 1 });

module.exports = mongoose.model('CollectionRecord', collectionRecordSchema);
