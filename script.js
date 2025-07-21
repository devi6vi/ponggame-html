const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() < 0.5 ? 1 : -1);

let playerScore = 0, aiScore = 0;

// Handle player paddle with mouse
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = 48) {
    ctx.fillStyle = "#fff";
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() < 0.5 ? 1 : -1);
}

function updateAI() {
    // Move AI paddle towards the ball with some delay
    let targetY = ballY - PADDLE_HEIGHT / 2 + BALL_SIZE / 2;
    if (aiY + PADDLE_HEIGHT / 2 < targetY - 10) {
        aiY += AI_SPEED;
    } else if (aiY + PADDLE_HEIGHT / 2 > targetY + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp within canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (
        ballX < PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballSpeedX *= -1;
        // Add a bit of vertical change based on hit point
        let impact = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = impact * 0.25;
    }

    // Right paddle (AI) collision
    if (
        ballX + BALL_SIZE > AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_SIZE;
        ballSpeedX *= -1;
        let impact = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = impact * 0.25;
    }

    // Score update
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, '#111');

    // Net
    for (let i = 0; i < canvas.height; i += 28) {
        drawRect(canvas.width / 2 - 2, i, 4, 16, '#aaa');
    }

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');

    // Ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, '#fff');

    // Scores
    drawText(playerScore, canvas.width/4, 60, 48);
    drawText(aiScore, 3*canvas.width/4, 60, 48);
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();