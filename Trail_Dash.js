const platformImage = new Image();
platformImage.src = 'TrailDash_plat.jpg';
platformImage.onload = () => {}; 

const obstacleImage = new Image();
obstacleImage.src = 'traildash_obstacle.png';
obstacleImage.onload = () => {}; 

const playerImage = new Image();
playerImage.src = 'tdChara.png';
playerImage.onload = () => {}; 

const jumpSFX = new Audio("jump.mp3")
jumpSFX.load();
const over = new Audio("gameOver3.mp3");
over.load();
const music = new Audio("trail_game.mp3")
music.load();
music.volume = 1;
const gameStart = new Audio("gameStart.mp3")
gameStart.load();
let soundPlayed = false;
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const soundButton = document.querySelector('.sound');
const musicButton = document.querySelector('.music');
soundButton.addEventListener('click', toggleSound);
musicButton.addEventListener('click', toggleMusic);
const button1 = new Audio("button1.mp3");

let jumpHeight = -10;
let groundWidth = 1000;
let groundHeight = 100;

let obstacleArray = [];
let obstacleHeight = 70;
let obstacleWidth = 30;

let obstacleX = 1000;
let obstacleY = 282;

let velocityX = -8;
let velocityY = 0;

let score = 0;
let ground = {
    x: 0,
    y: canvas.height - groundHeight
};

const player = {
    width: 42 *1.2,
    height: 62*1.2,
    x: 50,
    y: 250,
    dx: 0,
    dy: 0
};

let gravity = 0.5;
let prevPlayerY = player.y;
let dead = false;

function toggleSound() {
    jumpSFX.muted = !jumpSFX.muted;
    over.muted = !over.muted;
    gameStart.muted = !gameStart.muted;
    button1.muted = !button1.muted;
  }
  function toggleMusic() {
    
    music.muted = !music.muted;
  }
  function playMusic() {
    music.play();
}

  function playButtonSound() {
    if (soundEnabled) {
    button1.play();
    }
  }


function loop() {
    requestAnimationFrame(loop);
    music.play();
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (dead === false){
        score += 1;
        
    }
    

    player.dy += gravity;
    player.y += player.dy;


    
    context.drawImage(platformImage, ground.x, ground.y, groundWidth, groundHeight);


   
   
    context.drawImage(playerImage, player.x, player.y, player.width , player.height );
    function displayScore() {
        const scoreCanvas = document.getElementById('scoreCanvas');
        const ctx = scoreCanvas.getContext('2d');
        ctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Score: ', 10, 30);
        ctx.fillText(score, 10, 50);
      }
      function tutorial() {
        const tutorial = document.getElementById('tutorial');
        const ctx = tutorial.getContext('2d');
        ctx.clearRect(0, 0, tutorial.width, tutorial.height);
        ctx.font = '17px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('CONTROLS:', 32, 30);
        ctx.fillText('("space")', 43, 65 )
        
      }
      displayScore();
      tutorial();
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            player.x = -100
            


        }
        
        obstacle.x += velocityX;
        
        context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    }
    if (player.x < 0) {
        gameOver();
        
    }

    prevPlayerY = player.y;
    if (player.dy > 0 &&
        player.y + player.height >= ground.y &&
        player.x < ground.x + groundWidth &&
        player.x + player.width > ground.x) {

        player.y = ground.y - player.height;
        player.dy = 0;
    }
}

function placeObstacle() {
    let obstacle = {
        x: obstacleX,
        y: obstacleY,
        height: obstacleHeight,
        width: obstacleWidth
    };
    obstacleArray.push(obstacle);
    if (dead === false){
        
        velocityX -= 1;
    }
    
    if (obstacleArray.length > 5) {
        obstacleArray.shift();
        
    }
}

document.addEventListener('keydown', function(e) {
    if (e.which === 87 && player.dy == 0) {
        player.dy = jumpHeight;
        jumpSFX.play();
    } else if (e.which === 32 && player.dy == 0) {
        player.dy = jumpHeight;
        jumpSFX.play();
    }
});

function gameOver() {
    if (!soundPlayed) {
        
        over.play();
        over.currentTime = 0;
        soundPlayed = true;
      }
      music.volume = 0.50;
    context.clearRect(ground.x, ground.y, ground.width, ground.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    dead = true;
    context.font = '40px Arial';
    context.fillStyle = 'black';
    context.fillText('GAME OVER', canvas.width / 2 - 115, canvas.height / 2);
    context.font = '25px Arial';
    context.fillStyle = 'black';
    context.fillText('Press "Space" to reset', canvas.width / 2 - 115, canvas.height / 1.50);

    document.removeEventListener('keydown', resetHandler); 
    document.addEventListener('keydown', resetHandler);
    cancelAnimationFrame(loop);
    return;
}

function resetGame() {
    music.volume = 1;
    
    over.pause();
    soundPlayed = false;
    gameStart.play();
  obstacleArray = []; 
  player.x = 50; 
  player.y = 250;
  player.dy = 0; 
  score = 0;  
  velocityX = -8; 
  gravity = 0.5;
  dead = false;

          
    document.removeEventListener('keydown', resetHandler); 
    
}

function resetHandler(e) {
    if (e.which === 32) { 
        resetGame();
    }
}
document.addEventListener('click', function() {
    playButtonSound();
  });

setInterval(placeObstacle, 1000 );



requestAnimationFrame(loop);