let windscreenSnowFlakes = [];
let accumulatedSnow = [];
let wiper;
let wiping = false;
let radioplaying = false;

// Rectangle properties
const rectX = 0;
const rectY = 0;
const rectWidth = 400;
const rectHeight = 200;

const accumulationThreshold = 30;

let horn;
let equalizer;
let carradiopic;
let steeringwheelpic;
let windscreenpic;
let question;
let nixon;
let wow;
let snowflakes = [];
let radio0 = "Off";
let radio1 = "102.6FM";
let radio2 = "1215MW";
let radio3 = "252LW";
let engine;
let currentStation = 0; // 0 for off, 1 for question, 2 for nixon, 3 for wow

function preload() {
  question = loadSound('question.mp3');
  nixon = loadSound('nixon.mp3');
  wow = loadSound('wow.mp3');
  windscreenpic = loadImage('windscreen.png');
  carradiopic = loadImage('carradio.jpeg');
  steeringwheelpic = loadImage('steeringwheel.png');
  horn = loadSound('horn.mp3');
  engine = loadSound('engine.wav');
}

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  frameRate(60);
  wiper = new Wiper(rectWidth / 2, rectY + rectHeight, 215);
  
  engine.loop();
  engine.setVolume(0.2);
  
  
  for (let i = 0; i < 150; i++) {
    snowflakes.push(new Snowflake());
  }
}

function draw() {
	
  background(0);

	
  
  let currentTime1 = frameCount / 30;

  stroke(255);
  fill(0);
  rect(320,20, 40 , 100 ); //traffic lights
  stroke('grey');
  fill('grey');
  rect(330,130, 20, 70);
  fill('red');
  noStroke();
  circle(340, 45, 20);

  
  
  for (let flake of snowflakes) {
    flake.update(currentTime1);
    flake.display();
  }

  strokeWeight(10);
  stroke(255);
  // noFill();
  // rect(0,0,400,200); // windscreen
  
  fill(0);
  noStroke();
  rect(0,210, 400, 190); // dashboard
  stroke(255);
  
  image(steeringwheelpic, 150,165, 290, 290);
  // circle(290,300,180); //steering wheel
  // line(200,300,380,300);
  // line(290,300, 290, 390);
  
  
  
  fill(50);
  //stroke(255);
  //rect(20, 220, 100, 50); //radio
  image(carradiopic, 20, 220, 100, 50);
  
  fill(0, 255, 0);
  noStroke();
  textSize(14);

  // Display the currently tuned station
  
  
  if (currentStation === 0) {
    // textAlign(LEFT);
    text(radio0, 60, 240);
  } 
  if (currentStation === 1) {
    text(radio1, 50, 240);
    
    equalisers();
    // rect(30, 232, 4, 8);
    // rect(35, 230, 4, 10);
    
  } 
  if (currentStation === 2) {
    text(radio2, 50, 240);
    equalisers();
    // rect(30, 230, 4, 10);
    // rect(35, 232, 4, 8);
  } 
  
  if (currentStation === 3) {
    text(radio3, 60, 240);
    equalisers();
    // rect(30, 230, 4, 10);
    // rect(35, 232, 4, 8);
  } 
  
  
  
  
  
  // windscreen snow

// Add a new snowflake every few frames
  if (frameCount % 1 === 0) {
    windscreenSnowFlakes.push(new WindscreenSnowFlake());
  }

  // Update and display falling windscreenSnowFlakes
  for (let i = windscreenSnowFlakes.length - 1; i >= 0; i--) {
    let Wflake = windscreenSnowFlakes[i];
    Wflake.update();
    Wflake.display();

    // Check if the snowflake has landed
    let hasLanded = false;
    // Check collision with the bottom of the rectangle
    if (Wflake.pos.y >= rectY + rectHeight - Wflake.r) {
      hasLanded = true;
    } else {
      // Check collision with already accumulated snow
      for (let j = 0; j < accumulatedSnow.length; j++) {
        if (dist(Wflake.pos.x, Wflake.pos.y, accumulatedSnow[j].pos.x, accumulatedSnow[j].pos.y) < (Wflake.r + accumulatedSnow[j].r)) {
          hasLanded = true;
          break;
        }
      }
    }

    // If it landed, move it from the 'falling' array to the 'accumulated' array
    if (hasLanded) {
      accumulatedSnow.push(windscreenSnowFlakes.splice(i, 1)[0]);
    }
  }

  // Display the accumulated snow
  for (let snow of accumulatedSnow) {
    snow.display();
  }

  // Only check for accumulation if the wiper is not already active
  if (!wiping && accumulatedSnow.length > 0) {
    // Find the highest point (minimum Y value) of the snow pile
    let highestSnowPoint = rectY + rectHeight; // Start assuming the highest point is the floor
    for (let snow of accumulatedSnow) {
      if (snow.pos.y < highestSnowPoint) {
        highestSnowPoint = snow.pos.y;
      }
    }

    // Calculate the total height of the snow pile from the bottom
    const snowPileHeight = (rectY + rectHeight) - highestSnowPoint;

    
  
    
    // If the pile is high enough, start the wiper
    if (snowPileHeight >= accumulationThreshold) {
      wiping = true;
      wiper.startWiping();
    }
    
    
    
    
    
  }

  // Update and display the wiper if it's active
  if (wiping) {
    wiper.update();
    wiper.display();

    // Check for collision between the wiper and accumulated snow
    for (let i = accumulatedSnow.length - 1; i >= 0; i--) {
      let snow = accumulatedSnow[i];
      let endX = wiper.pivot.x + wiper.len * cos(wiper.angle);
      let endY = wiper.pivot.y + wiper.len * sin(wiper.angle);

      // Check the distance from the snow to the wiper's line segment
      let d = distToSegment(snow.pos, wiper.pivot, createVector(endX, endY));
      if (d < 5) { // If close enough, remove the snowflake
        accumulatedSnow.splice(i, 1);
      }
    }

    // Check if the wiper has finished its cycle
    if (!wiper.isWiping()) {
      wiping = false; // Reset the wiping flag
      // Make any remaining unsupported snow slide down
      for (let Wflake of accumulatedSnow) {
        //Wflake.pos.y = min(Wflake.pos.y + 2, rectY + rectHeight - Wflake.r);
      }
    }
  }
  
  
  noFill();
  stroke(255);
  
  
  image(windscreenpic,0,0);
  rect(0,0,400,210, 20 ); // windscreen
  
}


