(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Topbar elevation on scroll
  const topbar = document.querySelector('[data-elevates]');
  const setTopbar = () => {
    if (!topbar) return;
    topbar.classList.toggle('is-raised', (window.scrollY || 0) > 6);
  };
  setTopbar();
  window.addEventListener('scroll', setTopbar, { passive: true });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // Segmented switcher (hero)
  const segs = Array.from(document.querySelectorAll('[data-seg]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const medias = Array.from(document.querySelectorAll('[data-media]'));
  const overlays = Array.from(document.querySelectorAll('[data-overlay]'));
  const setPanel = (name) => {
    segs.forEach((b) => b.classList.toggle('is-active', b.dataset.seg === name));
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === name));
    medias.forEach((m) => m.classList.toggle('is-active', m.dataset.media === name));
    overlays.forEach((o) => o.classList.toggle('is-active', o.dataset.overlay === name));
  };
  segs.forEach((b) => b.addEventListener('click', () => setPanel(b.dataset.seg || 'traffic')));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting) ent.target.classList.add('is-in');
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  // Animated counters
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  if (!prefersReduced && counters.length) {
    const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    const cio = new IntersectionObserver((entries) => {
      for (const ent of entries) {
        if (!ent.isIntersecting) continue;
        const el = ent.target;
        cio.unobserve(el);
        const target = Number(el.getAttribute('data-count')) || 0;
        const start = 0;
        const dur = 900;
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          const v = Math.round(start + (target - start) * eased);
          if (el.textContent && el.textContent.includes('~')) {
            el.textContent = `~${v}`;
          } else {
            el.innerHTML = fmt(v);
          }
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.35 });
    counters.forEach((c) => cio.observe(c));
  }

  // FAQ accordion
  document.querySelectorAll('[data-faq] > button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-faq]');
      if (!item) return;
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // Sticky CTA
  const sticky = document.querySelector('[data-sticky]');
  const gate = document.querySelector('[data-sticky-gate]');
  if (sticky && gate) {
    const sio = new IntersectionObserver((entries) => {
      const ent = entries[0];
      // show when hero is out of view
      sticky.classList.toggle('is-visible', !ent.isIntersecting);
    }, { threshold: 0.01 });
    sio.observe(gate);
  }
})();
