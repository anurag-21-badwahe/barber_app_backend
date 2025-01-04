const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db_config/db_connect");
const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const salonRoute = require("./routes/salonRoutes"); 
const ownerRoute = require("./routes/ownerRoutes");
const barberRoute = require("./routes/barberRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default to 5000 if PORT is undefined

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

//APi designed
app.use("/api/auth",authRoute);

app.use("/api/user",userRoute);

app.use('/api/barber',barberRoute);

app.use('/api/salon',salonRoute);

app.use('/api/owner',ownerRoute);




// Start the server
app.listen(PORT, 
  async () =>{ await connectDB()
  console.log(`Example app listening at http://localhost:${PORT}`)
})
