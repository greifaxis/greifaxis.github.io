var canv = document.getElementById("gameCanvas");
canv.setAttribute("Width", CANV_WIDTH);
canv.setAttribute("Height", CANV_HEIGHT);

var stage = 0; //if 0- title screen, 1- game screen, 2 - game over screen,
var stageStarted = 0;

let sLaser = new Sound("sounds/laser.m4a",5,0.2);
let sExplode = new Sound("sounds/explode.m4a",1,0.5);
let sThrust = new Sound("sounds/thrust.m4a",1,0.2);
let sHit = new Sound("sounds/hit.m4a",5,0.3);
let sMusic = new Audio("sounds/music.m4a");
sMusic.volume = 0.3;
sMusic.loop = true;
let sDeath = new Audio("sounds/death.m4a");
sDeath.volume = 0.5;


var ctx = canv.getContext("2d");

var ship = new Ship();
var level = 1;
let lives = GAME_LIVES;
let score = 0;
let nextLevelTime = Math.ceil(NEXT_LEVEL_DUR * FPS);
let nextLevelCountdown = NEXT_LEVEL_COUNTDOWN;
//create asteroids

var asteroids = [];
createAsteroidsBelt(level);

//creating asteroids
function createAsteroidsBelt(modifier) {
    asteroids = [];

    for (let i = 0; i < ASTEROIDS_NUM + modifier; i++) {
        asteroids.push(new Asteroid());
    }
}

function titleScreen() {
    if (stageStarted === 0) {
        createAsteroidsBelt(10);
        stageStarted = 1;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);


    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].moveAndDraw();
    }
}

function gameOver() {
    if(!sDeath.ended){
        sMusic.muted = true;
        sDeath.play();
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    document.getElementById("textGameOver").style.display = "inline";
    document.getElementById("buttonAgain").style.display = "inline";
    document.getElementById("footer").style.display = "inline";
    document.getElementById("levelValue").style.display = "none";

    let scoreValue = document.getElementById("scoreValue");
    scoreValue.style.top = "55%";
    scoreValue.style.left = "50%";
    scoreValue.style.right = "";
    scoreValue.style.transform = "translate(-50%, -55%)";
    scoreValue.style.fontSize = "2em";
    let textGameOver = document.getElementById("textGameOver");
    let buttonAgain = document.getElementById("buttonAgain");
    let footer = document.getElementById("footer");
    textGameOver.style.display = "inline";
    buttonAgain.style.display = "inline";
    footer.style.display = "inline";

    level = 1;
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//set up the game loop
setInterval(update, 1000 / FPS);

function update() {
    //title screen
    if (stage === 0) {
        titleScreen();
    }

    //game screen
    if (stage === 1) {

        if (stageStarted === 0) {
            createAsteroidsBelt(level);
            stageStarted = 1;
        }
        //draw space
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);

        //draw asteroids
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].moveAndDraw();
        }
        if (lives > 0) {
            //draw ship


            ship.moveAndDraw();
            score = ship.scoreOneLife;
            document.getElementById("scoreValue").textContent = score;

            document.getElementById("levelValue").textContent = "LVL " + level;

        }
        //check collision
        ship.checkCollisions(asteroids);
        //check if exploded
        if (ship.isExploded) {
            lives--;
            sExplode.play();
            if (lives <= 0) {
                stage = 2;
            } else {
                ship = new Ship(true);
                ship.scoreOneLife = score;
            }
        }

        //lives
        for (let i = 0; i < lives; i++) {
            ship.drawShip(SHIP_SIZE * (0.8 + i), 0.9 * SHIP_SIZE, 0.4 * SHIP_SIZE, 0.5 * Math.PI);
        }
        if (asteroids.length === 0) {
            document.getElementById("textNextLevel").style.display = "inline";
            document.getElementById("countdown").style.display = "inline";
            document.getElementById("countdown").textContent = nextLevelCountdown;

            if (nextLevelCountdown > 0) {
                nextLevelTime--;
                if (nextLevelTime <= 0) {
                    nextLevelTime = Math.ceil(NEXT_LEVEL_DUR * FPS);
                    nextLevelCountdown--;
                }
            } else {
                document.getElementById("textNextLevel").style.display = "none";
                document.getElementById("countdown").style.display = "none";

                createAsteroidsBelt(level);
                ship = new Ship(false);
                ship.scoreOneLife = score;

                nextLevelCountdown = NEXT_LEVEL_COUNTDOWN;
                level++;
            }
        }
    }
    if (stage === 2) {
        level = 1;
        lives = GAME_LIVES;
        sThrust.stop();
        sHit.stop();
        sLaser.stop();
        gameOver();
    }
}
