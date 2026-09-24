/* KFB WB-W0 · WORLD SCALE + TRAVERSABILITY PROOF · Host
   Eine kleine spielbare Region: Köln · dom-zentrum-v0 · Racer-Route Start → Bahnhofsvorplatz.
   Reihenfolge des Aufbaus = Reihenfolge des Gates:
     1 Massquellen messen (Figur, KayKit-Tür, Tiny-Treats-Tür, Kenney-Fahrbahn, Racer-Querschnitt)
     2 Route + Korridor + Sperrzonen   3 Gelände um die Route   4 Haus · Billboard · wenige Props
     5 Rampentest mit dem UNVERÄNDERTEN walk-controller.js   6 Routen- und Türlauf   7 Bericht
   Globus = Übersicht in eigenem Massstab; Region = ENU in Metern; Handoff über die Höhe. */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as REG from './wd-registry.js';
import { mountAsset } from './wd-donors.js';
import { loadHero, renderCardQuarter, CARD_POOL } from './bb-scene.js';
import { createInk } from './w0-ink.js';
import { crossSection, routeFromRacer, buildTerrain, buildRouteMesh, rectZone, circleZone, segZone, WB2_TERRAIN } from './w0-region.js';
import { loadMask, makeGlobe, makeFarDisc, EARTH_R, LAND } from './w0-globe.js';
import { makeActor, ACTOR } from './w0-actor.js';

const GH = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/';
const URL = {
  route: GH + 'tools/KFB-ToolBox/_inbox/KFB%20Cologne%20Race%20Option%20C-2/lab-v9/cologne-route.v1.js',
  style: GH + 'tools/KFB-ToolBox/_inbox/KFB%20Cologne%20Race%20Option%20C-2/lab-v9/option-c-style.v1.js',
  walk: GH + 'travel/KFB%20Travel%20Combat%20v25/terrain-v25/walk-controller.js',
  sky: GH + 'travel/wip/travel_globe_wsa/globe-v13/sky-presets.js'
};
const ZONE = { id: 'koeln-dom-zentrum-v0', routeId: 'cologne-dom-loop · CP0→CP2', lat: 50.942, lon: 6.96225, seed: WB2_TERRAIN.seed, time: 'day', source: 'tools/osm-city-lab/data/dom-zentrum-v0/SOURCE_SPEC.json origin' };
const LIMITS = { spawnDeg: 3, routeDeg: 10, walkDeg: 30 };
const FONT = "'JetBrains Mono',ui-monospace,monospace";
const INK = '#e7dfd0', GOLD = '#ffd9a0', OKC = '#a8d59a', BAD = '#ff9a86', DIM = 'rgba(231,223,208,.6)', LINE = 'rgba(231,223,208,.16)';
const mk = (t, css, txt) => { const e = document.createElement(t); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; };
const r2 = (v) => Math.round(v * 100) / 100;
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ---------- Gerüst ---------- */
const panel = mk('div', 'position:fixed;left:0;top:0;bottom:0;width:360px;overflow:auto;box-sizing:border-box;padding:10px;background:#17151d;color:' + INK + ';font:400 11px/1.45 ' + FONT + ';border-right:1px solid ' + LINE + ';z-index:5;display:flex;flex-direction:column;gap:8px');
const stage = mk('div', 'position:fixed;left:360px;right:0;top:0;bottom:0;background:#05070f');
const canvas = mk('canvas', 'width:100%;height:100%;display:block;touch-action:none;outline:none');
canvas.tabIndex = 0;
stage.appendChild(canvas);
const hud = mk('div', 'position:absolute;left:10px;bottom:10px;right:10px;display:flex;gap:8px;pointer-events:none;font:400 11px/1.4 ' + FONT);
const status = mk('div', 'background:rgba(23,21,29,.85);border:1px solid ' + LINE + ';padding:5px 8px;color:' + INK);
const alt = mk('div', 'margin-left:auto;background:rgba(23,21,29,.85);border:1px solid ' + LINE + ';padding:5px 8px;color:' + GOLD);
hud.append(status, alt); stage.appendChild(hud);
document.body.append(stage, panel);
function layout() {
  const narrow = innerWidth < 760;
  Object.assign(panel.style, narrow ? { width: 'auto', right: '0', top: '56%', borderRight: 'none', borderTop: '1px solid ' + LINE } : { width: '360px', right: 'auto', top: '0', borderRight: '1px solid ' + LINE, borderTop: 'none' });
  Object.assign(stage.style, narrow ? { left: '0', bottom: '44%' } : { left: '360px', bottom: '0' });
  requestAnimationFrame(resize);
}
const LOG = [];
const say = (t, k) => { status.textContent = t; status.style.color = k === 'bad' ? BAD : k === 'ok' ? OKC : INK; };
const log = (t, bad) => { LOG.push((bad ? '✗ ' : '✓ ') + t); console.info('[w0]', t); say(t, bad ? 'bad' : ''); paint(); };

/* ---------- Renderer / Szenen ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.autoClear = false;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 5000);
let ink = null, globe = null;
function resize() {
  const w = Math.max(2, stage.clientWidth), h = Math.max(2, stage.clientHeight);
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  if (ink) ink.setSize(w, h);
}
addEventListener('resize', layout);

/* ---------- Zustand ---------- */
const S = { ready: false, u: 0.02, tw: null, yawOff: 0, walk: false, auto: null, zonesVis: false, ink: true, eyes: true };
const W = { xs: null, route: null, terrain: null, zones: [], obstacles: [], props: [], house: null, billboard: null, spawn: null, kit: {}, ramp: null, runs: {}, gates: [] };
let WC = null, walker = null, actor = null;
const keys = {};

/* ---------- Kamera: EIN Parameter u (0 Boden … 1 Orbit) ---------- */
const H_MIN = 2.4, H_MAX = 1.8e7;
const altOf = (u) => H_MIN * Math.pow(H_MAX / H_MIN, u);
const target = new THREE.Vector3();
function cameraApply() {
  const h = altOf(S.u);
  const pitch = 0.3 + (Math.PI / 2 - 0.32) * sstep(0.22, 0.62, S.u);
  const dist = h / Math.sin(pitch);
  const st = walker ? walker.state : null;
  if (st) target.copy(st.position).add(new THREE.Vector3(0, 1.2 * (1 - sstep(0.1, 0.4, S.u)), 0));
  const hd = (st ? st.heading : 0) + S.yawOff;
  const fwd = new THREE.Vector3(Math.sin(hd), 0, Math.cos(hd));
  camera.position.copy(target).addScaledVector(new THREE.Vector3(0, 1, 0), Math.sin(pitch) * dist).addScaledVector(fwd, -Math.cos(pitch) * dist);
  if (W.terrain) { const g = groundAt(camera.position.x, camera.position.z) + 0.4; if (camera.position.y < g) camera.position.y = g; }
  const s = sstep(0.22, 0.62, S.u);
  camera.up.set(0, 1, 0).multiplyScalar(1 - s).addScaledVector(fwd, s).normalize();
  camera.lookAt(target);
  camera.near = Math.max(0.1, dist * 0.004); camera.far = Math.max(6000, dist * 40);
  camera.updateProjectionMatrix();
  if (scene.fog) { scene.fog.near = Math.max(700, h * 1.5); scene.fog.far = Math.max(9000, h * 14); }
  return h;
}

