/* ==========================================================================
   AURA Atelier - Animations & Scroll Observer Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollObserver();
  initCounterAnimation();
  initParallaxEffects();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Blur & Transparency Toggle
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Intersection Observer for Scroll Reveals
   -------------------------------------------------------------------------- */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale');
  
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep performance high
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. Counter Stats Animation (Count Up)
   -------------------------------------------------------------------------- */
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds duration
      const frameRate = 1000 / 60;
      const totalFrames = Math.round(duration / frameRate);
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        // Ease out quadratic progress
        const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));

        stat.textContent = currentCount + suffix;

        if (frame >= totalFrames) {
          stat.textContent = target + suffix;
          clearInterval(counter);
        }
      }, frameRate);
    });
  };

  const statsContainer = document.querySelector('.stats-grid');
  if (statsContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsContainer);
  }
}

/* --------------------------------------------------------------------------
   4. Parallax Scroll Accent Effect
   -------------------------------------------------------------------------- */
function initParallaxEffects() {
  const heroVideo = document.querySelector('.hero-video-bg');
  if (!heroVideo) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos < window.innerHeight) {
      heroVideo.style.transform = `translateY(${scrollPos * 0.3}px)`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   5. Back To Top Floating Button Logic
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
