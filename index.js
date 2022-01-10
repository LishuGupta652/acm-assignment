const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Api rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
});
app.use(apiLimiter);
app.set("trust proxy", 1); // trust first proxy

// Connecting to the database
mongoose.connect(process.env.MONGODB_URI, () => {
  console.log("Connected to database");
});

// Importing the routes
const postRoutes = require("./routes/postRoutes");
// Using middleware for parsing the body of the request
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using the routes as middlesware
app.use("/api/posts", postRoutes);

// using main routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
    routes: {
      allpost: "/api/posts",
      postingroute: "/api/posts",
      specific: "api/posts/:id",
      delete: "/api/posts/:id",
      patch: "/api/posts/:id",
    },
  });
});

// Listening to the port
app.listen(PORT, () => console.log(`App live on http://localhost:${PORT}`));
