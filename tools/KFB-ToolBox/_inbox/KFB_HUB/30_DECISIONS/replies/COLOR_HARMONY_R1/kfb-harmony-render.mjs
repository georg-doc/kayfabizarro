// KFB Farbharmonie R1 · Bildnachweis (node kfb-harmony-render.mjs)
// Liest results.json (vorher kfb-harmony-run.mjs), rendert große Querformat-Bilder in ./bilder/ mit headless Chrome
// (playwright-core + three aus dem Lab-node_modules, nur gelesen). Kein Server, kein Port: Dateien über page.route.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { J17 } from './j17-reference.js';
import { hexToOklch, variantsOf } from './kfb-cartoon-palette.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.join(process.env.HOME, 'Dropbox/CLAUDE/KFB Island Worldbuilder Lab');
const require = createRequire(path.join(LAB, 'package.json'));
const { chromium } = require('playwright-core');
const THREE_DIR = path.join(LAB, 'node_modules/three/build');
const OUT = path.join(HERE, 'bilder'); fs.mkdirSync(OUT, { recursive: true });
const R = JSON.parse(fs.readFileSync(path.join(HERE, 'results.json'), 'utf8'));
const only = process.argv[2];   // optional: nur Bilder, deren Name das enthält

const NAMES = { sky: 'Himmel', cloud: 'Wolke', top: 'Boden', top2: 'Boden hell', hillLight: 'Hügel hell', hillDark: 'Hügel dunkel', rim: 'Rand', under0: 'Unterseite',
  earth1: 'Erde 1', earth2: 'Erde 2', earth3: 'Erde 3', trunk: 'Stamm', leafLight: 'Laub hell', leafDark: 'Laub dunkel', leafMid: 'Laub', bloom: 'Blüte', strang: 'Strang · Rahmen',
  tower0: 'Wahrzeichen', tower1: 'Wahrzeichen hell', rock: 'Fels', pad: 'Pad (Boost)', water: 'Wasser', sand: 'Sand', path: 'Weg', roadTrack: 'Fahrbahn', roadStreet: 'Straße' };
const PAIR_ORDER = ['top', 'top2', 'hillLight', 'hillDark', 'under0', 'strang', 'tower0', 'tower1', 'pad', 'rock', 'leafDark', 'leafLight', 'bloom', 'trunk', 'earth1',
  'earth2', 'earth3', 'sky', 'cloud', 'water', 'sand', 'path', 'rim', 'roadTrack', 'roadStreet'];
const SHORT_ORDER = ['top', 'top2', 'hillLight', 'hillDark', 'strang', 'tower0', 'tower1', 'pad', 'leafDark', 'leafLight', 'bloom', 'trunk', 'earth2', 'rock', 'sky', 'cloud', 'water', 'sand', 'path', 'roadTrack'];
const MODE_DE = m => `Boden ${m.boden === 'strand' ? 'Strand (hell)' : 'Tisch (mittel)'} · Wahrzeichen ${m.wahrzeichen} · Laub ${m.laub === 'herbst' ? 'Herbst' : 'grün'}`;
const SCHEME_DE = { joyride: 'Joyride-Regel', komplementaer: 'Komplementär', split: 'Split-Komplementär', triade: 'Triade', analog: 'Analog' };
const de = x => String(x).replace('.', ',');
const ink = hex => (hexToOklch(hex).L > 0.62 ? '#1d1a24' : '#fbf6ec');

const CSS = `*{box-sizing:border-box;margin:0}body{background:#f4efe6;font-family:-apple-system,"Helvetica Neue",Helvetica,Arial,sans-serif;color:#1d1a24}
h1{font-size:46px;font-weight:800;letter-spacing:-.5px}h2{font-size:34px;font-weight:800}.sub{font-size:24px;color:#4a4552;margin-top:6px}
.tile{border-radius:18px;display:flex;flex-direction:column;justify-content:flex-end;padding:12px 14px;box-shadow:0 2px 0 rgba(0,0,0,.08) inset}
.tile b{font-size:23px;font-weight:750;line-height:1.1}.tile i{font-style:normal;font-size:18px;opacity:.85;margin-top:3px;font-family:Menlo,monospace}
.de{position:absolute;top:10px;right:12px;font-size:19px;font-weight:800;padding:2px 8px;border-radius:9px;background:rgba(255,255,255,.82);color:#1d1a24}
.de.ok{background:#e7f6dc}.de.mid{background:#fff1c2}.de.bad{background:#ffd6cc}`;

