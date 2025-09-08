var dotStep = 6;
var dotRate = 4;
let released = false;
let done = false;
let fadeAlpha = 0;
let fadeDelay = 120; // frames to wait before starting fade (~0.5 sec at 60fps)
let boxW;
let font;
let angle = 0;
let message = "Merry Christmas Paul! How do you like my Crack-Tro? I think it is rather \nsmashing! It uses a version of my text writer that I wrote for the fake intro to WOO and (almost) the same font too! \n \nAlso do you happen to recognise the rather festive music? Some fellow from Goldenhill wrote it years ago! \n\n\n\nWell I am off to eat a muffin! Have a great day! \n \n \n  Twat yer mouse as we used to say!";
let messageBuffer = "";
let messageCount = 0;
let typingSpeed = 1;
let wrappedLines = [];
let music;


var lines = [];
var bannerHeight = 0;
let angleY = 0;
let angleZ = 0;

class Line {
  constructor(y) {
    this.y = y;
  }
  
  draw() {
    let step = frameCount * dotRate;
    
    for (let x = 0; x < width; x += dotStep) {
      let strength = 100;
      let topHue = (x/1.5 + step) % 360;
      let bottomHue = abs(x/1.5 - step) % 360;
      
      fill(topHue, 100, strength);
      rect(x, this.y, dotStep, dotStep);
      
      fill(bottomHue, 100, strength, 0.7);
      rect(x, this.y + dotStep * 0.4, dotStep);
    }
  }
}


function preload(){
  
  font = loadFont('razor.ttf');
  music = loadSound('pianochrmod.mp3');
}

function setup() {
  createCanvas(400, 400, WEBGL);
  strokeWeight(0);
  colorMode(HSB);
  
  bannerHeight = height / 6;
  lines.push(new Line(bannerHeight));
  lines.push(new Line(height - bannerHeight));
  boxW = width / 2.95;
  music.loop();
}

function draw() {
  // clear background first
  background(0); 

  if (done) {

    // draw lines and cube normally during pause
    if (fadeDelay > 0) {
      fadeDelay--;
    } else {
      // draw a black rectangle over everything with increasing alpha
      push();
      resetMatrix();      // cancel all WEBGL transforms
      ortho();            // flat 2D projection
      noLights();
      translate(-width/2, -height/2);
      fill(0, 0, 0, fadeAlpha);  // HSB: hue=0,sat=0, brightness=0, alpha
      rect(0, 0, width, height);
      pop();

      fadeAlpha += 1;  // adjust fade speed
      if (fadeAlpha >= 255) {
        fadeAlpha = 255;
        
        noLoop();
        
      }
    }

    // draw the lines underneath during pause/fade
    push();
    translate(-width/2, -height/2);
    for (const l of lines) {
      l.draw();
    }
    pop();

    return; // skip spinning cube after done
  }

  // cube rotation when not done
  push();
  lights();
  fill(260, 100, 100);
  rotateY(angleY);
  rotateZ(angleZ);
  box(boxW);
  pop();

 if (!released) {
    push();
    drawingContext.disable(drawingContext.DEPTH_TEST); // keep on top
    fill(0, 0, 100);
    textFont(font);
    textSize(10);
    
//      if (frameCount % typingSpeed === 0 && messageCount < message.length) {
//     messageBuffer += message[messageCount];
//     messageCount++;
//   }


//   text(messageBuffer, -200, -80, 400, height);

    
    
   
   if (frameCount % typingSpeed === 0 && messageCount < message.length) {
    messageBuffer += message[messageCount];
    messageCount++;
    wrappedLines = wrapText(messageBuffer, 400); // re-wrap after each new letter
  }

  // draw wrapped lines
  for (let i = 0; i < wrappedLines.length; i++) {
    text(wrappedLines[i], -200, -80 + i * 10);
  }
    drawingContext.enable(drawingContext.DEPTH_TEST);
    pop();
  }


  
  if (released) {
    //background(0);
    boxW -= 4; // shrink the box in time with the movement of the bars
    if (boxW <= 40){
      background(0); // remove the box before the lines close.
    }
    bannerHeight += 4;
    lines[0].y = bannerHeight;
    lines[1].y = height - bannerHeight;
    if (bannerHeight >= height / 2) {
      done = true;
    }
  } else {
    angleY += 0.031;
    angleZ += 0.022;
  }

  // draw banner bars
  push();
  translate(-width/2, -height/2);
  for (const l of lines) {
    l.draw();
  }
  pop();
}

function mouseReleased() {
  music.stop();
  released = true;
}


// helper to wrap text at spaces and respect \n
function wrapText(str, maxWidth) {
  let words = str.split(/(\s+)/); // keep spaces too
  let lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // handle explicit line break
    if (word.includes("\n")) {
      let parts = word.split("\n");
      for (let j = 0; j < parts.length; j++) {
        if (parts[j].length > 0) {
          let testLine = currentLine + parts[j];
          if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = parts[j];
          } else {
            currentLine += parts[j];
          }
        }
        if (j < parts.length - 1) { // force break
          lines.push(currentLine);
          currentLine = "";
        }
      }
    } else {
      let testLine = currentLine + word;
      if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
        lines.push(currentLine.trimEnd());
        currentLine = word.trimStart();
      } else {
        currentLine = testLine;
      }
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}