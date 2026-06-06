const mongoose = require('mongoose');

async function connectDB(connectionString) {
  if (!connectionString) {
    return null;
  }

  try {
    const connection = await mongoose.connect(connectionString);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = connectDB;