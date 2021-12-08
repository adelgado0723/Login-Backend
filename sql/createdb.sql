
CREATE DATABASE user_db;

USE user_db;

CREATE TABLE Users (
	id VARCHAR(36) NOT NULL PRIMARY KEY,
	email VARCHAR(60) UNIQUE NOT NULL,
	passHash VARCHAR(60) NOT NULL
);