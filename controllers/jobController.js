const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
    res.render('jobs', { 
      title: 'Jobs - WHITE COLLARS',
      jobs 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: error.message 
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).render('404', { title: '404 - Job Not Found' });
    }
    res.render('job-detail', { 
      title: `${job.title} - WHITE COLLARS`,
      job 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: error.message 
    });
  }
};
