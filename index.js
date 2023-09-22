// CLASSES

class Display {
    constructor() {
        document.getElementsByTagName("canvas")[0].outerHTML = '<canvas id="canvas" width="300" height="400"></canvas>'

        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

    }

    background(color) {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    rect(x, y, width, height, color) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    write_text(text, x, y, color, font) {
        this.ctx.beginPath();
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
    }
}

class Bird {
    constructor(x, y, yv, yv_cap, g, width, height, color) {
        this.x = x;
        this.y = y;
        this.yv = yv;
        this.yv_cap = yv_cap;
        this.g = g;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    flap() {
        this.yv = -9;
    }

    draw() {
        display.rect(this.x, this.y, this.width, this.height, this.color);
    }

    tick() {
        this.y += this.yv;
        if (this.yv + this.g < this.yv_cap) this.yv += this.g;

        if (0 > this.y || this.y > display.canvas.height) {
            game_over = true;
        }


        this.draw();
    }
}

class Pipe {
    constructor(x, xv, gap_y, width, gap_height, color) {
        this.x = x;
        this.xv = xv;
        this.gap_y = gap_y;
        this.width = width;
        this.gap_height = gap_height;
        this.height = display.canvas.height;
        this.color = color;
        this.cleared = false;
    }

    collided_with(bird) {
        return this.x < bird.x + bird.width && bird.x < this.x + this.width && (bird.y < this.gap_y - 0.5 * this.gap_height || this.gap_y + 0.5 * this.gap_height < bird.y + bird.height)
    }

    is_cleared(bird) {
        if (!this.cleared) {
            this.cleared = bird.x > this.x + this.width;
            return this.cleared;
        } else {
            return false;
        }
    }

    reset() {
        this.x += display.canvas.width;
        this.gap_y = randint(100, display.canvas.height - 100)
        this.gap_height = randint(100, 200);
        this.cleared = false;
    }

    draw() {
        display.rect(this.x, 0, this.width, this.gap_y - 0.5 * this.gap_height, this.color);
        display.rect(this.x, this.gap_y + 0.5 * this.gap_height, this.width, display.canvas.height, this.color);
    }

    tick() {
        this.x -= this.xv;
        if (this.x + this.width < 0) this.reset();
        
        this.draw();
    }
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// MAIN

let score = 0;
let game_over = false;
let display = new Display();
let bird = new Bird(10, 200, 0, 20, 1, 34, 24, "green");
let pipes = [];
let pipe_amount = 3;
for (let i = 1; i <= pipe_amount; i++) {
    pipes.push(new Pipe(Math.floor(display.canvas.width/pipe_amount)*i, 2, randint(100, display.canvas.height - 100), 20, randint(100, 200), "red"));
}

window.addEventListener('keydown', function(event) {
    bird.flap();
}, false);

function tick() {
    if (game_over) {
        display.write_text("You Died!", display.canvas.width/2, 200, "white", "40px Arial");
    } else {
        display.background("black");

        bird.tick();

        for (let pipe of pipes) {
            pipe.tick();
            if (pipe.collided_with(bird)) game_over = true;
            if (pipe.is_cleared(bird)) score++;
        }

        display.write_text(score, display.canvas.width/2, 50, "white", "40px Arial");
    }
}
setInterval(tick, 40);
