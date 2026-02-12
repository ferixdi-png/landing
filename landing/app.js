// Минимальный JS: плавный скролл + лёгкие "reveal"-анимации без влияния на скорость.
(function () {
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

  // Reveal on scroll (safe fallback)
  const canObserve = typeof IntersectionObserver !== 'undefined';
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canObserve || prefersReduce) {
    document.documentElement.classList.add('no-reveal');
    return;
  }

  const revealTargets = Array.from(
    document.querySelectorAll('.card, .metric, .product-card, .frame-block, .gallery-item, .cta, .hero-copy')
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

  revealTargets.forEach((el) => io.observe(el));
})();
