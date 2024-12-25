const mongoose = require('mongoose');


mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
      connectTimeoutMS: 30000, // Connection timeout
      retryWrites: true,
      family: 4 // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Retry logic
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Add connection event listeners
mongoose.connection.on('error', (err) => {
  console.error('MongoDB Error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected, attempting to reconnect...');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;