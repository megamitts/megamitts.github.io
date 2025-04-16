const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const messageElement = document.getElementById('message');

// --- ZX Spectrum Colors ---
const Z_BLACK = '#000000';
const Z_BLUE = '#0000CD';
const Z_RED = '#CD0000';
const Z_MAGENTA = '#CD00CD';
const Z_GREEN = '#00CD00';
const Z_CYAN = '#00CDCD';
const Z_YELLOW = '#CDCD00';
const Z_WHITE = '#FFFFFF'; // Using pure white for contrast

// --- Game Constants ---
const GAME_WIDTH = 600; // Canvas width
const GAME_HEIGHT = 400; // Canvas height
const TILE_SIZE = 20;    // Size of player, enemies, etc.

const GRAVITY = 0.5;
const JUMP_FORCE = -7.5;
const PLAYER_SPEED = 4;
let INVULNERABILITY_DURATION = 2000; // 2 seconds in milliseconds
const IDLE_TIME_THRESHOLD = 1500; // 1.5 seconds for idle animation

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;


let audio = document.getElementById("myAudio");
let winAudio = document.getElementById("winAudio"); 
let deathAudio = document.getElementById("deathAudio");
let jumpAudio = document.getElementById("jumpAudio");
let hitAudio = document.getElementById("hitAudio");
let collectAudio = document.getElementById("collectAudio");


document.addEventListener('keydown', () => {
    audio.play().catch(err => console.warn("Autoplay prevented:", err));
    audio.volume = 0.2;
    jumpAudio.volume = 0.4;
}, { once: true });


/*   
  function playAudio() {
    audio.play();
  }
*/





// --- Game State ---
let player = {
    x: 50,
    y: GAME_HEIGHT - TILE_SIZE * 3,
    width: TILE_SIZE,
    height: TILE_SIZE,
    vx: 0, // Velocity x
    vy: 0, // Velocity y
    color: Z_YELLOW,
    isOnGround: false,
    isInvulnerable: false,
    invulnerabilityTimer: 0,
    lastMoveTime: Date.now(),
    isLicking: false,
    facingRight: true
};

let lives = 3;
let score = 0;
let keys = {}; // Keep track of pressed keys
let platforms = [];
let enemies = [];
let collectables = [];
let goal = {};
let gameActive = true;
let lastTime = 0;

// --- Starfield Setup ---
const stars = [];
const STAR_COUNT = 100; // Number of stars
let STAR_SPEED = 0; // Speed of stars

// Initialize stars with random positions
for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() * 2 + 1, // Random size between 1 and 3
        color: Z_WHITE
    });
}

// Update star positions
function updateStarfield() {
    stars.forEach(star => {
        star.x -= STAR_SPEED; // Move stars to the left
        if (star.x < 0) {
            star.x = GAME_WIDTH; // Reset star to the right
            star.y = Math.random() * GAME_HEIGHT; // Randomize vertical position
        }
    });
}

// Draw stars
function drawStarfield() {
    stars.forEach(star => {
        drawRect(star.x, star.y, star.size, star.size, star.color);
    });
}

// --- Input Handling ---
document.addEventListener('keydown', (e) => { keys[e.code] = true; });
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

// --- Collision Detection (AABB) ---
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}



function loading() {

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("loading_screen");
ctx.drawImage(image, 100, 10);
displayMessage("<strong>Press any key to start</strong>");


}


