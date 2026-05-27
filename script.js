/* ═══════════════════════════════════════════════════
   IKRAAM SADEK PORTFOLIO — script.js
═══════════════════════════════════════════════════ */

/* ── UTILITY ── */
const isMobile = () => window.innerWidth <= 960;

/* ══════════════════════════════════════
   SPLASH → HUD ENTRY SEQUENCE
══════════════════════════════════════ */
document.getElementById('enterBtn').addEventListener('click', function () {
  const splash = document.getElementById('splash');
  const hud    = document.querySelector('.hud');

  // Start fading splash out
  splash.classList.add('hidden');

  // Almost immediately start the HUD entrance — CSS animation-delays
  // handle all the staggering, no need to wait for splash to fully fade
  setTimeout(() => {
    hud.classList.add('hud-entering');
    hud.classList.add('visible'); // enable pointer events after animations settle
    if (isMobile()) initScrollReveal();
  }, 80); // tiny delay just to let the browser paint once
});

/* ══════════════════════════════════════
   MOBILE SCROLL REVEAL
══════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-on-scroll');

  targets.forEach(el => {
    if (!el.classList.contains('scroll-visible')) {
      el.classList.add('scroll-hidden');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        entry.target.classList.remove('scroll-hidden');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => observer.observe(el));
}

window.addEventListener('resize', () => {
  if (isMobile() && document.querySelector('.hud.visible')) {
    initScrollReveal();
  }
});

/* ══════════════════════════════════════
   LIVE CLOCKS
══════════════════════════════════════ */
function updateClocks() {
  const now  = new Date();
  const fmt  = d => d.toTimeString().slice(0, 5);
  const utc2 = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  utc2.setHours(utc2.getHours() + 2);
  document.getElementById('clock-server').textContent = fmt(utc2);
  document.getElementById('clock-local').textContent  = fmt(now);
}
updateClocks();
setInterval(updateClocks, 1000);

/* ══════════════════════════════════════
   OVERLAY CHILD STAGGER
══════════════════════════════════════ */
function staggerOverlayChildren(overlay) {
  const items = overlay.querySelectorAll(
    '.o-card, .mod-card-wrap, .ach-item, .proj-card, .act-card, .fact-card, .about-card, .bio-text-block, .about-sections .about-card'
  );
  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(14px)';
    item.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ms = i * 60;
        item.style.transition = `opacity 0.38s ease ${ms}ms, transform 0.38s ease ${ms}ms`;
        item.style.opacity    = '1';
        item.style.transform  = 'translateY(0)';
      });
    });
  });
}

/* ══════════════════════════════════════
   TAB SWITCHING
══════════════════════════════════════ */
let currentOverlay = null;

function openTab(name, el) {
  const prev = document.querySelector('.content-overlay.visible');

  if (prev) {
    prev.classList.add('sliding-out');
    setTimeout(() => prev.classList.remove('visible', 'sliding-out'), 240);
  }

  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));

  const delay = prev ? 180 : 0;
  setTimeout(() => {
    el.classList.add('active');
    const overlay = document.getElementById('overlay-' + name);
    if (overlay) {
      overlay.classList.add('visible');
      staggerOverlayChildren(overlay);
    }
    currentOverlay = name;
  }, delay);
}

function closeOverlay() {
  const active = document.querySelector('.content-overlay.visible');
  if (active) {
    active.classList.add('sliding-out');
    setTimeout(() => active.classList.remove('visible', 'sliding-out'), 240);
  }
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  currentOverlay = null;
}

/* ══════════════════════════════════════
   COURSE TAB TOGGLE
══════════════════════════════════════ */
document.querySelectorAll('.course-tab').forEach(ct => {
  ct.addEventListener('click', () => {
    document.querySelectorAll('.course-tab').forEach(c => c.classList.remove('active'));
    ct.classList.add('active');
  });
});

/* ══════════════════════════════════════
   SETTINGS TOGGLES
══════════════════════════════════════ */
function toggleSetting(el) {
  if (el.classList.contains('on')) {
    el.classList.replace('on', 'off');
    el.textContent = '✕';
  } else {
    el.classList.replace('off', 'on');
    el.textContent = '✓';
  }
}

/* ══════════════════════════════════════
   CHARACTER CLICK → BIO OVERLAY
══════════════════════════════════════ */
const charFrame = document.getElementById('charFrame');
const charBio   = document.getElementById('char-bio-overlay');

charFrame.addEventListener('click', function () {
  this.classList.add('glitching');
  setTimeout(() => {
    this.classList.remove('glitching');
    closeOverlay();
    setTimeout(() => {
      charBio.classList.add('visible');
      staggerOverlayChildren(charBio);
    }, 80);
  }, 320);
});

function closeCharBio() {
  charBio.classList.add('sliding-out');
  setTimeout(() => charBio.classList.remove('visible', 'sliding-out'), 260);
}

/* ══════════════════════════════════════
   FUN FACT REVEAL
══════════════════════════════════════ */
document.querySelectorAll('.fact-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('revealed'));
});

/* ══════════════════════════════════════
   QUOTE ROTATOR
══════════════════════════════════════ */
const quotes = [
  '"After you get your feedback on a project, apply it — and build a portfolio on GitHub. Show companies you can do it practically, not just theoretically."',
  '"We\'ll make it work."',
  '"The best way to learn is through discussion — not a one-sided lecture."',
  '"Every problem has a solution. Sometimes you just need to look at it differently."'
];
let quoteIndex = 0;
const quoteEl  = document.getElementById('quoteText');
if (quoteEl) {
  setInterval(() => {
    quoteEl.style.transition = 'opacity 0.5s ease';
    quoteEl.style.opacity    = '0';
    setTimeout(() => {
      quoteIndex            = (quoteIndex + 1) % quotes.length;
      quoteEl.textContent   = quotes[quoteIndex];
      quoteEl.style.opacity = '1';
    }, 520);
  }, 6000);
}

/* ══════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeOverlay(); closeCharBio(); }
  if (e.key === 'Enter') {
    const splash = document.getElementById('splash');
    if (splash && !splash.classList.contains('hidden')) {
      document.getElementById('enterBtn').click();
    }
  }
});