const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false; // Track the connection state

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // optional, good for performance
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw err; // Don't exit in serverless
  }
};

module.exports = connectDB;
