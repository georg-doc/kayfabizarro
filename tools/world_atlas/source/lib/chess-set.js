/* Chess set · low-poly primitives in KayKit's chunky-rounded language (cylinders, spheres, cones —
   no ornate lathe profiles). Not a pack asset: the free BoardGameBits tier has no chess pieces or
   board (its chess set ships only in the paid "EXTRA" tier — probed against the raw asset paths,
   see docs/PACK_GAPS.md). So this module BUILDS a set instead of loading one, sized to sit on a
   1×1 square exactly like a pack part would: base on y=0, footprint inside a 0.62 circle so two
   adjacent pieces on neighbouring squares never touch. */
import * as THREE from 'three';

const SEG = 20;
function group(parts) { const g = new THREE.Group(); for (const p of parts) g.add(p); return g; }
function mesh(geo, mat) { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; return m; }
function mat(color, rough = 0.55) { return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 }); }

/* every builder returns { node, height } so the caller can measure instead of guessing */
function base(m, r = 0.3, h = 0.09) {
  const g = mesh(new THREE.CylinderGeometry(r, r * 1.14, h, SEG), m);
  g.position.y = h / 2;
  return { node: g, top: h };
}
function collar(m, y, r, h = 0.05) {
  const g = mesh(new THREE.CylinderGeometry(r, r, h, SEG), m);
  g.position.y = y + h / 2;
  return { node: g, top: y + h };
}

function pawn(m) {
  const parts = [];
  const b = base(m, 0.24, 0.08); parts.push(b.node);
  const body = mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.22, SEG), m);
  body.position.y = b.top + 0.11; parts.push(body);
  const c = collar(m, b.top + 0.22, 0.13, 0.04); parts.push(c.node);
  const head = mesh(new THREE.SphereGeometry(0.12, SEG, 14), m);
  head.position.y = c.top + 0.1; parts.push(head);
  return { node: group(parts), height: c.top + 0.22 };
}

function rook(m) {
  const parts = [];
  const b = base(m, 0.28, 0.09); parts.push(b.node);
  const body = mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.34, SEG), m);
  body.position.y = b.top + 0.17; parts.push(body);
  const rimY = b.top + 0.34;
  const rim = mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.07, SEG), m);
  rim.position.y = rimY + 0.035; parts.push(rim);
  const crenY = rimY + 0.07;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const t = mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), m);
    t.position.set(Math.cos(a) * 0.15, crenY + 0.045, Math.sin(a) * 0.15);
    parts.push(t);
  }
  return { node: group(parts), height: crenY + 0.09 };
}

function bishop(m) {
  const parts = [];
  const b = base(m, 0.25, 0.08); parts.push(b.node);
  const body = mesh(new THREE.ConeGeometry(0.17, 0.42, SEG), m);
  body.position.y = b.top + 0.21; parts.push(body);
  const notchY = b.top + 0.4;
  const notch = mesh(new THREE.BoxGeometry(0.16, 0.025, 0.05), m);
  notch.position.y = notchY; notch.rotation.z = 0.5; parts.push(notch);
  const tip = mesh(new THREE.SphereGeometry(0.055, 14, 10), m);
  tip.position.y = notchY + 0.09; parts.push(tip);
  return { node: group(parts), height: notchY + 0.12 };
}

/* stylised abstract horse-head — two angled blocks + an ear wedge, not an anatomical horse:
   KayKit's own meeples read as silhouettes at this scale, this follows the same logic */
function knight(m) {
  const parts = [];
  const b = base(m, 0.26, 0.09); parts.push(b.node);
  const neck = mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.18, SEG), m);
  neck.position.y = b.top + 0.09; parts.push(neck);
  const head = mesh(new THREE.BoxGeometry(0.15, 0.22, 0.28), m);
  head.position.set(0, b.top + 0.28, 0.03); head.rotation.x = -0.32; parts.push(head);
  const muzzle = mesh(new THREE.BoxGeometry(0.1, 0.11, 0.16), m);
  muzzle.position.set(0, b.top + 0.2, 0.19); muzzle.rotation.x = -0.32; parts.push(muzzle);
  const ear = mesh(new THREE.ConeGeometry(0.045, 0.12, 8), m);
  ear.position.set(0, b.top + 0.44, -0.03); ear.rotation.x = 0.25; parts.push(ear);
  return { node: group(parts), height: b.top + 0.5 };
}

