require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const connection = require("./db/config.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Decode JWT to get the user id and identify the session
app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.APP_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
});

// Routes
require("./routes/routes.js")(app);

// Catch any uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke: " + err.message);
});

// Trigger clean up and shutdown
let shuttingDown = false;
app.use(function (req, resp, next) {
  if (!shuttingDown) return next();
  resp.setHeader("Connection", "close");
  resp
    .status(503)
    .json({ errors: ["Server is in the process of restarting"], data: null });
  console.log("Server is in the process of restarting");
});

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

const startMessage = `Server started listening on port: ${process.env.NODE_LOCAL_PORT}`;

const handleConnectErrors = function (err) {
  if (err) {
    console.error("Error connecting to db: " + err.stack);
    return;
  }
  console.log("Connected to database with id: " + connection.threadId);
};

const connect = function () {
  console.log(startMessage);
  connection.connect(handleConnectErrors);
};

let server = app.listen(process.env.NODE_LOCAL_PORT, connect);

// Closes db connection and stops the server
function cleanup() {
  shuttingDown = true;
  server.close(function () {
    console.log("Closed out remaining connections.");
    connection.end();
    process.exit();
  });

  setTimeout(function () {
    console.error("Could not close connections in time, forcing shut down");
    process.exit(1);
  }, 30 * 1000);
}
