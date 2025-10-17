let yoff = 0.00;
let stars = [];
let noiseScale = 0.9;   // how tightly the noise pattern varies
let starCount = 200;    // how many stars to generate

let shootingStar = null;
let shootingStartTime = 0;
let shootingInterval = 10000; // every 10 seconds

let satX = -40;
let satY = 100;

let moonCraterData = []; // store crater positions/sizes


function setup() {
  createCanvas(400, 400);
  
  
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
    if (newX >= 0 && newX <= width && newY >= 0 && newY <= 250) {
      stars.push({ x: newX, y: newY });
    }
  }
}

function draw() {
  
  background(0);
  
  strokeWeight(1);
  stroke(255,255,255,100);
  for (let s of stars) {
  point(s.x, s.y); 
}

  //moon

  push();
  drawingContext.filter = 'blur(3px)';
  
  fill(246, 241, 213);
  circle(300,100,100);
  
  drawingContext.filter = 'none';
  pop();
  
  
 // draw craters
  
  for (let c of moonCraterData) {
    noStroke();
    fill(c.craterShade, c.craterShade, c.craterShade, 50);
    ellipse(c.cx, c.cy, c.r, c.r);
  
    
    
    fill(255, 255, 255, 40); // subtle highlight
    ellipse(c.highlight.x, c.highlight.y, c.highlight.size, c.highlight.size);
    
  }
  
  
  stroke(255, 248, 220);
  strokeWeight(5);
  point(200,200);
  strokeWeight(4);
  stroke(200,0,0);
  point(230, 170);
  
  
  // satellite
  
  strokeWeight(1);
  stroke(255);
  point(satX, satY);
  satX+=0.3;
  if (satX >= 600){
    satX = -40;
  }
  
  
  var waveOffset = 10;
  var peaks = 0.02;
  for (var i = 250; i <= 400; i += waveOffset) {
    wave(i, i+30 ,0.2 )
  waveOffset += 1;

    if (millis() - shootingStartTime > shootingInterval) {
    shootingStartTime = millis();
    shootingStar = {
      x: random(0, 200),
      y: random(0, 150),
      progress: 0
    };
  }

  // animate the shooting star
  if (shootingStar) {
    shootingStar.progress += 0.002; // speed of animation (lower = slower)

    let sx = shootingStar.x + shootingStar.progress * 100;
    let sy = shootingStar.y + shootingStar.progress * 100;

    // draw the shooting star
    strokeWeight(1)
    stroke(255);
    point(sx, sy);

    // reset once it's done
    if (shootingStar.progress >= 1) shootingStar = null;
  }
    
  }
  //wave

  function wave(w,h,offx) {

    stroke(172, 230, 244,70);
    strokeWeight(0.3)
    fill(5, 170, 156,30)
    beginShape();

    
    let xoff = 0;

    for (let x = 0; x <= width; x += 10) {
      let y = map(noise(xoff, yoff, 200), 0, 2.5, w, h);
      vertex(x, y);
      xoff += offx;
    }
    yoff += 0.001;
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
  

  
  
}