
const gameContainer = document.querySelector('.game-container');
let spaceship = document.getElementById('spaceship');
let scoreDisplay = document.getElementById('score');
const spaceshipSpeed = 15;
let score = 0;
let gameActive = true;
let asteroidSpeed = 1;
let asteroidCount = 1;

document.addEventListener('keydown', moveSpaceship);

function moveSpaceship(event) {
    if (!gameActive) return;
    const spaceshipRect = spaceship.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    let newLeft;

    if (event.key === 'ArrowLeft' && spaceshipRect.left > containerRect.left) {
        newLeft = spaceship.offsetLeft - spaceshipSpeed;
        if (newLeft < 0) newLeft = 0; 
        spaceship.style.left = newLeft + 'px';
    }
    if (event.key === 'ArrowRight' && spaceshipRect.right < containerRect.right) {
        newLeft = spaceship.offsetLeft + spaceshipSpeed;
        if (newLeft + spaceshipRect.width > gameContainer.clientWidth) newLeft = gameContainer.clientWidth - spaceshipRect.width; // Prevent moving out of the right boundary
        spaceship.style.left = newLeft + 'px';
    }
}

function createAsteroid() {
    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    asteroid.textContent = '💥';
    asteroid.style.left = Math.random() * (gameContainer.clientWidth - 40) + 'px'; 
    gameContainer.appendChild(asteroid);
    moveAsteroid(asteroid);
}

function moveAsteroid(asteroid) {
    const asteroidInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(asteroidInterval);
            return;
        }
        const rect = asteroid.getBoundingClientRect();
        if (rect.top >= gameContainer.clientHeight) {
            asteroid.remove();
            clearInterval(asteroidInterval);
            console.log("Increasing score: "+score)
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
            if (score > 0 && score % 15 === 0) {
                increaseDifficulty(); 
            }
        } else {
            asteroid.style.top = rect.top + asteroidSpeed + 'px'; 
            checkCollision(rect);
        }
    }, 70); 
}

function increaseDifficulty() {
    asteroidSpeed += 0.2;
    asteroidCount++; 
    
    
    console.log(`Difficulty increased! Speed: ${asteroidSpeed}, Count: ${asteroidCount}`);
}

function checkCollision(asteroidRect) {
    const spaceshipRect = spaceship.getBoundingClientRect();
    if (
        asteroidRect.left < spaceshipRect.right &&
        asteroidRect.right > spaceshipRect.left &&
        asteroidRect.top < spaceshipRect.bottom &&
        asteroidRect.bottom > spaceshipRect.top
    ) {
        gameOver();
    }
}

function gameOver() {
    gameActive = false;
    alert('Game Over! Your final score is ' + score);
    resetGame();
}

function resetGame() {
    gameContainer.innerHTML = '<div class="spaceship" id="spaceship">🚀</div><div class="score" id="score">Score: 0</div>';
    spaceship = document.getElementById('spaceship');
    scoreDisplay = document.getElementById('score');
    score = 0;
    gameActive = true;
    asteroidCount = 1; 
    asteroidSpeed = 1; 
    startGame();
}

function startGame() {
    if (!gameActive) return;
    
    gameContainer.querySelectorAll('.asteroid').forEach(asteroid => asteroid.remove());

    for (let i = 0; i < asteroidCount; i++) {
        createAsteroid(); 
    }
    setTimeout(startGame, 1000); 
}

startGame();

