/* ═══════════════════════════════════════════════════════════
   POOKIE PROPOSAL — script.js
   Full interactions · Animations · Particles · Confetti
═══════════════════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════ */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    startSparkles();
    startFloatingHearts();
    typeHeroText();
    initScrollReveal();
  }, 1800);
});

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
const cursorGlow = document.getElementById("cursor-glow");
const cursorDot  = document.getElementById("cursor-dot");

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top  = `${mouseY}px`;
});

(function animateCursor() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  cursorGlow.style.left = `${glowX}px`;
  cursorGlow.style.top  = `${glowY}px`;
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("button, a, .polaroid, .reason-card, .tl-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursorGlow.style.width  = "80px";
    cursorGlow.style.height = "80px";
    cursorGlow.style.background = "radial-gradient(circle, rgba(255,133,161,0.5), transparent 70%)";
  });
  el.addEventListener("mouseleave", () => {
    cursorGlow.style.width  = "40px";
    cursorGlow.style.height = "40px";
    cursorGlow.style.background = "radial-gradient(circle, rgba(255,133,161,0.4), transparent 70%)";
  });
});

/* ══════════════════════════════════════
   MUSIC TOGGLE
══════════════════════════════════════ */
const musicBtn  = document.getElementById("music-btn");
const bgMusic   = document.getElementById("bg-music");
const musicIcon = document.getElementById("music-icon");
const musicLabel= document.getElementById("music-label");
let   musicPlaying = false;

musicBtn.addEventListener("click", () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicIcon.textContent = "🎵";
    musicLabel.textContent = "Music";
    musicBtn.classList.remove("music-playing");
  } else {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = "🎶";
    musicLabel.textContent = "Playing";
    musicBtn.classList.add("music-playing");
  }
  musicPlaying = !musicPlaying;
});

