
// Avec Baby Face by megamitts
// Happy Baby Song by Levitate/OpenGameArt
// graphics by megamitts and Vecteezy.com


let timer = 0;
let babyPrize = false;
let clicks = 0;
let slurps = 0;
let balls=[]; // create an array to store balls
let numBalls=Math.floor(Math.random()*5); // randomise number of balls
let gameStart = false;
let mySound;
function preload() {
  soundFormats('wav', 'mp3');
  boop = loadSound('slider.wav');
  slurp = loadSound('slurp.wav');
  boing = loadSound('boing.mp3');
  happy = loadSound('happy.mp3');
  giggle = loadSound('giggle.mp3');
  img = loadImage('baby.png');
  front_screen = loadImage('front_screen.png');
  credit = loadImage('credit.png');
}

function setup() {
  
  
  cursor('cursor_hand.png'); // change cursor to a picture
  let canvas= createCanvas(600, 600);
  canvas.parent('game-container');  // we can now move the canvas to the centre of the screen with HTML.
  
  if (numBalls === 0){
    numBalls = 1;
  }
  
  // Create multiple balls and add them to the array
  for (let i = 0; i < numBalls; i++) {
    // Random starting positions
    let x = random(120, width - 120);
    let y = random(120, 280);
    balls.push(new Ball(x, y)); // push the new ball into the array
  }
  
}
  
  


function draw() {
  if (!gameStart) {
    // Clear the entire canvas first
    background(255);
    // Draw the front screen image
    image(front_screen, 0, 0);
    
    // For the bottom section, first draw the rectangle border without a fill
    stroke(255);
    strokeWeight(10);
    noFill(); // Very important - don't fill the rectangle
    rect(0, 400, 600, 200);
    
    // Then draw the credit image on top
    image(credit, 10, 410);
  } 
  else {
    // Game is running - set black background
    background(0);
    
    // Draw the main game area rectangle with no fill (letting black background show)
    stroke(255);
    strokeWeight(10);
    noFill(); // Keep the main rectangle unfilled to show black background
    rect(0, 0, 600, 400);
    
    // Loop through all balls and update them
    for (let i = 0; i < balls.length; i++) {
      balls[i].move();
      balls[i].bounce();
      balls[i].display();
    }
    
    // Draw the blue rectangle at the bottom
    stroke(255);
    strokeWeight(10);
    fill(135, 206, 235);
    rect(0, 400, 600, 200);
    
    // Rest of the conditional game effects
    if (clicks >= 50) {
      rainbow();
    }
    
    if (slurps >= 60) {
      makeCloud(300, 500);
      fill(0);
    }
    
    if (slurps >= 70) {
      makeCloud(250, 440);
      fill(0);
    }
    
    if (slurps >= 80) {
      makeCloud(380, 460);
      fill(0);
    }
    
    if (clicks >= 100 && slurps >= 100) {
      timer++;
      baby();
    }
  }
}


function mousePressed() { // add a ball each mouse press
  if (gameStart){
  if (mouseX > 100 && mouseX < width-100 && mouseY > 100 && mouseY < 300){
  balls.push(new Ball(mouseX, mouseY));
  numBalls++;
  clicks++;
  boop.play(); // boop sound effect
    
  }
  }
  }
  

function keyPressed() {
  if (key === 'x') {  // x key removes ball
    if (balls.length > 0) { // check to see if array is empty
      balls.pop();  // Remove the last ball
      slurp.play(); // slurp sound effect
    }
  numBalls--;
  slurps++;
  }
  
  
  if (numBalls < 0){
    
    numBalls = 0;    

  }
  
  if (key === 'z' && !gameStart){
    gameStart = true;
    happy.loop();
  }
  
}

function instructions(){
  // replace with image 600x400
  
  image(credit, 0, 0);
  //image(credit, 10, 410);
  
  

  
}