// classes




// Snowflake class
class Snowflake {
  constructor() {
    this.posX = 0;
    this.posY = random(-height, 0);
    this.initialAngle = random(0, 360);
    this.size = random(2, 5);
    this.radius = sqrt(random(pow(width/2, 2)));
    this.color = color(random(250, 256), random(250, 256), random(250, 256));
  }

  update(time) {
    let angularSpeed = 35;
    let angle = this.initialAngle + angularSpeed * time;

    this.posX = width/2 + this.radius * sin(angle);

    let ySpeed = 8 / this.size;
    this.posY += ySpeed;

    if (this.posY > 200) {
      this.posY = -50;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.posX, this.posY, this.size);
  }
}

function mousePressed() {
  // console.log(mouseX, mouseY)
  if (
    mouseX > 280 && mouseX < 300 &&
    mouseY > 290 && mouseY < 320
     
     ){
    horn.play();
  }
  
  if (!wiping &&
      mouseX > 205 && mouseX < 220 &&
      mouseY > 290 && mouseY < 317
    
    ){
    wiping = true;
      wiper.startWiping();
    }
  
  // First, handle the station change button press
  // This should only work if the radio is already on.
  if (
    radioplaying &&
    mouseX > 85 && mouseX < 115 &&
    mouseY > 220 && mouseY < 270
  ) {
    // Stop all sounds before switching
    question.stop();
    nixon.stop();
    wow.stop();

    // Cycle to the next station
    if (currentStation === 1) {
      currentStation = 2;
      nixon.loop();
    } else if (currentStation === 2) {
      currentStation = 3;
      wow.loop();
    } else if (currentStation === 3) {
      currentStation = 1;
      question.loop();
    }
    return; // Exit the function after changing the station
  }

  // Second, handle the on/off button press
  if (
    mouseX > 22 && mouseX < 50 &&
    mouseY > 250 && mouseY < 270
  ) {
    // Toggle the radio's playing state
    radioplaying = !radioplaying;

    if (radioplaying) {
      // If the radio was just turned ON, start at station 1
      currentStation = 1;
      question.loop();
    } else {
      // If the radio was just turned OFF, stop all sounds
      currentStation = 0;
      question.stop();
      nixon.stop();
      wow.stop();
    }
  }
}


