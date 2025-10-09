require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import middleware (optional - comment out if files don't exist yet)
// const { flash } = require('./middleware/flash');
// const { requestLogger } = require('./middleware/logger');
// const { setSecurityHeaders, sanitizeInput } = require('./middleware/security');
// const { rateLimit } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust proxy (if behind reverse proxy like nginx)
app.set('trust proxy', 1);

// Security headers (optional - uncomment if middleware exists)
// app.use(setSecurityHeaders);

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev')); // Uncomment if morgan is needed
}

// Custom request logger (optional - uncomment if middleware exists)
// app.use(requestLogger);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// Cookie parser (optional - uncomment if needed)
// app.use(cookieParser());

// Method override for PUT and DELETE in forms
app.use(methodOverride('_method'));

// Sanitize user input (optional - uncomment if middleware exists)
// app.use(sanitizeInput);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  name: 'white-collars-session'
}));

// Flash messages middleware (optional - uncomment if middleware exists)
// app.use(flash);

// Rate limiting for auth routes (optional - uncomment if middleware exists)
// app.use('/auth', rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: 'Too many authentication attempts, please try again later'
// }));

// Make user and messages available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  
  // Clear flash messages after setting them
  delete req.session.success;
  delete req.session.error;
  
  next();
});

// Helper functions for templates
app.locals.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

app.locals.timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

// Routes
try {
  app.use('/', require('./routes/index'));
  app.use('/auth', require('./routes/auth'));
  app.use('/jobs', require('./routes/jobs'));
  app.use('/companies', require('./routes/companies'));
  app.use('/contact', require('./routes/contact'));
  app.use('/careers', require('./routes/careers'));
  app.use('/about', require('./routes/about'));
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler - Must be after all routes
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    path: req.path
  });
});

// Global error handler - Must be last
app.use((err, req, res, next) => {
  // Log error
  console.error('Error occurred:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  
  // Render error page
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode);
  
  // Handle different error types
  if (err.name === 'ValidationError') {
    return res.render('error', {
      title: 'Validation Error',
      message: 'Please check your input and try again',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
  
  if (err.name === 'CastError') {
    return res.render('error', {
      title: 'Invalid Request',
      message: 'The requested resource was not found',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
  
  if (err.code === 11000) {
    return res.render('error', {
      title: 'Duplicate Entry',
      message: 'A record with this information already exists',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
  
  // Default error page
  res.render('error', {
    title: statusCode === 500 ? 'Server Error' : 'Error',
    message: statusCode === 500 ? 'Something went wrong on our end' : err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('═════════════════════════════════════════════');
  console.log(`🚀 WHITE COLLARS Server Started`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  console.log('═════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
