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

  // Gallery images (autodetect assets/img/ai-XX.jpg)
  const labels = [
    'Крючок в первые 0.7 секунды',
    'Сцена выглядит как жизнь',
    'Смысл читается без объяснений',
    'Эмоция сильнее графики',
    'Органика любит серии',
    'Удержание решает',
    'Стабильность = дисциплина',
    'Трафик превращается в продукт'
  ];

  const masonry = document.getElementById('masonry');
  if (masonry) {
    const max = 30; // try ai-01..ai-30
    let found = 0;
    for (let i = 1; i <= max; i++) {
      const src = `assets/img/ai-${String(i).padStart(2,'0')}.jpg`;
      const wrap = document.createElement('div');
      wrap.className = 'shot';
      const img = new Image();
      img.loading = 'lazy';
      img.alt = 'AI‑Reels кадр';
      img.src = src;

      img.addEventListener('load', () => {
        wrap.classList.add('ready');
      });
      img.addEventListener('error', () => {
        wrap.remove();
      });

      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = labels[found % labels.length];

      wrap.appendChild(img);
      wrap.appendChild(label);
      masonry.appendChild(wrap);
      found++;
    }
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add('ready');
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('.shot').forEach(el => io.observe(el));
})();