/* ---------- Höhe für den Controller: Gelände + Hindernisse (eine Wahrheit) ---------- */
function groundAt(x, z) {
  let g = W.terrain ? W.terrain.H(x, z) : 0;
  for (const o of W.obstacles) if (o.zone.dist(x, z) <= 0) g = Math.max(g, o.baseY + o.top);
  return g;
}

/* ---------- Messen ---------- */
async function measureMesh(slug, re, meshRe) {
  const a = await REG.pick(slug, re);
  if (!a) throw new Error('registry ' + slug + ' · no match ' + re);
  const r = await mountAsset(a);
  r.node.updateMatrixWorld(true);
  const out = { asset: a, node: r.node, box: new THREE.Box3().setFromObject(r.node, true), parts: {} };
  r.node.traverse((o) => { if (o.isMesh && (!meshRe || meshRe.test(o.name))) out.parts[o.name] = new THREE.Box3().setFromObject(o, true); });
  return out;
}
/* Fussabdruck = Box der Vertices unterhalb `slice` Meter (Stamm, Pfosten), gemessen, nicht geschätzt */
function lowSlice(node, slice) {
  const b = new THREE.Box3(), v = new THREE.Vector3();
  node.updateMatrixWorld(true);
  node.traverse((o) => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i += 1) { o.getVertexPosition ? o.getVertexPosition(i, v) : v.fromBufferAttribute(p, i); v.applyMatrix4(o.matrixWorld); if (v.y < slice) b.expandByPoint(v); }
  });
  return b.isEmpty() ? null : b;
}
function prepare(node, factor) {
  node.scale.multiplyScalar(factor);
  node.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(node, true), c = b.getCenter(new THREE.Vector3());
  node.position.x -= c.x; node.position.z -= c.z; node.position.y -= b.min.y;
  node.updateMatrixWorld(true);
  node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { box: new THREE.Box3().setFromObject(node, true), centerShift: c };
}

/* ---------- Rampentest (Controller unverändert, kopflos, deterministisch) ---------- */
function rampTest() {
  const out = [];
  for (const deg of [0, 10, 20, 25, 30, 35]) {
    const tan = Math.tan(deg * Math.PI / 180);
    const g = (x, z) => (z > 0 ? Math.min(z, 30) * tan : 0);
    const c = WC.createWalkController({ THREE });
    c.reset(0, -6, 0, 0);
    c.setInput(0, 1);
    let hops = 0, air = 0, sink = 0, blocked = 0, back = 0, lastZ = -6, reachedAt = null;
    for (let f = 0; f < 60 * 9; f++) {
      c.update(1 / 60, { turn: 0, sprint: false }, g);
      const s = c.state;
      if (s.autoHop) hops++;
      if (!s.onGround) air++;
      if (s.blocked) blocked++;
      sink = Math.max(sink, g(s.position.x, s.position.z) - s.position.y);
      if (s.position.z < lastZ - 1e-4) back++;
      lastZ = s.position.z;
      if (reachedAt == null && s.position.z >= 24) reachedAt = f / 60;
    }
    const ok = hops === 0 && air <= 2 && blocked === 0 && back === 0 && sink <= 0.05 && reachedAt != null;
    out.push({ deg, ok, hops, airFrames: air, blockedFrames: blocked, backFrames: back, maxSinkM: r2(sink * 100) / 100, reach24mS: reachedAt != null ? r2(reachedAt) : null });
  }
  let max = null;
  for (const r of out) { if (r.ok) max = r.deg; else break; }
  return { rows: out, controllerWalkSlopeMax: max, method: 'walk-controller.js v25 · params unchanged · 60 Hz · 9 s forward input · ramp 0..30 m · PASS = 0 hops, ≤2 air frames, 0 blocked, 0 backwards, sink ≤ 0,05 m, reached z 24 m' };
}

/* ---------- Autopilot über die Route (derselbe Controller, nur die Eingabe wird gesteuert) ---------- */
function runPath(pathPts, { sprint = false, stopDist = 0.4, maxS = 120, limitDeg, label }) {
  const c = WC.createWalkController({ THREE });
  const p0 = pathPts[0], p1 = pathPts[1];
  c.reset(p0.x, p0.z, groundAt(p0.x, p0.z), Math.atan2(p1.x - p0.x, p1.z - p0.z));
  const rec = { label, frames: 0, hops: 0, air: 0, blocked: 0, maxSink: 0, maxSlope: 0, minClear: Infinity, clearWhat: '', reached: false, time: 0, trail: [] };
  let k = 1;
  for (let f = 0; f < maxS * 60; f++) {
    const s = c.state, pos = s.position;
    while (k < pathPts.length - 1 && Math.hypot(pathPts[k].x - pos.x, pathPts[k].z - pos.z) < 3) k++;
    const tg = pathPts[k];
    const want = Math.atan2(tg.x - pos.x, tg.z - pos.z);
    let d = want - s.heading; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    c.setInput(0, Math.abs(d) > 1.2 ? 0.25 : 1);
    c.update(1 / 60, { turn: Math.max(-1, Math.min(1, d * 2.2)), sprint }, groundAt);
    rec.frames++;
    if (s.autoHop) rec.hops++;
    if (!s.onGround) rec.air++;
    if (s.blocked) rec.blocked++;
    rec.maxSink = Math.max(rec.maxSink, W.terrain.H(pos.x, pos.z) - pos.y);
    rec.maxSlope = Math.max(rec.maxSlope, W.terrain.slopeDeg(pos.x, pos.z));
    for (const o of W.obstacles) { if (o.floor) continue; const cl = o.zone.dist(pos.x, pos.z) - walker.params.radius; if (cl < rec.minClear) { rec.minClear = cl; rec.clearWhat = o.id; } }
    if (f % 20 === 0) rec.trail.push([r2(pos.x), r2(pos.y), r2(pos.z)]);
    const last = pathPts[pathPts.length - 1];
    if (k === pathPts.length - 1 && Math.hypot(last.x - pos.x, last.z - pos.z) <= stopDist) { rec.reached = true; rec.time = r2(f / 60); break; }
  }
  rec.maxSink = r2(rec.maxSink * 1000) / 1000; rec.maxSlope = r2(rec.maxSlope); rec.minClear = r2(rec.minClear);
  rec.ok = rec.reached && rec.hops === 0 && rec.maxSink <= 0.05 && rec.maxSlope <= limitDeg && rec.minClear >= -1e-6;
  rec.limitDeg = limitDeg;
  return rec;
}

