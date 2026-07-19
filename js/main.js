/* ==========================================================================
   AURA Atelier - Interactive Features & Functional Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBeforeAfterSlider();
  initProjectFilters();
  initProjectLightbox();
  initTestimonialSlider();
  initFAQAccordion();
  initModals();
  initFormValidation();
  initRippleEffect();
});

/* --------------------------------------------------------------------------
   1. Mobile Drawer Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-overlay .nav-link');

  if (!hamburger || !mobileOverlay) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Before & After Image Comparison Slider
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.querySelector('.before-after-wrapper');
  const beforeImg = document.querySelector('.ba-before');
  const handle = document.querySelector('.ba-handle');

  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  const updateSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let positionX = x - rect.left;

    if (positionX < 0) positionX = 0;
    if (positionX > rect.width) positionX = rect.width;

    const percentage = (positionX / rect.width) * 100;
    beforeImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Mouse Events
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  container.addEventListener('mousemove', (e) => {
    if (isDragging) updateSlider(e.clientX);
  });

  // Touch Events
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
  });
}

/* --------------------------------------------------------------------------
   3. Featured Projects Category Filter
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Project Image Lightbox Preview Modal
   -------------------------------------------------------------------------- */
function initProjectLightbox() {
  const projectCards = document.querySelectorAll('.project-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');

  if (!lightboxModal || !lightboxImg) return;

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.project-title');
      const category = card.querySelector('.project-category');

      if (img) lightboxImg.src = img.src;
      if (title && lightboxTitle) lightboxTitle.textContent = title.textContent;
      if (category && lightboxCategory) lightboxCategory.textContent = category.textContent;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeBtn = lightboxModal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* --------------------------------------------------------------------------
   5. Testimonials Carousel Slider
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  const updateSlide = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlide();
    });
  }

  // Touch Swipe Support for Mobile Devices
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped left -> Next slide
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped right -> Previous slide
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlide();
    }
  };

  // Auto rotate slider every 6 seconds
  let autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlide();
  }, 6000);

  // Pause auto rotate on hover/touch
  const container = document.querySelector('.testimonials-slider');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoSlide));
    container.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlide();
      }, 6000);
    });
  }
}

/* --------------------------------------------------------------------------
   6. FAQ Collapsible Accordion
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Modals Handler (Video Tour & Book Consultation)
   -------------------------------------------------------------------------- */
function initModals() {
  // Video Modal Trigger
  const playBtn = document.getElementById('playVideoBtn');
  const videoModal = document.getElementById('videoModal');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');

  if (playBtn && videoModal) {
    playBtn.addEventListener('click', () => {
      videoModal.classList.add('active');
      if (modalVideoPlayer) modalVideoPlayer.play();
      document.body.style.overflow = 'hidden';
    });

    const closeBtn = videoModal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        videoModal.classList.remove('active');
        if (modalVideoPlayer) modalVideoPlayer.pause();
        document.body.style.overflow = '';
      });
    }
  }

  // Consultation Modal Triggers
  const consultBtns = document.querySelectorAll('.trigger-consultation');
  const consultModal = document.getElementById('consultationModal');

  if (consultBtns.length && consultModal) {
    consultBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        consultModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeBtn = consultModal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        consultModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) {
        consultModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Form Validation & Toast Notification
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const contactForm = document.getElementById('contactForm');
  const consultationForm = document.getElementById('consultationForm');
  const newsletterForm = document.getElementById('newsletterForm');

  const showToast = (message) => {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');

    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent. Our Atelier team will get back to you within 24 hours.');
      contactForm.reset();
    });
  }

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const consultModal = document.getElementById('consultationModal');
      if (consultModal) consultModal.classList.remove('active');
      document.body.style.overflow = '';
      showToast('Consultation Booked! A Senior Interior Architect will contact you shortly.');
      consultationForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed! You will now receive our exclusive Atelier journal & design trends.');
      newsletterForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   9. Button Ripple Effect
   -------------------------------------------------------------------------- */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = btn.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      btn.appendChild(circle);
    });
  });
}