// --- Level Setup ---
function setupLevel() {



    // ... (reset game state as before) ...
    player.x = 50;
    player.y = GAME_HEIGHT - TILE_SIZE * 3;
    // ... (rest of player reset) ...
    score = 0;
    lives = 3;  // #lives counter
    STAR_SPEED = 0;
    keys = {};
    gameActive = true;
    messageElement.style.display = 'none';
    updateHUD();

// --- MODIFIED Goal ---
    // Place it on the NEW final platform
    const finalPlatY = GAME_HEIGHT - TILE_SIZE * 14;
    const goalHeight = TILE_SIZE * 2;
    goal = {
        x: 420, // Positioned on the final platform (x=360, width=150)
        y: finalPlatY - goalHeight, // Base sits on the platform
        width: TILE_SIZE * 2,
        height: goalHeight,
        color: Z_WHITE
    };

// Maybe add an enemy on the final platform?
	
    // --- Define Platforms ---
    platforms = [
        // Ground
        { x: 0, y: GAME_HEIGHT - TILE_SIZE, width: GAME_WIDTH, height: TILE_SIZE, color: Z_GREEN, type: 'static' },
        // Static Platforms (Lower/Mid Level)
        { x: 100, y: GAME_HEIGHT - TILE_SIZE * 4, width: 100, height: TILE_SIZE, color: Z_GREEN, type: 'static' },
        { x: 80, y: GAME_HEIGHT - TILE_SIZE * 10, width: 60, height: TILE_SIZE, color: Z_GREEN, type: 'static' },
        { x: 250, y: GAME_HEIGHT - TILE_SIZE * 7, width: 120, height: TILE_SIZE, color: Z_GREEN, type: 'static' },
        // Moving Platform (horizontal - keep as is or adjust range if needed)
        { x: 500, y: GAME_HEIGHT - TILE_SIZE * 3, width: 80, height: TILE_SIZE, color: Z_CYAN, type: 'moving_h', startX: 350, endX: 500, speed: 1.5, direction: 1 },
        { x: 400, y: GAME_HEIGHT - TILE_SIZE * 5, width: 80, height: TILE_SIZE, color: Z_CYAN, type: 'moving_h', startX: 350, endX: 600, speed: 1, direction: 1 },

	 { x: 100, y: GAME_HEIGHT - TILE_SIZE * 17, width: 220, height: TILE_SIZE, color: Z_GREEN, type: 'static'},

        // --- MODIFIED Vertically Moving Platform ---
        // Make it wider and position it to act as a lift to the final area
        {
            x: 275, // Positioned roughly above the static platform below it
            y: GAME_HEIGHT - TILE_SIZE * 8, // Start Y position (so it aligns initially near the platform below)
            width: 50, // Wider for easier landing
            height: TILE_SIZE,
            color: Z_CYAN,
            type: 'moving_v',
            // Move between the level of the platform below and the final platform height
            startY: GAME_HEIGHT - TILE_SIZE * 14, // Peak height
            endY: GAME_HEIGHT - TILE_SIZE * 8,   // Lowest point
            speed: 1, // Adjust speed as needed
            direction: -1 // Start moving UP
        },
        
        {
            x: 20, // Positioned roughly above the static platform below it
            y: GAME_HEIGHT - TILE_SIZE * 8, // Start Y position (so it aligns initially near the platform below)
            width: 50, // Wider for easier landing
            height: TILE_SIZE,
            color: Z_CYAN,
            type: 'moving_v',
            // Move between the level of the platform below and the final platform height
            startY: GAME_HEIGHT - TILE_SIZE * 18, // Peak height
            endY: GAME_HEIGHT - TILE_SIZE * 2,   // Lowest point
            speed: 1.5, // Adjust speed as needed
            direction: -1 // Start moving UP
        },

        // --- MODIFIED Final Platform (Goal Platform) ---
        // Position it directly reachable from the peak of the moving platform
        {
            x: 360, // Start slightly to the right of the moving platform's end (250 + 100 = 350)
            y: GAME_HEIGHT - TILE_SIZE * 14, // Align vertically with the peak of the moving platform
            width: 150, // Make it reasonably sized
            height: TILE_SIZE,
            color: Z_GREEN,
            type: 'static'
        }

        // REMOVED the isolated high static platform:
        // { x: 50, y: GAME_HEIGHT - TILE_SIZE * 10, width: 80, height: TILE_SIZE, color: Z_GREEN, type: 'static' },
    ];

    // --- Define Enemies --- (Keep as is for now, but check positions relative to new platforms)
    enemies = [
         // Pacer on platform 1
        { x: 120, y: GAME_HEIGHT - TILE_SIZE * 5 + 1, width: TILE_SIZE, height: TILE_SIZE -2, color: Z_RED, type: 'pacer', startX: 110, endX: 190, speed: 1.5, direction: 1 },
        // Bouncer on platform 2 (check Y range if needed) - Let's adjust Y slightly
        { x: 250, y: GAME_HEIGHT + TILE_SIZE * 8 + 1, width: TILE_SIZE, height: TILE_SIZE -2, color: Z_MAGENTA, type: 'bouncer', startY: GAME_HEIGHT - TILE_SIZE * 10, endY: GAME_HEIGHT - TILE_SIZE * 7, speed: 0.5, direction: 1 },
        
        { x: 350, y: GAME_HEIGHT + TILE_SIZE * 8 + 1, width: TILE_SIZE, height: TILE_SIZE -2, color: Z_MAGENTA, type: 'bouncer', startY: GAME_HEIGHT - TILE_SIZE * 12, endY: GAME_HEIGHT - TILE_SIZE * 7, speed: 1.5, direction: 1 },
        
        // Pacer on ground
        { x: 200, y: GAME_HEIGHT - TILE_SIZE * 2 + 1 , width: TILE_SIZE, height: TILE_SIZE-2, color: Z_RED, type: 'pacer', startX: 10, endX: 350, speed: 1, direction: 1 },
        
        { x: 490, y: GAME_HEIGHT - TILE_SIZE * 2 + 1 , width: TILE_SIZE, height: TILE_SIZE-2, color: Z_RED, type: 'pacer', startX: 490, endX: 590, speed: 0.5, direction: 1 },
        
        { x: 100, y: GAME_HEIGHT - TILE_SIZE * 18 + 1 , width: TILE_SIZE, height: TILE_SIZE-2, color: Z_RED, type: 'pacer', startX: 100, endX: 320, speed: 4, direction: 1 },
        
        // Maybe add an enemy on the final platform?
        { x: 360, y: GAME_HEIGHT - TILE_SIZE * 15 + 1, width: TILE_SIZE, height: TILE_SIZE - 2, color: Z_RED, type: 'pacer', startX: 360, endX: 420, speed: 1, direction: 1 }
        
    ];
    // Initialize enemy direction/state if needed (redundant if set above)
    // enemies.forEach(enemy => { if (!enemy.direction) { enemy.direction = 1; } });


    // --- Define Collectables --- (Adjust Y positions based on new platform layout)
    collectables = [
        { x: 150, y: GAME_HEIGHT - TILE_SIZE * 5 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false }, // On plat 1
        { x: 300, y: GAME_HEIGHT - TILE_SIZE * 7 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false }, // On plat 2
        // Fish near moving platform path
        { x: 200, y: GAME_HEIGHT - TILE_SIZE * 11 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false },
        // Fish on final platform
        { x: 400, y: GAME_HEIGHT - TILE_SIZE * 15 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false },
        { x: 15, y: GAME_HEIGHT - TILE_SIZE * 19 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false }, // top
        { x: 520, y: GAME_HEIGHT - TILE_SIZE * 10 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false }, 
        { x: 170, y: GAME_HEIGHT - TILE_SIZE * 18 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false }, 
        { x: 200, y: GAME_HEIGHT - TILE_SIZE * 2 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false }, 
        { x: 110, y: GAME_HEIGHT - TILE_SIZE * 11 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false },
        { x: 550, y: GAME_HEIGHT - TILE_SIZE * 1 - TILE_SIZE/2, width: TILE_SIZE / 1.5, height: TILE_SIZE / 2, color: Z_BLUE, score: 100, collected: false },
        
    ];





/*
    // --- MODIFIED Goal ---
    // Place it on the NEW final platform
    const finalPlatY = GAME_HEIGHT - TILE_SIZE * 14;
    const goalHeight = TILE_SIZE * 2;
    goal = {
        x: 420, // Positioned on the final platform (x=360, width=150)
        y: finalPlatY - goalHeight, // Base sits on the platform
        width: TILE_SIZE * 2,
        height: goalHeight,
        color: Z_WHITE
    };
*/
} // End of setupLevel function

