/**
 * Rivanta Dental — Clinical Interaction Script
 * Subtle fade-in reveals and smooth scroll only
 * No parallax, no ripple — clean medical UX
 */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================
  const REVEAL_THRESHOLD = 0.1;
  const REVEAL_ROOT_MARGIN = '0px 0px -40px 0px';
  const STAGGER_DELAY = 60; // ms between staggered items

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
  // INITIALIZATION
  // ==========================================================================
  function init() {
    // Wait for fonts to load for accurate measurements
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initScrollReveal();
        initSmoothScroll();
      });
    } else {
      // Fallback
      initScrollReveal();
      initSmoothScroll();
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

})();