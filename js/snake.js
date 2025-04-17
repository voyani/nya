const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');

// Game constants
const DOT_SIZE = 20;
const MAX_RAND = (canvas.width / DOT_SIZE) - 1;
const DELAY = 120;
let score = 0;

// Snake variables
let snake = [];
let direction = 'right';
let nextDirection = 'right';
let food = {};
let gameLoop;
let isGameOver = false;

function initGame() {
    snake = [
        { x: 5 * DOT_SIZE, y: 5 * DOT_SIZE },
        { x: 4 * DOT_SIZE, y: 5 * DOT_SIZE },
        { x: 3 * DOT_SIZE, y: 5 * DOT_SIZE }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    isGameOver = false;
    gameOverModal.style.display = 'none';
    canvas.style.filter = 'none';
    spawnFood();
    if (gameLoop) clearTimeout(gameLoop);
    gameLoop = setTimeout(gameCycle, DELAY);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * MAX_RAND) * DOT_SIZE,
        y: Math.floor(Math.random() * MAX_RAND) * DOT_SIZE
    };
    // Ensure food doesn't spawn on snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * MAX_RAND) * DOT_SIZE;
        food.y = Math.floor(Math.random() * MAX_RAND) * DOT_SIZE;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#2E7D32';
        ctx.beginPath();
        ctx.roundRect(segment.x, segment.y, DOT_SIZE, DOT_SIZE, 5);
        ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(food.x + DOT_SIZE/2, food.y + DOT_SIZE/2, DOT_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
}

function move() {
    if (isGameOver) return;

    const head = { ...snake[0] };
    direction = nextDirection;

    switch(direction) {
        case 'up': head.y -= DOT_SIZE; break;
        case 'down': head.y += DOT_SIZE; break;
        case 'left': head.x -= DOT_SIZE; break;
        case 'right': head.x += DOT_SIZE; break;
    }

    // Check collisions
    if (head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        spawnFood();
    } else {
        snake.pop();
    }
}

function gameOver() {
    isGameOver = true;
    finalScoreElement.textContent = score;
    gameOverModal.style.display = 'block';
    canvas.style.filter = 'blur(2px)';
    clearTimeout(gameLoop);
}

function gameCycle() {
    move();
    draw();
    if (!isGameOver) {
        gameLoop = setTimeout(gameCycle, DELAY);
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (isGameOver && e.code === 'Space') {
        initGame();
        return;
    }
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

document.querySelector('.restart-btn').addEventListener('click', () => initGame());
document.querySelector('.clubhouse-btn').addEventListener('click', () => {
    window.location.href = 'activitiesNgames.html';
    
});

// Initialize game
initGame();