/* ---------- Aufbau ---------- */
async function boot() {
  layout();
  const [R, ST, WCm, SKY] = await Promise.all([import(URL.route), import(URL.style), import(URL.walk), import(URL.sky)]);
  WC = WCm;
  log('Racer cologne-route.v1.js loaded · TRACK_WIDTH ' + JSON.stringify(R.TRACK_WIDTH));
  log('walk-controller.js (Travel Combat v25) loaded · UNCHANGED params');
  walker = WC.createWalkController({ THREE });
  /* Himmel/Licht: TinySkies DAY (geteilte Tageszeit) */
  const day = SKY.getSkyPreset('day');
  scene.background = SKY.paintRadialSky(THREE, day, 512);
  scene.fog = new THREE.Fog(day.fogColor, 700, 9000);
  const rig = SKY.buildLightRig(THREE, scene, day);
  const sunDir = rig.sun.position.clone().normalize();
  rig.sun.castShadow = true; rig.sun.shadow.mapSize.set(2048, 2048);
  Object.assign(rig.sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 200, far: 600 });
  rig.sun.shadow.bias = -0.0004; rig.sun.shadow.normalBias = 0.06;
  scene.add(rig.sun.target);
  log('TinySkies sky-presets.js · DAY preset · 8 lights (buildLightRig) · radial sky backdrop');

  /* 1 · Massquellen */
  W.xs = crossSection(R.TRACK_WIDTH);
  const [door, dung, house, road, bb, tree, rock, lantern] = await Promise.all([
    measureMesh('kaykit-restaurant-bits-1-0-free', /^door_A$/),
    measureMesh('kaykit-dungeon-pack-1-1-free-2', /^wall_doorway$/, /door/),
    measureMesh('tiny-treats-homely-house-1-0-free', /^house$/),
    measureMesh('kenney-racing-kit', /^roadStart$/),
    REG.pick('kenney-racing-kit', /^billboard$/),
    measureMesh('kaykit-forest-nature-pack-1-0-free', /^Tree_1_A_Color1$/),
    measureMesh('kaykit-forest-nature-pack-1-0-free', /^Rock_3_E_Color1$/),
    measureMesh('tiny-treats-pretty-park-1-0-free', /^street_lantern$/)
  ]);
  const kayDoorH = door.box.max.y - door.box.min.y;
  const dunDoor = Object.entries(dung.parts).find(([n]) => /_door$/i.test(n))?.[1], dunDoorH = dunDoor ? dunDoor.max.y - dunDoor.min.y : null;
  const hd = house.parts.house_door, ttDoorH = hd.max.y - hd.min.y;
  const fTT = kayDoorH / ttDoorH;
  const roadW = road.box.max.x - road.box.min.x;
  const fK = W.xs.surfaceWidth / roadW;
  W.kit = {
    KayKit: { factor: 1, why: 'Referenzfamilie: GothGirl (Rig_Medium) und KayKit-Türen sind nativ zueinander gebaut' },
    'Tiny Treats': { factor: r2(fTT * 1000) / 1000, why: 'house_door ' + r2(ttDoorH) + ' m → KayKit door_A ' + r2(kayDoorH) + ' m (Dungeon wall_doorway_door ' + (dunDoorH ? r2(dunDoorH) : '—') + ' m)' },
    Kenney: { factor: r2(fK * 1000) / 1000, why: 'roadStart Hülle ' + r2(roadW * 1000) / 1000 + ' u → Racer TRACK_WIDTH.STANDARD 18,0 m (Racer: roadStart × 16,434 → 20,7 m, derselbe Weg)' }
  };
  log('kit factors · Tiny Treats ×' + W.kit['Tiny Treats'].factor + ' · Kenney ×' + W.kit.Kenney.factor + ' · KayKit ×1');

  /* 2 · Route + Figur (Masse vor allem anderen) */
  W.route = routeFromRacer(R);
  log('route · ' + r2(W.route.length) + ' m · ' + W.route.source);
  actor = await makeActor({ scene, camera, log });

  /* 3 · Layout der Pads aus gemessenen Grössen */
  const xs = W.xs, rt = W.route;
  const sp = rt.sampleAt(10);
  W.spawn = { p: sp.p.clone(), r: 2 * walker.params.probeMax, heading: Math.atan2(sp.t.x, sp.t.z) };
  prepare(house.node, fTT);
  const hb = house.node.userData.box = new THREE.Box3().setFromObject(house.node, true);
  const hW = hb.max.x - hb.min.x, hD = hb.max.z - hb.min.z;
  const hm = rt.sampleAt(rt.length * 0.46);
  const hCenter = hm.p.clone().addScaledVector(hm.n, xs.exclusionHalf + hD / 2 + 3);
  const hYaw = Math.atan2(-hm.n.x, -hm.n.z);                    // Türseite (+z lokal) zur Route
  const bbInfo = await loadHero(GLTFLoader, 'billboard.glb', 1.0 * fK);
  const bbBox0 = new THREE.Box3().setFromObject(bbInfo.group); const bbc = bbBox0.getCenter(new THREE.Vector3());
  bbInfo.group.position.x -= bbc.x; bbInfo.group.position.z -= bbc.z; bbInfo.group.position.y -= bbBox0.min.y;
  /* Host-Delta gegen Flackern (Georg 24.09.): loadHero() setzt die Kartenfläche 0,012 u vor die
     Tafel — bei ×14,3 und Blickweiten von 100 m ist das unter der Tiefenauflösung (z-fighting mit
     der TANKCO-Fläche des Donors). Die Fläche rückt entlang ihrer Blickrichtung 6 cm vor und bekommt
     polygonOffset; der gemeinsame Loader bb-scene.js bleibt unverändert. */
  bbInfo.group.traverse((o) => {
    if (!o.isMesh || o.name !== 'billboard-card-surface') return;
    const n = new THREE.Vector3(0, 0, 1).applyEuler(o.rotation);
    o.position.addScaledVector(n, 0.06);
    const fix = (m) => { m.polygonOffset = true; m.polygonOffsetFactor = -2; m.polygonOffsetUnits = -4; m.needsUpdate = true; };
    fix(o.material); o.userData.fixMat = fix; o.castShadow = false; o.receiveShadow = false;
  });
  const bbHolder = new THREE.Group(); bbHolder.add(bbInfo.group); bbHolder.name = 'landmark:billboard';
  bbHolder.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  const bbSize = new THREE.Box3().setFromObject(bbHolder).getSize(new THREE.Vector3());
  const end = rt.sampleAt(rt.length);
  const bCenter = end.p.clone().addScaledVector(end.t, xs.exclusionHalf + bbSize.z / 2 + 6);
  const bYaw = Math.atan2(-end.t.x, -end.t.z);                   // Tafel blickt zurück auf die Route
  /* Türweg: vom Schulterrand bis vor die Tür */
  const doorLocalZ = (hd.max.z - house.node.userData.box.getCenter(new THREE.Vector3()).z);
  const rot = (v, yaw) => new THREE.Vector3(v.x * Math.cos(yaw) + v.z * Math.sin(yaw), v.y, -v.x * Math.sin(yaw) + v.z * Math.cos(yaw));
  const doorFront = hCenter.clone().add(rot(new THREE.Vector3(0, 0, hd.max.z * fTT + house.node.position.z), hYaw));
  const pathStart = hm.p.clone().addScaledVector(hm.n, xs.walkHalf - 0.5);
  const doorW = (hd.max.x - hd.min.x) * fTT, doorH = (hd.max.y - hd.min.y) * fTT, doorSill = hd.min.y * fTT;
  const pads = [
    Object.assign(circleZone('spawn', W.spawn.p, W.spawn.r, 'spawn'), { y: sp.y, blend: 10 }),
    Object.assign(rectZone('house-pad', hCenter, hYaw, hW / 2 + 2.5, hD / 2 + 2.5, 0, 'building'), { y: hm.y, blend: 16 }),
    Object.assign(segZone('door-path', pathStart, doorFront, doorW / 2 + 0.6, 'path'), { y: hm.y, blend: 6 }),
    Object.assign(rectZone('billboard-pad', bCenter, bYaw, bbSize.x / 2 + 2.5, bbSize.z / 2 + 2.5, 0, 'landmark'), { y: end.y, blend: 14 })
  ];
  W.pads = pads;

  /* 4 · Rampentest ZUERST — sein Ergebnis ist die Hanggrenze des Geländes */
  W.ramp = rampTest();
  W.walkLimit = Math.min(LIMITS.walkDeg, W.ramp.controllerWalkSlopeMax ?? 0);
  log('ramp test · controllerWalkSlopeMax = ' + W.ramp.controllerWalkSlopeMax + '° · world walk limit → ' + W.walkLimit + '°');
  /* 5 · Gelände um Route und Pads (Erosions-Talus = gemessene Hanggrenze) */
  const center = rt.sampleAt(rt.length / 2).p;
  W.terrain = buildTerrain({ route: rt, xs, pads, center, half: 256, step: 2, erosionTalusDeg: W.walkLimit, edgeColor: LAND, log });
  scene.add(W.terrain.mesh);
  const routeMesh = buildRouteMesh(rt, xs, ST.C);
  scene.add(routeMesh);
  log('route mesh · surface ' + xs.surfaceWidth + ' m · shoulder ' + r2(xs.shoulder) + ' m · exclusion half ' + r2(xs.exclusionHalf) + ' m · Racer colours option-c-style C');

  /* 5 · Inhalt: Haus, Billboard */
  const place = (node, c, yaw, id, kind) => {
    const g = new THREE.Group(); g.name = id; g.add(node); g.rotation.y = yaw;
    g.position.set(c.x, rt.nearest(c.x, c.z).y, c.z);
    scene.add(g); g.updateMatrixWorld(true);
    return g;
  };
  W.house = place(house.node, hCenter, hYaw, 'building:house', 'building');
  const bodyZ0 = hb.min.z, doorZ = hd.max.z * fTT + house.node.position.z;
  /* Haus als Hindernis: Körper bis zur Türfront (Wandhöhe), Vorbau = Türschwelle (gemessen) */
  const hy = W.house.position.y;
  W.obstacles.push({ id: 'house-body', zone: rectZone('house-body', hCenter.clone().add(rot(new THREE.Vector3(0, 0, (bodyZ0 + doorZ) / 2), hYaw)), hYaw, hW / 2, (doorZ - bodyZ0) / 2, 0), baseY: hy, top: hb.max.y });
  W.obstacles.push({ id: 'house-porch', zone: rectZone('house-porch', hCenter.clone().add(rot(new THREE.Vector3(0, 0, (doorZ + hb.max.z) / 2), hYaw)), hYaw, hW / 2, Math.max(0.05, (hb.max.z - doorZ) / 2), 0), baseY: hy, top: doorSill, floor: true });
  W.door = { front: doorFront, w: doorW, h: doorH, sill: doorSill, yaw: hYaw };
  W.billboard = place(bbHolder, bCenter, bYaw, 'landmark:billboard', 'landmark');
  const bbLow = lowSlice(bbHolder, W.billboard.position.y + 1.0);
  if (bbLow) { const c = bbLow.getCenter(new THREE.Vector3()), s = bbLow.getSize(new THREE.Vector3()); W.obstacles.push({ id: 'billboard-posts', zone: rectZone('bb-posts', c, 0, s.x / 2, s.z / 2, 0), baseY: W.billboard.position.y, top: bbSize.y }); }
  try {
    const card = await Promise.race([renderCardQuarter(CARD_POOL[0]), new Promise((_, j) => setTimeout(() => j(new Error('card timeout 12 s')), 12000))]);
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = Math.round(1024 * bbInfo.panelH / bbInfo.panelW);
    const cx = cv.getContext('2d'), s = Math.max(cv.width / card.canvas.width, cv.height / card.canvas.height);
    cx.drawImage(card.canvas, (cv.width - card.canvas.width * s) / 2, (cv.height - card.canvas.height * s) / 2, card.canvas.width * s, card.canvas.height * s);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    bbInfo.panel.material = new THREE.MeshBasicMaterial({ map: tex });
    bbInfo.panel.userData.fixMat && bbInfo.panel.userData.fixMat(bbInfo.panel.material);
    log('billboard · B0 card ' + card.title + ' #' + card.cardNumber + ' (renderCardQuarter, cover-crop)');
  } catch (e) { log('billboard card · ' + e.message + ' · panel stays blank (named, not faked)', true); }
  log('landmark · Kenney billboard ×' + W.kit.Kenney.factor + ' = ' + r2(bbSize.x) + ' × ' + r2(bbSize.y) + ' × ' + r2(bbSize.z) + ' m');
  log('house · Tiny Treats ×' + W.kit['Tiny Treats'].factor + ' = ' + r2(hW) + ' × ' + r2(hb.max.y) + ' × ' + r2(hD) + ' m · door ' + r2(doorW) + ' × ' + r2(doorH) + ' m · sill ' + r2(doorSill) + ' m');

  /* 6 · Wenige Props mit Belegungs- und Abstandstest */
  const kinds = [
    { id: 'tree', src: tree, f: 1, n: 2 }, { id: 'rock', src: rock, f: 1, n: 2 }, { id: 'lantern', src: lantern, f: fTT, n: 1 }
  ];
  let seed = 20260924;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const blockers = [
    { id: 'route-exclusion', dist: (x, z) => rt.nearest(x, z).d - xs.exclusionHalf },
    ...pads
  ];
  const rejected = { corridor: 0, pads: 0, spacing: 0, slope: 0, edge: 0 };
  for (const k of kinds) {
    for (let n = 0; n < k.n; n++) {
      const node = n === 0 ? k.src.node : (await mountAsset(k.src.asset)).node;
      const info = prepare(node, k.f);
      const sz = info.box.getSize(new THREE.Vector3()), rFull = Math.max(sz.x, sz.z) / 2;
      let ok = null;
      for (let tries = 0; tries < 400 && !ok; tries++) {
        const q = rt.sampleAt(20 + rnd() * (rt.length - 40)), side = rnd() < 0.5 ? -1 : 1;
        const off = xs.exclusionHalf + rFull + 1 + (k.id === 'lantern' ? rnd() * 2 : rnd() * 30);
        const c = q.p.clone().addScaledVector(q.n, side * off);
        const edge = Math.min(c.x - W.terrain.x0, c.z - W.terrain.z0, W.terrain.x0 + 512 - c.x, W.terrain.z0 + 512 - c.z);
        if (edge < 60) { rejected.edge++; continue; }
        if (blockers[0].dist(c.x, c.z) < rFull + 1) { rejected.corridor++; continue; }
        if (pads.some((p) => p.dist(c.x, c.z) < rFull + 1.5)) { rejected.pads++; continue; }
        if (W.props.some((p) => p.c.distanceTo(c) < p.r + rFull + 2)) { rejected.spacing++; continue; }
        let smax = 0; for (const [dx, dz] of [[0, 0], [rFull, 0], [-rFull, 0], [0, rFull], [0, -rFull]]) smax = Math.max(smax, W.terrain.slopeDeg(c.x + dx, c.z + dz));
        if (smax > W.walkLimit) { rejected.slope++; continue; }
        let lo = Infinity, hi = -Infinity; for (let a = 0; a < 8; a++) { const hh = W.terrain.H(c.x + Math.cos(a) * rFull * 0.7, c.z + Math.sin(a) * rFull * 0.7); lo = Math.min(lo, hh); hi = Math.max(hi, hh); }
        if (hi - lo > 0.3) { rejected.seat = (rejected.seat || 0) + 1; continue; }
        ok = c;
      }
      if (!ok) { log(k.id + ' · no free place after 400 tries', true); continue; }
      const low = lowSlice(node, 1.0), yaw = rnd() * Math.PI * 2;
      let hmin = Infinity, hmax = -Infinity;
      const fr = low ? Math.max(low.max.x - low.min.x, low.max.z - low.min.z) / 2 : rFull;
      for (let a = 0; a < 8; a++) { const hh = W.terrain.H(ok.x + Math.cos(a) * fr, ok.z + Math.sin(a) * fr); hmin = Math.min(hmin, hh); hmax = Math.max(hmax, hh); }
      const g = new THREE.Group(); g.name = 'prop:' + k.id + '-' + (n + 1); g.add(node);
      g.position.set(ok.x, hmin, ok.z); g.rotation.y = yaw; scene.add(g);
      const trunk = low ? { hw: (low.max.x - low.min.x) / 2, hd: (low.max.z - low.min.z) / 2 } : { hw: rFull, hd: rFull };
      W.obstacles.push({ id: g.name, zone: rectZone(g.name, ok, yaw, trunk.hw, trunk.hd, 0), baseY: hmin, top: sz.y });
      W.props.push({ id: g.name, c: ok, r: rFull, size: sz, footprint: [r2(trunk.hw * 2), r2(trunk.hd * 2)], seat: r2(hmax - hmin), path: k.src.asset.path, commit: REG.revOf(k.src.asset), factor: k.f,
        clearCorridor: r2(blockers[0].dist(ok.x, ok.z) - rFull), clearPads: r2(Math.min(...pads.map((p) => p.dist(ok.x, ok.z))) - rFull) });
    }
  }
  W.rejected = rejected;
  log('props · ' + W.props.length + ' placed · rejected ' + JSON.stringify(rejected));

  /* 7 · Tests */
  const routePath = [];
  for (let s = 10; s <= rt.length; s += 4) routePath.push(rt.sampleAt(s).p);
  routePath.push(rt.sampleAt(rt.length).p.clone().addScaledVector(end.t, 3));
  W.runs.route = runPath(routePath, { limitDeg: LIMITS.routeDeg, label: 'spawn → billboard', stopDist: 1.0 });
  const doorApproach = doorFront.clone().add(rot(new THREE.Vector3(0, 0, walker.params.radius + 0.25), hYaw));
  W.runs.door = runPath([hm.p, pathStart, doorApproach], { limitDeg: LIMITS.routeDeg, label: 'route → house door', stopDist: 0.35 });
  log('route run · ' + (W.runs.route.ok ? 'PASS' : 'FAIL') + ' · door run · ' + (W.runs.door.ok ? 'PASS' : 'FAIL'), !(W.runs.route.ok && W.runs.door.ok));

  /* Walker an den Spawn */
  walker.reset(W.spawn.p.x, W.spawn.p.z, groundAt(W.spawn.p.x, W.spawn.p.z), W.spawn.heading);

  /* 8 · Globus + Fernfläche */
  const mask = await loadMask(log);
  const far = makeFarDisc(mask, ZONE, 250, 120000);
  far.position.set(center.x, 0, center.z);
  scene.add(far);
  globe = makeGlobe(mask, ZONE);
  { /* Einstrahlung des Rigs auf eine waagrechte Fläche (Lambert, physikalisch: /π) */
    const lit = new THREE.Color(0, 0, 0), up = new THREE.Vector3(0, 1, 0);
    for (const k of ['sun', 'sun2', 'fill', 'fill2', 'back', 'petFill']) { const L = rig[k]; const d = L.position.lengthSq() ? L.position.clone().normalize().dot(up) : 1; if (d > 0) lit.add(L.color.clone().multiplyScalar(L.intensity * d)); }
    lit.add(rig.hemi.color.clone().multiplyScalar(rig.hemi.intensity)).add(rig.amb.color.clone().multiplyScalar(rig.amb.intensity)).multiplyScalar(1 / Math.PI);
    globe.U.uLit.value.copy(lit);
    log('handoff colour · horizontal irradiance of the TinySkies rig /π = ' + lit.toArray().map((v) => v.toFixed(2)).join(' ') + ' → globe land at the zone = far disc = region edge');
  }
  log('globe · own display scale (R = 1 u) · zone ' + ZONE.id + ' @ ' + ZONE.lat + ' N ' + ZONE.lon + ' E · handoff 6–60 km');

  /* Tusche: nur Objekte, entfernungsabhängig; Gelände/Route/Fernfläche ausgeschlossen */
  ink = createInk({ renderer, scene, camera });
  ink.setParams({ thin: 1.1, thick: 2.4, wobble: 0, gap: 0, grain: 0, fadeNear: 25, fadeFar: 150, strength: 0.9 });   // W0: keine animierte Linie (kein Kochen/Flackern im Beweis)
  ink.setExcluded([W.terrain.mesh, routeMesh, far]);
  resize();

  W.gates = gates();
  S.ready = true;
  paint();
  S.u = 0.86; flyTo(0.02, 5.5);
  say('WB-W0 ready · flying orbit → ground · WALK (WASD) or re-run the tests', 'ok');
}

