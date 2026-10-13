const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getAdminRecyclers,
  verifyRecycler,
  getAllRequests,
  getCollectionRecords,
  getAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validator');

// Stats is accessible publicly for landing page counters, with full details for admin
router.get('/stats', getStats);

// Protected admin endpoints
router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/recyclers', getAdminRecyclers);
router.patch('/recyclers/:id/verify', validateIdParam('id'), verifyRecycler);
router.get('/requests', getAllRequests);
router.get('/records', getCollectionRecords);
router.get('/analytics', getAnalytics);

module.exports = router;
