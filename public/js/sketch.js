var canvas;

var t = 0;

function setup() {
  canvas = createCanvas(windowWidth / 2, windowHeight / 2);
  canvas.parent('sketch');
}

function draw() {
  background(Math.abs(Math.sin(t)) * 255);
  fill(Math.abs(Math.cos(t)) * 255);
  ellipse(Math.sin(t)*(windowWidth / 4) + 200, Math.sin(t*10) * 5 + (windowHeight / 4), 10, 10)
  t += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth / 2, windowHeight / 2);
}
