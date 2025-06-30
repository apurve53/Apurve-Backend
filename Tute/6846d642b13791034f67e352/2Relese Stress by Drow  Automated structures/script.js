let symmetry = 6;
let angle;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angle = 360 / symmetry;
    background(0);
    colorMode(HSB);
}

function draw() {
    translate(width / 2, height / 2);
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;

    if (mouseIsPressed) {
        let hu = frameCount % 360;
        stroke(hu, 255, 255);
        strokeWeight(2);
        for (let i = 0; i < symmetry; i++) {
            rotate(radians(angle));
            line(pmouseX - width / 2, pmouseY - height / 2, mx, my);
            push();
            scale(1, -1);
            line(pmouseX - width / 2, pmouseY - height / 2, mx, my);
            pop();
        }
    }
}