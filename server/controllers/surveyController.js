const SurveyResponse = require('../models/SurveyResponse');

// @desc    Submit a community survey response
// @route   POST /api/survey
// @access  Public (Optionally authenticated)
const submitSurvey = async (req, res, next) => {
  try {
    const {
      respondentName,
      q1_awareness,
      q2_hasUnusedItems,
      q3_itemTypes,
      q4_currentPractice,
      q5_knowsRecycler,
      q6_mainDifficulty,
      q7_preferredMethod,
      q8_wouldUsePlatform,
      q9_usefulFeatures,
      q10_willingToParticipate,
      comments
    } = req.body;

    if (
      !q1_awareness ||
      !q2_hasUnusedItems ||
      !q3_itemTypes ||
      !q4_currentPractice ||
      !q5_knowsRecycler ||
      !q6_mainDifficulty ||
      !q7_preferredMethod ||
      !q8_wouldUsePlatform ||
      !q9_usefulFeatures ||
      !q10_willingToParticipate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please answer all 10 survey questions before submitting.'
      });
    }

    const survey = await SurveyResponse.create({
      userId: req.user ? req.user._id : undefined,
      respondentName: respondentName || (req.user ? req.user.name : 'Community Resident'),
      q1_awareness,
      q2_hasUnusedItems,
      q3_itemTypes: Array.isArray(q3_itemTypes) ? q3_itemTypes : [q3_itemTypes],
      q4_currentPractice,
      q5_knowsRecycler,
      q6_mainDifficulty,
      q7_preferredMethod,
      q8_wouldUsePlatform,
      q9_usefulFeatures: Array.isArray(q9_usefulFeatures) ? q9_usefulFeatures : [q9_usefulFeatures],
      q10_willingToParticipate,
      comments: comments || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your survey responses have been recorded to help build a cleaner community.',
      data: survey
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get survey analytics for admin insights
// @route   GET /api/admin/survey/analytics
// @access  Private (Admin only)
const getSurveyAnalytics = async (req, res, next) => {
  try {
    const totalResponses = await SurveyResponse.countDocuments();

    if (totalResponses === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalResponses: 0,
          awareness: [],
          difficulties: [],
          preferredMethods: [],
          platformWillingness: [],
          participationWillingness: [],
          commonItemTypes: []
        }
      });
    }

    // 1. Q1 Awareness
    const awarenessAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$q1_awareness', count: { $sum: 1 } } }
    ]);

    // 2. Q6 Difficulties
    const difficultyAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$q6_mainDifficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 3. Q7 Preferred Method
    const methodAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$q7_preferredMethod', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 4. Q8 Platform Willingness
    const platformAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$q8_wouldUsePlatform', count: { $sum: 1 } } }
    ]);

    // 5. Q10 Participation
    const participationAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$q10_willingToParticipate', count: { $sum: 1 } } }
    ]);

    // 6. Q3 Common Item Types
    const itemsAgg = await SurveyResponse.aggregate([
      { $unwind: '$q3_itemTypes' },
      { $group: { _id: '$q3_itemTypes', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalResponses,
        awareness: awarenessAgg.map((a) => ({ label: a._id, count: a.count })),
        difficulties: difficultyAgg.map((d) => ({ label: d._id, count: d.count })),
        preferredMethods: methodAgg.map((m) => ({ label: m._id, count: m.count })),
        platformWillingness: platformAgg.map((p) => ({ label: p._id, count: p.count })),
        participationWillingness: participationAgg.map((w) => ({ label: w._id, count: w.count })),
        commonItemTypes: itemsAgg.map((i) => ({ label: i._id, count: i.count }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all survey responses list
// @route   GET /api/survey/all
// @access  Private (Admin only)
const getSurveyResponses = async (req, res, next) => {
  try {
    const responses = await SurveyResponse.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSurvey,
  getSurveyAnalytics,
  getSurveyResponses
};
