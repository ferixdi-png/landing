/* ============================================================
   FERIXDI — Gold Premium + 3D Energy Vortex
   Three.js background + CSS reveals + vanilla JS animations
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

  /* ============================================================
     THREE.JS — 3D ENERGY VORTEX BACKGROUND
     ============================================================ */
  function boot3D() {
    if (prefersReduce) return;
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    try {

    const W = () => window.innerWidth, H = () => window.innerHeight;
    const isMobile = W() < 768;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 200);
    camera.position.set(0, 0, 6);

    /* — Glowing core (layered spheres = fake bloom) — */
    const core = new THREE.Group();
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffd84a, transparent: true, opacity: 0.9 });
    core.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), coreMat));
    core.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xe8b830, transparent: true, opacity: 0.22 })));
    core.add(new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xe8b830, transparent: true, opacity: 0.07 })));
    core.add(new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xd4a020, transparent: true, opacity: 0.03 })));
    scene.add(core);

    /* — Wireframe shells — */
    const shellMat = new THREE.MeshBasicMaterial({ color: 0xffd84a, wireframe: true, transparent: true, opacity: 0.13 });
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 3), shellMat);
    scene.add(shell);
    const shell2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 2),
      new THREE.MeshBasicMaterial({ color: 0xe8b830, wireframe: true, transparent: true, opacity: 0.07 }));
    scene.add(shell2);

    /* — Rings — */
    function ring(r, tube, color, op) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 100),
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: op }));
      return m;
    }
    const r1 = ring(2.0, 0.015, 0xffd84a, 0.22); r1.rotation.x = Math.PI * 0.5; scene.add(r1);
    const r2 = ring(2.5, 0.01, 0xe8b830, 0.14); r2.rotation.set(Math.PI*.35, 0, Math.PI*.25); scene.add(r2);
    const r3 = ring(3.0, 0.008, 0xd4a020, 0.09); r3.rotation.set(Math.PI*.65, Math.PI*.4, 0); scene.add(r3);

    /* — Particle vortex — */
    const pN = isMobile ? 400 : 1200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pN * 3);
    const pSpd = new Float32Array(pN), pAng = new Float32Array(pN);
    const pRad = new Float32Array(pN), pHgt = new Float32Array(pN);
    for (let i = 0; i < pN; i++) {
      pAng[i] = Math.random() * Math.PI * 2;
      pRad[i] = 0.8 + Math.random() * 3.5;
      pHgt[i] = (Math.random() - 0.5) * 3;
      pSpd[i] = 0.1 + Math.random() * 0.4;
      const j = i * 3;
      pPos[j] = Math.cos(pAng[i]) * pRad[i];
      pPos[j+1] = pHgt[i];
      pPos[j+2] = Math.sin(pAng[i]) * pRad[i];
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    /* Particle glow texture */
    const pCvs = document.createElement('canvas'); pCvs.width = pCvs.height = 64;
    const pCtx = pCvs.getContext('2d');
    const grad = pCtx.createRadialGradient(32,32,0,32,32,32);
    grad.addColorStop(0,'rgba(255,255,255,1)');
    grad.addColorStop(0.15,'rgba(255,216,74,0.9)');
    grad.addColorStop(0.5,'rgba(232,184,48,0.2)');
    grad.addColorStop(1,'rgba(232,184,48,0)');
    pCtx.fillStyle = grad; pCtx.fillRect(0,0,64,64);

    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: isMobile ? 0.055 : 0.04, map: new THREE.CanvasTexture(pCvs),
      transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    scene.add(particles);

    /* — Dust — */
    const dN = isMobile ? 80 : 250;
    const dGeo = new THREE.BufferGeometry();
    const dPos = new Float32Array(dN * 3);
    for (let i = 0; i < dN; i++) {
      dPos[i*3]=(Math.random()-.5)*16; dPos[i*3+1]=(Math.random()-.5)*10; dPos[i*3+2]=(Math.random()-.5)*10;
    }
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    scene.add(new THREE.Points(dGeo, new THREE.PointsMaterial({
      size: 0.02, color: 0xfff8eb, transparent: true, opacity: 0.25,
      depthWrite: false, blending: THREE.AdditiveBlending
    })));

    /* — State — */
    let scroll = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
    const clock = new THREE.Clock();
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - H();
      scroll = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });
    window.addEventListener('mousemove', (e) => {
      tmx = (e.clientX / W()) * 2 - 1; tmy = -(e.clientY / H()) * 2 + 1;
    }, { passive: true });
    window.addEventListener('resize', () => {
      camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H());
    });

    /* — Loop — */
    (function frame() {
      requestAnimationFrame(frame);
      const t = clock.getElapsedTime();
      mx += (tmx - mx) * 0.03; my += (tmy - my) * 0.03;
      const spd = 1 + scroll * 3;

      core.scale.setScalar(1 + Math.sin(t * 0.6) * 0.15);
      coreMat.opacity = 0.7 + Math.sin(t * 0.8) * 0.2;

      shell.rotation.set(t*.1*spd + my*.4, t*.15*spd + mx*.4, t*.05);
      shell2.rotation.set(-t*.08*spd, -t*.12*spd + mx*.3, 0);

      r1.rotation.z = t * 0.2 * spd;
      r2.rotation.z = -t * 0.15 * spd;
      r3.rotation.y = t * 0.1 * spd;

      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < pN; i++) {
        pAng[i] += pSpd[i] * 0.008 * spd;
        const j = i * 3;
        arr[j] = Math.cos(pAng[i]) * pRad[i];
        arr[j+1] = pHgt[i] + Math.sin(pAng[i]*2 + t*.3) * 0.4;
        arr[j+2] = Math.sin(pAng[i]) * pRad[i];
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.02;

      camera.position.set(mx * 0.6, my * 0.4, 6 - scroll * 1.5);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    })();
    } catch (e) { console.warn('3D init failed:', e); }
  }

  /* Boot 3D when Three.js is ready (async loading, max 5s) */
  let boot3DAttempts = 0;
  function tryBoot3D() {
    if (typeof THREE !== 'undefined') boot3D();
    else if (++boot3DAttempts < 50) setTimeout(tryBoot3D, 100);
  }
  if (typeof THREE !== 'undefined') boot3D();
  else if (document.readyState === 'complete') setTimeout(tryBoot3D, 50);
  else window.addEventListener('load', tryBoot3D);

  if (prefersReduce) return;

  /* ============================================================
     SCROLL REVEAL ANIMATIONS
     ============================================================ */

  /* Tag hero elements with staggered delays */
  const heroEl = document.querySelector('.hero-copy');
  if (heroEl) {
    ['.pill', 'h1', '.lead', '.hero-metrics', '.hero-actions']
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
     STICKY MOBILE CTA — show after hero, hide at #final
     ============================================================ */
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const heroSection = document.querySelector('.hero');
    const finalSection = document.getElementById('final');
    let stickyVisible = false;
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
      const finalTop = finalSection ? finalSection.getBoundingClientRect().top : Infinity;
      const shouldShow = heroBottom < 0 && finalTop > window.innerHeight * 0.5;
      if (shouldShow !== stickyVisible) {
        stickyVisible = shouldShow;
        stickyCta.style.transform = shouldShow ? 'translateY(0)' : 'translateY(100%)';
        stickyCta.style.opacity = shouldShow ? '1' : '0';
      }
    }, { passive: true });
    stickyCta.style.transform = 'translateY(100%)';
    stickyCta.style.opacity = '0';
    stickyCta.style.transition = 'transform .3s ease, opacity .3s ease';
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
