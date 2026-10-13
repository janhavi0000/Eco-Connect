const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const recyclerRoutes = require('./routes/recyclerRoutes');
const pickupSpotRoutes = require('./routes/pickupSpotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EcoConnect API is healthy and operational',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/recycler', recyclerRoutes);
app.use('/api/pickup-spots', pickupSpotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/survey', surveyRoutes);

// Catch 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server if run directly
if (require.main === module && process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`[EcoConnect Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[EcoConnect Server] Failed to connect to MongoDB on startup:', err.message);
      app.listen(PORT, () => {
        console.log(`[EcoConnect Server] Running on port ${PORT} (Database pending connection)`);
      });
    });
}

module.exports = app;
