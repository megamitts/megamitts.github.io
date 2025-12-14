let stars = [];
let noiseScale = 0.9;   // how tightly the noise pattern varies
let starCount = 200;    // how many stars to generate



let blastInterval = 90;   // frames between blasts (~1.5 sec @60fps)
let lastBlast = 0;

let t=0;

const confetti = [];
const NUM = 500;

let moonCraterData = []; // store crater positions/sizes

let fadeAlpha = 0;

const palette = [
  "#FF595E",
  "#FFCA3A",
  "#8AC926",
  "#1982C4",
  "#6A4C93"
];

const gravity = 0.08;
let font1;

function preload(){
  
  font1 = loadFont('font.ttf');
  
}

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);

  randomSeed(42);   // optional: ensures the same starfield each run
  noiseSeed(99);    // optional: keeps noise consistent too

  while (stars.length < starCount) {
    // Start with a random base position
    let x = random(width);
    let y = random(height);

    // Add smooth Perlin noise variation
    let offsetX = (noise(x * noiseScale, y * noiseScale) - 0.5) * 40;
    let offsetY = (noise(x * noiseScale + 100, y * noiseScale + 100) - 0.5) * 40;

    let newX = x + offsetX;
    let newY = y + offsetY;

    // Only keep stars that stay within bounds
    if (newX >= 0 && newX <= width && newY >= 0 && newY <= 400) {
      stars.push({ x: newX, y: newY });
    }
  }
  
  
  
  
  let moonCenterX = 300;
  let moonCenterY = 100;
  let moonRadius = 50;
  let craterCount = 60;
  randomSeed(100);
  noiseSeed(299);
  for (let i = 0; i < craterCount; i++) {
    // mix small and occasional large craters
    let r = random(2, 6);        // small crater
    if (i < 5) r = random(10, 18); // make 5 large basins

    let angle = random(TWO_PI);
    let distFromCenter = random(moonRadius * 0.1, moonRadius * 0.95);
    let cx = moonCenterX + cos(angle) * distFromCenter;
    let cy = moonCenterY + sin(angle) * distFromCenter;

    // add subtle Perlin noise for irregularity
    let offset = 1.5;
    cx += (noise(cx * 0.05, cy * 0.05) - 0.5) * offset;
    cy += (noise(cx * 0.05 + 100, cy * 0.05 + 100) - 0.5) * offset;

    let craterShade = random(70, 130);
    let craterAlpha = random(120, 200);

    // optional highlight for depth illusion
    let highlight = {
      x: cx - r * 0.2,
      y: cy - r * 0.2,
      size: r * 0.6
    };

    moonCraterData.push({cx, cy, r, craterShade, craterAlpha, highlight});
  }
  
  
  for (let i = 0; i < NUM; i++) {
    confetti.push(new Confetto());
  }

  // First blast (next frame)
  setTimeout(blastConfetti, 50);
}

// function blastConfetti() {
//   for (const c of confetti) {
//     c.blast();
//   }
// }

let blastIndex = 0;

function blastConfetti() {
  for (let i = 0; i < 1; i++) {
    confetti[blastIndex].blast();
    blastIndex = (blastIndex + 1) % confetti.length;
  }
}


function draw() {
  background(20, 30, 40);
  
  stroke(255);
  for (let s of stars) {
  point(s.x, s.y); 
}

  // // Trigger repeating blasts
  // if (frameCount - lastBlast > blastInterval) {
  //   blastConfetti();
  //   lastBlast = frameCount;
  // }
  
  //moon

  push();
  drawingContext.filter = 'blur(3px)';
  
  fill(246, 241, 213);
  circle(300,100,100);
  
  drawingContext.filter = 'none';
  pop();
  
  push();
  fill(255,204,0, fadeAlpha);
  noStroke();
  textFont(font1,32);
  
  text('Happy New Year 2026', 0, 200);
  pop();
  
 // draw craters
  
  for (let c of moonCraterData) {
    noStroke();
    fill(c.craterShade, c.craterShade, c.craterShade, 50);
    ellipse(c.cx, c.cy, c.r, c.r);
  
    
    
    fill(255, 255, 255, 40); // subtle highlight
    ellipse(c.highlight.x, c.highlight.y, c.highlight.size, c.highlight.size);
    
  }
  blastConfetti();
  
  for (const c of confetti) {
    c.update();
    c.draw();
  }
  
  t+=0.05;
  fadeAlpha = 255*sin(t);
}



class Confetto {
  constructor() {
    this.active = false;
    this.reset();
  }

  blast() {
    // Blast origin (bottom center)
    this.x = width / 2 + random(-40, 40);
    this.y = height + 20;

    const angle = random(-PI * 0.85, -PI * 0.15);
    const force = random(4, 11);

    this.vx = cos(angle) * force;
    this.vy = sin(angle) * force;

    this.w = random(6, 14);
    this.h = random(3, 8);

    this.angle = random(TAU);
    this.spin = random(-0.2, 0.2);

    this.col = color(random(palette));
    this.drag = random(0.985, 0.995);

    this.active = true;
  }

  reset() {
    // Stay off-screen and inactive
    this.x = -1000;
    this.y = -1000;
    this.vx = 0;
    this.vy = 0;
    this.active = false;
  }

  update() {
    if (!this.active) return;

    this.vy += gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;

    this.x += this.vx;
    this.y += this.vy;

    this.angle += this.spin;

    if (
      this.y > height + 100 ||
      this.x < -100 ||
      this.x > width + 100
    ) {
      this.reset();
    }
  }

  draw() {
    if (!this.active) return;

    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(this.col);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);

    pop();
  }
}