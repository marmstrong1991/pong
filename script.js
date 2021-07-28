var PLAY_TABLE_WIDTH = 800;
var PLAY_TABLE_HEIGHT = 400;
var TABLE_LINE_WIDTH = 10;
var TABLE_PADDLE_LENGTH = 100;

function makeRectangle(x, y, width, height, bgcolor) {
    console.log("FUNCTION makeRectangle() CALLED");
    var element = document.createElement("div");

    var stylevalue = element.style;
    stylevalue.position = "absolute";
    stylevalue.padding = "0";
    stylevalue.backgroundColor = bgcolor;
    stylevalue.top = y + "px";
    stylevalue.left = x + "px";
    stylevalue.width = width + "px";
    stylevalue.height = height + "px";
    return element;
}


if (!document.addEventListener) {
    document.addEventListener = function(eventOccuredName, func) {
        eventOccuredName = "on" + eventOccuredName;
        if (this[eventOccuredName]) {
            var temp = this[eventOccuredName];
            this[eventOccuredName] = function() {
                console.log(event);
                temp(event);
                func(event);
            };
        } else {
            this[eventOccuredName] = function() {
                func(event)
            };
        }
    };
}

function Player(scoreDisplayValue, x, y, width, height) {
    console.log("FUNCTION Player() CALLED");
    this.x = x;
    this.y = y;
    this.startY = y;
    this.width = width;
    this.height = height;
    this.score = 0;
    this.scoreDisplay = scoreDisplayValue;
    this.elem = makeRectangle(this.x, this.y, this.width, this.height, "#000000");
    document.getElementById("board").appendChild(this.elem);
}

Player.prototype.reset = function() {
    this.ToMoveUpdate(this.startY);
    this.score = 0;
    this.scoreDisplay.innerHTML = this.score;
};

Player.prototype.ToMoveUpdate = function(y) {
    console.log("FUNCTION ToMoveUpdate() CALLED");
    this.y = y;
    if (this.y > PLAY_TABLE_HEIGHT - TABLE_PADDLE_LENGTH) {
        this.y = PLAY_TABLE_HEIGHT - TABLE_PADDLE_LENGTH;
    } else if (this.y < 0) {
        this.y = 0;
    }
    this.elem.style.top = Math.floor(this.y) + "px";
};

Player.prototype.scored = function() {
    this.score++;
    this.scoreDisplay.innerHTML = this.score;
};


Player.prototype.AI = function(ballMotion) {
    console.log("FUNCTION Player.prototype.AI() CALLED");
    if (ballMotion.dx > 0) {
        if (ballMotion.y > this.y + this.height - TABLE_LINE_WIDTH) {

            this.ToMoveUpdate(this.y + 1);
        } else if (ballMotion.y < this.y) {

            this.ToMoveUpdate(this.y - 1);
        }
    }
};


Player.prototype.intersect = function(ballMotion) {
    return ballMotion.x + ballMotion.width >= this.x &&
        ballMotion.x <= this.x + this.width &&
        ballMotion.y + ballMotion.height >= this.y &&
        ballMotion.y < this.y + this.height;
};

Player.prototype.bounce = function(ball) {
    if (this.intersect(ball)) {

        ball.dx *= -1.1;

        var dy = (this.y + this.height / 2) - (ball.y + ball.height / 2);

        ball.dy -= dy / 333;


        return true;
    }

    return false;
}


function Ball(width, height) {
    console.log("FUNCTION Ball() CALLED");
    this.x = -1000;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.elem = makeRectangle(this.x, this.y, this.width, this.height, "#00ff00");
    document.getElementById("board").appendChild(this.elem);
}


Ball.prototype.drop = function(direction, speed) {

    this.x = -100;
    this.y = 0;
    this.display();


    this.x = (PLAY_TABLE_WIDTH - TABLE_LINE_WIDTH) / 2;
    this.y = (PLAY_TABLE_HEIGHT - TABLE_LINE_WIDTH) / 2;

    var vel = 0.2 + 0.3 * speed / 8;

    var angle = (Math.random() * 2 - 1) * Math.PI / 4;

    this.dx = direction * Math.cos(angle) * vel;
    this.dy = Math.sin(angle) * vel;
};

Ball.prototype.display = function() {
    this.elem.style.top = Math.floor(this.y) + "px";
    this.elem.style.left = Math.floor(this.x) + "px";
};

Ball.prototype.advance = function() {
    this.x += this.dx;
    this.y += this.dy;
};

Ball.prototype.bounced = function(p1, p2, maxY) {

    if (this.y < 0 || this.y >= maxY) {
        this.dy *= -1;
    }
    return p1.bounce(this) || p2.bounce(this);
};

