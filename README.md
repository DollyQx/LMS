# 🎓 Learning Management System (`LMS`)

A modern, full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React 18, Node.js), Zustand state management, TailwindCSS, and automated PDF certificate generation.

## 🚀 Key Features

- **User Authentication & Authorization**: JWT-based session security with role-based access for Students, Instructors, and Admins.
- **Course & Module Architecture**: Dynamic course management with nested modules, video lessons, and progress tracking.
- **Interactive Quizzes**: Quiz engine with instant scoring, attempt limits, and passing thresholds.
- **PDF Certificate Generation**: Automated certificate issuance upon course completion powered by `PDFKit`.
- **Hardened API Middleware**: Protected endpoints with Helmet, Rate Limiting, Mongo Injection Sanitization, and XSS filtering.

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, TailwindCSS 3, Zustand 4, Lucide React, Framer Motion |
| Backend | Node.js, Express 4, Mongoose 7, JWT, BcryptJS, PDFKit |
| Security | Helmet, Express Rate Limit, Express Mongo Sanitize, XSS Clean |

## 📁 Repository Structure

```text
├── backend
│   ├── src
│   │   ├── config       # DB connection and storage setup
│   │   ├── controllers  # Auth, Course, Lesson, Quiz, Certificate logic
│   │   ├── middleware   # Auth guard, error handler, rate limiter, validators
│   │   ├── models       # Mongoose schemas (User, Course, Module, Lesson, Quiz, Certificate)
│   │   ├── routes       # REST API endpoints
│   │   ├── services     # Business logic layer
│   │   └── utils        # JWT & Error helper utilities
│   └── server.js        # Server entry point
└── frontend
    ├── src
    │   ├── components   # Navbar, CourseCard, ProgressBar, Loader
    │   ├── pages        # Login, Dashboard, CoursePlayer, Quiz, Certificate
    │   ├── routes       # Protected route guards
    │   ├── services     # Axios API integrations
    │   └── store        # Zustand auth & course state store
    └── vite.config.js
```

## ⚙️ Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET in .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🔒 Security

For vulnerability reporting and security guidelines, see [SECURITY.md](SECURITY.md).