const express = require('express');
const router = express.Router();
const Job = require('../models/job');

// Jobs listing page
router.get('/', async (req, res) => {
  try {
    const { title, location, category, type } = req.query;
    
    let query = { active: true };
    
    if (title) {
      query.$text = { $search: title };
    }
    
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.employmentType = type;
    }
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    const categories = [
      'Software Development',
      'Design & UI/UX',
      'Data & Analytics',
      'Cybersecurity',
      'Finance & Accounting',
      'Mobile Development',
      'Engineering (Core)',
      'Marketing & Sales',
      'Operations & Supply Chain',
      'Human Resources',
      'Product Management',
      'Consulting',
      'Other'
    ];
    
    res.render('jobs', {
      title: 'Browse Jobs - WHITE COLLARS',
      jobs,
      categories,
      filters: { title, location, category, type }
    });
    
  } catch (error) {
    console.error('Jobs listing error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load jobs'
    });
  }
});

// Single job page
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).render('404', {
        title: '404 - Job Not Found'
      });
    }
    
    await job.incrementViews();
    
    const relatedJobs = await Job.find({
      category: job.category,
      _id: { $ne: job._id },
      active: true
    }).limit(3);
    
    res.render('job-details', {
      title: `${job.title} - ${job.company}`,
      job,
      relatedJobs
    });
    
  } catch (error) {
    console.error('Job details error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load job details'
    });
  }
});

// Apply for job
router.post('/:id/apply', async (req, res) => {
  if (!req.session.user) {
    req.session.error = 'Please sign in to apply for jobs';
    return res.redirect('/auth/signin');
  }
  
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      req.session.error = 'Job not found';
      return res.redirect('/jobs');
    }
    
    const alreadyApplied = job.applicants.some(
      applicant => applicant.user.toString() === req.session.user.id
    );
    
    if (alreadyApplied) {
      req.session.error = 'You have already applied for this job';
      return res.redirect(`/jobs/${job._id}`);
    }
    
    job.applicants.push({
      user: req.session.user.id,
      appliedAt: Date.now(),
      status: 'pending'
    });
    
    await job.save();
    
    req.session.success = 'Application submitted successfully!';
    res.redirect(`/jobs/${job._id}`);
    
  } catch (error) {
    console.error('Job application error:', error);
    req.session.error = 'Unable to submit application';
    res.redirect('/jobs');
  }
});

module.exports = router;
