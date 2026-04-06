
:::
Backend API Development — Internship Project (DecodeLabs)

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express.js](https://img.shields.io/badge/Express.js-Framework-black)
![API](https://img.shields.io/badge/API-RESTful-orange)
![Status](https://img.shields.io/badge/Project-Completed-brightgreen)
![Internship](https://img.shields.io/badge/Internship-DecodeLabs-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express.js](https://img.shields.io/badge/Express.js-Framework-black)
![Status](https://img.shields.io/badge/Project-Completed-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![API](https://img.shields.io/badge/API-RESTful-orange)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)
![Internship](https://img.shields.io/badge/Internship-DecodeLabs-blueviolet)
![Made With](https://img.shields.io/badge/Made%20With-JavaScript-yellow)
Overview

This project is part of the Industrial Training Kit (Batch 2026) by DecodeLabs. The objective is to design and implement a RESTful Backend API that handles application logic, processes user input, and communicates structured responses.

As described in the internship brief, this project focuses on:
	•	Building API endpoints
	•	Managing data flow between client and server
	•	Implementing validation and error handling
	•	Following RESTful principles and HTTP standards  ￼



 Project Goals
	•	Develop a backend server using Node.js and Express
	•	Implement CRUD operations for a User resource
	•	Ensure proper input validation
	•	Return consistent JSON responses
	•	Use appropriate HTTP status codes
	•	Maintain clean and scalable code structure


 Technologies Used
	•	Node.js – Runtime environment
	•	Express.js – Web framework
	•	Crypto (Node built-in) – UUID generation
	•	Nodemon (optional) – Development tool for auto-restart



📂 Project Structure

project-root/
│
├── server.js        # Main server file (all logic)
├── package.json     # Dependencies and scripts
└── README.md        # Documentation




 Installation & Setup

1️⃣ Clone or Download Project

git clone <your-repo-link>
cd backend-api

2️⃣ Install Dependencies

npm install express

(Optional for development)

npm install nodemon --save-dev

3️⃣ Run Server

node server.js

OR

npx nodemon server.js

4️⃣ Server Runs On:

http://localhost:3000




🧠 API Design Concepts

🔹 RESTful Architecture
	•	Resources are nouns → /users
	•	HTTP methods define actions:
	•	GET → Retrieve
	•	POST → Create
	•	PUT → Update
	•	DELETE → Remove

🔹 JSON Communication

All responses follow a consistent structure:

{
  "message": "Description",
  "data": {}
}

🔹 IPO Model (Input → Process → Output)
	•	Input → Client request
	•	Process → Backend logic
	•	Output → JSON response



 API Endpoints



 1. Root Endpoint

GET /
✔ Checks if API is running

Response:

{
  "message": "API is working.",
  "data": null
}


⸻

2. Get All Users

GET /users
✔ Returns all users from in-memory storage

Response:

{
  "message": "Users retrieved successfully",
  "data": [ ... ]
}




 3. Create User

POST /users
✔ Creates a new user

Request Body:

{
  "name": "Hassan",
  "email": "hassan@gmail.com"
}

Success Response (201):

{
  "message": "User created successfully.",
  "data": {
    "id": "uuid",
    "name": "Hassan",
    "email": "hassan@gmail.com"
  }
}



🔸 4. Update User

PUT /users/:id
✔ Replaces existing user data


🔸 5. Delete User

DELETE /users/:id
✔ Deletes user from database


🔍 Validation Rules

Name:
	•	Required
	•	Must be a string
	•	Length: 1–100 characters

Email:
	•	Required
	•	Must be valid format
	•	Max length: 254 characters
	•	Must be unique



 Data Integrity
	•	Duplicate emails are not allowed (returns 409 Conflict)
	•	UUID validation ensures valid user IDs
	•	Input is sanitized using .trim() and .toLowerCase()



 HTTP Status Codes Used

Code	Meaning
200	Success
201	Created
400	Bad Request
404	Not Found
409	Conflict
500	Server Error

 

 Middleware Explained

1. express.json()
	•	Parses incoming JSON requests

2. Error Handling Middleware
	•	Catches unexpected server errors
	•	Returns standardized 500 response

3. Route Parameter Middleware (param)
	•	Validates UUID
	•	Loads user before processing request


  Core Functions Explained

🔹 jsonResponse()

Creates a consistent API response format.

🔹 validateUserBody()
	•	Validates name and email
	•	Checks for duplicates
	•	Returns structured validation results

🔹 isUuid()

Ensures ID format is correct


 Testing the API

Use tools like:
	•	Postman
	•	Thunder Client (VS Code/Cursor)

Example:

POST http://localhost:3000/users



  Error Handling Strategy
	•	Validation errors → 400
	•	Duplicate email → 409
	•	Invalid ID → 400
	•	User not found → 404
	•	Server issues → 500


  Key Features

✅ RESTful API design
✅ Input validation
✅ Error handling
✅ UUID-based user IDs
✅ Clean and modular code
✅ Consistent JSON responses
✅ In-memory database



  Limitations
	•	Data is not persistent (resets on server restart)
	•	No authentication implemented
	•	No database integration (MongoDB can be added)



  Future Improvements
	•	Add MongoDB / Database integration
	•	Implement authentication (JWT)
	•	Add pagination
	•	Add logging system
	•	Deploy to cloud (Render / Vercel / AWS)



 Learning Outcomes

By completing this project, I have learned:
	•	Backend API development fundamentals
	•	RESTful design principles
	•	HTTP methods and status codes
	•	Input validation techniques
	•	Error handling strategies
	•	Client-server communication


 Conclusion

This project demonstrates the ability to build a functional backend API that serves as the “brain” of a full-stack application, handling logic, validation, and communication effectively.

It aligns with the internship objective of mastering backend fundamentals before scaling to more advanced systems like databases and distributed architectures.


Author

Hassan Mahmood
Bachelor in Computer Engineering
Pak-Austria Fachhochschule


Acknowledgment

This project was completed as part of the DecodeLabs Full Stack Development Internship Program (Batch 2026).



:::
