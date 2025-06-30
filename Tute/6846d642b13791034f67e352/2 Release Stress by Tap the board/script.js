// Created by Rohit Sharma

alert("Click on the moving board...👆👆")
alert("click as much as u can....😁")
window.onload = function () {
    var canvas = document.createElement("canvas"),
        c = canvas.getContext("2d");
    canvas.width = 345;
    canvas.height = 495;
    document.body.appendChild(canvas);

    var PF1 = [];
    var PF2 = [];
    var PF3 = [];
    var bx = 125;
    var by = 495 / 2;
    var block = new Obstacle(125, 495 / 2);


    function ParticleFase1(x, y) {
        this.c1 = Math.floor(Math.random() * 255);
        this.c2 = Math.floor(Math.random() * 255);
        this.c3 = Math.floor(Math.random() * 255);
        this.x = x;
        this.y = y;
        this.vy = 0;
        this.gravity = 1;
        this.s = 20;
        this.life = 0;
        this.show = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.s, 0, Math.PI * 2, false);
            c.fillStyle = "rgba(" + this.c1 + "," + this.c2 + "," + this.c3 + ",1)";
            c.fill();
        }

        this.update = function () {
            this.y += this.vy;
            this.vy += this.gravity;
        }
    }

    function ParticleFase2(x, y) {
        this.c1 = Math.floor(Math.random() * 255);
        this.c2 = Math.floor(Math.random() * 255);
        this.c3 = Math.floor(Math.random() * 255);
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 10 - 5;
        this.vy = Math.random() * 10 - 20;
        this.gravity = 1;
        this.life = 0;
        this.s = 10;
        this.show = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.s, 0, Math.PI * 2, false);
            c.fillStyle = "rgba(" + this.c1 + "," + this.c2 + "," + this.c3 + ",1)";
            c.fill();
        }
        this.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
        }
    }

    function ParticleFase3(x, y) {
        this.c1 = Math.floor(Math.random() * 255);
        this.c2 = Math.floor(Math.random() * 255);
        this.c3 = Math.floor(Math.random() * 255);
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 5 - 2.5;
        this.vy = Math.random() * 5 - 10;
        this.gravity = 1;
        this.s = 5;
        this.show = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.s, 0, Math.PI * 2, false);
            c.fillStyle = "rgba(" + this.c1 + "," + this.c2 + "," + this.c3 + ",1)";
            c.fill();
        }
        this.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
        }
    }

    function Obstacle(x, y) {
        this.c1 = Math.floor(Math.random() * 255);
        this.c2 = Math.floor(Math.random() * 255);
        this.c3 = Math.floor(Math.random() * 255);
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 15;
        this.bm = true;
        this.show = function () {
            c.fillStyle = "rgba(" + this.c1 + "," + this.c2 + "," + this.c3 + ",1)";
            c.fillRect(this.x, this.y, this.w, this.h);
        }
        this.update = function () {
            if (this.x == canvas.width - this.w) {
                this.bm = true;
            }
            if (this.x == 0) {
                this.bm = false;
            }
            if (this.bm == true) {
                if (this.x <= canvas.width) {
                    this.x--;
                }
            } else {
                if (this.x >= 0) {
                    this.x++;
                }
            }
        }
        this.change = function () {
            this.c1 = Math.floor(Math.random() * 255);
            this.c2 = Math.floor(Math.random() * 255);
            this.c3 = Math.floor(Math.random() * 255);
        }
    }

    canvas.addEventListener('click', function (event) {
        var mouseX = event.clientX - c.canvas.offsetLeft;
        var mouseY = event.clientY - c.canvas.offsetTop;


        PF1.push(new ParticleFase1(Math.floor(mouseX), Math.floor(mouseY)));
    });



    setInterval(function () {
        c.fillStyle = "rgba(0,0,0,0.2)";
        c.fillRect(0, 0, 345, 495);

        block.show();
        block.update();

        for (var i in PF1) {
            var p1 = PF1[i];
            p1.show();
            p1.update();
            if (p1.y >= block.y - p1.s / 4 && p1.y <= block.y + block.h + p1.s / 2) {
                if (p1.x >= block.x - p1.s && p1.x <= block.x + block.w + p1.s) {

                    block.change();
                    for (var i = 0; i < Math.floor(Math.random() * 2 + 1); i++) {
                        PF2.push(new ParticleFase2(p1.x, p1.y - 30));
                    }
                    p1.life++;
                }
            }

            if (p1.y >= 495 || p1.life != 0) {
                delete PF1[i];
            }
        }

        for (var i in PF2) {
            var p2 = PF2[i];
            p2.show();
            p2.update();
            if (p2.y >= block.y - p2.s * 2 && p2.y <= block.y + p2.s / 2) {
                if (p2.x >= block.x - p2.s && p2.x <= block.x + block.w + p2.s) {
                    p2.vx = Math.random() * 10 - 5;
                    p2.vy = Math.random() * 10 - 20;
                    p2.life++;
                    block.change();
                    for (var i = 0; i < 3; i++) {
                        PF3.push(new ParticleFase3(p2.x, p2.y));
                    }
                }
            }
            if (p2.life > 0) {
                delete PF2[i];
            }
            if (p2.y >= 495) {
                delete PF2[i];
            }
        }

        for (var i in PF3) {
            var p3 = PF3[i];
            p3.show();
            p3.update();
            if (p3.y >= block.y - p3.s * 2 && p3.y <= p3.s + block.y + block.h) {
                if (p3.x >= block.x && p3.x <= block.x + block.w) {
                    p3.vx = Math.random() * 5 - 2.5;
                    p3.vy = Math.random() * 5 - 10;
                    block.change();
                }
            }
            if (p3.y >= 495) {
                delete PF3[i];
            }
        }
    }, 30);
};
