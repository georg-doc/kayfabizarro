/* eyelid-bench.v2.js — Fork von v1 (unverändert daneben): dazu E2 = eine geschlossene Lidhaut (clay-eyelid.v2.js), GLB-Export,
   Verdeckung auch von hinten und oben. Werkbank für KFB Clay-Lid E1/E2: ein Auge, echte 3D-Ansichten, Netzprüfung, Pixel-Verdeckung.
   Spender und Negativ-Fixture werden unverändert geladen (tools/KFB-ToolBox/eye-actor-studio-v1/*.mjs, PR #159 @33051aa3). */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clayEyelidGeometry, updateClayEyelid, V6, DEFAULTS, CLAY_EYELID_SCHEMA } from './clay-eyelid.v1.js';
import { meshQA } from './mesh-qa.v1.js';
import { clayEyelidSkinGeometry, updateClayEyelidSkin, apertureV6, DEFAULTS2, CLAY_SKIN_SCHEMA } from './clay-eyelid.v2.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { clayLidGeometry } from '../clay-lid.v1.mjs';
import { buildUpperLidVolumeGeometry } from '../upper-lid-volume.v1.mjs';
import { thinClayLidMeshData } from '../thin-clay-lid.v1.mjs';

export const SOURCES = {
  e2: { label: 'E2 · Lidhaut', role: 'Kandidat · eine geschlossene Form', motion: 'e2' },
  e1: { label: 'E1 · Clay-Lid', role: 'TUNE 14.10. · zwei Hälften', motion: 'e1' },
  'clay-lid': { label: 'clay-lid.v1', role: 'Spender · Blob 30201095 · v6-Scharnier', motion: 'hinge' },
  'upper-lid-volume': { label: 'upper-lid-volume.v1', role: 'Spender · Blob f2ac451a · nur Oberlid, cover', motion: 'cover' },
  'thin-clay': { label: 'thin-clay-lid.v1', role: 'Negativ · Blob 79eb8abe · FAIL 14.10.', motion: 'thin' },
};
export const STATES = [
  { k: -1, label: 'weit' }, { k: 0, label: 'Ruhe' }, { k: 0.25, label: '25 %' },
  { k: 0.5, label: '50 %' }, { k: 0.75, label: '75 %' }, { k: 1, label: 'zu' },
];
export const PUPILS = { v6: { label: 'v6 · 1,004 R', shell: () => V6.pupilShell }, max: { label: 'max. erlaubt', shell: (c) => 1 + c - 0.004 }, stress: { label: 'Stress · 1,030 R', shell: () => 1.03 } };
export const GAZE = { mitte: [0, 0], oben: [0, 1], unten: [0, -1], links: [-1, 0], rechts: [1, 0] };
const VIEWS = {
  front: { d: [0, 0, 1], label: 'Vorn' },
  q34: { d: [0.64, 0.2, 0.74], label: '3/4' },
  side: { d: [1, 0.03, 0], label: 'Seite' },
  backTop: { d: [0.18, 0.72, -0.67], label: 'Hinten oben' },
  cut: { d: [1, 0.16, 0.24], label: 'Schnitt bei x = 0', cut: true },
};
const OCC_VIEWS = [
  { label: 'vorn', d: [0, 0, 1] }, { label: '40° links', d: [-0.643, 0, 0.766] }, { label: '40° rechts', d: [0.643, 0, 0.766] },
  { label: '30° oben', d: [0, 0.5, 0.866] }, { label: '30° unten', d: [0, -0.5, 0.866] }, { label: '75° seitlich', d: [0.966, 0, 0.259] },
  { label: 'von oben', d: [0, 1, 0.02] }, { label: 'von hinten', d: [0, 0.05, -1] },
];
const REF_VIEWS = [{ label: 'vorn', d: [0, 0, 1] }, { label: 'seitlich 90°', d: [1, 0, 0.001] }, { label: 'von hinten', d: [0, 0.05, -1] }];
const lidC = (k, upper) => k < 0 ? V6.lidMin : Math.max(upper ? V6.restU : V6.restL, k);
const tick = () => new Promise((r) => setTimeout(r, 0));

