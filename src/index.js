import './scss/main.scss';

const gameArea = document.querySelector('.gameArea')
const startBtn = document.querySelector('.startGame');
const bird = document.querySelector('.bird');
const ground = document.querySelector('.ground');
const sky = document.querySelector('.sky');
const score = document.querySelector('.score');

const params = {
  start: false,
  fallSpeed: 0,
  upSpeed: 10,
  y: 400,
  jumpKoef: 6.5,
  moveSpeed: 3,
  score: 0,
  scoreKoef: 1,
  alienKoef: 5,
}

const keys = {
  Space: false,

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

function enemysQuantity(widthElement) {
  return (document.documentElement.clientWidth / widthElement) / params.alienKoef;
}

function createAlien() {
  const alienNum = enemysQuantity(75)
  for (let i = 0; i <= alienNum; i++) {
    const alien = document.createElement('div');
    alien.classList.add('alien');

    alien.style.left = `${i * 250}px`;
    alien.x = i * 250;
    gameArea.appendChild(alien);
  }
}

function moveAlien() {
  const aliens = document.querySelectorAll('.alien');
  aliens.forEach((alien) => {
    alien.x -= params.moveSpeed;
    alien.style.left = `${alien.x}px`;

    if (alien.x <= document.documentElement.clientLeft) {
      alien.x = document.documentElement.clientWidth + 200;
    }
  })
}


startBtn.addEventListener('click', startGame);
document.addEventListener('click', jumpClick)
