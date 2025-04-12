// Global variables
let currentObject = null; // Can be 'cube', 'pyramid', 'star', or null
let rotX = 0;
let rotY = 0;
let offsetX = 0;
let offsetY = 0;
let objectSize = 100; // Base size for the objects

// Variables for dragging
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
  // Remember WEBGL Y increases downwards on screen but is negative upwards in 3D space
  // And (0,0) is the center of the canvas
  boundaryTopWEBGL = -(height / 2) + boundaryMarginTop; // Top edge in WEBGL Y-coordinates
  boundaryBottomWEBGL = height / 2;                     // Bottom edge in WEBGL Y-coordinates
  boundaryLeftWEBGL = -width / 2;                       // Left edge in WEBGL X-coordinates
  boundaryRightWEBGL = width / 2;                      // Right edge in WEBGL X-coordinates

  // --- Create Buttons ---
  let buttonY = 25; // Position from top of the window

  let cubeButton = createButton('Cube');
  cubeButton.position(20, buttonY); // Position relative to window
  cubeButton.mousePressed(() => {
    currentObject = 'cube';
    resetObjectState();
  });

  let pyramidButton = createButton('Pyramid');
  pyramidButton.position(cubeButton.x + cubeButton.width + 20, buttonY);
  pyramidButton.mousePressed(() => {
    currentObject = 'pyramid';
    resetObjectState();
  });

  let starButton = createButton('Star');
  starButton.position(pyramidButton.x + pyramidButton.width + 20, buttonY);
  starButton.mousePressed(() => {
    currentObject = 'star';
    resetObjectState();
  });

  // --- Style for Wireframes ---
  noFill();        // No fill color
  stroke(255);     // White stroke color
  strokeWeight(1.5); // Slightly thicker lines for visibility
}

function draw() {
  background(50); // Dark background

  // Optional: Draw visual boundary for debugging (adjust Z if needed)
  /*
  push();
  stroke(100, 100, 100, 150); // Semi-transparent grey
  strokeWeight(1);
  noFill();
  translate(0, 0, -objectSize); // Move slightly behind objects
  // rect uses top-left corner and width/height
  rect(boundaryLeftWEBGL, boundaryTopWEBGL, boundaryRightWEBGL - boundaryLeftWEBGL, boundaryBottomWEBGL - boundaryTopWEBGL);
  pop();
  */


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

  } else {
     // Placeholder text is difficult in WEBGL.
     // Could add a DOM element or use createGraphics for a 2D overlay.
  }
}

// --- Object Drawing Functions --- (Unchanged)

function drawCube() {
  box(objectSize);
}

function drawPyramid() {
  let h = objectSize * 1.2; // Height
  let base = objectSize;    // Base width/depth

  beginShape(TRIANGLES);

  // Base vertices
  let v1 = createVector(-base / 2, base / 2, -base / 2); // Front left
  let v2 = createVector(base / 2, base / 2, -base / 2);  // Front right
  let v3 = createVector(base / 2, base / 2, base / 2);   // Back right
  let v4 = createVector(-base / 2, base / 2, base / 2);  // Back left
  // Apex vertex
  let apex = createVector(0, -h / 2, 0);

  // Sides
  vertex(apex.x, apex.y, apex.z); vertex(v1.x, v1.y, v1.z); vertex(v2.x, v2.y, v2.z);
  vertex(apex.x, apex.y, apex.z); vertex(v2.x, v2.y, v2.z); vertex(v3.x, v3.y, v3.z);
  vertex(apex.x, apex.y, apex.z); vertex(v3.x, v3.y, v3.z); vertex(v4.x, v4.y, v4.z);
  vertex(apex.x, apex.y, apex.z); vertex(v4.x, v4.y, v4.z); vertex(v1.x, v1.y, v1.z);
  // Base (two triangles)
  vertex(v1.x, v1.y, v1.z); vertex(v3.x, v3.y, v3.z); vertex(v2.x, v2.y, v2.z);
  vertex(v1.x, v1.y, v1.z); vertex(v4.x, v4.y, v4.z); vertex(v3.x, v3.y, v3.z);

  endShape();
}

