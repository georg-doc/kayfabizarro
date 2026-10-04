(() => {
  'use strict';

  const canvas = document.getElementById('smearCanvas');
  const scope = document.getElementById('scope');
  const ctx = canvas?.getContext?.('2d', { alpha: false });
  if (!canvas || !scope || !ctx) {
    document.body.insertAdjacentHTML('beforeend', '<div style="padding:16px;font:14px system-ui">SimBlood konnte den Canvas nicht initialisieren.</div>');
    return;
  }

  const ui = {
    debugLabel: document.getElementById('debugLabel'),
    focus: document.getElementById('focus'),
    focusLabel: document.getElementById('focusLabel'),
    objectiveLabel: document.getElementById('objectiveLabel'),
    status: document.getElementById('status'),
    recipeSummary: document.getElementById('recipeSummary'),
    counts: {
      rbc: document.getElementById('rbcCount'),
      wbc: document.getElementById('wbcCount'),
      platelet: document.getElementById('pltCount')
    }
  };

  const WORLD = { w: 2400, h: 1600 };
  const FIELD_BG = '#f6eee9';
  const MIN_MAG = 25;
  const MAX_MAG = 140;
  const reduceMotion = matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  const RECIPES = {
    normal: {
      id: 'normal', label: 'NORMAL', rbc: 1150, platelets: 95,
      wbc: [['segmented_neutrophil', 7], ['mature_lymphocyte', 4], ['monocyte', 2]],
      morphology: { micro: 0, hypochromia: 0, elliptocyte: 0, schistocyte: 0, polychromasia: 0 },
      summary: 'Normaler technischer Basis-Preset. RBCs prozedural; WBC-Darstellung kann zwischen realen POC-Kandidaten und prozeduralem Fallback umgeschaltet werden.'
    },
    iron_deficiency: {
      id: 'iron_deficiency', label: 'EISENMANGEL · POC', rbc: 1150, platelets: 105,
      wbc: [['segmented_neutrophil', 7], ['mature_lymphocyte', 4], ['monocyte', 2]],
      morphology: { micro: .50, hypochromia: .58, elliptocyte: .11, schistocyte: 0, polychromasia: .01 },
      summary: 'Technischer Composer-Test: kleinere/hypochromere RBC-Population + elliptische/pencil-artige Formen. Nicht medizinisch kalibriert.'
    },
    tma: {
      id: 'tma', label: 'TMA · POC', rbc: 1120, platelets: 32,
      wbc: [['segmented_neutrophil', 7], ['mature_lymphocyte', 4], ['monocyte', 2]],
      morphology: { micro: 0, hypochromia: 0, elliptocyte: 0, schistocyte: .065, polychromasia: .035 },
      summary: 'Technischer Composer-Test: diverse Fragmentformen + reduzierte Plättchendichte. POC-Platzhalter, keine klinischen Defaults.'
    }
  };

  // Real-cell candidates are still POC donors. The original Acevedo PBC dataset
  // is the rights/provenance authority; raw GitHub paths are temporary delivery mirrors.
  const CELL_ASSETS = {
    'pbc-neut-985930': {
      class: 'segmented_neutrophil', status: 'REAL_OPEN_CANDIDATE', review: 'VISUALLY_INSPECTED_POC_CANDIDATE',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/neutrophil/BNE_985930.jpg',
      crop: { x: .50, y: .50, size: .54 }, render: { scale: 2.12, clip: 1.06, featherStart: .60 }
    },
    'pbc-neut-100878': {
      class: 'segmented_neutrophil', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/neutrophil/BNE_100878.jpg',
      crop: { x: .50, y: .50, size: .54 }, render: { scale: 2.12, clip: 1.06, featherStart: .60 }
    },
    'pbc-neut-101007': {
      class: 'segmented_neutrophil', status: 'REAL_OPEN_CANDIDATE', review: 'USER_VISUAL_POSITIVE_POC',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/neutrophil/BNE_101007.jpg',
      crop: { x: .50, y: .50, size: .54 }, render: { scale: 2.12, clip: 1.06, featherStart: .60 }
    },
    'pbc-lymph-100275': {
      class: 'mature_lymphocyte', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/lymphocyte/LY_100275.jpg',
      crop: { x: .50, y: .50, size: .54 }, render: { scale: 2.08, clip: 1.04, featherStart: .60 }
    },
    'pbc-lymph-102859': {
      class: 'mature_lymphocyte', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/lymphocyte/LY_102859.jpg',
      crop: { x: .50, y: .50, size: .54 }, render: { scale: 2.08, clip: 1.04, featherStart: .60 }
    },
    'pbc-lymph-10361': {
      class: 'mature_lymphocyte', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/lymphocyte/LY_10361.jpg',
      crop: { x: .50, y: .50, size: .54 }, render: { scale: 2.08, clip: 1.04, featherStart: .60 }
    },
    'pbc-mono-100695': {
      class: 'monocyte', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/monocyte/MO_100695.jpg',
      crop: { x: .50, y: .50, size: .56 }, render: { scale: 2.14, clip: 1.07, featherStart: .60 }
    },
    'pbc-mono-101258': {
      class: 'monocyte', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/monocyte/MO_101258.jpg',
      crop: { x: .50, y: .50, size: .56 }, render: { scale: 2.14, clip: 1.07, featherStart: .60 }
    },
    'pbc-mono-102400': {
      class: 'monocyte', status: 'REAL_OPEN_CANDIDATE', review: 'UNREVIEWED',
      src: 'https://raw.githubusercontent.com/official-Auralin/Blood-Cell-Classification/main/PBC_dataset_normal_DIB/monocyte/MO_102400.jpg',
      crop: { x: .50, y: .50, size: .56 }, render: { scale: 2.14, clip: 1.07, featherStart: .60 }
    }
  };

  const ASSET_POOLS = {
    segmented_neutrophil: ['pbc-neut-985930', 'pbc-neut-100878', 'pbc-neut-101007'],
    mature_lymphocyte: ['pbc-lymph-100275', 'pbc-lymph-102859', 'pbc-lymph-10361'],
    monocyte: ['pbc-mono-100695', 'pbc-mono-101258', 'pbc-mono-102400']
  };
  const assetImages = new Map();

  const params = new URLSearchParams(location.search);
  const preset = RECIPES[params.get('preset')] ? params.get('preset') : 'normal';
  const seed = Number(params.get('seed')) || 42;
  const initialMag = Number(params.get('mag') || params.get('objective'));
  const wbcMode = params.get('wbc') === 'procedural' ? 'procedural' : 'real';

  const S = {
    preset,
    seed,
    mag: Number.isFinite(initialMag) ? clamp(initialMag, MIN_MAG, MAX_MAG) : 100,
    focus: 0,
    wbcMode,
    view: { x: WORLD.w / 2, y: WORLD.h / 2 },
    cells: [],
    selected: null,
    pointers: new Map(),
    drag: null,
    pinch: null,
    panVelocity: { x: 0, y: 0 },
    lastMoveTime: 0,
    inertiaRaf: 0,
    drawRaf: 0,
    urlTimer: 0
  };

  function recipe() { return RECIPES[S.preset]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function mulberry32(seedValue) {
    let a = seedValue >>> 0;
    return () => {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
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
  function zoomScale() { return .1466666667 + S.mag * .0103333333; }
  function canvasRect() { return canvas.getBoundingClientRect(); }
  function scopeRect() { return scope.getBoundingClientRect(); }

  function screenToWorld(clientX, clientY) {
    const b = canvasRect();
    const sc = zoomScale();
    return {
      x: S.view.x + (clientX - b.left - b.width / 2) / sc,
      y: S.view.y + (clientY - b.top - b.height / 2) / sc
    };
  }

  function worldToScope(x, y) {
    const cb = canvasRect();
    const sb = scopeRect();
    const sc = zoomScale();
    return {
      x: (cb.left - sb.left) + cb.width / 2 + (x - S.view.x) * sc,
      y: (cb.top - sb.top) + cb.height / 2 + (y - S.view.y) * sc
    };
  }

  function clampView() {
    const sc = zoomScale();
    const halfW = Math.min(WORLD.w / 2, canvas.clientWidth / (2 * sc));
    const halfH = Math.min(WORLD.h / 2, canvas.clientHeight / (2 * sc));
    S.view.x = halfW >= WORLD.w / 2 ? WORLD.w / 2 : clamp(S.view.x, halfW, WORLD.w - halfW);
    S.view.y = halfH >= WORLD.h / 2 ? WORLD.h / 2 : clamp(S.view.y, halfH, WORLD.h - halfH);
  }

  function requestDraw() {
    if (S.drawRaf) return;
    S.drawRaf = requestAnimationFrame(() => {
      S.drawRaf = 0;
      draw();
      placeLabel();
    });
  }

  function scheduleUrl() {
    clearTimeout(S.urlTimer);
    S.urlTimer = setTimeout(updateUrl, 120);
  }

  function setMag(nextMag, clientX, clientY, fixedWorldAnchor = null) {
    const b = canvasRect();
    const px = Number.isFinite(clientX) ? clamp(clientX, b.left, b.right) : b.left + b.width / 2;
    const py = Number.isFinite(clientY) ? clamp(clientY, b.top, b.bottom) : b.top + b.height / 2;
    const anchor = fixedWorldAnchor || screenToWorld(px, py);
    S.mag = clamp(nextMag, MIN_MAG, MAX_MAG);
    const sc = zoomScale();
    const localX = px - b.left - b.width / 2;
    const localY = py - b.top - b.height / 2;
    S.view.x = anchor.x - localX / sc;
    S.view.y = anchor.y - localY / sc;
    clampView();
    updateStatus(false);
    scheduleUrl();
    requestDraw();
  }

  function warpedEllipsePath(cx, cy, rx, ry, rotation, wobble, seedValue) {
    const rng = mulberry32(seedValue), pts = [], n = 20;
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      const j = 1 + (rng() - .5) * wobble;
      const ex = Math.cos(a) * rx * j, ey = Math.sin(a) * ry * j;
      pts.push({ x: cx + ex * cr - ey * sr, y: cy + ex * sr + ey * cr });
    }
    ctx.beginPath();
    const p0 = pts[0], plast = pts[n - 1];
    ctx.moveTo((p0.x + plast.x) / 2, (p0.y + plast.y) / 2);
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2);
    }
    ctx.closePath();
  }

  function chooseRbcClass(rng, m) {
    const q = rng();
    if (q < m.schistocyte) return 'schistocyte_fragment';
    if (q < m.schistocyte + m.elliptocyte) return 'elliptocyte_pencil_cell';
    if (q < m.schistocyte + m.elliptocyte + m.polychromasia) return 'polychromatophilic_rbc';
    const micro = rng() < m.micro;
    const hypo = rng() < m.hypochromia;
    return (micro || hypo) ? 'microcytic_hypochromic_rbc' : 'normal_erythrocyte';
  }

  function createRbc(rng, i) {
    const m = recipe().morphology;
    const cls = chooseRbcClass(rng, m);
    let r = clamp(16 + gaussian(rng) * 1.15, 13.4, 18.8);
    let aspect = clamp(1 + gaussian(rng) * .04, .92, 1.09);
    let pallor = clamp(.31 + gaussian(rng) * .022, .26, .36);
    let wobble = .06 + rng() * .06;
    if (cls === 'microcytic_hypochromic_rbc') { r *= .80 + rng() * .08; pallor = clamp(.49 + gaussian(rng) * .035, .42, .58); aspect = clamp(1 + gaussian(rng) * .08, .86, 1.18); }
    if (cls === 'elliptocyte_pencil_cell') { r *= .94; aspect = 1.65 + rng() * .55; pallor = .34 + rng() * .08; wobble = .05 + rng() * .04; }
    if (cls === 'polychromatophilic_rbc') { r *= 1.05 + rng() * .08; pallor = .23 + rng() * .05; }
    if (cls === 'schistocyte_fragment') { r *= .58 + rng() * .18; pallor = 0; aspect = 1; wobble = 0; }
    return {
      instanceId: `rbc-${i}`, family: 'rbc', class: cls, truth: cls,
      sourceStatus: cls === 'normal_erythrocyte' ? 'PROCEDURAL_POC' : 'TECHNICAL_PATHOLOGY_PLACEHOLDER',
      x: rng() * WORLD.w, y: rng() * WORLD.h, r, aspect, rotation: rng() * Math.PI * 2,
      hueShift: gaussian(rng) * 2.2, pallor, wobble, seed: (S.seed * 65537 + i * 31) >>> 0
    };
  }

  function createPlatelet(rng, i) {
    return {
      instanceId: `plt-${i}`, family: 'platelet', class: 'normal_platelet', truth: 'normal_platelet',
      sourceStatus: 'PROCEDURAL_POC', x: rng() * WORLD.w, y: rng() * WORLD.h,
      r: 2.1 + rng() * 1.5, rotation: rng() * Math.PI, seed: (S.seed * 131071 + i * 101) >>> 0
    };
  }

  function chooseAssetId(type, seedValue) {
    if (S.wbcMode !== 'real') return null;
    const pool = ASSET_POOLS[type];
    if (!pool?.length) return null;
    const rng = mulberry32(seedValue ^ 0x7f4a7c15);
    return pool[Math.floor(rng() * pool.length) % pool.length];
  }

  function createWbc(rng, type, i) {
    const size = type === 'monocyte' ? 31 : type === 'segmented_neutrophil' ? 27 : 21;
    const cellSeed = (S.seed * 524287 + i * 337 + type.length * 13) >>> 0;
    const assetId = chooseAssetId(type, cellSeed);
    return {
      instanceId: `wbc-${type}-${i}`, family: 'wbc', class: type, truth: type, assetId,
      sourceStatus: assetId ? CELL_ASSETS[assetId].status : 'PROCEDURAL_TEMP_VISUAL_DONOR',
      x: 90 + rng() * (WORLD.w - 180), y: 90 + rng() * (WORLD.h - 180),
      r: size * (.92 + rng() * .15), rotation: rng() * Math.PI * 2, seed: cellSeed
    };
  }

  function generateField() {
    const rng = mulberry32(S.seed), cells = [], r = recipe();
    for (let i = 0; i < r.rbc; i++) cells.push(createRbc(rng, i));
    for (let i = 0; i < r.platelets; i++) cells.push(createPlatelet(rng, i));
    let wi = 0;
    for (const [type, amount] of r.wbc) for (let i = 0; i < amount; i++) cells.push(createWbc(rng, type, wi++));
    cells.sort((a, b) => a.family === 'wbc' ? 1 : b.family === 'wbc' ? -1 : 0);
    S.cells = cells;
    S.selected = null;
    if (ui.debugLabel) ui.debugLabel.hidden = true;
    if (ui.counts.rbc) ui.counts.rbc.textContent = r.rbc;
    if (ui.counts.platelet) ui.counts.platelet.textContent = r.platelets;
    if (ui.counts.wbc) ui.counts.wbc.textContent = wi;
    if (ui.recipeSummary) ui.recipeSummary.textContent = r.summary;
    updateStatus();
    requestDraw();
  }

  function drawRbc(c) {
    ctx.save();
    if (c.class === 'schistocyte_fragment') {
      const rng = mulberry32(c.seed), n = 3 + Math.floor(rng() * 3), pts = [];
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2 + c.rotation, rr = c.r * (.70 + rng() * .52);
        pts.push([c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr]);
      }
      ctx.beginPath();
      ctx.moveTo(...pts[0]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
      ctx.closePath();
      ctx.fillStyle = '#d89096'; ctx.fill();
      ctx.strokeStyle = 'rgba(126,72,79,.42)'; ctx.lineWidth = .7; ctx.stroke();
      ctx.restore();
      return;
    }
    const rx = c.r * c.aspect, ry = c.r / c.aspect;
    warpedEllipsePath(c.x, c.y, rx, ry, c.rotation, c.wobble, c.seed);
    ctx.fillStyle = c.class === 'polychromatophilic_rbc' ? '#aab7c8' : `hsl(${350 + c.hueShift} 41% ${c.class === 'microcytic_hypochromic_rbc' ? 78 : 75}%)`;
    ctx.fill();
    ctx.strokeStyle = c.class === 'polychromatophilic_rbc' ? 'rgba(92,92,118,.32)' : `hsla(${350 + c.hueShift} 36% 54% / .28)`;
    ctx.lineWidth = .7; ctx.stroke();
    if (c.pallor > 0) {
      const paleRx = rx * clamp(c.pallor * 1.42, .30, .78), paleRy = ry * clamp(c.pallor * 1.42, .30, .78);
      ctx.save();
      ctx.globalAlpha = c.class === 'microcytic_hypochromic_rbc' ? .92 : .76;
      warpedEllipsePath(c.x, c.y, paleRx, paleRy, c.rotation, c.wobble * .55, c.seed ^ 0x51a2);
      ctx.fillStyle = c.class === 'polychromatophilic_rbc' ? '#c8ced8' : '#f2dedb';
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function granules(c, rng, n, color, minR, maxR, alpha) {
    ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = alpha;
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2, rr = Math.sqrt(rng()) * c.r * .72;
      ctx.beginPath();
      ctx.arc(c.x + Math.cos(a) * rr, c.y + Math.sin(a) * rr, minR + rng() * (maxR - minR), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawInjectedCell(c, img) {
    const asset = CELL_ASSETS[c.assetId];
    if (!asset || !img?.complete || !img.naturalWidth) return false;
    const crop = asset.crop || { x: .5, y: .5, size: .54 };
    const render = asset.render || { scale: 2.12, clip: 1.06, featherStart: .60 };
    const side = Math.min(img.naturalWidth, img.naturalHeight) * crop.size;
    const sx = img.naturalWidth * crop.x - side / 2;
    const sy = img.naturalHeight * crop.y - side / 2;
    const size = c.r * render.scale;
    const clipR = c.r * render.clip;

    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, clipR, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = .97;
    ctx.filter = 'contrast(1.02) saturate(.96)';
    ctx.drawImage(img, sx, sy, side, side, c.x - size / 2, c.y - size / 2, size, size);
    ctx.filter = 'none';

    const vignette = ctx.createRadialGradient(c.x, c.y, c.r * render.featherStart, c.x, c.y, clipR);
    vignette.addColorStop(0, 'rgba(246,238,233,0)');
    vignette.addColorStop(.62, 'rgba(246,238,233,.04)');
    vignette.addColorStop(.82, 'rgba(246,238,233,.35)');
    vignette.addColorStop(1, 'rgba(246,238,233,.98)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = vignette;
    ctx.fillRect(c.x - clipR, c.y - clipR, clipR * 2, clipR * 2);
    ctx.restore();
    return true;
  }

  function drawProceduralWbc(c) {
    const rng = mulberry32(c.seed);
    ctx.save();
    const cyt = ctx.createRadialGradient(c.x - c.r * .15, c.y - c.r * .15, 1, c.x, c.y, c.r);
    if (c.class === 'segmented_neutrophil') {
      cyt.addColorStop(0, '#f3eef6'); cyt.addColorStop(1, '#d8d0e5');
      ctx.fillStyle = cyt; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      granules(c, rng, 52, '#9674a6', .45, 1.05, .30);
      const lobes = 3 + Math.floor(rng() * 2), base = c.rotation;
      ctx.strokeStyle = '#62416f'; ctx.lineWidth = 1.8; ctx.globalAlpha = .72; ctx.beginPath();
      for (let i = 0; i < lobes; i++) {
        const a = base + i / lobes * Math.PI * 2, x = c.x + Math.cos(a) * c.r * .28, y = c.y + Math.sin(a) * c.r * .22;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
      for (let i = 0; i < lobes; i++) {
        const a = base + i / lobes * Math.PI * 2;
        ctx.save(); ctx.translate(c.x + Math.cos(a) * c.r * .30, c.y + Math.sin(a) * c.r * .24); ctx.rotate(a * .4);
        ctx.fillStyle = '#593567'; ctx.beginPath(); ctx.ellipse(0, 0, c.r * .20, c.r * .27, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else if (c.class === 'mature_lymphocyte') {
      cyt.addColorStop(0, '#d7e5f8'); cyt.addColorStop(1, '#a7bce0');
      ctx.fillStyle = cyt; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4d2c67'; ctx.beginPath(); ctx.arc(c.x + c.r * .02, c.y - c.r * .01, c.r * .71, 0, Math.PI * 2); ctx.fill();
    } else {
      cyt.addColorStop(0, '#d9e4ec'); cyt.addColorStop(1, '#a9bccb');
      ctx.fillStyle = cyt; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      granules(c, rng, 32, '#7f7791', .45, .9, .16);
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rotation); ctx.fillStyle = '#65456e';
      ctx.beginPath(); ctx.moveTo(-c.r * .45, -c.r * .22);
      ctx.bezierCurveTo(-c.r * .10, -c.r * .60, c.r * .42, -c.r * .34, c.r * .34, c.r * .05);
      ctx.bezierCurveTo(c.r * .28, c.r * .42, -c.r * .02, c.r * .52, -c.r * .32, c.r * .30);
      ctx.bezierCurveTo(-c.r * .04, c.r * .12, c.r * .02, -c.r * .10, -c.r * .45, -c.r * .22);
      ctx.fill(); ctx.restore();
    }
    ctx.strokeStyle = 'rgba(72,49,83,.20)'; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function drawWbc(c) {
    if (c.assetId) {
      const img = assetImages.get(c.assetId);
      if (img && drawInjectedCell(c, img)) return;
    }
    drawProceduralWbc(c);
  }

  function drawPlatelet(c) {
    const rng = mulberry32(c.seed);
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rotation); ctx.fillStyle = '#75508a';
    ctx.beginPath(); ctx.ellipse(0, 0, c.r * 1.12, c.r * .72, .2, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .5; ctx.fillStyle = '#4d2e68';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc((rng() - .5) * c.r, (rng() - .5) * c.r * .7, .4 + rng() * .4, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  function resizeCanvas() {
    const b = scope.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(b.width * dpr)), h = Math.max(1, Math.round(b.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    canvas.style.width = `${b.width}px`; canvas.style.height = `${b.height}px`;
    clampView(); requestDraw();
  }

  function draw() {
    if (!canvas.width) return;
    const dpr = canvas.width / Math.max(1, canvas.clientWidth), sc = zoomScale() * dpr;
    const vw = canvas.width / sc, vh = canvas.height / sc;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = FIELD_BG; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(sc, 0, 0, sc, canvas.width / 2 - S.view.x * sc, canvas.height / 2 - S.view.y * sc);
    const rng = mulberry32(S.seed ^ 0xA53A9E37);
    ctx.fillStyle = 'rgba(146,102,97,.035)';
    for (let i = 0; i < 180; i++) { ctx.beginPath(); ctx.arc(rng() * WORLD.w, rng() * WORLD.h, .7 + rng() * 1.6, 0, Math.PI * 2); ctx.fill(); }
    for (const c of S.cells) {
      if (c.x < S.view.x - vw / 2 - 80 || c.x > S.view.x + vw / 2 + 80 || c.y < S.view.y - vh / 2 - 80 || c.y > S.view.y + vh / 2 + 80) continue;
      if (c.family === 'rbc') drawRbc(c);
      else if (c.family === 'platelet') drawPlatelet(c);
      else drawWbc(c);
    }
    ctx.restore();
  }

  function pickCell(clientX, clientY) {
    const p = screenToWorld(clientX, clientY);
    let best = null, bestPriority = -1, bestScore = Infinity;
    for (const c of S.cells) {
      const hitR = c.family === 'wbc' ? c.r * 1.18 : c.family === 'platelet' ? c.r * 2.7 : c.r * 1.02;
      const d = Math.hypot(p.x - c.x, p.y - c.y);
      if (d > hitR) continue;
      const priority = c.family === 'wbc' ? 4 : c.family === 'platelet' ? 3 : c.class !== 'normal_erythrocyte' ? 2 : 1;
      const score = d / hitR;
      if (priority > bestPriority || (priority === bestPriority && score < bestScore)) { best = c; bestPriority = priority; bestScore = score; }
    }
    return best;
  }

  function showCell(c) {
    S.selected = c || null;
    if (!ui.debugLabel || !c) { if (ui.debugLabel) ui.debugLabel.hidden = true; return; }
    const labels = {
      segmented_neutrophil: 'Segmentierter Neutrophiler', mature_lymphocyte: 'Reifer Lymphozyt', monocyte: 'Monozyt',
      normal_platelet: 'Thrombozyt', normal_erythrocyte: 'Erythrozyt', microcytic_hypochromic_rbc: 'Mikrozytär / hypochrom',
      elliptocyte_pencil_cell: 'Elliptozyt / Pencil Cell', schistocyte_fragment: 'Schistozyten-Fragment · POC', polychromatophilic_rbc: 'Polychromatischer Erythrozyt · POC'
    };
    const review = c.assetId ? CELL_ASSETS[c.assetId]?.review : null;
    ui.debugLabel.innerHTML = `<strong>${labels[c.truth] || c.truth}</strong><br><span>${c.assetId ? `${c.assetId} · ` : ''}${review || c.sourceStatus}</span>`;
    ui.debugLabel.hidden = false;
    placeLabel();
  }

  function placeLabel() {
    const label = ui.debugLabel, c = S.selected;
    if (!label || !c) return;
    const p = worldToScope(c.x, c.y), sb = scopeRect();
    const rad = Math.min(sb.width, sb.height) / 2 - 12;
    if (Math.hypot(p.x - sb.width / 2, p.y - sb.height / 2) > rad) { label.hidden = true; return; }
    label.hidden = false;
    const cellPx = Math.max(8, c.r * zoomScale()), lw = label.offsetWidth || 190, lh = label.offsetHeight || 48;
    let left = p.x + cellPx + 12, side = 'right';
    if (left + lw > sb.width - 10) { left = p.x - cellPx - 12 - lw; side = 'left'; }
    left = clamp(left, 10, Math.max(10, sb.width - lw - 10));
    const top = clamp(p.y - lh / 2, 10, Math.max(10, sb.height - lh - 10));
    label.style.left = `${left}px`; label.style.top = `${top}px`; label.dataset.side = side;
  }

  function updateUrl() {
    const u = new URL(location.href);
    u.searchParams.set('preset', S.preset);
    u.searchParams.set('seed', String(S.seed));
    u.searchParams.set('mag', S.mag.toFixed(1));
    u.searchParams.set('wbc', S.wbcMode);
    u.searchParams.delete('objective');
    history.replaceState(null, '', u);
  }

  function updateStatus(writeUrl = true) {
    if (ui.status) ui.status.textContent = `${recipe().label} · seed ${S.seed} · WBC ${S.wbcMode === 'real' ? 'REAL POC' : 'PROZEDURAL'}`;
    if (ui.objectiveLabel) ui.objectiveLabel.textContent = `${Math.round(S.mag)}×`;
    document.querySelectorAll('[data-objective]').forEach(b => b.classList.toggle('active', Math.abs(Number(b.dataset.objective) - S.mag) < 1));
    document.querySelectorAll('[data-preset]').forEach(b => b.classList.toggle('active', b.dataset.preset === S.preset));
    document.querySelectorAll('[data-wbc-mode]').forEach(b => b.classList.toggle('active', b.dataset.wbcMode === S.wbcMode));
    if (writeUrl) updateUrl();
  }

  function stopInertia() { if (S.inertiaRaf) cancelAnimationFrame(S.inertiaRaf); S.inertiaRaf = 0; }
  function startInertia() {
    stopInertia();
    if (reduceMotion) return;
    let vx = S.panVelocity.x, vy = S.panVelocity.y;
    if (Math.hypot(vx, vy) < .025) return;
    const tick = () => {
      vx *= .88; vy *= .88;
      S.view.x -= vx * 15 / zoomScale(); S.view.y -= vy * 15 / zoomScale();
      clampView(); requestDraw();
      if (Math.hypot(vx, vy) > .015) S.inertiaRaf = requestAnimationFrame(tick); else S.inertiaRaf = 0;
    };
    S.inertiaRaf = requestAnimationFrame(tick);
  }

  function pointerMidpoint() {
    const values = [...S.pointers.values()];
    if (values.length < 2) return null;
    return { x: (values[0].x + values[1].x) / 2, y: (values[0].y + values[1].y) / 2, d: Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y) };
  }

  scope.addEventListener('pointerdown', e => {
    stopInertia();
    scope.setPointerCapture?.(e.pointerId);
    S.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (S.pointers.size === 1) {
      S.drag = { pointerId: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
      S.lastMoveTime = performance.now(); S.panVelocity.x = 0; S.panVelocity.y = 0; scope.classList.add('dragging');
    } else if (S.pointers.size === 2) {
      const m = pointerMidpoint();
      S.pinch = { startMag: S.mag, startDistance: Math.max(1, m.d), anchorWorld: screenToWorld(m.x, m.y) };
      S.drag = null; scope.classList.add('pinching');
    }
  });

  scope.addEventListener('pointermove', e => {
    if (!S.pointers.has(e.pointerId)) return;
    const old = S.pointers.get(e.pointerId);
    S.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (S.pointers.size >= 2 && S.pinch) {
      const m = pointerMidpoint(), factor = m.d / S.pinch.startDistance;
      setMag(S.pinch.startMag * factor, m.x, m.y, S.pinch.anchorWorld);
      return;
    }
    if (!S.drag || S.drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - S.drag.x, dy = e.clientY - S.drag.y;
    if (Math.hypot(e.clientX - old.x, e.clientY - old.y) > 0) {
      const dt = Math.max(8, performance.now() - S.lastMoveTime);
      S.panVelocity.x = S.panVelocity.x * .55 + (dx / dt) * .45;
      S.panVelocity.y = S.panVelocity.y * .55 + (dy / dt) * .45;
      S.lastMoveTime = performance.now();
    }
    if (Math.hypot(dx, dy) > 1.5) S.drag.moved = true;
    S.view.x -= dx / zoomScale(); S.view.y -= dy / zoomScale();
    S.drag.x = e.clientX; S.drag.y = e.clientY;
    clampView(); requestDraw();
  });

  function finishPointer(e) {
    const wasDrag = S.drag && S.drag.pointerId === e.pointerId ? S.drag : null;
    S.pointers.delete(e.pointerId);
    if (S.pointers.size < 2) { S.pinch = null; scope.classList.remove('pinching'); }
    if (S.pointers.size === 0) {
      scope.classList.remove('dragging'); S.drag = null;
      if (wasDrag && !wasDrag.moved) showCell(pickCell(e.clientX, e.clientY));
      else if (wasDrag) startInertia();
    } else if (S.pointers.size === 1) {
      const [id, p] = S.pointers.entries().next().value;
      S.drag = { pointerId: id, x: p.x, y: p.y, moved: true };
    }
  }

  scope.addEventListener('pointerup', finishPointer);
  scope.addEventListener('pointercancel', finishPointer);

  scope.addEventListener('wheel', e => {
    e.preventDefault(); stopInertia();
    const b = canvasRect();
    const px = clamp(e.clientX, b.left, b.right), py = clamp(e.clientY, b.top, b.bottom);
    const anchor = screenToWorld(px, py);
    const modeScale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? b.height : 1;
    const dy = e.deltaY * modeScale;
    const next = S.mag * Math.exp(-dy * .00135);
    setMag(next, px, py, anchor);
  }, { passive: false });

  document.querySelectorAll('[data-objective]').forEach(btn => btn.addEventListener('click', () => {
    const b = canvasRect();
    setMag(Number(btn.dataset.objective), b.left + b.width / 2, b.top + b.height / 2);
    updateStatus();
  }));

  document.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
    S.preset = btn.dataset.preset; S.view.x = WORLD.w / 2; S.view.y = WORLD.h / 2; generateField(); updateStatus();
  }));

  document.querySelectorAll('[data-wbc-mode]').forEach(btn => btn.addEventListener('click', () => {
    S.wbcMode = btn.dataset.wbcMode === 'procedural' ? 'procedural' : 'real';
    generateField(); updateStatus();
  }));

  ui.focus?.addEventListener('input', () => {
    S.focus = Number(ui.focus.value);
    if (ui.focusLabel) ui.focusLabel.textContent = S.focus.toFixed(1);
    canvas.style.filter = `blur(${S.focus * .38}px)`;
  });

  document.getElementById('resetView')?.addEventListener('click', () => {
    stopInertia(); S.view.x = WORLD.w / 2; S.view.y = WORLD.h / 2; S.mag = 100;
    if (ui.focus) { ui.focus.value = '0'; ui.focus.dispatchEvent(new Event('input')); }
    clampView(); updateStatus(); requestDraw();
  });

  document.getElementById('newSeed')?.addEventListener('click', () => {
    stopInertia(); S.seed = Math.floor(Math.random() * 999999) + 1; S.view.x = WORLD.w / 2; S.view.y = WORLD.h / 2; generateField(); updateStatus();
  });

  function preloadAssets() {
    for (const [id, asset] of Object.entries(CELL_ASSETS)) {
      const img = new Image();
      img.crossOrigin = 'anonymous'; img.decoding = 'async';
      img.onload = () => { assetImages.set(id, img); requestDraw(); };
      img.onerror = () => { assetImages.set(id, null); requestDraw(); };
      img.src = asset.src;
    }
  }

  const ro = new ResizeObserver(resizeCanvas);
  ro.observe(scope);
  preloadAssets();
  generateField();
  requestAnimationFrame(resizeCanvas);
})();
