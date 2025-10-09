const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    req.flash('error', errorMessages.join(', '));
    
    // Store form data to repopulate
    req.session.formData = req.body;
    
    return res.redirect('back');
  }
  
  // Clear stored form data on successful validation
  delete req.session.formData;
  next();
};

// User registration validation
exports.validateSignUp = [
  body('surname')
    .trim()
    .notEmpty().withMessage('Surname is required')
    .isLength({ min: 2, max: 50 }).withMessage('Surname must be 2-50 characters'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('qualification')
    .trim()
    .notEmpty().withMessage('Qualification is required')
    .isLength({ max: 100 }).withMessage('Qualification cannot exceed 100 characters'),
  
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 14, max: 120 }).withMessage('Age must be between 14 and 120'),
  
  body('experience')
    .notEmpty().withMessage('Experience status is required')
    .isIn(['yes', 'no']).withMessage('Invalid experience value'),
  
  body('experienceYears')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('Experience years must be between 0 and 50')
];

// User sign in validation
exports.validateSignIn = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  body('role')
    .notEmpty().withMessage('Account type is required')
    .isIn(['jobseeker', 'recruiter', 'employer', 'admin']).withMessage('Invalid account type')
];

// Job creation validation
exports.validateJob = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Job title must be 5-100 characters'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  
  body('department')
    .trim()
    .notEmpty().withMessage('Department is required'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 50, max: 5000 }).withMessage('Description must be 50-5000 characters'),
  
  body('category')
    .notEmpty().withMessage('Job category is required'),
  
  body('employmentType')
    .notEmpty().withMessage('Employment type is required')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']).withMessage('Invalid employment type')
];

// Contact form validation
exports.validateContact = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,15}$/).withMessage('Please provide a valid phone number'),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
];

// Company validation
exports.validateCompany = [
  body('name')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
  
  body('industry')
    .trim()
    .notEmpty().withMessage('Industry is required'),
  
  body('employees')
    .notEmpty().withMessage('Employee count is required')
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5000-10000', '10000+']).withMessage('Invalid employee range'),
  
  body('website')
    .optional()
    .trim()
    .isURL().withMessage('Please provide a valid URL')
];
