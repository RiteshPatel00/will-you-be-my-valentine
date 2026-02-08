/* ============================================
   MESSAGE ARRAY — escalating bribes
   ============================================ */
const messages = [
  "Please? Click YES 🥺",
  "We can watch heated rivalries if you click YES 🍿",
  "Okay fine, we can get Popeys if you click YES 🐔",
  "I'll do your laundry for a month if you click YES 🧺",
  "We can watch love island if you click YES ❤️",
  "I'll name the other cat Rohan if you click YES 🐱",
  "I'll give you my IPTV password if you click YES 🎬",
  "I'll pretend to laugh at your jokes if you click YES 😅",
  "We can watch SNL if you click YES 📺",
  "I'll give you my kidney if you click YES 🫘",
  "I'll let you beat me in a 15k if you click YES 🏳️",
  "We can get a small dog if you click YES 🐶",
  "Fine, you can have my sweatshirts if you click YES🧥",
  "I'll take you out if you click YES ❤️"
];

let messageIndex = 0;
let lastMessageTime = 0;
const MESSAGE_COOLDOWN = 3000; // 3 seconds
const bubbleEl = document.getElementById('bubbleMessage');
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');

/* ============================================
   SPEECH BUBBLE — cycle messages with cooldown
   ============================================ */
function cycleMessage() {
  const now = Date.now();
  if (now - lastMessageTime < MESSAGE_COOLDOWN) return;
  lastMessageTime = now;

  // Advance to next message (loop)
  messageIndex = (messageIndex + 1) % messages.length;

  // Fade out, swap text, fade in
  bubbleEl.classList.add('fade-out');
  setTimeout(() => {
    bubbleEl.textContent = messages[messageIndex];
    bubbleEl.classList.remove('fade-out');
  }, 500);
}

// Auto-cycle messages in a loop
setInterval(cycleMessage, MESSAGE_COOLDOWN);

/* ============================================
   NO BUTTON — runs away from cursor
   ============================================ */
const NO_FLEE_DISTANCE = 150; // cursor proximity that triggers flee

document.addEventListener('mousemove', function(e) {
  const rect = btnNo.getBoundingClientRect();
  const noCenterX = rect.left + rect.width / 2;
  const noCenterY = rect.top + rect.height / 2;
  const dx = noCenterX - e.clientX;
  const dy = noCenterY - e.clientY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < NO_FLEE_DISTANCE) {
    // Move away from cursor
    const angle = Math.atan2(dy, dx);
    const fleeX = noCenterX + Math.cos(angle) * NO_FLEE_DISTANCE;
    const fleeY = noCenterY + Math.sin(angle) * NO_FLEE_DISTANCE;

    // Clamp within viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const newLeft = Math.max(0, Math.min(vw - rect.width, fleeX - rect.width / 2));
    const newTop = Math.max(0, Math.min(vh - rect.height, fleeY - rect.height / 2));

    btnNo.style.position = 'fixed';
    btnNo.style.left = newLeft + 'px';

    btnNo.style.top = newTop + 'px';
  }
});

// Touch support — flee on tap
btnNo.addEventListener('touchstart', function(e) {
  e.preventDefault();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = btnNo.getBoundingClientRect();
  const newLeft = Math.random() * (vw - rect.width);
  const newTop = Math.random() * (vh - rect.height);
  btnNo.style.position = 'fixed';
  btnNo.style.left = newLeft + 'px';
  btnNo.style.top = newTop + 'px';
}, { passive: false });

/* ============================================
   YES BUTTON — movement & growth logic
   ============================================ */
const MOVE_INTERVAL  = 700;    // reposition every 0.5s
const BTN_W = 60, BTN_H = 30;

let moveTimer = null;
let yesActive = true; // track if still in question phase

function getNoButtonRect() {
  return btnNo.getBoundingClientRect();
}

function rectsOverlap(r1, r2) {
  return !(r1.right < r2.left || r1.left > r2.right ||
           r1.bottom < r2.top || r1.top > r2.bottom);
}

function moveYesButton() {
  if (!yesActive) return;

  const margin = 10;
  const noRect = getNoButtonRect();

  // Fixed small size
  btnYes.style.width  = BTN_W + 'px';
  btnYes.style.height = BTN_H + 'px';

  // Pick a random position that stays in viewport and avoids the No button
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let attempts = 0, x, y;

  do {
    x = margin + Math.random() * (vw - BTN_W - margin * 2);
    y = margin + Math.random() * (vh - BTN_H - margin * 2);
    const yesRect = { left: x, top: y, right: x + BTN_W, bottom: y + BTN_H };
    if (!rectsOverlap(yesRect, noRect)) break;
    attempts++;
  } while (attempts < 50);

  btnYes.style.left = x + 'px';
  btnYes.style.top  = y + 'px';
}

// Initial placement
moveYesButton();
// Move periodically
moveTimer = setInterval(moveYesButton, MOVE_INTERVAL);

/* ============================================
   YES BUTTON CLICK — success!
   ============================================ */
btnYes.addEventListener('click', showSuccess);

const celebrationGifs = ['gifs/a.gif', 'gifs/b.gif', 'gifs/c.gif', 'gifs/d.gif'];

function showSuccess() {
  yesActive = false;
  clearInterval(moveTimer);

  // Hide question UI and Yes button
  questionScreen.classList.add('hidden');
  btnYes.style.display = 'none';

  // Show success screen with slight delay for the fade
  setTimeout(() => {
    successScreen.classList.add('visible');
    spawnConfetti();
    spawnCelebrationGifs();
  }, 300);
}

function spawnCelebrationGifs() {
  const container = document.getElementById('gifContainer');
  celebrationGifs.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'celebration-gif';
    img.style.animationDelay = (i * 0.15) + 's';
    container.appendChild(img);
  });
}

/* ============================================
   CONFETTI — heart particles on success
   ============================================ */
function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  const hearts = ['💖', '💗', '💕', '💘', '❤️', '💜', '💝', '🩷', '✨', '🌹'];

  for (let i = 0; i < 40; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (3 + Math.random() * 4) + 's';
    el.style.animationDelay = (Math.random() * 3) + 's';
    el.style.fontSize = (18 + Math.random() * 20) + 'px';
    container.appendChild(el);
  }
}

/* ============================================
   FLOATING HEARTS — background ambiance
   ============================================ */
function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const emojis = ['💕', '💗', '💖', '💘', '❤️', '🩷'];

  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (6 + Math.random() * 8) + 's';
    heart.style.animationDelay = (Math.random() * 10) + 's';
    heart.style.fontSize = (16 + Math.random() * 18) + 'px';
    container.appendChild(heart);
  }
}

createFloatingHearts();
