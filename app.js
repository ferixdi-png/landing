(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Smooth scroll for nav links
  document.querySelectorAll('a.navlink').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Tilt effect (light, no libs)
  const tilt = document.querySelector('.tilt');
  if (tilt) {
    const damp = 16;
    const onMove = (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y * damp).toFixed(2);
      const ry = (x * damp).toFixed(2);
      tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onLeave = () => tilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
    tilt.addEventListener('mousemove', onMove);
    tilt.addEventListener('mouseleave', onLeave);
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add('ready');
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();
