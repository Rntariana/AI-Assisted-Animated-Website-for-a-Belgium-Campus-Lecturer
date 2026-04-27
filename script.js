/* ═══════════════════════════════════════════════════
   IKRAAM SADEK PORTFOLIO — script.js
═══════════════════════════════════════════════════ */

/* ── SPLASH SCREEN ── */
document.getElementById('enterBtn').addEventListener('click', function () {
  const splash = document.getElementById('splash');
  const hud    = document.querySelector('.hud');
  splash.classList.add('hidden');
  hud.classList.add('visible');
});

/* ── LIVE CLOCKS ── */
function updateClocks() {
  const now = new Date();
  const fmt = d => d.toTimeString().slice(0, 5);
  const utc2 = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  utc2.setHours(utc2.getHours() + 2);
  document.getElementById('clock-server').textContent = fmt(utc2);
  document.getElementById('clock-local').textContent  = fmt(now);
}
updateClocks();
setInterval(updateClocks, 1000);

/* ── TAB SWITCHING with animation ── */
let currentOverlay = null;

function openTab(name, el) {
  // Deactivate old
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  // Close old overlay instantly (remove visible, let animation reset)
  document.querySelectorAll('.content-overlay').forEach(o => {
    o.classList.remove('visible');
  });

  // Short delay to let browser reset the animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('active');
      const overlay = document.getElementById('overlay-' + name);
      if (overlay) overlay.classList.add('visible');
      currentOverlay = name;
    });
  });
}

function closeOverlay() {
  document.querySelectorAll('.content-overlay').forEach(o => o.classList.remove('visible'));
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  currentOverlay = null;
}

/* ── COURSE TAB TOGGLE ── */
document.querySelectorAll('.course-tab').forEach(ct => {
  ct.addEventListener('click', () => {
    document.querySelectorAll('.course-tab').forEach(c => c.classList.remove('active'));
    ct.classList.add('active');
  });
});

/* ── SETTINGS TOGGLES ── */
function toggleSetting(el) {
  if (el.classList.contains('on')) {
    el.classList.replace('on', 'off');
    el.textContent = '✕';
  } else {
    el.classList.replace('off', 'on');
    el.textContent = '✓';
  }
}

/* ── CHARACTER CLICK → BIO OVERLAY ── */
const charFrame = document.getElementById('charFrame');
const charBio   = document.getElementById('char-bio-overlay');

charFrame.addEventListener('click', function () {
  // Brief glitch first, then open bio
  this.classList.add('glitching');
  setTimeout(() => {
    this.classList.remove('glitching');
    // Close any tab overlays first
    document.querySelectorAll('.content-overlay').forEach(o => o.classList.remove('visible'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    charBio.classList.add('visible');
  }, 320);
});

function closeCharBio() {
  charBio.classList.remove('visible');
}

/* ── FUN FACT REVEAL ── */
document.querySelectorAll('.fact-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('revealed');
  });
});

/* ── QUOTE ROTATOR ── */
const quotes = [
  '"After you get your feedback on a project, apply it — and build a portfolio on GitHub. Show companies you can do it practically, not just theoretically."',
  '"We\'ll make it work."',
  '"The best way to learn is through discussion — not a one-sided lecture."',
  '"Every problem has a solution. Sometimes you just need to look at it differently."'
];
let quoteIndex = 0;
const quoteEl = document.getElementById('quoteText');
if (quoteEl) {
  setInterval(() => {
    quoteEl.style.opacity = '0';
    setTimeout(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      quoteEl.textContent = quotes[quoteIndex];
      quoteEl.style.opacity = '1';
    }, 600);
    quoteEl.style.transition = 'opacity 0.5s ease';
  }, 6000);
}

/* ── KEYBOARD: ESC closes overlay ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeOverlay();
    closeCharBio();
  }
  if (e.key === 'Enter' && document.getElementById('splash') &&
      !document.getElementById('splash').classList.contains('hidden')) {
    document.getElementById('enterBtn').click();
  }
});