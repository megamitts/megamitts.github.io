let funcs = [];
let colors = [];
let z;

function setup() {
	createCanvas(windowWidth, windowHeight);
  //createCanvas(800, 800);
  background(0);
  frameRate(60);

  funcs = [
    (z, t) => mobius(z, 0.5 + 0.3*sin(t), 0.0, 0.5*cos(t), 0.5*sin(t)),
    (z, t) => mobius(z, 0.5*cos(t*1.5), 0.0, -0.5*sin(t), 0.5*cos(t)),
    (z, t) => mobius(z, 0.5*sin(t), 0.0, 0.0, 0.5*cos(t))
  ];

  colors = [
    color(255, 100, 100),
    color(100, 255, 100),
    color(100, 100, 255)
  ];

  z = { re: random(-1, 1), im: random(-1, 1) };
}

function draw() {
  noStroke();
  fill(0, 20);  // slight fade to black
  rect(0, 0, width, height);

  strokeWeight(1);

  let t = millis() / 1000.0; // time in seconds

  for (let i = 0; i < 5000; i++) {
    let index = floor(random(funcs.length));
    let f = funcs[index];
    z = f(z, t);

    if (abs(z.re) > 2.0 || abs(z.im) > 2.0) {
      z = { re: random(-1, 1), im: random(-1, 1) };
    }

    let x = map(z.re, -1, 1, 0, width);
    let y = map(z.im, -1, 1, height, 0);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      stroke(colors[index]);
      point(x, y);
    }
  }
}

function mobius(z, a_re, a_im, b_re, b_im) {
  let a = { re: a_re, im: a_im };
  let b = { re: b_re, im: b_im };
  let one = { re: 1.0, im: 0.0 };

  let numerator = complexAdd(complexMul(a, z), b);
  let denominator = complexAdd(complexMul(b, z), one);

  return complexDiv(numerator, denominator);
}

function complexAdd(u, v) {
  return { re: u.re + v.re, im: u.im + v.im };
}

function complexMul(u, v) {
  return { re: u.re*v.re - u.im*v.im, im: u.re*v.im + u.im*v.re };
}

function complexDiv(u, v) {
  let denom = v.re*v.re + v.im*v.im;
  return {
    re: (u.re*v.re + u.im*v.im) / denom,
    im: (u.im*v.re - u.re*v.im) / denom
  };
}

