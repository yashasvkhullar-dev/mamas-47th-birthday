// ============================================
// 🎂 Mama's 47th Birthday - Countdown Script
// ============================================

// Birthday: July 24, 2026, 00:00:00 IST (UTC+5:30)
const BIRTHDAY_ISO = '2026-07-24T00:00:00+05:30';
const BIRTHDAY_TIME = new Date(BIRTHDAY_ISO).getTime();

// DOM Elements
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownView = document.getElementById('countdown-view');
const celebrationView = document.getElementById('celebration-view');

// Track previous values for tick animation
let prevValues = { hours: '', minutes: '', seconds: '' };

/**
 * Update the countdown display
 */
function updateCountdown() {
    const now = Date.now();
    const diff = BIRTHDAY_TIME - now;

    if (diff <= 0) {
        // Birthday has arrived!
        showCelebration();
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    // Update with tick animation
    updateDigit(hoursEl, hStr, 'hours');
    updateDigit(minutesEl, mStr, 'minutes');
    updateDigit(secondsEl, sStr, 'seconds');

    requestAnimationFrame(() => {
        setTimeout(updateCountdown, 1000 - (Date.now() % 1000));
    });
}

/**
 * Update a single digit element with tick animation
 */
function updateDigit(el, value, key) {
    if (prevValues[key] !== value) {
        el.textContent = value;
        el.classList.remove('tick');
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add('tick');
        prevValues[key] = value;
    }
}

/**
 * Show the celebration view when countdown ends
 */
function showCelebration() {
    countdownView.classList.add('hidden');
    celebrationView.classList.remove('hidden');
    launchConfetti();
}

/**
 * Launch confetti burst animation
 */
function launchConfetti() {
    const colors = ['#e879a8', '#c084fc', '#fbbf24', '#f5a3c7', '#ddb4fe', '#fde68a', '#fb7185', '#a78bfa'];
    const container = document.getElementById('confetti');

    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 8 + 5) + 'px';
            piece.style.height = (Math.random() * 8 + 5) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
            piece.style.animationDelay = '0s';
            document.body.appendChild(piece);

            // Clean up after animation
            setTimeout(() => piece.remove(), 5000);
        }, i * 50);
    }

    // Repeat confetti every 6 seconds
    setInterval(() => {
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = (Math.random() * 8 + 5) + 'px';
                piece.style.height = (Math.random() * 8 + 5) + 'px';
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
                document.body.appendChild(piece);
                setTimeout(() => piece.remove(), 5000);
            }, i * 60);
        }
    }, 6000);
}

/**
 * Create floating background particles
 */
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;
    const colors = [
        'rgba(232, 121, 168, 0.4)',
        'rgba(192, 132, 252, 0.3)',
        'rgba(251, 191, 36, 0.3)',
        'rgba(245, 163, 199, 0.25)',
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateCountdown();
});
