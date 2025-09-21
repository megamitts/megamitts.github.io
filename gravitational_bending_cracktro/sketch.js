let f = 0;
let n = 1;
let direction = 50;
let done = false;
let textcol = 0;
let music;

let fading = false;
let fadeAlpha = 0;
let showText = true;

let closingRect = false;
let closeF = 0;

function preload(){
  
  music = loadSound('jamiroquais_ a_cunt.mp3');
}

function setup() {
  createCanvas(400, 400);
  frameRate(20);
  textFont('monospace');
  music.loop();
}

function draw() {
  f++;
  
  let animDuration = 200; 

  let y, h;

  // --- Animation State Machine ---
  // The order here is important. We check the final state (fading) first.
  if (fading) {
    // STATE 4: Fading to black. Explicitly keep the rect closed.
    h = 0;
  } else if (closingRect) {
    // STATE 3: The rectangle is closing
    closeF++;
    let t_close = constrain(closeF * 8 / animDuration, 0, 1);
    
    y = lerp(100, 200, t_close);
    h = lerp(200, 0, t_close);

    if (t_close >= 1) {
      closingRect = false;
      fading = true;
      h = 0; // Ensure h is 0 on the frame we switch states
    }
  } else if (!done) {
    // STATE 1: The rectangle is opening
    let t = constrain(f * 8 / animDuration, 0, 1);
    y = lerp(200, 100, t);
    h = lerp(0, 200, t);
    if (t >= 1) {
      done = true;
    }
  } else {
    // STATE 2: The rectangle is fully open and waiting
    y = 100;
    h = 200;
  }

  // --- Drawing ---
  
  n += direction;
  if (n >= 4000 || n <= 1) {
    direction *= -1;
  }
  
  background(55, 66, 91);

  let step = 20;
  for (let x = 0; x <= width; x += step) {
    for (let y_pos = 0; y_pos <= height; y_pos += step) {
      let R = 15;
      for (let k of [0, PI]) {
        let X = (x - width/2 ) + 200 * sin(f / 50 + k);
        let Y = (y_pos - height/2) + 200 * sin(f / 67 + k);
        let s = sin(f / 50 + k);
        let c = cos(f / 50 + k);
        R = min(R, max(0, abs(s * X - c * Y) / 3), (X * X + Y * Y) / n + 3);
      }
      let r = noise(x * 0.05, y_pos * 0.05, f * 0.1) * 255;
      let g = noise(x * 0.05 + 100, y_pos * 0.05, f * 0.1) * 255;
      let b = noise(x * 0.05, y_pos * 0.05 + 100, f * 0.1) * 255;
      fill(r, g, b);
      ellipse(x - R, y_pos - R, R * 2, R * 2);
    }
  }
  
  if (h > 0) {
    strokeWeight(5);
    stroke('red');
    fill(0, 200);
    rect(0, y, 400, h);
    strokeWeight(1);
  }
  
  if (done && showText) {
    stroke(textcol);
    fill(textcol);
    textcol += 10;
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Cracktro by Mitts', 200, 150);
    if (textcol > 255) {
      textAlign(LEFT);
      textSize(15);
      text('Lorem ipsum dolor sit amet consectetur adi', 10, 180);
      text('Lorem ipsum dolor sit amet consectetur adi', 10, 200);
      text('Lorem ipsum dolor sit amet consectetur adi', 10, 220);
      text('Lorem ipsum dolor sit amet consectetur adi', 10, 240);
      text('Lorem ipsum dolor sit amet consectetur adi', 10, 260);
    }
  }
  
  if (fading) {
    fadeAlpha += 10;
    fill(0, fadeAlpha);
    noStroke();
    rect(0, 0, width, height);
    if (fadeAlpha >= 255) {
      noLoop();
    }
  }
}

function mousePressed() {
  if (done && !closingRect && !fading) {
    showText = false;
    closingRect = true;
    fadeOut(music, 3); // Fade out over 2 seconds
  } 
  
  
}



function fadeOut(soundFile, duration) {
  let startVolume = soundFile.getVolume();
  let startTime = millis();

  function fade() {
    let elapsed = millis() - startTime;
    let progress = elapsed / (duration * 1000);
    let newVolume = lerp(startVolume, 0, progress);

    soundFile.setVolume(newVolume);

    if (progress < 1) {
      requestAnimationFrame(fade);
    } else {
      soundFile.stop(); // Stop the sound after fading out
    }
  }

  fade();
}