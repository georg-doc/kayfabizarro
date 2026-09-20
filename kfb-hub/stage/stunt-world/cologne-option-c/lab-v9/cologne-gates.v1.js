// KFB Cologne Race · Option C · Tore und Ziellinie
//
// ZWEITER ANLAUF, und diesmal ohne neue Erfindung.
//
// Was vorher falsch war:
//   1. Kenney-Torbauten auf Bandbreite hochskaliert — ein schlanker Bogen wurde
//      zur Flaeche quer ueber der Fahrbahn.
//   2. Danach eigene Tore erfunden: ein Portal aus dicken hellen Roehren, das
//      weder zur Architektur noch zur Palette passte.
//   3. Die Ziellinie aus einzelnen Kaestchen gebaut, die als lose Platten ueber
//      der Fahrbahn schwebten statt als Muster AUF ihr zu liegen.
//
// Was jetzt gilt:
//   · Der Bogen der Hohenzollernbruecke funktioniert bereits — parabolischer
//     Bogen aus kurzen Segmenten, Haenger zur Fahrbahn, Querverband. Genau diese
//     Konstruktion tragen die Tore, nur farblich angepasst und auf Bandbreite
//     gespannt. Kein neues Formvokabular.
//   · Die Ziellinie ist eine TEXTUR auf dem Fahrbahnband, kein Objektstapel.
//     Nahtlos gekacheltes Schachbrett, folgt Breite und Ueberhoehung.

import { C } from './option-c-style.v1.js';

const MIN_CLEAR = 9.0;

const mat = (THREE, color, opts = {}) => new THREE.MeshStandardMaterial(
  Object.assign({ color, roughness: 0.86, metalness: 0.0 }, opts));

function crossPoint(p, u, lift) {
  const half = p.w * 0.5;
  const off = u * half;
  return {
    x: p.x + p.nx * off,
    y: p.y + Math.sin(p.bank) * off + (lift || 0),
    z: p.z + p.nz * off
  };
}

function strut(THREE, a, b, r, m, seg) {
  const va = new THREE.Vector3(a.x, a.y, a.z);
  const vb = new THREE.Vector3(b.x, b.y, b.z);
  const d = vb.clone().sub(va);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), seg || 8), m);
  mesh.position.copy(va).add(vb).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  mesh.castShadow = true;
  return mesh;
}

// Der Brueckenbogen, uebernommen. Stich, Segmentzahl und Haenger folgen der
// Konstruktion aus cologne-landmarks.v1.js#hohenzollern — nur die Spannweite
// kommt hier aus der Bandbreite und die Farbe aus der Palette.
function archGate(THREE, p, opts) {
  const g = new THREE.Group();
  const steel = mat(THREE, opts.body, { emissive: opts.body, emissiveIntensity: 0.1 });
  const light = new THREE.MeshBasicMaterial({ color: opts.trim, toneMapped: false });
  const RISE = MIN_CLEAR + 4.5;
  const SEG = 16;
  const U = 1.18;                 // knapp ausserhalb der Bandkante

  const arc = [];
  for (let i = 0; i <= SEG; i++) {
    const u = i / SEG;
    const lat = -U + 2 * U * u;
    // Parabel wie beim Brueckenbogen: 4u(1-u) ergibt den Stich in der Mitte
    arc.push(crossPoint(p, lat, RISE * 4 * u * (1 - u)));
  }
  for (let i = 0; i < SEG; i++) g.add(strut(THREE, arc[i], arc[i + 1], opts.thick, steel, 8));

  // KEINE Haenger. An der Bruecke tragen sie die Fahrbahn, hier stuenden sie
  // als Reihe von Saeulen mitten im Fahrweg — gemessen sechs Stueck quer ueber
  // das Band. Ein Tor ist eine Durchfahrt, kein Hindernis.
  // Stattdessen zwei kurze Streben an den Kaempfern, die den Bogen anbinden.
  for (const side of [-1, 1]) {
    const foot = crossPoint(p, side * U, 1.6);
    const up = crossPoint(p, side * (U - 0.1), RISE * 4 * 0.12 * (1 - 0.12));
    g.add(strut(THREE, foot, up, opts.thick * 0.5, steel, 6));
  }
  // Auflager beidseits
  for (const side of [-U, U]) {
    g.add(strut(THREE, crossPoint(p, side, -1.4), crossPoint(p, side, 1.6), opts.thick * 1.5, steel, 8));
  }
  // Leuchtband auf der Innenseite des Bogens — der Taktschlag beim Durchfahren
  const inner = [];
  for (let i = 0; i <= SEG; i++) {
    const u = i / SEG;
    inner.push(crossPoint(p, -U * 0.94 + 2 * U * 0.94 * u, RISE * 4 * u * (1 - u) - 0.75));
  }
  for (let i = 0; i < SEG; i++) g.add(strut(THREE, inner[i], inner[i + 1], opts.thick * 0.26, light, 6));
  return g;
}

