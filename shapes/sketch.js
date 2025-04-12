// Global variables
let currentObject = null; // Can be 'cube', 'pyramid', 'star', or null
let rotX = 0;
let rotY = 0;
let offsetX = 0;
let offsetY = 0;
let objectSize = 100; // Base size for the objects

// Variables for dragging (shared between mouse and touch)
let isDragging = false;
let dragStartX, dragStartY;
let initialOffsetX, initialOffsetY;

// Define boundary parameters
let boundaryMarginTop = 80; // Pixel space from canvas top for buttons + margin
let boundaryTopWEBGL;       // Top boundary in WEBGL Y-coordinates
let boundaryBottomWEBGL;    // Bottom boundary in WEBGL Y-coordinates
let boundaryLeftWEBGL;      // Left boundary in WEBGL X-coordinates
let boundaryRightWEBGL;     // Right boundary in WEBGL X-coordinates

function setup() {
  // Create canvas with WEBGL renderer for 3D
  let cnv = createCanvas(700, 500, WEBGL);
   // Center the canvas if needed (useful for local testing)
  // cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  // Calculate boundaries based on canvas size and margin
  boundaryTopWEBGL = -(height / 2) + boundaryMarginTop; // Top edge in WEBGL Y-coordinates
  boundaryBottomWEBGL = height / 2;                     // Bottom edge in WEBGL Y-coordinates
  boundaryLeftWEBGL = -width / 2;                       // Left edge in WEBGL X-coordinates
  boundaryRightWEBGL = width / 2;                       // Right edge in WEBGL X-coordinates

  // --- Create Buttons ---
  let buttonY = 25; // Position from top of the window

  let cubeButton = createButton('Cube');
  cubeButton.position(20, buttonY); // Position relative to window
  cubeButton.mousePressed(() => {
    currentObject = 'cube';
    resetObjectState();
  });
  // Add touch handler for buttons too (good practice)
  cubeButton.touchStarted((event) => {
      event.preventDefault(); // Prevent potential double-firing or unwanted browser behavior
      currentObject = 'cube';
      resetObjectState();
      return false; // Prevent default touch behavior
  });


  let pyramidButton = createButton('Pyramid');
  pyramidButton.position(cubeButton.x + cubeButton.width + 20, buttonY);
  pyramidButton.mousePressed(() => {
    currentObject = 'pyramid';
    resetObjectState();
  });
  pyramidButton.touchStarted((event) => {
      event.preventDefault();
      currentObject = 'pyramid';
      resetObjectState();
      return false;
  });


  let starButton = createButton('Star');
  starButton.position(pyramidButton.x + pyramidButton.width + 20, buttonY);
  starButton.mousePressed(() => {
    currentObject = 'star';
    resetObjectState();
  });
   starButton.touchStarted((event) => {
      event.preventDefault();
      currentObject = 'star';
      resetObjectState();
      return false;
  });


  // --- Style for Wireframes ---
  noFill();        // No fill color
  stroke(255);     // White stroke color
  strokeWeight(1.5); // Slightly thicker lines for visibility
}

function draw() {
  background(50); // Dark background

  // --- Camera and Lighting ---
  ambientLight(150);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);

  // --- Handle Object Drawing ---
  if (currentObject) {
    push(); // Isolate transformations for the current object

    // Apply constrained dragging offset first
    translate(offsetX, offsetY, 0);

    // Apply rotation
    rotateX(rotX);
    rotateY(rotY);

    // Draw the selected object
    switch (currentObject) {
      case 'cube':
        drawCube();
        break;
      case 'pyramid':
        drawPyramid();
        break;
      case 'star':
        drawStar();
        break;
    }

    pop(); // Restore previous transformation state

    // Increment rotation angles for animation (outside push/pop)
    rotX += 0.01;
    rotY += 0.015;

  }
}

