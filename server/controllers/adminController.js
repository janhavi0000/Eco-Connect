const User = require('../models/User');
const Recycler = require('../models/Recycler');
const EWasteRequest = require('../models/EWasteRequest');
const CollectionRecord = require('../models/CollectionRecord');
const PickupSpot = require('../models/PickupSpot');

// @desc    Get system-wide overview statistics for Admin Dashboard & Landing Page
// @route   GET /api/admin/stats
// @access  Public (for basic counts) / Admin
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRecyclers = await Recycler.countDocuments();
    const verifiedRecyclers = await Recycler.countDocuments({ verificationStatus: 'VERIFIED' });
    const pendingRecyclers = await Recycler.countDocuments({ verificationStatus: 'PENDING' });

    const totalRequests = await EWasteRequest.countDocuments();
    const pendingRequests = await EWasteRequest.countDocuments({ status: 'PENDING' });
    const acceptedRequests = await EWasteRequest.countDocuments({ status: 'ACCEPTED' });
    const scheduledRequests = await EWasteRequest.countDocuments({ status: 'SCHEDULED' });
    const collectedRequests = await EWasteRequest.countDocuments({ status: 'COLLECTED' });

    const totalRecords = await CollectionRecord.countDocuments();

    // Calculate aggregated collected quantity and weight from CollectionRecord
    const collectedAgg = await CollectionRecord.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$totalQuantity' },
          totalWeight: { $sum: '$totalWeight' }
        }
      }
    ]);

    const totalQuantityCollected = collectedAgg[0]?.totalQuantity || 0;
    const totalWeightCollected = Math.round((collectedAgg[0]?.totalWeight || 0) * 10) / 10;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRecyclers,
        verifiedRecyclers,
        pendingRecyclers,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        scheduledRequests,
        collectedRequests,
        totalRecords,
        totalQuantityCollected,
        totalWeightCollected
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recyclers (with pending/verified filter)
// @route   GET /api/admin/recyclers
// @access  Private (Admin only)
const getAdminRecyclers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.verificationStatus = status;

    const recyclers = await Recycler.find(query)
      .populate('userId', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recyclers.length,
      data: recyclers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a recycler registration
// @route   PATCH /api/admin/recyclers/:id/verify
// @access  Private (Admin only)
const verifyRecycler = async (req, res, next) => {
  try {
    const { status, reason } = req.body;

    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status. Must be VERIFIED, REJECTED, or PENDING.'
      });
    }

    const recycler = await Recycler.findById(req.params.id);
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'Recycler not found.'
      });
    }

    recycler.verificationStatus = status;
    if (status === 'VERIFIED') {
      recycler.verifiedAt = new Date();
      recycler.rejectionReason = undefined;
    } else if (status === 'REJECTED') {
      recycler.rejectionReason = reason || 'Does not meet current verification criteria.';
    }

    await recycler.save();

    res.status(200).json({
      success: true,
      message: `Recycler status updated to ${status}.`,
      data: recycler
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all e-waste collection requests across the platform
// @route   GET /api/admin/requests
// @access  Private (Admin only)
const getAllRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const requests = await EWasteRequest.find(query)
      .populate('userId', 'name email phone')
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

// @desc    Get permanent collection records with multi-criteria filtering
// @route   GET /api/admin/records
// @access  Private (Admin only)
const getCollectionRecords = async (req, res, next) => {
  try {
    const { category, recyclerId, dateFrom, dateTo, search } = req.query;
    const query = {};

    if (category) {
      query.primaryCategory = category;
    }

    if (recyclerId) {
      query.recyclerId = recyclerId;
    }

    if (dateFrom || dateTo) {
      query.collectionDate = {};
      if (dateFrom) query.collectionDate.$gte = new Date(dateFrom);
      if (dateTo) query.collectionDate.$lte = new Date(dateTo);
    }

    if (search) {
      query.$or = [
        { userName: new RegExp(search, 'i') },
        { recyclerName: new RegExp(search, 'i') },
        { 'pickupLocation.address': new RegExp(search, 'i') }
      ];
    }

    const records = await CollectionRecord.find(query)
      .populate('userId', 'name email')
      .populate('recyclerId', 'organizationName phone')
      .sort({ collectionDate: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed MongoDB analytics for charts (Recharts)
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res, next) => {
  try {
    // 1. Category Distribution from all requests & collection records
    const categoryAgg = await EWasteRequest.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    const categoryDistribution = categoryAgg.map((item) => ({
      category: item._id,
      count: item.count,
      quantity: item.totalQuantity
    }));

    // 2. Status Breakdown
    const statusAgg = await EWasteRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusBreakdown = statusAgg.map((item) => ({
      status: item._id,
      count: item.count
    }));

    // 3. Collection Trend by Date
    const trendAgg = await EWasteRequest.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          requests: { $sum: 1 },
          collectedItems: {
            $sum: {
              $cond: [{ $eq: ['$status', 'COLLECTED'] }, '$totalQuantity', 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);

    const collectionTrends = trendAgg.map((item) => ({
      date: item._id,
      requests: item.requests,
      collectedItems: item.collectedItems
    }));

    // 4. Pickup Methods Breakdown
    const methodAgg = await EWasteRequest.aggregate([
      {
        $group: {
          _id: '$pickupMethod',
          count: { $sum: 1 }
        }
      }
    ]);

    const pickupMethods = methodAgg.map((item) => ({
      method: item._id || 'Standard Pickup',
      count: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        categoryDistribution,
        statusBreakdown,
        collectionTrends,
        pickupMethods
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  getAdminRecyclers,
  verifyRecycler,
  getAllRequests,
  getCollectionRecords,
  getAnalytics
};
