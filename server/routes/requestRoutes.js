const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
  getRecyclerRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validator');

// Community User endpoints
router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/:id', protect, validateIdParam('id'), getRequestById);
router.patch('/:id/cancel', protect, validateIdParam('id'), cancelRequest);

module.exports = router;
