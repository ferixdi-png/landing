/* ============================================================
   FERIXDI — Immersive 3D Background + Scroll Animations
   Three.js energy orb with particles, cursor + scroll reactive
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

  /* ================ THREE.JS 3D BACKGROUND ================ */
  (function init3D() {
    if (prefersReduce) return;
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4;

    /* --- Energy Orb (icosahedron with custom shader) --- */
    const orbGeo = new THREE.IcosahedronGeometry(1.2, 4);
    const orbMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#c8956c') },
        uColor2: { value: new THREE.Color('#7a9a6d') }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vNormal = normal;
          vPos = position;
          float displacement = sin(position.x * 3.0 + uTime * 0.8) *
                               sin(position.y * 3.0 + uTime * 0.6) *
                               sin(position.z * 3.0 + uTime * 0.7) * 0.15;
          displacement += sin(uTime * 0.3 + uScroll * 2.0) * 0.05;
          vec3 newPos = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          float mix1 = sin(vPos.y * 2.0 + uTime * 0.4) * 0.5 + 0.5;
          vec3 col = mix(uColor1, uColor2, mix1);
          float alpha = fresnel * 0.7 + 0.05;
          alpha += sin(uTime * 0.5) * 0.05;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      wireframe: true,
      depthWrite: false
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);

    /* --- Particles (traffic flow) --- */
    const pCount = window.innerWidth < 640 ? 200 : 600;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pVelocities = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2.5;
      pPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i3 + 2] = r * Math.cos(phi);
      pVelocities[i3] = (Math.random() - 0.5) * 0.003;
      pVelocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
      pVelocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: window.innerWidth < 640 ? 0.025 : 0.018,
      color: new THREE.Color('#c8956c'),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* --- Inner glow sphere --- */
    const glowGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#c8956c'),
      transparent: true,
      opacity: 0.08
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    /* --- State --- */
    let scrollY = 0;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let clock = new THREE.Clock();

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* --- Animation loop --- */
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      orbMat.uniforms.uTime.value = t;
      orbMat.uniforms.uScroll.value = scrollY;
      orbMat.uniforms.uMouse.value.set(mouseX, mouseY);

      orb.rotation.x = t * 0.08 + mouseY * 0.3;
      orb.rotation.y = t * 0.12 + mouseX * 0.3;

      const scrollSpeed = 1 + scrollY * 2;
      particles.rotation.y = t * 0.03 * scrollSpeed;
      particles.rotation.x = t * 0.02 * scrollSpeed + mouseY * 0.15;

      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < pCount * 3; i++) {
        pos[i] += pVelocities[i] * scrollSpeed;
      }
      pGeo.attributes.position.needsUpdate = true;

      glow.scale.setScalar(1 + Math.sin(t * 0.8) * 0.15);
      glow.material.opacity = 0.06 + Math.sin(t * 0.5) * 0.03;

      camera.position.x = mouseX * 0.3;
      camera.position.y = mouseY * 0.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();
  })();

  if (prefersReduce) return;

  /* ================ SCROLL REVEAL ANIMATIONS ================ */

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

  /* Metrics stagger */
  document.querySelectorAll('.metric').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.dataset.delay = String(i + 1);
  });

  /* Product cards */
  document.querySelectorAll('.product-card').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.dataset.delay = String(i + 1);
  });

  /* Story blocks alternate */
  document.querySelectorAll('.story-block').forEach((block, i) => {
    const media = block.querySelector('.story-media');
    const text = block.querySelector('.story-text');
    if (media) media.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    if (text) text.classList.add(i % 2 === 0 ? 'reveal-right' : 'reveal-left');
  });

  /* CTA */
  const ctaInner = document.querySelector('.cta-inner');
  if (ctaInner) ctaInner.classList.add('reveal-scale');

  /* Footer */
  const footer = document.querySelector('.footer-inner');
  if (footer) footer.classList.add('reveal-up');

  /* IntersectionObserver */
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
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-scale')
    .forEach(el => io.observe(el));

  /* ================ TOPBAR SHRINK ================ */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    let lastShrink = false;
    window.addEventListener('scroll', () => {
      const shrink = window.scrollY > 50;
      if (shrink === lastShrink) return;
      lastShrink = shrink;
      if (shrink) {
        topbar.style.background = 'rgba(13,11,8,.92)';
        topbar.style.boxShadow = '0 4px 30px rgba(0,0,0,.4)';
      } else {
        topbar.style.background = '';
        topbar.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ================ 3D TILT ON STORY MEDIA ================ */
  document.querySelectorAll('.story-media').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
