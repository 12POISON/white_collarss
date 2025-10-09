const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['public/uploads/resumes', 'public/uploads/profiles', 'public/uploads/company-logos'];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = 'public/uploads/';
    
    if (file.fieldname === 'resume') {
      uploadPath += 'resumes/';
    } else if (file.fieldname === 'profilePicture') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'companyLogo') {
      uploadPath += 'company-logos/';
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    resume: ['.pdf', '.doc', '.docx'],
    profilePicture: ['.jpg', '.jpeg', '.png', '.gif'],
    companyLogo: ['.jpg', '.jpeg', '.png', '.svg']
  };
  
  const ext = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || [];
  
  if (fieldAllowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Export upload configurations
exports.uploadResume = upload.single('resume');
exports.uploadProfile = upload.single('profilePicture');
exports.uploadCompanyLogo = upload.single('companyLogo');
exports.uploadMultiple = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 }
]);

// Error handling for multer
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash('error', 'File size too large. Maximum size is 5MB');
    } else {
      req.flash('error', 'File upload error: ' + err.message);
    }
    return res.redirect('back');
  } else if (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
  next();
};
