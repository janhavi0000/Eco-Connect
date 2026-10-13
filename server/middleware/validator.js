const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateRegistration = (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!phone || phone.trim().length < 7) {
    errors.push('A valid phone number is required (min 7 digits)');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (role && !['user', 'recycler', 'admin'].includes(role)) {
    errors.push('Role must be either user, recycler, or admin');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateIdParam = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid identifier provided: ${paramName}`
      });
    }
    next();
  };
};

module.exports = {
  isValidObjectId,
  validateRegistration,
  validateLogin,
  validateIdParam
};
