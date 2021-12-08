require("dotenv").config();
const mysql = require("mysql");

const env = process.env;
const host =
  env.ENV === "DOCKER" ? env.MYSQLDB_DOCKER_HOST : env.MYSQLDB_LOCAL_HOST;
const port =
  env.ENV === "DOCKER" ? env.MYSQLDB_DOCKER_PORT : env.MYSQLDB_LOCAL_PORT;

const connection = mysql.createConnection({
  host: host,
  port: port,
  user: env.MYSQLDB_USER,
  password: env.MYSQLDB_PASSWORD,
  database: env.MYSQLDB_DATABASE,
});

module.exports = connection;
