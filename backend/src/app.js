const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');
const globalErrorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Set static file streaming pipeline directly outward globally
app.use('/public', express.static(path.join(__dirname, 'public')));

// 1. GLOBAL MIDDLEWARES
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limit specifically to auth endpoints
app.use('/api/v1/auth', rateLimiter);

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }));

// Parse cookies (needed for HTTP-only refresh tokens)
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Ensure CORS allows credentials for cookies to work across domains!
app.use(cors({ origin: true, credentials: true }));

// 2. ROUTES
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/courses', require('./routes/courseRoutes'));
app.use('/api/v1/modules', require('./routes/moduleRoutes'));
app.use('/api/v1/lessons', require('./routes/lessonRoutes'));
app.use('/api/v1/quiz', require('./routes/quizRoutes'));
app.use('/api/v1/certificates', require('./routes/certificateRoutes'));
app.use('/api/v1/progress', require('./routes/progressRoutes'));

// 3. ERROR HANDLING
app.all('*', (req, res, next) => {
  const AppError = require('./utils/AppError');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
