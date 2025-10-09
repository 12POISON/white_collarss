const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign In Page
router.get('/signin', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  
  res.render('signin', {
    title: 'Sign In - WHITE COLLARS'
  });
});

// Sign In POST
router.post('/signin', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      req.session.error = 'Invalid email or password';
      return res.redirect('/auth/signin');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      req.session.error = 'Invalid email or password';
      return res.redirect('/auth/signin');
    }
    
    if (user.role !== role) {
      req.session.error = 'Invalid account type';
      return res.redirect('/auth/signin');
    }
    
    if (!user.isActive) {
      req.session.error = 'Your account has been deactivated';
      return res.redirect('/auth/signin');
    }
    
    user.lastLogin = Date.now();
    await user.save();
    
    req.session.user = {
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role
    };
    
    req.session.success = 'Successfully signed in!';
    res.redirect('/');
    
  } catch (error) {
    console.error('Sign in error:', error);
    req.session.error = 'An error occurred. Please try again.';
    res.redirect('/auth/signin');
  }
});

// Sign Up POST
router.post('/signup', async (req, res) => {
  try {
    const { surname, name, email, password, qualification, age, experience, experienceYears } = req.body;
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      req.session.error = 'Email already registered';
      return res.redirect('/auth/signin');
    }
    
    const user = await User.create({
      surname,
      name,
      email,
      password,
      qualification,
      age: parseInt(age),
      experience,
      experienceYears: experience === 'yes' ? parseInt(experienceYears) : 0,
      role: 'jobseeker'
    });
    
    req.session.user = {
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role
    };
    
    req.session.success = 'Account created successfully!';
    res.redirect('/');
    
  } catch (error) {
    console.error('Sign up error:', error);
    req.session.error = error.message || 'An error occurred during registration';
    res.redirect('/auth/signin');
  }
});

// Sign Out
router.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Sign out error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
