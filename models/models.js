const sql = require("../db/config.js");

const User = function (user) {
  this.email = user.email;
  this.passHash = user.passHash;
};

User.create = (newUser, result) => {
  sql.query(
    "INSERT INTO Users VALUES ( REPLACE(UUID(), '-', ''), \"" +
      newUser.email +
      '", "' +
      newUser.passHash +
      '");',
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created user: ", { ...newUser });
      result(null, { ...newUser });
    }
  );
};
module.exports = User;
