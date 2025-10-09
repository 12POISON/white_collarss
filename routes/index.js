const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const Company = require('../models/company');

// Home page
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

module.exports = router;
