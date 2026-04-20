const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
  if (!MONGO_URI) throw new Error('MONGO_URI is missing in environment variables.');
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};

module.exports = connectDB;