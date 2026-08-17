// Pagani Dubai — Private Showroom interactions

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navbar scroll state
const navbar = document.getElementById('navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Hero background video: pause under reduced motion, hide gracefully if the source is missing
document.querySelectorAll('.hero-video').forEach((video) => {
  if (prefersReducedMotion) { video.pause(); video.style.display = 'none'; return; }
  video.addEventListener('error', () => { video.style.display = 'none'; }, true);
});

// GSAP + ScrollTrigger power every scroll-linked animation below
gsap.registerPlugin(ScrollTrigger);

// Lenis: buttery smooth inertia scrolling, synced to GSAP's ticker
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
    });
  });
}

function smoothScrollTo(target) {
  if (lenis) lenis.scrollTo(target);
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll progress bar
gsap.to('#scrollProgress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
});

// Scroll reveal (entrance) animations
document.querySelectorAll('.reveal-el').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => el.classList.add('is-visible'),
  });
});

// Word-split scroll reveal for headings/copy
document.querySelectorAll('.split-reveal').forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((word, i) => `<span class="sr-word" style="--i:${i}"><span class="sr-word-inner">${word}</span></span>`)
    .join(' ');
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => el.classList.add('is-visible'),
  });
});

// Hero title line-mask reveal (runs on load, hero is above the fold)
requestAnimationFrame(() => {
  document.querySelector('.hero-title')?.classList.add('is-visible');
});

// Section hairlines + eyebrow ticks draw in on scroll
document.querySelectorAll('.section-line').forEach((line) => {
  const section = line.closest('section');
  gsap.to(line, { scaleX: 1, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 82%' } });
});
document.querySelectorAll('.section-tag i').forEach((tick) => {
  const section = tick.closest('section');
  gsap.to(tick, { scaleX: 1, duration: 0.7, delay: 0.15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 82%' } });
});

// Interactive 3D tilt on cards (mouse-follow)
const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion;
if (supportsHoverTilt) {
  const MAX_TILT = 6;
  document.querySelectorAll('.tilt').forEach((card) => {
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.classList.add('tilting');
        card.style.setProperty('--ry', `${px * MAX_TILT * 2}deg`);
        card.style.setProperty('--rx', `${-py * MAX_TILT * 2}deg`);
        card.style.setProperty('--tz', '8px');
      });
    });
    card.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      card.classList.remove('tilting');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--tz', '0px');
    });
  });
}

// Hero speed lines (generated so each run looks slightly different)
const speedlineHost = document.getElementById('heroSpeedlines');
if (speedlineHost && !prefersReducedMotion) {
  for (let i = 0; i < 7; i++) {
    const line = document.createElement('div');
    line.className = 'speedline';
    line.style.top = `${10 + Math.random() * 70}%`;
    line.style.width = `${30 + Math.random() * 30}%`;
    line.style.animationDelay = `${(Math.random() * 3.4).toFixed(2)}s`;
    line.style.animationDuration = `${(2.4 + Math.random() * 2).toFixed(2)}s`;
    speedlineHost.appendChild(line);
  }
}

// ===== 3D Reveal: pinned scroll-scrubbed exploded car diagram =====
const revealStage = document.getElementById('revealStage');
if (revealStage) {
  const revealFill = document.getElementById('revealFill');
  const revealProgressLabel = document.getElementById('revealProgressLabel');

  const explodeTL = gsap.timeline({
    scrollTrigger: {
      trigger: revealStage,
      start: 'top top',
      end: '+=160%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        const pct = Math.round(self.progress * 100);
        if (revealFill) revealFill.style.width = pct + '%';
        if (revealProgressLabel) {
          revealProgressLabel.textContent =
            pct < 5 ? 'Scroll to Disassemble' : pct > 95 ? 'Fully Exposed' : `${pct}% Disassembled`;
        }
      },
    },
  });

  explodeTL
    .to('#explBody', { y: -170, x: 8, opacity: 0.45, duration: 1 }, 0)
    .to('#explInterior', { y: -70, duration: 1 }, 0)
    .to('#explEngine', { y: -110, x: 36, duration: 1 }, 0)
    .to('#explSuspF', { x: 55, y: -8, duration: 1 }, 0)
    .to('#explSuspR', { x: -55, y: -8, duration: 1 }, 0)
    .to('#explWheelF', { x: 120, y: 55, duration: 1 }, 0)
    .to('#explWheelR', { x: -120, y: 55, duration: 1 }, 0)
    .to('#labelBody', { opacity: 1, y: 0, duration: 0.4 }, 0.12)
    .to('#labelInterior', { opacity: 1, y: 0, duration: 0.4 }, 0.22)
    .to('#labelEngine', { opacity: 1, y: 0, duration: 0.4 }, 0.3)
    .to('#labelSusp', { opacity: 1, y: 0, duration: 0.4 }, 0.4)
    .to('#labelWheel', { opacity: 1, y: 0, duration: 0.4 }, 0.46)
    .to('#labelChassis', { opacity: 1, y: 0, duration: 0.4 }, 0.52);
}