// --- Update Functions ---

function updatePlayer(deltaTime) {
    let now = Date.now();
    let moved = false;

    // --- Horizontal Movement ---
    player.vx = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.vx = -PLAYER_SPEED;
        player.lastMoveTime = now;
        moved = true;
        player.facingRight = false;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.vx = PLAYER_SPEED;
        player.lastMoveTime = now;
        moved = true;
        player.facingRight = true;
    }


	if(keys['KeyI']){
	INVULNERABILITY_DURATION = 2000000;
	}

    // --- Jumping ---
    // Allow jumping only if grounded OR if briefly detached from a downward moving plat
    // This adds complexity, let's stick to grounded only for now.
    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.isOnGround) {
        jumpAudio.play();
        player.vy = JUMP_FORCE;
        player.isOnGround = false; // Will be reset if still colliding next frame
        player.lastMoveTime = now;
        moved = true;
        // Optional: Detach from platform immediately on jump
        // platformPlayerIsOn = null; // Requires platformPlayerIsOn to be tracked across frames
    }

    // --- Apply Gravity ---
    // Apply gravity *unless* the player is firmly grounded on a platform (esp. moving one)
    // We will refine this after collision checks
    if (!player.isOnGround) { // Apply gravity if airborne
       player.vy += GRAVITY;
    }

    // Store potential platform player is standing on
    let platformPlayerIsOn = null;
    let previousY = player.y; // Store Y before vertical update

    // --- Update Potential Vertical Position FIRST ---
    player.y += player.vy;


    // --- Collision Checks and Resolution ---
    player.isOnGround = false; // Assume not grounded until proven otherwise

    platforms.forEach(platform => {
        // Use a slightly larger bounding box for platform check downwards
        // to catch cases where player slightly overlaps due to float precision or timing
        const collisionCheckRect = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height + 1 // Check 1 pixel below for landing
        };

        if (checkCollision(collisionCheckRect, platform)) {
            const playerBottomLastFrame = previousY + player.height;
const playerTopLastFrame = previousY;
const platformTop = platform.y;
const platformBottom = platform.y + platform.height;
const playerIsFalling = player.vy >= 0;

// Check what kind of collision occurred
const landedFromAbove = playerBottomLastFrame <= platformTop && player.y + player.height >= platformTop;
const bumpedHead = playerTopLastFrame >= platformBottom && player.y <= platformBottom;

const platformMovingUpIntoPlayer = platform.type === 'moving_v' && platform.dy < 0 &&
                                   playerBottomLastFrame > platformTop &&
                                   player.y + player.height >= platformTop;

if (landedFromAbove || (platformMovingUpIntoPlayer && playerIsFalling)) {
    // Landed on or caught by upward platform while falling
    player.y = platform.y - player.height;
    player.vy = 0;
    player.isOnGround = true;
    if (platform.type.startsWith('moving')) {
        platformPlayerIsOn = platform;
    }
} else if (bumpedHead) {
    // Hit from below, including fast vertical motion
    player.y = platformBottom;
    if (player.vy < 0) {
        player.vy = 0;
    }
}

 else {
                // Horizontal collisions
                if (!player.isOnGround) {
                    if (player.vx > 0 && player.x + player.width - player.vx <= platform.x) {
                        player.x = platform.x - player.width;
                        player.vx = 0;
                    } else if (player.vx < 0 && player.x >= platform.x + platform.width) {
                        player.x = platform.x + platform.width;
                        player.vx = 0;
                    }
                }
            }
        }
    });



    // --- Apply Horizontal Movement ---
    // Check horizontal collision *before* moving
    let proposedX = player.x + player.vx;
    let canMoveX = true;
    const futurePlayerXRect = { x: proposedX, y: player.y, width: player.width, height: player.height };

    platforms.forEach(platform => {
        // Don't check horizontal collision with the platform we are standing on if moving vertically?
        // This can get complex. Basic check:
         if (checkCollision(futurePlayerXRect, platform) && platform !== platformPlayerIsOn) {
             // Check if the collision is purely horizontal (not just landing/bumping head)
             if (player.y + player.height > platform.y && player.y < platform.y + platform.height) {
                  // If moving right and hitting left side
                 if (player.vx > 0 && futurePlayerXRect.x + futurePlayerXRect.width > platform.x && player.x <= platform.x ) {
                      player.x = platform.x - player.width; // Stop at edge
                      player.vx = 0;
                      canMoveX = false;
                 }
                 // If moving left and hitting right side
                 else if (player.vx < 0 && futurePlayerXRect.x < platform.x + platform.width && player.x >= platform.x + platform.width ) {
                      player.x = platform.x + platform.width; // Stop at edge
                      player.vx = 0;
                      canMoveX = false;
                 }
             }
        }
    });

    if (canMoveX) {
        player.x = proposedX;
    }


    // --- Apply Moving Platform "Stickiness" ---

    
    if (platformPlayerIsOn) {
        // Apply platform's horizontal movement delta
        player.x += platformPlayerIsOn.dx;

        // IMPORTANT: Force player Y position for vertical platforms
        // This ensures the player stays exactly on top, overriding minor gravity/update offsets
         if (platformPlayerIsOn.type === 'moving_v') {
             player.y = platformPlayerIsOn.y - player.height;
             // Since we force the position, ensure velocity doesn't build up incorrectly
             player.vy = 0; // Or potentially platformPlayerIsOn.dy if you want player to inherit vertical speed? Simpler to use 0.
         }
         player.isOnGround = true; // Re-affirm grounded status
    }


    // --- World Boundaries ---
    if (player.x < 0) { player.x = 0; player.vx = 0; }
    if (player.x + player.width > GAME_WIDTH) { player.x = GAME_WIDTH - player.width; player.vx = 0; }
    if (player.y > GAME_HEIGHT) { // Fell off the bottom
        loseLife();
    }
    if (player.y < 0 && player.vy < 0) { // Hitting ceiling
        player.y = 0;
        player.vy = 0;
    }

    // --- Handle other collisions (Collectables, Enemies, Goal) ---
    // (These should generally happen *after* position is finalized for the frame)
    // ... (collision code for collectables, enemies, goal remains the same) ...
    // --- Invulnerability ---
    if (player.isInvulnerable) {
        player.invulnerabilityTimer -= deltaTime;
        if (player.invulnerabilityTimer <= 0) {
            player.isInvulnerable = false;
        }
    } else { // Check enemy collision only if not invulnerable
         enemies.forEach(enemy => {
            if (checkCollision(player, enemy)) {
                loseLife(); // This might set invulnerability
            }
        });
    }
    // --- Collectables ---
     collectables.forEach((fish, index) => {
        if (!fish.collected && checkCollision(player, fish)) {
            
            fish.collected = true;
            score += fish.score;
            collectAudio.play();
            updateHUD();
            STAR_SPEED++;
        }
    });
    // --- Goal --- 
    if (checkCollision(player, goal) && score === 1000) {
        winGame();
        
    }


    // --- Idle Animation Check ---
    // ... (idle check logic remains the same) ...
     if (!moved && player.isOnGround && now - player.lastMoveTime > IDLE_TIME_THRESHOLD) {
        player.isLicking = true;
    } else {
        player.isLicking = false;
    }
     if (moved) {
         player.lastMoveTime = now;
         player.isLicking = false;
     }
}

