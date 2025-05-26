let fontImage;
let charWidth = 32;
let charHeight = 32;
let charsPerRow = 10;

let charset = ' !              0123456789     ? ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
//let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?@# ';
let message = '!!!!!WELCOME TO THE DEMOSCENE 2025 — POWERED BY BITMAP FONTS!   ';
let chars = [];
let speed = 2;
let amplitude = 10;
let frequency = 0.05;

function preload() {
  fontImage = loadImage('font.png'); // Adjust name if needed
}

function setup() {
  createCanvas(400, 400);
  noSmooth(); // Keep it crisp and pixel-perfect
  pixelDensity(1);
  for (let i = 0; i < message.length; i++) {
    let x = width + i * charWidth;
    chars.push({ char: message[i], x: x });
  }
}

function draw() {
  background(0);

  for (let i = 0; i < chars.length; i++) {
    let ch = chars[i];
    //let y = height - charHeight + sin(ch.x * frequency) * amplitude;
    
    let y = 200 - charHeight + sin(ch.x * frequency) * amplitude;
    drawBitmapChar(ch.char, ch.x, y);
    ch.x -= speed;

    if (ch.x < -charWidth) {
      let lastCharX = chars.reduce((max, c) => max > c.x ? max : c.x, 0);
      ch.x = lastCharX + charWidth;
    }
  }
}

function drawBitmapChar(c, x, y) {
  let index = charset.indexOf(c);
  if (index === -1) return;

  let sx = (index % charsPerRow) * charWidth;
  let sy = Math.floor(index / charsPerRow) * charHeight;

  image(fontImage, x, y, charWidth, charHeight, sx, sy, charWidth, charHeight);
}
