let x = 300;
let y = 300;
let r = 50;
let loaded = false;
let angle = 0;

let count = 1;

let circles = [];


/* scrolly variables */

let fontImage;

let charWidth = 32;
let charHeight = 32;
let charsPerRow = 10;

let charset = ' !      ()  , . 0123456789:     ?ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
let message = "HAPPY BIRTHDAY PAUL! THIS LITTLE INTRO WAS CODED VERY QUICKLY IN P5JS. IT FEATURES A SIN WAVE SCROLLY, BITMAP FONT (VERY RETRO!), A NICE AND MODERN CURSOR(BASED ON MICKEY MOUSE) AND A LITTLE CONCENTRIC CIRCLE EFFECT I REMEMBER FROM AN INTRO YEARS BACK AND I FINALLY CRACKED HOW TO MAKE IT (IT IS ALL TO DO WITH SINES, COSINES AND NEGATIVE COSINES! AND I FAILED MATHS TERRIBLY!)...OH AND LAST, BUT CERTAINLY NOT LEAST, MUSIC BY NUKE OF ANARCHY!!!  ANYHOW CLICK YOUR MOUSE FOR THE REAL PRESENT: A PHILOSOPHY APP I CALL ALSO SPRACH MEGAMITTS   ";
let chars = [];
//let spacing = 20;
let speed = 2;
let amplitude = 10;
let frequency = 0.02;

function imageLoaded(imageL) {
  fontImage = imageL;
  
}

function songLoaded(songL) {
  
  nuke = songL;
  loaded = true;
  nuke.loop();
}


function setup() {
  createCanvas(600, 600);
  
  //nuke.loop();
  cursor('mouse.png');
  fontImage = loadImage('font.png', imageLoaded);
  
  nuke = loadSound('sunday_best.mp3', songLoaded);
  
  /* Scroll Setup */
  
  noSmooth(); // Keep it crisp and pixel-perfect
  pixelDensity(1);
  for (let i = 0; i < message.length; i++) {
    let x = width + i * charWidth;
    chars.push({ char: message[i], x: x });
  }
  
  
  
//   textSize(24);
//   textFont('monospace');

//   // Initialize characters offscreen to the right
//   for (let i = 0; i < message.length; i++) {
//     let x = width + i * spacing;
//     chars.push({ char: message[i], x: x });
//   }
  
  
  /* circles set up */
  
  // Each object has its own angle and speed (angleIncrement)
  circles = [
    { amplitude: 10, phaseOffset: 0, radiusScale: 1, yDir: -1, angle: 0, angleIncrement: 0.05 },
    { amplitude: 25, phaseOffset: PI / 2, radiusScale: 3, yDir: -1, angle: 0, angleIncrement: 0.1 },
    { amplitude: 50, phaseOffset: PI, radiusScale: 6.5, yDir: 1, angle: 0, angleIncrement: 0.05 }
  ];
}

function draw() {
  
  if (!loaded) {
    push();
    fill(0);
    stroke(255);
    text('Loading', 0, 50);
    pop();
    translate(width/2, height/2);
    rotate(angle);
    strokeWeight(4);
    
    if (count === 1){
      stroke(255,0,0);
    } else if (count === 2){
      stroke(0, 255, 0);
    } else if (count === 3){
      stroke(0, 0, 255);
    }
    
    
    line (0,0,100,100);
    angle += 1;
    count ++;
    if (count > 3){
      count = 1
    }
    
    
  } else {
  
  
  background(0);
  
  
 
  
  
  push();
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];

    let offsetX = sin(c.angle + c.phaseOffset) * c.amplitude;
    let offsetY = cos(c.angle + c.phaseOffset) * c.amplitude * c.yDir;

    let movingX = x + offsetX;
    let movingY = y + offsetY;

    concentric(movingX, movingY, r * c.radiusScale);

    // Update this circle's angle
    c.angle += c.angleIncrement;
  }
  pop();
  
   scroll();
  }
}

function concentric(x, y, r) {
  noFill();
  stroke(255);
  strokeWeight(10);
  circle(x, y, r);
}

function scroll(){
  
  for (let i = 0; i < chars.length; i++) {
    let ch = chars[i];
    //let y = height - charHeight + sin(ch.x * frequency) * amplitude;
    
    let y = 80 - charHeight + sin(ch.x * frequency) * amplitude;
    drawBitmapChar(ch.char, ch.x, y);
    ch.x -= speed;

    if (ch.x < -charWidth) {
      let lastCharX = chars.reduce((max, c) => max > c.x ? max : c.x, 0);
      ch.x = lastCharX + charWidth;
    }
  }
  
}

function drawBitmapChar(c, x, y) {
  let index = charset.indexOf(c);
  if (index === -1) return;

  let sx = (index % charsPerRow) * charWidth;
  let sy = Math.floor(index / charsPerRow) * charHeight;

  image(fontImage, x, y, charWidth, charHeight, sx, sy, charWidth, charHeight);
}


function mousePressed(){
  nuke.stop();
  window.open("https://megamitts.github.io/philosophy/");
}