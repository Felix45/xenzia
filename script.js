// Define HTML Elements

const GRID_SIZE = 21;
const board = document.getElementById('game-board');
const logo = document.getElementById('logo');
const scoreText = document.getElementById('score');
const highScoreText = document.getElementById('high-score');
const instructions = document.getElementById('instructions-text');

let direction = 'right';
let gameInterval;
let score = 0;
let gameSpeedDelay = 200;
let gameStarted = false;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };

// Create Game Element
const createGameElement = (tag, className) => {
  const el = document.createElement(tag);
  el.classList.add(className);
  return el;
};

// Set Position of the snake or food
const setPosition = (element, position) => {
  element.style.gridRow = position.y;
  element.style.gridColumn = position.x;
};

// Draw Snake
const drawSnake = () => {
  snake.forEach((item) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, item);
    board.appendChild(snakeElement);
  });
};

// Draw Food
const drawFood = () => {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
};

const updateScore = () => {
  score = snake.length - 1;
  scoreText.textContent = score.toString().padStart(3, '0');
};

const draw = () => {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
};

const updateHighScore = () => {
  let highScore = parseInt(localStorage.getItem('highScore'), 2) || 0;
  if (score > highScore) {
    highScore = score;
  }
  highScoreText.classList.remove('hidden');
  highScoreText.textContent = highScore.toString().padStart(3, '0');
  localStorage.setItem('highScore', highScore);
};

// Reset the game
const resetGame = () => {
  updateHighScore();
  snake = [{ x: 10, y: 10 }];
  food = { x: 5, y: 5 };
  gameSpeedDelay = 200;
  direction = 'right';
  score = 0;
  gameStarted = false;
  clearInterval(gameInterval);
  instructions.classList.remove('hidden');
  logo.classList.remove('hidden');
};

const checkCollision = () => {
  const head = snake[0];
  if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) resetGame();

  for (let i = 1; i < snake.length; i += 1) {
    if (head.x === snake[i].x && head.y === snake[i].y) resetGame();
  }
};

// Generate the next food position
const generateFood = () => {
  const x = Math.floor(Math.random() * GRID_SIZE);
  const y = Math.floor(Math.random() * GRID_SIZE);
  return { x, y };
};

// Increase the speed of the snake
const increaseSpeed = () => {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 1;
  }
};

// Move the snake
const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case 'right':
      head.x += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    default:
      break;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

// Start the game
const startGame = () => {
  gameStarted = true;
  logo.classList.add('hidden');
  instructions.classList.add('hidden');
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

// Keypress event listener
const handleKeyPress = (e) => {
  if (!gameStarted && (e.code === 'Space' || e.key === ' ')) {
    startGame();
  } else {
    switch (e.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      default:
        break;
    }
  }
};

document.addEventListener('keydown', handleKeyPress);
