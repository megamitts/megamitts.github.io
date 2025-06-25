  

let angle;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(0);
  angleMode(DEGREES); 
}


let radius = 0;
let speed = 2;
let radiusIncrement = 0.5;

  

function draw() {
  orbitControl();
  
  
  angle = random(360);

  cosine();
  
  //curves();
    
  tangent();
  
  
  
}

function keyPressed(){
	background(0);
	
	
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
}

function curves(){

let x1 = random(width);
  let y1 = random(height);
  let cx1 = random(width);
  let cy1 = random(height);
  let x2 = random(width);
  let y2 = random(height);
  let cx2 = random(width);
  let cy2 = random(height);

  stroke(0);
  noFill();
  curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2);
}



function tangent(){
  
  for (let i = 0; i < 360; i++) {
    let x = radius * cos(angle);
    let y = radius * tan(angle);

    stroke(mouseX + random(99), mouseY, random(149), random(65));
    line(0, 0, x, y); // Draw a line from the center to the point on the spiral
	
    angle += speed;
    radius += radiusIncrement;

    if (radius > width / 2) {
      // Reset the spiral if it reaches the edge
      radius = 0;
      angle = random(360);
      
    }
    
    
  }
}
  

function cosine(){

for (let i = 0; i < 360; i++) {
    let x = radius * cos(angle);
    let y = radius * sin(angle);

    stroke(mouseX, mouseY + random(176), random(227), 60);
    line(0, 0, y, x, -x, 50); // Draw a line from the center to the point on the spiral
	
    angle += speed;
    radius += radiusIncrement;

    if (radius > width / 2) {
      // Reset the spiral if it reaches the edge
      radius = 0;
      angle = random(360);
      
    }
  }
}
  
