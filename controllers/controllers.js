const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/models.js");
const ONE_DAY_MILLISECS = 1000 * 60 * 60 * 24;

// Users Controller
// Only accessible if Logged in
exports.getUserEmails = (req, res) => {
  if (req.user && req.user.email) {
    User.getAllEmails((err, data) => {
      if (err) {
        res.status(500).json({ errors: ["Error Getting Users"], data: null });
      } else {
        res.status(200).json({ errors: null, data: data });
      }
    });
  } else {
    res.status(401).json({ errors: ["User must log in to view"], data: null });
  }
};

const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user in database
    let user = {
      id: null,
      email: req.body.email,
      passHash: hashedPassword,
    };
    User.create(user, (err, data) => {
      if (err) {
        res.status(500).json({ errors: ["Error Creating User"], data: null });
      } else if (data) {
        // Automatically sign in user after sign up
        const token = jwt.sign({ email: user.email }, process.env.APP_SECRET, {
          expiresIn: "2h",
        });

        // Set JWT as a cookie on the response
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: ONE_DAY_MILLISECS,
        });
        res
          .status(201)
          .json({ errors: null, data: { user: { email: user.email } } });
      }
    });
  } catch (err) {
    res.status(500).json({ errors: ["Server error"], data: null });
  }
};
// SignUp Controller
exports.signup = async (req, res) => {
  if (validationResult(req).errors.length) {
    return res
      .status(400)
      .json({ errors: validationResult(req).errors, data: null });
  }

  // Check if user already exists
  User.getByEmail(req.body.email, async function (err, data) {
    if (err) {
      res.status(500).json({ errors: ["Error Fetching User"], data: null });
    } else if (data[0]) {
      res.status(409).json({ errors: ["Email Already In Use"], data: null });
    } else {
      createUser(req, res);
    }
  });
};

const attemptLogin = async (req, res, user) => {
  try {
    // Check that their password is correct
    if ((await bcrypt.compare(req.body.password, user.passHash)) == null) {
      res.status(401).json({ errors: [loginError], data: null });
    }
    // Generate the JWT
    const token = jwt.sign({ email: user.email }, process.env.APP_SECRET, {
      expiresIn: "2h",
    });

    // Set the Cookie with the token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_DAY_MILLISECS,
    });
    const loginMessage = "Login Successful. Welcome " + user.email + "!";
    res.status(200).json({
      error: null,
      data: { message: loginMessage },
    });
  } catch (err) {
    res.status(500).json({ errors: ["Server error"], data: null });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const loginError = "Invalid credentials provided";
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    return res.status(401).json({ error: [loginError], data: null });
  }

  // Look for a user given the email
  User.getByEmail(req.body.email, function (err, data) {
    if (err) {
      // Error in querying database
      res.status(500).json({ errors: ["Error Fetching User"], data: null });
    } else if (data[0] == null) {
      // User doesn't exist
      res.status(401).json({ errors: [loginError], data: null });
    } else {
      attemptLogin(req, res, data[0]);
    }
  });
};

// Logout Controller
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ error: null, data: { message: "Logged Out." } });
};