/* ---------- Gates ---------- */
function gates() {
  const M = actor.M, xs = W.xs, cap = { r: walker.params.radius, h: Math.max(M.hairTop || 0, M.headTop || 0, M.bodyTopExHair) };
  let spawnMax = 0; for (let a = 0; a < 24; a++) for (const rr of [0, W.spawn.r * 0.5, W.spawn.r]) spawnMax = Math.max(spawnMax, W.terrain.slopeDeg(W.spawn.p.x + Math.cos(a) * rr, W.spawn.p.z + Math.sin(a) * rr));
  let routeMax = 0; for (let s = 0; s <= W.route.length; s += 2) for (const u of [-xs.walkHalf, -xs.surfaceWidth / 2, 0, xs.surfaceWidth / 2, xs.walkHalf]) { const q = W.route.sampleAt(s); const p = q.p.clone().addScaledVector(q.n, u); routeMax = Math.max(routeMax, W.terrain.slopeDeg(p.x, p.z)); }
  const obstInSpawn = W.obstacles.filter((o) => o.zone.dist(W.spawn.p.x, W.spawn.p.z) < W.spawn.r).map((o) => o.id);
  const propsBad = W.props.filter((p) => p.clearCorridor < 0 || p.clearPads < 0).map((p) => p.id);
  const seatBad = W.props.filter((p) => p.seat > 0.35).map((p) => p.id + ' ' + p.seat + ' m');
  const G = [];
  const add = (id, ok, text, data) => G.push({ id, ok, text, data });
  add('SCALE', true, 'GothGirl visualMeshHeight ' + M.visualMeshHeight + ' m · KayKit door ' + r2(W.door.h) + ' m (door/figure ' + r2(W.door.h / M.visualMeshHeight) + ') · route 18,0 m · kit factors TT ×' + W.kit['Tiny Treats'].factor + ' · Kenney ×' + W.kit.Kenney.factor);
  add('RAMP', W.ramp.controllerWalkSlopeMax != null, 'controllerWalkSlopeMax ' + W.ramp.controllerWalkSlopeMax + '° (unchanged walk-controller) · world walk limit ' + W.walkLimit + '°' + (W.walkLimit < LIMITS.walkDeg ? ' (lowered from 30°)' : ''));
  add('SPAWN', spawnMax <= LIMITS.spawnDeg && !obstInSpawn.length, 'max slope ' + r2(spawnMax) + '° ≤ 3° · radius ' + W.spawn.r + ' m (2 × controller probeMax) · obstacles inside: ' + (obstInSpawn.join(', ') || 'none'));
  add('ROUTE SLOPE', routeMax <= LIMITS.routeDeg, 'max slope across surface + shoulder ' + r2(routeMax) + '° ≤ 10° · length ' + r2(W.route.length) + ' m');
  const rr = W.runs.route;
  add('ROUTE RUN', rr.ok, (rr.reached ? 'reached billboard in ' + rr.time + ' s' : 'NOT reached') + ' · hops ' + rr.hops + ' · air ' + rr.air + ' · blocked ' + rr.blocked + ' · sink ' + rr.maxSink + ' m · slope ' + rr.maxSlope + '° · min clearance ' + rr.minClear + ' m (' + rr.clearWhat + ')');
  const dr = W.runs.door, fits = cap.r * 2 <= W.door.w && cap.h <= W.door.h;
  add('DOOR', dr.ok && fits, 'capsule Ø' + r2(cap.r * 2) + ' × ' + r2(cap.h) + ' m in door ' + r2(W.door.w) + ' × ' + r2(W.door.h) + ' m ' + (fits ? '✓' : '✗') + ' · walk to threshold ' + (dr.reached ? 'reached (' + dr.time + ' s, sill step ' + r2(W.door.sill) + ' m)' : 'NOT reached') + ' · house has no interior: door is passed to the threshold, not entered');
  add('EXCLUSION', !propsBad.length, W.props.length + ' props outside corridor (≥ ' + r2(xs.exclusionHalf) + ' m) and pads · min clearance corridor ' + r2(Math.min(...W.props.map((p) => p.clearCorridor))) + ' m · pads ' + r2(Math.min(...W.props.map((p) => p.clearPads))) + ' m' + (propsBad.length ? ' · BAD ' + propsBad.join(', ') : ''));
  add('SEATING', !seatBad.length, 'terrain variation under each prop footprint ≤ 0,35 m' + (seatBad.length ? ' · BAD ' + seatBad.join(', ') : ' · worst ' + r2(Math.max(...W.props.map((p) => p.seat))) + ' m'));
  add('TERRAIN', W.terrain.overNearWalk > 0, 'erosion talus = walk limit ' + W.walkLimit + '° · ' + r2(W.terrain.overShare * 100) + ' % of ground steeper (shown as rock, not released as walkable) · nearest such cell ' + (isFinite(W.terrain.overNearWalk) ? r2(W.terrain.overNearWalk) + ' m outside route/pads' : 'none') + ' · max ' + r2(W.terrain.maxSlope) + '°');
  add('HANDOFF', !!globe, 'globe (display scale) ⇄ region (ENU m) · shared: WGS84 ' + ZONE.lat + '/' + ZONE.lon + ' · ' + ZONE.id + ' · seed ' + ZONE.seed + ' · ' + ZONE.time + ' · crossfade 6–60 km · far disc follows Earth curvature');
  return G;
}

