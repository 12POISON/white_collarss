const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');

// ============================================
// HOME PAGE
// ============================================
router.get('/', async (req, res) => {
  try {
    const featuredJobs = await Job.find({ active: true, featured: true })
      .limit(6)
      .sort({ createdAt: -1 });
    
    const featuredCompanies = await Company.find({ featured: true, isActive: true })
      .limit(6);
    
    const stats = {
      activeJobSeekers: '50K+',
      companiesTrustUs: '5K+',
      jobsPostedMonthly: '25K+',
      successRate: '95%'
    };
    
    res.render('home', {
      title: 'WHITE COLLARS - Find Your Dream Job',
      jobs: featuredJobs,
      companies: featuredCompanies,
      stats
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load home page' 
    });
  }
});

// ============================================
// ABOUT PAGE
// ============================================
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - WHITE COLLARS'
  });
});

// ============================================
// CONTACT PAGE
// ============================================
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - WHITE COLLARS',
    error: null,
    success: null
  });
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.render('contact', {
        title: 'Contact Us - WHITE COLLARS',
        error: 'All fields are required',
        success: null
      });
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // For now, just show success message
    
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.render('contact', {
      title: 'Contact Us - WHITE COLLARS',
      error: null,
      success: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.render('contact', {
      title: 'Contact Us - WHITE COLLARS',
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
});

module.exports = router;
