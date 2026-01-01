let sandColor;
let shadowColor;
let highlightColor;
let rockColor;
let rockShadowColor;

// Configuration
const TINES = 7;
const SPACING = 8;
const RAKE_WIDTH = 4;
const TOP_LIMIT = 60; 

// State variables
let rocks = [];
let symbolAngle = 0; 
let buddhaX, buddhaY; // Variables for Buddha position

// --- AUDIO VARIABLES ---
let audioPlayer; 
let isPlaying = false;
let allStations = [];      
let stationIndex = 0;      
let currentStationName = ""; 
let isLoading = false;

function setup() {
  createCanvas(600,400);
  
  // Define Palette
  sandColor = color(240, 235, 220);
  shadowColor = color(200, 195, 180, 150); 
  highlightColor = color(255, 255, 255, 50);
  rockColor = color(100, 100, 110);
  rockShadowColor = color(190, 185, 170); 

  // Calculate Buddha position (Bottom Left)
  updateBuddhaPosition();

  resetGarden();
  
  console.log("Controls: Click/Drag to Rake. 'Space' to Reset. 'M' for Music. 'N' for Next Station.");
}

function updateBuddhaPosition() {
  buddhaX = 300;
  buddhaY = 200;
}

function draw() {
  // 1. Raking Logic
  if (mouseIsPressed) {
    rakeSand();
    
    // Redraw rocks so they stay on top
    for (let r of rocks) {
      drawRock(r.x, r.y, r.s);
    }
  }
  
  
  if (mouseIsPressed && mouseX >= 20 && mouseX <=70 && mouseY >=0 && mouseY <= 50 ){
    resetGarden();
  }
  
  
 
  
  
  // 2. Rotate and Draw Yin-Yang (Top Left)
  symbolAngle += 0.01; 
  drawYinYang(45, 30, 60, symbolAngle);

  // 3. Draw Buddha (Bottom Left)
  drawBuddha(buddhaX, buddhaY, 0.8);
  
  // 4. Draw Station Name (Top Bar)
  drawStationName();
  
  // Optional: Draw a subtle border line for the protected area
  // stroke(210, 205, 190);
  // strokeWeight(1);
  // line(0, TOP_LIMIT, width, TOP_LIMIT);
  
  drawMusicSymbol();
}

function drawStationName() {
  if ((isPlaying || isLoading) && currentStationName !== "") {
    noStroke();
    fill(sandColor);
    rect(90, 0, width - 90, TOP_LIMIT);
    
    fill(80);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(`Playing: ${currentStationName}`, width/2, TOP_LIMIT / 2);
  }
}

// --- VISUALS ---

function drawBuddha(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  
  // Style: Ink drawing look
  noFill();
  stroke(80);
  strokeWeight(2);
  
  // 1. Head
  ellipse(0, -30, 25, 30);
  
  // 2. Topknot (Usnisha)
  arc(0, -45, 10, 10, PI, TWO_PI);
  
  // 3. Shoulders/Body (Simple outline)
  beginShape();
  vertex(-12, -15); // Left neck
  bezierVertex(-30, -10, -35, 10, -25, 30); // Left shoulder/arm
  endShape();
  
  beginShape();
  vertex(12, -15); // Right neck
  bezierVertex(30, -10, 35, 10, 25, 30); // Right shoulder/arm
  endShape();

  // 4. Legs/Knees (Crossed position)
  beginShape();
  vertex(-25, 30);
  bezierVertex(-40, 40, 40, 40, 25, 30);
  endShape();
  
  // 5. Hands (Meditation mudra - simple oval)
  ellipse(0, 25, 15, 8);

  // Optional: A faint shadow/fill to make it stand out from sand lines
  fill(255, 255, 255, 50); // Very transparent white
  noStroke();
  ellipse(0, 5, 60, 70);

  pop();
}

function drawYinYang(x, y, d, rot) {
  push();
  translate(x, y);
  rotate(rot); 
  noStroke();

  fill(255);
  ellipse(0, 0, d, d);

  fill(40);
  arc(0, 0, d, d, -HALF_PI, HALF_PI);

  ellipse(0, d/4, d/2, d/2);

  fill(255);
  ellipse(0, -d/4, d/2, d/2);

  fill(40);
  ellipse(0, -d/4, d/6, d/6);

  fill(255);
  ellipse(0, d/4, d/6, d/6);
  
  noFill();
  stroke(200, 195, 180);
  strokeWeight(1);
  ellipse(0, 0, d, d);

  pop();
}