// ===== Performance: count-up stats =====
document.querySelectorAll('.count-up').forEach((el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = obj.val.toFixed(decimals); },
      });
    },
  });
});

// ===== Performance: spark particle canvas =====
const sparkCanvas = document.getElementById('sparkCanvas');
if (sparkCanvas && !prefersReducedMotion) {
  const ctx = sparkCanvas.getContext('2d');
  let w = 0, h = 0, particles = [], running = false, rafId = null;

  function resizeCanvas() {
    w = sparkCanvas.width = sparkCanvas.offsetWidth;
    h = sparkCanvas.height = sparkCanvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function spawnParticle() {
    particles.push({
      x: w * (0.55 + Math.random() * 0.42),
      y: h * (0.25 + Math.random() * 0.55),
      vx: -(2 + Math.random() * 5),
      vy: (Math.random() - 0.5) * 2.4,
      life: 1,
      size: 1 + Math.random() * 2.2,
      color: Math.random() > 0.5 ? '255,122,61' : '255,176,32',
    });
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    if (Math.random() < 0.55) spawnParticle();
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.02;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = `rgb(${p.color})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    particles = particles.filter((p) => p.life > 0 && p.x > -20);
    ctx.globalAlpha = 1;
    if (running) rafId = requestAnimationFrame(loop);
  }

  ScrollTrigger.create({
    trigger: '#performance',
    start: 'top 70%',
    end: 'bottom top',
    onEnter: () => { if (!running) { running = true; loop(); } },
    onEnterBack: () => { if (!running) { running = true; loop(); } },
    onLeave: () => { running = false; cancelAnimationFrame(rafId); },
    onLeaveBack: () => { running = false; cancelAnimationFrame(rafId); },
  });
}

// Performance fire streaks
const perfStreakHost = document.getElementById('perfStreaks');
if (perfStreakHost && !prefersReducedMotion) {
  for (let i = 0; i < 5; i++) {
    const streak = document.createElement('div');
    streak.className = 'perf-streak';
    streak.style.top = `${15 + Math.random() * 70}%`;
    streak.style.width = `${140 + Math.random() * 160}px`;
    perfStreakHost.appendChild(streak);

    gsap.fromTo(
      streak,
      { x: 0, opacity: 0 },
      {
        x: '-160vw',
        opacity: 1,
        duration: 1.4 + Math.random() * 1.2,
        repeat: -1,
        delay: Math.random() * 3,
        repeatDelay: 1 + Math.random() * 2,
        ease: 'power1.in',
        scrollTrigger: { trigger: '#performance', start: 'top 70%', toggleActions: 'play pause resume pause' },
      }
    );
  }
}

// ===== Private consultation form =====
const consultationForm = document.getElementById('consultationForm');
const formSuccess = document.getElementById('formSuccess');
if (consultationForm) {
  consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!consultationForm.checkValidity()) {
      consultationForm.reportValidity();
      return;
    }
    formSuccess.classList.add('show');
    showToast('Private viewing request received');
    consultationForm.reset();
  });
}

// Back to top
document.getElementById('backToTop')?.addEventListener('click', () => smoothScrollTo(0));

// Toast helper
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
