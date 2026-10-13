const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recycler = require('../models/Recycler');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to proceed.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'ecoconnect_jwt_super_secret_key_college_cep_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please sign in again.'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

const requireVerifiedRecycler = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next(); // Admin always allowed
    }

    const recycler = await Recycler.findOne({ userId: req.user._id });
    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'No recycler profile found for your account.'
      });
    }

    if (recycler.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        success: false,
        message: `Your recycler account is currently ${recycler.verificationStatus}. Only verified recyclers can perform this action.`
      });
    }

    req.recycler = recycler;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying recycler authorization.',
      error: error.message
    });
  }
};

module.exports = {
  protect,
  authorize,
  requireVerifiedRecycler
};