function updatePlatforms(deltaTime) {
    platforms.forEach(platform => {
        // Initialize deltas for this frame
        platform.dx = 0;
        platform.dy = 0;

        if (platform.type === 'moving_h') {
            let move = platform.speed * (platform.direction || 1);
            platform.x += move;
            platform.dx = move; // Store horizontal change

            // Boundary and direction check
            if (platform.x <= platform.startX || platform.x + platform.width >= platform.endX) {
                platform.direction = (platform.direction || 1) * -1;
                platform.x = Math.max(platform.startX, Math.min(platform.x, platform.endX - platform.width));
                // Recalculate delta if clamped (less accurate, but prevents boundary issues)
                // platform.dx = platform.x - previousX; // More complex tracking needed for perfect accuracy on clamp
            }
        } else if (platform.type === 'moving_v') {
            let move = platform.speed * (platform.direction || 1);
            platform.y += move;
            platform.dy = move; // Store vertical change

            // Boundary and direction check
            if (platform.y <= platform.startY || platform.y + platform.height >= platform.endY) {
                platform.direction = (platform.direction || 1) * -1;
                platform.y = Math.max(platform.startY, Math.min(platform.y, platform.endY - platform.height));
                 // platform.dy = platform.y - previousY; // Similar complexity for clamping
            }
        }
    });
}


