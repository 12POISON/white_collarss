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
  try {
    res.render('about', {
      title: 'About Us - WHITE COLLARS'
    });
  } catch (error) {
    console.error('About page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load about page'
    });
  }
});

// ============================================
// CONTACT PAGE
// ============================================
router.get('/contact', (req, res) => {
  try {
    res.render('contact', {
      title: 'Contact Us - WHITE COLLARS',
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Contact page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load contact page'
    });
  }
});

// POST /contact - Handle contact form submission
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('contact', {
        title: 'Contact Us - WHITE COLLARS',
        error: 'Please provide a valid email address',
        success: null
      });
    }

    // Log the contact form (in production, save to DB or send email)
    console.log('Contact Form Submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date()
    });

    // Success response
    res.render('contact', {
      title: 'Contact Us - WHITE COLLARS',
      error: null,
      success: 'Thank you for contacting us! We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.render('contact', {
      title: 'Contact Us - WHITE COLLARS',
      error: 'An error occurred. Please try again later.',
      success: null
    });
  }
});

// ============================================
// JOBS PAGE
// ============================================
router.get('/jobs', async (req, res) => {
  try {
    const { search, location, type } = req.query;
    
    // Build search query
    let query = { active: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (type) {
      query.jobType = type;
    }
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('company');
    
    res.render('jobs', {
      title: 'Browse Jobs - WHITE COLLARS',
      jobs,
      search: search || '',
      location: location || '',
      type: type || ''
    });
    
  } catch (error) {
    console.error('Jobs page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load jobs page'
    });
  }
});

// ============================================
// COMPANIES PAGE
// ============================================
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.render('companies', {
      title: 'Browse Companies - WHITE COLLARS',
      companies
    });
    
  } catch (error) {
    console.error('Companies page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load companies page'
    });
  }
});

// ============================================
// PRIVACY POLICY PAGE
// ============================================
router.get('/privacy', (req, res) => {
  try {
    res.render('privacy', {
      title: 'Privacy Policy - WHITE COLLARS'
    });
  } catch (error) {
    console.error('Privacy page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load privacy policy'
    });
  }
});

// ============================================
// TERMS OF SERVICE PAGE
// ============================================
router.get('/terms', (req, res) => {
  try {
    res.render('terms', {
      title: 'Terms of Service - WHITE COLLARS'
    });
  } catch (error) {
    console.error('Terms page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load terms of service'
    });
  }
});

module.exports = router;
