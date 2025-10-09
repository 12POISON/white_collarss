const Company = require('../models/Company');

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.render('companies', { 
      title: 'Companies - WHITE COLLARS',
      companies 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      message: error.message 
    });
  }
};
