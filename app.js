/**
 * Academic Portfolio - Interactive Functions
 * Handles SPA-like tab routing, publication filters, abstract toggles, and contact form submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initResearchFilters();
  initAbstractToggles();
  initContactForm();
});

/**
 * Hash-Based SPA Navigation
 * Allows direct linking to tabs (e.g., site.com/#cv) and browser history support.
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .logo, .nav-btn');
  const sections = document.querySelectorAll('.view-section');

  function switchTab(targetHash) {
    // Standardize default hash
    const hash = targetHash || '#bio';
    
    // Find target section
    const targetSection = document.querySelector(hash);
    if (!targetSection) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active class on sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    targetSection.classList.add('active');

    // Update active class on navigation links
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href') || link.getAttribute('data-target');
      if (href === hash) {
        link.classList.add('active');
      }
    });

    // Close mobile menu if open
    const navMenu = document.querySelector('nav');
    if (navMenu) {
      navMenu.classList.remove('mobile-active');
    }
  }

  // Handle click on nav items
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || link.getAttribute('data-target');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        window.location.hash = href;
      }
    });
  });

  // Handle hash change events
  window.addEventListener('hashchange', () => {
    switchTab(window.location.hash);
  });

  // Initial load navigation
  if (window.location.hash) {
    switchTab(window.location.hash);
  } else {
    switchTab('#bio');
  }
}

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('mobile-active')) {
        navMenu.classList.remove('mobile-active');
      }
    });
  }
}

/**
 * Research Publication Tag Filtering
 */
function initResearchFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons and add to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter publications
      pubCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          // Force reflow for fade animation
          card.offsetHeight; 
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Collapsible Publication Abstracts
 */
function initAbstractToggles() {
  const toggles = document.querySelectorAll('.abstract-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.pub-card');
      const abstract = card.querySelector('.abstract-content');
      
      const isExpanded = abstract.style.display === 'block';

      if (isExpanded) {
        abstract.style.display = 'none';
        toggle.innerHTML = '[+] Read Abstract';
      } else {
        abstract.style.display = 'block';
        toggle.innerHTML = '[-] Hide Abstract';
      }
    });
  });
}

/**
 * Mock Contact Form Submission & Validation
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');

  if (form && statusDiv) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve values
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      // Basic front-end verification
      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      // Show submitting state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      // Mock API call delay
      setTimeout(() => {
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1200);
    });
  }

  function showStatus(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.style.display = 'block'; // Reset inline style to ensure visibility on repeated submits
    statusDiv.className = `form-status ${type}`;
    
    // Auto scroll to status message
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Clear alert after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }
}
