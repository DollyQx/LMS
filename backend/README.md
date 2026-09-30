# MERN LMS Backend

This is the production-ready backend for the generic Learning Management System.

## Architecture & Features
- Developed using **Clean Architecture** principles.
- Role-based Access Control (Admin and Student).
- Comprehensive hierarchical data structures: Course -> Module -> Lesson -> Quiz/Progress.
- Securely protected via JWTs, Bcrypt, Rate Limiting, NoSQL Injection safeguards, and XSS cleaning.

## Getting Started

### 1. Requirements
Ensure you have the following installed to run this project natively:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 2. Setup environment variables
Copy the example environment variables file and update it with your own credentials (such as local DB connection strings and randomly generated JWT tokens).

```bash
cp .env.example .env
```

### 3. Install dependencies
In the root directory of this backend application:`backend/`, run:

```bash
npm install
```

### 4. Running the application
To start the application in development mode with `nodemon` auto-restarting on file changes:

```bash
npm run dev
```

To run it normally:

```bash
npm start
```

Your server will be available at: `http://localhost:5000` (or whichever port you've specified in `.env`).
