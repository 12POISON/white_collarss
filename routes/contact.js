const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - WHITE COLLARS'
  });
});

router.post('/submit', async (req, res) => {
  try {
    req.session.success = 'Message sent successfully!';
    res.redirect('/contact');
  } catch (error) {
    console.error('Contact form error:', error);
    req.session.error = 'Failed to send message';
    res.redirect('/contact');
  }
});

module.exports = router;
