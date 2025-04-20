// This is a classic-style side-scrolling shooter game!
// Let's set up all the things we need for the game.

let ship; // This will be the player’s ship
let bullets = []; // Bullets player shoots
let enemies = []; // The bad guys
let enemyBullets = []; // Bullets the bad guys shoot
let boss = null; // The big bad boss
let bossActive = false; // Is the boss on the screen?
let scrollX = 0; // This scrolls the background to the left
let gameTime = 0; // Timer to know how long we've played
let levelDuration = 5 * 60; // how long the level lasts before the boss comes (60 frames per second)
let gameOver = false; // If true, the game has ended
let gameStarted = false; // To track if game has started
let waitingToStart = true; // Waiting for player to press a key to start
let bossBulletSpeed = 90; // boss bullet speed
let color = 255; // hud color


function preload() {
	soundFormats('wav', 'mp3');
	//always = loadSound('/music/alwaysmememusic.mp3');
  playerShip = loadImage('/gfx/craft.png');
  alienShip1 = loadImage('/gfx/alien1.png');
  boss1 = loadImage('/gfx/boss1.png');
  blockBottom = loadImage('/gfx/blockBottom.png');
}


function rectsOverlap(r1, r2) {
  return !(
    r2.x > r1.x + r1.w ||
    r2.x + r2.w < r1.x ||
    r2.y > r1.y + r1.h ||
    r2.y + r2.h < r1.y
  );
}


function setup() {
  createCanvas(600, 400); // Create a game screen that's 600 wide and 400 high
  textAlign(CENTER, CENTER); // Center text nicely
}

function draw() {
  background(0); // Paint the background black each frame

  if (waitingToStart) {
    fill(255);
    textSize(24);
    text("Press any key to start", width / 2, height / 2); // Start screen
    return;
  }

  if (gameOver) {
    fill(255, 0, 0);
    textSize(32);
    //text("Game Over", 200, height /2);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    //text("Press any key to restart", 200, height / 2 + 40);
    text("Press any key to restart", width/2, height / 2 + 40);
    return;
  }

  gameTime++; // Add to game timer each frame

  if (!bossActive) { // if the boss is NOT on the screen
    scrollX += 2; // Move the world to the left (scrolling)
  }

  translate(-scrollX, 0); // Move everything to the left

  // Draw yellow rectangles at the top and bottom (they're deadly!)
/*
  fill(255, 255, 0);
  rect(scrollX, 0, width, 10);
  rect(scrollX, height - 10, width, 10);
*/
	for (let i = 0; i < 600; i = i + 60){
	image(blockBottom, scrollX + i, height - 10);
	}
	


  ship.update(); // Move the ship
  ship.display(); 

  // Check for collision between ship and boss
  if (bossActive && boss) {
    let shipBox = { x: ship.x, y: ship.y, w: ship.width, h: ship.height };
    let bossBox = { x: boss.x-80, y: boss.y-100, w: 100, h: 200 };
    //let bossBox = { x: boss.x, y: boss.y, w: boss.width, h: boss.height };

    if (rectsOverlap(shipBox, bossBox)) {
      ship.shield -= 1; // Damage over time
      ship.shield = max(ship.shield, 0); // Clamp to zero
    }
  }
// Draw the ship

  if (!bossActive && gameTime < levelDuration) { 
    handleEnemies(); // Keep sending in bad guys
  } else if (!boss && !bossActive) {
    boss = new Boss(scrollX + width - 100); // Put the boss at the end
    bossActive = true; // Tell the game the boss is here
  }

  for (let b of bullets) {
    b.update();
    b.display();
  }

  for (let e of enemies) {
    e.update();
    e.display();

    // Check if our ship hits an enemy
    if (
      ship.x < e.x + 20 &&
      ship.x + ship.width > e.x &&
      ship.y < e.y + 20 &&
      ship.y + ship.height > e.y
    ) {
      e.destroyed = true; // Remove the enemy
      ship.shield--; // Take away one shield
      if (ship.shield <= 0) {
        ship.loseLife(); // If no shield, lose a life
      }
    }
  }

  for (let eb of enemyBullets) {
    eb.update();
    eb.display();
    ship.checkCollision(eb); // Did the enemy bullet hit our ship?
  }
// Clean up bullets and enemies that are gone

// Filter out player bullets that are offscreen
let newBullets = [];
for (let i = 0; i < bullets.length; i++) {
  let b = bullets[i];
  if (!b.offscreen) {
    newBullets.push(b);
  }
}
bullets = newBullets;

// Filter out enemies that are destroyed
let newEnemies = [];
for (let i = 0; i < enemies.length; i++) {
  let e = enemies[i];
  if (!e.destroyed) {
    newEnemies.push(e);
  }
}
enemies = newEnemies;

// Filter out enemy bullets that are offscreen
let newEnemyBullets = [];
for (let i = 0; i < enemyBullets.length; i++) {
  let b = enemyBullets[i];
  if (!b.offscreen) {
    newEnemyBullets.push(b);
  }
}
enemyBullets = newEnemyBullets;

  // If the boss is alive, update and show it
  if (boss) {
    boss.update();
    boss.display();
    ship.display(); // ship displayed last so doesn't go behind boss
    text(`Boss: ${boss.health}`, scrollX + 10, 60);  // boss health appears only when boss on screen.
    text(`bossbspeed: ${bossBulletSpeed}`, scrollX + 10, 80);
   
    if (boss.health > 5 && boss.health < 35) {
    	bossBulletSpeed = int(random(20, 90));
    	}
    
    /*
    if (boss.health > 15 && boss.health < 25) {
    	bossBulletSpeed = int(random(10, 45));
    	}
    
    */
    if (boss.health <= 0) {
      background(0);
      fill(255);
      textSize(32);
      
      //text("You Win!", width / 2, height / 2);
      text("You Win!", scrollX + width / 2, height / 2);
      color = 0;
      noLoop(); // Stop the game
    }
  }

  // Show shield and lives on screen
  fill(color);
  textSize(16);
  textAlign(LEFT, CENTER);
  text(`Shield: ${ship.shield}`, scrollX + 10, 20);
  text(`Lives: ${ship.lives}`, scrollX + 10, 40);
  
  	
  
  if (ship.lives <= 0) {
    gameOver = true; // If no lives left, game over
  }
}

