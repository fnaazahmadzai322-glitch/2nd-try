// Sharique Aslam — Portfolio interactions

document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll state
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
};
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

// GSAP + ScrollTrigger power every scroll-linked animation below
gsap.registerPlugin(ScrollTrigger);

// Lenis: buttery smooth inertia scrolling, synced to GSAP's ticker so
// ScrollTrigger positions stay accurate. Skipped for reduced-motion users.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;

if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Route in-page anchor links (nav, scroll cue) through Lenis for a smooth glide
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
    });
  });
}

// Scroll reveal animation (3D card entrances), triggered via ScrollTrigger
document.querySelectorAll('.reveal').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => el.classList.add('is-visible'),
  });
});

// Word-split scroll reveal: wrap each word so it can slide/fade in individually
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

// Hero name line-mask reveal (runs once on load, hero is above the fold)
requestAnimationFrame(() => {
  document.querySelector('.hero-name')?.classList.add('is-visible');
});

// Animated hairline "lines": section dividers and eyebrow-tag ticks draw in on scroll
document.querySelectorAll('.section-line').forEach((line) => {
  const section = line.closest('section');
  gsap.to(line, {
    scaleX: 1,
    duration: 1.3,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 82%' },
  });
});

document.querySelectorAll('.section-tag i').forEach((tick) => {
  const section = tick.closest('section');
  gsap.to(tick, {
    scaleX: 1,
    duration: 0.7,
    delay: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 82%' },
  });
});

// Interactive 3D tilt on cards (mouse-follow), skipped for touch/reduced-motion
const supportsHoverTilt =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (supportsHoverTilt) {
  const MAX_TILT = 7;
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
        card.style.setProperty('--tz', '10px');
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

// Copy-to-clipboard (Discord handle)
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied "${value}" to clipboard`);
    } catch (err) {
      showToast('Copy failed — please copy manually');
    }
  });
});
