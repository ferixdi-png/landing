// FERIXDI — Premium animations: scroll-reveal, stagger, parallax, topbar shrink
(function () {
  'use strict';

  /* === Respect reduced motion === */
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* === Smooth scroll for anchors === */
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

  /* === Tag elements for reveal === */
  const heroEl = document.querySelector('.hero-copy');
  if (heroEl) {
    const pill = heroEl.querySelector('.pill');
    const h1 = heroEl.querySelector('h1');
    const lead = heroEl.querySelector('.lead');
    const actions = heroEl.querySelector('.hero-actions');
    const muted = heroEl.querySelector('.muted');
    [pill, h1, lead, actions, muted].forEach((el, i) => {
      if (!el) return;
      el.classList.add('reveal-up');
      el.dataset.delay = String(i + 1);
    });
  }

  /* Metrics — staggered scale */
  document.querySelectorAll('.metric').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.dataset.delay = String(i + 1);
  });

  /* Section heads */
  document.querySelectorAll('.section-head').forEach(el => el.classList.add('reveal-up'));

  /* Story blocks — alternate left/right */
  document.querySelectorAll('.story-block').forEach((block, i) => {
    const media = block.querySelector('.story-media');
    const copy = block.querySelector('.story-copy');
    if (media) media.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    if (copy) copy.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
  });

  /* CTA */
  const ctaInner = document.querySelector('.cta-inner');
  if (ctaInner) ctaInner.classList.add('reveal-scale');

  /* Footer */
  const footer = document.querySelector('.footer-inner');
  if (footer) footer.classList.add('reveal-up');

  /* === IntersectionObserver for reveals === */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale')
      .forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale')
    .forEach(el => io.observe(el));

  /* === Parallax glow orbs on scroll === */
  const glow1 = document.querySelector('.glow');
  const glow2 = document.querySelector('.glow-2');
  if (glow1 || glow2) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (glow1) glow1.style.transform = `translate(${Math.sin(y * 0.002) * 60}px, ${y * 0.08}px)`;
        if (glow2) glow2.style.transform = `translate(${Math.cos(y * 0.002) * 40}px, ${-y * 0.05}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* === Topbar shrink on scroll === */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    let lastShrink = false;
    window.addEventListener('scroll', () => {
      const shrink = window.scrollY > 60;
      if (shrink === lastShrink) return;
      lastShrink = shrink;
      topbar.style.transition = 'padding .25s ease, background .25s ease';
      if (shrink) {
        topbar.style.background = 'rgba(13,11,8,.92)';
        topbar.style.boxShadow = '0 4px 30px rgba(0,0,0,.35)';
      } else {
        topbar.style.background = '';
        topbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* === Image tilt on hover (story cards) === */
  document.querySelectorAll('.story-media').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
