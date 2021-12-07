const connection = require("../db/config.js");

const User = function (user) {
  this.email = user.email;
  this.passHash = user.passHash;
};

User.create = (newUser, result) => {
  connection.query(
    "INSERT INTO Users VALUES ( REPLACE(UUID(), '-', ''), \"" +
      newUser.email +
      '", "' +
      newUser.passHash +
      '");',
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { ...res });
    }
  );
};

User.getAllEmails = (result) => {
  connection.query("SELECT email FROM Users;", (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { ...res });
  });
};

User.getByEmail = (email, result) => {
  connection.query(
    'SELECT * FROM Users WHERE email = "' + email + '";',
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { ...res });
    }
  );
};

module.exports = User;