function tile(hex, name, extra = '', h = 150) {
  return `<div class="tile" style="position:relative;background:${hex};color:${ink(hex)};height:${h}px">${extra}<b>${name}</b><i>${hex}</i></div>`;
}
const deTag = d => `<span class="de ${d < 0.03 ? 'ok' : d < 0.06 ? 'mid' : 'bad'}">ΔE ${de(d.toFixed(3))}</span>`;

// ---------- Paar-Bild J17 Original | Regel
function pairPage(id) {
  const w = R.j17[id], pr = w.perRole;
  const col = (side) => `<div style="flex:1"><h2 style="margin-bottom:14px">${side === 'original' ? 'J17 Original' : 'Aus der Regel nachgebaut'}</h2>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px">${PAIR_ORDER.map(k => tile(side === 'original' ? pr[k].original : pr[k].regel, NAMES[k], side === 'regel' ? deTag(pr[k].dE) : '', 168)).join('')}</div></div>`;
  return `<style>${CSS}</style><div style="width:2400px;height:1340px;padding:40px 48px">
    <h1>${w.label} · Original (links) und Nachbau aus einem Farbton (rechts)</h1>
    <div class="sub">Eingabe nur Boden-Farbton ${de(w.anchorHue.toFixed(1))}° · ${MODE_DE(w.mode)} · mittleres ΔE ${de(w.meanDE.toFixed(3))} (ohne Fahrbahn ${de(w.meanDE_ohneFahrbahn.toFixed(3))}) · ${w.under005} von ${w.roles} Rollen unter 0,05 · ΔE &lt; 0,03 grün, &lt; 0,06 gelb</div>
    <div style="display:flex;gap:56px;margin-top:30px">${col('original')}${col('regel')}</div></div>`;
}

// ---------- Drei-Paletten-Bild (Story / Zufall)
function triPage(title, sub, items) {
  const column = it => {
    const f = it.p.flat, v = it.p.variants;
    const head = it.head ?? '';
    const vrow = (k, name) => `<div style="display:grid;grid-template-columns:120px 1fr 1fr 1fr;gap:8px;align-items:center;margin-top:8px"><b style="font-size:20px">${name}</b>${['dunkel', 'mitte', 'satt'].map(x => `<div class="tile" style="height:74px;background:${v[k][x]};color:${ink(v[k][x])};padding:8px 10px"><b style="font-size:18px">${x}</b><i style="font-size:15px">${v[k][x]}</i></div>`).join('')}</div>`;
    return `<div style="flex:1;min-width:0"><h2>${it.title}</h2><div class="sub" style="font-size:20px;min-height:56px">${it.sub}</div>${head}
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px">${SHORT_ORDER.map(k => tile(f[k], NAMES[k], '', 128)).join('')}</div>
      ${vrow('strang', 'Strang')}${vrow('tower', 'Wahrzeichen')}</div>`;
  };
  return `<style>${CSS}</style><div style="width:2400px;height:1500px;padding:36px 44px"><h1>${title}</h1><div class="sub">${sub}</div>
    <div style="display:flex;gap:44px;margin-top:24px">${items.map(column).join('')}</div></div>`;
}
function storyItems(ids) {
  return ids.map(id => { const p = R.storyModes[id], s = p.source, L = p.lightness;
    const head = `<div style="display:flex;gap:10px;margin-top:10px">${[['Website dunkel', s.storyDunkel], ['Website satt', s.storySatt]].map(([n, h]) => `<div class="tile" style="flex:1;height:84px;background:${h};color:${ink(h)}"><b style="font-size:19px">${n}</b><i>${h}</i></div>`).join('')}
      <div style="flex:1.25;font-size:19px;line-height:1.3;padding:6px 4px">Website L ${de(L.websiteDunkelL.toFixed(2))} / ${de(L.websiteSattL.toFixed(2))}<br><b>Spiel: Boden L ${de(L.spielBodenL.toFixed(2))}, Strang L ${de(L.spielStrangL.toFixed(2))}</b></div></div>`;
    return { p, title: `${s.label} · Farbton ${de(s.hue.toFixed(0))}°`, sub: MODE_DE(p.mode), head }; });
}
function randomItems(list) {
  return list.map(p => ({ p, title: `Zufall · Seed ${p.seed}`, sub: `${SCHEME_DE[p.scheme]} · Boden ${de(p.hues.ground.toFixed(0))}°<br>${MODE_DE(p.mode)}` }));
}

