import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db_connect.js";
import {customerAuthRoute} from "./routes/authRoutes.js"

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Default to 5000 if PORT is undefined

// Connect to the database
connectDB();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/new", (req, res) => {
  res.send("Hello World new!");
});


app.use("/api/auth",customerAuthRoute );


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
