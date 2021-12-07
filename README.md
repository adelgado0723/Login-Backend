<h1 align="center">Welcome to delgado-backend-test-1 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> REST endpoints that support user creation, logging in, querying all users if logged in, and logging out.

## Install

```sh
npm install
```

## Usage

```sh
npm run start
```

## Design and Features

### Hashed passwords

Server breaches and data theft are common occurences. Storing passwords in a hashed format offers users an added a layer of security.

### Uses JSON web tokens to keep track of user sessions

When a user signs up for an account or logs into an existing account, a JSON web token is created that contains an object with that user's email. The object is encrypted using a private key and the token is stored in the user's cookies. When that user attempts to perform an action on the API, their cookies are checked for a valid token and they are considered "logged in" if this token is found.

### Sanitizes and Validates user input

Sanitizing:

- Replaces ",", ".","&", "'", """, and "/" with their corresponding HTML entities
- Trims leading and trailing white space

Validating:

- Validates email is in proper email format

  - i.e. example@example.com

- Validates password is at least 8 characters long
- Validates password contains an uppercase letter
- Validates password contains a number

### Enforces that passwords must:

- Be at least 8 characters long
- Contain an uppercase letter
- Contain a number

## To Do:

- Limit login Attempts. Although there are tools that implement this, like [express-brute](https://www.npmjs.com/package/express-brute), it could instead be delegated to a WAF.

## Dependencies

### [bcrypt](https://www.npmjs.com/package/bcrypt)

- Library for hashing passwords and comparing hashes

### [cookie-parser](https://www.npmjs.com/package/cookie-parser)

- Parses the Cookie header into an object with a key for each cookie name

### [dotenv](https://www.npmjs.com/package/dotenv)

- Allows for storing environment variables in a separate file from the code they are used in to prevent leaking sensitive data

### [express](https://www.npmjs.com/package/express)

- Simple but robust web framework for Node

### [express-validator](https://www.npmjs.com/package/express-validator)

- Utilities to help with sanitation and validation of user input

### [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

- Allows you to encrypt a JSON object with a private key
- Used for keeping track of user sessions

### [mysql](https://www.npmjs.com/package/mysql)

- Provides the interface for interacting with a MySQL database

### [nodemon](https://www.npmjs.com/package/nodemon)

- Performs hot reloading of the application

## Author

👤 **Andres Delgado**

- Github: [@adelgado0723](https://github.com/adelgado0723)
- LinkedIn: [@https:\/\/www.linkedin.com\/in\/adelgado0723\/](https://linkedin.com/in/https://www.linkedin.com/in/adelgado0723/)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
