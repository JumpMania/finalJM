const playerImage = new Image();
playerImage.src = 'girl_front.png'; 
playerImage.onload = () => {}; 

const playerImageR = new Image();
playerImageR.src = 'girl_right.png'; 
playerImageR.onload = () => {}; 

const playerImageL = new Image();
playerImageL.src = 'girl_left.png'; 
playerImageL.onload = () => {}; 

const platformImage = new Image();
platformImage.src = 'SKYHOP_PLATFORM.png';
platformImage.onload = () => {}; 


const jumpSFX = new Audio("jump.mp3");
const startSFX = new Audio("gameStart.mp3");
jumpSFX.load();
const music = new Audio("music1.mp3")
music.load();
music.volume = 0.70;
const gameOverSFX = new Audio("gameOver.mp3");
startSFX.load();
gameOverSFX.load();
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const soundButton = document.querySelector('.sound');
const musicButton = document.querySelector('.music');
soundButton.addEventListener('click', toggleSound);
musicButton.addEventListener('click', toggleMusic);
const button1 = new Audio("button1.mp3");
let platformWidth = 65;
let platformHeight = 15;

const platformStart = canvas.height - 50;
const gravity = 0.33;
const bounceVelocity = -10.5;
let soundPlayed = false;
let minPlatformSpace = 90;
let maxPlatformSpace = 120;
let leftSpeed = -4;
let rightSpeed = 4;
let score = 0;
let soundEnabled = true;
let platforms = [{
  x: canvas.width / 2 - platformWidth / 2,
  y: platformStart
}];

function random(min, max) {
  return Math.random() * (max - min) + min;
}
let y = platformStart;
while (y > 0) {
  y -= platformHeight + random(minPlatformSpace, maxPlatformSpace);
  do {
    x = random(1 , canvas.width - 1 - platformWidth);
  } while (
    y > canvas.height / 2 && Math.abs(x - canvas.width / 2) > platformWidth / 2
  );
    platforms.push({ x, y });
}
const player = {
  width: 30 *1.8,
  height: 45 *1.8,
  x: canvas.width /2 - 20,
  y: platformStart - 100,
  dx: 0,
  dy: 0
};

let keydown = false;
let prevPlayerY = player.y;

function toggleSound() {
  jumpSFX.muted = !jumpSFX.muted;
  gameOverSFX.muted = !gameOverSFX.muted;
  startSFX.muted = !startSFX.muted;
  button1.muted = !button1.muted;
}
function toggleMusic() {
  
  music.muted = !music.muted;
}
function playButtonSound() {
  if (soundEnabled) {
  button1.play();
  }
}


function tutorial() {
  const tutorial = document.getElementById('tutorial');
  const ctx = tutorial.getContext('2d');
  ctx.clearRect(0, 0, tutorial.width, tutorial.height);
  ctx.font = '17px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('CONTROLS:', 30, 40);
  ctx.fillText('A  &  D', 20, 90 )
  ctx.fillText('\u2190   \u2192', 90, 90);
  if (player.y > canvas.height){
    ctx.clearRect(0, 0, tutorial.width, tutorial.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER', 20, tutorial.height/ +3);
    ctx.font = '18px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Press "Space"', 25 , tutorial.height/1.50);
    ctx.fillText('to reset', 50 , tutorial.height/1.10);
    music.volume = 0.30;
    if (!soundPlayed) {
      
      gameOverSFX.play();
      soundPlayed = true;
    }
    document.addEventListener('keydown', function(e) {
      if (e.which === 32) {
        resetGame();
        startSFX.play();
        soundPlayed = false;
      }
      
    });
    }
}

function displayScore() {
  const scoreCanvas = document.getElementById('scoreCanvas');
  const ctx = scoreCanvas.getContext('2d');
  ctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ', 10, 30);
  ctx.fillText(score, 50, 60);
}
function resetGame() {
  score = 0;
  music.volume = 0.70;
  platformWidth = 65;
  platforms = [{
    x: canvas.width / 2 - platformWidth / 2,
    y: platformStart
  }];
  leftSpeed = -4;
  rightSpeed = 4;
  player.x = canvas.width / 2  - player.width / 2;
  player.y = platformStart - 100;
  player.dx = 0;
  player.dy = 0;
  
  y = platformStart;
  while (y > 0) {
    y -= platformHeight + random(minPlatformSpace, maxPlatformSpace);
    do {
      x = random(1, canvas.width - 1 - platformWidth);
    } while (
      y > canvas.height / 2 && Math.abs(x - canvas.width / 2) > platformWidth / 2
    );
    platforms.push({ x, y });

   
 
  }
}


function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);
  music.play();
  player.dy += gravity;

  if (player.y < canvas.height / 2 && player.dy < 0) {
    platforms.forEach(function(platform) {
      platform.y += -player.dy;
    });

    while (platforms[platforms.length - 1].y > 0) {
      platforms.push({
        x: random(25, canvas.width - 25 - platformWidth),
        y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
      })
      score += 100;
      if (platformWidth <=15){
        platformWidth=15;
      }
      else if (score>= 2000 && score <=2001){
        platformWidth-=15;
        leftSpeed -= 2;
        rightSpeed += 2;
      }
      else if (score>= 5000 && score <=5001){
        platformWidth-=15;
        leftSpeed -= 2;
        rightSpeed += 2;
      }
      else if (score>=10000 && score <=10001){
        platformWidth-=15;
        leftSpeed -= 2;
        rightSpeed +=2;
      }
     

      maxPlatformSpace = Math.min(maxPlatformSpace, canvas.height / 2);
    }
  }
  else {
    player.y += player.dy;
  }
  if (!keydown) {
    player.dx = 0;
  }
  player.x += player.dx;
  if (player.x + player.width < 0) {
    player.x = canvas.width;
  }
  else if (player.x > canvas.width) {
    player.x = -player.width;
  }
  
  

  platforms.forEach(function(platform) {
    
    context.drawImage(platformImage, platform.x, platform.y, platformWidth, platformHeight);

    if (
      player.dy > 0 &&
      prevPlayerY + player.height <= platform.y &&

      player.x < platform.x + platformWidth &&
      player.x + player.width > platform.x &&  
      player.y < platform.y + platformHeight &&
      player.y + player.height > platform.y
    ) {
      player.dy = bounceVelocity;
      
      jumpSFX.play();
    }
  });

  if (player.dx < 0) {
    context.drawImage(playerImageL, player.x, player.y, player.width , player.height );
} else if (player.dx > 0) {
    context.drawImage(playerImageR, player.x, player.y, player.width, player.height );
} else {
    context.drawImage(playerImage, player.x, player.y, player.width , player.height );
}

  prevPlayerY = player.y;


  platforms = platforms.filter(function(platform) {
    return platform.y < canvas.height;
  })
  displayScore();
  tutorial();
}
x 
document.addEventListener('keydown', function(e) {
  if (e.which === 37) {
    keydown = true;
  
    player.dx = leftSpeed;

  }
  else if (e.which === 39) {
    keydown = true;
    
    player.dx = rightSpeed;
  }
  else if (e.which === 65) {
    keydown = true;
    
    player.dx = leftSpeed;
  }
  else if (e.which === 68) {
    keydown = true;
    
    player.dx = rightSpeed;
  }
});

document.addEventListener('keyup', function(e) {
  keydown = false;
});
document.addEventListener('click', function() {
  playButtonSound();
});

requestAnimationFrame(loop);