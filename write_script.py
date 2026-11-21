new_js = """/**
 * Rivanta Dental — Clinical Interaction Script
 * Subtle fade-in reveals, smooth scroll, scroll progress, sticky CTA, FAQ accordion
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
      const link = e.target.closest('a[href^=\"#\"], [data-smooth-scroll]');
      if (!link) return;

      const targetId = link.getAttribute('href') || link.getAttribute('data-smooth-scroll');
      if (!targetId || targetId === '#') return;

      const target = $(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  }

  // ==========================================================================
  // SCROLL PROGRESS BAR
  // ==========================================================================
  function initScrollProgress() {
    if (prefersReducedMotion()) return;

    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  // ==========================================================================
  // MOBILE STICKY CTA
  // ==========================================================================
  function initStickyCTA() {
    if (window.innerWidth > 768) return;

    const hero = $('.hero');
    if (!hero) return;

    const cta = document.createElement('div');
    cta.className = 'mobile-sticky-cta';
    cta.innerHTML = `
      <a href=\"https://click4appointment.com/clinic-details/rivantadental:dentofacialrehabilitationandimplantcentre-4580\" 
         class=\"btn btn-primary\" 
         target=\"_blank\" 
         rel=\"noopener noreferrer\">
        <span class=\"btn-text\">Book Consultation</span>
        <svg class=\"btn-arrow\" viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\">
          <path d=\"M5 12h14M12 5l7 7-7 7\"/>
        </svg>
      </a>
    `;
    document.body.appendChild(cta);

    const observer = new IntersectionObserver(([entry]) => {
      cta.classList.toggle('hidden', entry.isIntersecting);
    }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });

    observer.observe(hero);
  }

  // ==========================================================================
  // FAQ ACCORDION
  // ==========================================================================
  function initFAQAccordion() {
    $$('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        const answerId = button.getAttribute('aria-controls');
        const answer = answerId ? $(`#${answerId}`) : null;

        button.setAttribute('aria-expanded', String(!expanded));

        if (answer) {
          if (!expanded) {
            answer.hidden = false;
          } else {
            // Wait for animation to complete before hiding
            answer.style.animation = 'faq-reveal 250ms cubic-bezier(0.4, 0, 0.2, 1) reverse';
            setTimeout(() => { answer.hidden = true; answer.style.animation = ''; }, 250);
          }
        }
      });

      // Keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
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
        initScrollProgress();
        initStickyCTA();
        initFAQAccordion();
      });
    } else {
      // Fallback
      initScrollReveal();
      initSmoothScroll();
      initScrollProgress();
      initStickyCTA();
      initFAQAccordion();
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
})();"""

with open('C:/Users/thena/project/Rivanta/ideal-fiesta/script.js', 'w', encoding='utf-8') as f:
    f.write(new_js)
print("Done")