function keyPressed() {
  if (waitingToStart) {
    waitingToStart = false;
    startGame(); // Start the game!
    return;
  }

  if (gameOver) {
    gameOver = false;
    startGame(); // Restart the game!
    return;
  }

  if (key === ' ') {
    bullets.push(new Bullet(ship.x + 20, ship.y + 40)); // Shoot a bullet!
  }
}

function handleEnemies() {
  if (frameCount % 60 === 0) { // Every second (60 frames), make a new enemy
    enemies.push(new Enemy(scrollX + width, random(50, height - 50)));
  }
}

function startGame() {
  scrollX = 0;
  ship = new Ship();
  bullets = [];
  enemies = [];
  enemyBullets = [];
  boss = null;
  bossActive = false;
  gameTime = 0;
  gameStarted = true;
  //always.loop();
  loop();
}

// This is the player’s ship!
class Ship {
  constructor() {
    this.x = scrollX + 50;
    this.y = height / 2;
    this.shield = 3;
    this.lives = 3;
    this.width = 50;
    this.height = 40;
  }
  update() {
    // Move the ship using arrow keys
    if (keyIsDown(LEFT_ARROW)) this.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.x += 5;
    if (keyIsDown(UP_ARROW)) this.y -= 5;
    if (keyIsDown(DOWN_ARROW)) this.y += 5;

    // Keep ship on the screen
    this.x = constrain(this.x, scrollX, scrollX + width);
    this.y = constrain(this.y, 0, height);

    // If the ship hits the top or bottom yellow wall, lose a life
    //if (this.y <= 10 || this.y + this.height >= height - 10) {
      
      if (this.y + this.height >= height - 10) {
      
      this.loseLife();
    }
  }
  display() {
    fill(0, 255, 255);
    
    image(playerShip, this.x, this.y);
    
    //rect(this.x, this.y, this.width, this.height); // Draw ship as a rectangle
    
  }
  checkCollision(bullet) {
    // Check if a bullet hit the ship
    if (
      bullet.x < this.x + this.width &&
      bullet.x + 4 > this.x &&
      bullet.y < this.y + this.height &&
      bullet.y + 1 > this.y + 3
    ) {
      bullet.offscreen = true; // Bullet disappears
      this.shield--; // Lose shield
      if (this.shield <= 0) {
        this.loseLife();
      }
    }
  }
  loseLife() {
    this.lives--;
    this.shield = 3;
    this.x = scrollX + 50;
    this.y = height / 2; // Reset ship's position
  }
}

// This is our bullet!
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.offscreen = false;
  }
  update() {
    this.x += 10; // Move bullet to the right
    if (this.x > scrollX + width) this.offscreen = true;

    // If bullet hits an enemy
    for (let e of enemies) {
      if (dist(this.x, this.y, e.x, e.y) < 20) {
        e.destroyed = true;
        this.offscreen = true;
      }
    }

    // If bullet hits the boss
    if (boss && dist(this.x, this.y, boss.x, boss.y) < 50) {
      boss.health -= 1;
      this.offscreen = true;
    }
  }
  display() {
    fill(255);
    rect(this.x, this.y, 5, 2); // Small rectangle bullet
  }
}

// This is an enemy
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.destroyed = false;
    this.shootCooldown = int(random(30, 90)); // Random shooting delay
  }
  update() {
    this.x -= 2; // Move left
    this.shootCooldown--;
    if (this.shootCooldown <= 0) {
      enemyBullets.push(new EnemyBullet(this.x, this.y)); // Enemy shoots!
      this.shootCooldown = int(random(30, 90));
    }
  }
  display() {
    fill(255, 0, 0);
    image(alienShip1, this.x, this.y);
    //rect(this.x, this.y, 20, 20); // Red square enemy
  }
}

// Enemy bullets
class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.offscreen = false;
  }
  update() {
    this.x -= 6; // Move left
    if (this.x < scrollX) this.offscreen = true;
  }
  display() {
    fill(255, 255, 0);
    rect(this.x, this.y, 4, 4); // Yellow bullet
  }
}

// Big boss enemy
class Boss {
  constructor(x) {
    this.x = x;
    this.y = height / 2;
    this.health = 50;   // boss health
    this.shootCooldown = bossBulletSpeed;  // will increase the closer boss gets to dying
    this.width = 100;
    this.height = 100;
  }
  update() {
    this.shootCooldown--;
    if (this.shootCooldown <= 0) {
      enemyBullets.push(new EnemyBullet(this.x, this.y + int(random(1,100)))); // Boss shoots!
      enemyBullets.push(new EnemyBullet(this.x, this.y - int(random(1,100)))); // Boss shoots!
      this.shootCooldown = bossBulletSpeed;
    }
  }
  display() {
    fill(255, 0, 255);
    image(boss1, this.x - 50, this.y - 120);
    //rect(this.x - 50, this.y - 50, 100, 100); // Big purple square boss
  }
}








