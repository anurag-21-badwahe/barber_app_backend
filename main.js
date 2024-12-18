import express from "express";
import connectDB from "./config/db.js";  // Import with .js extension
const app = express();
const port = 3000;

// Connect to the database
connectDB();


// Built-in middlewares for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use("login",loginRouter);
// app.use("logout",logoutRouter)
// app.use("verify",verifyRouter);

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/new', (req, res) => {
  res.send('Hello World new!');
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
