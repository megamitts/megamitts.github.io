// --- Configuration ---
const numPoints = 1500;
const handSize = 150;
const cubeSize = 180;
const starfieldSize = 1000;

// --- Animation Timing (in milliseconds) ---
const handMoveDuration = 4000;
const morphToCubeDuration = 4000;
const cubeSpinDuration = 15000;
const explodeDuration = 30000;

// --- State Variables ---
let currentState = 'HAND_MOVE';
let stateStartTime = 0;

// --- Shape Data ---
let initialHandPoints = [];
let targetCubePoints = [];
let targetStarPoints = [];

// --- Animation Variables ---
let zOffset = 0;
let cubeSpinAngle = 0;
let lastCubeSpinX = 0;
let lastCubeSpinY = 0;
let lastCubeSpinZ = 0;

// ============================================================
//  UPDATED SETUP FUNCTION - START (dist() fix)
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // orbitControl();

  // --- Define Hand Proportions ---
  let palmWidth = handSize * 0.6;
  let palmHeight = handSize * 0.7;
  let palmDepth = handSize * 0.3;

  let fingerLength = handSize * 0.8;
  let fingerLengthFactors = [0.75, 0.9, 0.8, 0.65];
  let fingerWidth = handSize * 0.18;
  let fingerDepth = handSize * 0.18;

  let thumbBaseAngle = PI * 2.6;
  let thumbLength = handSize * 0.6;
  let thumbWidth = handSize * 0.22;
  let thumbDepth = handSize * 0.22;

  // --- Point Allocation ---
  let pointsPerPalm = floor(numPoints * 0.4);
  let pointsPerFinger = floor(numPoints * 0.11);
  let pointsPerThumb = floor(numPoints * 0.16);

  // --- Generate Hand Points ---
  initialHandPoints = [];

  // 1. Palm Points
  for (let i = 0; i < pointsPerPalm; i++) {
    let x = random(-palmWidth / 2, palmWidth / 2);
    let y = random(-palmHeight / 2, palmHeight / 2);
    let z = random(-palmDepth / 2, palmDepth / 2);
    // *** FIXED dist() call: Use 4 arguments for 2D distance ***
    let bulge = (1 - pow(dist(x, y, 0, 0) / (handSize * 0.6), 2)) * palmDepth * 0.4;
    z += random(-bulge, bulge);
    initialHandPoints.push(createVector(x, y, z));
  }

  // 2. Finger Points (f=3: Pinkie, f=2: Ring, f=1: Middle, f=0: Index)
  let fingerBaseY = palmHeight / 2;
  let fingerSpacing = palmWidth / 4;
  let fingerStartX = -palmWidth / 2 + fingerSpacing / 2;

  for (let f = 0; f < 4; f++) {
    let baseX = fingerStartX + f * fingerSpacing;
    let currentFingerLength = fingerLength * fingerLengthFactors[f];

    for (let i = 0; i < pointsPerFinger; i++) {
      let x = baseX + random(-fingerWidth / 2, fingerWidth / 2) * 0.8;
      let yPosInFinger = random(currentFingerLength);
      let y = fingerBaseY + yPosInFinger;
      let z = random(-fingerDepth / 2, fingerDepth / 2);
      let taper = 1.0 - (yPosInFinger / currentFingerLength) * 0.4;
      x = baseX + (x - baseX) * taper;
      z *= taper;
      initialHandPoints.push(createVector(x, y, z));
    }
  }

  // 3. Thumb Points
  let thumbBaseX = -palmWidth / 2 - thumbWidth * 0.05;
  let thumbBaseY = -palmHeight * 0.15;

  for (let i = 0; i < pointsPerThumb; i++) {
    let progress = random(1);
    let lengthOffset = progress * thumbLength;
    let currentWidth = thumbWidth * (1.0 - progress * 0.3);
    let currentDepth = thumbDepth * (1.0 - progress * 0.3);
    let angle = thumbBaseAngle;
    let xOff = cos(angle) * lengthOffset;
    let yOff = sin(angle) * lengthOffset;
    let perpAngle = angle + PI / 2;
    let perpSpread = random(-currentWidth / 2, currentWidth / 2);
    xOff += cos(perpAngle) * perpSpread;
    yOff += sin(perpAngle) * perpSpread;
    let x = thumbBaseX + xOff;
    let y = thumbBaseY + yOff;
    let z = random(-currentDepth / 2, currentDepth / 2);
    initialHandPoints.push(createVector(x, y, z));
  }

  // Ensure exact point count
   while (initialHandPoints.length < numPoints) {
       let p = initialHandPoints[floor(random(initialHandPoints.length))].copy();
       p.add(p5.Vector.random3D().mult(5));
       initialHandPoints.push(p);
   }
   initialHandPoints = initialHandPoints.slice(0, numPoints);

  // --- Generate Target Cube Points ---
  targetCubePoints = [];
  let halfCubeSize = cubeSize / 2;
  for (let i = 0; i < numPoints; i++) {
      let p = createVector();
      let face = floor(random(6));
      let u = random(-halfCubeSize, halfCubeSize);
      let v = random(-halfCubeSize, halfCubeSize);
      if (face === 0) p.set(u, v, halfCubeSize); else if (face === 1) p.set(u, v, -halfCubeSize);
      else if (face === 2) p.set(halfCubeSize, u, v); else if (face === 3) p.set(-halfCubeSize, u, v);
      else if (face === 4) p.set(u, halfCubeSize, v); else p.set(u, -halfCubeSize, v);
      targetCubePoints.push(p);
  }

  // --- Generate Target Star Points ---
   targetStarPoints = [];
  for (let i = 0; i < numPoints; i++) {
    let p = p5.Vector.random3D();
    p.mult(random(cubeSize * 0.8, starfieldSize));
    targetStarPoints.push(p);
  }

  // Initialize state timer
  stateStartTime = millis();
}
// ============================================================
//  UPDATED SETUP FUNCTION - END
// ============================================================