// ------------------------------------------------- nahtloses Schachbrett
// Eine Textur, kein Objektstapel. 2 x 2 Zellen im Bild, per RepeatWrapping
// beliebig oft gekachelt — dadurch ist der Uebergang immer nahtlos.
function checkerTexture(THREE, px) {
  const n = px || 128;
  const cv = document.createElement('canvas');
  cv.width = cv.height = n;
  const g = cv.getContext('2d');
  g.fillStyle = '#f2ece1'; g.fillRect(0, 0, n, n);
  g.fillStyle = '#14100e';
  g.fillRect(0, 0, n / 2, n / 2);
  g.fillRect(n / 2, n / 2, n / 2, n / 2);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Das Zielmuster liegt AUF dem Band: ein Streifen, der Breite und Ueberhoehung
// folgt, mit UV-Koordinaten fuer die Kachelung. Keine schwebenden Plaettchen.
function finishStripe(THREE, route, s0, lengthM, tilesAcross) {
  const steps = 14;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= steps; i++) {
    const p = route.sampleAt(s0 + (lengthM * i) / steps);
    const l = crossPoint(p, -1, 0.07), r = crossPoint(p, 1, 0.07);
    pos.push(l.x, l.y, l.z, r.x, r.y, r.z);
    const v = (i / steps) * (lengthM / (p.w / tilesAcross));
    uv.push(0, v, tilesAcross, v);
  }
  for (let i = 0; i < steps; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, c, b, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const tex = checkerTexture(THREE, 128);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.7, metalness: 0,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
  }));
  m.name = 'finish-stripe';
  m.receiveShadow = true;
  return { mesh: m, tex };
}

// ------------------------------------------------------------------ Aufbau
export function buildGates(THREE, route, opts = {}) {
  const spacing = opts.spacingM || 240;
  const group = new THREE.Group();
  group.name = 'kfb-gates';
  const gates = [];

  // Tortoene aus der gemessenen Palette, damit die Tore zur Strecke gehoeren
  const KINDS = [
    { body: C.structure, trim: C.bedLight, thick: 0.85 },
    { body: C.shoulderLo, trim: C.lineYellow, thick: 0.8 },
    { body: C.shoulder, trim: C.lineGold, thick: 0.85 }
  ];

  // Start und Ziel: Muster auf dem Band plus derselbe Bogen in Zielfarben
  {
    const p = route.sampleAt(0);
    const stripe = finishStripe(THREE, route, -3, 6, 10);
    group.add(stripe.mesh);
    const gate = archGate(THREE, p, { body: 0xe7e0d2, trim: 0x14100e, thick: 0.95 });
    gate.name = 'gate-start-finish';
    group.add(gate);
    gates.push({
      index: 0, role: 'start-finish', shape: 'arch',
      routeS: 0, spanM: +p.w.toFixed(1), clearanceM: MIN_CLEAR,
      x: p.x, z: p.z, armed: true
    });
  }

  const count = Math.max(1, Math.round(route.length / spacing));
  const step = route.length / count;
  for (let i = 1; i < count; i++) {
    const s = i * step;
    const p = route.sampleAt(s);
    if (p.kind === 'TUNNEL') continue;
    const k = KINDS[(i - 1) % KINDS.length];
    const gate = archGate(THREE, p, k);
    gate.name = 'gate-' + i;
    group.add(gate);
    gates.push({
      index: i, role: 'checkpoint', shape: 'arch',
      routeS: +s.toFixed(1), spanM: +p.w.toFixed(1), clearanceM: MIN_CLEAR,
      x: p.x, z: p.z, armed: true
    });
  }

  return {
    group, gates, placed: gates.length, spacingM: +step.toFixed(1),
    clearanceM: MIN_CLEAR,
    build: 'Bruecken-Bogenkonstruktion aus cologne-landmarks#hohenzollern, auf Bandbreite gespannt und umgefaerbt; Ziellinie als nahtlose Kacheltextur AUF dem Band',
    check(d, onPass) {
      for (const g of gates) {
        const dist = Math.hypot(d.x - g.x, d.z - g.z);
        if (g.armed && dist < 13) { g.armed = false; onPass && onPass(g, Math.abs(d.speed)); }
        else if (!g.armed && dist > 32) g.armed = true;
      }
    }
  };
}

// --------------------------------------------------------------- Jingles
export const JINGLE_PIN = '7eebc7cad1488f2c2bf37328e86cd088834f9fa9';
const JDIR = 'media/3D_Assets/Audio/kenney_music-jingles/Audio/';
export const JINGLE_FAMILIES = [
  { dir: '8-Bit jingles', tag: 'RETRO' },
  { dir: 'Hit jingles', tag: 'HIT' },
  { dir: 'Pizzicato jingles', tag: 'PIZZI' },
  { dir: 'Sax jingles', tag: 'SAX' },
  { dir: 'Steel jingles', tag: 'STEEL' }
];

const jrawUrl = (dir, file) =>
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + JINGLE_PIN + '/' +
  (JDIR + dir + '/' + file).split('/').map(encodeURIComponent).join('/');

export function createJingles(opts = {}) {
  const pool = [];
  for (const f of JINGLE_FAMILIES) {
    for (let i = 0; i < 17; i++) {
      pool.push({ family: f.tag, dir: f.dir, file: 'jingles_' + f.tag + String(i).padStart(2, '0') + '.ogg' });
    }
  }
  const reward = { family: 'STEEL', dir: 'Steel jingles', file: 'jingles_STEEL00.ogg' };
  const cache = new Map();
  let level = opts.level ?? 0.55;
  const played = [];

  const play = (pick) => {
    try {
      const url = jrawUrl(pick.dir, pick.file);
      let a = cache.get(url);
      if (!a) { a = new Audio(url); a.crossOrigin = 'anonymous'; a.preload = 'auto'; cache.set(url, a); }
      a.volume = level;
      a.currentTime = 0;
      a.play().catch(() => {});
      played.push(pick.family + '/' + pick.file);
      if (played.length > 12) played.shift();
    } catch (e) { /* Klang ist Beiwerk */ }
  };

  return {
    pin: JINGLE_PIN, poolSize: pool.length, families: JINGLE_FAMILIES.map(f => f.tag),
    setLevel(v) { level = Math.max(0, Math.min(1, v)); },
    checkpoint() { play(pool[Math.floor(Math.random() * pool.length)]); },
    finish() { play(reward); },
    recent() { return played.slice(-6); }
  };
}
