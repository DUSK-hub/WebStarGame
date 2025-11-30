// Game variables
let score = 0;
let missed = 0;
let time = 30;
let gameActive = false;
let isPaused = false;
let timerInterval;
let starInterval;

// DOM elements
let gameScreen;
let scoreDisplay;
let missedDisplay;
let timeDisplay;
let gameOverDiv;
let finalScoreText;
let playBtn;
let pauseBtn;

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    gameScreen = document.getElementById('gameScreen');
    scoreDisplay = document.getElementById('scoreDisplay');
    missedDisplay = document.getElementById('missedDisplay');
    timeDisplay = document.getElementById('timeDisplay');
    gameOverDiv = document.getElementById('gameOver');
    finalScoreText = document.getElementById('finalScore');
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.querySelector('.Controls button:nth-child(2)');
    
    // Set initial button text
    playBtn.textContent = 'Start Game';
});

function startGame() {
    // Reset game state
    score = 0;
    missed = 0;
    time = 30;
    gameActive = true;
    isPaused = false;
    
    // Update displays
    scoreDisplay.textContent = score;
    missedDisplay.textContent = missed;
    timeDisplay.textContent = time;
    gameOverDiv.style.display = 'none';
    playBtn.textContent = 'Restart';
    
    // Clear existing stars
    const stars = gameScreen.querySelectorAll('.star');
    stars.forEach(star => {
        if (star.id !== 'gameOver') {
            star.remove();
        }
    });
    
    // Clear previous intervals
    clearInterval(timerInterval);
    clearInterval(starInterval);
    
    // Start countdown timer
    timerInterval = setInterval(() => {
        if (!isPaused && gameActive) {
            time--;
            timeDisplay.textContent = time;
            
            if (time <= 0) {
                endGame();
            }
        }
    }, 1000);
    
    // Create stars at intervals
    starInterval = setInterval(() => {
        if (!isPaused && gameActive) {
            createStar();
        }
    }, 800);
}

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = '⭐';
    
    // Random horizontal position
    const maxX = gameScreen.offsetWidth - 40;
    star.style.left = Math.random() * maxX + 'px';
    star.style.top = '-40px';
    
    // Random fall duration (2-4 seconds)
    const duration = Math.random() * 2 + 2;
    star.style.animation = `fall ${duration}s linear`;
    
    // Click handler
    star.addEventListener('click', () => {
        if (gameActive && !isPaused) {
            score++;
            scoreDisplay.textContent = score;
            star.remove();
        }
    });
    
    // Animation end handler (star reached bottom)
    star.addEventListener('animationend', () => {
        if (star.parentElement && gameActive) {
            missed++;
            missedDisplay.textContent = missed;
            star.remove();
        }
    });
    
    gameScreen.appendChild(star);
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    clearInterval(starInterval);
    
    // Show game over screen
    finalScoreText.textContent = `Final Score: ${score} stars caught! | Missed: ${missed}`;
    gameOverDiv.style.display = 'block';
    
    // Remove remaining stars
    const stars = gameScreen.querySelectorAll('.star');
    stars.forEach(star => {
        if (star.id !== 'gameOver') {
            star.remove();
        }
    });
    
    playBtn.textContent = 'Play Again';
    playBtn.classList.remove('active'); // Reset to green
}

function togglePause() {
    if (!gameActive) return;
    
    isPaused = !isPaused;
    const stars = gameScreen.querySelectorAll('.star');
    
    // Toggle pause button state
    pauseBtn.classList.toggle('active');
    pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
    
    stars.forEach(star => {
        if (star.id !== 'gameOver') {
            if (isPaused) {
                star.style.animationPlayState = 'paused';
            } else {
                star.style.animationPlayState = 'running';
            }
        }
    });
}