/* ══════════════════════════════════════
   SPARKLE FIELD (Hero)
══════════════════════════════════════ */
function startSparkles() {
  const field  = document.getElementById("sparkle-field");
  const emojis = ["✨", "💫", "⭐", "🌸", "💕", "🦋"];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement("span");
    el.className = "sparkle";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --dur:${2 + Math.random()*4}s;
      --delay:${Math.random()*5}s;
      font-size:${0.6 + Math.random()*1.2}rem;
    `;
    field.appendChild(el);
  }
}

/* ══════════════════════════════════════
   FLOATING HEARTS CANVAS
══════════════════════════════════════ */
const heartCanvas = document.getElementById("heart-canvas");
const hCtx = heartCanvas.getContext("2d");
let hearts = [];

function resizeHeartCanvas() {
  heartCanvas.width  = window.innerWidth;
  heartCanvas.height = window.innerHeight;
}
resizeHeartCanvas();
window.addEventListener("resize", resizeHeartCanvas);

function createHeart(x, y, size) {
  const colors = ["#ff85a1","#ffc2d1","#c9b8f0","#ffb997","#ff6b9d","#e8698a"];
  return {
    x: x || Math.random() * window.innerWidth,
    y: y || window.innerHeight + 20,
    size: size || 8 + Math.random() * 14,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 1.5,
    vy: -(0.8 + Math.random() * 1.5),
    opacity: 0.8 + Math.random() * 0.2,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.05,
    life: 1,
    decay: 0.003 + Math.random() * 0.003
  };
}

function drawHeart(ctx, x, y, size, color, opacity, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.3);
  ctx.bezierCurveTo( size*0.5, -size, size*1.2, -size*0.2, 0,  size*0.6);
  ctx.bezierCurveTo(-size*1.2, -size*0.2, -size*0.5, -size, 0, -size*0.3);
  ctx.fill();
  ctx.restore();
}

function animateHearts() {
  hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  hearts.forEach((h, i) => {
    h.x += h.vx;
    h.y += h.vy;
    h.rotation += h.rotSpeed;
    h.life -= h.decay;
    h.opacity = h.life;
    if (h.y < -50 || h.life <= 0) {
      hearts.splice(i, 1);
    } else {
      drawHeart(hCtx, h.x, h.y, h.size, h.color, Math.max(0, h.opacity), h.rotation);
    }
  });
  requestAnimationFrame(animateHearts);
}

function startFloatingHearts() {
  animateHearts();
  setInterval(() => {
    if (hearts.length < 40) hearts.push(createHeart());
  }, 600);
}

/* Spawn hearts on click */
document.addEventListener("click", e => {
  for (let i = 0; i < 8; i++) {
    hearts.push(createHeart(e.clientX, e.clientY, 6 + Math.random() * 10));
  }
});

/* ══════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════ */
const typingEl = document.getElementById("typing-text");
const phrases  = [
  "You are my sunshine on every cloudy day 🌤️",
  "My heart beats a little faster for you 💓",
  "You're my favourite person in the whole universe 🌙",
  "Every moment with you feels like magic ✨",
  "I wrote this just for you, my love 🌸"
];
let pIdx = 0, cIdx = 0, isDeleting = false;

function typeHeroText() {
  const current = phrases[pIdx];
  if (!isDeleting) {
    typingEl.textContent = current.substring(0, ++cIdx);
    if (cIdx === current.length) {
      isDeleting = true;
      setTimeout(typeHeroText, 2200);
      return;
    }
  } else {
    typingEl.textContent = current.substring(0, --cIdx);
    if (cIdx === 0) {
      isDeleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeHeroText, isDeleting ? 40 : 65);
}

/* ══════════════════════════════════════
   SCROLL TO LETTER
══════════════════════════════════════ */
function scrollToLetter() {
  document.getElementById("love-letter").scrollIntoView({ behavior: "smooth" });
}

/* ══════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach(el => observer.observe(el));

  /* Reasons cards staggered */
  const reasonCards = document.querySelectorAll(".reason-card");
  const reasonObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add("visible"), delay);
        reasonObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reasonCards.forEach(c => reasonObs.observe(c));

  /* Timeline staggered */
  const tlItems = document.querySelectorAll(".timeline-item");
  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 200);
        tlObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  tlItems.forEach(i => tlObs.observe(i));
}

/* ══════════════════════════════════════
   LOVE LETTER — ENVELOPE CLICK
══════════════════════════════════════ */
const letterEnvelope = document.getElementById("letter-envelope");
const letterPaper    = document.getElementById("letter-paper");

letterEnvelope.addEventListener("click", () => {
  letterEnvelope.style.animation = "letterUnfold 0.5s ease forwards";
  letterEnvelope.style.transform = "scaleY(0)";
  letterEnvelope.style.opacity   = "0";
  setTimeout(() => {
    letterEnvelope.style.display = "none";
    letterPaper.classList.add("active");
    /* spawn hearts from letter */
    for (let i = 0; i < 12; i++) {
      const rect = letterPaper.getBoundingClientRect();
      setTimeout(() => hearts.push(createHeart(
        rect.left + Math.random() * rect.width,
        rect.top  + rect.height / 2,
        10 + Math.random() * 12
      )), i * 80);
    }
  }, 400);
});

/* ══════════════════════════════════════
   GALLERY LIGHTBOX
══════════════════════════════════════ */
const galleryData = [
  { src: "https://picsum.photos/seed/love1/800/800", caption: "✨ Our first adventure" },
  { src: "https://picsum.photos/seed/love2/800/1000", caption: "🌸 Just us" },
  { src: "https://picsum.photos/seed/love3/800/800", caption: "💫 Golden hour" },
  { src: "https://picsum.photos/seed/love4/1200/800", caption: "🥂 Celebrating us" },
  { src: "https://picsum.photos/seed/love5/800/800", caption: "🌷 My favourite view" },
  { src: "https://picsum.photos/seed/love6/800/800", caption: "🦋 Pure magic" }
];

let currentLbIdx = 0;
const lightbox      = document.getElementById("lightbox");
const lightboxImg   = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

function openLightbox(idx) {
  currentLbIdx = idx;
  lightboxImg.src = galleryData[idx].src;
  lightboxCaption.textContent = galleryData[idx].caption;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}
function changeLightbox(dir) {
  currentLbIdx = (currentLbIdx + dir + galleryData.length) % galleryData.length;
  lightboxImg.style.opacity = "0";
  setTimeout(() => {
    lightboxImg.src = galleryData[currentLbIdx].src;
    lightboxCaption.textContent = galleryData[currentLbIdx].caption;
    lightboxImg.style.opacity = "1";
  }, 200);
}
lightboxImg.style.transition = "opacity 0.2s ease";

/* Keyboard nav for lightbox */
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")   changeLightbox(-1);
  if (e.key === "ArrowRight")  changeLightbox(1);
});

/* ══════════════════════════════════════
   PROPOSAL — "OF COURSE" BUTTON RUNS AWAY
══════════════════════════════════════ */
function runAway(btn) {
  const proposal = document.getElementById("proposal");
  const rect   = proposal.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const maxX = rect.width  - btnRect.width  - 20;
  const maxY = rect.height - btnRect.height - 20;
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;

  btn.style.position = "absolute";
  btn.style.left     = `${newX}px`;
  btn.style.top      = `${newY}px`;
}

/* ══════════════════════════════════════
   PROPOSAL — YES BUTTON
══════════════════════════════════════ */
function onYes() {
  document.getElementById("yes-popup").classList.add("active");
  document.body.style.overflow = "hidden";
  document.body.classList.add("magic-mode");
  launchConfetti();
  /* Burst of hearts */
  for (let i = 0; i < 30; i++) {
    setTimeout(() => hearts.push(createHeart(
      window.innerWidth  / 2 + (Math.random() - 0.5) * 300,
      window.innerHeight / 2 + (Math.random() - 0.5) * 200,
      10 + Math.random() * 15
    )), i * 60);
  }
  /* Launch fireworks from finale canvas after popup */
  setTimeout(startFireworks, 500);
}

function closePopup() {
  document.getElementById("yes-popup").classList.remove("active");
  document.body.style.overflow = "";
  document.getElementById("finale").scrollIntoView({ behavior: "smooth" });
  setTimeout(startFireworks, 800);
}

/* ══════════════════════════════════════
   CONFETTI
══════════════════════════════════════ */
const confettiCanvas = document.getElementById("confetti-canvas");
const cCtx = confettiCanvas.getContext("2d");
let confettiPieces = [];
let confettiRunning = false;

function resizeConfetti() {
  confettiCanvas.width  = confettiCanvas.parentElement.offsetWidth;
  confettiCanvas.height = confettiCanvas.parentElement.offsetHeight;
}
window.addEventListener("resize", resizeConfetti);
resizeConfetti();

function launchConfetti() {
  resizeConfetti();
  confettiPieces = [];
  const colors = ["#ff85a1","#c9b8f0","#ffb997","#ffc2d1","#e8698a","#ffffff","#fff07a"];
  const shapes = ["circle","rect","heart"];

  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.1
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = confettiPieces.filter(p => p.opacity > 0.01 && p.y < confettiCanvas.height + 50);

  confettiPieces.forEach(p => {
    p.wobble += p.wobbleSpeed;
    p.x  += p.vx + Math.sin(p.wobble) * 1.5;
    p.y  += p.vy;
    p.rotation += p.rotSpeed;
    if (p.y > confettiCanvas.height * 0.7) p.opacity -= 0.01;

    cCtx.save();
    cCtx.translate(p.x, p.y);
    cCtx.rotate(p.rotation);
    cCtx.globalAlpha = p.opacity;
    cCtx.fillStyle = p.color;

    if (p.shape === "circle") {
      cCtx.beginPath();
      cCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      cCtx.fill();
    } else if (p.shape === "rect") {
      cCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      /* mini heart */
      const s = p.size * 0.4;
      cCtx.beginPath();
      cCtx.moveTo(0, -s * 0.3);
      cCtx.bezierCurveTo( s*0.5, -s, s*1.2, -s*0.2, 0,  s*0.6);
      cCtx.bezierCurveTo(-s*1.2, -s*0.2, -s*0.5, -s, 0, -s*0.3);
      cCtx.fill();
    }
    cCtx.restore();
  });

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* ══════════════════════════════════════
   FIREWORKS (Finale)
══════════════════════════════════════ */
const fwCanvas = document.getElementById("fireworks-canvas");
const fwCtx    = fwCanvas.getContext("2d");
let fwParticles = [];
let fwRunning   = false;

function resizeFireworks() {
  fwCanvas.width  = fwCanvas.parentElement.offsetWidth;
  fwCanvas.height = fwCanvas.parentElement.offsetHeight;
}
window.addEventListener("resize", resizeFireworks);
resizeFireworks();

function launchFirework() {
  const x = 0.2 * fwCanvas.width + Math.random() * 0.6 * fwCanvas.width;
  const y = 0.1 * fwCanvas.height + Math.random() * 0.5 * fwCanvas.height;
  const colors = ["#ff85a1","#c9b8f0","#ffb997","#fff","#ffc2d1","#e8698a","#d9a0ff"];
  const color  = colors[Math.floor(Math.random() * colors.length)];
  const count  = 60 + Math.floor(Math.random() * 40);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = 1.5 + Math.random() * 4;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 1.5 + Math.random() * 2.5,
      opacity: 1,
      gravity: 0.06,
      decay: 0.012 + Math.random() * 0.01
    });
  }
}

function animateFireworks() {
  fwCtx.fillStyle = "rgba(0,0,0,0.12)";
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

  fwParticles = fwParticles.filter(p => p.opacity > 0.02);
  fwParticles.forEach(p => {
    p.vy     += p.gravity;
    p.x      += p.vx;
    p.y      += p.vy;
    p.opacity -= p.decay;
    p.vx     *= 0.98;

    fwCtx.save();
    fwCtx.globalAlpha = Math.max(0, p.opacity);
    fwCtx.fillStyle   = p.color;
    fwCtx.shadowColor = p.color;
    fwCtx.shadowBlur  = 6;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
    fwCtx.restore();
  });

  if (fwRunning) requestAnimationFrame(animateFireworks);
}

let fwInterval;
function startFireworks() {
  resizeFireworks();
  fwRunning = true;
  animateFireworks();
  launchFirework();
  fwInterval = setInterval(launchFirework, 700);
  setTimeout(() => {
    clearInterval(fwInterval);
    fwRunning = false;
    setTimeout(() => fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height), 3000);
  }, 6000);
}

/* ══════════════════════════════════════
   PARALLAX (subtle)
══════════════════════════════════════ */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  /* Hero parallax */
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - scrollY / (window.innerHeight * 0.7));
  }

  /* Blobs drift */
  document.querySelectorAll(".section-bg-blob").forEach((blob, i) => {
    const factor = i % 2 === 0 ? 0.08 : -0.06;
    blob.style.transform = `translateY(${scrollY * factor}px)`;
  });
});

/* ══════════════════════════════════════
   HOVER HEART TRAIL
══════════════════════════════════════ */
let lastHeartTime = 0;
document.addEventListener("mousemove", e => {
  const now = Date.now();
  if (now - lastHeartTime > 120) {
    lastHeartTime = now;
    if (Math.random() > 0.5) {
      hearts.push(createHeart(e.clientX, e.clientY, 6 + Math.random() * 8));
    }
  }
});

/* ══════════════════════════════════════
   MAKE GLOBAL FUNCTIONS ACCESSIBLE
══════════════════════════════════════ */
window.scrollToLetter  = scrollToLetter;
window.openLightbox    = openLightbox;
window.closeLightbox   = closeLightbox;
window.changeLightbox  = changeLightbox;
window.onYes           = onYes;
window.closePopup      = closePopup;
window.runAway         = runAway;

/* ══════════════════════════════════════
   FINALE AUTO-TRIGGER
   (Fireworks play when finale is visible)
══════════════════════════════════════ */
const finaleSection = document.getElementById("finale");
const finaleObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !fwRunning) {
      setTimeout(startFireworks, 500);
      finaleObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
finaleObs.observe(finaleSection);

/* ══════════════════════════════════════
   PROPOSAL SECTION — AUTO HEART RING
══════════════════════════════════════ */
const proposalSection = document.getElementById("proposal");
const proposalObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      /* Extra ambient hearts for proposal */
      setInterval(() => {
        if (document.getElementById("proposal").getBoundingClientRect().top < window.innerHeight) {
          hearts.push(createHeart(
            Math.random() * window.innerWidth,
            window.innerHeight,
            8 + Math.random() * 10
          ));
        }
      }, 300);
      proposalObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
proposalObs.observe(proposalSection);

/* ══════════════════════════════════════
   TOUCH SUPPORT — spawn hearts on tap
══════════════════════════════════════ */
document.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  for (let i = 0; i < 5; i++) {
    hearts.push(createHeart(
      touch.clientX + (Math.random() - 0.5) * 30,
      touch.clientY,
      8 + Math.random() * 10
    ));
  }
}, { passive: true });

/* ══════════════════════════════════════
   INITIAL REVEAL (hero items)
══════════════════════════════════════ */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelectorAll("#hero .reveal-up").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 300 + i * 200);
    });
  }, 2000);
});
