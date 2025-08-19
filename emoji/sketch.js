/* 

Entry for 2025 20 Second Jam.



Code: megamitts
Music: Trackjack/Browbeat
Pew: Slimmer5/myinstants.com

Over the next 20 seconds the screen will fill with emojis. Your task is to remove them by clicking on them, keeping the count below 20. If more than 20 emojis manage to get on the screen then it's game over.

Good luck. You'll need it 😈


*/

let particles = [];
let circles = [];

let emojis = [
  { char: '🧐', score: 1, type: 'normal' },
  { char: '🥸', score: 1, type: 'normal' },
  { char: '🤬', score: 2, type: 'normal' },
  { char: '🫠', score: 2, type: 'normal' },
  { char: '😵‍💫', score: 3, type: 'normal' },
  { char: '🤮', score: 3, type: 'normal' },
  { char: '🤑', score: 4, type: 'normal' },
  { char: '🥳', score: 0, type: 'joker' } // Joker score will be randomized upon creation
];
let score = 0;

// --- NEW Game State Variables ---
let isLoading = true; // Start in loading state
let startScreen = false; // Don't show start screen until loading is done
let gameStarted = false;
let gameIsOver = false;

let highScore = 0;
let speedMultiplier = 1;
let scoreMultiplier = 1;
let music;
let youSuck;
let pew;

let oldcx;
let oldcy;

// --- NEW Loading Screen Variables ---
let assetsLoaded = 0;
const totalAssets = 3; // The total number of assets we need to load

// New variable to track when the game ended
let gameOverTime;

// The preload function has been removed. Assets are now loaded in setup().

// --- NEW Callback function ---
// This function is called each time an asset is successfully loaded
function assetLoaded() {
  assetsLoaded++;
  // Once all assets are loaded, move to the start screen
  if (assetsLoaded === totalAssets) {
    isLoading = false;
    startScreen = true;
  }
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER); // Center the text for easier positioning
  pixelDensity(1); // should help with HDR screens.
  
  // Load assets with a callback function to track progress
  music = loadSound('careless_whisper.mp3', assetLoaded);
  pew = loadSound('pew.mp3', assetLoaded);
  youSuck = loadImage('you_suck.gif', assetLoaded);
}

function draw() {
  background(0); // Set background once at the top

  // --- NEW ---
  // Display the appropriate screen based on the game state
  if (isLoading) {
    displayLoadingScreen();
  } else if (gameStarted) {
    // --- GAME IS RUNNING ---

     if (score >= 10 && score <= 19) {
      speedMultiplier = 1.2; // Increase speed by 20%
       textSize(20);
       text('Quick! Get them emojis!', 200, 380);
    }

    if (score >= 20 && score <= 29) {
      speedMultiplier = 1.3; // Increase speed by 30%
      textSize(20);
      text('Emojis coming in hot and fast!', 200, 380);
    }

    if (score >= 30 && score <= 39) {
      speedMultiplier = 1.4; // Increase speed by 40%
      textSize(20);
       text('Merde! Merde! Merde!', 200, 380);
    }

    if (score >= 40 && score <= 49) {
      speedMultiplier = 1.5; // Increase speed by 50%
      textSize(20);
       text('You missed one there, bud!', 200, 380);
    }
    
    if (score >= 50 && score <= 59) {
      speedMultiplier = 1.6; // Increase speed by 60%
      textSize(20);
       text('My arthritic gran could do better!', 200, 380);
    }

    
    if (score >= 60 && score <= 69) {
      speedMultiplier = 1.7; // Increase speed by 70%
      textSize(20);
       text('Do you think you need to lie down old timer?', 200, 380);
    }

    if (score >= 70 && score <= 79) {
      speedMultiplier = 1.8; // Increase speed by 80%
      textSize(20);
       text('I like you. Not a lot. But I like you.', 200, 380);
    }
    
    if (score >= 80 && score <= 89) {
      speedMultiplier = 1.9; // Increase speed by 90%
      textSize(20);
       text('Doing well there, champ!', 200, 380);
    }
    
    if (score >= 90 && score <= 99) {
      speedMultiplier = 2; // Increase speed by 100%
      textSize(20);
       text('I like cheese. Do you like cheese?', 200, 380);
    }
    
    if (score >= 100 && score <= 149) {
      speedMultiplier = 2.5; // Increase speed by 250%
      textSize(20);
       text('My lawnmower is broken.', 200, 380);
    }
    
    if (score >= 150 && score <= 199) {
      speedMultiplier = 2.75; // Increase speed by 275%
      textSize(20);
       text('You should get that wart removed!', 200, 380);
    }
    
    if (score >= 200 && score <= 999) {
      speedMultiplier = 3; // Increase speed by 300%
      textSize(20);
       text('LUDICROUS SPEED!!!!', 200, 380);
    } // who the hell gets to this speed?
    
    if (circles.length > 20) {
      gameOver();
    } else {
      sendInTheEmoji();
      hud();
    }

    // Update and draw particles in every frame
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.draw();
      if (p.isDead()) {
        particles.splice(i, 1); // remove the current particle 
      }
    }

  } else if (gameIsOver) {
    // --- GAME OVER SCREEN IS SHOWING ---
    displayGameOver();
  } else if (startScreen) {
    // --- START SCREEN IS SHOWING ---
    displayStartScreen();
  }
}

