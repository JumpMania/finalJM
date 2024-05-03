const playerImage = new Image();
playerImage.src = 'tcFront.png'; 
playerImage.onload = () => {}; 

const playerImageR = new Image();
playerImageR.src = 'tcRight.png'; 
playerImageR.onload = () => {}; 

const playerImageL = new Image();
playerImageL.src = 'tcLeft.png'; 
playerImageL.onload = () => {}; 


const platformImage = new Image();
platformImage.src = 'towerclimber_platform.jpg';
platformImage.onload = () => {}; 

const obstacleImage = new Image();
obstacleImage.src = 'spike.png';
obstacleImage.onload = () => { 
   
};
window.onload = function() {
  document.getElementById("loader").style.display = "none";
};
const jumpSFX = new Audio("jump.mp3");
jumpSFX.load();
const spike = new Audio("spike.wav")
spike.load();
const music = new Audio("tower_game_music.mp3")
music.load();
music.volume = 0.70;
const steps = new Audio("steps.mp3");
steps.load();
const gameOverSFX =  new Audio("gameOver2.mp3")
gameOverSFX.load();
const gameStart = new Audio("gameStart.mp3")
gameStart.load();
let soundPlayed = false;
spike.volume = 0.5;
music.volume  = 0.5;
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const soundButton = document.querySelector('.sound');
const musicButton = document.querySelector('.music');
soundButton.addEventListener('click', toggleSound);
musicButton.addEventListener('click', toggleMusic);
const button1 = new Audio("button1.mp3");

let platformWidth = 500;
let platformHeight = 15;

const platformStart = canvas.height - 50;
const gravity = 0.33;
const bounceVelocity = -10;

let minPlatformSpace = 90;
let maxPlatformSpace = 120;
let maxObstacles =5;

let score = 0;

let platforms = [{
  x: canvas.width / 2 - platformWidth / 2,
  y: platformStart
}];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

let obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;

function spawnObstacles() {
  if (obstacles.length >= maxObstacles) return;
  let y = canvas.height + 150; 
  while (y > 0) {
    y -= platformHeight + random(600, 900);
    let x = random(1, canvas.width - 1 - obstacleWidth); 
    if (Math.random() < 0.1) { 
      obstacles.push({ x, y :0});
      spike.play();
  }
}
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
  width: 30 *1.3,
  height: 45*1.3,
  x: canvas.width /2 - 20,
  y: platformStart - 60,
  dx: 0,
  dy: 0
};

let keydown = false;
let prevPlayerY = player.y;

function toggleSound() {
  jumpSFX.muted = !jumpSFX.muted;
  gameOverSFX.muted = !gameOverSFX.muted;
  steps.muted = !steps.muted;
  button1.muted = !button1.muted;
  gameStart.muted = !gameStart.muted;
  spike.muted = !spike.muted;

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
  ctx.fillText('CONTROLS:', 32, 40);
  ctx.fillText('A    W    D', 38, 90);
  if (player.y > canvas.height){
    ctx.clearRect(0, 0, tutorial.width, tutorial.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER', 20, tutorial.height/ +3);
    ctx.font = '18px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Press "Space"', 27 , tutorial.height/1.50);
    ctx.fillText('to reset', 52 , tutorial.height/1.10);
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
  ctx.fillText(score, 10, 50);
}

function resetGame() {
  music.volume  = 0.5;
  score = 0;
  platformWidth = 500;
  platforms = [{
    x: canvas.width / 2 - platformWidth / 2,
    y: platformStart
  }];
  player.x = canvas.width / 2  - player.width / 2;
  player.y = platformStart - 70;
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
  obstacles = [];
  
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
        x: (0),
        y: platforms[platforms.length - 1].y - (platformHeight + random(minPlatformSpace, maxPlatformSpace))
      })
      score += 100;
      if (platformWidth <=30){
        platformWidth=30;
      }
      else if (platformWidth >= 5){
        platformWidth-=0.5;
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
  else if (player.y > canvas.height){
    if (!soundPlayed) {
        gameOverSFX.play();
        soundPlayed = true;
      }
      context.clearRect(0,0,canvas.width,canvas.height);
      
      context.font = '40px Arial';
      context.fillStyle = 'black';
      context.fillText('GAME OVER', canvas.width/2 - 115, canvas.height/2);
      context.font = '25px Arial';
      context.fillStyle = 'black';
      context.fillText('Press "Space" to reset', canvas.width/2 - 115, canvas.height/1.50);
      
      music.volume = 0.10;
      document.addEventListener('keydown', function(e) {
        if (e.which === 32) {
          soundPlayed = false;
          resetGame();
          gameStart.play();

        }
        
      });
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
      player.y = platform.y - player.height; 
      player.dy = 0;
    }

    
  });


  obstacles.forEach(function(obstacle) {
    if (player.y < canvas.height / 2 && player.dy < 0){
    obstacle.y += -player.dy;}
   
    context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
  });

  
    obstacles.forEach(function(obstacle) {
      if (
        player.x + player.width > obstacle.x && 
        player.x < obstacle.x + obstacleWidth && 
        player.y + player.height > obstacle.y && 
        player.y < obstacle.y + obstacleHeight  
      ) {
        player.y = canvas.height + 1000;
        

       
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
  });

  obstacles = obstacles.filter(function(obstacle) {
    return obstacle.y < canvas.height;
  });
  if (player.y < canvas.height / 2 && player.dy < 0) {
    spawnObstacles();
    
  }

  displayScore();
  tutorial();
}

document.addEventListener('keydown', function(e) {
  if (e.which === 65) {
    keydown = true;
    player.dx = -3;
   
    steps.play();
  }
  else if (e.which === 68) {
    keydown = true;
    
    steps.play();
    player.dx = 3;
  }
  else if (e.which === 87 && player.dy == 0) {
    player.dy = bounceVelocity;
    jumpSFX.play();
    
  }

});

document.addEventListener('keyup', function (e) {
  keydown = false;
  steps.pause();
});
document.addEventListener('click', function() {
  playButtonSound();
});

requestAnimationFrame(loop);