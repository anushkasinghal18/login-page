const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('WARNING: MONGO_URI is not defined in environment variables. Falling back to Mock User Store.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('MongoDB connection failed. Falling back to Mock User Store.');
    isConnected = false;
    return false;
  }
};

module.exports = {
  connectDB,
  getIsConnected: () => isConnected
};