// --- Object Drawing Functions --- (Unchanged)
function drawCube() { box(objectSize); }
function drawPyramid() {
    let h = objectSize * 1.2, base = objectSize;
    beginShape(TRIANGLES);
    let v1 = createVector(-base / 2, base / 2, -base / 2), v2 = createVector(base / 2, base / 2, -base / 2), v3 = createVector(base / 2, base / 2, base / 2), v4 = createVector(-base / 2, base / 2, base / 2);
    let apex = createVector(0, -h / 2, 0);
    vertex(apex.x, apex.y, apex.z); vertex(v1.x, v1.y, v1.z); vertex(v2.x, v2.y, v2.z);
    vertex(apex.x, apex.y, apex.z); vertex(v2.x, v2.y, v2.z); vertex(v3.x, v3.y, v3.z);
    vertex(apex.x, apex.y, apex.z); vertex(v3.x, v3.y, v3.z); vertex(v4.x, v4.y, v4.z);
    vertex(apex.x, apex.y, apex.z); vertex(v4.x, v4.y, v4.z); vertex(v1.x, v1.y, v1.z);
    vertex(v1.x, v1.y, v1.z); vertex(v3.x, v3.y, v3.z); vertex(v2.x, v2.y, v2.z);
    vertex(v1.x, v1.y, v1.z); vertex(v4.x, v4.y, v4.z); vertex(v3.x, v3.y, v3.z);
    endShape();
}
function drawStar() {
    let radius1 = objectSize / 2, radius2 = objectSize / 4, npoints = 5, depth = objectSize / 5;
    beginShape(TRIANGLE_STRIP);
    for (let i = 0; i < npoints * 2 + 1; i++) { let angle = map(i, 0, npoints * 2, 0, TWO_PI), r = (i % 2 === 0) ? radius1 : radius2, x = cos(angle) * r, y = sin(angle) * r; vertex(x, y, depth / 2); vertex(x, y, -depth / 2); }
    endShape();
    beginShape(TRIANGLES);
    for (let i = 0; i < npoints * 2; i++) { let angle1 = map(i, 0, npoints * 2, 0, TWO_PI), r1 = (i % 2 === 0) ? radius1 : radius2, x1 = cos(angle1) * r1, y1 = sin(angle1) * r1; let angle2 = map(i + 1, 0, npoints * 2, 0, TWO_PI), r2 = ((i + 1) % 2 === 0) ? radius1 : radius2, x2 = cos(angle2) * r2, y2 = sin(angle2) * r2; vertex(x1, y1, depth / 2); vertex(x2, y2, depth / 2); vertex(x1, y1, -depth / 2); vertex(x2, y2, depth / 2); vertex(x2, y2, -depth / 2); vertex(x1, y1, -depth / 2); }
    endShape();
}


// --- Mouse Interaction ---

function mousePressed() {
  // Only proceed if no touch is active (prevents potential conflicts)
  if (touches.length > 0) return;

  // Use a shared function to start the drag
  startDragging(mouseX, mouseY);
}

function mouseDragged() {
    // Only proceed if no touch is active
    if (touches.length > 0) return;

    // Use a shared function to update the drag
    updateDragging(mouseX, mouseY);
}

function mouseReleased() {
    // Only proceed if no touch is active
    if (touches.length > 0) return;

    // Use a shared function to end the drag
    endDragging();
}

// --- Touch Interaction ---

function touchStarted() {
  // Check if there's at least one touch point
  if (touches.length > 0) {
    // Use the coordinates of the *first* touch point
    startDragging(touches[0].x, touches[0].y);
    // Prevent default touch behavior like scrolling
    // You might return false directly from touchStarted if needed elsewhere
    // but preventDefault is often sufficient for the drag itself.
    // event.preventDefault(); // (event is implicitly passed)
  }
   return false; // Prevent default browser actions
}

function touchMoved() {
  // Check if there's at least one touch point
  if (touches.length > 0) {
    // Use the coordinates of the *first* touch point
    updateDragging(touches[0].x, touches[0].y);
  }
  // Prevent default touch behavior like scrolling
  return false;
}

function touchEnded() {
  // End dragging regardless of which finger was lifted (simplest approach)
  endDragging();
   return false; // Prevent default browser actions
}

// --- Shared Dragging Logic ---

function startDragging(x, y) {
  // Check if the interaction is within the defined drawing area *below the buttons*
  if (currentObject &&
      x > 0 && x < width &&            // Check horizontal canvas bounds
      y > boundaryMarginTop && y < height) // Check vertical below buttons
     {
          isDragging = true;
          // Store the starting interaction position
          dragStartX = x;
          dragStartY = y;
          // Store the object's current offset when drag starts
          initialOffsetX = offsetX;
          initialOffsetY = offsetY;
  }
}

function updateDragging(x, y) {
  if (isDragging) {
    // Calculate the difference from the start drag position
    let dx = x - dragStartX;
    let dy = y - dragStartY;

    // Calculate potential new center position
    let targetX = initialOffsetX + dx;
    let targetY = initialOffsetY + dy;

    // Define limits considering object size
    let halfSize = objectSize * 0.7; // Approximate buffer

    // Apply constraints using the pre-calculated WEBGL boundaries
    offsetX = constrain(targetX, boundaryLeftWEBGL + halfSize, boundaryRightWEBGL - halfSize);
    offsetY = constrain(targetY, boundaryTopWEBGL + halfSize, boundaryBottomWEBGL - halfSize);
  }
}

function endDragging() {
  isDragging = false;
}


// --- Utility Functions ---

function resetObjectState() {
  // Place the object roughly in the center of the allowed drawing area
  offsetX = 0; // Horizontal center
  offsetY = (boundaryTopWEBGL + boundaryBottomWEBGL) / 2; // Vertical center of boundary

  rotX = 0;
  rotY = 0;
  isDragging = false; // Ensure dragging stops
}
