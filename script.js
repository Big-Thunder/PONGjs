const WIDTH = 800;
const HEIGHT = 400;

let leftPlayerScore = 0;
let rightPlayerScore = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function initGameState() {
    ball.setPos(WIDTH / 2, HEIGHT / 2, false);
}

function drawText() {
    let tSize = 150;
    textSize(tSize);
    textAlign(CENTER, CENTER);
    fill(100);
    text(leftPlayerScore, WIDTH / 6, HEIGHT / 2);
    text(rightPlayerScore, WIDTH * 5 / 6, HEIGHT / 2);
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
}

const pedalParamsLeft = {
    x: 10, y: 10,
    w: 5, h: 60,

    getCollisionRect() {
        return {
            left: this.x, right: this.x + this.w, top: this.y, bottom: this.y + this.h
        };
    },

    move(y) {
        this.y += y;
        if (this.y < 0) this.y = 0;
        if (this.y > HEIGHT - this.h) this.y = HEIGHT - this.h;
    }
};

const pedalParamsRight = {
    x: 770, y: 10,
    w: 5, h: 60,

    getCollisionRect() {
        return {
            left: this.x, right: this.x + this.w, top: this.y, bottom: this.y + this.h
        };
    },

    move(y) {
        this.y += y;
        if (this.y < 0) this.y = 0;
        if (this.y > HEIGHT - this.h) this.y = HEIGHT - this.h;
    }
};

const ball = {
    x: WIDTH / 2, y: HEIGHT / 2,
    w: 15, h: 15,
    moveX: 1, moveY: 0,
    speed: 5,
    canMove: false,

    getCollisionRect() {
        return {
            left: this.x, right: this.x + this.w, top: this.y, bottom: this.y + this.h
        };
    },

    setCanMove(canMove) {
        this.canMove = canMove;
        this.moveX = getRandomInt(0, 2) === 0 ? 1 : -1;
        this.moveY = getRandomInt(0, 2) === 0 ? 0.5 : -0.5;
    },

    setPos(x, y, canMove) {
        this.x = x;
        this.y = y;
        this.canMove = canMove;
    },

    move() {
        if (!this.canMove) 
            return;

        this.x += this.moveX * this.speed;
        this.y += this.moveY * this.speed;

        if (this.x < 0) {
            rightPlayerScore++;
            initGameState();
        }

        if (this.x > WIDTH - this.w) {
            leftPlayerScore++;
            initGameState();
        }

        if (this.y < 0 || this.y > HEIGHT - this.h) {
            this.moveY *= -1;
        }

        computeCollision(this, pedalParamsLeft, "left");
        computeCollision(this, pedalParamsRight, "right");
    }
};

function computeCollision(ball, pedal, side) {
    const b = ball.getCollisionRect();
    const p = pedal.getCollisionRect();

    if (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left) {
        if (side === "left" && ball.moveX > 0) 
            return;
        if (side === "right" && ball.moveX < 0) 
            return;

        ball.moveX *= -1;

        const pedalCenterY = pedal.y + pedal.h / 2;
        const ballCenterY = ball.y + ball.h / 2;

        let offset = (ballCenterY - pedalCenterY) / (pedal.h / 2);

        if (offset > 1) offset = 1;
        if (offset < -1) offset = -1;

        ball.moveY = offset;

        if (Math.abs(ball.moveY) < 0.15) {
            ball.moveY = ball.moveY < 0 ? -0.15 : 0.15;
        }
    }
}

function draw() {
    if (keyIsDown(UP_ARROW)) {
        if (!ball.canMove) ball.setCanMove(true);
        pedalParamsRight.move(-10);
    }

    if (keyIsDown(DOWN_ARROW)) {
        if (!ball.canMove) ball.setCanMove(true);
        pedalParamsRight.move(10);
    }

    if (keyIsDown(87)) {
        if (!ball.canMove) ball.setCanMove(true);
        pedalParamsLeft.move(-10);
    }

    if (keyIsDown(83)) {
        if (!ball.canMove) ball.setCanMove(true);
        pedalParamsLeft.move(10);
    }

    background(20);
    drawText();
    fill(255);

    rect(pedalParamsLeft.x, pedalParamsLeft.y, pedalParamsLeft.w, pedalParamsLeft.h);
    rect(pedalParamsRight.x, pedalParamsRight.y, pedalParamsRight.w, pedalParamsRight.h);
    rect(ball.x, ball.y, ball.w, ball.h);

    ball.move();
}
