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
  console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// ============================================
// MIDDLEWARE
// ============================================

// Trust proxy for Vercel / Render
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
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  })
);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// SESSION CONFIGURATION
// ============================================

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600, // Update once per day
      crypto: {
        secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-this',
      },
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// ============================================
// FLASH + USER DATA MIDDLEWARE
// ============================================

app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;

  delete req.session.success;
  delete req.session.error;

  next();
});

// ============================================
// ROUTES
// ============================================

try {
  const indexRoutes = require('./routes/index');
  const authRoutes = require('./routes/auth');

  app.use('/', indexRoutes);
  app.use('/auth', authRoutes);

  // Safely load optional routes
  const optionalRoutes = [
    { path: '/jobs', file: './routes/jobs' },
    { path: '/companies', file: './routes/companies' },
  ];

  optionalRoutes.forEach(({ path, file }) => {
    try {
      const routeModule = require(file);
      app.use(path, routeModule);
      console.log(`✅ Loaded route: ${path}`);
    } catch {
      console.warn(`⚠️ Optional route ${file} not found, skipping...`);
    }
  });
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res, next) => {
  res.status(404);
  try {
    res.render('404', {
      title: '404 - Page Not Found',
      path: req.path,
    });
  } catch {
    res.json({ error: '404 - Page Not Found' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.status || err.statusCode || 500;

  try {
    res.status(statusCode).render('error', {
      title: 'Error',
      message: err.message || 'Something went wrong',
      error: process.env.NODE_ENV === 'development' ? err : {},
    });
  } catch {
    res.status(statusCode).json({
      error: err.message || 'Something went wrong',
    });
  }
});

// ============================================
// SERVER START (Local Only)
// ============================================
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════');
    console.log('🚀 WHITE COLLARS Server Started');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Local URL:   http://localhost:${PORT}`);
    console.log(
      `📧 MongoDB:     ${
        process.env.MONGODB_URI ? '✅ Connected' : '❌ Not configured'
      }`
    );
    console.log('═══════════════════════════════════════\n');
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  await mongoose.connection.close();
  process.exit(0);
});

// ============================================
// EXPORT FOR VERCEL (Serverless)
// ============================================
module.exports = app;