/* ---------- Panel ---------- */
function btn(p, label, on, fn) { const b = mk('button', 'font:400 10px ' + FONT + ';padding:5px 8px;cursor:pointer;background:' + (on ? 'rgba(255,217,160,.12)' : 'rgba(255,255,255,.04)') + ';border:1px solid ' + (on ? GOLD : LINE) + ';color:' + (on ? GOLD : INK), label); b.onclick = fn; p.appendChild(b); return b; }
function sec(title) { const w = mk('div', 'border:1px solid ' + LINE + ';padding:7px 8px;display:flex;flex-direction:column;gap:6px'); w.appendChild(mk('div', 'font:600 9px/1.3 ' + FONT + ';letter-spacing:.14em;color:' + GOLD + ';text-transform:uppercase', title)); panel.appendChild(w); return w; }
let painting = false;
function paint() {
  if (painting) return; painting = true;
  requestAnimationFrame(() => {
    painting = false;
    const keep = panel.scrollTop; panel.textContent = '';
    const h = mk('div', 'display:flex;flex-direction:column;gap:2px');
    h.append(mk('div', 'font:600 12px/1.3 ' + FONT + ';letter-spacing:.1em;color:' + GOLD, 'WB-W0 · WORLD SCALE + TRAVERSABILITY'), mk('div', 'color:' + DIM, 'Köln · dom-zentrum-v0 · Racer route CP0→CP2 · 1 u = 1 m'));
    panel.appendChild(h);
    let b = sec('View');
    const row = mk('div', 'display:flex;flex-wrap:wrap;gap:4px'); b.appendChild(row);
    btn(row, '↑ ORBIT', false, () => flyTo(0.86, 5)); btn(row, '→ APPROACH', false, () => flyTo(0.45, 4)); btn(row, '↓ GROUND', false, () => flyTo(0.02, 5));
    btn(row, S.walk ? 'WALKING (ESC)' : 'WALK · WASD', S.walk, () => setWalk(!S.walk));
    btn(row, S.zonesVis ? 'ZONES ON' : 'ZONES', S.zonesVis, () => { S.zonesVis = !S.zonesVis; zones(); paint(); });
    btn(row, S.ink ? 'INK ON' : 'INK OFF', S.ink, () => { S.ink = !S.ink; paint(); });
    b.appendChild(mk('div', 'color:' + DIM, 'W/S walk · A/D turn · Q/E strafe · Shift run · Space jump · drag = look · wheel = altitude'));
    b = sec('Gates');
    if (!W.gates.length) b.appendChild(mk('div', 'color:' + DIM, 'building…'));
    for (const g of W.gates) {
      const r = mk('div', 'display:grid;grid-template-columns:52px 1fr;gap:6px');
      r.append(mk('div', 'font-weight:600;color:' + (g.ok ? OKC : BAD), (g.ok ? 'PASS' : 'FAIL')), mk('div', '', g.id + ' · ' + g.text));
      b.appendChild(r);
    }
    if (W.gates.length) { const rr = mk('div', 'display:flex;gap:4px;flex-wrap:wrap'); b.appendChild(rr); btn(rr, 'REPLAY ROUTE RUN', !!S.auto, () => replay('route')); btn(rr, 'REPLAY DOOR RUN', false, () => replay('door')); btn(rr, 'COPY REPORT JSON', false, async () => { try { await navigator.clipboard.writeText(JSON.stringify(report(), null, 2)); say('report copied', 'ok'); } catch { say('clipboard blocked · window.__w0.report()'); } }); }
    if (W.ramp) {
      b = sec('Ramp test · unchanged controller');
      for (const r of W.ramp.rows) b.appendChild(mk('div', 'color:' + (r.ok ? OKC : BAD), r.deg + '° · ' + (r.ok ? 'stable' : 'FAIL') + ' · hops ' + r.hops + ' · air ' + r.airFrames + ' · blocked ' + r.blockedFrames + ' · sink ' + r.maxSinkM + ' m · 24 m in ' + (r.reach24mS ?? '—') + ' s'));
      b.appendChild(mk('div', 'color:' + DIM, W.ramp.method));
    }
    if (actor) {
      b = sec('Figure measures · ' + ACTOR.label);
      const M = actor.M;
      for (const [k, v] of [['visualMeshHeight', M.visualMeshHeight], ['foot point', M.footPoint], ['head top', M.headTop], ['hair top', M.hairTop ?? 'part of head mesh'], ['body top w/o hair', M.bodyTopExHair], ['eye rig top', M.eyeRigTop], ['capsule radius (controller)', walker.params.radius], ['door passage height', W.door ? r2(W.door.h) : '—']]) b.appendChild(mk('div', '', k + ' · ' + v + ' m'));
      b.appendChild(mk('div', 'color:' + DIM, M.method));
    }
    b = sec('Load log');
    for (const l of LOG) b.appendChild(mk('div', 'color:' + (l.startsWith('✗') ? BAD : DIM) + ';word-break:break-word', l));
    panel.scrollTop = keep;
  });
}
function report() {
  return {
    schema: 'kfb.wb-w0.report/1', date: new Date().toISOString(), zone: ZONE, limits: LIMITS, walkLimit: W.walkLimit,
    crossSection: W.xs, kit: W.kit, figure: actor && actor.M, controller: { file: 'travel/KFB Travel Combat v25/terrain-v25/walk-controller.js', params: walker && walker.params },
    route: W.route && { length: W.route.length, source: W.route.source, widthNote: W.route.widthNote },
    door: W.door && { w: W.door.w, h: W.door.h, sill: W.door.sill }, props: W.props.map((p) => ({ ...p, c: p.c.toArray().map(r2) })), rejected: W.rejected,
    ramp: W.ramp, runs: { route: { ...W.runs.route, trail: W.runs.route.trail.length + ' samples' }, door: { ...W.runs.door, trail: W.runs.door.trail.length + ' samples' } }, gates: W.gates, log: LOG
  };
}

