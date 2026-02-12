/* ============================================================
   FERIXDI — Gold Premium Animations
   No external libraries. Pure vanilla JS.
   Scroll reveals, topbar shrink, smooth scroll, tilt hover.
   ============================================================ */
(function () {
  'use strict';

  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================== SMOOTH SCROLL ===================== */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (prefersReduce) return;

  /* ============================================================
     SCROLL REVEAL ANIMATIONS
     ============================================================ */

  /* Tag hero elements with staggered delays */
  const heroEl = document.querySelector('.hero-copy');
  if (heroEl) {
    ['.pill', 'h1', '.lead', '.hero-metrics', '.hero-actions', '.product-strip']
      .forEach((sel, i) => {
        const el = heroEl.querySelector(sel);
        if (!el) return;
        el.classList.add('reveal-up');
        el.dataset.delay = String(i + 1);
      });
  }

  /* Metrics pop in */
  document.querySelectorAll('.metric').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.dataset.delay = String(i + 1);
  });

  /* Product cards */
  document.querySelectorAll('.product-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.dataset.delay = String(i + 1);
  });

  /* Story blocks — alternate left/right */
  document.querySelectorAll('.story-block').forEach((block, i) => {
    const media = block.querySelector('.story-media');
    const text = block.querySelector('.story-text');
    if (media) media.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    if (text) text.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
  });

  /* CTA + footer */
  const ctaInner = document.querySelector('.cta-inner');
  if (ctaInner) ctaInner.classList.add('reveal-scale');
  const footerEl = document.querySelector('.footer-inner');
  if (footerEl) footerEl.classList.add('reveal-up');

  /* Section headings */
  document.querySelectorAll('.story > .container > h2').forEach(el => {
    el.classList.add('reveal-up');
  });

  /* IntersectionObserver */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    document.querySelectorAll('[class*="reveal-"]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[class*="reveal-"]').forEach(el => el.classList.add('in-view'));
  }

  /* ============================================================
     TOPBAR SHRINK ON SCROLL
     ============================================================ */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    let shrunk = false;
    window.addEventListener('scroll', () => {
      const s = window.scrollY > 50;
      if (s === shrunk) return;
      shrunk = s;
      if (s) {
        topbar.style.background = 'rgba(9,9,11,.95)';
        topbar.style.boxShadow = '0 4px 24px rgba(0,0,0,.5)';
      } else {
        topbar.style.background = '';
        topbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ============================================================
     TILT ON HOVER — STORY MEDIA (desktop only)
     ============================================================ */
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!isTouch) {
    document.querySelectorAll('.story-media').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateY(-5px) scale(1.015)`;
        card.style.transition = 'transform .12s ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
      });
    });
  }

})();
