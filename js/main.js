var canvas;
var ctx;
var fps = 30;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var showWinScreen = true;

var player1Score = 0;
var player2Score = 0;
const winScore = 10;

var paddle1Y = 250;
var paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;

function calMousePos(e) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = e.clientX - rect.left - root.scrollLeft;
  var mouseY = e.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(e) {
  if (showWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  // Moving the ball
  fps;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/fps);
  // Event to restart the game

  canvas.addEventListener('mousedown', handleMouseClick);

  // Setting mouse event for left paddle
  canvas.addEventListener('mousemove', function (e) {
    var mousePos = calMousePos(e);
    paddle1Y = mousePos.y-(paddleHeight/2);
  });
}

function ballReset() {
  if (player1Score >= winScore || player2Score >= winScore) {
    showWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

//Let the computer use right paddle
function computerMovement() {
  var paddle2YCenter = paddle2Y + (paddleHeight/2);
  if (paddle2YCenter < ballY-35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY+35) {
    paddle2Y -= 6;
  }
}

// Re-direct the ball
function moveEverything() {
  if (showWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    // Ball hit the left paddle and re-direct
    if(ballY > paddle1Y && ballY < paddle1Y+paddleHeight) {
      ballSpeedX = -ballSpeedX;

      // lets make ball movement harder ;)
      var deltaY = ballY - (paddle1Y+paddleHeight/2);
      ballSpeedY = deltaY * 0.35;
      } else {
        player2Score++; // Must be BEFORE ballReset
        ballReset();
      }
  }
  if (ballX > canvas.width) {
    if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight) {
      ballSpeedX = -ballSpeedX;

      // lets make ball movement harder ;)
      var deltaY = ballY - (paddle2Y+paddleHeight/2);
      ballSpeedY = deltaY * 0.35;
      } else {
        player1Score++; // Must be BEFORE ballReset
        ballReset();
      }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

// Net on the middle
function drawNet() {
  for(var i=0;i<555;i+=30) {
    colorRect(canvas.width/2-1,i,2,20,'white');
  }
}

// Displayed canvas
function drawEverything() {
  // Background canvas
  colorRect(0, 0,canvas.width,canvas.height,'black');

  if (showWinScreen) {
    ctx.fillStyle = 'white';
      if (player1Score >= winScore) {
        ctx.fillText("Sen Kazandın, tebrikler!", 310,250);
    } else if (player2Score >= winScore) {
      ctx.fillText("Ne yazık ki bilgisayara yenildin!", 280,250);
    }
    ctx.font='18px Baloo';
    ctx.fillText("Yeni oyuna başlamak için Tıkla!", 280,300);
    return;
  }

  drawNet();

  // Left paddle canvas
  colorRect(0,paddle1Y,paddleThickness,paddleHeight, 'white');

  // Right paddle canvas
  colorRect(canvas.width-paddleThickness, paddle2Y, paddleThickness, paddleHeight, 'white');

  // The ball canvas
  theBall(ballX, ballY, 10, 'white');

  // Write the score on screen
  ctx.font='14px Baloo';
  ctx.fillText("<< SAYI >>", 370, 578);
  ctx.font='12px Baloo';
  ctx.fillText(" Oyun 10'da Biter! ", 350, 592);
  ctx.font='14px Baloo';
  ctx.fillText("Sen: "+player1Score, 200,570);
  ctx.fillText("Bilgisayar: "+player2Score, canvas.width-200,570);
}

// Canvas template
function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

// As it's noticed :-)
function theBall (centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  ctx.fill();
}