// --- CLASSES and HELPER FUNCTIONS ---

// WindscreenSnowFlake class
class WindscreenSnowFlake {
  constructor() {
    this.pos = createVector(random(rectX, rectX + rectWidth), random(0, 200)); // start of snow x, y pos
    this.vel = createVector(0, random(0.5, 1.5));
    this.r = random(1,3);
  }

  update() {
    this.pos.add(this.vel);
  }

  display() {
    fill(255,255,255,100);
    noStroke();
    rect(this.pos.x, this.pos.y, this.r, this.r, random(this.r), random(this.r), random(this.r),random(this.r));
  }
}


// --- Start of FIX ---
// Wiper class with corrected angles for an upward sweep
// --- Start of FIX ---
// Wiper class corrected to work with angleMode(DEGREES)
class Wiper {
  constructor(x, y, len) {
    this.pivot = createVector(x, y);
    this.len = len;
    // Set initial angle in degrees
    this.angle = -180;
    // Adjust speed for degrees (e.g., 3 degrees per frame)
    this.speed = 3;
    this.direction = 1;
    this.active = false;
  }

  startWiping() {
    this.active = true;
    // Start sweep from the far left (-180 degrees)
    this.angle = -180;
    // Move towards the right (towards 0 degrees), so direction is positive
    this.direction = 1;
  }

  isWiping() {
    return this.active;
  }

  update() {
    if (this.active) {
      this.angle += this.speed * this.direction;

      // When the wiper reaches the right side (0 degrees), reverse direction
      if (this.angle >= 0) {
        this.direction = -1;
      }

      // When the wiper returns to the left side (-180), the cycle is over
      if (this.angle <= -180) {
        this.angle = -180; // Clamp to the final position
        this.active = false; // Stop the wiper
      }
    }
  }

  display() {
    push();
    translate(this.pivot.x, this.pivot.y);
    stroke(200);
    strokeWeight(5);
    // Draw the line based on the current angle, which is now correctly in degrees
    line(0, 0, this.len * cos(this.angle), this.len * sin(this.angle));
    pop();
  }
}
// --- End of FIX ---
// --- End of FIX ---


// Helper function to calculate the distance from a point to a line segment
function distToSegment(p, v, w) {
  let l2 = pow(v.x - w.x, 2) + pow(v.y - w.y, 2);
  if (l2 === 0) return dist(p.x, p.y, v.x, v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = max(0, min(1, t));
  let projX = v.x + t * (w.x - v.x);
  let projY = v.y + t * (w.y - v.y);
  return dist(p.x, p.y, projX, projY);
}

function equalisers() {
  // Use integer division to determine which 30-frame interval we are in
  // Then use modulo 2 to flip between the two states
  if (floor(frameCount / 30) % 2 === 0) {
    // For the first 30 frames (0-29), then 60-89, etc.
    rect(30, 232, 4, 8);
    rect(35, 230, 4, 10);
  } else {
    // For the next 30 frames (30-59), then 90-119, etc.
    rect(30, 230, 4, 10);
    rect(35, 232, 4, 8);
  }
}
