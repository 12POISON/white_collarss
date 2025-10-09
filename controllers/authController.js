const User = require('../models/User');

exports.getSignIn = (req, res) => {
  res.render('signin', { 
    title: 'Sign In - WHITE COLLARS',
    error: null 
  });
};

exports.postSignIn = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('signin', { 
        title: 'Sign In - WHITE COLLARS',
        error: 'Invalid credentials' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.render('signin', { 
        title: 'Sign In - WHITE COLLARS',
        error: 'Invalid credentials' 
      });
    }

    if (user.role !== role) {
      return res.render('signin', { 
        title: 'Sign In - WHITE COLLARS',
        error: 'Access denied for this role' 
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    res.render('signin', { 
      title: 'Sign In - WHITE COLLARS',
      error: error.message 
    });
  }
};

exports.postSignUp = async (req, res) => {
  try {
    const { surname, name, email, password, qualification, age, experience, experienceYears } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('signin', { 
        title: 'Sign In - WHITE COLLARS',
        error: 'User already exists' 
      });
    }

    const user = await User.create({
      surname,
      name,
      email,
      password,
      qualification,
      age,
      experience,
      experienceYears: experience === 'yes' ? experienceYears : 0
    });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    res.render('signin', { 
      title: 'Sign In - WHITE COLLARS',
      error: error.message 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};