function queen(m) {
  const parts = [];
  const b = base(m, 0.27, 0.09); parts.push(b.node);
  const body = mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.44, SEG), m);
  body.position.y = b.top + 0.22; parts.push(body);
  const collarY = b.top + 0.44;
  const c = mesh(new THREE.TorusGeometry(0.15, 0.028, 10, SEG), m);
  c.position.y = collarY; c.rotation.x = Math.PI / 2; parts.push(c);
  const spikes = 6;
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * Math.PI * 2;
    const s = mesh(new THREE.ConeGeometry(0.035, 0.12, 8), m);
    s.position.set(Math.cos(a) * 0.13, collarY + 0.06, Math.sin(a) * 0.13);
    parts.push(s);
  }
  const orb = mesh(new THREE.SphereGeometry(0.06, 14, 10), m);
  orb.position.y = collarY + 0.16; parts.push(orb);
  return { node: group(parts), height: collarY + 0.22 };
}

function king(m) {
  const parts = [];
  const b = base(m, 0.27, 0.09); parts.push(b.node);
  const body = mesh(new THREE.CylinderGeometry(0.1, 0.21, 0.5, SEG), m);
  body.position.y = b.top + 0.25; parts.push(body);
  const collarY = b.top + 0.5;
  const c = mesh(new THREE.TorusGeometry(0.15, 0.03, 10, SEG), m);
  c.position.y = collarY; c.rotation.x = Math.PI / 2; parts.push(c);
  const capY = collarY + 0.08;
  const cap = mesh(new THREE.SphereGeometry(0.1, 16, 12), m);
  cap.position.y = capY; parts.push(cap);
  const crossY = capY + 0.11;
  const v = mesh(new THREE.BoxGeometry(0.04, 0.14, 0.04), m); v.position.y = crossY + 0.07; parts.push(v);
  const h = mesh(new THREE.BoxGeometry(0.12, 0.04, 0.04), m); h.position.y = crossY + 0.09; parts.push(h);
  return { node: group(parts), height: crossY + 0.14 };
}

const BUILDERS = { p: pawn, r: rook, b: bishop, n: knight, q: queen, k: king };

export const SQUARE = 1;
export function squareToWorld(file, rank) { return { x: (file - 3.5) * SQUARE, z: (3.5 - rank) * SQUARE }; }

/* checkerboard — no pack board exists in the free tier, so this is built and measured like any
   other stage plate in the lab: square tiles top at y=0, a wood-tone rim sized from the grid. */
export function buildBoard(colors) {
  const g = new THREE.Group();
  const light = mat(colors.squareLight, 0.6), dark = mat(colors.squareDark, 0.6);
  const h = 0.05;
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const { x, z } = squareToWorld(f, r);
    const t = mesh(new THREE.BoxGeometry(SQUARE * 0.985, h, SQUARE * 0.985), (f + r) % 2 === 0 ? dark : light);
    t.position.set(x, -h / 2, z);
    g.add(t);
  }
  const rim = mesh(new THREE.BoxGeometry(8.6, 0.1, 8.6), mat(colors.rim ?? colors.squareDark, 0.65));
  rim.position.y = -h - 0.05;
  g.add(rim);
  g.userData.bounds = { size: 8, square: SQUARE, top: 0 };
  return g;
}

/* colorSet: { light, dark } — FEN case decides which, not board square parity */
export function buildPiece(letter, colorSet) {
  const isWhite = letter === letter.toUpperCase();
  const fn = BUILDERS[letter.toLowerCase()];
  const m = mat(isWhite ? colorSet.light : colorSet.dark, isWhite ? 0.5 : 0.6);
  const { node, height } = fn(m);
  node.userData.piece = { type: letter.toLowerCase(), white: isWhite, height: +height.toFixed(3) };
  return node;
}

/* parse a FEN board field into {file(0-7 a..h), rank(0-7, 0=rank1), letter} */
export function parseFEN(field) {
  const rows = field.split('/');
  const out = [];
  rows.forEach((row, ri) => {
    let file = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { file += Number(ch); continue; }
      out.push({ file, rank: 7 - ri, letter: ch });
      file++;
    }
  });
  return out;
}
