const mongoose = require("mongoose")
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();
mongoose.set('strictQuery', true);

// Database connection function
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit the process if connection fails
  }
};
module.exports = connectDB;
