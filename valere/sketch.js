

let sourceImg; // The p5.Image object for the puzzle
let music; // The p5.SoundFile object for the background music
let tileSlide; // The p5.SoundFile object for the tile slide sound
let tiles = [];
let board = []; // Stores originalIndex of tiles on the board

const GRID_SIZE = 3;
let tileWidth, tileHeight;
let emptySlotIndex; // Index in the board array that is empty

let gameState = 'loading'; // 'loading', 'initializing', 'playing', 'won', 'error'
let p5Canvas;

const IMAGE_FILENAME = 'pic.jfif'; // Define the filename here for consistency

let musicHasStarted = false; // Flag to track if background music has started

function preload() {
    music = loadSound('battleground_remastered_doge.mp3', 
        () => {
            console.log("Background music loaded successfully.");
        },
        (err) => { // Error callback
            console.error("Failed to load background music:", err);
            // Optionally, handle music loading failure (e.g., disable music features)
        }
    );

    tileSlide = loadSound('slide.flac', 
        () => {
            console.log("Tile slide loaded successfully.");
        },
        (err) => { // Error callback
            console.error("Failed to load tile slide sound:", err);
        }
    );

    sourceImg = loadImage(IMAGE_FILENAME,
        () => {
            console.log("Image loaded successfully. Original Dims:", sourceImg.width, "x", sourceImg.height);
            gameState = 'initializing'; // Image is loaded, ready for setup processing
        },
        (err) => {
            console.error(`Failed to load image '${IMAGE_FILENAME}':`, err); // Use template literal
            gameState = 'error';
        }
    );
}

function setup() {
    const canvasContainer = document.getElementById('canvas-container');
    const refImgElement = document.getElementById('reference-image');

    if (gameState === 'error') {
        // Use IMAGE_FILENAME in the error message
        canvasContainer.innerHTML = `<div style="width:300px; height:100px; background:darkred; color:white; display:flex; justify-content:center; align-items:center; text-align:center; padding:10px; border: 2px solid white; border-radius: 5px;">Error: Could not load '${IMAGE_FILENAME}'.<br>Please check file name and path.</div>`;
        if (refImgElement) refImgElement.style.display = 'none';
        const resetButton = document.getElementById('reset-button');
        if (resetButton) resetButton.style.display = 'none'; // Hide button if game can't load
        noLoop();
        return;
    }

    if (gameState === 'loading' || !sourceImg || !sourceImg.width || !sourceImg.height) {
        canvasContainer.innerHTML = `<div style="width:300px; height:100px; background:grey; color:white; display:flex; justify-content:center; align-items:center; border: 2px solid white; border-radius: 5px;">Image loading or not ready...</div>`;
        if (refImgElement) refImgElement.style.display = 'none';
        const resetButton = document.getElementById('reset-button');
        if (resetButton) resetButton.style.display = 'none'; // Hide button during loading
        return;
    }

    const MAX_PUZZLE_DIM = 600;
    if (sourceImg.width > MAX_PUZZLE_DIM || sourceImg.height > MAX_PUZZLE_DIM) {
        if (sourceImg.width > sourceImg.height) {
            sourceImg.resize(MAX_PUZZLE_DIM, 0);
        } else {
            sourceImg.resize(0, MAX_PUZZLE_DIM);
        }
        console.log("Resized sourceImg for puzzle to:", sourceImg.width, "x", sourceImg.height);
    }

    p5Canvas = createCanvas(sourceImg.width, sourceImg.height);
    if (canvasContainer) {
        p5Canvas.parent(canvasContainer);
    } else {
        console.error("CRITICAL: #canvas-container div not found. Cannot attach p5 canvas.");
        noLoop(); return;
    }


    tileWidth = p5Canvas.width / GRID_SIZE;
    tileHeight = p5Canvas.height / GRID_SIZE;

    initializeTilesAndBoard();
    shuffleBoard();

    if (refImgElement) {
        refImgElement.src = sourceImg.canvas.toDataURL();
        refImgElement.width = sourceImg.width / 2;
        refImgElement.height = sourceImg.height / 2;
        refImgElement.style.display = 'block';
    } else {
        console.error("Reference image element '#reference-image' not found.");
    }

    // --- Setup Reset Button ---
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
        resetButton.style.display = 'inline-block'; // Ensure it's visible
    } else {
        console.warn("Reset button '#reset-button' not found.");
    }

    gameState = 'playing';
    console.log("Setup complete. Game state: playing. Puzzle Canvas:", p5Canvas.width, "x", p5Canvas.height);
    loop(); // Ensure drawing loop is active
}

