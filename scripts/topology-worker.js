/**
 * topology-worker.js
 * Moves 3.2M+ math operations off the main thread.
 */

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_SIZE = 4095;
let perlin;

function scaledCosine(i) { return 0.5 * (1 - Math.cos(i * Math.PI)); }

function noise(x, y) {
  if (!perlin) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) perlin[i] = Math.random();
  }
  let xi = Math.floor(x), yi = Math.floor(y);
  let xf = x - xi, yf = y - yi;
  let r = 0, ampl = 0.5;

  for (let o = 0; o < 4; o++) {
    let of_ = xi + (yi << PERLIN_YWRAPB);
    const rxf = scaledCosine(xf);
    const ryf = scaledCosine(yf);
    let n1 = perlin[of_ & PERLIN_SIZE];
    n1 += rxf * (perlin[(of_ + 1) & PERLIN_SIZE] - n1);
    let n2 = perlin[(of_ + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of_ + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);
    r += n1 * ampl;
    ampl *= 0.5;
    xi <<= 1; xf *= 2; yi <<= 1; yf *= 2;
    if (xf >= 1) { xi++; xf--; }
    if (yf >= 1) { yi++; yf--; }
  }
  return r;
}

self.onmessage = function (e) {
  const { fH, fW, N_SIZE, N_RAD, TAU } = e.data;
  const flow = [];

  for (let i = 0; i < fH; i++) {
    const row = [];
    for (let j = 0; j < fW; j++) {
      let hiV = 0, loV = 1, hi = { x: 0, y: 0 }, lo = { x: 0, y: 0 };
      const x = j * N_SIZE, y = i * N_SIZE;

      for (let s = 0; s < 100; s++) {
        const a = (s / 100) * TAU;
        const px = x + Math.cos(a) * N_RAD, py = y + Math.sin(a) * N_RAD;
        const v = noise(px, py);
        if (v > hiV) { hiV = v; hi.x = px; hi.y = py; }
        if (v < loV) { loV = v; lo.x = px; lo.y = py; }
      }
      const f = { x: lo.x - hi.x, y: lo.y - hi.y };
      const len = Math.sqrt(f.x * f.x + f.y * f.y);
      if (len > 0) { f.x /= len; f.y /= len; }
      f.x *= hiV - loV;
      f.y *= hiV - loV;
      row.push(f);
    }
    flow.push(row);
  }
  self.postMessage(flow);
};
