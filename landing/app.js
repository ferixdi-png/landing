/* ============================================================
   FERIXDI — Immersive 3D Energy Vortex + Premium Animations
   Dramatic Three.js scene: glowing core, particle spiral,
   rotating rings, cursor + scroll reactive
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
     THREE.JS — DRAMATIC 3D ENERGY VORTEX
     ============================================================ */
  function boot3D() {
    if (prefersReduce) return;
    if (typeof THREE === 'undefined') { console.warn('Three.js not loaded'); return; }

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    /* ---- Renderer ---- */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 6);

    const isMobile = window.innerWidth < 768;

    /* ---- Glowing Core (layered spheres for bloom feel) ---- */
    const coreGroup = new THREE.Group();

    // Inner bright core
    const coreGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xdba36b,
      transparent: true,
      opacity: 0.9
    });
    coreGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Mid glow
    const midGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const midMat = new THREE.MeshBasicMaterial({
      color: 0xc8956c,
      transparent: true,
      opacity: 0.25
    });
    coreGroup.add(new THREE.Mesh(midGeo, midMat));

    // Outer glow
    const outerGeo = new THREE.SphereGeometry(0.9, 20, 20);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xc8956c,
      transparent: true,
      opacity: 0.08
    });
    coreGroup.add(new THREE.Mesh(outerGeo, outerMat));

    // Far glow haze
    const hazeGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const hazeMat = new THREE.MeshBasicMaterial({
      color: 0xb8844c,
      transparent: true,
      opacity: 0.04
    });
    coreGroup.add(new THREE.Mesh(hazeGeo, hazeMat));

    scene.add(coreGroup);

    /* ---- Wireframe Energy Shell ---- */
    const shellGeo = new THREE.IcosahedronGeometry(1.3, 3);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xc8956c,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    /* ---- Second Shell (counter-rotate) ---- */
    const shell2Geo = new THREE.IcosahedronGeometry(1.5, 2);
    const shell2Mat = new THREE.MeshBasicMaterial({
      color: 0x7a9a6d,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const shell2 = new THREE.Mesh(shell2Geo, shell2Mat);
    scene.add(shell2);

    /* ---- Rotating Rings ---- */
    function makeRing(radius, tubeR, color, opacity) {
      const geo = new THREE.TorusGeometry(radius, tubeR, 16, 100);
      const mat = new THREE.MeshBasicMaterial({
        color, wireframe: true, transparent: true, opacity
      });
      return new THREE.Mesh(geo, mat);
    }
    const ring1 = makeRing(2.0, 0.015, 0xc8956c, 0.25);
    ring1.rotation.x = Math.PI * 0.5;
    scene.add(ring1);

    const ring2 = makeRing(2.5, 0.01, 0x7a9a6d, 0.15);
    ring2.rotation.x = Math.PI * 0.35;
    ring2.rotation.z = Math.PI * 0.25;
    scene.add(ring2);

    const ring3 = makeRing(3.0, 0.008, 0xd4a76a, 0.10);
    ring3.rotation.x = Math.PI * 0.65;
    ring3.rotation.y = Math.PI * 0.4;
    scene.add(ring3);

    /* ---- Spiral Particle Vortex ---- */
    const pCount = isMobile ? 500 : 1500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    const pSpeeds = new Float32Array(pCount);
    const pAngles = new Float32Array(pCount);
    const pRadii = new Float32Array(pCount);
    const pHeights = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pAngles[i] = Math.random() * Math.PI * 2;
      pRadii[i] = 0.8 + Math.random() * 3.5;
      pHeights[i] = (Math.random() - 0.5) * 3.0;
      pSpeeds[i] = 0.1 + Math.random() * 0.4;
      pSizes[i] = Math.random() * 3.0 + 0.5;

      const i3 = i * 3;
      pPos[i3] = Math.cos(pAngles[i]) * pRadii[i];
      pPos[i3 + 1] = pHeights[i];
      pPos[i3 + 2] = Math.sin(pAngles[i]) * pRadii[i];
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pTex = (function() {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.2, 'rgba(200,149,108,0.8)');
      grad.addColorStop(0.5, 'rgba(200,149,108,0.2)');
      grad.addColorStop(1, 'rgba(200,149,108,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c);
      return tex;
    })();

    const pMat = new THREE.PointsMaterial({
      size: isMobile ? 0.06 : 0.04,
      map: pTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ---- Floating ambient particles (dust) ---- */
    const dCount = isMobile ? 100 : 300;
    const dGeo = new THREE.BufferGeometry();
    const dPos = new Float32Array(dCount * 3);
    for (let i = 0; i < dCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 16;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xfff8eb,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const dust = new THREE.Points(dGeo, dMat);
    scene.add(dust);

    /* ---- State ---- */
    let scrollProgress = 0;
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const clock = new THREE.Clock();

    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ---- Render loop ---- */
    function frame() {
      requestAnimationFrame(frame);
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // Smooth mouse
      mx += (tmx - mx) * 0.03;
      my += (tmy - my) * 0.03;

      const speed = 1 + scrollProgress * 3;
      const pulse = Math.sin(t * 0.6) * 0.15 + 1;

      // Core breathes
      coreGroup.scale.setScalar(pulse);
      coreMat.opacity = 0.7 + Math.sin(t * 0.8) * 0.2;

      // Shells rotate
      shell.rotation.x = t * 0.1 * speed + my * 0.4;
      shell.rotation.y = t * 0.15 * speed + mx * 0.4;
      shell.rotation.z = t * 0.05;
      shellMat.opacity = 0.12 + Math.sin(t * 0.7) * 0.05;

      shell2.rotation.x = -t * 0.08 * speed;
      shell2.rotation.y = -t * 0.12 * speed + mx * 0.3;

      // Rings rotate
      ring1.rotation.z = t * 0.2 * speed;
      ring2.rotation.z = -t * 0.15 * speed;
      ring2.rotation.x = Math.PI * 0.35 + Math.sin(t * 0.3) * 0.1;
      ring3.rotation.y = t * 0.1 * speed;

      // Spiral particles orbit
      const posArr = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pAngles[i] += pSpeeds[i] * 0.008 * speed;
        pHeights[i] += Math.sin(t * 0.5 + i * 0.01) * 0.002;
        const i3 = i * 3;
        posArr[i3] = Math.cos(pAngles[i]) * pRadii[i];
        posArr[i3 + 1] = pHeights[i] + Math.sin(pAngles[i] * 2 + t * 0.3) * 0.4;
        posArr[i3 + 2] = Math.sin(pAngles[i]) * pRadii[i];
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.02;

      // Dust floats
      dust.rotation.y = t * 0.005;
      dust.rotation.x = Math.sin(t * 0.2) * 0.02;

      // Camera follows mouse subtly
      camera.position.x = mx * 0.6;
      camera.position.y = my * 0.4;
      camera.position.z = 6 - scrollProgress * 1.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    frame();
  }

  /* ---- Wait for Three.js to load, then boot ---- */
  if (typeof THREE !== 'undefined') {
    boot3D();
  } else {
    window.addEventListener('load', boot3D);
  }

  if (prefersReduce) return;

  /* ============================================================
     SCROLL REVEAL ANIMATIONS
     ============================================================ */
  function initReveals() {
    /* Tag hero elements */
    const heroEl = document.querySelector('.hero-copy');
    if (heroEl) {
      const children = [
        heroEl.querySelector('.pill'),
        heroEl.querySelector('h1'),
        heroEl.querySelector('.lead'),
        heroEl.querySelector('.hero-metrics'),
        heroEl.querySelector('.hero-actions'),
        heroEl.querySelector('.product-strip')
      ];
      children.forEach((el, i) => {
        if (!el) return;
        el.classList.add('reveal-up');
        el.dataset.delay = String(i + 1);
      });
    }

    document.querySelectorAll('.metric').forEach((el, i) => {
      el.classList.add('reveal-scale');
      el.dataset.delay = String(i + 1);
    });

    document.querySelectorAll('.product-card').forEach((el, i) => {
      el.classList.add('reveal-scale');
      el.dataset.delay = String(i + 1);
    });

    document.querySelectorAll('.story-block').forEach((block, i) => {
      const media = block.querySelector('.story-media');
      const text = block.querySelector('.story-text');
      if (media) media.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      if (text) text.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
    });

    const ctaInner = document.querySelector('.cta-inner');
    if (ctaInner) ctaInner.classList.add('reveal-scale');

    const footerEl = document.querySelector('.footer-inner');
    if (footerEl) footerEl.classList.add('reveal-up');

    /* IntersectionObserver */
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[class*="reveal-"]').forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    document.querySelectorAll('[class*="reveal-"]').forEach(el => io.observe(el));
  }
  initReveals();

  /* ============================================================
     TOPBAR SHRINK
     ============================================================ */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    let shrunk = false;
    window.addEventListener('scroll', () => {
      const s = window.scrollY > 50;
      if (s === shrunk) return;
      shrunk = s;
      topbar.style.transition = 'background .3s, box-shadow .3s';
      if (s) {
        topbar.style.background = 'rgba(13,11,8,.95)';
        topbar.style.boxShadow = '0 4px 30px rgba(0,0,0,.5)';
      } else {
        topbar.style.background = '';
        topbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ============================================================
     3D TILT ON HOVER (STORY MEDIA)
     ============================================================ */
  if (!isTouchDevice()) {
    document.querySelectorAll('.story-media').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 6}deg) translateY(-6px) scale(1.02)`;
        card.style.transition = 'transform .1s ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
      });
    });
  }

  function isTouchDevice() {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  }

})();