/* ---------- Zonen sichtbar machen ---------- */
let zoneGroup = null;
function zones() {
  if (zoneGroup) { scene.remove(zoneGroup); zoneGroup = null; }
  if (!S.zonesVis || !W.terrain) return;
  zoneGroup = new THREE.Group();
  const lineAt = (pts, color) => { const g = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, W.terrain.H(p.x, p.z) + 0.25, p.z))); zoneGroup.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color, depthTest: false }))); };
  for (const off of [W.xs.exclusionHalf, -W.xs.exclusionHalf]) { const pts = []; for (let s = 0; s <= W.route.length; s += 2) { const q = W.route.sampleAt(s); pts.push(q.p.clone().addScaledVector(q.n, off)); } lineAt(pts, 0xff9a86); }
  for (const p of W.pads) { const pts = []; for (let a = 0; a <= 64; a++) { const ang = a / 64 * Math.PI * 2; let r = 1; for (let k = 0; k < 40; k++) { if (p.dist(p.c ? p.c.x + Math.cos(ang) * r : 0, p.c ? p.c.z + Math.sin(ang) * r : 0) > 0) break; r += 1; } if (p.c) pts.push(new THREE.Vector3(p.c.x + Math.cos(ang) * r, 0, p.c.z + Math.sin(ang) * r)); } if (pts.length) lineAt(pts, 0xffd27a); }
  for (const o of W.obstacles) { const c = o.zone.c, pts = []; for (let a = 0; a <= 32; a++) { const ang = a / 32 * Math.PI * 2; let r = 0.1; while (o.zone.dist(c.x + Math.cos(ang) * r, c.z + Math.sin(ang) * r) < 0 && r < 20) r += 0.1; pts.push(new THREE.Vector3(c.x + Math.cos(ang) * r, 0, c.z + Math.sin(ang) * r)); } lineAt(pts, 0x9ad0ff); }
  scene.add(zoneGroup);
}

