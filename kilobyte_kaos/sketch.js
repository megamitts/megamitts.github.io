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
  
  dotButton = createButton('•');
  dotButton.position(0, 380);
  dotButton.mousePressed(dotPressed);
  
  triangleButton = createButton('&#9651');
  triangleButton.position(40, 380);
  triangleButton.mousePressed(trianglePressed);
  
  circleButton = createButton('&#9675');
  circleButton.position(80, 380);
  circleButton.mousePressed(circlePressed);
  
  
  background(0);
}

function draw() {
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
  
  dotButtonPressed = !dotButtonPressed;
  
  dotButton.html(Number(dotButtonPressed)); // convert true/false into 1/0
  
}

function trianglePressed() {
  
  triangleButtonPressed = !triangleButtonPressed;
  
  triangleButton.html(Number(triangleButtonPressed)); // convert true/false into 1/0
  
}

function circlePressed() {
  
  circleButtonPressed = !circleButtonPressed;
  
  circleButton.html(Number(circleButtonPressed)); // convert true/false into 1/0
  
}

function keyPressed() {
  if (key === 's') { // Press 's' to save the canvas
    saveCanvas('myCanvas', 'png');
  }
}