require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

// 1. Decode JWT to get email for each request
app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.APP_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
      // Else they might need a new token
    });
  }
  next();
});

// Routes
require("./routes/routes.js")(app);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke: " + err.message);
});

app.listen(process.env.NODE_LOCAL_PORT);
