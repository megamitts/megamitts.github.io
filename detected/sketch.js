let a = 3; // Frequency for x
let b = 2; // Frequency for y
let delta = Math.PI / 2; // Phase difference
let goingUp = true;
let n = 0.01;
let detected;
let mouse_pressed = false;
let detected_played = false;
let caught = false;
let x1 = 0;
let y1 = 0;

function preload() {
  detected = loadSound('detected.mp3');
  //astronaut = loadImage('astro_cursor.gif');
}

function setup() {
  createCanvas(400, 400, WEBGL);
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  cursor('spaceman.png');
  
  //detected.loop(); // play "Enemy detected" sound.
}

function draw() {
  background(30);
  
  noStroke();
  fill(0,0,0,0);
  
  rect(-200, -200, 100, 100); //safe zone 1
  rect(100,100, 100, 100); // safe zone 4
  
  noFill();
  
  stroke(255, 0, 0);
  //console.log('MouseX', mouseX, ' MouseY', mouseY);
  if (mouseX >= 300 && mouseX <= 400 && mouseY >= 300 && mouseY <= 400){
       detected.stop();
    stroke(255, 100, 150);
     }
  
  
  if (caught){
  beginShape();
  for (let t = 0; t < TWO_PI; t += n) {
    
    let x = 150 * sin(a * t + delta); // Parametric x
    let y = 150 * sin(b * t * delta);        // Parametric y
    
    vertex(x, y);
    
  }
  endShape(CLOSE);

  // Animate the phase difference
  delta += 0.01;
  updateN();
  }
  else {
    let maxDistance = 200;
    let t = millis() * 0.001;
    let offset = sin(t) * maxDistance;
    point(offset, 0);
  }
}

function mousePressed(){
  caught = true;
  if (!detected_played) {
  mouse_pressed = true;
    //console.log('mouse pressed', mouse_pressed);
    stroke('red');
    
      detected.loop();
     detected_played = true; // will not play now if mouse is pressed.
  }
     
}

function mouseMoved(){
 if(mouse_pressed){ 
   
   if (!detected.isPlaying()) {
      detected.loop(); // Only start playing once if not already playing
    }
   
  if (mouseX >= 300 && mouseX <= 400 && mouseY >= 300 && mouseY <= 400){
       detected.stop();
    caught = false;
    //console.log('caught mouse moved', caught);
    //mouse_pressed = false;
    stroke(255, 100, 150);
     }
    else if (mouseX >= 200 || mouseX <= 299){
      stroke('red');
     caught = true;
     console.log(mouseX);
     }
    //console.log('caught mouse moved', caught);
    
    if (mouseX >= 0 && mouseX <= 100 && mouseY >= 0 && mouseY <= 100){
       detected.stop();
    caught = false;
    //console.log('caught mouse moved', caught);
    //mouse_pressed = false;
    stroke(255, 100, 150);
     }
     
     /*
    else if (mouseX >= 101 || mouseX <= 399){
      stroke('red');
     caught = true;
     console.log(mouseX);
    */
  

}
}

function updateN() {
  if (goingUp) {
    
    
    n += 0.01;
    if (n >= 6.28) {
      
      goingUp = false;
    }
  } 
  else {
    
    n -= 0.01;
    if (n <= 0.0111) {
      
      goingUp = true;
    }
  }
}

