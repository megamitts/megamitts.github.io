
//OOP bouncy balls with classes by megamitts
// Happy Baby Song by Levitate/OpenGameArt
// Baby face from Vecteazy


let timer = 0;
let babyPrize = false;
let clicks = 0;
let slurps = 0;
let balls=[]; // create an array to store balls
let numBalls=Math.floor(Math.random()*5); // randomise number of balls
let gameStart;
let mySound;
function preload() {
  soundFormats('wav', 'mp3');
  boop = loadSound('slider.wav');
  slurp = loadSound('slurp.wav');
  boing = loadSound('boing.mp3');
  happy = loadSound('happy.mp3');
  giggle = loadSound('giggle.mp3');
  img = loadImage('baby.png');
}

function setup() {
  
  
  cursor('cursor_hand.png'); // change cursor to a picture
  createCanvas(600, 600);
  
  
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
  let gameStart = false;
}
  
  


function draw() {
  
  if (!gameStart){
  instructions();
    
    
  
  }
  else {
    
  background(0);
  textSize(20);
  stroke(255);
  strokeWeight(1);
  fill(255);
  
  
  
  
   // Loop through all balls and update them
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].bounce();
    balls[i].display();
  }
   
  }  
  stroke(255);
  strokeWeight(10);
  fill(0);
  rect(0,400, 600, 200);
  
  //strokeWeight(1);
  //text(clicks, 20, 420);
  //text(slurps, 20, 440);
  
  if(clicks >= 50){
  rainbow();
  }
  
  if(slurps >= 60){
    makeCloud(300, 500);
  }
  
  if(slurps >= 70){
    makeCloud(250, 440);
  }
  
  if(slurps >= 80){
    makeCloud(380, 460);
  }
  
  if(clicks >= 100 && slurps >= 100){
    timer++;
    baby();
    
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
  noStroke();
  background(0);
  fill(255);
  text("Instructions", 150, 10);
  text("Click the mouse to create a ball", 0, 100);
  text("Press x to remove a ball", 0, 120);
  text("There's no real goal to the game but you get prizes for hitting some goals. Try to collect them all.", 0, 140);
  text("Press z to begin", 150, 180);
  
  
}





