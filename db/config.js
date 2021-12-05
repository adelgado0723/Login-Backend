require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createPool({
  host: process.env.MYSQLDB_HOST,
  port: process.env.MYSQLDB_LOCAL_PORT,
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
});

// open the MySQL connection
// connection.connect((error) => {
//   if (error) throw error;
//   console.log("Successfully connected to the database.");
// });

module.exports = connection;
