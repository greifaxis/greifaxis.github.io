class Ship {
    constructor(isAfterExplosion) {
        if (isAfterExplosion) {
            this.blinkNum = Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR);
            this.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
        } else
            this.blinkNum = 0;
        this.x = CANV_WIDTH / 2;
        this.y = CANV_HEIGHT / 2;
        this.r = SHIP_SIZE / 2;
        this.a = 90 / 180 * Math.PI;
        this.rot = 0;
        this.isThrusting = false;
        this.thrustX = 0;
        this.thrustY = 0;
        this.isExploded = false;
        this.canShoot = false;
        this.lasers = [];
        this.scoreOneLife = 0;
    }

    shoot() {
        if (this.canShoot && this.lasers.length < LASER_MAX) {
            this.lasers.push({
                x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
                xv: LASER_SPEED * Math.cos(ship.a) / FPS,
                yv: -LASER_SPEED * Math.sin(ship.a) / FPS,
                distance: 0
            });
            sLaser.play();
        }
        this.canShoot = false;
    }

    moveAndDraw() {
        let collision = this.checkCollisions(asteroids);
        if (collision >= 0 && this.blinkNum === 0 || this.isExploded) {
            this.destroyAsteroid(collision);
            this.isExploded = true;
            this.explode();
        } else {
            if (SHOW_BOUNDING) {
                ctx.strokeStyle = "lime";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                ctx.stroke();
            }
            if (this.blinkNum % 2 === 0) {
                if (ship.isThrusting) {
                    ship.thrustX += SHIP_THRUST * Math.cos(ship.a) / FPS;
                    ship.thrustY -= SHIP_THRUST * Math.sin(ship.a) / FPS;
                    sThrust.play();
                    //fire rocket drawing
                    ctx.fillStyle = "red";
                    ctx.strokeStyle = "yellow";
                    ctx.lineWidth = SHIP_SIZE / 10;
                    ctx.beginPath();

                    //nose of the ship
                    ctx.moveTo(        //rearleft
                        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
                        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
                    );
                    //left rear of the ship
                    ctx.lineTo(
                        ship.x - ship.r * 6 / 3 * Math.cos(ship.a),
                        ship.y + ship.r * 6 / 3 * Math.sin(ship.a)
                    );
                    //right rear of the ship
                    ctx.lineTo(
                        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
                        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
                    );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else {
                    ship.thrustX -= FRICTION * ship.thrustX / FPS;
                    ship.thrustY -= FRICTION * ship.thrustY / FPS;
                    sThrust.stop();
                }
                //draw ship (triangular)
                this.drawShip(ship.x,ship.y,ship.r,ship.a);
            }

            if (this.blinkNum > 0) {
                this.blinkTime--;

                if (this.blinkTime <= 0) {
                    this.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
                    this.blinkNum--;
                }
            }

            //draw lasers
            for (let i = 0; i < ship.lasers.length; i++) {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(this.lasers[i].x, this.lasers[i].y, SHIP_SIZE / 10, 0, Math.PI * 2, false);
                ctx.fill();
            }

            //move laser
            for (let i = ship.lasers.length - 1; i >= 0; i--) {
                //distance check
                if (this.lasers[i].distance > LASER_DISTANCE * canv.width) {
                    this.lasers.splice(i, 1);
                    continue;
                }

                //move
                this.lasers[i].x += this.lasers[i].xv;
                this.lasers[i].y += this.lasers[i].yv;

                //traveled distance
                this.lasers[i].distance += Math.sqrt(Math.pow(this.lasers[i].xv, 2) + Math.pow(this.lasers[i].yv, 2));

                //edge
                if (this.lasers[i].x < 0) {
                    this.lasers[i].x = canv.width;
                } else if (this.lasers[i].x > canv.width)
                    this.lasers[i].x = 0;
                if (this.lasers[i].y < 0) {
                    this.lasers[i].y = canv.height;
                } else if (this.lasers[i].y > canv.height)
                    this.lasers[i].y = 0;
            }

            //laser hit detection
            // var asteroidX, asteroidY, asteroidRadius, laserX, laserY;
            for (let i = asteroids.length - 1; i >= 0; i--) {
                let asteroidX = asteroids[i].x;
                let asteroidY = asteroids[i].y;
                let asteroidRadius = asteroids[i].r;

                for (let j = ship.lasers.length - 1; j >= 0; j--) {
                    let laserX = this.lasers[j].x;
                    let laserY = this.lasers[j].y;

                    //hit detection and destruction
                    if (distBetweenPoints(asteroidX, asteroidY, laserX, laserY) < asteroidRadius) {
                        //remove laser
                        this.destroyLaser(laserX, laserY, j);
                        //destroy asteroid
                        this.destroyAsteroid(i);
                    }
                }
            }

            //rotate ship
            ship.a += ship.rot;

            //move ship
            ship.x += ship.thrustX;
            ship.y += ship.thrustY;

            //handle edges
            if (ship.x > CANV_WIDTH + ship.r)
                ship.x = 0 - ship.r;
            else if (ship.x < 0 - ship.r)
                ship.x = CANV_WIDTH + ship.r;
            if (ship.y < 0 - ship.r)
                ship.y = CANV_HEIGHT + ship.r;
            else if (ship.y > CANV_HEIGHT + ship.r)
                ship.y = 0 - ship.r;
        }
    }

    drawShip(shipX,shipY,shipRad,shipAngle){
        ctx.strokeStyle = "white";
        ctx.lineWidth = shipRad / 5;
        ctx.beginPath();
        //nose of the ship
        ctx.moveTo(
            shipX + 4 / 3 * shipRad * Math.cos(shipAngle),
            shipY - 4 / 3 * shipRad * Math.sin(shipAngle)
        );
        //left rear of the ship
        ctx.lineTo(
            shipX - shipRad * (2 / 3 * Math.cos(shipAngle) + Math.sin(shipAngle)),
            shipY + shipRad * (2 / 3 * Math.sin(shipAngle) - Math.cos(shipAngle))
        );
        //right rear of the ship
        ctx.lineTo(
            shipX - shipRad * (2 / 3 * Math.cos(shipAngle) - Math.sin(shipAngle)),
            shipY + shipRad * (2 / 3 * Math.sin(shipAngle) + Math.cos(shipAngle))
        );
        ctx.closePath();
        ctx.stroke();
    }

    destroyLaser(laserX, laserY, laserIndex) {
        this.lasers.splice(laserIndex, 1);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(laserX, laserY, this.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(laserX, laserY, this.r * 0.6, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(laserX, laserY, this.r * 0.3, 0, Math.PI * 2, false);
        ctx.fill();
    }

    //hit detection and destruction
    destroyAsteroid(i) {
        let asteroidX = asteroids[i].x;
        let asteroidY = asteroids[i].y;
        let asteroidRadius = asteroids[i].r;
        sHit.play();
        //split asteroid
        if (asteroidRadius === Math.ceil(ASTEROIDS_SIZE / 2)) {
            asteroids.push(new Asteroid(asteroidX, asteroidY, ASTEROIDS_SIZE / 4));
            asteroids.push(new Asteroid(asteroidX, asteroidY, ASTEROIDS_SIZE / 4));
            this.scoreOneLife += ASTEROIDS_POINTS_L;
        } else if (asteroidRadius === Math.ceil(ASTEROIDS_SIZE / 4)) {
            asteroids.push(new Asteroid(asteroidX, asteroidY, ASTEROIDS_SIZE / 8));
            asteroids.push(new Asteroid(asteroidX, asteroidY, ASTEROIDS_SIZE / 8));
            this.scoreOneLife += ASTEROIDS_POINTS_M;
        } else {
            this.scoreOneLife += ASTEROIDS_POINTS_S;
        }
        //destroy asteroid
        asteroids.splice(i, 1);
    }

    checkCollisions(asteroids) {
        for (let i = 0; i < asteroids.length; i++) {
            if (Math.hypot(this.x - asteroids[i].x, this.y - asteroids[i].y) < this.r + asteroids[i].r) {
                return i;
            }
        }
        return -1;
    }

    explode() {
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 1.4, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
