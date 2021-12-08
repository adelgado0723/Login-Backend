const loginValidate = require("../utils/utils.js").loginValidate;

module.exports = (app) => {
  const controllers = require("../controllers/controllers.js");

  // Get all user emails
  app.get("/users", controllers.getUserEmails);

  // SignUp route
  app.post("/signup", loginValidate, controllers.signup);

  // Login route
  app.post("/login", loginValidate, controllers.login);

  // Logout route
  app.post("/logout", controllers.logout);
};
