const { body } = require("express-validator");

// Sanitizes and Validates of Email
// Requires password with at least 8 characters,
// Containing at least one Number and
// at least one Uppercase letteer
exports.loginValidate = [
  body("email")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail()
    .withMessage("Invalid Email"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage("Passsword Must Be At Least 8 characters long")
    .matches("[0-9]")
    .withMessage("Password Must Contain A Number")
    .matches("[A-Z]")
    .withMessage("Password Must Contain An Uppercase Letter"),
];
