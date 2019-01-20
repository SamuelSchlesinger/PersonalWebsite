var canvas;

function make2DArray(w, h) {
  var a = [];
  var i;
  for (i = 0; i < w; i++) {
    a.push(new Array(h));
  }
  return a;
}

function Medium(w, h) {
  this.w = w;
  this.h = h;
  this.m0 = make2DArray(w, h);
  this.m1 = make2DArray(w, h);
  this.knob = true;
  var i, j;
  for (i = 0; i < w; i++) {
    for (j = 0; j < h; j++) {
      this.m0[i][j] = Math.random() - 0.5;
    }
  }
}

Medium.prototype.update = function() {
  var i, j, k, l;
  for (i = 0; i < this.w; i++) {
    for (j = 0; j < this.h; j++) {
      var n = 0;
      var avg = 0;
      for (k = -1; k <= 1; k++) {
        for (l = -1; l <= 1; l++) {
          if (i + k >= 0 && j + l >= 0 && i + k < this.w && j + l < this.h) {
            var weight = (i == 0 && j == 0) ? 1 : 3;
            n+=weight;
            if (this.knob) 
              avg += this.m0[i + k][j + l] * weight;
            else
              avg += this.m1[i + k][j + l] * weight;
          }
        }
      }
      avg /= n;
      if (this.knob)
        this.m1[i][j] = avg;
      else
        this.m0[i][j] = avg;
    }
  }
  this.knob = !this.knob;
}

Medium.prototype.display = function() {
  var bw = width / this.w;
  var bh = width / this.h;
  var i, j;
  for (i = 0; i < this.w; i++) {
    for (j = 0; j < this.h; j++) {
      noStroke();
      var shade = this.knob ? this.m0[i][j] : this.m1[i][j];
      if (shade > 0) {
        fill(0, shade * 255, 0);
      } else {
        fill(-shade * 255, 0, 0);
      } 
      rect(bw * i, bh * j, bw, bh);
    }
  }
}

Medium.prototype.poke = function(i, j, w) {
  if (this.knob)
    this.m0[i][j] = w;
  else
    this.m1[i][j] = w;
}

var medium;

function setup() {
  canvas = createCanvas(windowWidth/1.2, windowHeight/1.4);
  canvas.parent('sketch');
  medium = new Medium(50, 50);
}

function draw() {
  background(0);
  medium.update();
  medium.display();
  medium.poke(0, 0, 3);
  medium.poke(49, 49, -3);
}

function windowResized() {
  resizeCanvas(windowWidth/1.2, windowHeight/1.4);
  width = windowWidth/1.2;
  height = windowHeight/1.4;
}

function mousePressed() {
  var i = Math.floor(mouseX / (width / medium.w));
  var j = Math.floor(mouseY / (height / medium.h));
  if (mouseButton == LEFT)
    medium.poke(i, j, 10);
  else
    medium.poke(i, j, -10);
}