/* ---------- Bedienung ---------- */
function flyTo(u1, dur) { S.tw = { u0: S.u, u1, t: 0, dur }; }
function setWalk(on) { S.walk = !!on && S.ready; S.auto = null; if (S.walk) { flyTo(0.02, 1.5); canvas.focus(); } paint(); }
function replay(which) { const r = W.runs[which]; if (!r) return; S.walk = false; S.auto = { trail: r.trail, i: 0 }; flyTo(0.02, 1.5); say('replay · ' + r.label, 'ok'); paint(); }
let drag = null;
canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY }; S.tw = null; S.yawOff -= dx * 0.006; S.u = Math.max(0, Math.min(1, S.u + dy * 0.0012)); });
canvas.addEventListener('pointerup', () => { drag = null; });
canvas.addEventListener('wheel', (e) => { e.preventDefault(); S.tw = null; S.u = Math.max(0, Math.min(1, S.u + e.deltaY * 0.0006)); }, { passive: false });
addEventListener('keydown', (e) => { keys[e.code] = true; if (e.code === 'Escape') setWalk(false); if (S.walk && e.code === 'Space') walker.jump(); if (S.walk && /Key[WASDQE]|Space/.test(e.code)) e.preventDefault(); });
addEventListener('keyup', (e) => { keys[e.code] = false; });

