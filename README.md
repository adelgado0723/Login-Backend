<h1 align="center">REST interface to a login module using Node.js Express</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

## About

Backend server providing endpoints that allow users to:

- Create new users
- Login with new credentials
- Query all user emails if logged in (For testing authentication and sessions)
- Logout

Users are stored in a MySQL database within a Users table that has three fields: id, email, and passHash.

```sql
CREATE TABLE Users (
	id VARCHAR(36) NOT NULL PRIMARY KEY,
	email VARCHAR(60) UNIQUE NOT NULL,
	passHash VARCHAR(60) NOT NULL
);
```

The id is a non sequential unique identifier provided by MySQL's `UUID()` function. This prevents malicious actors from being able to easily iterate through the ids and find others once they have one.

## Install

```sh
git clone https://github.com/adelgado0723/delgado-backend-test-1.git

cd ./delgado-backend-test-1

npm install
```

## Configure

A ".env" file will be expected in the root folder of the application, where server.js is located. Here is an example of this file. Review each variable and set it according to the environment this is being run in.

```sh
APP_SECRET=[Secret String for encrypting JWT]

MYSQLDB_HOST=[IP or Domain]
MYSQLDB_USER=[Database username]
MYSQLDB_PASSWORD=[Database Password]
MYSQLDB_DATABASE=[Database name]

# MYSQLDB_LOCAL_PORT is the default used in
#./config/config.js to establish the databse connection
MYSQLDB_LOCAL_PORT=[db port on host]
MYSQLDB_DOCKER_PORT=[db port on host]

NODE_LOCAL_PORT=5000
NODE_DOCKER_PORT=5000
```

## Usage

```sh
docker up --build
```

## Testing

## Endpoint Documentation

### POST /signup

Creates a new user account if one does not already exist for the given email

**Request Body:**

```JSON
{
    "email": "[user_email]",
    "password": "[user_password]"
}
```

Upon success, the errors array will be empty and data.user.email will show the newly added user email.

| Field    | Type   | Description                        |
| -------- | ------ | ---------------------------------- |
| email    | String | Email to register                  |
| password | String | Password meeting specific criteria |

**Successful Response Body:**

```JSON
{
  "errors":null,
  "data": { "user": {
                      "email":"[user_email]"
                      }
          }
}
```

| Field  | Type          | Description                                                             |
| ------ | ------------- | ----------------------------------------------------------------------- |
| errors | Array[String] | Errors creating the new user                                            |
| data   | Object        | Contains newly added user data upon success or null when error(s) occur |

If there are any errors in the process, they will be returned in the errors array and data will have a value of null.
The new user will be automatically logged in after successful registration.

### POST /login

Creates a new user account if one does not already exist for the given email

**Request Body:**

```JSON
{
    "email": "[user_email]",
    "password": "[user_password]"
}
```

| Field    | Type   | Description           |
| -------- | ------ | --------------------- |
| email    | String | Registered user email |
| password | String | User password         |

**Successful Response Body:**

```JSON
{
  "error": null,
  "data": {
    "message": "Login Successful. Welcome [user_email]!"
  }
}
```

| Field    | Type          | Description                                  |
| -------- | ------------- | -------------------------------------------- |
| error    | Array[String] | Errors validating or authorizing credentials |
| password | String        | User password                                |

### POST /logout

- Requires no body
- Returns a message in the data object upon success

**Successful Response Body:**

```JSON
{
    "error": null,
    "data": {
        "message": "Logged Out."
    }
}
```

| Field    | Type          | Description           |
| -------- | ------------- | --------------------- |
| error    | Array[String] | Registered user email |
| password | String        | User password         |

Note: /logout returns a 200 HTTP status code and the above message whether the user was logged in or not.

### GET /users

## Design and Features

### Hashed passwords

Server breaches and data theft are common occurrences. Storing passwords in a hashed format offers users an added a layer of security.

### JWT Session Menagement

When a user signs up for an account or logs into an existing account, a JSON web token is created that contains an object with that user's email. The object is encrypted using a private key and the token is stored in the user's cookies. When that user attempts to perform an action on the API, their cookies are checked for a valid token and they are considered "logged in" if this token is found.

### Sanitizes and Validates

Sanitizing:

- Replaces ",", ".","&", "'", """, and "/" with their corresponding HTML entities
- Trims leading and trailing white space

Validating:

- Validates email is in proper email format

  - i.e. example@example.com

- Validates password is at least 8 characters long
- Validates password contains an uppercase letter
- Validates password contains a number

### Enforcing Password Standards

In the worst case scenario data breaches, hackers steal all of a company's hashed password data. Because the cost of cracking a hashed pasword increases exponentially with each character, this measure enforces a base level of hashed password security.

- Be at least 8 characters long
- Contain an uppercase letter
- Contain a number

## To Do:

- Limit login Attempts. Although there are tools that implement this, like [express-brute](https://www.npmjs.com/package/express-brute), it could instead be delegated to a WAF.

## Dependencies

|                                                                      |                                                                                                                              |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [bcrypt](https://www.npmjs.com/package/bcrypt)                       | Library for hashing passwords and comparing hashes                                                                           |
| [cookie-parser](https://www.npmjs.com/package/cookie-parser)         | Parses the Cookie header into an object with a key for each cookie name                                                      |
| [dotenv](https://www.npmjs.com/package/dotenv)                       | Allows for storing environment variables in a separate file from the code they are used in to prevent leaking sensitive data |
| [express](https://www.npmjs.com/package/express)                     | Simple, robust web framework for Node                                                                                        |
| [express-validator](https://www.npmjs.com/package/express-validator) | Utilities to help with sanitation and validation of user input                                                               |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)           | Allows for encrypting a JSON object with a private key. Used for keeping track of user sessions                              |
| [mysql](https://www.npmjs.com/package/mysql)                         | Provides the interface for interacting with a MySQL database                                                                 |
| [nodemon](https://www.npmjs.com/package/nodemon)                     | Performs hot reloading of the application                                                                                    |

## Author

👤 **Andres Delgado**

- Github: [@adelgado0723](https://github.com/adelgado0723)
- LinkedIn: [@https:\/\/www.linkedin.com\/in\/adelgado0723\/](https://linkedin.com/in/https://www.linkedin.com/in/adelgado0723/)
