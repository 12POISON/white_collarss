const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 14,
    max: 120
  },
  experience: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  experienceYears: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  role: {
    type: String,
    enum: ['jobseeker', 'recruiter', 'employer', 'admin'],
    default: 'jobseeker'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Only keep indexes that are NOT unique
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