// ---------- 3D-Testszene (three.js, WS1-Bühnenlicht)
function scenePage(pal, title, sub) {
  const P = JSON.stringify(pal);
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}html,body{width:1920px;height:1080px;overflow:hidden}canvas{display:block}
  #lab{position:absolute;left:36px;top:30px;background:rgba(251,246,236,.9);padding:16px 24px;border-radius:20px}#lab h1{font-size:44px}#lab .sub{font-size:23px}
  #leg{position:absolute;right:30px;top:30px;bottom:30px;width:230px;display:flex;flex-direction:column;gap:8px;background:rgba(251,246,236,.9);padding:10px;border-radius:20px}#leg div{flex:1;border-radius:12px;padding:6px 12px;font-size:21px;font-weight:750;display:flex;align-items:center}</style>
  <script type="importmap">{"imports":{"three":"http://kfb.local/three/three.module.js"}}</script></head><body>
  <canvas id="c" width="1920" height="1080"></canvas><div id="lab"><h1>${title}</h1><div class="sub">${sub}</div></div><div id="leg"></div>
  <script type="module">
  import * as THREE from 'three';
  const P = ${P};
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(1920, 1080, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;   // WS1: keine Tonabbildung, sRGB
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 400);
  camera.position.set(1.5, 7.5, 32); camera.lookAt(2.6, -0.4, 0);
  // WS1-Bühnenlicht: Hemisphäre 0xfff4e0 / 0x3a3226 · 1,25, Sonne 0xffffff · 1,8 bei (6, 11, 7)
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x3a3226, 1.25));
  const sun = new THREE.DirectionalLight(0xffffff, 1.8); sun.position.set(6, 11, 7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 0.5, far: 60 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04; scene.add(sun);
  // Himmel: Verlauf Himmel (oben) → Wolke (Horizont), unbeleuchtet
  { const g = new THREE.SphereGeometry(200, 48, 24), c = [], top = new THREE.Color(P.sky), hor = new THREE.Color(P.sky).lerp(new THREE.Color(P.cloud), 0.45), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const t = Math.max(0, Math.min(1, (p.getY(i) + 10) / 90)); const k = hor.clone().lerp(top, Math.pow(t, 0.6)); c.push(k.r, k.g, k.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }))); }
  // Knete: leicht verbeulte Formen, matt
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const mat = hex => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.86, metalness: 0 });
  function lumpy(geo, amp = 0.06, f = 1.3) { const p = geo.attributes.position, v = new THREE.Vector3(); const o = [rnd() * 10, rnd() * 10, rnd() * 10];
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = Math.sin(v.x * f + o[0]) * Math.sin(v.y * f * 1.1 + o[1]) * Math.sin(v.z * f * 0.9 + o[2]); v.multiplyScalar(1 + amp * n); p.setXYZ(i, v.x, v.y, v.z); }
    geo.computeVertexNormals();
    if (geo.type === 'IcosahedronGeometry' || geo.type === 'DodecahedronGeometry') { const nn = geo.attributes.normal; for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); nn.setXYZ(i, v.x, v.y, v.z); } }   // weiche Knete statt Facetten
    return geo; }
  const add = (geo, hex, pos, rot = [0, 0, 0], scl = [1, 1, 1]) => { const m = new THREE.Mesh(geo, mat(hex)); m.position.set(...pos); m.rotation.set(...rot); m.scale.set(...scl); m.castShadow = m.receiveShadow = true; scene.add(m); return m; };
  const blob = (r, hex, pos, scl = [1, 1, 1], amp = 0.07) => add(lumpy(new THREE.IcosahedronGeometry(r, 12), amp), hex, pos, [0, 0, 0], scl);
  // Insel: Boden (Tisch), Rand, Unterseite (Erde-Schichten) — schwebt im Himmel
  add(lumpy(new THREE.CylinderGeometry(15, 14.6, 1.2, 96, 2), 0.012, 0.5), P.top, [0, -0.6, 0]);
  add(new THREE.TorusGeometry(14.75, 0.42, 16, 120), P.rim, [0, -0.05, 0], [Math.PI / 2, 0, 0]);
  add(lumpy(new THREE.CylinderGeometry(14.6, 11, 1.6, 96, 1), 0.02, 0.6), P.under0, [0, -2.0, 0]);
  add(lumpy(new THREE.CylinderGeometry(11, 7.5, 1.8, 80, 1), 0.03, 0.7), P.earth1, [0, -3.7, 0]);
  add(lumpy(new THREE.CylinderGeometry(7.5, 3.5, 2.0, 64, 1), 0.04, 0.8), P.earth2, [0, -5.6, 0]);
  add(lumpy(new THREE.ConeGeometry(3.5, 3.2, 48, 1), 0.05, 0.9), P.earth3, [0, -8.2, 0], [Math.PI, 0, 0]);
  // Flecken Boden hell
  for (const [x, z, r] of [[-6, 3, 2.6], [5, 6, 2.0], [-1, -6, 3.0], [9, -1, 1.8]]) add(new THREE.CylinderGeometry(r, r, 0.04, 40), P.top2, [x, 0.02, z]);
  // Hügel
  blob(4.2, P.hillDark, [-8.5, -0.6, -6.5], [1.3, 0.62, 1.0]); blob(3.4, P.hillLight, [-4.8, -0.6, -8.5], [1.4, 0.7, 1.0]); blob(3.6, P.hillLight, [9.5, -0.7, -7.5], [1.2, 0.6, 1.0]);
  // Teich mit Sand
  add(new THREE.CylinderGeometry(3.3, 3.3, 0.06, 48), P.sand, [7.6, 0.02, 3.4]); add(new THREE.CylinderGeometry(2.6, 2.6, 0.08, 48), P.water, [7.6, 0.05, 3.4]);
  // Weg + Fahrbahn mit Strang-Bande und Pad
  add(new THREE.BoxGeometry(2.0, 0.07, 9), P.path, [3.6, 0.03, 6.0], [0, 0.35, 0]);
  { const road = add(new THREE.BoxGeometry(19, 0.14, 3.2), P.roadTrack, [0, 0.07, 9.6]);
    for (const z of [7.85, 11.35]) add(new THREE.CapsuleGeometry(0.32, 17.6, 6, 16), P.strang, [0, 0.3, z], [0, 0, Math.PI / 2]);
    const arrow = new THREE.Shape(); arrow.moveTo(-1.1, -0.7); arrow.lineTo(0.2, -0.7); arrow.lineTo(0.2, -1.15); arrow.lineTo(1.3, 0); arrow.lineTo(0.2, 1.15); arrow.lineTo(0.2, 0.7); arrow.lineTo(-1.1, 0.7);
    const ag = new THREE.ExtrudeGeometry(arrow, { depth: 0.08, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.04, bevelSegments: 2 }); ag.rotateX(-Math.PI / 2);
    add(ag, P.pad, [-3.5, 0.16, 9.6]); }
  // Wahrzeichen: schiefer Turm aus Knet-Scheiben (Wahrzeichen / Wahrzeichen hell)
  { let y = 0; const g = new THREE.Group(); g.position.set(-5.2, 0, -1.8); g.rotation.z = 0.08; scene.add(g);
    [[1.55, 1.3], [1.35, 1.2], [1.2, 1.1], [1.05, 1.0], [0.9, 0.9]].forEach(([r, h], i) => { const m = new THREE.Mesh(lumpy(new THREE.CylinderGeometry(r * 0.92, r, h, 40, 2), 0.03, 1.4), mat(i % 2 ? P.tower1 : P.tower0));
      m.position.y = y + h / 2; m.rotation.z = (i % 2 ? -1 : 1) * 0.05; m.castShadow = m.receiveShadow = true; g.add(m); y += h * 0.96; });
    const cap = new THREE.Mesh(lumpy(new THREE.ConeGeometry(1.15, 1.4, 32), 0.03), mat(P.tower0)); cap.position.y = y + 0.6; cap.castShadow = true; g.add(cap); }
  // Fels
  add(lumpy(new THREE.DodecahedronGeometry(1.25, 1), 0.08), P.rock, [-1.2, 0.6, 3.2], [0.3, 0.6, 0.1], [1.2, 0.8, 1]);
  add(lumpy(new THREE.DodecahedronGeometry(0.7, 1), 0.08), P.rock, [0.4, 0.35, 4.1], [0.5, 0.2, 0.3]);
  // Baum: krummer Stamm, Kronen Laub dunkel / hell, Blüten
  { const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 1.2, 0), new THREE.Vector3(-0.1, 2.4, 0.1), new THREE.Vector3(0.2, 3.4, 0)]);
    const tx = 2.2, tz = -1.5; add(new THREE.TubeGeometry(curve, 24, 0.36, 14), P.trunk, [tx, 0, tz]);
    blob(1.9, P.leafDark, [tx + 0.1, 4.4, tz], [1, 0.9, 1]); blob(1.25, P.leafLight, [tx + 1.3, 5.2, tz + 0.6]); blob(1.15, P.leafLight, [tx - 1.2, 4.9, tz + 0.7]);
    for (const [dx, dy, dz] of [[0.9, 5.6, 1.5], [-0.6, 5.9, 1.2], [1.6, 4.4, 1.3], [-1.6, 4.2, 1.1], [0.2, 3.7, 1.8]]) blob(0.22, P.bloom, [tx + dx, dy, tz + dz], [1, 1, 1], 0.03);
    // Fluff-Kugel (wächst am Baum, hier im Gras darunter): Blüte satt
    const fl = new THREE.Group(); fl.position.set(tx + 2.4, 0.75, tz + 2.4); scene.add(fl);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 4), mat(P.fluff)); core.castShadow = true; fl.add(core);
    for (let i = 0; i < 60; i++) { const d = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2 + rnd() * 0.1, 2), mat(P.fluff)); s.position.copy(d.multiplyScalar(0.6)); s.castShadow = true; fl.add(s); } }
  // Display-Rahmen (Billboard): Rahmen Strang, Pfosten Stamm, Fläche Wolke, Leiste Pad
  { const bx = 7.2, bz = -2.6, g = new THREE.Group(); g.position.set(bx, 0, bz); g.rotation.y = -0.2; scene.add(g);
    const put = (geo, hex, x, y, z) => { const m = new THREE.Mesh(geo, mat(hex)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); };
    put(new THREE.CylinderGeometry(0.22, 0.26, 3.2, 16), P.trunk, -2.0, 1.6, 0); put(new THREE.CylinderGeometry(0.22, 0.26, 3.2, 16), P.trunk, 2.0, 1.6, 0);
    put(new THREE.BoxGeometry(4.6, 2.9, 0.2), P.cloud, 0, 4.4, 0.0);
    for (const [w, h, x, y] of [[5.2, 0.42, 0, 5.95], [5.2, 0.42, 0, 2.85], [0.42, 3.5, -2.4, 4.4], [0.42, 3.5, 2.4, 4.4]]) put(new THREE.BoxGeometry(w, h, 0.34), P.strang, x, y, 0.0);
    put(new THREE.BoxGeometry(3.6, 0.36, 0.1), P.pad, 0, 3.55, 0.12); put(new THREE.BoxGeometry(2.6, 0.9, 0.1), P.tower0, -0.5, 4.75, 0.12); }
  // Wolken
  for (const [x, y, z, s] of [[-17, 2.5, -34, 1.3], [16, 4.5, -40, 1.6], [3, 7.5, -55, 1.2]]) { for (let i = 0; i < 4; i++) blob(2.2 * s * (0.7 + rnd() * 0.5), P.cloud, [x + (i - 1.5) * 2.6 * s, y + rnd() * 1.2, z], [1, 0.75, 1], 0.05); }
  renderer.render(scene, camera);
  const leg = [['Himmel', P.sky], ['Boden', P.top], ['Hügel', P.hillLight], ['Strang · Rahmen', P.strang], ['Wahrzeichen', P.tower0], ['Laub', P.leafDark], ['Blüte', P.bloom], ['Stamm', P.trunk], ['Fels', P.rock], ['Fluff', P.fluff], ['Pad', P.pad], ['Fahrbahn', P.roadTrack]];
  document.getElementById('leg').innerHTML = leg.map(([n, h]) => '<div style="background:' + h + ';color:' + (window.__ink(h)) + '">' + n + '</div>').join('');
  window.__done = true;
  </script><script>window.__ink = h => { const n = parseInt(h.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#1d1a24' : '#fbf6ec'; };</script></body></html>`;
}
// Original-J17 als Szenen-Palette (flache Rollen)
function j17Flat(o) {
  const m = { sky: o.sky, cloud: o.cloud, top: o.top, top2: o.top2, rim: o.rim, under0: o.under[0], earth1: o.under[1], earth2: o.under[2], earth3: o.under[3],
    hillLight: hexToOklch(o.hill[0]).L > hexToOklch(o.hill[1]).L ? o.hill[0] : o.hill[1], hillDark: hexToOklch(o.hill[0]).L > hexToOklch(o.hill[1]).L ? o.hill[1] : o.hill[0],
    sand: o.sand, water: o.water, path: o.path, roadTrack: o.roadTrack, strang: o.strang, pad: o.pad, tower0: o.tower[0], tower1: o.tower[1], rock: o.rock,
    trunk: o.trunk, leafDark: o.leaf[0], leafLight: o.leaf[1], bloom: o.leaf[2] };
  return m;
}

// ---------- Ablauf
const pages = [];
for (const id of ['canyon', 'bucht', 'otown']) pages.push({ name: `01_j17_${id}_original_vs_regel`, html: pairPage(id), w: 2400, h: 1340 });
pages.push({ name: '02_storymodes_1_tragic_comic_absurd', html: triPage('Story-Mode-Paletten 1/2 · Spiel-Helligkeit', 'Farbton aus der Website-Farbe (V-292) wird Boden-Farbton · Helligkeit und Buntheit aus der J17-Leiter · Website-Farben bleiben für Schrift und Linien', storyItems(['tragic', 'comic', 'absurd'])), w: 2400, h: 1500 });
pages.push({ name: '02_storymodes_2_heroic_mystical_forbidden', html: triPage('Story-Mode-Paletten 2/2 · Spiel-Helligkeit', 'Farbton aus der Website-Farbe (V-292) wird Boden-Farbton · Helligkeit und Buntheit aus der J17-Leiter · Website-Farben bleiben für Schrift und Linien', storyItems(['heroic', 'mystical', 'forbidden'])), w: 2400, h: 1500 });
for (let i = 0; i < 4; i++) pages.push({ name: `03_zufall_${i + 1}_seeds_${R.random.slice(i * 3, i * 3 + 3).map(p => p.seed).join('-')}`, html: triPage(`Zufallspaletten ${i + 1}/4`, 'Würfel: Boden-Farbton zufällig, Schema gewichtet (Joyride 4 · Komplementär 2 · Split 2 · Triade 2 · Analog 1), Farbtöne ±6°, Stimmung L ±0,02 / C ×0,92–1,08 · ungeschönt: Seeds 1–12', randomItems(R.random.slice(i * 3, i * 3 + 3))), w: 2400, h: 1500 });

const ot = J17.otown, otReg = R.j17.otown.palette, story = R.storyModes.mystical, rnd = R.random[8];
const withFluff = (flat, satt) => ({ ...flat, fluff: satt });
// Fluff = Blüte satt (Variante aus dem Modell); für das Original wird dieselbe Variantenregel auf die Original-Blüte angewendet
const sattOf = hex => { const o = hexToOklch(hex); return variantsOf({ L: o.L, C: o.C, h: o.h }).satt; };
pages.push({ name: '04_szene_1_otown_original', html: scenePage(withFluff(j17Flat(ot), sattOf(ot.leaf[2])), 'O-Town · J17 Original', 'Testszene Knete · WS1-Bühnenlicht (Hemisphäre 1,25 · Sonne 1,8 · keine Tonabbildung · sRGB)'), w: 1920, h: 1080 });
pages.push({ name: '04_szene_2_otown_regel', html: scenePage(withFluff(otReg.flat, otReg.variants.bloom.satt), 'O-Town · aus der Regel nachgebaut', `nur Boden-Farbton ${de(R.j17.otown.anchorHue.toFixed(0))}° als Eingabe · mittleres ΔE ${de(R.j17.otown.meanDE.toFixed(3))} · gleiche Szene, gleiches Licht`), w: 1920, h: 1080 });
pages.push({ name: '04_szene_3_storymode_mystical', html: scenePage(withFluff(story.flat, story.variants.bloom.satt), `Story-Mode Mystical · Farbton ${de(story.source.hue.toFixed(0))}°`, `Website ${story.source.storyDunkel} / ${story.source.storySatt} → Spiel-Palette (Boden L ${de(story.lightness.spielBodenL.toFixed(2))}) · ${MODE_DE(story.mode)}`), w: 1920, h: 1080 });
pages.push({ name: `04_szene_4_zufall_seed_${rnd.seed}`, html: scenePage(withFluff(rnd.flat, rnd.variants.bloom.satt), `Zufallspalette · Seed ${rnd.seed}`, `${SCHEME_DE[rnd.scheme]} · Boden ${de(rnd.hues.ground.toFixed(0))}° · ${MODE_DE(rnd.mode)}`), w: 1920, h: 1080 });

const exe = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(c => fs.existsSync(c) && spawnSync(c, ['--version'], { timeout: 15000 }).status === 0);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist'] });
try {
  for (const pg of pages) {
    if (only && !pg.name.includes(only)) continue;
    const page = await browser.newPage({ viewport: { width: pg.w, height: pg.h }, deviceScaleFactor: 1 });
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await page.route('http://kfb.local/**', async route => {
      const u = new URL(route.request().url());
      if (u.pathname.startsWith('/three/')) return route.fulfill({ path: path.join(THREE_DIR, path.basename(u.pathname)), contentType: 'text/javascript' });
      if (u.pathname === '/page.html') return route.fulfill({ body: pg.html.startsWith('<!doctype') ? pg.html : `<!doctype html><html><head><meta charset="utf-8"></head><body>${pg.html}</body></html>`, contentType: 'text/html' });
      return route.fulfill({ status: 404, body: '' });
    });
    await page.goto('http://kfb.local/page.html');
    if (pg.name.startsWith('04_')) await page.waitForFunction(() => window.__done === true, null, { timeout: 60000 });
    await page.waitForTimeout(200);
    const file = path.join(OUT, pg.name + '.png');
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: pg.w, height: pg.h } });
    console.log((errs.length ? 'FEHLER ' + errs.join(' | ') + ' · ' : '') + file);
    await page.close();
  }
} finally { await browser.close(); }
