require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  connectionLimit: 100,
  host: process.env.MYSQLDB_HOST,
  port: process.env.MYSQLDB_DOCKER_PORT,
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_PASSWORD,
  database: process.env.MYSQLDB_DATABASE,
});

module.exports = connection;
