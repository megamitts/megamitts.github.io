let zoom = 0.1;
let angle = 0;
let font;
let music;
let michael;
let finished = false;
let alpha = 0;
let drips = [];

// --- Loading screen variables ---
let loadingProgress = 0;
const totalAssets = 3; // The total number of assets to load
let allAssetsLoaded = false;

// The callback function to be called when each asset is loaded
function assetLoaded() {
  // Increment the counter for loaded assets
  loadingProgress++;
}

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);

  // --- Start loading assets asynchronously ---
  // We moved these from preload() to setup()
  music = loadSound('thriller.mp3', assetLoaded);
  font = loadFont('font.otf', assetLoaded);
  michael = loadImage('michael.gif', assetLoaded);
}

function draw() {
  // Check if all assets have finished loading
  if (loadingProgress === totalAssets && !allAssetsLoaded) {
    allAssetsLoaded = true;
    // Start playing music once, right when the main sketch begins
    music.play();
  }
  
  // Based on the loading state, draw either the loading screen or the main sketch
  if (!allAssetsLoaded) {
    drawLoadingScreen();
  } else {
    drawMainSketch();
  }
}


function drawLoadingScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Loading...', width / 2, height / 2 - 40);

  // Calculate the number of pumpkins to show
  let pumpkinCount = floor(map(loadingProgress, 0, totalAssets, 0, totalAssets));
  
  // Draw the progress bar using pumpkin emojis
  let progressBar = '';
  for (let i = 0; i < totalAssets; i++) {
    if (i < pumpkinCount) {
      progressBar += '🎃'; // A loaded pumpkin
    } else {
      progressBar += ' '; // An empty square for unloaded assets
    }
  }
  textSize(50);
  text(progressBar, width / 2, height / 2 + 20);
}

function drawMainSketch() {
  if (!finished) {
    background(0);
    noStroke();

    let timer = millis() / 1000;

    // randomly create a new drip of blood
    if (random(1) < 0.05) {
      drips.push(new BloodDrip(random(20, 380), random(40, 50)));
    }

    // increase zoom until full size
    zoom = min(zoom + 0.01, 1);

    // spin faster in the middle of the zoom
    if (zoom > 0.3 && zoom < 0.8) {
      angle += 5; // spin speed
    } else {
      angle += 1; // slower rotation at start/end
    }

    push();
    drawingContext.filter = 'blur(2px)';
    translate(width / 2, height / 2);
    rotate(angle);
    scale(zoom);
    translate(-200, -200); // keep ghost centered

    fill(255);
    ellipse(200, 100, 150, 100);
    ellipse(170, 110, 100, 100);
    ellipse(230, 110, 100, 100);

    rect(120, 100, 35, 200, 50);
    rect(155, 140, 30, 160, 50);
    rect(185, 140, 30, 160, 50);
    rect(215, 140, 30, 160, 50);
    rect(245, 100, 35, 200, 50);

    rect(120, 150, 160, 130);

    fill(0);
    ellipse(180, 110, 40, 60);
    ellipse(230, 110, 40, 40);
    drawingContext.filter = 'none';
    pop();

    fill('#8a0303');
    textFont(font);
    textSize(60);
    textAlign(LEFT, BASELINE); // Reset text alignment
    text('Happy Halloween', 20, 50);

    // Update and display all drips
    for (let i = drips.length - 1; i >= 0; i--) {
      drips[i].update();
      drips[i].display();
      if (drips[i].isDead()) {
        drips.splice(i, 1);
      }
    }
    if (timer > 200) { //200
      image(michael, 350, 350, 50, 50);
    }
    if (timer > 250) { //250
      finished = true;
    }
  } else {
    fill(0, 0, 0, alpha);
    rect(0, 0, 400, 400);
    if (alpha >= 255) {
      music.stop();
      noLoop();
      fill(255, 0, 0);
      textSize(30);
      textAlign(LEFT, BASELINE); // Reset text alignment
      text('Code & Graphics: megamitts', 50, 100);
      text('Music: Trackjack/Browbeat', 50, 150);
    } else {
      alpha++;
    }
  }
}


class BloodDrip {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = random(5, 15);
    this.speed = random(0.5, 2);
    this.alpha = 255;
    this.dripColor = color(150 + random(50), 0, 0, this.alpha);
  }

  update() {
    this.y += this.speed;
    this.length += this.speed * 0.4;
    this.alpha -= 0.8; // fade slowly
    this.dripColor.setAlpha(this.alpha);
  }

  display() {
    fill(this.dripColor);
    ellipse(this.x, this.y, 4, 4); // drip head
    rect(this.x - 1, this.y - this.length, 2, this.length); // drip trail
  }

  isDead() {
    return this.y - this.length > height || this.alpha <= 0;
  }
}