function drawStar() {
  let radius1 = objectSize / 2; let radius2 = objectSize / 4;
  let npoints = 5; let depth = objectSize / 5;

  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < npoints * 2 + 1; i++) {
    let angle = map(i, 0, npoints * 2, 0, TWO_PI);
    let r = (i % 2 === 0) ? radius1 : radius2;
    let x = cos(angle) * r; let y = sin(angle) * r;
    vertex(x, y, depth / 2); vertex(x, y, -depth / 2);
  }
  endShape();

  beginShape(TRIANGLES);
  for (let i = 0; i < npoints * 2; i++) {
      let angle1 = map(i, 0, npoints * 2, 0, TWO_PI);
      let r1 = (i % 2 === 0) ? radius1 : radius2;
      let x1 = cos(angle1) * r1; let y1 = sin(angle1) * r1;
      let angle2 = map(i + 1, 0, npoints * 2, 0, TWO_PI);
      let r2 = ((i + 1) % 2 === 0) ? radius1 : radius2;
      let x2 = cos(angle2) * r2; let y2 = sin(angle2) * r2;
      vertex(x1, y1, depth / 2); vertex(x2, y2, depth / 2); vertex(x1, y1, -depth / 2);
      vertex(x2, y2, depth / 2); vertex(x2, y2, -depth / 2); vertex(x1, y1, -depth / 2);
  }
  endShape();
}


// --- Mouse Interaction ---

function mousePressed() {
  // Check if the click is within the defined drawing area *below the buttons*
  // Convert mouse Y to compare with boundaryMarginTop easily
  if (currentObject &&
      mouseX > 0 && mouseX < width &&            // Check horizontal canvas bounds
      mouseY > boundaryMarginTop && mouseY < height) // Check vertical below buttons
     {
       // Optional: Add a check here to see if the click is "close enough"
       // to the object's current (offsetX, offsetY) to initiate dragging.
       // This prevents starting a drag from far away within the boundary.
       // let distance = dist(mouseX - width/2, mouseY - height/2, offsetX, offsetY);
       // if (distance < objectSize) { // Or some other tolerance

          isDragging = true;
          dragStartX = mouseX;
          dragStartY = mouseY;
          initialOffsetX = offsetX;
          initialOffsetY = offsetY;

       // } // End optional distance check
  }
}

function mouseDragged() {
  if (isDragging) {
    // Calculate the difference from the start drag position
    let dx = mouseX - dragStartX;
    let dy = mouseY - dragStartY;

    // Calculate potential new center position
    let targetX = initialOffsetX + dx;
    let targetY = initialOffsetY + dy;

    // Define limits considering object size to keep the *entire* object inside
    // Use an approximate half-size. For more precision, you could calculate
    // the bounding box of the specific rotated object.
    let halfSize = objectSize * 0.7; // A slightly larger buffer might be safer visually

    // Apply constraints using the pre-calculated WEBGL boundaries
    offsetX = constrain(targetX, boundaryLeftWEBGL + halfSize, boundaryRightWEBGL - halfSize);
    offsetY = constrain(targetY, boundaryTopWEBGL + halfSize, boundaryBottomWEBGL - halfSize);
  }
}

function mouseReleased() {
  isDragging = false;
}

// --- Utility Functions ---

function resetObjectState() {
  // Place the object roughly in the center of the allowed drawing area
  offsetX = 0; // Horizontal center of canvas is usually fine
  // Calculate vertical center of the defined boundary area
  offsetY = (boundaryTopWEBGL + boundaryBottomWEBGL) / 2;

  rotX = 0;
  rotY = 0;
  isDragging = false; // Ensure dragging stops if button clicked mid-drag
}