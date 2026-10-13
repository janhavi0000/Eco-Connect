const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    respondentName: {
      type: String,
      default: 'Anonymous Community Member'
    },
    q1_awareness: {
      type: String,
      required: true,
      enum: ['Yes', 'No', 'Somewhat']
    },
    q2_hasUnusedItems: {
      type: String,
      required: true,
      enum: ['Yes', 'No']
    },
    q3_itemTypes: {
      type: [String],
      required: true
    },
    q4_currentPractice: {
      type: String,
      required: true
    },
    q5_knowsRecycler: {
      type: String,
      required: true,
      enum: ['Yes', 'No']
    },
    q6_mainDifficulty: {
      type: String,
      required: true
    },
    q7_preferredMethod: {
      type: String,
      required: true
    },
    q8_wouldUsePlatform: {
      type: String,
      required: true,
      enum: ['Yes', 'No', 'Maybe']
    },
    q9_usefulFeatures: {
      type: [String],
      required: true
    },
    q10_willingToParticipate: {
      type: String,
      required: true,
      enum: ['Yes', 'No', 'Maybe']
    },
    comments: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