function updateEnemies(deltaTime) {
    enemies.forEach(enemy => {
        if (enemy.type === 'pacer') {
            enemy.x += enemy.speed * enemy.direction;
            if (enemy.x <= enemy.startX || enemy.x + enemy.width >= enemy.endX) {
                enemy.direction *= -1;
                 enemy.x = Math.max(enemy.startX, Math.min(enemy.x, enemy.endX - enemy.width)); // Clamp
            }
        } else if (enemy.type === 'bouncer') {
            enemy.y += enemy.speed * enemy.direction;
             if (enemy.y <= enemy.startY || enemy.y + enemy.height >= enemy.endY) {
                enemy.direction *= -1;
                 enemy.y = Math.max(enemy.startY, Math.min(enemy.y, enemy.endY - enemy.height)); // Clamp
            }
        }
        // Add more enemy types here (e.g., spinners, patrollers that follow platforms)
    });
}

// --- Drawing Functions ---

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    
   
   
}

// Simple cat drawing (basic shapes)
function drawPlayer() {
    let playerColor = player.color;

    // Invulnerability Flash
    if (player.isInvulnerable) {
        // Flash between player color and white/red every 100ms
        playerColor = Math.floor(Date.now() / 100) % 2 === 0 ? Z_WHITE : Z_RED;
    }

    // Body
    drawRect(player.x, player.y, player.width, player.height, playerColor);

    // Eyes (simple dots)
    const eyeY = player.y + player.height * 0.3;
    const eyeSpacing = player.width * 0.2;
    const eyeX1 = player.facingRight ? player.x + player.width * 0.6 : player.x + player.width * 0.2;
    const eyeX2 = player.facingRight ? player.x + player.width * 0.8 : player.x + player.width * 0.4;
    drawRect(eyeX1 -1 , eyeY -1, 2, 2, Z_BLACK); // Small black eyes
    drawRect(eyeX2 -1 , eyeY -1, 2, 2, Z_BLACK);

    // Licking Paw Animation (very basic)
    if (player.isLicking) {
        ctx.fillStyle = Z_WHITE; // Paw color
        const pawX = player.facingRight ? player.x + player.width * 0.7 : player.x + player.width * 0.1;
        const pawY = player.y + player.height * 0.6;
        ctx.fillRect(pawX, pawY, player.width * 0.2, player.height * 0.3); // Draw a small 'paw'
        // Maybe draw a tongue?
         ctx.fillStyle = Z_MAGENTA;
         const tongueX = player.facingRight ? pawX -1 : pawX + player.width * 0.2 -1;
         ctx.fillRect(tongueX, pawY + player.height * 0.1, 2, 3);
    }
    
    // cloud top left - player will go behind them.
    ctx.beginPath();
ctx.arc(30, 50, 30, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();


ctx.beginPath();
ctx.arc(50, 30, 30, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();

ctx.beginPath();
ctx.arc(70, 50, 30, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();    
}

function drawPlatforms() {
    platforms.forEach(p => drawRect(p.x, p.y, p.width, p.height, p.color));
    
    
    //clouds

ctx.beginPath();
ctx.arc(500, 50, 30, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();


ctx.beginPath();
ctx.arc(520, 30, 30, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();

ctx.beginPath();
ctx.arc(540, 50, 30, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();
 


    
}

function drawEnemies() {
    enemies.forEach(e => drawRect(e.x, e.y, e.width, e.height, e.color));
    enemies.forEach(e => drawRect(e.x, e.y-4, 3, 5, e.color));
    enemies.forEach(e => drawRect(e.x+17, e.y-4, 3, 5, e.color));
    enemies.forEach(e => drawRect(e.x+4, e.y+4, 3, 3, Z_BLACK));
    enemies.forEach(e => drawRect(e.x+12, e.y+4, 3, 3, Z_BLACK));
}

function drawCollectables() {
    collectables.forEach(f => {
        if (!f.collected) {
            // Draw a simple fish shape
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.moveTo(f.x, f.y + f.height / 2);
            ctx.quadraticCurveTo(f.x + f.width / 2, f.y - f.height/3, f.x + f.width, f.y + f.height / 2); // Top curve
            ctx.quadraticCurveTo(f.x + f.width / 2, f.y + f.height + f.height/3 , f.x, f.y + f.height / 2); // Bottom curve
             // Tail fin
             ctx.moveTo(f.x + f.width, f.y + f.height / 2);
             ctx.lineTo(f.x + f.width + f.width/3, f.y);
             ctx.lineTo(f.x + f.width + f.width/3, f.y + f.height);
             ctx.closePath();

            ctx.fill();

        }
    });
}

function drawGoal() {
    // Simple Castle Representation
    drawRect(goal.x, goal.y, goal.width, goal.height, goal.color);
    // Add some basic detail
    drawRect(goal.x + goal.width * 0.1, goal.y - goal.height * 0.2, goal.width * 0.2, goal.height * 0.2, Z_RED); // Turret 1
    drawRect(goal.x + goal.width * 0.7, goal.y - goal.height * 0.2, goal.width * 0.2, goal.height * 0.2, Z_RED); // Turret 2
    drawRect(goal.x + goal.width * 0.4, goal.y + goal.height * 0.5, goal.width * 0.2, goal.height * 0.5, Z_BLUE); // Door
}


// --- Game Logic ---

function updateHUD() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

function loseLife() {
	hitAudio.play();
    lives--;
    updateHUD();
    if (lives <= 0) {
        gameOver();
    } else {
        // Reset player position slightly (e.g., back to start of level or checkpoint)
        player.x = 50;
        player.y = GAME_HEIGHT - TILE_SIZE * 3;
        player.vx = 0;
        player.vy = 0;
        // Make invulnerable immediately after losing life
        player.isInvulnerable = true;
        player.invulnerabilityTimer = INVULNERABILITY_DURATION;
    }
}

function displayMessage(text) {
    messageElement.innerHTML = text;
    messageElement.style.display = 'block';
}

function gameOver() {
    deathAudio.play();
    gameActive = false;
    displayMessage("<strong>GAME OVER!</strong> <br> Press R to Restart");
}

function winGame() {
 	winAudio.play();
    gameActive = false;
    displayMessage("YOU REACHED THE CASTLE!<br> <strong> CONGRATULATIONS! </strong> <br> Press R to Restart");
}

function restartGame() {
    setupLevel(); // Re-initialize everything
}

// --- Game Loop ---
function gameLoop(timestamp) {
    if (!gameActive) {
    
    	
    
        // Allow restart even when game is not active
        if (keys['KeyR']) {
            restartGame();
        }
        requestAnimationFrame(gameLoop); // Keep listening for restart
        return;
    }

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // --- Draw ---
    ctx.fillStyle = Z_BLACK; // Use ZX Black for background clearing
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawStarfield(); // Draw the starfield
    drawPlatforms();
    drawCollectables();
    drawEnemies();
    drawGoal();
    drawPlayer(); // Draw player last so it's on top

    // --- Update ---
    updateStarfield(); // Update starfield positions

    updatePlayer(deltaTime || 0); // Use 0 delta for the first frame
    updatePlatforms(deltaTime || 0);
    updateEnemies(deltaTime || 0);


    // Request next frame
    requestAnimationFrame(gameLoop);
}





// --- Start Game ---


loading(); // loading screen

// wait for a key press
document.addEventListener('keydown', startGameOnce, { once: true });

function startGameOnce() {
    audio.play().catch(err => console.warn("Autoplay prevented:", err));
    audio.volume = 0.2;
    jumpAudio.volume = 0.4;

    setupLevel();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

/*
setupLevel();
lastTime = performance.now(); // Initialize lastTime before the first loop
requestAnimationFrame(gameLoop); */


