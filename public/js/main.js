// ========================================
// WHITE COLLARS - Main JavaScript File
// ========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize all features
  initNavbar();
  initSearchForm();
  initPasswordStrength();
  initFormValidation();
  initAnimations();
  initStarRating();
  initContactForm();
  initJobApplications();
  initCompanyCards();
  initBackToTop();
  initTooltips();
  initAlerts();
  
});

// ========================================
// Navbar Functionality
// ========================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(44, 62, 80, 0.98)';
      navbar.style.boxShadow = '0 8px 24px rgba(44, 62, 80, 0.25)';
    } else {
      navbar.style.background = 'rgba(44, 62, 80, 0.95)';
      navbar.style.boxShadow = '0 4px 20px rgba(44, 62, 80, 0.15)';
    }
  });

  // Active nav link highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath) {
      link.classList.add('active');
    }
  });
}

// ========================================
// Search Form
// ========================================
function initSearchForm() {
  const searchForm = document.querySelector('.search-form');
  if (!searchForm) return;

  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const jobTitle = document.getElementById('jobTitle')?.value.trim();
    const location = document.getElementById('location')?.value.trim();
    
    if (!jobTitle && !location) {
      showAlert('Please enter a job title or location', 'warning');
      return;
    }
    
    // Build query string
    const params = new URLSearchParams();
    if (jobTitle) params.append('title', jobTitle);
    if (location) params.append('location', location);
    
    // Redirect to jobs page with filters
    window.location.href = `/jobs?${params.toString()}`;
  });
}

// ========================================
// Password Strength Indicator
// ========================================
function initPasswordStrength() {
  const passwordInput = document.getElementById('createPassword') || document.getElementById('password');
  if (!passwordInput) return;

  const strengthBar = document.getElementById('strengthBar');
  const strengthLabel = document.getElementById('strengthLabel');
  
  if (!strengthBar || !strengthLabel) return;

  passwordInput.addEventListener('input', function() {
    const password = this.value;
    const result = evaluatePasswordStrength(password);
    
    strengthBar.style.width = result.percent + '%';
    strengthBar.className = 'strength-line ' + result.className;
    strengthLabel.textContent = result.text;
    strengthLabel.className = 'strength-label ' + result.className;
  });
}

function evaluatePasswordStrength(password) {
  let score = 0;
  
  if (!password) return { score: 0, text: '', percent: 0, className: 'strength-weak' };
  
  if (password.length >= 6) score++;
  if (/\d/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 10) score++;

  if (score <= 2) return { score, text: 'Weak', percent: 25, className: 'strength-weak' };
  if (score === 3) return { score, text: 'Fair', percent: 50, className: 'strength-fair' };
  if (score === 4 || score === 5) return { score, text: 'Good', percent: 75, className: 'strength-good' };
  if (score >= 6) return { score, text: 'Great', percent: 100, className: 'strength-great' };
  
  return { score: 0, text: '', percent: 0, className: 'strength-weak' };
}

// ========================================
// Form Validation
// ========================================
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  let isValid = true;
  let errorMessage = '';
  
  // Check if required field is empty
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Email validation
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Password validation
  if (field.id === 'password' || field.id === 'createPassword') {
    if (value.length < 6) {
      isValid = false;
      errorMessage = 'Password must be at least 6 characters';
    }
  }
  
  // Number validation
  if (type === 'number') {
    const min = field.getAttribute('min');
    const max = field.getAttribute('max');
    const numValue = parseInt(value);
    
    if (min && numValue < parseInt(min)) {
      isValid = false;
      errorMessage = `Value must be at least ${min}`;
    }
    if (max && numValue > parseInt(max)) {
      isValid = false;
      errorMessage = `Value must not exceed ${max}`;
    }
  }
  
  // Show/hide error message
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains('form-error')) {
    if (!isValid) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
      field.classList.add('error');
    } else {
      errorElement.classList.remove('show');
      field.classList.remove('error');
    }
  }
  
  return isValid;
}

// ========================================
// Scroll Animations
// ========================================
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.job-card, .category-card, .company-card, .contact-card, .stat-item, .benefit-item, .culture-card');
  
  animateElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(element);
  });
}

// ========================================
// Star Rating System
// ========================================
function initStarRating() {
  const starRating = document.querySelector('.star-rating');
  if (!starRating) return;

  const stars = starRating.querySelectorAll('.star');
  const ratingText = document.querySelector('.rating-text');
  let selectedRating = 0;

  stars.forEach((star, index) => {
    // Click event
    star.addEventListener('click', function() {
      selectedRating = index + 1;
      updateStars(selectedRating);
      if (ratingText) {
        ratingText.textContent = `${selectedRating}.0`;
      }
      
      // Add selected animation
      this.classList.add('selected');
      setTimeout(() => {
        this.classList.remove('selected');
      }, 300);
    });

    // Hover events
    star.addEventListener('mouseenter', function() {
      updateStars(index + 1);
    });
  });

  starRating.addEventListener('mouseleave', function() {
    updateStars(selectedRating);
  });

  function updateStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
  }
}