function resetGarden() {
  background(sandColor);
  
  // Draw Background Grain
  loadPixels();
  for (let i = 0; i < width * height * 0.05; i++) {
    let x = random(width);
    let y = random(height);
    stroke(210, 205, 190, 100); 
    point(x, y);
  }
  updatePixels();

  rocks = [];
  let numRocks = floor(random(3, 7));
  let attempts = 0;
  
  while (rocks.length < numRocks && attempts < 1000) {
    attempts++;
    let s = random(30, 80);
    let x = random(s, width - s);
    let y = random(s, height - s);
    let overlapping = false;

    // 1. Prevent rocks in the TOP BAR area
    if (y < TOP_LIMIT + s/2 + 10) overlapping = true;

    // 2. Prevent rocks on Yin Yang (Top Left)
    if (dist(x, y, 45, 45) < (30 + s/2 + 20)) overlapping = true;

    // 3. Prevent rocks on Buddha (Bottom Left)
    // Buddha radius approx 35, plus rock radius, plus buffer
    if (dist(x, y, buddhaX, buddhaY) < (35 + s/2 + 20)) overlapping = true;

    // 4. Prevent overlapping other rocks
    if (!overlapping) {
      for (let other of rocks) {
        if (dist(x, y, other.x, other.y) < (s/2 + other.s/2 + 20)) {
          overlapping = true;
          break;
        }
      }
    }

    if (!overlapping) {
      let r = { x: x, y: y, s: s };
      rocks.push(r);
      drawRock(r.x, r.y, r.s);
    }
  }
}

function drawRock(x, y, s) {
  noStroke();
  fill(rockShadowColor);
  ellipse(x + 5, y + 5, s + 5, s * 0.8 + 5);
  fill(rockColor);
  ellipse(x, y, s, s * 0.85);
  fill(140, 140, 150);
  ellipse(x - s/5, y - s/5, s/3, s/4);
}

function rakeSand() {
  if (mouseY < TOP_LIMIT) return;

  let distMoved = dist(mouseX, mouseY, pmouseX, pmouseY);
  
  if (distMoved > 2) {
    let v = createVector(mouseX - pmouseX, mouseY - pmouseY);
    v.normalize();
    let perp = createVector(-v.y, v.x);
    
    strokeWeight(RAKE_WIDTH);
    noFill();
    
    let startOffset = -(TINES - 1) * SPACING / 2;
    
    for (let i = 0; i < TINES; i++) {
      let offsetAmount = startOffset + (i * SPACING);
      let offsetX = perp.x * offsetAmount;
      let offsetY = perp.y * offsetAmount;
      
      let px = pmouseX + offsetX;
      let py = pmouseY + offsetY;
      let cx = mouseX + offsetX;
      let cy = mouseY + offsetY;

      // Check Collision with ROCKS
      let blocked = false;
      for(let r of rocks){
        if(dist(cx, cy, r.x, r.y) < r.s/2) {
          blocked = true;
          break;
        }
      }
      
      // Check Collision with BUDDHA
      // Using approx radius of 40px for the Buddha drawing area
      if(!blocked) {
        if(dist(cx, cy, buddhaX, buddhaY) < 40) {
          blocked = true;
        }
      }

      if(!blocked) {
        stroke(shadowColor);
        line(px, py, cx, cy);
        stroke(highlightColor);
        line(px - 1, py - 1, cx - 1, cy - 1);
      }
    }
  }
}

// --- ZEN MUSIC STREAMING LOGIC ---

async function toggleMusic() {
  if (allStations.length === 0) {
    await fetchStations();
    return;
  }
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    currentStationName = ""; 
  } else {
    if (audioPlayer) {
      audioPlayer.play();
      isPlaying = true;
      currentStationName = allStations[stationIndex].name.trim();
    } else {
      playStation(stationIndex);
    }
  }
}

async function fetchStations() {
  isLoading = true;
  currentStationName = "Loading Stations..."; 
  
  let url = "https://all.api.radio-browser.info/json/stations/search?limit=40&tagList=ambient,meditation&hidebroken=true&order=clickcount&is_https=true";
  
  try {
    let response = await fetch(url);
    allStations = await response.json();
    
    if (allStations.length > 0) {
      shuffle(allStations, true);
      stationIndex = 0;
      playStation(stationIndex);
    } else {
      currentStationName = "No stations found";
    }
  } catch (e) {
    console.error("Error fetching radio:", e);
    currentStationName = "Connection Error";
    
  } finally {
    isLoading = false;
  }
}

function playStation(index) {
  if (audioPlayer) {
    audioPlayer.stop();
    audioPlayer.remove(); 
  }

  let station = allStations[index];
  currentStationName = station.name.trim(); 
  console.log(`Playing: ${currentStationName}`);

  audioPlayer = createAudio(station.url_resolved);
  audioPlayer.elt.volume = 0.5; 
  
  audioPlayer.elt.onerror = () => {
    console.log("Stream failed, skipping...");
    nextStation();
  };

  audioPlayer.loop();
  audioPlayer.play();
  isPlaying = true;
}

function nextStation() {
  if (allStations.length === 0) return;
  currentStationName = "Tuning..."; 
  stationIndex = (stationIndex + 1) % allStations.length;
  playStation(stationIndex);
}

function keyPressed() {
  if (key === ' ') {
    resetGarden();
  }
  if (key === 'm' || key === 'M') {
    toggleMusic();
  }
  if (key === 'n' || key === 'N') {
    nextStation();
  }
}

function drawMusicSymbol(){
  
  stroke(0);
  textSize(50);
  text('♫', 500,30);
  text('→', 540, 25);
}

function mousePressed(){
  
   if (mouseX >= 500 && mouseX <=525 && mouseY >=0 && mouseY <= 40 ){
    toggleMusic();
  }
  
  if (mouseX >= 530 && mouseX <=560 && mouseY >=0 && mouseY <= 40 ){
    nextStation();
  }
  
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   updateBuddhaPosition();
//   resetGarden();
// }