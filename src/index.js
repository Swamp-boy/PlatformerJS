import './scss/main.scss';

const gameArea = document.querySelector('.gameArea')
const startBtn = document.querySelector('.startGame');
const bird = document.querySelector('.bird');
const ground = document.querySelector('.ground');
const sky = document.querySelector('.sky');
const score = document.querySelector('.score');

const params = {
  start: false,
  fallSpeed: 0, // speed of bird falling
  upSpeed: 10, // speed up
  y: 400, // start bird position
  jumpKoef: 6.5, // for bird up
  moveSpeed: 3, // speed of world
  score: 0,
  scoreKoef: 1,
  alienZone: 350, // 1 alien in 1 zone, zone width
  wallsKoef: 30,
}

function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gameOver() {
  const groundRect = ground.getBoundingClientRect();
  const skyRect = sky.getBoundingClientRect();

  if (params.y >= groundRect.top || params.y <= skyRect.bottom) {
    console.log('lose')
  }
}

function startGame() {
  startBtn.classList.add('hide');
  bird.style.left = '75px';
  bird.style.top = `${params.y}px`;

  score.innerHTML = `SCORE :${params.score}`;

  params.start = true;
  createAlien();
  wallCreate();

  requestAnimationFrame(playGame);
}

function playGame() {
  if (params.start) {
    params.fallSpeed += 9.8 / 50;
    params.y += params.fallSpeed; // falling speed
    bird.style.top = `${params.y}px`;

    params.score += 0.05;
    score.innerHTML = `SCORE :${Math.round(params.score)}`;
    moveAlien();
    wallMove();
    gameOver();

    requestAnimationFrame(playGame);
  }
}

function jumpClick() {
  params.fallSpeed = 0; // stop falling
  params.y -= params.jumpKoef * params.upSpeed; // up speed

  bird.style.backgroundImage = "url('./assets/img/bird.png')";


  setTimeout(() => {
    bird.style.backgroundImage = "url('./assets/img/birdUP.png')";
  }, 250);
}

function createAlien() {
  const aliensQuntity = Math.round((document.documentElement.clientWidth - 250) / params.alienZone)


  for (let i = 0; i <= aliensQuntity; i++) {
    const alien = document.createElement('div');
    alien.classList.add('alien');
    const alienTop = getRnd(250, document.documentElement.clientHeight - 250); // random y
    const alienLeft = getRnd(params.alienZone * (i + 1), params.alienZone * (i + 2)); // create 1 alien in alien zone

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
      && birdRound.bottom >= alienRound.top) { console.log('lose') }

    if (alien.x <= document.documentElement.clientLeft) {
      alien.x = document.documentElement.clientWidth + 200;
      const alienTop = getRnd(100, document.documentElement.clientHeight - 100); // random y

      alien.style.top = `${alienTop}px`;
    }
  })
}

function wallCreate() {
  const wallQuantity = getRnd(0, 5);
  for (let i = 0; i <= wallQuantity; i++) {
    const wall = document.createElement('div');
    wall.classList.add('wall');

    const wallLeft = getRnd(300, document.documentElement.clientWidth);
    const rnd = Math.random();
    if (rnd >= 0.5) {
      wall.classList.add('top');
    } else {
      wall.classList.add('bottom');
    }
    const wallHeight = (Math.random() >= 0.5) ? 60 : 120;


    wall.x = wallLeft;
    wall.style.left = `${wallLeft}px`;
    wall.style.height = `${wallHeight}px`;
    gameArea.appendChild(wall);
  }
}

function wallMove() {
  const walls = document.querySelectorAll('.wall');

  walls.forEach((wall) => {
    wall.x -= params.moveSpeed;
    wall.style.left = `${wall.x}px`;

    if (wall.x <= document.documentElement.clientLeft) {
      wall.classList.remove('top');
      wall.classList.remove('bottom');
      const wallHeight = (Math.random() >= 0.5) ? 60 : 120;
      const rnd = Math.random();

      wall.x = getRnd(document.documentElement.clientWidth, document.documentElement.clientWidth * 2);

      if (rnd >= 0.5) {
        wall.classList.add('top');
      } else {
        wall.classList.add('bottom');
      }

      wall.style.height = `${wallHeight}px`;
      wall.style.left = `${wall.x}px`;
    }
  })
}


startBtn.addEventListener('click', startGame);
document.addEventListener('click', jumpClick)
