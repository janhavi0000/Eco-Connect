const Recycler = require('../models/Recycler');
const PickupSpot = require('../models/PickupSpot');

// Calculate distance between two lat/lng in kilometers (Haversine formula)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// @desc    Register a new recycler profile
// @route   POST /api/recyclers/register
// @access  Private
const registerRecyclerProfile = async (req, res, next) => {
  try {
    const existing = await Recycler.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Recycler profile already exists for this account.'
      });
    }

    const {
      organizationName,
      contactPerson,
      phone,
      email,
      address,
      latitude,
      longitude,
      serviceAreas,
      supportedCategories,
      description,
      availability
    } = req.body;

    const recycler = await Recycler.create({
      userId: req.user._id,
      organizationName,
      contactPerson: contactPerson || req.user.name,
      phone: phone || req.user.phone,
      email: email || req.user.email,
      address,
      latitude: latitude || 28.6139,
      longitude: longitude || 77.2090,
      serviceAreas: serviceAreas || ['Community Center', 'Campus Area'],
      supportedCategories: supportedCategories || [
        'Mobile Phones',
        'Chargers / Cables',
        'Batteries',
        'Laptops / Computers',
        'Keyboards',
        'Earphones / Headphones'
      ],
      description,
      availability: availability || {
        days: ['Monday', 'Wednesday', 'Saturday'],
        timeSlots: ['09:00 - 11:00 AM', '02:00 - 04:00 PM']
      },
      verificationStatus: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Recycler registration submitted. Verification is pending approval.',
      data: recycler
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get verified recyclers with optional category and location filtering
// @route   GET /api/recyclers
// @access  Public
const getRecyclers = async (req, res, next) => {
  try {
    const { category, serviceArea, lat, lng, search } = req.query;

    const query = { verificationStatus: 'VERIFIED' };

    if (category) {
      query.supportedCategories = { $in: [category] };
    }

    if (serviceArea) {
      query.serviceAreas = { $in: [new RegExp(serviceArea, 'i')] };
    }

    if (search) {
      query.$or = [
        { organizationName: new RegExp(search, 'i') },
        { address: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    let recyclers = await Recycler.find(query).sort({ organizationName: 1 });

    // Fetch active pickup spots for each recycler
    const results = await Promise.all(
      recyclers.map(async (rec) => {
        const spots = await PickupSpot.find({ recyclerId: rec._id, isActive: true });
        const recObj = rec.toObject();
        recObj.activePickupSpots = spots;

        if (lat && lng) {
          recObj.distanceKm = calculateDistanceKm(
            parseFloat(lat),
            parseFloat(lng),
            rec.latitude,
            rec.longitude
          );
        }

        return recObj;
      })
    );

    // Sort by distance if location provided
    if (lat && lng) {
      results.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recycler by ID
// @route   GET /api/recyclers/:id
// @access  Public
const getRecyclerById = async (req, res, next) => {
  try {
    const recycler = await Recycler.findById(req.params.id);
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'Recycler not found.'
      });
    }

    const pickupSpots = await PickupSpot.find({
      recyclerId: recycler._id,
      isActive: true
    });

    const responseData = recycler.toObject();
    responseData.pickupSpotsList = pickupSpots;

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current recycler profile
// @route   GET /api/recyclers/profile/me
// @access  Private (Recycler only)
const getMyRecyclerProfile = async (req, res, next) => {
  try {
    const recycler = await Recycler.findOne({ userId: req.user._id });
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'No recycler profile registered for your account.'
      });
    }

    const pickupSpots = await PickupSpot.find({ recyclerId: recycler._id });

    res.status(200).json({
      success: true,
      data: {
        ...recycler.toObject(),
        pickupSpotsList: pickupSpots
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recycler availability (days & timeSlots)
// @route   PATCH /api/recyclers/:id/availability
// @access  Private (Recycler / Admin)
const updateAvailability = async (req, res, next) => {
  try {
    const recycler = await Recycler.findById(req.params.id);
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'Recycler not found.'
      });
    }

    // Ensure authorized (only the owner or admin)
    if (
      req.user.role !== 'admin' &&
      recycler.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this recycler profile.'
      });
    }

    const { days, timeSlots, serviceAreas, supportedCategories, description, address, latitude, longitude } = req.body;

    if (days || timeSlots) {
      recycler.availability = {
        days: days || recycler.availability?.days || [],
        timeSlots: timeSlots || recycler.availability?.timeSlots || []
      };
    }

    if (serviceAreas) recycler.serviceAreas = serviceAreas;
    if (supportedCategories) recycler.supportedCategories = supportedCategories;
    if (description) recycler.description = description;
    if (address) recycler.address = address;
    if (latitude !== undefined) recycler.latitude = latitude;
    if (longitude !== undefined) recycler.longitude = longitude;

    await recycler.save();

    res.status(200).json({
      success: true,
      message: 'Recycler availability and operational details updated successfully.',
      data: recycler
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerRecyclerProfile,
  getRecyclers,
  getRecyclerById,
  getMyRecyclerProfile,
  updateAvailability
};
