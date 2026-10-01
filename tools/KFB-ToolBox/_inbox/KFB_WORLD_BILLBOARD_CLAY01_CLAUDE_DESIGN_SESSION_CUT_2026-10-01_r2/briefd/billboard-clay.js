// KFB Billboard Clay v1 · CD-ISLAND-BILLBOARD-CLAY-01
// Ein Billboard = ein verschmolzener Knet-Körper (Rahmen, Pfosten, Rückseite, Leuchten, Sockel) + eine ungelit-scharfe 2:1-Bildfläche.
// Geometrie und Material werden von allen Instanzen geteilt (Palette steckt in Vertexfarben). Kein eigener Takt:
// BillboardScheduler.tick() wird vom bestehenden Frame-Owner der Szene aufgerufen.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const SOURCE_COMMIT = '6df3410473ae32b8f75d992e0d534e49a9dc3ca0';
export const CONTENT_PIN = 'f3acaaeb98530dd9ffb7d200d61956891e738336';
export const rng = seed => { seed = String(seed); let h = 1779033703 ^ seed.length; for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; };
export const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// ── K2-artiges Knet-Relief (wortgleich zum Prüfstand briefd/bench.js), Fenster und Stärke pro Familie ──
const GLSL_NOISE = `varying vec3 vClayW; varying vec3 vClayL; varying mat3 vClayR; uniform float uClayNear,uClayFar,uClayScale,uClayAmt;
float kh(vec3 p){p=fract(p*0.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float kn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.0-2.0*f);return mix(mix(mix(kh(i),kh(i+vec3(1,0,0)),f.x),mix(kh(i+vec3(0,1,0)),kh(i+vec3(1,1,0)),f.x),f.y),mix(mix(kh(i+vec3(0,0,1)),kh(i+vec3(1,0,1)),f.x),mix(kh(i+vec3(0,1,1)),kh(i+vec3(1,1,1)),f.x),f.y),f.z);}
float kf(vec3 p){float a=.5,s=0.;for(int i=0;i<CLAY_OCT;i++){s+=a*kn(p);p*=2.07;a*=.5;}return s;}`;
export function makeClayFamily(tag, U, cfg = { oct: 2, near: true, stick: true }) {
  const mats = new Set();
  const patch = m => {
    m.userData.clay = true; mats.add(m);
    m.defines = { ...(m.defines || {}), CLAY_OCT: cfg.oct }; if (cfg.near) m.defines.CLAY_NEAR = 1; if (cfg.stick) m.defines.CLAY_STICK = 1;
    m.customProgramCacheKey = () => 'clay' + tag + cfg.oct + (cfg.near ? 'n' : 'f') + (cfg.stick ? 's' : 'w');
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = 'varying vec3 vClayW; varying vec3 vClayL; varying mat3 vClayR;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
vec4 kcw=vec4(transformed,1.0);
mat4 kM=modelMatrix;
#ifdef USE_INSTANCING
kM=modelMatrix*instanceMatrix;
#endif
vClayW=(kM*kcw).xyz;
vClayL=transformed*length(kM[0].xyz);
#ifdef CLAY_STICK
vClayR=mat3(viewMatrix)*mat3(kM)/length(kM[0].xyz);
#else
vClayR=mat3(viewMatrix);
#endif`);
      sh.fragmentShader = GLSL_NOISE + '\n' + sh.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
float kcf=1.0;
#ifdef CLAY_NEAR
kcf=1.0-smoothstep(uClayNear,uClayFar,length(vClayW-cameraPosition));
#endif
#ifdef CLAY_STICK
vec3 kpos=vClayL;
#else
vec3 kpos=vClayW;
#endif
if(kcf>0.01){
vec3 kq=kpos*uClayScale;float ke=0.03;float kb=kf(kq);
vec3 kg=vec3(kf(kq+vec3(ke,0,0))-kb,kf(kq+vec3(0,ke,0))-kb,kf(kq+vec3(0,0,ke))-kb)/ke;
vec3 kv=vClayR*kg;
normal=normalize(normal-uClayAmt*kcf*(kv-dot(kv,normal)*normal));
}`);
    };
    return m;
  };
  return { mats, U, cfg, patch, std: (color, rough = 0.86, extra = {}) => patch(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, ...extra })) };
}

// ── Palette: aus dem Insel-Biom oder fest; Teile tragen sie als Vertexfarbe ───────────────────────
const mixHex = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();
export function buildPalette(spec, island) {
  const bp = spec.biomePalette || { mode: 'island-biome' }, bi = island && island.biome;
  let c;
  if (bp.mode === 'fixed' || !bi) c = { ...(bp.colors || {}) };
  else c = { frame: bi.accent, trim: bi.paper, post: bi.rock, ground: bi.top };
  c = { frame: '#c2412c', trim: '#f3ead3', post: '#a8643a', ground: '#9aab62', ...c, ...(bp.override || {}) };
  return { name: bp.mode === 'fixed' ? (bp.name || 'fixed') : (bi ? bi.name : 'fixed'), frame: c.frame, trim: c.trim, post: c.post, ground: c.ground,
    braces: c.braces || mixHex(c.post, '#1f1a14', 0.3), back: c.back || mixHex(c.post, c.trim, 0.22), wood: c.wood || '#b88a5a', lamp: c.lamp || '#e9c14a', ink: c.ink || '#3a342a', paper: c.trim };
}
const palKey = p => [p.frame, p.trim, p.post, p.ground, p.braces, p.back, p.wood, p.lamp, p.ink].join('');

// ── Geometrie: 50er/60er-Highway-Tafel in Spielzeugknete ─────────────────────────────────────────
// Lokal: Ursprung = Bodenmittel zwischen den Pfosten, +Z = Vorderseite (Bildfläche), −Z = Rückseite, 1 Einheit = 1 m (bei scale 1).
// Körperstile: highway = Design-Donor (DESIGN_DONOR_APPROVED_TUNE), plain = flache Tafel auf zwei Pfosten, tv = flacher Cartoon-Fernseher auf zwei Säulen.
// Alle Stile: Bildfläche 12 × 6 m (2:1), ungelit, Vorderseite +Z. faceCornerM = Innenradius der Bildöffnung (0 = eckig).
export const STYLES = {
  highway: { gb: 3.6, pz: -0.78, legRun: 3.6, sink: 2.4, px: 0.27, postR: 0.58, corner: 0.6, label: 'Highway 50er' },
  plain: { gb: 3.0, pz: -0.58, legRun: 0, sink: 1.2, px: 0.3, postR: 0.4, corner: 0.45, label: 'Plain' },
  tv: { gb: 4.4, pz: -0.22, legRun: 0, sink: 1.4, px: 0.25, postR: 0.52, corner: 1.1, label: 'Cartoon-TV' }
};
export const LAYOUT = STYLES.highway;
export const styleOf = spec => STYLES[spec && spec.bodyStyle] ? spec.bodyStyle : 'highway';
export const layoutFor = spec => STYLES[styleOf(spec)];
const cornerOf = (spec, W, H) => Math.max(0, Math.min(+(spec && spec.faceCornerM) || 0, Math.min(W, H) * 0.3));
const Y = new THREE.Vector3(0, 1, 0), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
function part(geo, hex, pos = [0, 0, 0], rot = [0, 0, 0], scl = [1, 1, 1]) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  _m.compose(_v.set(pos[0], pos[1], pos[2]), rot.isQuaternion ? rot : _q.setFromEuler(_e.set(rot[0], rot[1], rot[2])), _s.set(scl[0], scl[1], scl[2])); g.applyMatrix4(_m);
  const n = g.attributes.position.count, c = new THREE.Color(hex), a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(k)) g.deleteAttribute(k);
  return g;
}
const beam = (A, B, r, hex, r1 = r, seg = 8) => {
  const a = new THREE.Vector3(...A), b = new THREE.Vector3(...B), d = b.clone().sub(a), L = d.length(), q = new THREE.Quaternion().setFromUnitVectors(Y, d.normalize());
  return part(new THREE.CylinderGeometry(r1, r, L, seg, 1), hex, a.add(b).multiplyScalar(0.5).toArray(), q);
};
const rbox = (w, h, d, r = 0.12, seg = 2) => new RoundedBoxGeometry(w, h, d, seg, r);
function rr(p, x, y, w, h, r) { p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r); p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h); p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r); p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y); }

// Rahmen mit Öffnung W × H (Innenradius r), Fase bs. Öffnung nach Fase exakt W × H.
function frameGeo(W, H, pad, outerR, r, bs, bt, dp, hy = 0, padB = pad, padT = pad) {
  const ow = W + 2 * pad, oh = H + padB + padT, sh = new THREE.Shape(); rr(sh, -ow / 2, -oh / 2, ow, oh, outerR);
  const hole = new THREE.Path(), hw = W / 2 + bs, hh = H / 2 + bs, cy = hy;
  if (r > 0) rr(hole, -hw, cy - hh, 2 * hw, 2 * hh, r + bs); else { hole.moveTo(-hw, cy - hh); hole.lineTo(hw, cy - hh); hole.lineTo(hw, cy + hh); hole.lineTo(-hw, cy + hh); hole.closePath(); }
  sh.holes.push(hole);
  return new THREE.ExtrudeGeometry(sh, { depth: dp, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: 0, bevelSegments: 3, curveSegments: 8 });
}
const finish = L => { const g = mergeGeometries(L, false); L.forEach(x => x.dispose()); g.computeBoundingSphere(); g.computeBoundingBox(); g.userData.shared = true; return g; };
const RX = [Math.PI / 2, 0, 0];

// Plain: flache Tafel, zwei Kantpfosten, flacher Fußkragen statt Knethügel (Tune 1). Keine Leuchten, kein Laufsteg.
function buildPlain(W, H, P, r) {
  const { gb, pz, sink, px: pxf } = STYLES.plain, yc = gb + H / 2, px = W * pxf, L = [];
  L.push(part(frameGeo(W, H, 0.45, 0.32, r, 0.07, 0.08, 0.2), P.frame, [0, yc, 0.08]));
  L.push(part(rbox(W + 0.8, H + 0.8, 0.3, 0.12, 2), P.back, [0, yc, -0.15]));
  const pTop = yc + H * 0.3, len = pTop + sink;
  for (const sx of [-1, 1]) {
    const x = sx * px;
    L.push(part(rbox(0.55, len, 0.55, 0.1, 2), P.post, [x, -sink + len / 2, pz]));
    L.push(part(rbox(0.95, 0.24, 0.95, 0.08, 2), P.braces, [x, 0.04, pz]));
  }
  L.push(part(rbox(2 * px + 0.55, 0.3, 0.3, 0.1, 2), P.post, [0, yc - H * 0.28, pz - 0.05]));
  return finish(L);
}

// Cartoon-TV, flach: gerundetes Gehäuse, Bildröhren-Lünette, Knopfleiste, Hasenohr-Antenne, zwei Standsäulen.
function buildTV(W, H, P, r) {
  const { gb, pz, sink, px: pxf } = STYLES.tv, yc = gb + H / 2, px = W * pxf, L = [];
  const padS = 1.1, padT = 1.0, padB = 1.8, oh = H + padT + padB, cy = yc + (padT - padB) / 2;
  const bs = 0.18, bt = 0.22, dp = 0.8, zf = 0.4, z0 = zf - dp - bt, zb = z0 - bt;
  L.push(part(frameGeo(W, H, padS, 1.6, r, bs, bt, dp, yc - cy, padB, padT), P.frame, [0, cy, z0]));
  L.push(part(frameGeo(W, H, 0.35, r + 0.35, r, 0.05, 0.05, 0.08), P.trim, [0, yc, zf - 0.04]));
  L.push(part(rbox(W + 0.6, H + 0.6, 0.3, 0.12, 2), P.ink, [0, yc, -0.15]));
  L.push(part(rbox(W + 2 * padS - 0.6, oh - 0.6, 0.3, 0.14, 2), P.back, [0, cy, zb - 0.1]));
  const ky = yc - H / 2 - padB / 2;
  for (const x of [W / 2 - 0.7, W / 2 - 2.0]) { L.push(part(new THREE.CylinderGeometry(0.42, 0.46, 0.28, 16, 1), P.lamp, [x, ky, zf + 0.14], RX)); L.push(part(rbox(0.1, 0.4, 0.08, 0.03, 1), P.ink, [x, ky + 0.1, zf + 0.3])); }
  for (const dy of [-0.32, 0, 0.32]) L.push(part(rbox(3.0, 0.13, 0.08, 0.03, 1), P.ink, [-W / 2 + 1.9, ky + dy, zf + 0.02]));
  const top = cy + oh / 2, zm = (zf + zb) / 2;
  L.push(part(new THREE.SphereGeometry(0.6, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), P.ink, [0, top - 0.08, zm]));
  for (const sx of [-1, 1]) { const a = sx * 0.45, B = [0, top + 0.3, zm], T = [Math.sin(a) * 3.2, top + 0.3 + Math.cos(a) * 3.2, zm]; L.push(beam(B, T, 0.07, P.ink, 0.05), part(new THREE.SphereGeometry(0.2, 10, 8), P.lamp, T)); }
  const bot = cy - oh / 2;
  for (const sx of [-1, 1]) {
    const x = sx * px, len = bot + 0.4 + sink;
    L.push(part(new THREE.CylinderGeometry(0.42, 0.52, len, 16, 1), P.post, [x, -sink + len / 2, pz]));
    L.push(part(new THREE.CylinderGeometry(0.78, 0.46, 0.36, 16, 1), P.trim, [x, bot - 0.18, pz]));
    L.push(part(new THREE.CylinderGeometry(0.62, 0.72, 0.28, 16, 1), P.braces, [x, 0.06, pz]));
  }
  return finish(L);
}

export function buildBodyGeometry(W, H, P, style = 'highway', r = 0) {
  if (style === 'plain') return buildPlain(W, H, P, r);
  if (style === 'tv') return buildTV(W, H, P, r);
  const { gb, pz, legRun, sink } = LAYOUT, yc = gb + H / 2, top = yc + H / 2, px = W * 0.27, L = [];
  // Rahmen: Extrusion mit Fase. Öffnung in der Mitte exakt W × H, Bildfläche sitzt 3,5 cm vor der Rückplatte
  const bs = 0.09, bt = 0.12, dp = 0.25, sh = new THREE.Shape(); rr(sh, -(W + 1.1) / 2, -(H + 1.1) / 2, W + 1.1, H + 1.1, 0.75);
  const hole = new THREE.Path(), hw = W / 2 + bs, hh = H / 2 + bs; if (r > 0) rr(hole, -hw, -hh, 2 * hw, 2 * hh, r + bs); else { hole.moveTo(-hw, -hh); hole.lineTo(hw, -hh); hole.lineTo(hw, hh); hole.lineTo(-hw, hh); hole.closePath(); } sh.holes.push(hole);
  L.push(part(new THREE.ExtrudeGeometry(sh, { depth: dp, bevelEnabled: true, bevelThickness: bt, bevelSize: bs, bevelOffset: 0, bevelSegments: 3, curveSegments: 6 }), P.frame, [0, yc, bt]));
  L.push(part(rbox(W + 1.0, H + 1.0, 0.44, 0.14, 3), P.back, [0, yc, -0.22]));                  // Rückplatte
  L.push(part(rbox(2.6, 1.3, 0.14, 0.05), P.lamp, [0, yc, -0.5]));                                 // Schild auf der Rückseite
  L.push(part(rbox(1.7, 0.18, 0.12, 0.04), P.ink, [0, yc - 0.3, -0.58]), part(rbox(1.2, 0.18, 0.12, 0.04), P.ink, [0, yc + 0.1, -0.58]));
  // Gesims, Krone, Knöpfe
  const ct = top + 0.89 + 0.3;
  L.push(part(rbox(W + 2.0, 0.6, 1.15, 0.2, 3), P.trim, [0, top + 0.89, 0.3]));
  for (const sx of [-1, 1]) L.push(part(new THREE.SphereGeometry(0.38, 12, 8), P.lamp, [sx * (W + 2) / 2, top + 0.89, 0.3]));
  L.push(beam([0, ct - 0.1, 0.1], [0, ct + 0.75, 0.1], 0.09, P.ink), part(new THREE.OctahedronGeometry(0.7, 0), P.lamp, [0, ct + 1.15, 0.1], [0, 0, 0.3], [1, 1, 0.4]));
  // Leuchtenarme (50er-Strahler) über der Bildfläche
  const th = 0.95, dd = new THREE.Vector3(0, Math.cos(th), Math.sin(th)), d2 = new THREE.Vector3(0, -0.78, -0.62).normalize();
  for (const x of [-0.3 * W, 0, 0.3 * W]) {
    const B = new THREE.Vector3(x, ct - 0.05, 0.4), T = B.clone().addScaledVector(dd, 1.9);
    L.push(beam(B.toArray(), T.toArray(), 0.075, P.ink));
    L.push(part(new THREE.CylinderGeometry(0.2, 0.5, 0.85, 12, 1), P.trim, T.clone().addScaledVector(d2, 0.425).toArray(), new THREE.Quaternion().setFromUnitVectors(Y, d2.clone().negate())));
    L.push(part(new THREE.SphereGeometry(0.3, 10, 8), P.lamp, T.clone().addScaledVector(d2, 0.86).toArray()));
  }
  // Laufsteg mit Geländer unter der Bildfläche
  const py = gb - 0.77, cw = W * 0.92;
  L.push(part(rbox(cw, 0.16, 1.5, 0.05), P.wood, [0, py, 0.8]));
  for (let i = 0; i <= 6; i++) L.push(part(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 6, 1), P.trim, [(i / 6 - 0.5) * cw * 0.98, py + 0.38, 1.45]));
  L.push(part(rbox(cw, 0.09, 0.09, 0.03, 1), P.trim, [0, py + 0.68, 1.45]), part(rbox(cw, 0.07, 0.07, 0.03, 1), P.trim, [0, py + 0.36, 1.45]));
  for (const sx of [-0.36, 0, 0.36]) L.push(beam([sx * W, py - 0.06, 1.35], [sx * W, gb - 0.68, 0.12], 0.07, P.braces));
  // Pfosten (konisch), Querbalken, Rück-A-Rahmen, X-Verband
  const pTop = top - 0.25;
  for (const sx of [-1, 1]) {
    const x = sx * px, len = pTop + sink;
    L.push(part(new THREE.CylinderGeometry(0.44, 0.58, len, 14, 1), P.post, [x, -sink + len / 2, pz]));
    L.push(beam([x, pTop - 0.5, pz - 0.3], [x, -0.5, pz - legRun], 0.2, P.braces, 0.2));
    L.push(part(new THREE.SphereGeometry(1, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), P.ground, [x, -0.05, pz], [0, 0, 0], [1.9, 0.95, 1.9]));
    L.push(part(new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), P.ground, [x, -0.05, pz - legRun], [0, 0, 0], [1.1, 0.6, 1.1]));
  }
  for (const y of [gb + 0.7, top - 0.9]) L.push(part(rbox(2 * px + 1.2, 0.34, 0.4, 0.1), P.braces, [0, y, pz - 0.1]));
  L.push(part(rbox(2 * px, 0.22, 0.22, 0.06), P.braces, [0, gb + (H * 0.55) * 0.45, pz - legRun * 0.5]));
  L.push(beam([-px, 0.4, pz - 0.6], [px, gb + 0.4, pz - 0.6], 0.08, P.braces), beam([px, 0.4, pz - 0.6], [-px, gb + 0.4, pz - 0.6], 0.08, P.braces));
  // Leiter zwischen den Pfosten auf der Rückseite + Podest unter der Rückplatte
  const lx = px - 1.1, lz = pz - 1.0, ly = gb - 0.5;
  for (const dx of [-0.3, 0.3]) L.push(beam([lx + dx, 0, lz], [lx + dx, ly, lz], 0.06, P.trim));
  for (let i = 1; i <= 8; i++) L.push(beam([lx - 0.3, ly * i / 9, lz], [lx + 0.3, ly * i / 9, lz], 0.045, P.trim));
  L.push(part(rbox(1.8, 0.12, 0.9, 0.04), P.wood, [lx, ly + 0.02, pz - 0.78]));
  const g = mergeGeometries(L, false); L.forEach(x => x.dispose());
  g.computeBoundingSphere(); g.computeBoundingBox(); g.userData.shared = true;
  return g;
}
const geoCache = new Map(), faceGeoCache = new Map();
export function bodyGeometry(W, H, P, style = 'highway', r = 0) { const k = style + '|' + r + '|' + W + 'x' + H + '|' + palKey(P); if (!geoCache.has(k)) geoCache.set(k, buildBodyGeometry(W, H, P, style, r)); return geoCache.get(k); }
// Bildfläche: Ebene oder Rundrechteck mit Radius r. UV linear über die volle 2:1-Box, Bild wird nicht verzerrt, nur die Ecken fallen weg.
export function faceGeometry(W, H, r = 0) {
  const k = W + 'x' + H + '|' + r;
  if (!faceGeoCache.has(k)) {
    let g;
    if (r > 0) { const s = new THREE.Shape(); rr(s, -W / 2, -H / 2, W, H, r); g = new THREE.ShapeGeometry(s, 10); const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / W + 0.5, p.getY(i) / H + 0.5); uv.needsUpdate = true; }
    else g = new THREE.PlaneGeometry(W, H);
    g.userData.shared = true; faceGeoCache.set(k, g);
  }
  return faceGeoCache.get(k);
}

// ── Inhalte: nur bereits gebackene Bilder aus GitHub (jsDelivr am Pin). Ungeladenes wird ausgelassen. ──────
const imgCache = new Map();
const loadImg = url => new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; const t = setTimeout(() => rej(new Error('Zeitüberschreitung')), 20000); im.onload = () => { clearTimeout(t); res(im); }; im.onerror = () => { clearTimeout(t); rej(new Error('nicht ladbar')); }; im.src = url; });
export const assetUrl = (pin, path) => 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + pin + '/' + path.split('/').map(encodeURIComponent).join('/');
export async function loadContent(contentAsset) {
  const t0 = performance.now(), pin = contentAsset.pin, items = contentAsset.items || [], out = { imgs: [], skipped: [], ms: 0 };
  const rs = await Promise.allSettled(items.map(it => { const u = assetUrl(pin, it.path); if (!imgCache.has(u)) imgCache.set(u, loadImg(u)); return imgCache.get(u); }));
  rs.forEach((r, i) => { const it = items[i]; if (r.status === 'fulfilled' && Math.max(r.value.naturalWidth, r.value.naturalHeight) >= 240) out.imgs.push({ ...it, img: r.value, w: r.value.naturalWidth, h: r.value.naturalHeight }); else out.skipped.push({ path: it.path, why: r.status === 'rejected' ? r.reason.message : 'zu klein' }); });
  out.ms = Math.round(performance.now() - t0); return out;
}
const WORDS = ['SHOW IT', 'SPIN IT', 'SELL IT', 'BLÖDSINN!', 'KayfaBINGO!', 'Stay fluffy!'], CALLS = ['KayfaBIZARRO!', 'Stay fluffy!', 'HUMBUG!', 'What the FLUFF?!'];
function crop(ctx, img, dx, dy, dw, dh, fx, fy, zoom, flip) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, s = Math.max(dw / iw, dh / ih) * zoom, vw = dw / s, vh = dh / s;
  const cx = clamp(fx * iw, vw / 2, iw - vw / 2), cy = clamp(fy * ih, vh / 2, ih - vh / 2);
  ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip();
  if (flip) { ctx.translate(dx + dw, dy); ctx.scale(-1, 1); ctx.drawImage(img, cx - vw / 2, cy - vh / 2, vw, vh, 0, 0, dw, dh); } else ctx.drawImage(img, cx - vw / 2, cy - vh / 2, vw, vh, dx, dy, dw, dh);
  ctx.restore();
}
function newCut(bb, idx, now) {
  const r = rng(bb.seed + '#' + idx), n = bb.pool.imgs.length, mode = bb.spec.contentMode, [a, b] = bb.spec.updatePolicy.cutMs || [700, 1600];
  const pickImg = () => Math.floor(r() * n);
  let kind;
  if (mode === 'still') kind = 'cover'; else if (!n) kind = 'text'; else if (mode === 'text-triplet') kind = 'text'; else { const x = r(); kind = x < 0.22 ? 'cover' : x < 0.46 ? 'zoom' : x < 0.6 ? 'mirror' : x < 0.7 ? 'quad' : x < 0.82 ? 'strips' : 'text'; }
  return { kind, idx, born: now, dur: a + r() * (b - a), i0: pickImg(), i1: pickImg(), i2: pickImg(), fx: 0.25 + r() * 0.5, fy: 0.25 + r() * 0.5, z0: kind === 'zoom' ? 1.5 + r() : 1, z1: kind === 'zoom' ? 2.4 + r() * 0.8 : 1.12 + r() * 0.2, word: mode === 'text-triplet' ? WORDS[idx % 3] : WORDS[Math.floor(r() * WORDS.length)], call: CALLS[Math.floor(r() * CALLS.length)], flip: r() < 0.5 };
}
function paintFace(bb, now) {
  const ctx = bb.ctx, W = bb.cv.width, H = bb.cv.height, P = bb.pal, imgs = bb.pool.imgs;
  if (!bb.cut || (bb.spec.contentMode !== 'still' && now - bb.cut.born > bb.cut.dur)) bb.cut = newCut(bb, bb.cutIdx++, now);
  const c = bb.cut, p = clamp((now - c.born) / c.dur), e = p * p * (3 - 2 * p), z = c.z0 + (c.z1 - c.z0) * e, img = i => imgs[i % Math.max(1, imgs.length)].img;
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H);
  const fx = c.fx + (c.flip ? -1 : 1) * 0.06 * e, fy = c.fy + 0.04 * e;
  if (!imgs.length) { ctx.fillStyle = P.frame; ctx.fillRect(0, 0, W, H); }
  else if (c.kind === 'cover' || c.kind === 'zoom') crop(ctx, img(c.i0), 0, 0, W, H, fx, fy, z, false);
  else if (c.kind === 'mirror') { crop(ctx, img(c.i0), 0, 0, W / 2, H, fx, fy, z, false); crop(ctx, img(c.i0), W / 2, 0, W / 2, H, fx, fy, z, true); }
  else if (c.kind === 'quad') { for (let q = 0; q < 4; q++) crop(ctx, img(c.i0), (q % 2) * W / 2, (q >> 1) * H / 2, W / 2, H / 2, fx, fy, z, q % 2 === 1); }
  else if (c.kind === 'strips') { [c.i0, c.i1, c.i2].forEach((k, s) => crop(ctx, img(k), s * W / 3, 0, W / 3, H, fx + s * 0.1, fy, z, false)); ctx.fillStyle = P.ink; for (const s of [1, 2]) ctx.fillRect(s * W / 3 - 3, 0, 6, H); }
  else { // text
    crop(ctx, img(c.i0), 0, 0, W, H, fx, fy, z, false); ctx.fillStyle = 'rgba(31,26,20,.42)'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, H * 0.47); ctx.rotate(-0.035); ctx.scale(1 + 0.05 * e, 1 + 0.05 * e);
    let size = H * 0.56; ctx.font = size + 'px KFBDisplay, Impact, sans-serif'; const w = ctx.measureText(c.word).width; if (w > W * 0.88) { size *= W * 0.88 / w; ctx.font = size + 'px KFBDisplay, Impact, sans-serif'; }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.17; ctx.strokeStyle = P.ink; ctx.strokeText(c.word, 0, 0); ctx.fillStyle = P.trim; ctx.fillText(c.word, 0, 0); ctx.restore();
    ctx.fillStyle = P.frame; ctx.fillRect(0, H - 74, W, 74); ctx.fillStyle = P.ink; ctx.fillRect(0, H - 78, W, 6);
    ctx.font = '40px KFBHand, cursive'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.trim; ctx.fillText(c.call, W / 2, H - 36);
  }
  bb.tex.needsUpdate = true; bb.updates++;
}

// ── Anker → Pose (Position, Drehung, Bodenhöhe); der Spec bleibt unverändert, nur der Anker wechselt ────────────
const toW = (x, z, yaw, lx, lz, s) => [x + (lx * Math.cos(yaw) + lz * Math.sin(yaw)) * s, z + (-lx * Math.sin(yaw) + lz * Math.cos(yaw)) * s];
export function resolveAnchor(spec, isl) {
  const a = spec.islandAnchor, s = spec.scale || 1, W = spec.faceSize.w, { gb, pz, legRun, px: pxf } = layoutFor(spec), px = W * pxf;
  const evalAt = (x, z, yaw) => {
    const feet = (legRun ? [[-px, pz], [px, pz], [-px, pz - legRun], [px, pz - legRun]] : [[-px, pz], [px, pz]]).map(([lx, lz]) => { const [wx, wz] = toW(x, z, yaw, lx, lz, s); return isl.H(wx, wz); });
    const y0 = feet.reduce((u, v) => u + v, 0) / 4, spread = Math.max(...feet) - Math.min(...feet); let worst = 0;
    for (let i = 0; i <= 6; i++) for (let j = 1; j <= 4; j++) { const [wx, wz] = toW(x, z, yaw, (i / 6 - 0.5) * W, 0.5 + j * 2, s); worst = Math.max(worst, isl.H(wx, wz) - (y0 + (gb - 1.0) * s)); }
    return { y0, spread, worst, feet };
  };
  let x, z, yaw, nudge = { dt: 0, dOff: 0 }, best;
  const rotY = ((spec.rotation && spec.rotation[1]) || 0) * Math.PI / 180;
  if (a.mode === 'road') {
    const snap = a.groundSnap || {}, nm = snap.autoNudge ? snap.maxNudge || { t: 0.03, offsetM: 8 } : { t: 0, offsetM: 0 };
    const dts = [0]; for (let k = 1; k <= 3; k++) dts.push(k * nm.t / 3, -k * nm.t / 3); const offs = [0]; for (let k = 1; k <= 4; k++) offs.push(k * nm.offsetM / 4);
    for (const dt of dts) for (const dOff of offs) {
      const ang = (a.t + dt) * Math.PI * 2, r = isl.roadR(ang) + a.side * (isl.ROAD_W / 2 + a.offsetFromKerb + dOff), cx = Math.cos(ang) * r, cz = Math.sin(ang) * r;
      const y = Math.atan2(-a.side * Math.cos(ang), -a.side * Math.sin(ang)) + (a.yawOffsetDeg || 0) * Math.PI / 180 + rotY, ev = evalAt(cx, cz, y);
      const over = Math.max(0, Math.hypot(cx, cz) - (isl.R_ISLAND - 7)), cost = 4 * Math.max(0, ev.worst) + ev.spread + 0.05 * Math.abs(dt) * 100 + 0.04 * dOff + 6 * over;
      if (!best || cost < best.cost) { best = { cost, cx, cz, y, ev }; nudge = { dt: +dt.toFixed(4), dOff: +dOff.toFixed(2) }; }
    }
    x = best.cx; z = best.cz; yaw = best.y;
  } else if (a.mode === 'polar') {
    const ang = a.angleDeg * Math.PI / 180; x = Math.cos(ang) * a.radius; z = Math.sin(ang) * a.radius;
    yaw = (a.facing === 'outward' ? Math.atan2(Math.cos(ang), Math.sin(ang)) : Math.atan2(-Math.cos(ang), -Math.sin(ang))) + rotY;
  } else { x = a.x || 0; z = a.z || 0; yaw = (a.yawDeg || 0) * Math.PI / 180 + rotY; }
  const ev = best ? best.ev : evalAt(x, z, yaw), pos = spec.position || [0, 0, 0], c = Math.cos(yaw), sn = Math.sin(yaw);
  return { x: x + pos[0] * c + pos[2] * sn, z: z + (-pos[0] * sn + pos[2] * c), y: (a.groundSnap && a.groundSnap.mode === 'flat' ? (a.y || 0) : ev.y0) + pos[1], yaw, nudge, ground: { spread: +ev.spread.toFixed(3), footDeltaMax: +Math.max(...ev.feet.map(f => Math.abs(f - ev.y0))).toFixed(3), frontClearance: +(-ev.worst).toFixed(3) } };
}

// ── Billboard-Instanz ─────────────────────────────────────────────────────────────────────────────
export class Billboard {
  constructor(spec, rt) {
    this.spec = spec; this.id = spec.id; this.seed = spec.seed; this.pool = rt.pool; this.pal = buildPalette(spec, rt.island);
    const s = spec.scale || 1, W = spec.faceSize.w, H = spec.faceSize.h; this.W = W; this.H = H; this.s = s;
    this.pose = resolveAnchor(spec, rt.island);
    const g = this.group = new THREE.Group(); g.name = spec.id; g.position.set(this.pose.x, this.pose.y, this.pose.z);
    g.rotation.set(((spec.rotation || [])[0] || 0) * Math.PI / 180, this.pose.yaw, ((spec.rotation || [])[2] || 0) * Math.PI / 180, 'YXZ'); g.scale.setScalar(s);
    this.style = styleOf(spec); this.layout = STYLES[this.style]; this.corner = cornerOf(spec, W, H);
    this.body = new THREE.Mesh(bodyGeometry(W, H, this.pal, this.style, this.corner), rt.bodyMat); this.body.castShadow = true; this.body.receiveShadow = true; this.body.name = 'body'; g.add(this.body);
    const cs = spec.faceSize.canvas || [1024, 512]; this.cv = document.createElement('canvas'); this.cv.width = cs[0]; this.cv.height = cs[1]; this.ctx = this.cv.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.cv); this.tex.colorSpace = THREE.SRGBColorSpace; this.tex.anisotropy = rt.aniso || 8;
    this.faceMat = new THREE.MeshBasicMaterial({ map: this.tex, toneMapped: false });
    this.face = new THREE.Mesh(faceGeometry(W, H, this.corner), this.faceMat); this.face.position.set(0, this.layout.gb + H / 2, 0.035); this.face.name = 'face'; g.add(this.face);
    g.updateMatrixWorld(true); this.center = this.face.getWorldPosition(new THREE.Vector3());
    this.radius = (W / 2 + 1.5) * s * 1.05; this.cut = null; this.cutIdx = 0; this.updates = 0; this.next = 0; this.lod = 'hidden'; this.cutIdx = 0;
    const Ly = this.layout, sp = spec.collisionMode === 'posts-cylinder-2' ? [-1, 1].map(sx => ({ type: 'cylinder', local: [sx * W * Ly.px, 0, Ly.pz], r: Ly.postR * s, h: (Ly.gb + H + 1) * s })) : [];
    g.userData.colliders = sp; g.userData.spec = spec.id;
    rt.parent.add(g);
  }
  paint(now) { paintFace(this, now); }
  get texBytes() { return Math.round(this.cv.width * this.cv.height * 4 * 4 / 3); }
  dispose() { this.group.parent && this.group.parent.remove(this.group); this.tex.dispose(); this.faceMat.dispose(); }
}

// ── Ein Zeitgeber-Aufruf pro Bild, vom bestehenden Frame-Owner. Kein eigener Timer. ─────────────────────────
export class BillboardScheduler {
  constructor() { this.list = []; this.fr = new THREE.Frustum(); this.pm = new THREE.Matrix4(); this.sph = new THREE.Sphere(); this.total = 0; this.win = []; this.visible = 0; this.lods = { near: 0, mid: 0, far: 0, hidden: 0 }; }
  clear() { this.list.length = 0; }
  prime(now) { for (const b of this.list) b.paint(now); }
  tick(now, camera) {
    camera.updateMatrixWorld(); this.pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); this.fr.setFromProjectionMatrix(this.pm);
    const cand = []; this.visible = 0; const L = { near: 0, mid: 0, far: 0, hidden: 0 };
    for (const b of this.list) {
      const d = b.center.distanceTo(camera.position), sp = b.spec, inRange = d <= sp.maxVisibleDistance; b.group.visible = inRange; b.dist = d;
      this.sph.set(b.center, b.radius); const vis = inRange && this.fr.intersectsSphere(this.sph); b.inView = vis;
      if (!vis) { b.lod = 'hidden'; L.hidden++; continue; }
      this.visible++; const lod = sp.lod; b.lod = d <= lod.near.maxDist ? 'near' : d <= lod.mid.maxDist ? 'mid' : 'far'; if (b.lod === 'near') cand.push(b); else { L[b.lod]++; }
    }
    cand.sort((a, b) => a.dist - b.dist); cand.forEach((b, i) => { if (i >= (b.spec.updatePolicy.maxNearActive || 4)) b.lod = 'mid'; L[b.lod]++; });
    for (const b of this.list) {
      if (!b.inView) continue; const hz = b.spec.lod[b.lod].hz; if (!hz || b.spec.contentMode === 'still') continue;
      if (now >= b.next) { b.next = now + 1000 / hz; b.paint(now); this.total++; this.win.push(now); }
    }
    this.lods = L; while (this.win.length && this.win[0] < now - 1000) this.win.shift();
  }
  rate() { return this.win.length; }
}
