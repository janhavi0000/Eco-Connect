const express = require('express');
const router = express.Router();
const {
  getPickupSpots,
  getPickupSpotById,
  createPickupSpot,
  updatePickupSpot,
  deletePickupSpot
} = require('../controllers/pickupSpotController');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validator');

router.get('/', getPickupSpots);
router.get('/:id', validateIdParam('id'), getPickupSpotById);
router.post('/', protect, authorize('recycler', 'admin'), createPickupSpot);
router.patch('/:id', protect, authorize('recycler', 'admin'), validateIdParam('id'), updatePickupSpot);
router.delete('/:id', protect, authorize('recycler', 'admin'), validateIdParam('id'), deletePickupSpot);

module.exports = router;
