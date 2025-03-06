
//OOP bouncy balls with classes by megamitts
// Happy Baby Song by Levitate/OpenGameArt

let balls=[]; // create an array to store balls
let numBalls=Math.floor(Math.random()*5); // randomise number of balls

let mySound;
function preload() {
  soundFormats('wav', 'mp3');
  boop = loadSound('slider.wav');
  slurp = loadSound('slurp.wav');
  boing = loadSound('boing.mp3');
  happy = loadSound('happy.mp3');
}

function setup() {
  cursor('cursor_hand.png'); // change cursor to a picture
  createCanvas(600, 400);
  happy.loop();
  
  if (numBalls === 0){
    numBalls = 1;
  }
  
  // Create multiple balls and add them to the array
  for (let i = 0; i < numBalls; i++) {
    // Random starting positions
    let x = random(20, width - 20);
    let y = random(20, height - 20);
    balls.push(new Ball(x, y)); // push the new ball into the array
  }
}
  
  


function draw() {
  background(0);
  textSize(20);
  stroke(255);
  strokeWeight(1);
  fill(255);
  text('Balls: ', 0, 20);
  text(numBalls, 60, 20);
  
  
   // Loop through all balls and update them
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].bounce();
    balls[i].display();
  }
   
  
}
  

class Ball {
  
  constructor(x,y){
  this.x = x;
  this.y = y;
  this.xspeed = 4;
  this.yspeed = -3;
  this.radius = 12;
  }


  bounce(){
  
    
  if (this.x > width-this.radius || this.x < this.radius) {
    this.xspeed = this.xspeed * -1;
    boing.play(); // boing sound effect
  }

  if (this.y > height-this.radius || this.y < this.radius) {
    this.yspeed = this.yspeed * -1;
    boing.play();
  }
  
  }

  display(){
    
   
    
  stroke(this.y, this.x, random(128));
  strokeWeight(this.x);
  fill(200, 0, 200);
  ellipse(this.x, this.y, this.radius*2, this.radius*2);
  
  }    
   
  move(){
  this.x = this.x + this.xspeed;
  this.y = this.y + this.yspeed;
  }
    
}
  

function mousePressed() { // add a ball each mouse press
  balls.push(new Ball(mouseX, mouseY));
  numBalls++;
  boop.play(); // boop sound effect
}

function keyPressed() {
  if (key === ' ') {  // Space key removes ball
    if (balls.length > 0) { // check to see if array is empty
      balls.pop();  // Remove the last ball
    }
  }
  numBalls--;
  if (numBalls < 0){
    
    numBalls = 0;    

  }
  slurp.play(); // slurp sound effect
}







