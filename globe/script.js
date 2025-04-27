import * as THREE from 'three';

// --- Configuration ---
const EARTH_RADIUS = 1; // Use relative units
const ROTATION_SPEED_FACTOR = 3600; // 1 Earth hour (3600s) in 10s -> 3600/10 = 360x speed
const CAMERA_DISTANCE = 3.5; // How far the camera is from the Earth's center

let orbitRadius = CAMERA_DISTANCE; // Same as your starting camera distance
let orbitSpeed = 1; //0.2; // How fast to orbit (radians per second)
let orbitAngle = 0; // Start angle


// --- Setup Scene, Camera, Renderer ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // Field of view  // the smaller the number, the more zoomed in
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
const canvas = document.getElementById('earth-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true // Smoother edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high-DPI screens

// --- Texture Loading ---
const textureLoader = new THREE.TextureLoader();
// Using a readily available texture from Three.js examples for simplicity
// Replace with your preferred high-res texture if desired
//const earthTexture = textureLoader.load('orange.jpg');
const earthTexture = textureLoader.load('earth_atmos_2048.jpg');
//Optional: Add bump map for terrain detail
//const bumpTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_topology_512.jpg'); // Lower res for bump is often fine
// Optional: Add specular map for water reflection
//const specularTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');

const starTexture = textureLoader.load('1.png');

const starGeometry = new THREE.SphereGeometry(90, 64, 64); // make a sphere big enough to encompass the earth sphere
const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide  // add texture to the inside of the new sphere
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);



// --- Earth Geometry and Material ---
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 32); // Segments for smoothness
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    //bumpMap: bumpTexture, // Assign bump map
    //bumpScale: 0.01,      // Adjust bump intensity (subtle)
    // metalnessMap: specularTexture, // Use metalnessMap for specularity in StandardMaterial
    // metalness: 0.4, // Adjust how metallic water appears
    //roughnessMap: specularTexture, // Often specular maps work better as roughness maps inverted
    roughness: 0.8,         // Base roughness
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);
earthMesh.position.set(0, 0, 0); // x=2 (right), y=1 (up), z=0 (no forward/back) // position the globe manually
earthMesh.rotation.z = 23.5 * Math.PI / 180;


// --- Lighting ---
// Ambient light to softly illuminate the entire scene
const ambientLight = new THREE.AmbientLight(0xafdbf5, 0.2); // Soft white light
scene.add(ambientLight);

// Directional light to simulate the Sun
const sunLight = new THREE.DirectionalLight(0xafdbf5, 5); // Bright white light
sunLight.position.set(5, 3, 5); // Position the light source
scene.add(sunLight);

// --- Camera Position ---
// Position the camera along the Z-axis, looking at the origin

camera.position.set(0,0,CAMERA_DISTANCE);

//camera.position.z = CAMERA_DISTANCE;
//camera.lookAt(scene.position); // Ensure camera points to the center (0,0,0)
camera.lookAt(earthMesh.position);



// --- Rotation Calculation ---
// Earth completes one rotation (2 * PI radians) in 24 hours (86400 seconds)
const baseRotationSpeed = (2 * Math.PI) / 86400; // Radians per second (real time)
const acceleratedRotationSpeed = baseRotationSpeed * ROTATION_SPEED_FACTOR; // Radians per second (accelerated)

// --- Animation Loop ---
const clock = new THREE.Clock(); // Clock to track time delta

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Rotate Earth around Y-axis
    earthMesh.rotation.y += acceleratedRotationSpeed * delta;
    

    // Orbit camera around Earth
    orbitAngle += orbitSpeed * delta;
    camera.position.x = orbitRadius * Math.cos(orbitAngle);
    camera.position.z = orbitRadius * Math.sin(orbitAngle);
    camera.lookAt(earthMesh.position); // Always look at Earth

    renderer.render(scene, camera);
}


// --- Handle Window Resizing ---
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Adjust for potential DPI change
});

// --- Start Animation ---
animate();
