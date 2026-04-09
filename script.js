/*
/* ================================================
   MR. IKRAAM SADEK — JUNIOR LECTURER PORTFOLIO
   Belgium Campus iTversity | INL261 Group Project
   script.js
   ================================================ */

/* ===================================================
   1. PARTICLE SYSTEM
   =================================================== */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.r     = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6
      ? '#1a6fff'
      : Math.random() > 0.5 ? '#00d4ff' : '#7b2fff';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle  = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/* Initialise 120 particles */
for (let i = 0; i < 120; i++) particles.push(new Particle());

/** Draw connection lines between close particles */
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle  = '#1a6fff';
        ctx.globalAlpha  = (1 - dist / 120) * 0.12;
        ctx.lineWidth    = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

/** Main animation loop */
function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===================================================
   2. SCROLL REVEAL (IntersectionObserver)
   =================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      /* Trigger skill bars inside any revealed element */
      if (entry.target.querySelectorAll) {
        entry.target.querySelectorAll('.skill-bar-item').forEach(bar => {
          bar.classList.add('animate');
        });
      }
    }
  });
}, { threshold: 0.15 });

document
  .querySelectorAll('.scroll-reveal, .bio-card, .badges-grid, .contact-card')
  .forEach(el => revealObserver.observe(el));

/* Dedicated skill-bar observer */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('animate');
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-item').forEach(el => skillObserver.observe(el));

/* ===================================================
   3. TYPING EFFECT
   =================================================== */
const phrases = [
  'Building the next generation of developers',
  'Turning students into professionals',
  'Code. Build. Deploy. Repeat.',
  'Learning through discussion and discovery',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;

const typingEl = document.getElementById('typing-el');

function typeWriter() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    charIdx++;
    typingEl.textContent = current.slice(0, charIdx) + '\u00a0';

    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
  } else {
    charIdx--;
    typingEl.textContent = current.slice(0, charIdx) + '\u00a0';

    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  setTimeout(typeWriter, deleting ? 40 : 75);
}
typeWriter();

/* ===================================================
   4. QUOTE CAROUSEL
   =================================================== */
const quoteItems = document.querySelectorAll('.quote-item');
const quoteDots  = document.querySelectorAll('.quote-dot');
let currentQuote = 0;
let autoPlay;

function goToQuote(idx) {
  quoteItems[currentQuote].classList.remove('active');
  quoteDots[currentQuote].classList.remove('active');
  currentQuote = idx;
  quoteItems[currentQuote].classList.add('active');
  quoteDots[currentQuote].classList.add('active');
}

function nextQuote() {
  goToQuote((currentQuote + 1) % quoteItems.length);
}

/* Auto-advance every 5 seconds */
autoPlay = setInterval(nextQuote, 5000);

/**
 * Exposed globally so inline onclick attributes in HTML can call it.
 * Resets the timer so manual clicks don't fight auto-play.
 */
window.goToQuote = function (idx) {
  clearInterval(autoPlay);
  goToQuote(idx);
  autoPlay = setInterval(nextQuote, 5000);
};

/* ===================================================
   5. HERO ORB PARALLAX (mouse follow)
   =================================================== */
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth  - 0.5) * 20;
  const my = (e.clientY / window.innerHeight - 0.5) * 20;

  document.querySelectorAll('.hero-glow-orb').forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
  });
});