// ============================================================
//  UPDATED DRAW FUNCTION - START (Fix Morph->Spin Jolt)
// ============================================================
function draw() {
  background(0);
  ambientLight(100);
  pointLight(255, 255, 255, 0, -200, 400);

  let currentMillis = millis();
  let timeInState = currentMillis - stateStartTime;

  switch (currentState) {
    case 'HAND_MOVE':
      zOffset = sin(TWO_PI * timeInState / handMoveDuration) * (handSize * 1.5);
      push();
      translate(0, 0, zOffset);
      // Base orientation for hand/morph
      rotateY(PI);
      rotateX(-0.2);
      rotateZ(0.1);
      translate(0, -handSize * 0.4, 0);
      drawShape(initialHandPoints, initialHandPoints, 0);
      pop();

      if (timeInState > handMoveDuration * 1.5) {
        setState('MORPHING_TO_CUBE');
      }
      break;

    case 'MORPHING_TO_CUBE':
      let morphProgress = constrain(timeInState / morphToCubeDuration, 0, 1);
      let easedMorphProgress = easeInOutQuad(morphProgress);

      push();
      // Apply same base orientation as hand
      rotateY(PI);
      rotateX(-0.2);
      rotateZ(0.1);
      translate(0, -handSize * 0.4, 0);
      // Interpolate Z offset smoothly to 0
      let startZ = sin(TWO_PI * (stateStartTime - morphProgress * handMoveDuration * 1.5) / handMoveDuration) * (handSize * 1.5);
      let currentZOffset = lerp(startZ, 0, easedMorphProgress);
      translate(0, 0, currentZOffset); // Apply Z offset after base translation
      drawShape(initialHandPoints, targetCubePoints, easedMorphProgress);
      pop();

      if (morphProgress >= 1.0) {
          cubeSpinAngle = 0; // Reset spin angle for the start of the cube phase
          setState('CUBE_SPIN');
      }
      break;

    case 'CUBE_SPIN':
      cubeSpinAngle += 0.015;
      push();

      // *** FIX: Apply the SAME base transformations as the morph state ***
      // This ensures continuity.
      rotateY(PI);
      rotateX(-0.2);
      rotateZ(0.1);
      translate(0, -handSize * 0.4, 0);

      // Now apply the spinning rotations *relative* to this base orientation
      let currentSpinY = cubeSpinAngle * 1.5;
      let currentSpinX = cubeSpinAngle * 0.8;
      let currentSpinZ = cubeSpinAngle * 0.5;
      rotateY(currentSpinY);
      rotateX(currentSpinX);
      rotateZ(currentSpinZ);

      // Draw the cube (its points are already centered around 0,0,0)
      drawShape(targetCubePoints, targetCubePoints, 0);
      pop();

      // Store the final *total* rotation relative to world axes for the explosion
      // We need to consider both base rotation and spin rotation.
      // However, for simplicity in the explosion lerp, let's just store the *additional*
      // spin relative to the base orientation. The explosion will lerp rotations from
      // (base + last_spin) to (base + 0).
      // Note: Directly storing angles and lerping them isn't perfect for complex 3D rotations,
      // but it's often good enough for visual effects like this.
      // Let's adjust the explosion logic slightly based on this.
      lastCubeSpinY = currentSpinY; // Store the *spin* component only
      lastCubeSpinX = currentSpinX;
      lastCubeSpinZ = currentSpinZ;


      if (timeInState > cubeSpinDuration) {
        setState('EXPLODING');
      }
      break;

    case 'EXPLODING':
      let explodeProgress = constrain(timeInState / explodeDuration, 0, 1);
      let easedExplodeProgress = easeInOutQuad(explodeProgress);

      push();
      // Apply the base orientation first
      rotateY(PI);
      rotateX(-0.2);
      rotateZ(0.1);
      translate(0, -handSize * 0.4, 0);

      // Now, lerp the *additional* spin rotation (from CUBE_SPIN) down to zero
      let targetSpinY = 0; // Target final spin component
      let targetSpinX = 0;
      let targetSpinZ = 0;

      let currentSpinY_exp = lerp(lastCubeSpinY, targetSpinY, easedExplodeProgress);
      let currentSpinX_exp = lerp(lastCubeSpinX, targetSpinX, easedExplodeProgress);
      let currentSpinZ_exp = lerp(lastCubeSpinZ, targetSpinZ, easedExplodeProgress);

      // Apply the interpolated spin rotation
      rotateY(currentSpinY_exp);
      rotateX(currentSpinX_exp);
      rotateZ(currentSpinZ_exp);

      // Draw the shape exploding from cube points to star points
      drawShape(targetCubePoints, targetStarPoints, easedExplodeProgress);
      pop();

      if (explodeProgress >= 1) {
        setState('STARFIELD');
      }
      break;

    case 'STARFIELD':
       push();
       // Apply the final base orientation
       rotateY(PI);
       rotateX(-0.2);
       rotateZ(0.1);
       translate(0, -handSize * 0.4, 0);
       // The additional spin (currentSpinY/X/Z_exp) has lerped to 0 here.
       // No need for extra rotations if targetSpin was 0.
       drawShape(targetStarPoints, targetStarPoints, 0);
       pop();
      break;
  }
}
// ============================================================
//  UPDATED DRAW FUNCTION - END
// ============================================================

// --- Helper Functions (No changes needed) ---

function setState(newState) {
  currentState = newState;
  stateStartTime = millis();
  console.log("Entering state:", newState);
}

function drawShape(startPoints, endPoints, lerpAmt) {
  stroke(255);
  strokeWeight(3);
  beginShape(POINTS);
  for (let i = 0; i < numPoints; i++) {
    if (startPoints[i] && endPoints[i]) {
      let currentPos = p5.Vector.lerp(startPoints[i], endPoints[i], lerpAmt);
      vertex(currentPos.x, currentPos.y, currentPos.z);
    }
  }
  endShape();
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}