export function createBench(host, cb = {}) {
  const st = {
    source: 'e2', closure: 0, gaze: 'mitte', wire: true, pupil: 'v6', shape: 'kugel', slant: 0,
    params: { thickness: DEFAULTS.thickness, outerRound: DEFAULTS.outerRound, bulge: DEFAULTS.bulge, canthus: DEFAULTS.canthus, curve: DEFAULTS.curve },
    p2: { thickness: DEFAULTS2.thickness, outerRound: DEFAULTS2.outerRound, bulge: DEFAULTS2.bulge, cornerOpen: DEFAULTS2.cornerOpen, cornerClosed: DEFAULTS2.cornerClosed, gamma: DEFAULTS2.gamma },
    play: false, speed: 'langsam', focus: null,
  };
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none';
  const labels = document.createElement('div');
  labels.style.cssText = 'position:absolute;inset:0;pointer-events:none';
  host.appendChild(canvas); host.appendChild(labels);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  const scene = new THREE.Scene();
  const bg = new THREE.Color(0xeeeeee);
  scene.background = bg;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a9a9a, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-2.2, 3.4, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35); rim.position.set(3, 1, -3); scene.add(rim);

  // v6-Materialwerte, Fallback-Weg ohne Host-Shader (pet-eye-rig.v6.js build())
  const matW = new THREE.MeshPhysicalMaterial({ color: 0xf3ede2, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.0 });
  const matP = new THREE.MeshPhysicalMaterial({ color: 0x070707, metalness: 0, roughness: 0.45, clearcoat: 1, clearcoatRoughness: 0.11, envMapIntensity: 1.0 });
  const lidCol = new THREE.Color(V6.baseColor).multiplyScalar(0.72); lidCol.offsetHSL(0, 0.05, -0.02);
  const matL = new THREE.MeshStandardMaterial({ color: lidCol, roughness: 0.98, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const matWire = new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true, transparent: true, opacity: 0.26 });
  const matLB = new THREE.MeshBasicMaterial({ color: lidCol.clone().multiplyScalar(0.55), side: THREE.BackSide });
  const matWB = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.BackSide });
  const matPB = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.BackSide });
  const allMats = [matW, matP, matL, matWire, matLB, matWB, matPB];
  const idMat = { w: new THREE.MeshBasicMaterial({ color: 0xff0000 }), p: new THREE.MeshBasicMaterial({ color: 0x00ff00 }), l: new THREE.MeshBasicMaterial({ color: 0x0000ff }) };
  const mkMark = new THREE.PointsMaterial({ color: 0xcc0033, size: 7, sizeAttenuation: false, depthTest: false });

  const actor = new THREE.Group(); scene.add(actor);
  const scGeo = new THREE.SphereGeometry(1, 64, 48);
  const sclera = new THREE.Mesh(scGeo, matW), scleraB = new THREE.Mesh(scGeo, matWB);
  actor.add(sclera, scleraB);
  const pupilPivot = new THREE.Group(); actor.add(pupilPivot);
  const pupil = new THREE.Mesh(undefined, matP), pupilB = new THREE.Mesh(undefined, matPB);
  pupilPivot.add(pupil, pupilB);
  const lidPair = new THREE.Group(); actor.add(lidPair);
  const mkSlot = () => {
    const g = new THREE.Group();
    const solid = new THREE.Mesh(undefined, matL), wire = new THREE.Mesh(undefined, matWire), back = new THREE.Mesh(undefined, matLB);
    g.add(solid, wire, back); lidPair.add(g);
    return { g, solid, wire, back, marks: null };
  };
  const slots = { u: mkSlot(), l: mkSlot() };

  const clrEff = () => Math.max(DEFAULTS.clearance, PUPILS[st.pupil].shell(DEFAULTS.clearance) - 1 + 0.004);
  const pupilShell = () => PUPILS[st.pupil].shell(DEFAULTS.clearance);
  function rebuildPupil() {
    const g = new THREE.SphereGeometry(pupilShell(), 30, 22, 0, Math.PI * 2, 0, V6.capAngle(0.5));
    g.rotateX(Math.PI / 2);
    if (pupil.geometry) pupil.geometry.dispose();
    pupil.geometry = g; pupilB.geometry = g;
  }

  /* ---------- Lidgeometrie je Quelle ---------- */
  const e1Opts = (k, upper) => Object.assign({}, st.params, { upper, clearance: clrEff(), edgeDeg: V6.edgeDeg(lidC(k, upper), upper) });
  const e2Opts = (k) => { const o = Object.assign({}, DEFAULTS2, st.p2, { clearance: clrEff() }); o.aperture = apertureV6(lidC(k, true), lidC(k, false), o); return o; };
  const thinGeo = (upper, k) => {
    const d = thinClayLidMeshData({ upper, blink: Math.max(0, k) });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(d.positions, 3));
    g.setIndex(new THREE.BufferAttribute(d.indices, 1)); g.computeVertexNormals(); g.computeBoundingSphere();
    return g;
  };
  let staticPair = null, cache = new Map(), live = null, liveK = null;
  const isStatic = () => SOURCES[st.source].motion === 'hinge';
  const ulvCover = (k) => k < 0 ? 0 : Math.max(0.16, k);   // Spender-Vorgabe cover 0,16
  function makePair(k) {
    if (st.source === 'e2') return { u: clayEyelidSkinGeometry(THREE, e2Opts(k)), l: null };
    if (st.source === 'e1') return { u: clayEyelidGeometry(THREE, e1Opts(k, true)), l: clayEyelidGeometry(THREE, e1Opts(k, false)) };
    if (st.source === 'thin-clay') return { u: thinGeo(true, k), l: thinGeo(false, k) };
    if (st.source === 'upper-lid-volume') return { u: buildUpperLidVolumeGeometry(THREE, { cover: ulvCover(k) }), l: null };
    if (!staticPair) staticPair = { u: clayLidGeometry(THREE, { upper: true }), l: clayLidGeometry(THREE, { upper: false }) };
    return staticPair;
  }
  function pairFor(k) {
    if (isStatic()) return makePair(0);
    if (!cache.has(k)) cache.set(k, makePair(k));
    return cache.get(k);
  }
  function livePair(k) {
    if (isStatic()) return makePair(0);
    if (!live) { live = makePair(k); liveK = k; return live; }
    if (liveK !== k) {
      if (st.source === 'e2') updateClayEyelidSkin(live.u, e2Opts(k));
      else if (st.source === 'e1') { updateClayEyelid(live.u, e1Opts(k, true)); updateClayEyelid(live.l, e1Opts(k, false)); }
      else {
        const n = makePair(k);
        for (const s of ['u', 'l']) if (live[s] && n[s]) {
          live[s].attributes.position.array.set(n[s].attributes.position.array); live[s].attributes.position.needsUpdate = true; live[s].computeVertexNormals(); live[s].computeBoundingSphere();
        }
        disposePair(n);
      }
      liveK = k;
    }
    return live;
  }
  function hinge(k) {
    const on = st.source === 'clay-lid';
    slots.u.g.rotation.x = on ? -(1.30 - lidC(k, true) * 1.18) : 0;
    slots.l.g.rotation.x = on ? (1.30 - lidC(k, false) * 1.18) : 0;
  }
  const disposePair = (p) => { if (p) { p.u && p.u.dispose(); p.l && p.l.dispose(); } };
  function rebuild() {
    for (const p of cache.values()) disposePair(p);
    cache = new Map(); disposePair(live); live = null; liveK = null; disposePair(staticPair); staticPair = null;
    for (const s of Object.values(slots)) if (s.marks) { s.g.remove(s.marks); s.marks.geometry.dispose(); s.marks = null; }
    marks = {};
    rebuildPupil(); dirty = true;
    scheduleQA();
  }
  function setSlots(pair) {
    for (const s of ['u', 'l']) {
      const g = pair[s], sl = slots[s];
      sl.g.visible = !!g;
      if (g) { sl.solid.geometry = g; sl.wire.geometry = g; sl.back.geometry = g; }
    }
  }

  /* ---------- Zustand anwenden ---------- */
  function applyRig(gaze) {
    const [nx, ny] = GAZE[gaze] || GAZE.mitte;
    pupilPivot.rotation.set(-ny * V6.maxGaze, nx * V6.maxGaze, 0);
    lidPair.rotation.z = -1 * st.slant * V6.slantGain;
    if (st.shape === 'oval') actor.scale.set(1.18, 0.86, 1); else actor.scale.set(1, 1, 1);
  }

  /* ---------- Kacheln ---------- */
  let tiles = [], W = 1, H = 1, dirty = true, marks = {};
  const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  const freeCam = new THREE.PerspectiveCamera(26, 1, 0.1, 50); freeCam.position.set(2.6, 1.4, 5.0);
  const controls = new OrbitControls(freeCam, canvas); controls.enableDamping = true; controls.enablePan = false; controls.minDistance = 2.5; controls.maxDistance = 12;
  controls.addEventListener('change', () => { dirty = true; });
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const t = tiles.find((t) => t.view === 'free');
    controls.enabled = !!t && x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h;
    downAt = [e.clientX, e.clientY];
  }, { capture: true });
  let downAt = null;
  canvas.addEventListener('click', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 4) return;
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const t = tiles.find((t) => t.kind === 'main' && x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h);
    if (!t || (t.view === 'free' && !st.focus)) return;
    st.focus = st.focus ? null : t.view; layout(); cb.onState && cb.onState();
  });

  function layout() {
    const r = host.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    const g = 6, topH = Math.round(H * 0.6), cw = (W - g * 4) / 3, chh = (topH - g * 3) / 2;
    tiles = [];
    const main = ['free', 'front', 'q34', 'side', 'backTop', 'cut'];
    if (st.focus && main.includes(st.focus)) tiles.push({ kind: 'main', view: st.focus, x: g, y: g, w: W - 2 * g, h: topH - 2 * g });
    else main.forEach((v, i) => tiles.push({ kind: 'main', view: v, x: g + (i % 3) * (cw + g), y: g + Math.floor(i / 3) * (chh + g), w: cw, h: chh }));
    const bh = H - topH - g * 2, sw = (W - g * (STATES.length + 1)) / STATES.length, sh = (bh - g) / 2;
    STATES.forEach((s, i) => {
      tiles.push({ kind: 'sheet', view: 'front', k: s.k, x: g + i * (sw + g), y: topH + g, w: sw, h: sh, label: s.label });
      tiles.push({ kind: 'sheet', view: 'side', k: s.k, x: g + i * (sw + g), y: topH + g + sh + g, w: sw, h: sh, label: s.label });
    });
    drawLabels(); dirty = true;
  }
  function tileLabel(t) {
    if (t.kind === 'main') {
      if (t.view === 'free') return ['Frei drehen', SOURCES[st.source].label + ' · ' + stateName(curK())];
      return [VIEWS[t.view].label + (st.focus ? ' · Klick: zurück' : ''), st.wire ? 'mit Drahtgitter' : ''];
    }
    return [(t.view === 'front' ? 'Vorn · ' : 'Seite · ') + t.label, ''];
  }
  const stateName = (k) => { const s = STATES.find((x) => x.k === k); return s ? s.label : Math.round(k * 100) + ' %'; };
  function drawLabels() {
    labels.innerHTML = '';
    for (const t of tiles) {
      const [a, b] = tileLabel(t);
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;left:${t.x + 8}px;top:${t.y + 6}px;max-width:${Math.max(40, t.w - 16)}px;font:12px/1.3 Roboto,Arial,sans-serif;color:#000;display:flex;flex-direction:column;gap:1px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis`;
      d.innerHTML = `<span style="font-weight:700">${a}</span>${b ? `<span style="color:#666">${b}</span>` : ''}`;
      labels.appendChild(d);
    }
  }
  const curK = () => st.play ? playK : st.closure;

  function setCam(c, dir, aspect, dist = 5.4) {
    const v = new THREE.Vector3(...dir).normalize();
    c.aspect = aspect; c.position.copy(v.multiplyScalar(dist));
    c.up.set(0, 1, 0); c.lookAt(0, 0, 0); c.updateProjectionMatrix();
  }
  const cutPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  function setCut(on) {
    for (const m of allMats) m.clippingPlanes = on ? [cutPlane] : [];
    scleraB.visible = pupilB.visible = slots.u.back.visible = slots.l.back.visible = on;
  }
  function setMarks(k) {
    for (const s of ['u', 'l']) {
      const sl = slots[s];
      if (sl.marks) { sl.g.remove(sl.marks); sl.marks = null; }
      const m = marks[k + s];
      if (m) { sl.g.add(m); sl.marks = m; }
    }
  }
  function render() {
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, W, H); renderer.setClearColor(0xffffff); renderer.clear();
    renderer.setScissorTest(true);
    renderer.setClearColor(bg);
    for (const t of tiles) {
      const y = H - t.y - t.h;
      renderer.setViewport(t.x, y, t.w, t.h); renderer.setScissor(t.x, y, t.w, t.h);
      const k = t.kind === 'main' ? curK() : t.k;
      setSlots(t.kind === 'main' ? livePair(k) : pairFor(k)); hinge(k);
      setMarks(t.kind === 'main' ? k : null);
      applyRig(st.gaze);
      for (const s of Object.values(slots)) s.wire.visible = st.wire && t.kind === 'main';
      const isCut = t.kind === 'main' && t.view === 'cut';
      setCut(isCut);
      let c = cam;
      if (t.view === 'free') { c = freeCam; c.aspect = t.w / t.h; c.updateProjectionMatrix(); }
      else setCam(cam, VIEWS[t.view].d, t.w / t.h, t.kind === 'sheet' ? 5.2 : 5.4);
      renderer.render(scene, c);
    }
    setCut(false);
    renderer.setScissorTest(false);
  }

  /* ---------- Lidschlag ---------- */
  let playK = 0, playT = 0, last = performance.now(), raf = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (st.play) {
      const dur = st.speed === 'v6' ? 0.12 : 1.2, pause = st.speed === 'v6' ? 0.9 : 0.6;
      playT += dt; const cyc = dur + pause, ph = playT % cyc;
      playK = ph < dur ? Math.sin(Math.PI * ph / dur) : 0;
      dirty = true;
    }
    controls.update();
    if (dirty) { dirty = false; try { render(); } catch (e) { window.__eyelidErr = String(e && e.stack || e); console.error(e); } }
  }

  /* ---------- Prüfung ---------- */
  let qaToken = 0, qaTimer = 0;
  function scheduleQA() { clearTimeout(qaTimer); qaTimer = setTimeout(runQA, 120); }
  async function runQA() { try { await runQA0(); } catch (e) { window.__eyelidErr = String(e && e.stack || e); console.error(e); } }
  async function runQA0() {
    const token = ++qaToken, src = st.source, motion = SOURCES[src].motion;
    cb.onQA && cb.onQA({ running: true, source: src });
    const states = motion === 'hinge' ? [{ k: 0, label: 'starr, v6-Scharnier' }] : STATES.filter((s) => motion !== 'thin' || s.k >= 0);
    const per = [];
    for (const s of states) {
      const p = pairFor(s.k);
      for (const [side, g] of (src === 'e2' ? [['Lidhaut', p.u]] : [['Oberlid', p.u], ['Unterlid', p.l]])) {
        if (!g) continue;
        await tick(); if (token !== qaToken) return;
        const q = meshQA(g.attributes.position.array, g.index.array, { eyeRadius: 1 });
        per.push({ state: s.label, k: s.k, side, q });
        if (q.self && q.self.where.length) {
          const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.Float32BufferAttribute(q.self.where.flat(), 3));
          marks[s.k + (side === 'Unterlid' ? 'l' : 'u')] = new THREE.Points(mg, mkMark);
        }
      }
    }
    await tick(); if (token !== qaToken) return;
    const occ = occlusionTest(1);
    const ref = occlusionTest(0, ['mitte'], REF_VIEWS);
    dirty = true;
    const report = summarize(src, per, occ, ref);
    window.__eyelidQA = report;
    cb.onQA && cb.onQA(report);
  }
  const rt = new THREE.WebGLRenderTarget(200, 200);
  const buf = new Uint8Array(200 * 200 * 4);
  function occlusionTest(k, gazes = Object.keys(GAZE), views = OCC_VIEWS) {
    const keep = { w: sclera.material, p: pupil.material, l: matL, bg: scene.background };
    sclera.material = idMat.w; pupil.material = idMat.p; slots.u.solid.material = slots.l.solid.material = idMat.l;
    scene.background = new THREE.Color(0x000000);
    setCut(false); for (const s of Object.values(slots)) { s.wire.visible = false; if (s.marks) s.marks.visible = false; }
    setSlots(pairFor(k)); hinge(k);
    const out = [];
    for (const v of views) {
      let pMax = 0, wMax = 0, lMax = 0;
      for (const gz of gazes) {
        applyRig(gz); setCam(cam, v.d, 1, 5.4);
        renderer.setRenderTarget(rt); renderer.render(scene, cam);
        renderer.readRenderTargetPixels(rt, 0, 0, 200, 200, buf);
        let p = 0, w = 0, l = 0;
        for (let i = 0; i < buf.length; i += 4) { if (buf[i + 1] > 128 && buf[i] < 100) p++; else if (buf[i] > 128 && buf[i + 1] < 100) w++; else if (buf[i + 2] > 128) l++; }
        pMax = Math.max(pMax, p); wMax = Math.max(wMax, w); lMax = Math.max(lMax, l);
      }
      out.push({ view: v.label, pupil: pMax, sclera: wMax, lid: lMax });
    }
    renderer.setRenderTarget(null);
    sclera.material = keep.w; pupil.material = keep.p; slots.u.solid.material = slots.l.solid.material = keep.l; scene.background = keep.bg;
    for (const s of Object.values(slots)) if (s.marks) s.marks.visible = true;
    applyRig(st.gaze);
    return out;
  }
  function summarize(src, per, occ, ref) {
    const max = (f) => per.reduce((a, p) => Math.max(a, f(p.q)), 0);
    const min = (f) => per.reduce((a, p) => Math.min(a, f(p.q)), Infinity);
    const allClosed = per.every((p) => p.q.closed), allOut = per.every((p) => p.q.outward === true);
    const selfHits = per.reduce((a, p) => a + (p.q.self ? p.q.self.hits : 0), 0), selfTests = per.reduce((a, p) => a + (p.q.self ? p.q.self.tests : 0), 0);
    const eul = [...new Set(per.map((p) => p.q.euler))].join(' / ');
    const fmt = (x, d = 0) => x.toLocaleString('de-DE', { maximumFractionDigits: d, minimumFractionDigits: d });
    const worstSelf = per.filter((p) => p.q.self && p.q.self.hits).map((p) => `${p.side} ${p.state}: ${p.q.self.hits}`).join(' · ');
    const rows = [
      { label: 'Randkanten · roh', value: fmt(max((q) => q.raw.boundary)), ok: max((q) => q.raw.boundary) === 0 },
      { label: 'Randkanten · verschweißt', value: fmt(max((q) => q.welded.boundary)), ok: max((q) => q.welded.boundary) === 0 },
      { label: 'Nicht-mannigfaltige Kanten', value: fmt(max((q) => q.welded.nonManifold)), ok: max((q) => q.welded.nonManifold) === 0 },
      { label: 'Windungskonflikte', value: fmt(max((q) => q.welded.winding)), ok: max((q) => q.welded.winding) === 0 },
      { label: 'Normalen nach außen', value: allClosed ? (allOut ? 'ja, Volumen > 0' : 'nein') : 'offen, nicht bestimmbar', ok: allClosed && allOut },
      { label: 'Euler χ je Teilkörper', value: eul, ok: allClosed && per.every((p) => p.q.euler === 2 * p.q.components) },
      { label: 'Teilkörper je Netz', value: [...new Set(per.map((p) => p.q.components))].join(' / '), ok: per.every((p) => p.q.components === 1) },
      { label: 'Selbstdurchdringung', value: `${fmt(selfHits)} Treffer · ${fmt(selfTests)} Paare`, ok: selfHits === 0, note: worstSelf },
      { label: 'Entartete / doppelte Dreiecke', value: `${fmt(max((q) => q.degenerate))} / ${fmt(max((q) => q.duplicates))}`, ok: max((q) => q.degenerate) === 0 && max((q) => q.duplicates) === 0 },
      { label: 'Dreiecksgüte min. (1 = gleichseitig)', value: fmt(min((q) => q.minQuality), 3) + ` · ${fmt(max((q) => q.spikes))} unter 0,02`, ok: max((q) => q.spikes) === 0 },
      { label: 'Abstand Lid–Augapfel min.', value: fmt(min((q) => q.clearance) * 100, 2) + ' % R', ok: min((q) => q.clearance) > 0 },
      { label: 'Dreiecke je Lid', value: [...new Set(per.map((p) => fmt(p.q.F)))].join(' / '), ok: null },
    ];
    const pupilLeak = occ.reduce((a, o) => Math.max(a, o.pupil), 0);
    return {
      running: false, source: src, schema: src === 'e2' ? CLAY_SKIN_SCHEMA : src === 'e1' ? CLAY_EYELID_SCHEMA : SOURCES[src].role,
      states: [...new Set(per.map((p) => p.state))], rows, occ, ref, pupilLeak,
      pupilShell: pupilShell(), clearance: (src === 'e1' || src === 'e2') ? clrEff() : null, gazeCount: Object.keys(GAZE).length,
      time: new Date().toISOString(),
    };
  }

  const ro = new ResizeObserver(layout); ro.observe(host);
  layout(); rebuild(); raf = requestAnimationFrame(loop);

  const api = {
    state: () => JSON.parse(JSON.stringify(st)),
    set(patch) {
      const geo = ['source', 'pupil', 'params', 'p2'].some((k) => k in patch);
      if (patch.params) patch = Object.assign({}, patch, { params: Object.assign({}, st.params, patch.params) });
      if (patch.p2) patch = Object.assign({}, patch, { p2: Object.assign({}, st.p2, patch.p2) });
      Object.assign(st, patch);
      if ('play' in patch && patch.play) playT = 0;
      if (geo) rebuild();
      if ('focus' in patch) layout();
      drawLabels(); dirty = true;
    },
    runQA, render: () => { dirty = false; render(); },
    exportGLB() {
      const k = curK(); setSlots(livePair(k)); hinge(k); applyRig(st.gaze); setCut(false);
      for (const s of Object.values(slots)) { s.wire.visible = false; if (s.marks) s.marks.visible = false; }
      const name = 'kfb-' + st.source + '-' + stateName(k).replace(/[^a-z0-9]+/gi, '') + '.glb';
      actor.name = 'KFB_EyeActor_' + st.source; sclera.name = 'eyeball'; pupil.name = 'pupil';
      slots.u.solid.name = st.source === 'e2' ? 'lid_skin' : 'lid_upper'; slots.l.solid.name = 'lid_lower';
      new GLTFExporter().parse(actor, (bin) => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bin], { type: 'model/gltf-binary' })); a.download = name; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000); dirty = true;
      }, (e) => console.error(e), { binary: true, onlyVisible: true });
      return name;
    },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); controls.dispose(); renderer.dispose(); host.innerHTML = ''; },
  };
  window.__eyelidBench = api;
  return api;
}
