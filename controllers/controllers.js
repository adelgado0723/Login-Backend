const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const ONE_DAY_MILLISECS = 1000 * 60 * 60 * 24;
// These functions should be replaced by calls to a database
users = [{ email: "Testing!@yahoo.com", password: "test!" }];
storeUser = (user) => {
  users.push(user);
};
findUser = (email) => {
  const user = users.find((user) => user.email == email);
  return user;
};
//////////////////////////////////////////////////////////////
// Get all users
exports.getUsers = (req, res) => {
  if (req.user && req.user.email) {
    // TODO: Implement permissions
    res.status(200).json(users);
  } else {
    res.status(401).send("User must log in to view");
  }
};

// SignUp route
exports.signup = async (req, res) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    let concatErrors = "";
    errors.forEach((error) => {
      concatErrors += error.msg + "\n";
    });
    return res
      .status(400)
      .send(concatErrors ? concatErrors : "Invalid input provided");
  }
  // 1. Check if user already exists
  const user = findUser(req.body.email);
  if (user != null) {
    return res.status(409).send("Email Already In Use");
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // 2. Create user in database
    const user = {
      email: req.body.email,
      password: hashedPassword,
    };
    storeUser(user);

    // 3. Sign in the user with the credentials they just created.
    const token = jwt.sign({ email: user.email }, process.env.APP_SECRET, {
      expiresIn: "30m",
    });

    // 4. Set JWT as a cookie on the response
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_DAY_MILLISECS,
    });
    res.status(201).send("User Created Succesfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

// Login route
exports.login = async (req, res) => {
  const loginError = "Invalid credentials provided";
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    return res.status(401).send(loginError);
  }
  // 1. Look for a user given the email
  const user = findUser(req.body.email);
  if (user == null) {
    return res.status(401).send(loginError);
  }
  try {
    // 2. Check that their password is correct
    if ((await bcrypt.compare(req.body.password, user.password)) == null) {
      res.set(401).send(loginError);
    }
    // 3. Generate the JWT
    const token = jwt.sign({ email: user.email }, process.env.APP_SECRET, {
      expiresIn: "30m",
    });

    // 4. Set the Cookie with the token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: ONE_DAY_MILLISECS,
    });

    res.status(200).send("Success");
  } catch (err) {
    //console.log(error);
    res.status(500).send();
  }
};

// Logout route
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged Out");
};
