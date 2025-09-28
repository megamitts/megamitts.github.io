

let r = 80; // radius of circle
let angle = 0;
let dancer;

let palette = ['#7ae582','#ff006e','#8338ec','#3a86ff'];

function preload(){

  dancer = loadImage('ezgif.gif');
  
}

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  //noLoop();
  
}


function draw() {

   
background(0);
push();

translate(width/2, height/2-50);
let bs = map(sin(angle),-1,1,2.1,2.1); // remaps sin(angle) from -1, 1 to 0.85, 1.1
scale(bs, bs); // scale(x,y)
for (let i = 0; i < 4; i++) {
  fill(palette[i]);
  drawBlobs(0,0);
  rotate(80);
}
angle +=2;

  pop();

drawingContext.filter = 'blur(10px)';
  translate(0,0);
  image(dancer, 30,-80);
}

function drawBlobs(x,y){
  push();
translate(x, y);
noStroke();
blendMode(ADD);
drawingContext.filter = 'blur(10px)'; // change blurriness
  for (let i = 0; i < 180; i+=180/10) {
    let k = 6;
    let x = tan(angle+i)*r*cos(i*k); // fire the blobs at the screen
    let y = sin(angle+i)*r;
    circle(x,y,(i));
    //rect(x,y,i,i); // rect effect version
    
  }
  
  pop();
}


/* =================================================== */

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 15);
  }
}
