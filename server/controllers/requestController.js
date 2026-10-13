const EWasteRequest = require('../models/EWasteRequest');
const Recycler = require('../models/Recycler');
const PickupSpot = require('../models/PickupSpot');
const CollectionRecord = require('../models/CollectionRecord');
const User = require('../models/User');

// @desc    Submit a new e-waste collection request
// @route   POST /api/requests
// @access  Private (Community User)
const createRequest = async (req, res, next) => {
  try {
    const {
      items,
      recyclerId,
      preferredDisposalMethod,
      pickupMethod,
      pickupLocation,
      preferredDate,
      preferredTime,
      selectedPickupSpotId,
      notes
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one e-waste item is required for collection.'
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.category || !item.itemType || !item.quantity || Number(item.quantity) < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a category, item type, and quantity of at least 1.'
        });
      }
    }

    if (!pickupLocation || !pickupLocation.address) {
      return res.status(400).json({
        success: false,
        message: 'A pickup location address is required.'
      });
    }

    if (!preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Preferred pickup date and time slot are required.'
      });
    }

    // Check recycler exists & is verified
    let assignedRecycler = null;
    if (recyclerId) {
      assignedRecycler = await Recycler.findById(recyclerId);
      if (!assignedRecycler) {
        return res.status(404).json({
          success: false,
          message: 'Selected recycler not found.'
        });
      }
      if (assignedRecycler.verificationStatus !== 'VERIFIED') {
        return res.status(400).json({
          success: false,
          message: 'Selected recycler is not yet verified. Please choose a verified partner.'
        });
      }
    }

    // Handle pickup spot and slot capacity validation
    let selectedPickupSpotData = null;
    if (pickupMethod === 'Nearby Pickup Point' && selectedPickupSpotId) {
      const spot = await PickupSpot.findById(selectedPickupSpotId);
      if (!spot || !spot.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Selected pickup spot is currently inactive or not found.'
        });
      }

      // Check slot capacity
      const bookedEntry = spot.bookedSlots.find(
        (b) => b.date === preferredDate && b.timeSlot === preferredTime
      );

      if (bookedEntry && bookedEntry.bookedCount >= spot.slotCapacity) {
        return res.status(400).json({
          success: false,
          message: `The selected time slot (${preferredTime}) on ${preferredDate} is fully booked. Please select another slot.`
        });
      }

      // Record slot booking to prevent double/over-booking
      if (bookedEntry) {
        bookedEntry.bookedCount += 1;
      } else {
        spot.bookedSlots.push({
          date: preferredDate,
          timeSlot: preferredTime,
          bookedCount: 1
        });
      }
      await spot.save();

      selectedPickupSpotData = {
        name: spot.name,
        address: spot.address,
        latitude: spot.latitude,
        longitude: spot.longitude
      };
    }

    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity), 0);
    const estimatedWeight = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);

    const initialStatusHistory = [
      {
        status: 'PENDING',
        timestamp: new Date(),
        note: 'Collection request registered by community user.',
        changedBy: req.user._id
      }
    ];

    const newRequest = await EWasteRequest.create({
      userId: req.user._id,
      recyclerId: assignedRecycler ? assignedRecycler._id : undefined,
      items,
      totalQuantity,
      estimatedWeight,
      preferredDisposalMethod: preferredDisposalMethod || 'Eco Recycling',
      pickupMethod: pickupMethod || 'Doorstep Pickup',
      pickupLocation: {
        address: pickupLocation.address,
        latitude: pickupLocation.latitude || 28.6139,
        longitude: pickupLocation.longitude || 77.2090
      },
      preferredDate,
      preferredTime,
      selectedPickupSpot: selectedPickupSpotData,
      status: 'PENDING',
      statusHistory: initialStatusHistory,
      collectorNotes: notes || ''
    });

    const populatedRequest = await EWasteRequest.findById(newRequest._id)
      .populate('userId', 'name email phone')
      .populate('recyclerId', 'organizationName contactPerson phone email');

    res.status(201).json({
      success: true,
      message: 'Collection request created successfully.',
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests submitted by the logged in user
// @route   GET /api/requests/my
// @access  Private (User)
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await EWasteRequest.find({ userId: req.user._id })
      .populate('recyclerId', 'organizationName contactPerson phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request details by ID
// @route   GET /api/requests/:id
// @access  Private (Owner, Assigned Recycler, or Admin)
const getRequestById = async (req, res, next) => {
  try {
    const request = await EWasteRequest.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('recyclerId', 'organizationName contactPerson phone email address serviceAreas supportedCategories');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found.'
      });
    }

    // Access control
    if (req.user.role === 'user' && request.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your own collection requests.'
      });
    }

    if (req.user.role === 'recycler') {
      const recycler = await Recycler.findOne({ userId: req.user._id });
      if (!recycler || (request.recyclerId && request.recyclerId._id.toString() !== recycler._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only view requests assigned to your organization.'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a request (Community User)
// @route   PATCH /api/requests/:id/cancel
// @access  Private (Owner only)
const cancelRequest = async (req, res, next) => {
  try {
    const request = await EWasteRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found.'
      });
    }

    if (request.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own requests.'
      });
    }

    if (['COLLECTED', 'CANCELLED', 'REJECTED'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${request.status.toLowerCase()}.`
      });
    }

    const { reason = 'Cancelled by user' } = req.body;

    request.status = 'CANCELLED';
    request.cancellationReason = reason;
    request.statusHistory.push({
      status: 'CANCELLED',
      timestamp: new Date(),
      note: reason,
      changedBy: req.user._id
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Collection request has been cancelled.',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests assigned to current logged in recycler
// @route   GET /api/recycler/requests
// @access  Private (Recycler only)
const getRecyclerRequests = async (req, res, next) => {
  try {
    const recycler = await Recycler.findOne({ userId: req.user._id });
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'No recycler profile registered for your account.'
      });
    }

    const { status } = req.query;
    const query = { recyclerId: recycler._id };

    if (status) {
      query.status = status;
    }

    const requests = await EWasteRequest.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status by recycler (Accept, Schedule, Mark Collected, Reject)
// @route   PATCH /api/recycler/requests/:id/status
// @access  Private (Recycler / Admin)
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, note, scheduledDate, scheduledTime } = req.body;
    const validStatuses = ['ACCEPTED', 'SCHEDULED', 'COLLECTED', 'REJECTED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = await EWasteRequest.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('recyclerId', 'organizationName contactPerson phone email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found.'
      });
    }

    // Recycler authorization check
    if (req.user.role === 'recycler') {
      const recycler = await Recycler.findOne({ userId: req.user._id });
      if (!recycler || request.recyclerId?._id.toString() !== recycler._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: This request is not assigned to your recycler organization.'
        });
      }
    }

    if (request.status === 'COLLECTED') {
      return res.status(400).json({
        success: false,
        message: 'Request is already marked as collected. Status cannot be modified.'
      });
    }

    // Apply updates
    request.status = status;
    if (scheduledDate) request.preferredDate = scheduledDate;
    if (scheduledTime) request.preferredTime = scheduledTime;

    let defaultNote = `Status changed to ${status}`;
    if (status === 'ACCEPTED') defaultNote = 'Collection request accepted by recycler partner.';
    if (status === 'SCHEDULED') defaultNote = `Pickup confirmed for ${request.preferredDate} (${request.preferredTime}).`;
    if (status === 'COLLECTED') defaultNote = 'E-waste collected and transported for responsible recycling.';
    if (status === 'REJECTED') defaultNote = note || 'Request could not be accommodated at this time.';

    request.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || defaultNote,
      changedBy: req.user._id
    });

    if (status === 'COLLECTED') {
      request.collectedAt = new Date();

      // Create permanent CollectionRecord
      await CollectionRecord.create({
        requestId: request._id,
        userId: request.userId._id,
        recyclerId: request.recyclerId._id,
        userName: request.userId.name,
        recyclerName: request.recyclerId.organizationName,
        items: request.items.map((i) => ({
          category: i.category,
          itemType: i.itemType,
          quantity: i.quantity,
          weight: i.weight,
          condition: i.condition
        })),
        primaryCategory: request.items[0]?.category || 'Other Electronic Devices',
        totalQuantity: request.totalQuantity,
        totalWeight: request.estimatedWeight,
        pickupLocation: request.pickupLocation,
        collectionDate: new Date(),
        status: 'COLLECTED',
        requestCreatedAt: request.createdAt,
        completedAt: new Date()
      });
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status} successfully.`,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
  getRecyclerRequests,
  updateRequestStatus
};
