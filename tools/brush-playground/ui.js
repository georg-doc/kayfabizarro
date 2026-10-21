/* KFB Brush Playground · ui.js
 * Procreate's interface as a blueprint (canvas first, tools top right, size/opacity left,
 * Brush Library, Brush Studio, colour panel with palettes), drawn in KFB materials.
 * All rendering, import and history live in engine.js (window.KFBEngine).
 */
(function () {
  'use strict';
  const E = window.KFBEngine, C = E.C;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('kfb.brush-playground.' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem('kfb.brush-playground.' + k, JSON.stringify(v)); } catch (_) { /* private mode: fine */ } }
  };

  /* ---------------- status toast ---------------- */
  let toastTimer = 0;
  function status(msg, err) {
    const el = $('status'); el.textContent = msg; el.className = err ? 'err' : '';
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.add('hide'), err ? 9000 : 5000);
  }

  /* ---------------- popovers ---------------- */
  const pops = { actions: ['popActions', 'btnActions'], brushes: ['popBrushes', null], color: ['popColor', 'btnColor'], layers: ['popLayers', 'btnLayers'] };
  let openPop = null;
  function open(name) {
    closeAll(name === 'studio' ? null : undefined);
    if (name === 'studio') { openStudio(); return; }
    const [pid, bid] = pops[name]; $(pid).classList.add('open'); if (bid) $(bid).setAttribute('aria-expanded', 'true');
    openPop = name;
    if (name === 'brushes') { const cur = E.brushes.get(E.currentId); if (cur && !cur.builtin) libSet = cur.setName || ''; $('libSearch').value = ''; renderLibrary(); }
    if (name === 'color') { renderDisc(); renderPalettes(); }
    if (name === 'layers') { layerOpts = null; renderLayers(); }
  }
  function closeAll() {
    for (const k in pops) { const [pid, bid] = pops[k]; $(pid).classList.remove('open'); if (bid) $(bid).setAttribute('aria-expanded', 'false'); }
    if (openPop === 'color') commitRecent();
    openPop = null;
  }
  function toggle(name) { if (openPop === name) closeAll(); else open(name); }
  $('btnActions').onclick = () => toggle('actions');
  $('btnColor').onclick = () => toggle('color');
  $('btnLayers').onclick = () => toggle('layers');
  document.addEventListener('pointerdown', e => {
    if (!openPop) return;
    const [pid, bid] = pops[openPop];
    if ($(pid).contains(e.target) || (bid && $(bid).contains(e.target)) || e.target.closest('#brushMode,#eraser')) return;
    closeAll();
  }, true);
  for (const tabs of document.querySelectorAll('.tabs')) {
    tabs.addEventListener('click', e => {
      const t = e.target.closest('.tab'); if (!t) return;
      const root = tabs.parentElement;
      for (const x of tabs.querySelectorAll('.tab')) x.setAttribute('aria-selected', x === t);
      for (const p of root.querySelectorAll('[data-panel]')) p.hidden = p.dataset.panel !== t.dataset.tab;
      if (t.dataset.tab === 'disc') renderDisc();
      if (t.dataset.tab === 'palettes') renderPalettes();
    });
  }
  function showTab(popId, tab) { const t = document.querySelector('#' + popId + ' .tab[data-tab="' + tab + '"]'); if (t) t.click(); }

  /* ---------------- tools ---------------- */
  function setTool(t) {
    E.state.tool = t;
    $('brushMode').setAttribute('aria-pressed', t === 'brush');
    $('eraser').setAttribute('aria-pressed', t === 'eraser');
    $('eyedrop').setAttribute('aria-pressed', t === 'pick');
    document.body.classList.toggle('picking', t === 'pick');
  }
  let lastPaintTool = 'brush';
  function toolButton(t) {
    if (E.state.tool === t) { toggle('brushes'); return; } // tap the active tool again → Brush Library (Procreate habit)
    lastPaintTool = t; setTool(t); closeAll();
  }
  $('brushMode').onclick = () => toolButton('brush');
  $('eraser').onclick = () => toolButton('eraser');
  $('eyedrop').onclick = () => setTool(E.state.tool === 'pick' ? lastPaintTool : 'pick');

  /* ---------------- vertical sliders (size: logarithmic px, opacity: linear) ---------------- */
  function vslider(el, input, toPos, fromPos, fmt, onChange) {
    const fill = el.querySelector('.fill'), knob = el.querySelector('.knob'), bubble = el.querySelector('.bubble');
    function paint() {
      const p = clamp(toPos(Number(input.value)), 0, 1);
      fill.style.height = (p * 100) + '%'; knob.style.bottom = (p * 100) + '%'; bubble.style.bottom = (p * 100) + '%';
      bubble.textContent = fmt(Number(input.value)); el.setAttribute('aria-valuenow', input.value);
    }
    function setFromY(y) {
      const r = el.getBoundingClientRect(), p = clamp(1 - (y - r.top) / r.height, 0, 1);
      input.value = fromPos(p); input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); el.classList.add('active'); setFromY(e.clientY); });
    el.addEventListener('pointermove', e => { if (el.hasPointerCapture(e.pointerId)) setFromY(e.clientY); });
    el.addEventListener('pointerup', () => el.classList.remove('active'));
    el.addEventListener('keydown', e => {
      const p = toPos(Number(input.value)), d = e.key === 'ArrowUp' ? 0.03 : e.key === 'ArrowDown' ? -0.03 : 0;
      if (d) { e.preventDefault(); input.value = fromPos(clamp(p + d, 0, 1)); input.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    input.addEventListener('input', () => { onChange(Number(input.value)); paint(); });
    onChange(Number(input.value)); paint();
    return paint;
  }
  const LOG = Math.log(400 / 2);
  vslider($('sizeSlider'), $('size'), v => Math.log(v / 2) / LOG, p => Math.round(2 * Math.exp(p * LOG)), v => Math.round(v) + ' px', v => { E.state.size = v; });
  vslider($('opacitySlider'), $('opacity'), v => (v - 0.05) / 0.95, p => (0.05 + p * 0.95).toFixed(2), v => Math.round(v * 100) + ' %', v => { E.state.opacity = v; });
  function setSize(px) { $('size').value = px; $('size').dispatchEvent(new Event('input', { bubbles: true })); }

  /* ---------------- engine events ---------------- */
  E.on('history', h => { $('undo').disabled = !h.canUndo; $('redo').disabled = !h.canRedo; $('hudStrokes').textContent = 'strokes ' + h.strokes; });
  E.on('hud', h => {
    $('hudInput').textContent = 'input ' + h.input + (h.simulated ? ' (simulated pressure)' : '');
    $('hudP').textContent = 'pressure ' + h.pressure.toFixed(2);
    $('hudTilt').textContent = 'tilt ' + (h.tilt == null ? '–' : h.tilt + '°');
    if (h.speed != null) $('hudSpeed').textContent = 'speed ' + h.speed.toFixed(2) + ' screen px/ms';
  });
  E.on('warn', msg => status(msg, true));
  E.on('layers', info => {
    const L = info.layers.find(l => l.id === info.active);
    $('hudLayer').textContent = L ? L.name + (L.visible ? '' : ' (hidden)') : '–';
    $('dark').checked = info.bg.color === E.PAPER_DARK;
    if ($('popLayers').classList.contains('open')) scheduleLayers();
  });
  E.on('pick', hex => { setColor(hex); commitRecent(); setTool(lastPaintTool); status('Picked ' + hex); });
  E.on('select', () => { renderLibrary(); renderStudio(); paintColorUI(); });
  E.on('params', id => { previewCache.delete(id); if (id === E.currentId) { refreshStudioState(); schedulePad(); } });
  E.on('compare', c => {
    const sc = $('simCanvas'); if (!sc) return;
    sc.width = c.sim.width; sc.height = c.sim.height;
    const x = sc.getContext('2d'); x.fillStyle = E.PAPER_DARK; x.fillRect(0, 0, sc.width, sc.height); x.drawImage(c.sim, 0, 0);
    const label = { silhouetteIoU: 'Silhouette overlap (IoU)', areaRatio: 'Area sim / ref', meanAlphaRef: 'Mean alpha · Procreate', meanAlphaSim: 'Mean alpha · simulation',
      alphaStdRef: 'Texture σ · Procreate', alphaStdSim: 'Texture σ · simulation', widthProfileError: 'Width profile error', assumedSpeedPxMs: 'Assumed speed px/ms', grain: 'Grain source' };
    $('metrics').innerHTML = Object.keys(label).map(k => '<tr><td>' + label[k] + '</td><td>' + esc(c.metrics[k]) + '</td></tr>').join('');
  });

  undoBtn(); function undoBtn() { $('undo').onclick = () => E.undo(); $('redo').onclick = () => E.redo(); }
  $('clear').onclick = () => { if (E.clearLayer()) status('Layer cleared · undo brings it back'); closeAll(); };
  $('png').onclick = () => { E.download(false); closeAll(); };
  $('pngOpaque').onclick = () => { E.download(true); closeAll(); };
  $('saveSession').onclick = () => { E.downloadBlob(new Blob([E.sessionJSON()], { type: 'application/json' }), 'georg-brush-playground-drawing.json'); closeAll(); };
  $('dark').onchange = () => { E.setBackground({ color: $('dark').checked ? E.PAPER_DARK : E.PAPER, visible: true }); };
  $('righthand').checked = !!store.get('righthand', false);
  document.body.classList.toggle('righthand', $('righthand').checked);
  $('righthand').onchange = () => { document.body.classList.toggle('righthand', $('righthand').checked); store.set('righthand', $('righthand').checked); };
  $('mouseP').oninput = () => { E.state.mousePressure = Number($('mouseP').value); $('mousePOut').value = E.state.mousePressure.toFixed(2); };

  /* ---------------- import ---------------- */
  async function importFiles(files) {
    for (const f of files) {
      try {
        status('Reading ' + f.name + ' locally…');
        const r = await E.importFile(f, (i, n) => { if (n > 1) status('Reading ' + f.name + ' locally · brush ' + i + ' / ' + n + '…'); });
        if (r.added.length) { if (r.kind === 'brushset') libSet = r.setName; E.setCurrent(r.added[0].id); } else renderLibrary();
        const sk = r.skipped.length ? ' · skipped ' + r.skipped.length + ': ' + r.skipped.map(x => x.reason).join('; ') : '';
        if (r.kind === 'brushset' && !r.added.length && !r.duplicates) status('Import error (' + f.name + '): no usable brush in this set' + sk, true);
        else if (r.kind === 'brushset') status('Loaded set “' + r.setName + '” from ' + f.name + ': ' + r.added.length + ' brushes' + (r.duplicates ? ', ' + r.duplicates + ' already imported' : '') + sk + '. Dynamics are a heuristic simulation.');
        else {
          const b = r.added[0] || null;
          status(b ? 'Loaded “' + b.name + '” locally from ' + f.name + ' · ' + b.fields + ' archive fields decoded · shape ' + b.shape.width + '×' + b.shape.height +
            (b.grain ? ' · ' + (b.grain.source === 'file' ? 'grain from file' : 'grain is a labelled substitute') : '') + '. Dynamics are a heuristic simulation.' : f.name + ' is already imported.');
        }
      } catch (err) { status('Import error (' + f.name + '): ' + err.message, true); }
    }
  }
  for (const id of ['file', 'file2']) $(id).onchange = e => { const fs = Array.from(e.target.files || []); e.target.value = ''; closeAllExcept('brushes'); importFiles(fs); };
  function closeAllExcept(name) { if (openPop && openPop !== name) closeAll(); }
  $('loadSession').onchange = async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; closeAll();
    try { if (f.size > 50e6) throw Error('File too large'); const n = E.loadSession(await f.text()); status('Loaded drawing ' + f.name + ': ' + n + ' actions replayed.'); }
    catch (err) { status('Load error: ' + err.message, true); }
  };

  /* ---------------- Brush Library ---------------- */
  let libSet = null; // set name, '' = single brushes, null = first available
  const previewCache = new Map(); // id -> {key, url}
  const imported = () => [...E.brushes.values()].filter(b => !b.builtin);
  function setsOf(list) {
    const m = new Map();
    for (const b of list) { const k = b.setName || ''; m.set(k, (m.get(k) || 0) + 1); }
    return m;
  }
  function previewKey(b) { return JSON.stringify([E.overrides.get(b.id) || null, b.grainIdx]); }
  const previewQueue = []; let previewBusy = false;
  function queuePreview(b, canvas) { previewQueue.push([b, canvas]); if (!previewBusy) { previewBusy = true; setTimeout(drainPreviews, 0); } }
  function drainPreviews() {
    const t0 = performance.now();
    while (previewQueue.length && performance.now() - t0 < 24) {
      const [b, c] = previewQueue.shift(); if (!c.isConnected) continue;
      E.renderPreview(b.id, c, { color: '#f3ead3', size: c.height * 0.36, flat: true });
      previewCache.set(b.id, { key: previewKey(b), img: c });
    }
    if (previewQueue.length) setTimeout(drainPreviews, 0); else previewBusy = false;
  }
  function renderLibrary() {
    const all = imported(), sets = setsOf(all), q = $('libSearch').value.trim().toLowerCase();
    if (libSet == null || !sets.has(libSet)) libSet = sets.size ? [...sets.keys()][0] : null;
    const ul = $('libSets'); ul.innerHTML = '';
    for (const [k, n] of sets) {
      const li = document.createElement('li'); li.setAttribute('role', 'option'); li.setAttribute('aria-selected', !q && k === libSet);
      li.innerHTML = esc(k || 'Single brushes') + '<span>' + n + '</span>';
      li.onclick = () => { libSet = k; $('libSearch').value = ''; renderLibrary(); };
      ul.appendChild(li);
    }
    const list = q ? all.filter(b => (b.name + ' ' + (b.setName || '') + ' ' + b.fileName).toLowerCase().includes(q)) : all.filter(b => (b.setName || '') === libSet);
    const lib = $('lib'); lib.innerHTML = '';
    if (!all.length) { lib.innerHTML = '<li class="empty">No brushes yet. Use + to import a Procreate .brush or .brushset. It stays on this device.</li>'; return; }
    if (!list.length) { lib.innerHTML = '<li class="empty">No brush matches “' + esc(q) + '”.</li>'; return; }
    for (const b of list) {
      const li = document.createElement('li'); li.setAttribute('role', 'option'); li.setAttribute('aria-selected', b.id === E.currentId); li.dataset.id = b.id;
      const c = document.createElement('canvas'); c.width = 520; c.height = 92;
      li.appendChild(c);
      li.insertAdjacentHTML('beforeend', '<b>' + esc(b.name) + '</b><small>' + esc((q && b.setName ? b.setName + ' · ' : '') + b.fileName) + '</small>');
      li.onclick = () => { if (b.id === E.currentId) open('studio'); else E.setCurrent(b.id); };
      lib.appendChild(li);
      if ($('popBrushes').classList.contains('open')) queuePreview(b, c);
    }
  }
  $('libSearch').oninput = () => renderLibrary();
  $('openStudio').onclick = () => { if (E.currentId) open('studio'); else status('Import or select a brush first', true); };

  /* ---------------- colour ---------------- */
  let hsv = C.rgbToHsv(...C.fromHex(E.state.color)), prevColor = '#f3ead3', recent = store.get('recent', []);
  function setColor(hex, keepHsv) {
    const rgb = C.fromHex(hex); if (!rgb) return;
    hex = C.toHex(...rgb);
    if (hex !== E.state.color) prevColor = E.state.color;
    E.state.color = hex;
    if (!keepHsv) { const h = C.rgbToHsv(...rgb); if (h[1] === 0 || h[2] === 0) h[0] = hsv[0]; if (h[2] === 0) h[1] = hsv[1]; hsv = h; }
    paintColorUI();
  }
  function setHsv(h, s, v) { hsv = [h, s, v]; setColor(C.toHex(...C.hsvToRgb(h, s, v)), true); }
  function paintColorUI() {
    const c = E.state.color;
    $('btnColor').style.background = c; $('cCur').style.background = c; $('cPrev').style.background = prevColor; $('cHex').textContent = c;
    if (document.activeElement !== $('hex')) $('hex').value = c;
    $('color').value = c;
    $('hH').value = Math.round(hsv[0] * 360); $('hS').value = Math.round(hsv[1] * 100); $('hB').value = Math.round(hsv[2] * 100);
    $('hHo').value = $('hH').value + '°'; $('hSo').value = $('hS').value + '%'; $('hBo').value = $('hB').value + '%';
    if ($('popColor').classList.contains('open')) renderDisc();
    schedulePad();
  }
  function commitRecent() {
    const c = E.state.color; recent = [c].concat(recent.filter(x => x !== c)).slice(0, 10); store.set('recent', recent); renderRecent();
  }
  function renderRecent() {
    $('recent').innerHTML = recent.length ? recent.map(c => '<button class="sw" style="background:' + c + '" data-c="' + c + '" title="' + c + '"></button>').join('') : '<span class="note" style="margin:0">Recent colours appear here.</span>';
  }
  $('recent').onclick = e => { const b = e.target.closest('[data-c]'); if (b) setColor(b.dataset.c); };
  $('cPrev').onclick = () => setColor(prevColor);
  $('color').addEventListener('input', () => setColor($('color').value));
  $('hex').addEventListener('change', () => { const v = $('hex').value.trim(); if (C.fromHex(v)) { setColor(v.startsWith('#') ? v : '#' + v); commitRecent(); } else $('hex').value = E.state.color; });
  for (const id of ['hH', 'hS', 'hB']) $(id).addEventListener('input', () => setHsv(Number($('hH').value) / 360, Number($('hS').value) / 100, Number($('hB').value) / 100));

  /* disc: hue ring around a saturation/brightness square */
  const disc = $('disc'), D = disc.width, RO = D / 2 - 6, RI = RO - 44, SQ = RI * 1.32;
  function renderDisc() {
    const x = disc.getContext('2d'); x.clearRect(0, 0, D, D);
    const cg = x.createConicGradient(-Math.PI / 2, D / 2, D / 2);
    for (let i = 0; i <= 12; i++) { const [r, g, b] = C.hsvToRgb(i / 12, 1, 1); cg.addColorStop(i / 12, 'rgb(' + r + ',' + g + ',' + b + ')'); }
    x.beginPath(); x.arc(D / 2, D / 2, RO, 0, Math.PI * 2); x.arc(D / 2, D / 2, RI, 0, Math.PI * 2, true); x.fillStyle = cg; x.fill('evenodd');
    const s0 = D / 2 - SQ / 2, [hr, hg, hb] = C.hsvToRgb(hsv[0], 1, 1);
    x.fillStyle = 'rgb(' + hr + ',' + hg + ',' + hb + ')'; x.fillRect(s0, s0, SQ, SQ);
    const gw = x.createLinearGradient(s0, 0, s0 + SQ, 0); gw.addColorStop(0, '#fff'); gw.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gw; x.fillRect(s0, s0, SQ, SQ);
    const gb = x.createLinearGradient(0, s0, 0, s0 + SQ); gb.addColorStop(0, 'rgba(0,0,0,0)'); gb.addColorStop(1, '#000'); x.fillStyle = gb; x.fillRect(s0, s0, SQ, SQ);
    const a = hsv[0] * Math.PI * 2 - Math.PI / 2, rm = (RO + RI) / 2;
    ring(x, D / 2 + Math.cos(a) * rm, D / 2 + Math.sin(a) * rm, 17);
    ring(x, s0 + hsv[1] * SQ, s0 + (1 - hsv[2]) * SQ, 13);
  }
  function ring(x, cx, cy, r) { x.lineWidth = 4; x.strokeStyle = '#fff'; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke(); x.lineWidth = 1.5; x.strokeStyle = '#0009'; x.beginPath(); x.arc(cx, cy, r + 2.5, 0, Math.PI * 2); x.stroke(); }
  let discMode = null;
  function discAt(e, start) {
    const r = disc.getBoundingClientRect(), px = (e.clientX - r.left) * D / r.width, py = (e.clientY - r.top) * D / r.height;
    const dx = px - D / 2, dy = py - D / 2, d = Math.hypot(dx, dy), s0 = D / 2 - SQ / 2;
    if (start) discMode = d >= RI - 4 && d <= RO + 6 ? 'ring' : (px >= s0 - 6 && px <= s0 + SQ + 6 && py >= s0 - 6 && py <= s0 + SQ + 6 ? 'square' : null);
    if (discMode === 'ring') setHsv(((Math.atan2(dy, dx) + Math.PI / 2) / (Math.PI * 2) + 1) % 1, hsv[1], hsv[2]);
    else if (discMode === 'square') setHsv(hsv[0], clamp((px - s0) / SQ, 0, 1), clamp(1 - (py - s0) / SQ, 0, 1));
  }
  disc.addEventListener('pointerdown', e => { disc.setPointerCapture(e.pointerId); discAt(e, true); });
  disc.addEventListener('pointermove', e => { if (disc.hasPointerCapture(e.pointerId)) discAt(e); });
  disc.addEventListener('pointerup', () => { if (discMode) commitRecent(); discMode = null; });

  /* palettes: KFB washes and inks as defaults, imported .swatches, export of the current one */
  const DEFAULT_PALETTES = [
    { name: 'KFB Washes', colors: ['#e9c14a', '#c2412c', '#6b4e7d', '#3e6a83', '#7a8d4a', '#d97c3a', '#a64670', '#4f8a85', '#b8361f', '#f0c948', '#2c4f6e'] },
    { name: 'KFB Inks & Papers', colors: ['#1f1a14', '#3a342a', '#7d7364', '#f3ead3', '#ece1c0', '#dfcd9e', '#c8b889', '#ffffff'] }
  ];
  let palettes = store.get('palettes', null) || DEFAULT_PALETTES.map(p => ({ name: p.name, colors: p.colors.slice() }));
  let currentPal = clamp(store.get('currentPalette', 0), 0, palettes.length - 1);
  const savePalettes = () => { store.set('palettes', palettes); store.set('currentPalette', currentPal); };
  function renderPalettes() {
    const box = $('palettes'); box.innerHTML = '';
    palettes.forEach((p, i) => {
      const d = document.createElement('div'); d.className = 'palette'; d.setAttribute('aria-current', i === currentPal);
      const cells = []; for (let k = 0; k < 30; k++) { const c = p.colors[k]; cells.push(c ? '<button class="sw" style="background:' + c + '" data-c="' + c + '" title="' + c + '"></button>' : '<span class="sw empty"></span>'); }
      d.innerHTML = '<div class="ph"><b>' + esc(p.name) + '</b><button class="pill" data-act="add" title="Add the current colour">+ colour</button>' +
        (i === currentPal ? '<span class="chip h">default</span>' : '<button class="pill" data-act="use">Set default</button>') +
        (palettes.length > 1 ? '<button class="iconbtn" data-act="del" title="Remove palette"><svg><use href="#i-trash"/></svg></button>' : '') + '</div><div class="grid">' + cells.join('') + '</div>';
      d.onclick = e => {
        const sw = e.target.closest('[data-c]'); if (sw) { setColor(sw.dataset.c); commitRecent(); return; }
        const act = e.target.closest('[data-act]'); if (!act) return;
        if (act.dataset.act === 'add') { const k = p.colors.findIndex(c => !c); if (k >= 0) p.colors[k] = E.state.color; else if (p.colors.length < 30) p.colors.push(E.state.color); else { status('Palette is full (30)', true); return; } }
        if (act.dataset.act === 'use') currentPal = i;
        if (act.dataset.act === 'del') { palettes.splice(i, 1); currentPal = Math.min(currentPal, palettes.length - 1); }
        savePalettes(); renderPalettes();
      };
      box.appendChild(d);
    });
  }
  $('palNew').onclick = () => { palettes.push({ name: 'Palette ' + (palettes.length + 1), colors: [E.state.color] }); currentPal = palettes.length - 1; savePalettes(); renderPalettes(); };
  async function importSwatches(files) {
    for (const f of files) {
      try {
        if (f.size > 5e6) throw Error('file too large');
        const list = C.parseSwatches(new Uint8Array(await f.arrayBuffer()), window.fflate);
        for (const p of list) palettes.push({ name: p.name, colors: p.colors.slice(0, 30) });
        currentPal = palettes.length - 1; savePalettes(); renderPalettes();
        status('Imported palette' + (list.length > 1 ? 's' : '') + ' “' + list.map(p => p.name).join('”, “') + '” from ' + f.name + ' (' + list.reduce((n, p) => n + p.colors.filter(Boolean).length, 0) + ' colours).');
      } catch (err) { status('Palette error (' + f.name + '): ' + err.message, true); }
    }
  }
  for (const id of ['swatchFile', 'swatchFile2']) $(id).onchange = e => { const fs = Array.from(e.target.files || []); e.target.value = ''; importSwatches(fs); if (id === 'swatchFile') { closeAll(); open('color'); showTab('popColor', 'palettes'); } };
  $('swatchExport').onclick = () => {
    const p = palettes[currentPal]; if (!p) return;
    E.downloadBlob(new Blob([C.buildSwatches(p.name, p.colors, window.fflate)], { type: 'application/zip' }), p.name.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_') + '.swatches');
    closeAll();
  };

  /* ---------------- Brush Studio ----------------
     Section names follow Procreate's Brush Studio. Each control says what it is here:
     heuristic = our simulation of the decoded value, not simulated = decoded and shown only. */
  const R = (key, label, min, max, fields, extra) => Object.assign({ key, label, min, max, fields, kind: 'range' }, extra || {});
  const B = (key, label, fields, extra) => Object.assign({ key, label, fields, kind: 'bool' }, extra || {});
  const SECTIONS = [
    { id: 'stroke', name: 'Stroke path', lead: 'How stamps are laid along the stroke.', sim: true, controls: [R('spacing', 'Spacing', 0.02, 1, ['plotSpacing']), R('jitter', 'Jitter', 0, 0.5, ['plotJitter'])], ro: ['dynamicsFalloff', 'plotSpacingVersion'] },
    { id: 'stab', name: 'Stabilization', lead: 'StreamLine smooths the path before stamping.', sim: true, controls: [R('smoothing', 'StreamLine', 0, 0.95, ['plotSmoothing'])], ro: ['dynamicsPressureSmoothing'] },
    { id: 'taper', name: 'Taper', lead: 'Start and end of the stroke. Lengths use 600 px per Procreate unit (heuristic).', sim: true, controls: [R('taperStart', 'Start length', 0, 0.3, ['taperStartLength']), R('taperEnd', 'End length', 0, 0.3, ['taperEndLength']), R('taperSize', 'Size', 0, 1, ['taperSize']), R('taperOpacity', 'Opacity', 0, 1, ['taperOpacity'])], ro: ['taperPressure', 'taperShape', 'taperSizeLinked', 'pencilTaperStartLength', 'pencilTaperEndLength', 'pencilTaperSize', 'pencilTaperOpacity', 'pencilTaperShape'] },
    { id: 'shape', name: 'Shape', lead: 'The stamp. Shown as stored in the file and as the alpha stamp derived from it.', sim: true, iso: 'shape', controls: [R('scatter', 'Scatter', 0, 1, ['shapeScatter']), R('rotation', 'Rotation (follow stroke)', -1, 1, ['shapeRotation'])], ro: ['shapeInverted', 'shapeRandomise', 'shapeOrientation', 'shapeAzimuth', 'shapeCount', 'shapeCountJitter', 'shapeRoundness', 'shapeFlipXJitter', 'shapeFlipYJitter', 'shapeFilter'] },
    { id: 'grain', name: 'Grain', lead: 'Texture inside the stroke, applied in canvas space (texturized).', sim: true, iso: 'grain', controls: [R('grainStrength', 'Depth', 0, 1, ['grainDepth']), R('grainScale', 'Scale', 0.1, 4, ['textureScale'])], ro: ['textureMovement', 'textureZoom', 'textureRotation', 'textureOrientation', 'textureInverted', 'textureBrightness', 'textureContrast', 'grainBlendMode', 'textureFilter'] },
    { id: 'render', name: 'Rendering', lead: 'How stamps combine inside one stroke.', sim: true, controls: [B('glazeUniform', 'Uniform glaze (no build-up)', ['dynamicsGlazeType', 'renderingMaxTransfer']), R('flow', 'Flow', 0.05, 1, ['dynamicsGlazeFlow', 'dynamicsGlazedFlow'])], ro: ['blendMode', 'wetEdgesAmount', 'burntEdgesAmount', 'burntEdgesBlendMode', 'renderingModulatedTransfer', 'renderingRecursiveMixing', 'blendGammaCorrect'] },
    { id: 'wet', name: 'Wet mix', lead: 'Paint mixing with the canvas. Not simulated in this playground.', sim: false, controls: [], ro: ['dynamicsMix', 'dynamicsLoad', 'dynamicsPressureMix', 'dynamicsWetAccumulation', 'dynamicsMixSoftening', 'dynamicsBlur', 'dynamicsBlurJitter', 'dynamicsWetnessJitter', 'dynamicsSmudgeAccumulation'] },
    { id: 'colordyn', name: 'Color dynamics', lead: 'Colour jitter by stamp, stroke, pressure and tilt. Not simulated.', sim: false, controls: [], ro: ['dynamicsJitterHue', 'dynamicsJitterSaturation', 'dynamicsJitterLightness', 'dynamicsJitterDarkness', 'dynamicsJitterStrokeHue', 'dynamicsJitterStrokeSaturation', 'dynamicsJitterStrokeLightness', 'dynamicsJitterStrokeDarkness', 'dynamicsPressureHue', 'dynamicsPressureSaturation', 'dynamicsPressureBrightness', 'dynamicsTiltHue', 'dynamicsTiltSaturation', 'dynamicsTiltBrightness'] },
    { id: 'dyn', name: 'Dynamics', lead: 'Speed and random jitter. Speed is measured in screen px/ms; “fast” = 4 (heuristic).', sim: true, controls: [R('speedSize', 'Speed · size', -1, 1, ['dynamicsSpeedSize']), R('speedOpacity', 'Speed · opacity', -1, 1, ['dynamicsSpeedOpacity']), R('jitterSize', 'Jitter · size', 0, 1, ['dynamicsJitterSize']), R('jitterOpacity', 'Jitter · opacity', 0, 1, ['dynamicsJitterOpacity'])], ro: [] },
    { id: 'pencil', name: 'Apple Pencil', lead: 'Pressure and tilt from a pen. Mouse and touch use the simulated pressure from Prefs.', sim: true, curve: true, controls: [R('pressureSize', 'Pressure · size', -1, 1, ['dynamicsPressureSize']), R('pressureOpacity', 'Pressure · opacity', -1, 1, ['dynamicsPressureOpacity']), R('tiltAngle', 'Tilt angle', 0, 1, ['dynamicsTiltAngle']), R('tiltSize', 'Tilt · size', 0, 1, ['dynamicsTiltSize']), R('tiltOpacity', 'Tilt · opacity', 0, 1, ['dynamicsTiltOpacity'])], ro: ['dynamicsPressureBleed', 'dynamicsTiltBleed', 'dynamicsPressureResponse', 'attackTilt', 'dynamicsTiltCompression', 'dynamicsTiltGradation'] },
    { id: 'props', name: 'Properties', lead: 'Procreate size and opacity limits. This playground sizes brushes in px from the sidebar.', sim: false, controls: [], ro: ['paintSize', 'paintOpacity', 'maxSize', 'minSize', 'maxOpacity', 'minOpacity', 'previewSize', 'oriented', 'stamp'] },
    { id: 'about', name: 'About this brush', lead: '', sim: true, about: true, controls: [], ro: [] }
  ];
  let section = 'shape';
  const num = v => (typeof v === 'number' ? (Number.isInteger(v) ? String(v) : v.toFixed(3)) : v == null ? '–' : typeof v === 'object' ? (Array.isArray(v) ? '[' + v.length + ']' : '{…}') : String(v));
  function fieldsNote(b, fields) {
    const have = fields.filter(f => f in b.settings);
    return have.length ? have.map(f => f + ' = ' + num(b.settings[f])).join(' · ') : 'not in this archive → default';
  }
  function renderStudio() {
    const b = E.brushes.get(E.currentId), nav = $('snav'), body = $('sbody');
    if (!b) { body.innerHTML = '<p class="lead">Import or select a brush.</p>'; nav.innerHTML = ''; return; }
    $('studioSub').textContent = b.name + (b.setName ? ' · ' + b.setName : '') + ' · ' + b.fileName;
    nav.innerHTML = SECTIONS.map(s => '<li role="tab" data-s="' + s.id + '" class="' + (s.sim ? 'sim' : '') + '" aria-selected="' + (s.id === section) + '"><span class="dot"></span>' + s.name + '</li>').join('');
    const eff = E.effectiveParams(b.id), dec = E.decodedWithGrain(b);
    body.innerHTML = SECTIONS.map(s => {
      let h = '<div data-section="' + s.id + '"' + (s.id === section ? '' : ' hidden') + '><h3>' + s.name + '</h3>' + (s.lead ? '<p class="lead">' + s.lead + '</p>' : '');
      if (s.iso === 'shape') h += '<div class="isorow" id="iso"><figure><canvas id="isoShape" width="256" height="256"></canvas>Shape.png as stored</figure><figure><canvas id="isoMask" class="checker" width="256" height="256"></canvas>Stamp (luminance → alpha)</figure></div>';
      if (s.iso === 'grain') h += '<div class="isorow"><figure><canvas id="isoGrain" class="checker" width="256" height="256"></canvas><span id="isoGrainLabel"></span></figure><figure style="align-self:end"><label class="pill">Replace grain…<input id="grainFile" type="file" accept="image/png,image/jpeg"></label><br><br><span>Load the real Procreate grain image here. Earlier strokes keep their grain.</span></figure></div>';
      if (s.curve) h += '<canvas class="curve" id="curveCanvas" width="300" height="300" aria-label="Pressure curves"></canvas><div class="set readonly"><label>Pressure curves</label><output>' + (b.params.sizeCurve || b.params.opacityCurve ? 'decoded' : 'linear') + '</output><span class="meta"><span class="chip h">heuristic</span> yellow = size, cream = opacity · monotone cubic between Procreate\'s points</span></div>';
      for (const c of s.controls) {
        const v = eff[c.key], edited = Math.abs(Number(v) - Number(dec[c.key])) > 1e-6;
        const chip = edited ? '<span class="chip e">edited</span>' : '<span class="chip h">heuristic</span>';
        if (c.kind === 'bool') h += '<div class="set toggle" data-k="' + c.key + '"><label for="st_' + c.key + '">' + c.label + '</label><input id="st_' + c.key + '" class="switch" type="checkbox"' + (v ? ' checked' : '') + '><span class="meta">' + chip + esc(fieldsNote(b, c.fields)) + '</span></div>';
        else h += '<div class="set" data-k="' + c.key + '"><label for="st_' + c.key + '">' + c.label + '</label><output>' + Number(v).toFixed(2) + '</output><input id="st_' + c.key + '" type="range" min="' + c.min + '" max="' + c.max + '" step="0.01" value="' + v + '"><span class="meta">' + chip + esc(fieldsNote(b, c.fields)) + '</span></div>';
      }
      for (const f of s.ro) if (f in b.settings) h += '<div class="set readonly"><label>' + f + '</label><output>' + esc(num(b.settings[f])) + '</output><span class="meta"><span class="chip n">not simulated</span></span></div>';
      if (s.ro.length && !s.ro.some(f => f in b.settings) && !s.controls.length) h += '<p class="lead">This archive has none of these fields (older Procreate format).</p>';
      if (s.about) h += aboutHtml(b);
      return h + '</div>';
    }).join('');
    drawIso(b); drawCurve(b);
    if ($('grainFile')) $('grainFile').onchange = onGrainFile;
    if ($('compare')) $('compare').onclick = () => { try { const r = E.compare(b.id); status('Compared with the Procreate preview: IoU ' + r.silhouetteIoU + ', width error ' + Math.round(r.widthProfileError * 100) + ' %. Path recovered from the reference, decoded parameters, no fitting.'); } catch (err) { status(err.message, true); } };
    drawReference(b);
    refreshStudioState(); schedulePad();
  }
  function aboutHtml(b) {
    let h = '<div class="set readonly"><label>Name</label><output>' + esc(b.name) + '</output></div>' +
      '<div class="set readonly"><label>Set · file</label><output>' + esc((b.setName || 'single brush') + ' · ' + b.fileName) + '</output></div>' +
      (b.settings.authorName ? '<div class="set readonly"><label>Author</label><output>' + esc(b.settings.authorName) + '</output></div>' : '') +
      '<div class="set readonly"><label>Archive fields · id</label><output>' + b.fields + ' · ' + b.id.slice(6, 14) + '</output></div>';
    if (b.thumb) h += '<h3 style="margin-top:16px">Procreate reference</h3><p class="lead">QuickLook/Thumbnail.png is Procreate\'s own preview stroke. Compare recovers its path and pressure and replays it with the decoded values (no fitting).</p>' +
      '<div class="cmp" id="refBox"><figure><canvas id="refCanvas"></canvas>Procreate preview (from file)</figure><figure><canvas id="simCanvas"></canvas>This simulation, same path</figure></div><p><button class="btn" id="compare">Compare</button></p><table class="metrics" id="metrics"></table>';
    const rows = C.FIELD_STATUS.filter(([k]) => k in b.settings).map(([k, use, st]) => [k, b.settings[k], use, st]);
    if (b.grain && b.grain.source === 'substitute') rows.unshift(['bundledGrainPath', b.params.bundledGrain, 'grain image', 'MISSING · substitute used']);
    if (b.params.bundledShape) rows.unshift(['bundledShapePath', b.params.bundledShape, 'shape image', 'MISSING']);
    h += '<h3 style="margin-top:16px">Decoded fields</h3><table class="params" id="params">' + rows.map(([k, v, use, st]) => '<tr><td>' + k + '</td><td class="v">' + esc(num(v)) + '</td><td>' + use + '</td><td class="s ' + st.split(' ')[0] + '">' + st + '</td></tr>').join('') + '</table>';
    return h;
  }
  function drawContain(canvas, img, bg) {
    const x = canvas.getContext('2d'); x.clearRect(0, 0, canvas.width, canvas.height);
    if (bg) { x.fillStyle = bg; x.fillRect(0, 0, canvas.width, canvas.height); }
    x.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  function drawIso(b) {
    if ($('isoShape')) drawContain($('isoShape'), b.shape);
    if ($('isoMask')) drawContain($('isoMask'), E.tinted(b, E.state.color, b.mips.length - 1));
    const g = $('isoGrain'); if (!g) return;
    const x = g.getContext('2d'); x.clearRect(0, 0, 256, 256);
    if (b.grain) { x.fillStyle = '#1f1a14'; x.fillRect(0, 0, 256, 256); x.globalCompositeOperation = 'destination-in'; x.drawImage(b.grain.canvas, 0, 0, 256, 256); x.globalCompositeOperation = 'source-over'; }
    const lab = $('isoGrainLabel');
    lab.textContent = b.grain ? b.grain.label : (E.isBlankGrain(b.params.bundledGrain) ? 'Procreate blank grain → no texture' : 'No grain in file or settings');
    lab.classList.toggle('missing', !!(b.grain && b.grain.source === 'substitute'));
  }
  function drawReference(b) {
    if (!b.thumb || !$('refCanvas')) return;
    const rc = $('refCanvas'), sc = $('simCanvas'); rc.width = sc.width = b.thumb.width; rc.height = sc.height = b.thumb.height;
    drawContain(rc, b.thumb, E.PAPER_DARK);
    const x = sc.getContext('2d'); x.fillStyle = E.PAPER_DARK; x.fillRect(0, 0, sc.width, sc.height);
  }
  function drawCurve(b) {
    const c = $('curveCanvas'); if (!c) return;
    const x = c.getContext('2d'), S = c.width, m = 18, w = S - 2 * m;
    x.clearRect(0, 0, S, S); x.strokeStyle = '#f3ead322'; x.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { const p = m + w * i / 4; x.beginPath(); x.moveTo(m, p); x.lineTo(S - m, p); x.moveTo(p, m); x.lineTo(p, S - m); x.stroke(); }
    const plot = (pts, col) => {
      const f = C.curveFn(pts); x.strokeStyle = col; x.lineWidth = 3; x.beginPath();
      for (let i = 0; i <= 100; i++) { const u = i / 100, px = m + u * w, py = S - m - f(u) * w; i ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
      if (pts) for (const [u, v] of pts) { x.fillStyle = col; x.beginPath(); x.arc(m + u * w, S - m - v * w, 5, 0, Math.PI * 2); x.fill(); }
    };
    plot(b.params.opacityCurve, '#f3ead3'); plot(b.params.sizeCurve, '#e9c14a');
  }
  function refreshStudioState() {
    const b = E.brushes.get(E.currentId); if (!b || !$('snav').children.length) return;
    const eff = E.effectiveParams(b.id), dec = E.decodedWithGrain(b);
    let any = false;
    for (const s of SECTIONS) {
      const edited = s.controls.some(c => Math.abs(Number(eff[c.key]) - Number(dec[c.key])) > 1e-6);
      any = any || edited;
      const li = $('snav').querySelector('[data-s="' + s.id + '"]'); if (li) li.classList.toggle('edited', edited);
    }
    for (const row of $('sbody').querySelectorAll('.set[data-k]')) {
      const k = row.dataset.k, edited = Math.abs(Number(eff[k]) - Number(dec[k])) > 1e-6, chip = row.querySelector('.chip');
      chip.className = 'chip ' + (edited ? 'e' : 'h'); chip.textContent = edited ? 'edited' : 'heuristic';
      const out = row.querySelector('output'), inp = row.querySelector('input');
      if (inp.type === 'checkbox') inp.checked = !!eff[k]; else { if (document.activeElement !== inp) inp.value = eff[k]; if (out) out.value = Number(eff[k]).toFixed(2); }
    }
    $('resetDyn').disabled = !any && !E.overrides.has(b.id);
  }
  $('snav').onclick = e => {
    const li = e.target.closest('[data-s]'); if (!li) return; section = li.dataset.s;
    for (const x of $('snav').children) x.setAttribute('aria-selected', x === li);
    for (const d of $('sbody').querySelectorAll('[data-section]')) d.hidden = d.dataset.section !== section;
    store.set('studioSection', section);
  };
  $('sbody').addEventListener('input', e => {
    const row = e.target.closest('.set[data-k]'); if (!row || !E.currentId) return;
    const v = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : Number(e.target.value);
    E.setOverride(E.currentId, row.dataset.k, v);
  });
  $('resetDyn').onclick = () => { if (E.currentId) { E.resetOverrides(E.currentId); renderStudio(); status('Brush reset to the values decoded from the file'); } };
  $('studioDone').onclick = () => closeStudio();
  async function onGrainFile(e) {
    const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    try { await E.replaceGrain(f, E.currentId); previewCache.delete(E.currentId); renderStudio(); status('Grain replaced for “' + E.brushes.get(E.currentId).name + '” with ' + f.name + '. Earlier strokes keep their grain.'); }
    catch (err) { status('Grain error: ' + err.message, true); }
  }
  function openStudio(sec) {
    if (!E.currentId) { status('Import or select a brush first', true); return; }
    if (sec) section = sec; else section = store.get('studioSection', section);
    $('studio').classList.add('open'); renderStudio();
  }
  function closeStudio() { $('studio').classList.remove('open'); renderLibrary(); }

  /* drawing pad */
  let padMode = 'swell', padPending = false;
  function schedulePad() { if (!padPending && $('studio').classList.contains('open')) { padPending = true; requestAnimationFrame(drawPad); } }
  function drawPad() {
    padPending = false; const b = E.brushes.get(E.currentId); if (!b) return;
    const pad = $('pad'), dark = padMode === 'dark';
    E.renderPreview(b.id, pad, { background: dark ? E.PAPER_DARK : E.PAPER, color: dark ? E.PAPER : E.state.color, size: clamp(E.state.size, 8, pad.height * 0.4),
      opacity: E.state.opacity, pressure: padMode === 'light' ? 0.25 : null, dt: padMode === 'fast' ? 2 : 14 });
    $('padNote').textContent = { swell: 'pressure swell, slow', light: 'light pressure 0.25', fast: 'fast stroke', dark: 'pressure swell on dark paper' }[padMode] + ' · size ' + Math.round(clamp(E.state.size, 8, pad.height * 0.4)) + ' px';
  }
  document.querySelector('.padopts').onclick = e => { const b = e.target.closest('[data-pad]'); if (b) { padMode = b.dataset.pad; schedulePad(); } };

  /* ---------------- Layers ----------------
     Procreate's panel as blueprint: top layer first, thumbnail, name, blend letter (tap → options), visibility;
     background colour at the bottom. Every change is one undo step. */
  const BLEND_LABEL = { normal: ['N', 'Normal'], multiply: ['M', 'Multiply'], screen: ['S', 'Screen'], overlay: ['O', 'Overlay'], darken: ['D', 'Darken'], lighten: ['L', 'Lighten'],
    'color-burn': ['CB', 'Colour burn'], 'color-dodge': ['CD', 'Colour dodge'], 'hard-light': ['HL', 'Hard light'], 'soft-light': ['SL', 'Soft light'], difference: ['Di', 'Difference'],
    exclusion: ['E', 'Exclusion'], hue: ['H', 'Hue'], saturation: ['Sa', 'Saturation'], color: ['C', 'Colour'], luminosity: ['Lu', 'Luminosity'] };
  let layerOpts = null, layersPending = false;
  function scheduleLayers() { if (!layersPending) { layersPending = true; requestAnimationFrame(() => { layersPending = false; renderLayers(); }); } }
  function guard(fn) { try { return fn(); } catch (err) { status(err.message, true); return false; } }
  function renderLayers() {
    const info = E.layers(), ul = $('layerList');
    $('layerCount').textContent = info.layers.length + ' / ' + info.max;
    $('layerAdd').disabled = info.layers.length >= info.max;
    const keepFocus = document.activeElement && document.activeElement.closest('.lopts') ? document.activeElement.id : null;
    ul.innerHTML = '';
    const top = info.layers.slice().reverse();
    top.forEach((L, k) => {
      const i = info.layers.length - 1 - k; // index from the bottom
      const li = document.createElement('li'); li.className = 'layer' + (L.visible ? '' : ' hidden-layer') + (L.clip ? ' clipped' : ''); li.dataset.id = L.id;
      li.setAttribute('role', 'option'); li.setAttribute('aria-selected', L.id === info.active);
      const [abbr, long] = BLEND_LABEL[L.blend] || ['N', 'Normal'];
      li.innerHTML = '<canvas class="thumb" width="128" height="80"></canvas><span class="lname">' + esc(L.name) + '<small>' + long + (L.opacity < 1 ? ' · ' + Math.round(L.opacity * 100) + ' %' : '') + (L.alphaLock ? ' · alpha lock' : '') + (L.clip ? ' · clipped' : '') + '</small></span>' +
        '<button class="blendbtn" data-act="opts" aria-expanded="' + (layerOpts === L.id) + '" title="Opacity, blend mode and layer actions">' + abbr + '</button>' +
        '<input class="vis" type="checkbox" data-act="vis" title="Visible"' + (L.visible ? ' checked' : '') + ' aria-label="Visible">';
      const t = li.querySelector('canvas').getContext('2d'); t.drawImage(L.canvas, 0, 0, 128, 80);
      ul.appendChild(li);
      if (layerOpts === L.id) {
        const o = document.createElement('li'); o.className = 'lopts'; o.dataset.for = L.id;
        o.innerHTML = '<div class="set"><label for="layerName">Name</label><span></span><input id="layerName" type="text" maxlength="60" value="' + esc(L.name) + '" style="grid-column:1/-1"></div>' +
          '<div class="set"><label for="layerOpacity">Opacity</label><output id="layerOpacityOut">' + Math.round(L.opacity * 100) + ' %</output><input id="layerOpacity" type="range" min="0" max="1" step="0.01" value="' + L.opacity + '"></div>' +
          '<div class="set"><label for="layerBlend">Blend mode</label><span></span><select id="layerBlend" style="grid-column:1/-1">' + E.BLENDS.map(b => '<option value="' + b + '"' + (b === L.blend ? ' selected' : '') + '>' + BLEND_LABEL[b][1] + '</option>').join('') + '</select></div>' +
          '<div class="set toggle"><label for="layerAlpha">Alpha lock<span class="meta" style="display:block">paint only where the layer has paint</span></label><input id="layerAlpha" class="switch" type="checkbox"' + (L.alphaLock ? ' checked' : '') + '></div>' +
          '<div class="set toggle"><label for="layerClip">Clipping mask<span class="meta" style="display:block">' + (i === 0 ? 'needs a layer below' : 'show only where the layer below has paint') + '</span></label><input id="layerClip" class="switch" type="checkbox"' + (L.clip ? ' checked' : '') + (i === 0 ? ' disabled' : '') + '></div>' +
          '<div class="acts"><button id="layerUp"' + (i === info.layers.length - 1 ? ' disabled' : '') + '>Up</button><button id="layerDown"' + (i === 0 ? ' disabled' : '') + '>Down</button>' +
          '<button id="layerDup"' + (info.layers.length >= info.max ? ' disabled' : '') + '>Duplicate</button><button id="layerMerge"' + (i === 0 ? ' disabled' : '') + '>Merge down</button>' +
          '<button id="layerClear">Clear</button><button id="layerDel"' + (info.layers.length === 1 ? ' disabled' : '') + '>Delete</button></div>';
        ul.appendChild(o);
      }
    });
    const bg = document.createElement('li'); bg.className = 'bgrow';
    bg.innerHTML = '<button class="bgsw" id="bgColor" title="Set to the current colour" style="background:' + info.bg.color + '"></button><span class="lname">Background colour<small>tap the swatch for the current colour</small></span>' +
      '<input class="vis" type="checkbox" id="bgVis" title="Visible"' + (info.bg.visible ? ' checked' : '') + ' aria-label="Background visible">';
    ul.appendChild(bg);
    if (keepFocus && $(keepFocus)) $(keepFocus).focus();
  }
  $('layerAdd').onclick = () => guard(() => { E.addLayer(); layerOpts = null; renderLayers(); });
  $('layerList').addEventListener('click', e => {
    if (e.target.id === 'bgColor') { E.setBackground({ color: E.state.color }); return; }
    if (e.target.id === 'bgVis') return;
    const opts = e.target.closest('.lopts');
    if (opts) {
      const id = opts.dataset.for, act = e.target.id;
      if (act === 'layerUp') E.moveLayer(id, 1);
      else if (act === 'layerDown') E.moveLayer(id, -1);
      else if (act === 'layerDup') guard(() => { E.duplicateLayer(id); layerOpts = null; });
      else if (act === 'layerMerge') guard(() => { E.mergeDown(id); layerOpts = null; status('Merged down'); });
      else if (act === 'layerClear') { E.clearLayer(id); status('Layer cleared · undo brings it back'); }
      else if (act === 'layerDel') guard(() => { E.deleteLayer(id); layerOpts = null; });
      else return;
      renderLayers(); return;
    }
    const li = e.target.closest('li.layer'); if (!li) return;
    if (e.target.dataset.act === 'vis') return;
    if (e.target.closest('[data-act="opts"]')) { layerOpts = layerOpts === li.dataset.id ? null : li.dataset.id; E.selectLayer(li.dataset.id); renderLayers(); return; }
    E.selectLayer(li.dataset.id); if (layerOpts && layerOpts !== li.dataset.id) layerOpts = null; renderLayers();
  });
  $('layerList').addEventListener('change', e => {
    if (e.target.id === 'bgVis') { E.setBackground({ visible: e.target.checked }); return; }
    if (e.target.dataset.act === 'vis') { E.setLayer(e.target.closest('li.layer').dataset.id, { visible: e.target.checked }); return; }
    const id = layerOpts; if (!id) return;
    if (e.target.id === 'layerOpacity') E.setLayer(id, { opacity: Number(e.target.value) });
    if (e.target.id === 'layerBlend') E.setLayer(id, { blend: e.target.value });
    if (e.target.id === 'layerAlpha') E.setLayer(id, { alphaLock: e.target.checked });
    if (e.target.id === 'layerClip') guard(() => E.setLayer(id, { clip: e.target.checked }));
    if (e.target.id === 'layerName') E.setLayer(id, { name: e.target.value.trim() });
  });
  $('layerList').addEventListener('input', e => {
    if (e.target.id === 'layerOpacity' && layerOpts) { E.previewLayer(layerOpts, { opacity: Number(e.target.value) }); $('layerOpacityOut').value = Math.round(e.target.value * 100) + ' %'; }
  });

  /* ---------------- keyboard ---------------- */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input[type=text],input[type=search]')) return;
    const mod = e.metaKey || e.ctrlKey, k = e.key.toLowerCase();
    if (e.key === 'Escape') { if ($('studio').classList.contains('open')) closeStudio(); else closeAll(); return; }
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? E.redo() : E.undo(); }
    else if (mod && k === 'y') { e.preventDefault(); E.redo(); }
    else if (!mod && k === 'b') toolButton('brush');
    else if (!mod && k === 'e') toolButton('eraser');
    else if (!mod && k === 'i') $('eyedrop').click();
    else if (!mod && k === 'l') toggle('layers');
    else if (!mod && (e.key === '[' || e.key === ']')) setSize(clamp(Math.round(E.state.size * (e.key === ']' ? 1.12 : 1 / 1.12)), 2, 400));
  });

  /* ---------------- start ---------------- */
  setTool('brush'); setColor(E.state.color); renderRecent(); renderLibrary();

  /* ---------------- test / replay hooks (local only) ---------------- */
  const D2 = E._internal;
  window.KFB = {
    core: C,
    brushes: () => imported().map(b => ({ id: b.id, name: b.name, setName: b.setName, fields: b.fields, shape: [b.shape.width, b.shape.height], grain: b.grain && b.grain.source, grainVersions: b.grains.length, hasReference: !!b.thumb, sizeCurve: !!b.params.sizeCurve, uniform: b.params.glazeUniform })),
    sessionJSON: E.sessionJSON, loadSession: E.loadSession,
    select: id => E.setCurrent(id), current: () => E.currentId,
    history: () => { const { done, undone } = E.history(); return { done: done.length, undone: undone.length, strokes: done.filter(a => a.type === 'stroke').map(a => ({ brushId: a.brushId, points: a.points.length, input: a.input, pmin: Math.min(...a.points.map(p => p.p)), pmax: Math.max(...a.points.map(p => p.p)) })) }; },
    undo: E.undo, redo: E.redo, rebuildMs: () => E.lastRebuildMs,
    pngDataURL: opaque => E.exportCanvas(opaque).toDataURL('image/png'),
    compare: E.compare,
    perf: () => Object.assign({}, E.perf),
    resetPerf: () => Object.assign(E.perf, { frames: 0, frameMsMax: 0, frameMsSum: 0, commitMsMax: 0 }),
    lastStroke: () => JSON.parse(JSON.stringify(D2.done.filter(a => a.type === 'stroke').slice(-1)[0] || null)),
    addStroke: rec => { const r = JSON.parse(JSON.stringify(rec)); r.layerId = r.layerId || E.activeLayer; D2.pushAction(r); },
    flatCanvas: () => E.flatten(null),
    layerCanvas: id => (E.layers().layers.find(l => l.id === id) || {}).canvas,
    layers: () => { const i = E.layers(); return { active: i.active, bg: i.bg, layers: i.layers.map(({ canvas, ...m }) => m) }; },
    brushParams: id => E.decodedWithGrain(E.brushes.get(id)),
    setMode: setTool, setSize, setColor: hex => { setColor(hex); commitRecent(); }, color: () => E.state.color,
    palettes: () => JSON.parse(JSON.stringify({ palettes, current: currentPal })),
    ui: { open, closeAll, openStudio, closeStudio, showTab, section: () => section }
  };
})();
