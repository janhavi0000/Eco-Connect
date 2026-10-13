const express = require('express');
const router = express.Router();
const {
  submitSurvey,
  getSurveyAnalytics,
  getSurveyResponses
} = require('../controllers/surveyController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', submitSurvey);
router.get('/analytics', protect, authorize('admin'), getSurveyAnalytics);
router.get('/all', protect, authorize('admin'), getSurveyResponses);

module.exports = router;