var p1, p2, ball, timer, lastFrame, startButton, statusBox, state;
window.onload = function() {
    console.log("FUNCTION window.onload CALLED");
    startButton = document.getElementById("start");

    statusBox = document.getElementById("status");
    ball = new Ball(TABLE_LINE_WIDTH, TABLE_LINE_WIDTH);

    p1 = new Player(
        document.getElementById("score1"), // score box
        TABLE_LINE_WIDTH, // the location of the paddle is spaced enough to give a full ball-width behind it
        (PLAY_TABLE_HEIGHT - TABLE_PADDLE_LENGTH) / 2, // vertically center the paddle on the play area
        TABLE_LINE_WIDTH, // the paddle's width is the same size as all of the other lines
        TABLE_PADDLE_LENGTH); // standardized height

    // exactly the same as the other paddle, except on the opposite side of the screen.
    p2 = new Player(
        document.getElementById("score2"),
        PLAY_TABLE_WIDTH - TABLE_LINE_WIDTH * 2, // the left edge of the paddle is a ball's width and a paddle's width away from the right edge of the board
        (PLAY_TABLE_HEIGHT - TABLE_PADDLE_LENGTH) / 2,
        TABLE_LINE_WIDTH,
        TABLE_PADDLE_LENGTH);
};


function movePlayer1(y) {
    p1.ToMoveUpdate(y - TABLE_PADDLE_LENGTH / 2);
}

if (navigator.userAgent.indexOf("iPad") != -1 ||
    navigator.userAgent.indexOf("iPod") != -1 ||
    navigator.userAgent.indexOf("iPhone") != -1 ||
    navigator.userAgent.indexOf("Android") != -1) {
    console.log("Is Mobile OS");
    document.addEventListener("touchmove", function(evt) {
        if (evt.touches.length > 0) {
            movePlayer1(evt.touches[0].pageY);
        }
        evt.preventDefault();
    });
} else {
    console.log("Is Desktop OS");
    document.addEventListener("mousemove", function(evt) {
        movePlayer1(evt.clientY);
    });
}



function titleScreen(delta) {
    //not going to do anything right now
}

function prePlay(delta) {
    console.log("FUNCTION prePlay() CALLED");
    if (delta < 1000) // Displayed during the first second
        statusBox.innerHTML = "Ready...";
    else if (delta < 2000) // Displayed during the second second
        statusBox.innerHTML = "Set...";
    else if (delta < 3000) // Displayed during the third second
        statusBox.innerHTML = "GO!";
    else {
        statusBox.style.display = "none"; // hide the status box we were just using
        state = updateGame; // change the state of the game to live-action
        return true; // tell the calling function that this function says its okay to update the timer
    }
    return false;
}

function updateGame(delta) {
    console.log("FUNCTION updateGame() CALLED");
    /* to update the location of the game, we're going to simulate it's position at
    every millisecond since the last update. */
    for (var i = 0; i < delta && state == updateGame; ++i) {
        // move the ball
        ball.advance();

        // check to see what happened to the ball
        if (!ball.bounced(p1, p2, PLAY_TABLE_HEIGHT - TABLE_LINE_WIDTH)) {
            var scoringPlayer = null;
            /* if the ball didn't hit anything, did it go past
            any of the paddles? */
            if (ball.x < p1.x) {
                // slipping past paddle 1 means player 2 scored
                scoringPlayer = p2;
            } else if (ball.x > p2.x) {
                // slipping past paddle 1 means player 2 scored
                scoringPlayer = p1;
            }

            // if one of the players scored
            if (scoringPlayer != null) {
                // increase their score
                scoringPlayer.scored();
                //redrop the ball
                ball.drop(scoringPlayer == p1 ? 1 : -1, p1.score + p2.score);
                //show the status box for the next game state 
                statusBox.style.display = "block";
                if (scoringPlayer.score < 5) {
                    /* we're still playing if the person who just scored hasn't hit
                    the max score. */
                    state = prePlay;
                } else {
                    state = gameOver;
                }
            }
        }
    }

    if (state == updateGame) {

        for (var i = 0; i < delta; i += AI_STEP) {
            p2.AI(ball);
        }
        ball.display();
    }

    return true;
}

var AI_STEP = 5;


function gameOver(delta) {
    console.log("FUNCTION gameOver() CALLED");
    if (delta < 5) {
        statusBox.innerHTML = "Game Over";
    } else {
        clearInterval(timer);
        statusBox.style.display = "none";
        startButton.style.display = "block";
        p1.reset();
        p2.reset();
        state = titleScreen;
        return true;
    }
    return false;
}

function timerTick() {
    console.log("FUNCTION timerTick() CALLED");
    var currentFrame = new Date().getTime();
    var delta = currentFrame - lastFrame;
    if (state(delta)) {
        lastFrame = currentFrame;
    }
}

function start() {
    console.log("FUNCTION start() CALLED");
    startButton.style.display = "none";
    statusBox.style.display = "block";
    lastFrame = new Date().getTime();
    ball.drop(1, 0);
    state = prePlay;
    timer = setInterval(timerTick, 33); //roughly 30 FPS  (1000 / 30) = 33
}