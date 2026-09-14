(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const progress = document.getElementById('progress');

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress && (progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`);
  };

  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const revealEls = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -7% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  if (!reduced && !isTouch) {
    const depthEls = [...document.querySelectorAll('.depth')];
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    const drawPointer = () => {
      cx += (tx - cx) * .075;
      cy += (ty - cy) * .075;
      depthEls.forEach(el => {
        const d = Number(el.dataset.depth || .1);
        el.style.translate = `${cx * d}px ${cy * d}px`;
      });
      raf = requestAnimationFrame(drawPointer);
    };

    addEventListener('pointermove', e => {
      tx = (e.clientX / innerWidth - .5) * 26;
      ty = (e.clientY / innerHeight - .5) * 18;
    }, { passive: true });
    drawPointer();
    addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .16;
        const y = (e.clientY - r.top - r.height / 2) * .16;
        btn.style.transform = `translate(${x}px,${y}px)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }

  if (reduced) return;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.heroFilm',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1
      }
    });

    heroTl
      .to('.heroCharacterWrap', { scale: 1.08, xPercent: -3, yPercent: 1, duration: .22, ease: 'none' }, 0)
      .to('.heroBackType', { xPercent: -10, opacity: .74, duration: .4, ease: 'none' }, .18)
      .to('.heroFrontType', { xPercent: 13, opacity: .7, duration: .4, ease: 'none' }, .22)
      .to('.phoneLayer', { scale: 1.55, xPercent: -18, yPercent: 4, duration: .3, ease: 'none' }, .24)
      .to('.heroCharacterWrap', { xPercent: 25, opacity: .15, scale: .94, duration: .25, ease: 'none' }, .52)
      .to('.heroBackType', { xPercent: -28, opacity: .12, duration: .22, ease: 'none' }, .55)
      .to('.heroFrontType', { xPercent: 34, opacity: .1, duration: .22, ease: 'none' }, .55)
      .to('.heroCopy', { opacity: 0, y: 60, duration: .18, ease: 'none' }, .55)
      .to('.phoneLayer', { scale: 7.5, xPercent: -36, yPercent: 10, duration: .38, ease: 'none' }, .58)
      .to('.phoneFrame', { borderRadius: 4, duration: .2, ease: 'none' }, .76);

    gsap.fromTo('.feedIntro',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, scrollTrigger: { trigger: '.feedScene', start: 'top 72%', end: 'top 20%', scrub: true } }
    );

    gsap.to('.feedColA', {
      yPercent: -28,
      ease: 'none',
      scrollTrigger: { trigger: '.feedScene', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.feedColB', {
      yPercent: -42,
      ease: 'none',
      scrollTrigger: { trigger: '.feedScene', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.feedColC', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: '.feedScene', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    document.querySelectorAll('.routeLine').forEach((line, i) => {
      gsap.to(line, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.routes',
          start: `${12 + i * 12}% top`,
          end: `${55 + i * 12}% top`,
          scrub: 1
        }
      });
    });

    if (innerWidth > 900) {
      const cards = gsap.utils.toArray('.approachCard');
      gsap.to('.approachTrack', {
        x: () => -(document.querySelector('.approachTrack').scrollWidth - innerWidth * .86),
        ease: 'none',
        scrollTrigger: {
          trigger: '.approach',
          start: 'top top',
          end: () => `+=${Math.max(innerWidth * 1.4, cards.length * 640)}`,
          scrub: 1,
          pin: '.approachSticky',
          invalidateOnRefresh: true
        }
      });
    }

    gsap.to('.proofCharacterEcho', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '.proof', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    ScrollTrigger.refresh();
  } else {
    // Graceful fallback if CDN is unavailable.
    const hero = document.querySelector('.heroFilm');
    const phone = document.querySelector('.phoneLayer');
    const character = document.querySelector('.heroCharacterWrap');
    const feed = document.querySelector('.feedScene');
    const onScroll = () => {
      if (hero) {
        const r = hero.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, hero.offsetHeight - innerHeight)));
        if (phone) phone.style.transform = `scale(${1 + p * 4.6}) translate(${p * -9}vw,${p * 4}vh)`;
        if (character) character.style.opacity = String(1 - Math.max(0, (p - .55) * 2.1));
      }
      if (feed) {
        const fr = feed.getBoundingClientRect();
        const fp = Math.min(1, Math.max(0, -fr.top / Math.max(1, feed.offsetHeight - innerHeight)));
        document.querySelectorAll('.feedCol').forEach((col, i) => {
          const speed = [16, 26, 11][i] || 16;
          col.style.transform = `translateY(${-fp * speed}%)`;
        });
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();