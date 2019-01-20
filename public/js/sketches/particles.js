var canvas, world;

var n = 200;
var G = 0.01;

function Particle(p, v, m) {
  this.id = Math.random() + Math.random() + Math.random();
  this.p = p;
  this.v = v;
  this.a = createVector(0, 0);
  this.m = m;
}
  
Particle.prototype.update = function() {
  this.p.add(this.v);
  this.v.add(this.a);
  this.a = createVector(0, 0);
}

Particle.prototype.forceBy = function(particle) {
  b = createVector(0, 0);
  b.sub(this.p);
  b.add(particle.p);
  r = b.mag();
  b.heading();
  b.mult(G * (particle.m * this.m)/(r*r));
  return b;
}

function randomParticleSomewhere(x, y) {
  let p = createVector(x, y);
  let v = createVector(0.01 * (Math.random() - 0.5), 0.01 * (Math.random() - 0.5));
  return new Particle(p, v, (Math.random()*Math.random())*100 + 0.01);
}

function randomParticle() { 
  return randomParticleSomewhere(Math.random() * width, Math.random() * height);
}

function newWorld(n) {
  var i = 0;
  var world = [];
  while (i++ < n) 
    world.push(randomParticle());
  return world;
}

function updateWorld(world) {
  var i = 0;
  while (i < world.length) { 
    var j = 0;
    while (j < world.length) {
      if (world[i].id != world[j].id) {
        force = world[i].forceBy(world[j]);
        force.div(world[i].m);
        world[i].a.add(force);
      }
      j++;
    }
    i++;
  }
  i = 0;
  while (i < world.length) {
    world[i++].update();
  }
}

function displayWorld(world) {
  var i = 0;
  while (i < world.length) {
    let radius = world[i].m + 1;
    noFill();
    if (world[i].id < 1) {
      stroke(world[i].id/3 * 255, 0, 0);
    } else if (world[i].id < 2) {
      stroke(0, world[i].id/3 * 255, 0);
    } else {
      stroke(0, 0, world[i].id/3 * 255);
    }
    ellipse(world[i].p.x, world[i].p.y, radius, radius);  
    i++;
  }
}

function setup() {
  canvas = createCanvas(windowWidth/1.2, windowHeight/1.4);
  canvas.parent('sketch');
  world = newWorld(n);
}

function draw() {
  background(0);
  updateWorld(world);
  displayWorld(world);
}

function windowResized() {
  resizeCanvas(windowWidth/1.2, windowHeight/1.4);
}

function mouseClicked() {
  world.push(randomParticleSomewhere(mouseX, mouseY));
}
