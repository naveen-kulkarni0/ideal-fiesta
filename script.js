/**
 * Rivanta Dental — Interaction Script
 * Handles scroll reveal animations and smooth interactions
 */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================
  const REVEAL_THRESHOLD = 0.1;
  const REVEAL_ROOT_MARGIN = '0px 0px -50px 0px';
  const STAGGER_DELAY = 80; // ms between staggered items

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const prefersReducedMotion = () => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // SCROLL REVEAL (IntersectionObserver)
  // ==========================================================================
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      // Immediately show all elements if reduced motion is preferred
      $$('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // Handle staggered children
          const staggerChildren = $$('[data-reveal]', el);
          if (staggerChildren.length > 1 && !el.dataset.staggerApplied) {
            staggerChildren.forEach((child, index) => {
              child.style.setProperty('--delay', `${index * STAGGER_DELAY}ms`);
            });
            el.dataset.staggerApplied = 'true';
          }
          
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: REVEAL_THRESHOLD,
      rootMargin: REVEAL_ROOT_MARGIN
    });

    $$('[data-reveal]').forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const target = $(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  }

  // ==========================================================================
  // PARALLAX EFFECT FOR HERO (Subtle)
  // ==========================================================================
  function initParallax() {
    if (prefersReducedMotion()) return;

    const hero = $('.hero');
    const orbs = $$('.orb');
    const logoMark = $('.logo-mark');
    
    if (!hero || orbs.length === 0) return;

    let ticking = false;
    
    function onScroll() {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);
      
      // Parallax orbs
      orbs.forEach((orb, index) => {
        const speed = 0.15 + (index * 0.05);
        const y = scrollY * speed;
        const rotate = scrollY * 0.02 * (index % 2 === 0 ? 1 : -1);
        orb.style.transform = `translate3d(0, ${y}px, 0) rotate(${rotate}deg)`;
      });
      
      // Subtle logo movement
      if (logoMark) {
        const y = scrollY * 0.08;
        logoMark.style.transform = `translate3d(0, ${y}px, 0)`;
      }
      
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // BUTTON RIPPLE EFFECT
  // ==========================================================================
  function initButtonRipple() {
    if (prefersReducedMotion()) return;

    $$('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        // Remove existing ripples
        const existing = this.querySelector('.btn-ripple');
        if (existing) existing.remove();

        // Create ripple
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: btn-ripple 0.5s ease-out forwards;
          pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        // Cleanup
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });

    // Inject ripple keyframes if not exists
    if (!document.getElementById('btn-ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'btn-ripple-styles';
      style.textContent = `
        @keyframes btn-ripple {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ==========================================================================
  // CONTACT CARD HOVER ENHANCEMENT
  // ==========================================================================
  function initContactCards() {
    $$('.contact-card, .trust-item').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      });
    });
  }

  // ==========================================================================
  // PERFORMANCE: DEBOUNCE SCROLL HANDLERS
  // ==========================================================================
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    // Wait for fonts to load for accurate measurements
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initScrollReveal();
        initSmoothScroll();
        initParallax();
        initButtonRipple();
        initContactCards();
      });
    } else {
      // Fallback
      initScrollReveal();
      initSmoothScroll();
      initParallax();
      initButtonRipple();
      initContactCards();
    }

    // Handle page load animation
    document.body.classList.add('loaded');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.RivantaDental = {
    initScrollReveal,
    initSmoothScroll,
    initParallax
  };

})();