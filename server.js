require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// ============================================
// DATABASE CONNECTION
// ============================================
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ MongoDB Connected');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// ============================================
// MIDDLEWARE
// ============================================

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Method override for PUT/DELETE
app.use(methodOverride('_method'));

// Logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    crypto: {
      secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-this'
    }
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Flash messages and user data middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  res.locals.user = req.session.user || null;
  
  delete req.session.success;
  delete req.session.error;
  
  next();
});

// ============================================
// ROUTES
// ============================================

try {
  // Import routes
  const indexRoutes = require('./routes/index');
  const authRoutes = require('./routes/auth');
  const jobRoutes = require('./routes/jobs');
  const companyRoutes = require('./routes/companies');

  // Use routes
  app.use('/', indexRoutes);
  app.use('/auth', authRoutes);
  app.use('/jobs', jobRoutes);
  app.use('/companies', companyRoutes);

} catch (error) {
  console.error('Error loading routes:', error);
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  
  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).render('error', {
    title: 'Error',
    message: err.message || 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============================================
// SERVER START (Local Development Only)
// ============================================
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('🚀 WHITE COLLARS Server Started');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📧 MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
    console.log('═══════════════════════════════════════');
    console.log('\n📌 Available Routes:');
    console.log('   → Home:     http://localhost:' + PORT);
    console.log('   → Signin:   http://localhost:' + PORT + '/auth/signin');
    console.log('   → Signup:   http://localhost:' + PORT + '/auth/signup');
    console.log('   → Jobs:     http://localhost:' + PORT + '/jobs');
    console.log('   → About:    http://localhost:' + PORT + '/about');
    console.log('   → Contact:  http://localhost:' + PORT + '/contact');
    console.log('═══════════════════════════════════════\n');
  });
}

// Export for Vercel (serverless)
module.exports = app;
