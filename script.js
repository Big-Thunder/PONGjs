const WIDTH = 800;
const HEIGHT = 400;

let leftPlayerScore = 0;
let rightPlayerScore = 0;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  let res = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  console.log(res);
  return res;
}

function initGameState(){
    ball.setPos(WIDTH / 2, HEIGHT / 2, false);
}

function drawText(){
    let tSize = 150;

    textSize(tSize);
    textAlign(CENTER, CENTER);
    fill(100);
    text(leftPlayerScore, (WIDTH/6), HEIGHT/2);
    text(rightPlayerScore, WIDTH * (5/6), HEIGHT/2);
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
}

const pedalParamsLeft = {
    x: 10, y: 10,
    w: 5, h: 60,

    move(y){
        this.y += y;

        if(this.y < 0){
            this.y = 0;
        }

        if(this.y > HEIGHT - this.h){
            this.y = HEIGHT - this.h;
        }
    }
};

const pedalParamsRight = {
    x: 770, y: 10,
    w: 5, h: 60,

    move(y){
        this.y += y;

        if(this.y < 0){
            this.y = 0;
        }

        if(this.y > HEIGHT - this.h){
            this.y = HEIGHT - this.h;
        }
    }
};

const ball = {
    x: WIDTH/2, y: HEIGHT/2,
    w: 15, h: 15,
    moveX: 1, moveY:1, speed: 5,
    canMove: false,

    setCanMove(_canMove){
        this.canMove = _canMove;
        let dir = getRandomInt(0, 2);

        this.moveX = dir === 0 ? 1 : -1;
    },

    setPos(posX, posY, resetMove){
        this.x = posX;
        this.y = posY;
        this.canMove = resetMove;
    },

    move(){
        if(!this.canMove){
            return;
        }

        this.x += this.moveX * this.speed;
        this.y += this.moveY * this.speed;

        //wall collisions
        if(this.x < 0){
            rightPlayerScore++;
            initGameState();
        }

        if(this.x > WIDTH - this.w){
            leftPlayerScore++;
            initGameState();
        }

        if(this.y < 0 || this.y > HEIGHT - this.h){
            this.moveY *= -1;
        }

        //pedal collisions
        if(this.x < pedalParamsLeft.x + pedalParamsLeft.w && this.y < pedalParamsLeft.y + pedalParamsLeft.h && this.y > pedalParamsLeft.y){
            this.moveX *= -1;
        }

        if(this.x > pedalParamsRight.x - pedalParamsRight.w && this.y < pedalParamsRight.y + pedalParamsRight.h && this.y > pedalParamsRight.y){
            this.moveX *= -1;
        }
    }
}

function draw() {
    if(keyIsDown(UP_ARROW) === true){
        if(!ball.canMove){
            ball.setCanMove(true);
        }

        pedalParamsRight.move(-10);
    }
    
    if(keyIsDown(DOWN_ARROW) === true){
        if(!ball.canMove){
            ball.setCanMove(true);
        }

        pedalParamsRight.move(10);
    }
    
    if(keyIsDown(87) === true){
        if(!ball.canMove){
            ball.setCanMove(true);
        }

        pedalParamsLeft.move(-10);
    }
    
    if(keyIsDown(83) === true){
        if(!ball.canMove){
            ball.setCanMove(true);
        }

        pedalParamsLeft.move(10);
    }

    // if(keyIsDown(82) === true){
    //     initGameState();
    // }

    
    background(20, 20, 20);
    
    drawText();
    fill(255);

    rect(pedalParamsLeft.x, pedalParamsLeft.y, pedalParamsLeft.w, pedalParamsLeft.h);
    rect(pedalParamsRight.x, pedalParamsRight.y, pedalParamsRight.w, pedalParamsRight.h);
    rect(ball.x, ball.y, ball.w, ball.h);
    
    ball.move();
}

