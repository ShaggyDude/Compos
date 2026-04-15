/**
 * topology.js — Main Thread Controller
 * Bridged to Tailwind 4 INKS via --ink-sage-500
 */
;(function () {
  const TAU = Math.PI * 2;
  const N_PARTS = 3000; // total particles in the flow field // 6000
  const ALPHA = 0.1; // base opacity at reference height (900px) — scales down on shorter pages
  const N_SIZE = 0.001; // noise frequency — smaller = smoother flow curves // .09
  const N_RAD = 0.09; // noise radius — controls how much the flow field varies
  const CELL = 9; // flow field grid resolution in px — smaller = finer detail
  const OFF = 100; // canvas overdraw buffer so particles wrap without edge gaps
  const MIN = 200; // minimum canvas dimension in px

  function topology(el) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) return;

    const canvas = document.createElement("canvas");
    canvas.id = "topology-canvas";
    el.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Pull the sage green from the CSS custom property so it stays in sync with the theme
    const getThemeColor = () =>
      getComputedStyle(el).getPropertyValue("--ink-sage-500").trim() ||
      "#22c55e";
    let color = getThemeColor();

    let W,
      H,
      fW,
      fH,
      dynamicAlpha = ALPHA,
      flow = [],
      parts = [];
    const FADEIN_MS = 100; // ease-in duration at the start — 0→1 over this window
    const RUN_MS = 5000; // full-opacity run time in ms before fade begins
    const FADE_MS = 5000; // how long the fade-out takes in ms after RUN_MS
    let startTime = 0;

    function setSize() {
      W = Math.max(el.offsetWidth, MIN);
      H = Math.max(el.offsetHeight, MIN);
      canvas.width = W;
      canvas.height = H;
      dynamicAlpha = Math.min(ALPHA, ALPHA * Math.pow(H / 2500, 1.66));
      // flow field grid dimensions include the overdraw buffer on both sides
      fW = Math.ceil((W + OFF * 2) / CELL);
      fH = Math.ceil((H + OFF * 2) / CELL);
    }

    function initParts() {
      parts = [];
      const w = W + OFF * 2,
        h = H + OFF * 2;
      for (let i = 0; i < N_PARTS; i++) {
        const rx = Math.random() * w,
          ry = Math.random() * h;
        // each particle tracks previous position (for line drawing), current position, velocity, and acceleration
        parts.push({
          prev: { x: rx, y: ry },
          pos: { x: rx, y: ry },
          vel: { x: 0, y: 0 },
          acc: { x: 0, y: 0 },
        });
      }
    }

    function spawnWorker() {
      // worker computes the noise-based flow field off the main thread, then terminates
      const worker = new Worker("/scripts/topology-worker.js");
      worker.postMessage({ fH, fW, N_SIZE, N_RAD, TAU });
      worker.onmessage = function (e) {
        flow = e.data;
        initParts();
        startTime = performance.now();
        requestAnimationFrame(loop);
        worker.terminate();
      };
    }

    function loop(now) {
      const elapsed = now - startTime;
      // fade-in: 0→1 over FADEIN_MS, then hold at 1, then fade out after RUN_MS
      let fade = Math.min(1, elapsed / FADEIN_MS);
      if (elapsed > RUN_MS) {
        // fade is 1→0 over FADE_MS after the run period ends
        fade = Math.max(0, 1 - (elapsed - RUN_MS) / FADE_MS);
        if (fade <= 0) return; // animation done — canvas remains as a static snapshot
      }

      color = getThemeColor();
      const w = W + OFF * 2,
        h = H + OFF * 2;

      // offset transform so particles in the overdraw buffer are clipped naturally
      ctx.setTransform(1, 0, 0, 1, -OFF, -OFF);
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.globalAlpha = dynamicAlpha * fade; // scales with page height so density stays consistent
      ctx.beginPath();

      for (let i = 0; i < N_PARTS; i++) {
        const p = parts[i];
        // look up which flow field cell this particle is in
        const r = Math.min(Math.floor(Math.max(0, p.pos.y) / CELL), fH - 1);
        const c = Math.min(Math.floor(Math.max(0, p.pos.x) / CELL), fW - 1);
        const f = flow[r][c];

        p.prev.x = p.pos.x;
        p.prev.y = p.pos.y;
        // wrap position so particles re-enter from the opposite edge
        p.pos.x = (((p.pos.x + p.vel.x) % w) + w) % w;
        p.pos.y = (((p.pos.y + p.vel.y) % h) + h) % h;

        p.vel.x += p.acc.x;
        p.vel.y += p.acc.y;

        // cap speed to 2.2 px/frame by normalizing then scaling
        const len = Math.sqrt(p.vel.x * p.vel.x + p.vel.y * p.vel.y);
        if (len > 0) {
          p.vel.x = (p.vel.x / len) * 2.2;
          p.vel.y = (p.vel.y / len) * 2.2;
        }

        // steer toward the flow field direction
        p.acc.x = f.x * 3;
        p.acc.y = f.y * 3;

        // skip the stroke if the particle wrapped around an edge (would draw a long diagonal line)
        const dx = p.prev.x - p.pos.x,
          dy = p.prev.y - p.pos.y;
        if (dx * dx + dy * dy < 100) {
          ctx.moveTo(p.prev.x, p.prev.y);
          ctx.lineTo(p.pos.x, p.pos.y);
        }
      }
      ctx.stroke(); // single stroke call for all 6000 particles — keeps it fast

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }

    function restart() {
      ctx.clearRect(0, 0, W, H);
      startTime = performance.now(); // reset the run/fade timer
      requestAnimationFrame(loop);
    }

    setSize();
    spawnWorker();
    el.addEventListener("dblclick", restart); // dblclick anywhere restarts the animation
    window.addEventListener("resize", () => {
      setSize();
      spawnWorker();
    });
  }

  // defer startup until the browser is idle so it doesn't compete with page load
  if (window.requestIdleCallback) {
    requestIdleCallback(() => topology(document.body));
  } else {
    setTimeout(() => topology(document.body), 100);
  }
})();
