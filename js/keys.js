document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
document.addEventListener("mouseup", mouseUp);

function keyDown(/** @type {KeyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 32: //space
            ship.shoot();
            break;
        case 37:    //left arrow
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;
        case 38:    //up arrow
            ship.isThrusting = true;
            break;
        case 39:    //right arrow
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
            break;
    }
}

function keyUp(/** @type {KeyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 32: //space
            ship.canShoot = stage >= 1;
            break;
        case 37:    //left arrow
            ship.rot = 0;
            break;
        case 38:    //up arrow
            ship.isThrusting = false;
            break;
        case 39:    //right arrow
            ship.rot = 0;
            break;
    }
}

function mouseUp(event) {
    let bound = canv.getBoundingClientRect();
    let title = document.getElementById("title");
    let buttonStart = document.getElementById("buttonStart");
    let footer = document.getElementById("footer");
    let textGameOver = document.getElementById("textGameOver");
    let buttonAgain = document.getElementById("buttonAgain");
    let scoreValue = document.getElementById("scoreValue");
    let levelValue = document.getElementById("levelValue");
    let x = event.clientX - bound.left - canv.clientLeft;
    let y = event.clientY - bound.top - canv.clientTop;

    if (stage === 0) {
        if (x > 0.33 * CANV_WIDTH && y > 0.68 * CANV_HEIGHT && x < 0.66 * CANV_WIDTH && y < 0.83 * CANV_HEIGHT) {
            stage = 1;
            stageStarted = 0;
            levelValue.style.display = "inline";
            title.style.display = "none";
            buttonStart.style.display = "none";
            footer.style.display = "none";
            scoreValue.style.display = "inline";
            sMusic.play();
        }
    } else if (stage === 2) {
        if (x > 0.33 * CANV_WIDTH && y > 0.68 * CANV_HEIGHT && x < 0.66 * CANV_WIDTH && y < 0.83 * CANV_HEIGHT) {
            stage = 1;
            stageStarted = 0;
            textGameOver.style.display = "none";
            buttonAgain.style.display = "none";
            footer.style.display = "none";

            scoreValue.style.top = "3%";
            scoreValue.style.right = "2%";
            scoreValue.style.left = "";
            scoreValue.style.transform = "translate(-2%, -3%)";
            scoreValue.style.fontSize = "1em";

            levelValue.style.display = "inline";
            sMusic.muted = false;
            sMusic.currentTime = 0;
            sDeath.currentTime = 0;

            ship = new Ship();
        }
    }
}
