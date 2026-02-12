// Лёгкий JS без тяжёлых анимаций: якоря + мягкий reveal для блоков.
(function () {
  // Smooth scroll for internal anchors
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

  // Reveal-on-scroll (respects reduced motion)
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const revealTargets = [
    ...document.querySelectorAll('.card, .hero .pill, .hero h1, .hero .lead, .hero .hero-actions, .hero .stats')
  ];
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    },
    { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el) => io.observe(el));
})();
