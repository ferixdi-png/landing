(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('siteNav');
  const rail = document.getElementById('attentionRailFill');

  const updateChrome = () => {
    nav && nav.classList.toggle('isCompact', scrollY > 80);
    if (rail) {
      const max = document.documentElement.scrollHeight - innerHeight;
      rail.style.transform = `scaleY(${max > 0 ? Math.min(1, scrollY / max * 1.14) : 0})`;
    }
  };
  addEventListener('scroll', updateChrome, { passive: true });
  addEventListener('resize', updateChrome);
  updateChrome();

  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.feedSignals b').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 30 + i * 10, opacity: 0 },
      { y: -25 - i * 9, opacity: .9, ease: 'none', scrollTrigger: { trigger: '.feedScene', start: 'top 75%', end: 'bottom 25%', scrub: 1.2 } }
    );
  });

  gsap.to('.routeOwn .routePortrait', {
    yPercent: -8, xPercent: 3, scale: 1.04, ease: 'none',
    scrollTrigger: { trigger: '.routes', start: 'top bottom', end: 'bottom top', scrub: 1.15 }
  });
  gsap.to('.routeAffiliate .routePortrait', {
    yPercent: 8, xPercent: -3, scale: 1.04, ease: 'none',
    scrollTrigger: { trigger: '.routes', start: 'top bottom', end: 'bottom top', scrub: 1.15 }
  });

  const proofTl = gsap.timeline({
    scrollTrigger: { trigger: '.proofFilm', start: 'top top', end: 'bottom bottom', scrub: 1.15 }
  });
  proofTl
    .fromTo('.proofWall', { scale: 1.34, opacity: .15 }, { scale: 1.08, opacity: .74, duration: .42, ease: 'none' }, 0)
    .fromTo('.proofFilmCore', { y: 70, scale: .9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .28, ease: 'none' }, .12)
    .fromTo('.proofMega', { letterSpacing: '-.12em' }, { letterSpacing: '-.09em', duration: .25, ease: 'none' }, .22)
    .fromTo('.proofStatus', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .16, ease: 'none' }, .52)
    .fromTo('.proofQuestion', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: .16, ease: 'none' }, .66)
    .to('.proofWall', { scale: .86, opacity: .24, duration: .25, ease: 'none' }, .7);

  gsap.utils.toArray('.proofWall img').forEach((el, i) => {
    gsap.to(el, {
      yPercent: (i % 2 ? -10 : 8),
      ease: 'none',
      scrollTrigger: { trigger: '.proofFilm', start: 'top bottom', end: 'bottom top', scrub: 1.4 }
    });
  });

  ScrollTrigger.refresh();
})();