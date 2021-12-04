const loginValidate = require("../utils/validation.js").loginValidate;

module.exports = (app) => {
  const controllers = require("../controllers/controllers.js");

  // Get all users
  app.get("/users", controllers.getUsers);

  // SignUp route
  app.post("/signup", loginValidate, controllers.signup);

  // Login route
  app.post("/login", loginValidate, controllers.login);

  // Logout route
  app.post("/logout", controllers.logout);
};