/* ---------- Takt ---------- */
let last = performance.now(), lastFrame = 0, t0 = performance.now();
function frame() {
  const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now; lastFrame = now;
  if (S.tw) { S.tw.t += dt; const k = Math.min(1, S.tw.t / S.tw.dur); S.u = S.tw.u0 + (S.tw.u1 - S.tw.u0) * (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2); if (k >= 1) S.tw = null; }
  if (S.ready) {
    if (S.walk) {
      walker.setInput((keys.KeyQ ? -1 : 0) + (keys.KeyE ? 1 : 0), (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0));
      walker.update(dt, { turn: (keys.KeyA ? 1 : 0) - (keys.KeyD ? 1 : 0), sprint: !!(keys.ShiftLeft || keys.ShiftRight) }, groundAt);
    } else if (S.auto) {
      const t = S.auto.trail, i = Math.min(t.length - 1, Math.floor(S.auto.i)), j = Math.min(t.length - 1, i + 1), f = S.auto.i - i;
      const p = new THREE.Vector3(...t[i]).lerp(new THREE.Vector3(...t[j]), f);
      const hd = Math.atan2(t[j][0] - t[i][0], t[j][2] - t[i][2]);
      walker.reset(p.x, p.z, p.y, isFinite(hd) && (t[j][0] !== t[i][0] || t[j][2] !== t[i][2]) ? hd : walker.state.heading);
      walker.state.moving = true;
      S.auto.i += dt * 3;
      if (S.auto.i >= t.length - 1) S.auto = null;
    } else walker.update(dt, { turn: 0 }, groundAt);
    const st = walker.state;
    actor.sync({ position: st.position, facing: st.heading, moving: S.auto ? true : st.moving, sprinting: st.sprinting }, dt);
    S.yawOff *= S.walk ? Math.exp(-dt * 0.8) : 1;
  }
  const h = cameraApply();
  const scn = scene.getObjectByName('sun');
  if (scn && walker) {
    /* Schattenbox folgt der Figur in ganzen Texelschritten — sonst schwimmen die Schattenkanten
       jedes Bild um Bruchteile eines Texels (Flackern auf grossen Flächen wie der Tafel) */
    const texel = (scn.shadow.camera.right - scn.shadow.camera.left) / scn.shadow.mapSize.x;
    const p = walker.state.position, sd = new THREE.Vector3(-1.6, 1.1, 0.9).normalize();
    const e1 = new THREE.Vector3(0, 1, 0).cross(sd).normalize(), e2 = sd.clone().cross(e1).normalize();
    const a = Math.round(p.dot(e1) / texel) * texel, c = Math.round(p.dot(e2) / texel) * texel, d = p.dot(sd);
    const snapped = e1.multiplyScalar(a).addScaledVector(e2, c).addScaledVector(sd, d);
    scn.target.position.copy(snapped); scn.position.copy(snapped).addScaledVector(sd, 400); scn.target.updateMatrixWorld();
  }
  const ga = globe ? sstep(6e3, 6e4, h) : 0;
  renderer.setRenderTarget(null); renderer.clear();
  if (ga < 0.999) { if (S.ink && ink && h < 2000) ink.render((now - t0) / 1000); else renderer.render(scene, camera); }
  if (globe && ga > 0.001) {
    globe.setAlpha(ga); globe.sync(camera, target, h);
    renderer.clearDepth(); renderer.render(globe.scene, globe.camera);
  }
  alt.textContent = (h >= 1000 ? r2(h / 1000) + ' km' : r2(h) + ' m') + ' · ' + (ga > 0.99 ? 'GLOBE' : ga < 0.01 ? 'REGION ENU' : 'HANDOFF ' + Math.round(ga * 100) + '%') + (S.walk ? ' · WALK' : S.auto ? ' · REPLAY' : '');
}
function loop() { frame(); requestAnimationFrame(loop); }
setInterval(() => { if (performance.now() - lastFrame > 250) frame(); }, 100);
requestAnimationFrame(loop);
boot().catch((e) => { console.error(e); log('BOOT FAILED · ' + e.message, true); });
window.__w0 = { W, S, report, get walker() { return walker; }, get actor() { return actor; }, flyTo, scene, camera, renderer };
