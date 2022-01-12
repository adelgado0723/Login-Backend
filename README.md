<h1 align="center">Login Backend With Node.js</h1>

## About

Backend server providing endpoints that allow for:

- Creating users through account registration
- Logging in with newly created credentials
- Querying all user emails (if logged in)
- Logout

## Install

**_Note: Node.JS and Docker are prerequisites to executing these commands._**

```sh
git clone https://github.com/adelgado0723/delgado-backend-test-1.git
cd ./delgado-backend-test-1

npm install
```

## Configure

**_Note: You can use the .env.example file provided. Just remove the ".example" at the end and modify the values._**

A ".env" file will be expected in the root folder of the application, where server.js is located. Here is an example of this file. Review each variable and set it according to the environment this is being run in.

```sh
APP_SECRET=B5J9tXM3tcmdRwT3
ENV='DOCKER'
MYSQLDB_LOCAL_HOST='127.0.0.1'
MYSQLDB_DOCKER_HOST='mysqldb'
MYSQLDB_USER=root
MYSQLDB_PASSWORD=79ruCL8aZEPMW9nJ
MYSQLDB_DATABASE=user_db
MYSQLDB_LOCAL_PORT=3307
MYSQLDB_DOCKER_PORT=3306

NODE_LOCAL_PORT=5000
NODE_DOCKER_PORT=5000
```

If the ENV variable is set to 'DOCKER', the server attempts to connect to the database using the MYSQLDB_DOCKER_HOST host and MYSQLDB_DOCKER_PORT port number. Any other setting of the ENV variable has express use the MYSQLDB_LOCAL_HOST host and MYSQLDB_LOCAL_PORT port number.

## Usage

Build and run with:

```sh
docker-compose up --build
```

or

Run without building:

```sh
docker-compose up
```

## Testing

### Endpoint tests

A postman collection containing tests for the different endpoints can be found [here](./tests/postman/delgado-backend-test-1.postman_collection.json).

To test simply import and run the collection in Postman.

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
	"errors": null,
	"data": {
		"user": {
			"email": "[user_email]"
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

Logs in with a registered user's username and password

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
	"errors": null,
	"data": {
		"message": "Login Successful. Welcome [user_email]!"
	}
}
```

| Field  | Type          | Description                                         |
| ------ | ------------- | --------------------------------------------------- |
| errors | Array[String] | Errors validating or authorizing credentials        |
| data   | String        | Contains a success message if request is successful |

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

| Field  | Type          | Description                                         |
| ------ | ------------- | --------------------------------------------------- |
| errors | Array[String] | Errors during logout                                |
| data   | Object        | Contains a success message if request is successful |

Note: /logout returns a 200 HTTP status code and the above message whether the user was logged in or not.

### GET /users

This is a login restricted route that returns a list of all the users emails once queried by an authenticated user. It requires no text in the body of the request.

If queried by a user that is logged out, the user emails will not be transmitted and the user receives the following error.

**Unsucessful Response:**

```JSON
{
  "errors": [ "User must log in to view" ],
  "data": null
}
```

**Successful Response:**

```JSON
{
	"errors": null,
	"data": {
		"0": {
			"email": "adrienne.gutkowski91@hotmail.com"
		},
		"1": {
			"email": "catalina.boyer@yahoo.com"
		},
		"2": {
			"email": "samir_kulas88@yahoo.com"
		},
		"3": {
			"email": "timmy_wiza92@hotmail.com"
		}
	}
}
```

| Field  | Type          | Description                                                                                              |
| ------ | ------------- | -------------------------------------------------------------------------------------------------------- |
| errors | Array[String] | Errors fetching user emails                                                                              |
| data   | Object        | Contains a list of objects, each keyed by an incrementing sequential index and containing a user's email |

## Design and Features

### MySQL DB for Storage

Users are stored in a MySQL database within a Users table that has three fields: id, email, and passHash. The id is a non sequential unique identifier provided by MySQL's `UUID()` function. This prevents malicious actors from being able to easily identify other users' ids by iterating through them sequentially. A [script](./sql/createdb.sql) to create this database is available in the sql/ folder.

### Hashed passwords

Server breaches and data theft are common occurrences. Storing passwords in a hashed format offers users an added a layer of security so that if hackers manage to steal users' hashed passwords, they then have to spend time trying to crack them. If this security measure is combined with a strong password policy, it becomes very difficult if not impossible to crack the hashes with a brute force attack due to the time complexity involved.

### JWT Session Management

If a user signs up for an account or logs into an existing account, a JSON web token is created containing an object with that user's email. The object is encrypted using a private key and the token is stored in the user's cookies. When that user attempts to perform an action on the API, their cookies are checked for a valid token and they are considered "logged in" if this token is found.

### Sanitizes and Validates

Sanitizing:

- Replaces ",", ".","&", "'", """, and "/" with their corresponding HTML entities
- Trims leading and trailing white space

Validating:

- Validates email is in proper email format

  - i.e. `example@example.com`

- Validates password is at least 8 characters long
- Validates password contains an uppercase letter
- Validates password contains a number

### Enforcing Password Standards

In the worst case scenario data breaches, hackers steal all of a company's hashed password data. Because the cost of cracking a hashed password increases exponentially with each character, this measure enforces a base level of hashed password security.

- Be at least 8 characters long
- Contain an uppercase letter
- Contain a number

## To Do:

- Limit login Attempts. Although there are tools that implement this, like [express-brute](https://www.npmjs.com/package/express-brute), it could instead be delegated to a WAF.

- Unit tests. While the endpoint tests are helpful for testing the routes as integrated components, unit tests would help ensure that the individual code components (functions) each work as intended. This could be added with a framework like [jest](https://github.com/facebook/jest).

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
