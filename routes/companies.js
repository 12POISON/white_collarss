const express = require('express');
const router = express.Router();

// Companies listing page
router.get('/', async (req, res) => {
  try {
    const companies = [
      { id: 1, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
      { id: 2, name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
      { id: 3, name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { id: 4, name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
      { id: 5, name: 'Meta (Facebook)', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' },
      { id: 6, name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/640px-IBM_logo.svg.png' },
      { id: 7, name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Samsung_Global_Logo_Lettermark.svg/640px-Samsung_Global_Logo_Lettermark.svg.png' },
      { id: 8, name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/640px-Tesla_T_symbol.svg.png' },
      { id: 9, name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Intel_logo_2023.svg/640px-Intel_logo_2023.svg.png' },
      { id: 10, name: 'Nestle', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Nestl%C3%A9_textlogo.svg/640px-Nestl%C3%A9_textlogo.svg.png' },
      { id: 11, name: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Coca-Cola_bottle_cap.svg/640px-Coca-Cola_bottle_cap.svg.png' },
      { id: 12, name: "McDonald's", logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/McDonald%27s_square_2020.svg/640px-McDonald%27s_square_2020.svg.png' },
      { id: 13, name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/640px-Sony_logo.svg.png' },
      { id: 14, name: 'Unilever', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Unilever_text_logo.svg/640px-Unilever_text_logo.svg.png' },
      { id: 15, name: 'Oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/640px-Oracle_logo.svg.png' },
      { id: 16, name: 'Tata Group', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/640px-Tata_logo.svg.png' },
      { id: 17, name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Logo_Honda_F1.svg/640px-Logo_Honda_F1.svg.png' },
      { id: 18, name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Accenture_logo.svg/640px-Accenture_logo.svg.png' },
      { id: 19, name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Infosys_Technologies_logo.svg/640px-Infosys_Technologies_logo.svg.png' },
      { id: 20, name: 'SAP', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/SAP_Logo_2014.svg/640px-SAP_Logo_2014.svg.png' }
    ];
    
    res.render('companies', {
      title: 'Top Companies - WHITE COLLARS',
      companies
    });
    
  } catch (error) {
    console.error('Companies listing error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load companies'
    });
  }
});

module.exports = router;