function mousePressed() {
  // If the game is running, check for clicks on emojis
  if (gameStarted) {
    // Loop backwards so removing items doesn’t mess up the loop
    for (let i = circles.length - 1; i >= 0; i--) {
      let c = circles[i];
      let d = dist(mouseX, mouseY, c.x, c.y);

      if (d < c.r / 2) { // inside circle
        score += c.score; // Add the score of the specific emoji clicked
        pew.play();
        let oldcx = c.x;
        let oldcy = c.y;
        
        let cc = [random(100,255), random(100,255), random(100,255)]; // random bright color
        let num = random(10, 40); //number of particles
        particles = particles.concat(createExplosion(oldcx, oldcy, num, cc));
        
        circles.splice(i, 1); // remove circle at index i
        
        break; // only remove one circle at a time
      }
    }
  }
  // If the game is over, wait for a delay before restarting
  else if (gameIsOver) {
    if (millis() - gameOverTime > 2000) {
      resetGame();
    }
  }
  // If on the start screen, start the game
  else if (startScreen) {
    startScreen = false;
    gameStarted = true;
    // Start the music loop only when the user starts the game
    music.loop(0, 1, 0.5);
  }
}


// --- Circle Class ---
class Circ {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 50;

    // give each circle its own random direction
    this.dx = random([-1, 1]);
    this.dy = random([-1, 1]);

    // Give each circle its own emoji and score when it's born
    let emojiData = random(emojis);
    this.emoji = emojiData.char;

    if (emojiData.type === 'joker') {
      this.score = int(random(-5, 6)); // Assign a random score for the joker
    } else {
      this.score = emojiData.score;
    }
  }

  update() {
    // move by velocity
    this.x += this.dx * speedMultiplier;
    this.y += this.dy * speedMultiplier;

    // every so often, change direction randomly
    if (frameCount % 60 === 0) {
      this.dx = random([-1, 1]);
      this.dy = random([-1, 1]);
    }

    // keep inside canvas
    this.x = constrain(this.x, this.r / 2, width - this.r / 2);
    this.y = constrain(this.y, 80, 340);
  }

  draw() {
    push(); // Save current style
    textSize(50);
    text(this.emoji, this.x, this.y);
    pop(); // Restore style
  }
}
// --- Game Logic Functions ---

function sendInTheEmoji() {
  if (frameCount % 30 === 0) {
    circles.push(new Circ(random(50, width - 50), random(50, height - 50)));
  }

  for (let c of circles) {
    c.update();
    c.draw();
  }
}

function hud() {
  push();
  fill(0, 60, 0, 100);
  noStroke();
  rect(0, 0, width, 30);
  pop();

  push();
  fill('yellow');
  textSize(15);
  textAlign(LEFT, CENTER);
  text(`Score: ${score}`, 10, 15);
  textAlign(CENTER);
  text(`😁: ${circles.length}`, 200, 15);
  
  if (circles.length > 5){
    textAlign(CENTER);
    text(`😆: ${circles.length}`, 200, 15);
  }
  
  if (circles.length > 10){
    textAlign(CENTER);
    text(`😬: ${circles.length}`, 200, 15);
  }
  
  if (circles.length > 15){
    textAlign(CENTER);
    text(`🫣: ${circles.length}`, 200, 15);
  }
  
  textAlign(RIGHT, CENTER);
  text(`High Score: ${highScore}`, width - 10, 15);
  pop();
}

function gameOver() {
  gameStarted = false;
  gameIsOver = true;
  gameOverTime = millis(); // Record the exact time the game ended

  if (score > highScore) {
    highScore = score;
  }
}

// --- Screen Display Functions ---

// --- NEW Function to display loading screen ---
function displayLoadingScreen() {
  background(0);
  fill(255);
  textSize(32);
  // Animate the dots after "Loading"
  const numDots = floor(frameCount / 30) % 4;
  const dots = '🙂'.repeat(numDots);
  text(`Loading${dots}`, width / 2, height / 2);
}

function displayGameOver() {
  fill(255);
  textSize(100);
  text('😈', 200,100);
  textSize(32);
  text('😔 YOU LOST! 😔', width / 2, height / 2);
  
  if (millis() - gameOverTime > 2000) {
     textSize(16);
     text('Click to Restart', width/2, height/2 + 40);
      image(youSuck, 160, 300, 100, 100);
    particles.length = 0; // remove any fireworks still on screen
  }
}

function displayStartScreen() {
  
  fill(255,0,0);
  textSize(50);
  text('DOOM OF THE',200,25);
  textSize(100);
  
  text('EM', 70,100);
  text("😱",205,100);
  text('JI!!', 330, 100);
  fill(255);
  textSize(20);
  text('Click Mouse to Start', width / 2, height / 2);
  text("🧐 & 🥸 = 1 point", 100, 250);
  text("🤬 & 🫠 = 2 points", 106, 275);
  text("😵‍💫 & 🤮 = 3 points", 106, 300);
  text("🤑 = 4 points", 82, 330);
  text("🥳 = ??? points", 91, 360);
  textSize(80);
  text("🫨", 300, 300 );
}



// --- Utility Function ---

function resetGame() {
    gameIsOver = false;
    gameStarted = true;
    circles.length = 0; // Clear the circles array
    score = 0;
    speedMultiplier = 1;
    scoreMultiplier = 1;
}




// Simple particle for explosion effects
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    
    let angle = random(TAU); 
    let speed = random(0.5, 3);
    
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    
    this.life = 255;
    this.color = color;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.01;
    this.life -= 2; 
  }
  
  draw() {
    push(); // Save current style
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.life);
    circle(this.x, this.y, map(this.life, 0, 255, 1, 6));
    pop(); // Restore style
  }
  
  isDead() {
    return this.life <= 0;
  }
}

// Usage: Create explosion at x, y
function createExplosion(x, y, numParticles, color) {
  let newParticles = [];
  for (let i = 0; i < numParticles; i++) {
    newParticles.push(new Particle(x, y, color));
  }
  return newParticles;
}
