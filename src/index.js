import './scss/main.scss';

// Constants
const gameArea = document.querySelector('.gameArea')
const startBtn = document.querySelector('.startGame');
const score = document.querySelector('.score');
const bird = document.querySelector('.bird');

const params = {
  start: false,
  fallSpeed: 0, // speed of bird falling
  upSpeed: 10, // speed up
  y: 400, // start bird position
  jumpKoef: 6.5, // for bird up
  moveSpeed: 3, // speed of world
  score: 0,
  alienZone: 350, // 1 alien in 1 zone, zone width
  wallsKoef: 30,
  fallStartSpeed: 0,
}

const Constants = {
  displayWidth: document.documentElement.clientWidth,
  displayHeight: document.documentElement.clientHeight,
  displayLeft: document.documentElement.clientLeft,
}

// Functions
function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createAlien() {
  const aliensQuntity = Math.round((Constants.displayWidth - 250) / params.alienZone)


  for (let i = 0; i <= aliensQuntity; i++) {
    const alien = document.createElement('div');
    alien.classList.add('alien');
    const alienTop = getRnd(250, Constants.displayHeight - 250); // random y
    const alienLeft = getRnd(params.alienZone
    * (i + 1), params.alienZone * (i + 2)); // create 1 alien in alien zone

    alien.style.top = `${alienTop}px`;
    alien.style.left = `${alienLeft}px`;

    alien.x = alienLeft;
    gameArea.appendChild(alien);
  }
}

function moveAlien() {
  const aliens = document.querySelectorAll('.alien');
  aliens.forEach((alien) => {
    alien.x -= params.moveSpeed;
    alien.style.left = `${alien.x}px`;

    const birdRound = bird.getBoundingClientRect();
    const alienRound = alien.getBoundingClientRect();

    if (birdRound.top <= alienRound.bottom // lose conditions
      && birdRound.right >= alienRound.left
      && birdRound.left <= alienRound.right
      && birdRound.bottom >= alienRound.top) {
      params.score = 0;
      params.moveSpeed = 0;
      params.start = false;
      gameArea.appendChild(startBtn);
      startBtn.classList.remove('hide');
    }

    if (alien.x <= Constants.displayLeft - 100) {
      alien.x = Constants.displayWidth + 200;
      const alienTop = getRnd(100, Constants.displayHeight - 100); // random y

      alien.style.top = `${alienTop}px`;
    }
  })
}

function wallCreate() {
  const wallQuantity = getRnd(2, 5);
  for (let i = 0; i <= wallQuantity; i++) {
    const wall = document.createElement('div');
    wall.classList.add('wall');

    const wallLeft = getRnd(300, Constants.displayWidth);
    const rnd = Math.random();
    if (rnd >= 0.5) {
      wall.classList.add('top');
    } else {
      wall.classList.add('bottom');
    }
    const wallHeight = (Math.random() >= 0.5) ? 120 : 60;


    wall.x = wallLeft;
    wall.style.left = `${wallLeft}px`;
    wall.style.height = `${wallHeight}px`;
    gameArea.appendChild(wall);
  }
}

function wallMove() { // walls moving
  const walls = document.querySelectorAll('.wall');

  walls.forEach((wall) => {
    const birdRound = bird.getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();
    wall.x -= params.moveSpeed;
    wall.style.left = `${wall.x}px`;

    if (wall.x <= Constants.displayLeft - 100) {
      const wallHeight = (Math.random() >= 0.5) ? 60 : 120;
      const rnd = Math.random();


      wall.classList.remove('top');
      wall.classList.remove('bottom');

      wall.x = getRnd(Constants.displayWidth, Constants.displayWidth * 2);

      if (rnd >= 0.5) {
        wall.classList.add('top');
      } else {
        wall.classList.add('bottom');
      }

      wall.style.height = `${wallHeight}px`;
      wall.style.left = `${wall.x}px`;
    }
    if (birdRound.top <= wallRect.bottom // lose conditions
      && birdRound.right >= wallRect.left
      && birdRound.left <= wallRect.right
      && birdRound.bottom >= wallRect.top) {
      params.score = 0;
      params.moveSpeed = 0;
      params.start = false;
      gameArea.appendChild(startBtn);
      startBtn.classList.remove('hide');
    }
  })
}

function speedUp() { // speed ++,
  if (params.score >= 25) params.moveSpeed = 4;
  if (params.score >= 50) params.moveSpeed = 5;
  if (params.score >= 75) params.moveSpeed = 6;
  if (params.score >= 100) {
    params.fallStartSpeed = 40;
    params.moveSpeed = 7;
  }
  if (params.score >= 125) params.moveSpeed = 8;
  if (params.score >= 150) params.moveSpeed = 9;
  if (params.score >= 175) params.moveSpeed = 10;
  if (params.score >= 200) {
    params.fallStartSpeed = 30;
    params.moveSpeed = 11;
  }
  if (params.score >= 225) params.moveSpeed = 12;
  if (params.score >= 250) {
    params.fallStartSpeed = 20;
    params.moveSpeed = 13;
  }
  if (params.score >= 275) params.moveSpeed = 14;
}

function fallOnGroundSky() {
  if (bird.y <= 25 && bird.y >= Constants.displayHeight - 25) console.log('lose')
}

function playGame() {
  if (params.start) {
    params.fallSpeed += params.fallStartSpeed + 9.8 / 50;
    params.y += params.fallSpeed; // falling speed
    bird.style.top = `${params.y}px`;

    params.score += 0.05;
    score.innerHTML = `SCORE :${Math.round(params.score)}`;

    moveAlien();
    wallMove();
    speedUp();
    fallOnGroundSky();
    requestAnimationFrame(playGame);
  }
}

function startGame() {
  startBtn.classList.add('hide');
  gameArea.innerHTML = '';

  bird.style.top = `${params.y}px`;

  score.innerHTML = `SCORE :${params.score}`;

  params.start = true;
  createAlien();
  wallCreate();
  gameArea.appendChild(bird);
  requestAnimationFrame(playGame);
}

function jumpClick() {
  params.fallSpeed = 0; // stop falling
  params.y -= params.jumpKoef * params.upSpeed; // up speed

  bird.style.backgroundImage = "url('./assets/img/bird.png')";


  setTimeout(() => {
    bird.style.backgroundImage = "url('./assets/img/birdUP.png')";
  }, 250);
}


// Events
startBtn.addEventListener('click', startGame);
document.addEventListener('click', jumpClick);
