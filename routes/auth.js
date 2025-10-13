const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ============================================
// SIGNIN ROUTES
// ============================================

// GET /auth/signin - Display signin page
router.get('/signin', (req, res) => {
  res.render('signin', {
    title: 'Sign In - WHITE COLLARS',
    error: req.session.error || null,
    success: req.session.success || null
  });
  
  // Clear messages after displaying
  delete req.session.error;
  delete req.session.success;
});

// POST /auth/signin - Process signin form
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.render('signin', {
        title: 'Sign In - WHITE COLLARS',
        error: 'Please provide both email and password',
        success: null
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.render('signin', {
        title: 'Sign In - WHITE COLLARS',
        error: 'Invalid email or password',
        success: null
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.render('signin', {
        title: 'Sign In - WHITE COLLARS',
        error: 'Your account has been deactivated. Please contact support.',
        success: null
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.render('signin', {
        title: 'Sign In - WHITE COLLARS',
        error: 'Invalid email or password',
        success: null
      });
    }

    // Create session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType
    };

    req.session.success = `Welcome back, ${user.name}!`;

    // Redirect based on user type
    if (user.userType === 'employer') {
      return res.redirect('/employer/dashboard');
    } else {
      return res.redirect('/jobs');
    }

  } catch (error) {
    console.error('Signin error:', error);
    res.render('signin', {
      title: 'Sign In - WHITE COLLARS',
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// ============================================
// SIGNUP ROUTES
// ============================================

// GET /auth/signup - Display signup page
router.get('/signup', (req, res) => {
  res.render('signup', {
    title: 'Sign Up - WHITE COLLARS',
    error: null,
    success: null
  });
});

// POST /auth/signup - Process signup form
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validation
    if (!name || !email || !password || !userType) {
      return res.render('signup', {
        title: 'Sign Up - WHITE COLLARS',
        error: 'All fields are required',
        success: null
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('signup', {
        title: 'Sign Up - WHITE COLLARS',
        error: 'Please provide a valid email address',
        success: null
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.render('signup', {
        title: 'Sign Up - WHITE COLLARS',
        error: 'Password must be at least 6 characters long',
        success: null
      });
    }

    // Validate user type
    if (!['jobseeker', 'employer'].includes(userType)) {
      return res.render('signup', {
        title: 'Sign Up - WHITE COLLARS',
        error: 'Invalid user type selected',
        success: null
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      return res.render('signup', {
        title: 'Sign Up - WHITE COLLARS',
        error: 'An account with this email already exists',
        success: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType: userType
    });

    await newUser.save();

    // Store success message in session
    req.session.success = 'Account created successfully! Please sign in.';
    
    // Redirect to signin page
    res.redirect('/auth/signin');

  } catch (error) {
    console.error('Signup error:', error);
    res.render('signup', {
      title: 'Sign Up - WHITE COLLARS',
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

// ============================================
// LOGOUT ROUTE
// ============================================

// GET /auth/logout - Logout user
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/auth/signin');
  });
});

module.exports = router;