function initializeTilesAndBoard() {
    tiles = []; // Clear existing tiles if any (important for a full re-init if called again)
    board = [];
    let index = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            let x = c * tileWidth;
            let y = r * tileHeight;

            if (index < GRID_SIZE * GRID_SIZE - 1) {
                let tileImg = sourceImg.get(x, y, tileWidth, tileHeight);
                tiles.push({ img: tileImg, originalIndex: index });
                board.push(index); // Store original index
            } else {
                board.push(null); // Represents the empty slot
                emptySlotIndex = index;
            }
            index++;
        }
    }
    console.log("Tiles and board initialized. Empty slot at:", emptySlotIndex);
}

function shuffleBoard() {
    // Make sure emptySlotIndex is valid before shuffling (it should be if board is initialized)
    if (typeof emptySlotIndex === 'undefined' || board[emptySlotIndex] !== null) {
        console.error("Cannot shuffle: emptySlotIndex is not defined or points to a non-empty slot.");
        // Attempt to find or set a valid empty slot (last position as default)
        emptySlotIndex = board.indexOf(null);
        if (emptySlotIndex === -1) { // Should not happen if board is correctly initialized
            emptySlotIndex = GRID_SIZE * GRID_SIZE -1;
            board[emptySlotIndex] = null; // Force last slot to be empty
             console.warn("Forced last slot to be empty for shuffling.");
        }
    }

    let shuffles = GRID_SIZE * GRID_SIZE * 15; // Increased shuffles slightly
    for (let i = 0; i < shuffles; i++) {
        let neighbors = getValidMoveNeighbors(emptySlotIndex);
        if (neighbors.length > 0) {
            let randomNeighborIndex = random(neighbors);
            swapTiles(emptySlotIndex, randomNeighborIndex);
            emptySlotIndex = randomNeighborIndex; // Update empty slot
        }
    }
    console.log("Board shuffled. Empty slot at:", emptySlotIndex);
}

function resetGame() {
    console.log("Resetting game...");

    // Stop music and reset the flag so it can start again on the next interaction
    // if (music && music.isLoaded()) { // Check if music object exists and is loaded
    //     music.stop();
    //     console.log("Background music stopped for reset.");
    // }
    //musicHasStarted = false; // Reset the flag

    // 1. Re-initialize the board to the solved state
    // We don't need to recreate 'tiles' array, only 'board' and 'emptySlotIndex'
    board = [];
    let currentIndex = 0;
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        if (currentIndex < GRID_SIZE * GRID_SIZE - 1) {
            board.push(currentIndex); // Original index of the tile
        } else {
            board.push(null); // Empty slot
            emptySlotIndex = currentIndex; // Set the empty slot index for the solved state
        }
        currentIndex++;
    }
    console.log("Board reset to solved state. Empty slot at:", emptySlotIndex);

    // 2. Shuffle the board
    shuffleBoard();

    // 3. Set game state
    gameState = 'playing';

    // 4. Ensure p5.js drawing loop is active (in case it was stopped on win)
    if (p5Canvas) { // Check if canvas exists
       loop();
    }
    console.log("Game reset. State: playing.");
}


function getValidMoveNeighbors(index) {
    let neighbors = [];
    let r = floor(index / GRID_SIZE);
    let c = index % GRID_SIZE;

    if (r > 0) neighbors.push(index - GRID_SIZE); // Up
    if (r < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE); // Down
    if (c > 0) neighbors.push(index - 1); // Left
    if (c < GRID_SIZE - 1) neighbors.push(index + 1); // Right
    return neighbors;
}

function swapTiles(idx1, idx2) {
    let temp = board[idx1];
    board[idx1] = board[idx2];
    board[idx2] = temp;
}

