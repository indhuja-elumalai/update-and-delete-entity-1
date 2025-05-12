const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
require("dotenv").config();

const app = express();

app.use(express.json()); // Middleware for parsing JSON

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Use routes
app.use("/user", userRoutes); // Authentication routes
app.use("/sessions", sessionRoutes); // Session routes

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
