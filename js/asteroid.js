class Asteroid {
    constructor(x, y, r) {
        if (x && y && r) {
            this.x = x;
            this.y = y;
            this.r = r;
        } else {
            do {
                this.x = Math.floor(Math.random() * CANV_WIDTH);
                this.y = Math.floor(Math.random() * CANV_HEIGHT);
            } while (distBetweenPoints(ship.x, ship.y, this.x, this.y) < ASTEROIDS_SIZE * 2 + ship.r);
            this.r = ASTEROIDS_SIZE / 2;
        }
        this.offset = [];
        this.xv = Math.random() * ASTEROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1) * (1+level*ASTEROIDS_SPEED_MULTIPLIER);
        this.yv = Math.random() * ASTEROIDS_SPEED / FPS * (Math.random() < 0.5 ? 1 : -1) * (1+level*ASTEROIDS_SPEED_MULTIPLIER);
        this.a = Math.random() * Math.PI * 2;
        this.vert = Math.floor(Math.random() * (ASTEROIDS_VERT + 1) + ASTEROIDS_VERT / 2);

        for (let i = 0; i < this.vert; i++) {
            this.offset.push(Math.random() * ASTEROIDS_JAG * 2 + 1 - ASTEROIDS_JAG);
        }
    }

    moveAndDraw() {
        if (SHOW_BOUNDING) {
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.stroke();
        }


        ctx.strokeStyle = "#cdcdcd";
        ctx.lineWidth = SHIP_SIZE / 16;
        ctx.beginPath();
        ctx.moveTo(
            this.x + this.r * this.offset[0] * Math.cos(this.a),
            this.y + this.r * this.offset[0] * Math.sin(this.a),
        );
        for (let j = 0; j < this.vert; j++) {
            ctx.lineTo(
                this.x + this.r * this.offset[j + 1] * Math.cos(this.a + j * Math.PI * 2 / this.vert),
                this.y + this.r * this.offset[j + 1] * Math.sin(this.a + j * Math.PI * 2 / this.vert),
            );
        }
        ctx.closePath();
        ctx.stroke();

        this.x += this.xv;
        this.y += this.yv;


        if (this.x < 0 - this.r) {
            this.x = canv.width + this.r;
        } else if (this.x > canv.width + this.r) {
            this.x = 0 - this.r;
        }
        if (this.y < 0 - this.r) {
            this.y = canv.height + this.r;
        } else if (this.y > canv.height + this.r) {
            this.y = 0 - this.r;
        }
    }
}