function draw() {
    if (!p5Canvas) return; // Don't draw if canvas isn't ready

    if (gameState === 'loading' || gameState === 'initializing') {
        background(50); fill(255); textAlign(CENTER, CENTER);
        textSize(min(width/15, 20)); text("Initializing puzzle...", width / 2, height / 2);
        return;
    }
    if (gameState === 'error') {
        // Error message is in HTML, p5 canvas might not even be fully usable
        // If canvas exists, can show a simple message
        background(100,0,0); fill(255); textAlign(CENTER,CENTER);
        textSize(min(width/10, 20)); text("Error loading game.", width/2, height/2);
        return;
    }
    
    background(30);

    for (let i = 0; i < board.length; i++) {
        let currentBoardPosOriginalIndex = board[i];
        let r = floor(i / GRID_SIZE);
        let c = i % GRID_SIZE;

        if (currentBoardPosOriginalIndex !== null) {
            // Ensure tiles array is populated and index is valid
            if(tiles && tiles[currentBoardPosOriginalIndex] && tiles[currentBoardPosOriginalIndex].img) {
                image(tiles[currentBoardPosOriginalIndex].img, c * tileWidth, r * tileHeight, tileWidth, tileHeight);
                stroke(200, 200, 200, 80);
                noFill();
                rect(c * tileWidth, r * tileHeight, tileWidth, tileHeight);
            } else {
                // Fallback for missing tile data (should not happen in normal flow)
                fill(100); noStroke();
                rect(c * tileWidth, r * tileHeight, tileWidth, tileHeight);
                fill(255); textSize(10); textAlign(CENTER,CENTER);
                text('?', c * tileWidth + tileWidth/2, r * tileHeight + tileHeight/2);
            }
        } else {
            noStroke();
            fill(50, 50, 60);
            rect(c * tileWidth, r * tileHeight, tileWidth, tileHeight);
        }
    }

    if (gameState === 'won') {
        fill(46, 204, 113, 230);
        rect(0, 0, width, height);
        fill(255);
        let winTextSize = min(width / 7, height / 7, 55);
        textSize(32);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        text("FOR MANETHEREN!", width / 2, height / 2 - winTextSize * 0.1);

        textSize(winTextSize * 0.4);
        textStyle(NORMAL);
        text("Refresh or Reset to play again", width / 2, height / 2 + winTextSize * 0.6);
        // Consider noLoop(); here if you want to freeze the win screen
        // noLoop();
    }
}

function mousePressed() {
    if (gameState !== 'playing' || !p5Canvas) return;
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    let c = floor(mouseX / tileWidth);
    let r = floor(mouseY / tileHeight);

    if (c < 0 || c >= GRID_SIZE || r < 0 || r >= GRID_SIZE) return;

    let clickedIndex = r * GRID_SIZE + c;
    let emptyR = floor(emptySlotIndex / GRID_SIZE);
    let emptyC = emptySlotIndex % GRID_SIZE;

    let isAdjacent = (r === emptyR && abs(c - emptyC) === 1) || (c === emptyC && abs(r - emptyR) === 1);

    if (isAdjacent) {
        // Start background music on the first successful tile move
        if (music && music.isLoaded() && !musicHasStarted) {
            music.loop();
            musicHasStarted = true;
            console.log("Background music loop started.");
        }
         
        // Play tile slide sound
        if (tileSlide && tileSlide.isLoaded()) { // Check if tileSlide is loaded
            tileSlide.play(); 
        } else if (tileSlide) {
            console.warn("Tile slide sound not loaded yet, cannot play.");
        } // else: tileSlide object doesn't exist, logged in preload error
        
        swapTiles(clickedIndex, emptySlotIndex);
        emptySlotIndex = clickedIndex;
        checkWinCondition();
    }
}

function checkWinCondition() {
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i] === null || board[i] !== i) {
            return false;
        }
    }
    if (board[GRID_SIZE * GRID_SIZE - 1] === null) {
        gameState = 'won';
        console.log("Puzzle Solved!");
        // If you want to stop draw() from running after win, uncomment:
        // noLoop();
        // If you want music to stop on win:
        // if (music && music.isLoaded()) { music.stop(); }
        // musicHasStarted = false; // if you want it to restart on next game
    }
    return true;
}
