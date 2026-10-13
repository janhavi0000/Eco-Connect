const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recycler = require('../models/Recycler');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'ecoconnect_jwt_super_secret_key_college_cep_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user or recycler
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'user',
      organizationName,
      address,
      serviceAreas,
      supportedCategories,
      description
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role
    });

    let recyclerData = null;

    // If registering as a recycler, create the linked Recycler profile with PENDING verification status
    if (role === 'recycler') {
      const recycler = await Recycler.create({
        userId: user._id,
        organizationName: organizationName || `${name}'s E-Waste Center`,
        contactPerson: name,
        phone,
        email: email.toLowerCase(),
        address: address || 'Community Collection Center',
        serviceAreas: serviceAreas && serviceAreas.length > 0 ? serviceAreas : ['Campus Area', 'Downtown'],
        supportedCategories: supportedCategories && supportedCategories.length > 0
          ? supportedCategories
          : [
              'Mobile Phones',
              'Chargers / Cables',
              'Batteries',
              'Laptops / Computers',
              'Keyboards',
              'Earphones / Headphones'
            ],
        description: description || 'Community-focused verified electronic waste recycler.',
        verificationStatus: 'PENDING'
      });
      recyclerData = recycler;
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message:
        role === 'recycler'
          ? 'Recycler account registered successfully. Verification is pending approval.'
          : 'User registered successfully.',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt
        },
        recycler: recyclerData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    let recycler = null;
    if (user.role === 'recycler') {
      recycler = await Recycler.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt
        },
        recycler
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let recycler = null;

    if (user.role === 'recycler') {
      recycler = await Recycler.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        recycler
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
