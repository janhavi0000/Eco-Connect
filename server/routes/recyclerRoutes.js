const express = require('express');
const router = express.Router();
const {
  registerRecyclerProfile,
  getRecyclers,
  getRecyclerById,
  getMyRecyclerProfile,
  updateAvailability
} = require('../controllers/recyclerController');
const {
  getRecyclerRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validator');

// Recycler profile management & directory
router.post('/register', protect, registerRecyclerProfile);
router.get('/', getRecyclers);
router.get('/profile/me', protect, authorize('recycler'), getMyRecyclerProfile);
router.get('/:id', validateIdParam('id'), getRecyclerById);
router.patch('/:id/availability', protect, validateIdParam('id'), updateAvailability);

// Recycler specific collection requests
router.get('/requests', protect, authorize('recycler', 'admin'), getRecyclerRequests);
router.get('/requests/all', protect, authorize('recycler', 'admin'), getRecyclerRequests);
router.patch('/requests/:id/status', protect, authorize('recycler', 'admin'), validateIdParam('id'), updateRequestStatus);

module.exports = router;
