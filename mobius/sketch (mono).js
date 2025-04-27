let funcs = [];
let z;

function setup() {
  createCanvas(800, 800);
  background(0);
  stroke(255);
  strokeWeight(1);
  noLoop();

  funcs = [
    (z) => mobius(z, 0.5, 0.0, 0.5, 0.0),
    (z) => mobius(z, 0.5, 0.0, -0.5, 0.0),
    (z) => mobius(z, 0.5, 0.0, 0.0, 0.5)
  ];

  z = { re: random(-1, 1), im: random(-1, 1) };

  for (let i = 0; i < 500000; i++) {
    let f = random(funcs);
    z = f(z);

    if (abs(z.re) > 2.0 || abs(z.im) > 2.0) {
      z = { re: random(-1, 1), im: random(-1, 1) };
    }

    let x = map(z.re, -1, 1, 0, width);
    let y = map(z.im, -1, 1, height, 0);

    if (x >= 0 && x < width && y >= 0 && y < height) {
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

