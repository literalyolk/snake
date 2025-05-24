// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const tileSize = canvas.width / tileCount;

// Game variables
let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameLoop;
let gameStarted = false;
let gameOverImage = new Image();
gameOverImage.src = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDF6YWUzdzBzejBkcDhnMGQyY2VsZXhtcDdoZmU1cGQ0czkxMmNydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KxiCRZLuQTTaP1aHov/giphy.gif';

// Colors
const snakeColor = '#4CAF50';
const foodColor = '#FF5252';

// Game controls
document.addEventListener('keydown', (e) => {
    if (!gameStarted) {
        gameStarted = true;
        gameLoop = setInterval(gameUpdate, gameSpeed);
    }
    
    switch(e.key.toLowerCase()) {
        case 'w':
            if (dy !== 1) {  // Prevent moving down when going up
                dx = 0;
                dy = -1;
            }
            break;
        case 's':
            if (dy !== -1) {  // Prevent moving up when going down
                dx = 0;
                dy = 1;
            }
            break;
        case 'a':
            if (dx !== 1) {  // Prevent moving right when going left
                dx = -1;
                dy = 0;
            }
            break;
        case 'd':
            if (dx !== -1) {  // Prevent moving left when going right
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Game functions
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = snakeColor;
    snake.forEach(segment => {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2);
    });

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 2, tileSize - 2);

    // Draw start message if game hasn't started
    if (!gameStarted) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press W, A, S, or D to start', canvas.width/2, canvas.height/2);
    }
}

function drawGameOver() {
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate image size to fill canvas while maintaining aspect ratio
    const imageSize = Math.min(canvas.width, canvas.height) * 0.9; // 90% of the smaller dimension
    const x = (canvas.width - imageSize) / 2;
    const y = (canvas.height - imageSize) / 2;
    
    // Draw game over image
    ctx.drawImage(gameOverImage, x, y, imageSize, imageSize);

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height - 50);
    ctx.fillText('Press any key to restart', canvas.width/2, canvas.height - 20);
}

function moveSnake() {
    if (!gameStarted || (dx === 0 && dy === 0)) return;  // Don't move if game hasn't started or no direction set

    // Create new head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Check for collisions with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check for collisions with self
    for (let i = 1; i < snake.length; i++) {  // Start from 1 to skip the head
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
        // Increase game speed
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameUpdate, gameSpeed);
        }
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't spawn on snake
    snake.forEach(segment => {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
        }
    });
}

function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;
    drawGameOver();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    gameStarted = false;
    document.getElementById('score').textContent = score;
    drawGame();
}

function gameUpdate() {
    moveSnake();
    drawGame();
}

// Initialize game
resetGame(); 