const User = require('../models/User');

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  // Store the original URL to redirect after login
  req.session.returnTo = req.originalUrl;
  
  req.flash('error', 'Please sign in to access this page');
  res.redirect('/auth/signin');
};

// Check if user is NOT authenticated (for signin/signup pages)
exports.isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  
  res.redirect('/');
};

// Check if user has specific role
exports.hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.flash('error', 'Please sign in to access this page');
      return res.redirect('/auth/signin');
    }
    
    if (!roles.includes(req.session.user.role)) {
      req.flash('error', 'You do not have permission to access this page');
      return res.redirect('/');
    }
    
    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please sign in to access this page');
    return res.redirect('/auth/signin');
  }
  
  if (req.session.user.role !== 'admin') {
    req.flash('error', 'Admin access required');
    return res.redirect('/');
  }
  
  next();
};

// Check if user is employer or admin
exports.isEmployer = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please sign in to access this page');
    return res.redirect('/auth/signin');
  }
  
  if (!['employer', 'recruiter', 'admin'].includes(req.session.user.role)) {
    req.flash('error', 'Employer/Recruiter access required');
    return res.redirect('/');
  }
  
  next();
};

// Attach user to request object
exports.attachUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    } catch (error) {
      console.error('Error attaching user:', error);
    }
  }
  next();
};

// Verify session is valid
exports.verifySession = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (!user || !user.isActive) {
        req.session.destroy();
        req.flash('error', 'Your session has expired. Please sign in again.');
        return res.redirect('/auth/signin');
      }
    } catch (error) {
      console.error('Session verification error:', error);
    }
  }
  next();
};
