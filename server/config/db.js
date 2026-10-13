const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoconnect';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    console.warn(`[Database] Tip: Ensure local MongoDB is running or configure MONGODB_URI in server/.env with your MongoDB Atlas connection string.`);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('[Database] Disconnect error:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
