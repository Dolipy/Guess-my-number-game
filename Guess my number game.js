'use strict';

// ========== DOM ELEMENTS ==========
const guessInput = document.querySelector('#guess-input');
const checkBtn = document.querySelector('#check-btn');
const againBtn = document.querySelector('#Again');
const restartBtn = document.querySelector('#restart');
const exitBtn = document.querySelector('#exit');
const secretNumberEl = document.querySelector('#secret-number');
const secretBox = document.querySelector('#secret-box');
const guessingText = document.querySelector('#guessing-text');
const feedbackCard = document.querySelector('#feedback-card');
const livesValue = document.querySelector('#lives-value');
const scoreValue = document.querySelector('#score-value');
const highscoreValue = document.querySelector('#highscore-value');
const gameTitle = document.querySelector('#game-title');
const gameOverOverlay = document.querySelector('#game-over-overlay');
const overlayRestartBtn = document.querySelector('#overlay-restart-btn');
const overlayTitle = document.querySelector('#overlay-title');
const overlayMessage = document.querySelector('#overlay-message');
const statLives = document.querySelector('#stat-lives');
const statScore = document.querySelector('#stat-score');
const statHighscore = document.querySelector('#stat-highscore');

// ========== GAME STATE ==========
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let lives = 20;
let highscore = 0;
let score = 0;
let gameActive = true;

// ========== PARTICLES BACKGROUND ==========
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            const colors = ['168,85,247', '236,72,153', '34,211,238', '250,204,21'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
})();

// ========== CONFETTI ==========
function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const COLORS = ['#a855f7', '#ec4899', '#22d3ee', '#facc15', '#34d399', '#f87171', '#ffffff'];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: Math.random() * -18 - 4,
            size: Math.random() * 8 + 4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.35,
            opacity: 1,
        });
    }

    let frame = 0;
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        pieces.forEach(p => {
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.opacity -= 0.005;

            if (p.opacity > 0) {
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }
        });

        frame++;
        if (alive && frame < 200) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animateConfetti();
}

// ========== HELPER FUNCTIONS ==========
function popStat(element) {
    element.classList.remove('pop');
    void element.offsetWidth; // reflow
    element.classList.add('pop');
}

function setFeedback(text, type) {
    guessingText.textContent = text;
    feedbackCard.classList.remove('correct', 'wrong');
    if (type) {
        feedbackCard.classList.add(type);
    }
}

function showOverlay(title, message) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    gameOverOverlay.classList.add('active');
}

function hideOverlay() {
    gameOverOverlay.classList.remove('active');
}

function resetGame(fullReset) {
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    lives = 20;
    gameActive = true;

    gameTitle.textContent = 'Guess My Number!';
    secretNumberEl.textContent = '?';
    secretBox.classList.remove('revealed');
    document.body.classList.remove('win-state');
    guessInput.value = '';
    livesValue.textContent = '20';
    setFeedback('🤔 Start guessing...', null);

    if (fullReset) {
        score = 0;
        highscore = 0;
        scoreValue.textContent = '0';
        highscoreValue.textContent = '0';
    }

    hideOverlay();
    guessInput.focus();
}

// ========== CHECK GUESS ==========
checkBtn.addEventListener('click', function () {
    if (!gameActive) return;

    const guess = Number(guessInput.value);

    // No input
    if (!guess) {
        setFeedback('⛔ Enter a number!', 'wrong');
        guessInput.focus();
        return;
    }

    // Out of range
    if (guess < 1 || guess > 20) {
        setFeedback('🚫 Pick between 1 and 20!', 'wrong');
        guessInput.value = '';
        guessInput.focus();
        return;
    }

    // Correct guess
    if (guess === secretNumber) {
        score += 5;
        gameActive = false;

        secretNumberEl.textContent = secretNumber;
        secretBox.classList.add('revealed');
        document.body.classList.add('win-state');
        gameTitle.textContent = '🎉 You Got It!';
        setFeedback('😎 Correct Number!', 'correct');

        scoreValue.textContent = score;
        popStat(statScore);

        if (score > highscore) {
            highscore = score;
            highscoreValue.textContent = highscore;
            popStat(statHighscore);
        }

        launchConfetti();
        return;
    }

    // Wrong guess
    lives--;
    livesValue.textContent = lives;
    popStat(statLives);

    if (lives <= 0) {
        // Game Over
        gameActive = false;
        secretNumberEl.textContent = secretNumber;
        secretBox.classList.add('revealed');
        setFeedback('💀 No lives left!', 'wrong');
        showOverlay('💀 Game Over!', `The secret number was ${secretNumber}. Your score: ${score}`);
        return;
    }

    if (guess > secretNumber) {
        setFeedback('📈 Too High!', 'wrong');
    } else {
        setFeedback('📉 Too Low!', 'wrong');
    }

    guessInput.value = '';
    guessInput.focus();
});

// Enter key to check
guessInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        checkBtn.click();
    }
});

// ========== CONTINUE (next round, keep score) ==========
againBtn.addEventListener('click', function () {
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    lives = 20;
    gameActive = true;

    gameTitle.textContent = 'Guess My Number!';
    secretNumberEl.textContent = '?';
    secretBox.classList.remove('revealed');
    document.body.classList.remove('win-state');
    guessInput.value = '';
    livesValue.textContent = '20';
    setFeedback('🤔 New round! Keep going...', null);
    hideOverlay();
    guessInput.focus();
});

// ========== RESTART (full reset) ==========
restartBtn.addEventListener('click', function () {
    resetGame(true);
});

// ========== OVERLAY RESTART ==========
overlayRestartBtn.addEventListener('click', function () {
    resetGame(true);
});

// ========== EXIT ==========
exitBtn.addEventListener('click', function () {
    if (confirm('Are you sure you want to exit?')) {
        // Try to close the tab; if blocked, show a message
        window.close();
        // Fallback: navigate to blank
        document.body.innerHTML = `
            <div style="
                display: flex; align-items: center; justify-content: center;
                min-height: 100vh; font-family: 'Outfit', sans-serif;
                background: #0d0d1a; color: #f1f5f9; text-align: center;
                padding: 40px;
            ">
                <div>
                    <h1 style="font-size: 3rem; margin-bottom: 16px;">👋 Thanks for playing!</h1>
                    <p style="font-size: 1.2rem; opacity: 0.6;">You can safely close this tab.</p>
                </div>
            </div>
        `;
    }
});

// Focus input on load
window.addEventListener('load', () => {
    guessInput.focus();
});