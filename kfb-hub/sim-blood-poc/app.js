(() => {
  'use strict';

  const canvas = document.getElementById('smearCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scope = document.getElementById('scope');
  const debugLabel = document.getElementById('debugLabel');
  const focus = document.getElementById('focus');
  const focusLabel = document.getElementById('focusLabel');
  const objectiveLabel = document.getElementById('objectiveLabel');
  const status = document.getElementById('status');
  const counts = {
    rbc: document.getElementById('rbcCount'),
    wbc: document.getElementById('wbcCount'),
    platelet: document.getElementById('pltCount')
  };

  const WORLD = { w: 2400, h: 1600 };
  const recipe = {
    id: 'normal',
    rbc: 1150,
    platelets: 95,
    wbc: [
      ['segmented_neutrophil', 7],
      ['mature_lymphocyte', 4],
      ['monocyte', 2]
    ]
  };

  const state = {
    seed: Number(new URLSearchParams(location.search).get('seed')) || 42,
    objective: Number(new URLSearchParams(location.search).get('objective')) === 40 ? 40 : 100,
    focus: 0,
    view: { x: WORLD.w * .50, y: WORLD.h * .50 },
    cells: [],
    dragging: false,
    moved: false,
    dragStart: null
  };

  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function gaussian(rng) {
    let u = 0, v = 0;
    while (!u) u = rng();
    while (!v) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function warpedEllipsePath(cx, cy, rx, ry, rotation, wobble, seed) {
    const rng = mulberry32(seed);
    const points = [];
    const n = 18;
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      const j = 1 + (rng() - .5) * wobble;
      const ex = Math.cos(a) * rx * j;
      const ey = Math.sin(a) * ry * j;
      points.push({ x: cx + ex * cr - ey * sr, y: cy + ex * sr + ey * cr });
    }
    ctx.beginPath();
    const p0 = points[0], plast = points[n - 1];
    ctx.moveTo((p0.x + plast.x) / 2, (p0.y + plast.y) / 2);
    for (let i = 0; i < n; i++) {
      const p = points[i], q = points[(i + 1) % n];
      ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
    }
    ctx.closePath();
  }

  function createRbc(rng, i) {
    const r = clamp(16 + gaussian(rng) * 1.2, 13.2, 19.0);
    return {
      instanceId: `rbc-${i}`,
      family: 'rbc',
      class: 'normal_erythrocyte',
      truth: 'normal_erythrocyte',
      sourceStatus: 'PROCEDURAL_POC',
      x: rng() * WORLD.w,
      y: rng() * WORLD.h,
      r,
      aspect: clamp(1 + gaussian(rng) * .045, .91, 1.10),
      rotation: rng() * Math.PI,
      hueShift: gaussian(rng) * 2.4,
      pallor: clamp(.31 + gaussian(rng) * .025, .25, .37),
      wobble: clamp(.08 + rng() * .07, .07, .15),
      seed: (state.seed * 65537 + i * 31) >>> 0
    };
  }

  function createPlatelet(rng, i) {
    return {
      instanceId: `plt-${i}`,
      family: 'platelet', class: 'normal_platelet', truth: 'normal_platelet',
      sourceStatus: 'PROCEDURAL_POC',
      x: rng() * WORLD.w, y: rng() * WORLD.h,
      r: 2.3 + rng() * 1.6,
      rotation: rng() * Math.PI,
      seed: (state.seed * 131071 + i * 101) >>> 0
    };
  }

  function createWbc(rng, type, i) {
    const size = type === 'monocyte' ? 31 : type === 'segmented_neutrophil' ? 27 : 21;
    return {
      instanceId: `wbc-${type}-${i}`,
      family: 'wbc', class: type, truth: type,
      sourceStatus: 'PROCEDURAL_TEMP_VISUAL_DONOR',
      x: 90 + rng() * (WORLD.w - 180),
      y: 90 + rng() * (WORLD.h - 180),
      r: size * (.92 + rng() * .15),
      rotation: rng() * Math.PI * 2,
      seed: (state.seed * 524287 + i * 337 + type.length * 13) >>> 0
    };
  }

  function generateField() {
    const rng = mulberry32(state.seed);
    const cells = [];
    for (let i = 0; i < recipe.rbc; i++) cells.push(createRbc(rng, i));
    for (let i = 0; i < recipe.platelets; i++) cells.push(createPlatelet(rng, i));
    let wi = 0;
    for (const [type, amount] of recipe.wbc) {
      for (let i = 0; i < amount; i++) cells.push(createWbc(rng, type, wi++));
    }
    cells.sort((a, b) => a.family === 'wbc' ? 1 : b.family === 'wbc' ? -1 : 0);
    state.cells = cells;
    counts.rbc.textContent = recipe.rbc;
    counts.platelet.textContent = recipe.platelets;
    counts.wbc.textContent = wi;
    updateStatus();
    draw();
  }

  function drawRbc(c) {
    ctx.save();
    const rx = c.r * c.aspect, ry = c.r / c.aspect;
    warpedEllipsePath(c.x, c.y, rx, ry, c.rotation, c.wobble, c.seed);
    const grad = ctx.createRadialGradient(c.x - c.r * .08, c.y - c.r * .07, c.r * .10, c.x, c.y, c.r * 1.05);
    grad.addColorStop(0, `hsl(${350 + c.hueShift} 45% 90%)`);
    grad.addColorStop(c.pallor, `hsl(${350 + c.hueShift} 42% 88%)`);
    grad.addColorStop(.72, `hsl(${350 + c.hueShift} 45% 74%)`);
    grad.addColorStop(1, `hsl(${350 + c.hueShift} 43% 69%)`);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.globalAlpha = .16;
    ctx.strokeStyle = `hsl(${350 + c.hueShift} 38% 58%)`;
    ctx.lineWidth = .7;
    ctx.stroke();
    ctx.restore();
  }

  function granules(c, rng, n, color, minR, maxR, alpha) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2;
      const rr = Math.sqrt(rng()) * c.r * .72;
      const x = c.x + Math.cos(a) * rr;
      const y = c.y + Math.sin(a) * rr;
      ctx.beginPath();
      ctx.arc(x, y, minR + rng() * (maxR - minR), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWbc(c) {
    const rng = mulberry32(c.seed);
    ctx.save();
    const cyt = ctx.createRadialGradient(c.x - c.r * .15, c.y - c.r * .15, 1, c.x, c.y, c.r);
    if (c.class === 'segmented_neutrophil') {
      cyt.addColorStop(0, '#f4eff7'); cyt.addColorStop(1, '#d9d0e8');
      ctx.fillStyle = cyt; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      granules(c, rng, 58, '#9c74ae', .45, 1.15, .34);
      const lobeCount = 3 + Math.floor(rng() * 2);
      const base = c.rotation;
      ctx.strokeStyle = '#62416f'; ctx.lineWidth = 2.2; ctx.globalAlpha = .82;
      ctx.beginPath();
      for (let i = 0; i < lobeCount; i++) {
        const a = base + i / lobeCount * Math.PI * 2;
        const x = c.x + Math.cos(a) * c.r * .28;
        const y = c.y + Math.sin(a) * c.r * .22;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      for (let i = 0; i < lobeCount; i++) {
        const a = base + i / lobeCount * Math.PI * 2;
        const x = c.x + Math.cos(a) * c.r * .30;
        const y = c.y + Math.sin(a) * c.r * .24;
        ctx.save(); ctx.translate(x, y); ctx.rotate(a * .4);
        ctx.fillStyle = '#5a3166'; ctx.beginPath(); ctx.ellipse(0, 0, c.r * .22, c.r * .29, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else if (c.class === 'mature_lymphocyte') {
      cyt.addColorStop(0, '#d7e5fa'); cyt.addColorStop(1, '#9fb8e7');
      ctx.fillStyle = cyt; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4a2a68'; ctx.beginPath(); ctx.arc(c.x + c.r * .03, c.y - c.r * .02, c.r * .72, 0, Math.PI * 2); ctx.fill();
      granules({ ...c, r: c.r * .62 }, rng, 18, '#8c79ae', .35, .8, .25);
    } else if (c.class === 'monocyte') {
      cyt.addColorStop(0, '#d9e4ec'); cyt.addColorStop(1, '#a9bccb');
      ctx.fillStyle = cyt; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      granules(c, rng, 36, '#7f7791', .45, .95, .18);
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rotation);
      ctx.fillStyle = '#65456e';
      ctx.beginPath();
      ctx.moveTo(-c.r * .45, -c.r * .22);
      ctx.bezierCurveTo(-c.r * .10, -c.r * .60, c.r * .42, -c.r * .34, c.r * .34, c.r * .05);
      ctx.bezierCurveTo(c.r * .28, c.r * .42, -c.r * .02, c.r * .52, -c.r * .32, c.r * .30);
      ctx.bezierCurveTo(-c.r * .04, c.r * .12, c.r * .02, -c.r * .10, -c.r * .45, -c.r * .22);
      ctx.fill(); ctx.restore();
    }
    ctx.strokeStyle = 'rgba(72,49,83,.22)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function drawPlatelet(c) {
    const rng = mulberry32(c.seed);
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rotation);
    ctx.fillStyle = '#76508e';
    ctx.beginPath(); ctx.ellipse(0, 0, c.r * 1.15, c.r * .75, .2, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .55; ctx.fillStyle = '#4d2e6a';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc((rng()-.5)*c.r, (rng()-.5)*c.r*.7, .45 + rng()*.45, 0, Math.PI*2); ctx.fill(); }
    ctx.restore();
  }

  function scaleForObjective() { return state.objective === 100 ? 1.18 : .56; }

  function resizeCanvas() {
    const rect = scope.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    draw();
  }

  function draw() {
    if (!canvas.width || !canvas.height) return;
    const dpr = canvas.width / scope.clientWidth;
    const z = scaleForObjective() * dpr;
    const vw = canvas.width / z;
    const vh = canvas.height / z;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = '#f6eee9'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.setTransform(z, 0, 0, z, canvas.width/2 - state.view.x*z, canvas.height/2 - state.view.y*z);

    const rng = mulberry32(state.seed ^ 0xA53A9E37);
    ctx.fillStyle = 'rgba(146,102,97,.035)';
    for (let i=0;i<180;i++) { ctx.beginPath(); ctx.arc(rng()*WORLD.w, rng()*WORLD.h, .7+rng()*1.6, 0, Math.PI*2); ctx.fill(); }

    const margin = 60;
    for (const c of state.cells) {
      if (c.x < state.view.x - vw/2 - margin || c.x > state.view.x + vw/2 + margin || c.y < state.view.y - vh/2 - margin || c.y > state.view.y + vh/2 + margin) continue;
      if (c.family === 'rbc') drawRbc(c);
      else if (c.family === 'platelet') drawPlatelet(c);
      else drawWbc(c);
    }
    ctx.restore();
  }

  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const z = scaleForObjective();
    return {
      x: state.view.x + (clientX - rect.left - rect.width/2) / z,
      y: state.view.y + (clientY - rect.top - rect.height/2) / z
    };
  }

  function pickCell(clientX, clientY) {
    const p = screenToWorld(clientX, clientY);
    let best = null, bestD = Infinity;
    for (const c of state.cells) {
      if (c.family === 'rbc') continue;
      const d = Math.hypot(p.x - c.x, p.y - c.y);
      const hit = c.family === 'wbc' ? c.r * 1.15 : c.r * 2.4;
      if (d < hit && d < bestD) { best = c; bestD = d; }
    }
    return best;
  }

  function showCell(c) {
    if (!c) { debugLabel.hidden = true; return; }
    const labels = {
      segmented_neutrophil: 'Segmentierter Neutrophiler',
      mature_lymphocyte: 'Reifer Lymphozyt',
      monocyte: 'Monozyt',
      normal_platelet: 'Thrombozyt'
    };
    debugLabel.innerHTML = `<strong>${labels[c.truth] || c.truth}</strong><br><span>${c.instanceId} · ${c.sourceStatus}</span>`;
    debugLabel.hidden = false;
  }

  function clampView() {
    const z = scaleForObjective();
    const w = scope.clientWidth / z, h = scope.clientHeight / z;
    state.view.x = clamp(state.view.x, w * .48, WORLD.w - w * .48);
    state.view.y = clamp(state.view.y, h * .48, WORLD.h - h * .48);
  }

  function updateStatus() {
    status.textContent = `NORMAL · seed ${state.seed}`;
    objectiveLabel.textContent = `${state.objective}×`;
    document.querySelectorAll('[data-objective]').forEach(b => b.classList.toggle('active', Number(b.dataset.objective) === state.objective));
  }

  scope.addEventListener('pointerdown', e => {
    scope.setPointerCapture(e.pointerId);
    state.dragging = true; state.moved = false; scope.classList.add('dragging');
    state.dragStart = { x: e.clientX, y: e.clientY, viewX: state.view.x, viewY: state.view.y };
    debugLabel.hidden = true;
  });
  scope.addEventListener('pointermove', e => {
    if (!state.dragging) return;
    const dx = e.clientX - state.dragStart.x, dy = e.clientY - state.dragStart.y;
    if (Math.hypot(dx,dy) > 4) state.moved = true;
    const z = scaleForObjective();
    state.view.x = state.dragStart.viewX - dx / z;
    state.view.y = state.dragStart.viewY - dy / z;
    clampView(); draw();
  });
  scope.addEventListener('pointerup', e => {
    if (!state.dragging) return;
    state.dragging = false; scope.classList.remove('dragging');
    if (!state.moved) showCell(pickCell(e.clientX, e.clientY));
  });
  scope.addEventListener('pointercancel', () => { state.dragging = false; scope.classList.remove('dragging'); });

  document.querySelectorAll('[data-objective]').forEach(btn => btn.addEventListener('click', () => {
    state.objective = Number(btn.dataset.objective); clampView(); updateStatus(); draw();
  }));

  focus.addEventListener('input', () => {
    state.focus = Number(focus.value);
    focusLabel.textContent = state.focus.toFixed(1);
    canvas.style.filter = `blur(${state.focus * .38}px)`;
  });

  document.getElementById('resetView').addEventListener('click', () => {
    state.view.x = WORLD.w * .5; state.view.y = WORLD.h * .5; state.objective = 100; focus.value = '0'; focus.dispatchEvent(new Event('input')); updateStatus(); draw();
  });

  document.getElementById('newSeed').addEventListener('click', () => {
    state.seed = Math.floor(Math.random() * 999999) + 1;
    state.view.x = WORLD.w * .5; state.view.y = WORLD.h * .5;
    debugLabel.hidden = true; generateField();
  });

  const ro = new ResizeObserver(resizeCanvas); ro.observe(scope);
  generateField();
})();
