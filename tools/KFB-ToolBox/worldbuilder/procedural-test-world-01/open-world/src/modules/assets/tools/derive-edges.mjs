// Derives road / river / water / sand edge masks of KayKit hex tiles from geometry + atlas colours.
// Usage: node src/modules/assets/tools/derive-edges.mjs [--dump]
// For every tile: for each edge d (OUR order: d·60° from +X toward −Z), sample points near the edge midpoint,
// find the top-most triangle above each point (XZ projection), interpolate UV, read the atlas colour and classify it.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const { PNG } = require(path.join(ROOT, 'node_modules/pngjs'));
const TILES = path.join(ROOT, 'public/assets/hex/tiles');
const DUMP = process.argv.includes('--dump');

const atlasCache = new Map();
function atlas(file) {
  if (!atlasCache.has(file)) atlasCache.set(file, PNG.sync.read(fs.readFileSync(file)));
  return atlasCache.get(file);
}
function readAccessor(g, bin, i) {
  const a = g.accessors[i];
  const bv = g.bufferViews[a.bufferView];
  const n = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type];
  const T = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array, 5121: Uint8Array }[a.componentType];
  const off = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const stride = bv.byteStride || n * T.BYTES_PER_ELEMENT;
  const out = new Array(a.count);
  for (let k = 0; k < a.count; k++) {
    const v = [];
    for (let c = 0; c < n; c++) {
      const o = off + k * stride + c * T.BYTES_PER_ELEMENT;
      v.push(T === Float32Array ? bin.readFloatLE(o) : T === Uint16Array ? bin.readUInt16LE(o) : T === Uint32Array ? bin.readUInt32LE(o) : bin.readUInt8(o));
    }
    out[k] = n === 1 ? v[0] : v;
  }
  return out;
}
function loadTile(file) {
  const g = JSON.parse(fs.readFileSync(file, 'utf8'));
  const bin = fs.readFileSync(path.join(path.dirname(file), decodeURI(g.buffers[0].uri)));
  const img = atlas(path.join(path.dirname(file), decodeURI(g.images[0].uri)));
  const tris = [];
  for (const node of g.nodes) {
    if (node.mesh == null) continue;
    if (node.translation || node.rotation || node.scale || node.matrix) throw new Error('node transform in ' + file);
    for (const p of g.meshes[node.mesh].primitives) {
      const P = readAccessor(g, bin, p.attributes.POSITION);
      const UV = readAccessor(g, bin, p.attributes.TEXCOORD_0);
      const I = readAccessor(g, bin, p.indices);
      for (let t = 0; t < I.length; t += 3) tris.push([I[t], I[t + 1], I[t + 2]].map((k) => ({ p: P[k], uv: UV[k] })));
    }
  }
  return { tris, img };
}
// top-most surface hit at (x, z)
function probe(tile, x, z) {
  let best = null;
  for (const [A, B, C] of tile.tris) {
    const [ax, , az] = A.p, [bx, , bz] = B.p, [cx, , cz] = C.p;
    const det = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
    if (Math.abs(det) < 1e-9) continue;
    const l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / det;
    const l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / det;
    const l3 = 1 - l1 - l2;
    if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue;
    const y = l1 * A.p[1] + l2 * B.p[1] + l3 * C.p[1];
    if (best && y <= best.y) continue;
    const u = l1 * A.uv[0] + l2 * B.uv[0] + l3 * C.uv[0];
    const v = l1 * A.uv[1] + l2 * B.uv[1] + l3 * C.uv[1];
    best = { y, u, v };
  }
  if (!best) return null;
  const { img } = tile;
  const px = Math.min(img.width - 1, Math.max(0, Math.floor(best.u * img.width)));
  const py = Math.min(img.height - 1, Math.max(0, Math.floor(best.v * img.height)));
  const o = (py * img.width + px) * 4;
  best.rgb = [img.data[o], img.data[o + 1], img.data[o + 2]];
  return best;
}
// colour → class. Calibrated against hex_grass (grass), hex_water (water), hex_road_M centre (road), coast sand.
// Atlas facts (measured): grass 192,197,55 (hue ~62), water 37,131,193, road/sand 223,183,135 (same texel family:
// on road tiles it is the road, on coast tiles the beach). Hole (no surface) = waterless variant's water area.
function classify(rgb) {
  const [r, g, b] = rgb;
  const h = hue(r, g, b);
  if (b > r && b > 120) return 'water';
  if (h >= 45 && h < 170 && g >= r - 4 && b < 110) return 'grass';
  if (r > g && g > b && r - b > 50) return 'dirt'; // road on road tiles, sand on coast tiles
  return 'other';
}
function hue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d) return 0;
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