// ========================================
// Contact Form
// ========================================
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch('/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showAlert('Message sent successfully! We\'ll get back to you soon.', 'success');
        this.reset();
      } else {
        showAlert(result.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('An error occurred. Please try again later.', 'error');
    }
  });
}

// ========================================
// Job Applications
// ========================================
function initJobApplications() {
  const applyButtons = document.querySelectorAll('.apply-btn');
  
  applyButtons.forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const jobId = this.dataset.jobId;
      const jobTitle = this.dataset.jobTitle;
      
      if (!jobId) return;
      
      // Check if user is logged in
      const isLoggedIn = document.body.dataset.userLoggedIn === 'true';
      
      if (!isLoggedIn) {
        showAlert('Please sign in to apply for jobs', 'warning');
        setTimeout(() => {
          window.location.href = '/auth/signin?redirect=/jobs/' + jobId;
        }, 1500);
        return;
      }
      
      // Show confirmation
      if (confirm(`Apply for ${jobTitle}?\n\nYour profile will be submitted to the employer.`)) {
        try {
          const response = await fetch('/jobs/apply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jobId })
          });
          
          const result = await response.json();
          
          if (result.success) {
            showAlert('Application submitted successfully!', 'success');
            this.textContent = 'Applied';
            this.disabled = true;
          } else {
            showAlert(result.message || 'Application failed', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          showAlert('An error occurred. Please try again.', 'error');
        }
      }
    });
  });
}

// ========================================
// Company Cards
// ========================================
function initCompanyCards() {
  const companyCards = document.querySelectorAll('.company-card, .companies-table td');
  
  companyCards.forEach(card => {
    card.addEventListener('click', function() {
      const companyId = this.dataset.companyId;
      const companyName = this.dataset.companyName || this.querySelector('.company-name')?.textContent;
      
      if (companyId) {
        window.location.href = `/companies/${companyId}`;
      } else if (companyName) {
        showAlert(`Viewing ${companyName} career opportunities`, 'info');
      }
    });
  });
}

// ========================================
// Back to Top Button
// ========================================
function initBackToTop() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  
  backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 1000;
  `;
  
  document.body.appendChild(backToTopBtn);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  backToTopBtn.addEventListener('mouseenter', function() {
    this.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
    this.style.transform = 'scale(1.1)';
  });
  
  backToTopBtn.addEventListener('mouseleave', function() {
    this.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
    this.style.transform = 'scale(1)';
  });
}

// ========================================
// Tooltips
// ========================================
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltipText = this.dataset.tooltip;
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(44, 62, 80, 0.95);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 10000;
        white-space: nowrap;
        pointer-events: none;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
      
      this.tooltipElement = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
      if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
      }
    });
  });
}

// ========================================
// Alert System
// ========================================
function initAlerts() {
  // Close alert buttons
  const closeButtons = document.querySelectorAll('.alert-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.parentElement.remove();
    });
  });
  
  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  
  const colors = {
    success: 'background: #d4edda; color: #155724; border-left: 4px solid #28a745;',
    error: 'background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;',
    warning: 'background: #fff3cd; color: #856404; border-left: 4px solid #ffc107;',
    info: 'background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8;'
  };
  
  alertDiv.style.cssText += colors[type] || colors.info;
  alertDiv.innerHTML = `
    <span>${message}</span>
    <button class="alert-close" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
  `;
  
  document.body.appendChild(alertDiv);
  
  alertDiv.querySelector('.alert-close').addEventListener('click', function() {
    alertDiv.remove();
  });
  
  setTimeout(() => {
    alertDiv.style.opacity = '0';
    setTimeout(() => alertDiv.remove(), 300);
  }, 5000);
}

// ========================================
// Utility Functions
// ========================================

// Debounce function for search inputs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add animation class
const addAnimation = {
  fadeIn: (element) => {
    element.style.animation = 'fadeIn 0.5s ease-in';
  },
  slideIn: (element) => {
    element.style.animation = 'slideIn 0.3s ease';
  }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .back-to-top:hover {
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%) !important;
  }
`;
document.head.appendChild(style);

// Export functions for use in other scripts
window.WHITE_COLLARS = {
  showAlert,
  formatDate,
  debounce,
  validateField,
  evaluatePasswordStrength
};
