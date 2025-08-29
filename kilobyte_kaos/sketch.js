let wave;
// let baseScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; 
// C major: C4, D4, E4, F4, G4, A4, B4, C5

let baseScale = [
  196.0,   // G3 (dark base)
  207.65,  // weird low Ab
  233.08,  // Bb (dissonant against G)
  311.13,  // Eb
  329.63,  // E
  365.0,   // in-between, microtone
  440.0,   // A (but feels unstable here)
  467.0,   // microtone sharp
  493.88,  // B
  554.37,  // C# (sharp tension)
  622.25,  // Eb/F# clash
  730.0,   // odd overtone
  783.99,  // G5 echo of base
  865.0    // unstable high overtone
];


let scale = [];
let noteIndex = 0;
let lastChange = 0;
let interval = 0; // ms per note (30s total = adjust this)


let time = 0;
let w, W;
let slider;
let g;
let button;
let bpressed = false;

let circleButton;
let circleButtonPressed = false;

let dotButton;
let dotButtonPressed = false;

let triangleButton;
let triangleButtonPressed = false;

let starButton;
let starButtonPressed = false;


function setup() {
  w = 200;
  W = w * 2;
  createCanvas(W, W);
  noStroke();
  slider = createSlider(0, 255);
  slider.position(10, 10);
  slider.size(100);
  button = createButton('0');
  button.position(375, 8);
  button.mousePressed(buttonPressed);
  button.size(25,25);
  button.style('border-radius', '50%'); // rounded button
  
  dotButton = createButton('&#9645');
  dotButton.position(0, 380);
  dotButton.mousePressed(dotPressed);
  
  triangleButton = createButton('&#9651');
  triangleButton.position(40, 380);
  triangleButton.mousePressed(trianglePressed);
  
  circleButton = createButton('&#9675');
  circleButton.position(80, 380);
  circleButton.mousePressed(circlePressed);
  
  starButton = createButton('☆');
  starButton.position(120, 380);
  starButton.mousePressed(starPressed);
  
  // make an up-and-down scale
  scale = baseScale.concat(baseScale.slice(1, -1).reverse());
  
  wave = new p5.Oscillator();
  wave.setType('sawtooth');
  wave.start();
  wave.amp(0);
  wave.freq(scale[noteIndex]);
  lastChange = millis();
  
  background(0);
}

function draw() {
  
//   if(!dotButton && !triangleButton && !circleButton && !starButton){
//     wave.stop();
//   }
  
  interval = random(2,2000);
  let now = millis();
  if (now - lastChange >= interval) {
    noteIndex = floor(random(baseScale.length));
    //noteIndex = (noteIndex + 1) % scale.length; // loop through
    wave.freq(scale[noteIndex]);
    lastChange = now;
  }

  
  
  if(bpressed){
  background(0); // optional, remove if you want trails
  } 
  let g = slider.value()/10;
  if (bpressed){
    textSize(100);
    text('P', 200, 200);
  }
  push();
  
  for (let i = 1; i <= 8; i++) {
    for (let angle = 0; angle < TAU; angle += 0.31) {
      
      // radius grows over time but capped
      let R = min(i * 8, time / i / 90) * g;
      
      // angle offset with time
      let U = angle + time / w;
      
      // position
      let x = R * cos(U) + w;
      let y = R * sin(U) + w;
      
      // color based on x, y, R
      fill(
        w * sin(x),
        w * sin(y),
        R + U
      );
      
      // draw circle
      //text('S',x,y);
      
      if (circleButtonPressed){
      circle(x, y, 30);
      }
      if (dotButtonPressed){
      rect(x,y,1,1);
      }
      if (triangleButtonPressed){
        
        
      triangle(x,y, x+3, y+3, x+3, y);
      }
      
      if (starButtonPressed){
        
        star(x,y,5,10,5);
      
      }
    }
  }
  pop();
  time += tan(frameCount * 0.005);
  
}

function buttonPressed() {
  
  
  
  bpressed = !bpressed;
  
  button.html(Number(bpressed)); // convert true/false into 1/0
  // same as:
  // if (bpressed) {
  //   button.html('1');
  // } else {
  //   button.html('0');
  // }
}


function dotPressed() {
  
  wave.stop();
  wave.setType('square');
  wave.start();
  wave.amp(0.009);
  //wave.freq(440);
  
  dotButtonPressed = !dotButtonPressed;
  
  //dotButton.html(Number(dotButtonPressed)); // convert true/false into 1/0
  
  if (dotButtonPressed) {
    dotButton.html('&#9644');
  } else {
    wave.stop();
    dotButton.html('&#9645');
  }
  
}

function trianglePressed() {
  
  wave.stop();
  
  wave.setType('triangle');
  wave.start();
  wave.amp(0.009);
  //wave.freq(440);
  
  triangleButtonPressed = !triangleButtonPressed;
  
  if (triangleButtonPressed) {
    triangleButton.html('&#9650');
  } else {
    wave.stop();
    triangleButton.html('&#9651');
  }
  
}

function circlePressed() {
  
  wave.stop();
  
  wave.setType('sine');
  wave.start();
  wave.amp(0.009);
  //wave.freq(440);
  
  circleButtonPressed = !circleButtonPressed;
  
  if (circleButtonPressed) {
    circleButton.html('&#9679');
  } else {
    
    wave.stop();
    circleButton.html('	&#9675');
  }
}

function starPressed() {
  
  wave.stop();
  
  wave.setType('sawtooth');
  wave.start();
  wave.amp(0.009);
  //wave.freq(440);
  
  starButtonPressed = !starButtonPressed;
  
  
  
  if (starButtonPressed) {
    starButton.html('★');
  } else {
    wave.stop();
    starButton.html('☆');
  }
  
  
}



function keyPressed() {
  if (key === 's') { // Press 's' to save the canvas
    saveCanvas('myCanvas', 'png');
  }
}

function star(x, y, radius1, radius2, npoints) {
  let star_angle = TWO_PI / npoints;
  let halfAngle = star_angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += star_angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