const EDGE_R = 0.93; // sample this far toward the edge midpoint (inradius = 1 asset unit)
const LATERAL = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]; // along the edge (half edge = 0.577)
function edgeInfo(tile) {
  const out = [];
  for (let d = 0; d < 6; d++) {
    const a = (d * Math.PI) / 3;
    const nx = Math.cos(a), nz = -Math.sin(a); // outward normal of edge d
    const tx = -nz, tz = nx; // along the edge
    const raw = LATERAL.map((l) => probe(tile, nx * EDGE_R + tx * l, nz * EDGE_R + tz * l));
    const classes = raw.map((s) => (s ? classify(s.rgb) : 'hole'));
    const samples = raw.filter(Boolean);
    const y = samples.reduce((s, x) => s + x.y, 0) / Math.max(1, samples.length);
    out.push({ d, classes, y: +y.toFixed(3), rgb: samples.map((s) => s.rgb.join(',')) });
  }
  const c = probe(tile, 0, 0);
  return { edges: out, centre: c ? { y: +c.y.toFixed(3), cls: classify(c.rgb), rgb: c.rgb.join(',') } : null };
}

const files = [];
for (const dir of ['base', 'roads', 'rivers', 'rivers/waterless', 'coast', 'coast/waterless']) {
  const full = path.join(TILES, dir);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full)) if (f.endsWith('.gltf')) files.push(path.join(dir, f));
}
const result = {};
for (const f of files) {
  const tile = loadTile(path.join(TILES, f));
  const info = edgeInfo(tile);
  const id = 'hex/tiles/' + f.replace(/\.gltf$/, '');
  // an edge "carries" a class when the middle 3 samples (|lateral| <= 0.1) all show it
  const mask = (...cls) => info.edges.reduce((m, e) => (e.classes.slice(2, 5).every((c) => cls.includes(c)) ? m | (1 << e.d) : m), 0);
  const any = (...cls) => info.edges.reduce((m, e) => (e.classes.some((c) => cls.includes(c)) ? m | (1 << e.d) : m), 0);
  result[id] = { dirt: mask('dirt'), water: mask('water', 'hole'), dirtAny: any('dirt'), waterAny: any('water', 'hole'), edgeY: info.edges.map((e) => e.y), classes: info.edges.map((e) => e.classes.map((c) => c[0]).join('')), centre: info.centre };
  if (DUMP) console.log(id.padEnd(50), info.edges.map((e) => `${e.d}:${e.classes.map((c) => c[0]).join('')}@${e.y}`).join(' '), 'c=', JSON.stringify(info.centre), DUMP ? info.edges.map((e) => e.rgb[1]).join(' | ') : '');
}
const bits = (m) => [0, 1, 2, 3, 4, 5].filter((d) => m & (1 << d)).join('') || '-';
if (!DUMP) for (const [id, r] of Object.entries(result)) console.log(id.replace('hex/tiles/','').padEnd(44), 'dirt', bits(r.dirt).padEnd(7), 'water', bits(r.water).padEnd(7), 'dirtAny', bits(r.dirtAny).padEnd(7), 'waterAny', bits(r.waterAny).padEnd(7), r.classes.join(' '), 'Y', r.edgeY.join(','));
fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'edges.derived.json'), JSON.stringify(result, null, 1));
