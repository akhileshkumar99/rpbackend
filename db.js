const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartschool';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB Connected to:', MONGO_URI.split('@')[1]?.split('/')[0] || 'localhost'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

module.exports = mongoose;
