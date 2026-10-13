const PickupSpot = require('../models/PickupSpot');
const Recycler = require('../models/Recycler');

// @desc    Get all active pickup spots (optionally filter by recyclerId)
// @route   GET /api/pickup-spots
// @access  Public
const getPickupSpots = async (req, res, next) => {
  try {
    const { recyclerId, activeOnly } = req.query;
    const filter = {};

    if (recyclerId) {
      filter.recyclerId = recyclerId;
    }

    if (activeOnly !== 'false') {
      filter.isActive = true;
    }

    const spots = await PickupSpot.find(filter)
      .populate('recyclerId', 'organizationName contactPerson phone verificationStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: spots.length,
      data: spots
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pickup spot by ID
// @route   GET /api/pickup-spots/:id
// @access  Public
const getPickupSpotById = async (req, res, next) => {
  try {
    const spot = await PickupSpot.findById(req.params.id).populate(
      'recyclerId',
      'organizationName contactPerson phone email verificationStatus'
    );

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Pickup spot not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: spot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new pickup spot
// @route   POST /api/pickup-spots
// @access  Private (Recycler / Admin)
const createPickupSpot = async (req, res, next) => {
  try {
    let recyclerId = req.body.recyclerId;

    if (req.user.role === 'recycler') {
      const recycler = await Recycler.findOne({ userId: req.user._id });
      if (!recycler) {
        return res.status(404).json({
          success: false,
          message: 'No recycler profile found for your account.'
        });
      }
      recyclerId = recycler._id;
    }

    if (!recyclerId) {
      return res.status(400).json({
        success: false,
        message: 'Recycler ID is required to create a pickup spot.'
      });
    }

    const {
      name,
      address,
      latitude,
      longitude,
      availableDates,
      availableTimeSlots,
      slotCapacity,
      instructions
    } = req.body;

    const newSpot = await PickupSpot.create({
      recyclerId,
      name,
      address,
      latitude: latitude || 28.6139,
      longitude: longitude || 77.2090,
      availableDates: availableDates || [],
      availableTimeSlots: availableTimeSlots || [
        '09:00 - 11:00 AM',
        '11:00 - 01:00 PM',
        '02:00 - 04:00 PM',
        '04:00 - 06:00 PM'
      ],
      slotCapacity: slotCapacity || 5,
      instructions: instructions || 'Drop off near the designated green EcoConnect collection kiosk.'
    });

    res.status(201).json({
      success: true,
      message: 'Pickup spot created successfully.',
      data: newSpot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing pickup spot
// @route   PATCH /api/pickup-spots/:id
// @access  Private (Recycler / Admin)
const updatePickupSpot = async (req, res, next) => {
  try {
    const spot = await PickupSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Pickup spot not found.'
      });
    }

    // Permission check
    if (req.user.role === 'recycler') {
      const recycler = await Recycler.findOne({ userId: req.user._id });
      if (!recycler || spot.recyclerId.toString() !== recycler._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this pickup spot.'
        });
      }
    }

    const {
      name,
      address,
      latitude,
      longitude,
      availableDates,
      availableTimeSlots,
      slotCapacity,
      isActive,
      instructions
    } = req.body;

    if (name) spot.name = name;
    if (address) spot.address = address;
    if (latitude !== undefined) spot.latitude = latitude;
    if (longitude !== undefined) spot.longitude = longitude;
    if (availableDates) spot.availableDates = availableDates;
    if (availableTimeSlots) spot.availableTimeSlots = availableTimeSlots;
    if (slotCapacity !== undefined) spot.slotCapacity = slotCapacity;
    if (isActive !== undefined) spot.isActive = isActive;
    if (instructions) spot.instructions = instructions;

    await spot.save();

    res.status(200).json({
      success: true,
      message: 'Pickup spot updated successfully.',
      data: spot
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pickup spot
// @route   DELETE /api/pickup-spots/:id
// @access  Private (Recycler / Admin)
const deletePickupSpot = async (req, res, next) => {
  try {
    const spot = await PickupSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({
        success: false,
        message: 'Pickup spot not found.'
      });
    }

    if (req.user.role === 'recycler') {
      const recycler = await Recycler.findOne({ userId: req.user._id });
      if (!recycler || spot.recyclerId.toString() !== recycler._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to delete this pickup spot.'
        });
      }
    }

    await spot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pickup spot removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPickupSpots,
  getPickupSpotById,
  createPickupSpot,
  updatePickupSpot,
  deletePickupSpot
};
