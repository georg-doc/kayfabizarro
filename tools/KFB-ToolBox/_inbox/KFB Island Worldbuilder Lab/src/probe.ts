// Etherington probe (QA_RULEBOOK_ENVIRONMENT_R1 §0b.5): one tree, one bush, one rock, each twice on the same ground:
// left "ohne" (set on the ground, as before), right "mit" the three grounding techniques
//   1 Eingraben: foot sunk 5–15 % of the height + a soft earth mound around it
//   2 Kontakt:   ground darkens around the foot (contact AO blob, Diorama Texture Atlas radial decal) and the foot takes
//                on the ground colour (no hard foot line)
//   3 Überlappen: 3–8 grass tufts and pebbles, each < 15 % of the object, over the foot (atlas: crumbs at the base)
// Same light as the worldbuilder. Fixed cameras: overview, <obj>-ohne, <obj>-mit. Open /probe.html (?biome=canyon).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initClay, clayMaterial, claySeed } from './clay';
import { loadSpecies, type EnvRole, type EnvSpecies } from './environment/kits';
import { envMaterial } from './environment/material';
import { PALETTES, ENV_ROLES } from './palettes';
import { vnoise } from './island/noise';

const QS = new URLSearchParams(location.search);
const PAL = PALETTES[QS.get('pal') ?? 'canyon'] ?? PALETTES.canyon;
const ROLES = ENV_ROLES[PAL.id];
const errors: string[] = [];
addEventListener('error', (e) => errors.push(String(e.message)));

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAL.sky);
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 500);
// orbit freely (Georg judges in 3D); the fixed presets still set position + target
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.25; // snappier, no long drift (Georg)
controls.zoomToCursor = true;
// worldbuilder light (main.ts)
scene.add(new THREE.HemisphereLight('#dfeeff', '#c7a790', 1.25));
const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
sun.position.set(-60, 90, 45);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 5, far: 300 });
sun.shadow.bias = -0.00003;
sun.shadow.normalBias = 1.2 * (80 / 4096);
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight('#ffe2c4', 0.9);
fill.position.set(80, -30, 30);
scene.add(fill);

type Obj = { key: string; id: string; role: EnvRole; z: number; sink: number; band: number; tufts: number; pebbles: number; flip?: boolean };

const FLIP = new Map<EnvSpecies, THREE.BufferGeometry>();
/** a rock turned onto its broad side: geometry rotated, foot share recomputed */
function flipped(sp: EnvSpecies): THREE.BufferGeometry {
  let g = FLIP.get(sp);
  if (!g) {
    g = sp.geo.clone();
    g.rotateX(Math.PI);
    g.computeBoundingBox();
    g.translate(0, -g.boundingBox!.min.y, 0);
    const p = g.attributes.position, f = g.attributes.envFoot as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) f.setX(i, p.getY(i) / sp.height);
    FLIP.set(sp, g);
  }
  return g;
}

/** silhouette radius per direction (16 sectors): at the ground line, or for overhanging bushes the widest part below half height */
function sectorR(sp: EnvSpecies, sink: number, flip: boolean, overhang: boolean): number[] {
  const p = (flip ? flipped(sp) : sp.geo).attributes.position, h = sp.height, out = new Array(16).fill(0);
  const put = (x: number, z: number) => { const k = Math.floor(((Math.atan2(z, x) / (Math.PI * 2)) + 1) * 16) % 16; out[k] = Math.max(out[k], Math.hypot(x, z)); };
  if (overhang) {
    for (let i = 0; i < p.count; i++) if (p.getY(i) < 0.45 * h) put(p.getX(i), p.getZ(i));
  } else {
    // exact ground line: where triangle edges cross the plane y = sink · h
    const y0 = sink * h;
    for (let t = 0; t + 2 < p.count; t += 3) for (const [i, j] of [[t, t + 1], [t + 1, t + 2], [t + 2, t]]) {
      const ya = p.getY(i), yb = p.getY(j);
      if ((ya - y0) * (yb - y0) > 0 || ya === yb) continue;
      const u = (y0 - ya) / (yb - ya);
      put(p.getX(i) + (p.getX(j) - p.getX(i)) * u, p.getZ(i) + (p.getZ(j) - p.getZ(i)) * u);
    }
  }
  // empty sectors: take the neighbours
  for (let k = 0; k < 16; k++) if (!out[k]) out[k] = Math.max(out[(k + 15) % 16], out[(k + 1) % 16]) || Math.max(...out);
  return out;
}

/** radius of the object's silhouette where it meets the ground (at the sink height), lab units at scale 1 */
function contactR(sp: EnvSpecies, sink: number, flip = false): number {
  const p = (flip ? flipped(sp) : sp.geo).attributes.position, h = sp.height, y0 = sink * h, dy = 0.04 * h;
  let r = 0;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (Math.abs(y - y0) < dy) r = Math.max(r, Math.hypot(p.getX(i), p.getZ(i)));
  }
  return Math.max(r, sp.footR);
}
const OBJS: Obj[] = [
  { key: 'baum', id: QS.get('tree') ?? 'kk:Tree_1_A', role: 'anchor', z: -14, sink: 0.07, band: 0.06, tufts: 7, pebbles: 3 },
  { key: 'busch', id: QS.get('bush') ?? 'kk:Bush_1_D', role: 'bush', z: 0, sink: 0.12, band: 0.1, tufts: 6, pebbles: 2 },
  { key: 'fels', id: QS.get('rock') ?? 'kk:Rock_3_A', role: 'rimRock', z: 13, sink: 0.15, band: 0.1, tufts: 6, pebbles: 3, flip: true },
];
const X_OHNE = -10, X_MIT = 10;

type Foot = { x: number; z: number; mound: number; rM: number; ao: number; rAO: number };
const feet: Foot[] = [];

const base = (x: number, z: number) => (vnoise(x * 0.08, z * 0.08, 5) - 0.5) * 0.5;
function groundH(x: number, z: number) {
  let h = base(x, z);
  for (const f of feet) h += f.mound * Math.exp(-((x - f.x) ** 2 + (z - f.z) ** 2) / (f.rM * f.rM));
  return h;
}

function buildGround(): THREE.Mesh {
  const S = 34, step = 0.25, n = Math.round((2 * S) / step) + 1;
  const g = new THREE.PlaneGeometry(2 * S, 2 * S, n - 1, n - 1);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, cols = new Float32Array(p.count * 3);
  const c0 = new THREE.Color(ROLES.ground[1]), c1 = new THREE.Color(ROLES.ground[0]), cDark = new THREE.Color(ROLES.ground[2]), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    p.setY(i, groundH(x, z));
    c.copy(c0).lerp(c1, THREE.MathUtils.smoothstep(vnoise(x * 0.09 + 3, z * 0.09 - 5, 4), 0.48, 0.58));
    // contact: darker soil + AO blob around every grounded foot
    let ao = 0;
    for (const f of feet) ao = Math.max(ao, f.ao * Math.exp(-((x - f.x) ** 2 + (z - f.z) ** 2) / (f.rAO * f.rAO)));
    c.lerp(cDark, ao * 0.6).multiplyScalar(1 - ao * 0.45);
    cols.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.deleteAttribute('uv');
  g.computeVertexNormals();
  claySeed(g, 7);
  const m = new THREE.Mesh(g, clayMaterial('terrain', new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.9 })));
  m.receiveShadow = true;
  return m;
}

function place(sp: EnvSpecies, x: number, z: number, sink: number, rot: number, contact: boolean, band: number, scale = 1, flip = false) {
  const h = sp.height * scale, fr = sp.footR * scale;
  let gy = groundH(x, z);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; gy = Math.min(gy, groundH(x + Math.cos(a) * fr * 0.8, z + Math.sin(a) * fr * 0.8)); }
  // contact band starts at the ground line (the sunk part is hidden anyway)
  const em = envMaterial(PAL, 1, contact ? { ground: ROLES.ground[2], strength: 0.85, band: sink + band, from: sink } : undefined);
  const m = new THREE.Mesh(flip ? flipped(sp) : sp.geo, em.material);
  m.position.set(x, gy - sink * h, z);
  m.rotation.y = rot;
  m.scale.setScalar(scale);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  return m;
}

const cams: Record<string, { target: THREE.Vector3; pos: THREE.Vector3 }> = {};
const info: Record<string, unknown>[] = [];

async function boot() {
  await initClay();
  const sps = await Promise.all(OBJS.map((o) => loadSpecies(o.id, o.role)));
  const grass = await loadSpecies(QS.get('tuft') ?? 'tt:grass_A', 'grass');
  const pebble = await loadSpecies(QS.get('pebble') ?? 'kk:Rock_3_H', 'stone');
  // grounded feet first (mound + AO shape the ground)
  OBJS.forEach((o, i) => {
    const sp = sps[i], h = sp.height, rc = contactR(sp, o.sink, o.flip);
    feet.push({ x: X_MIT, z: o.z, mound: Math.min(0.4 * o.sink * h, 0.4), rM: rc * 1.45, ao: 0.8, rAO: rc * 1.3 });
  });
  scene.add(buildGround());
  const R = (() => { let s = 7; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822519) + 1013904223) >>> 0) / 4294967296; })();
  OBJS.forEach((o, i) => {
    const sp = sps[i], h = sp.height;
    place(sp, X_OHNE, o.z, 0, 0.6, false, o.band, 1, o.flip);
    place(sp, X_MIT, o.z, o.sink, 0.6, true, o.band, 1, o.flip);
    // overlaps: tufts and pebbles over the foot line (half on the object, half on the ground), each < 15 % of the object
    const wide = o.role === 'bush' || o.role === 'rimRock';
    const ring = contactR(sp, o.sink, o.flip);
    const sec = sectorR(sp, o.sink, !!o.flip, o.role === 'bush');
    // a direction in world space → radius on the rotated object (rotation.y = 0.6)
    const rAt = (a: number) => sec[Math.floor((((a + 0.6) / (Math.PI * 2)) % 1 + 1) * 16) % 16];
    const tuftK = Math.min(1, (0.13 * h) / grass.height), pebK = Math.min(0.6, (0.12 * h) / pebble.height);
    for (let k = 0; k < o.tufts; k++) {
      const a = (k / o.tufts) * Math.PI * 2 + R() * 0.6, r = rAt(a) * (o.role === 'bush' ? 0.98 + R() * 0.1 : 0.95 + R() * 0.15);
      place(grass, X_MIT + Math.cos(a) * r, o.z + Math.sin(a) * r, 0.1, R() * 6.3, true, 0.35, tuftK * (0.75 + R() * 0.3));
    }
    for (let k = 0; k < o.pebbles; k++) {
      const a = R() * Math.PI * 2, r = rAt(a) * (1.02 + R() * 0.15);
      place(pebble, X_MIT + Math.cos(a) * r, o.z + Math.sin(a) * r, 0.35, R() * 6.3, true, 0.5, pebK * (0.6 + R() * 0.5));
    }
    info.push({ object: o.key, species: o.id, kit: sp.kit, heightH: +(h / 3.64).toFixed(2), sinkPct: Math.round(o.sink * 100), moundMax: +feet[i].mound.toFixed(2),
      contactBand: o.band, tufts: o.tufts, pebbles: o.pebbles, tuftShare: +((tuftK * grass.height) / h).toFixed(3), pebbleShare: +((pebK * pebble.height) / h).toFixed(3) });
    // fixed close-up cameras on the foot, same framing for both variants
    const ty = h * (o.role === 'anchor' ? 0.12 : 0.3), d = o.role === 'anchor' ? 9 : wide ? sp.crownR * 3.2 : 6;
    for (const [v, x] of [['ohne', X_OHNE], ['mit', X_MIT]] as const) {
      cams[`${o.key}-${v}`] = { target: new THREE.Vector3(x, ty, o.z), pos: new THREE.Vector3(x + d * 0.55, ty + d * 0.32, o.z + d * 0.8) };
    }
  });
  cams.overview = { target: new THREE.Vector3(0, 1, 0), pos: new THREE.Vector3(26, 30, 48) };
  scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && m.castShadow) for (const mt of [m.material].flat() as THREE.Material[]) if (mt.side === THREE.FrontSide) { mt.shadowSide = THREE.FrontSide; mt.needsUpdate = true; } });
  setCamera('overview');
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
  (window as any).__kfb.ready = true;
}

function setCamera(p: string) {
  const c = cams[p];
  if (!c) return;
  camera.position.copy(c.pos);
  controls.target.copy(c.target);
  controls.update();
  const t = document.getElementById('title')!;
  t.textContent = p === 'overview' ? `Etherington-Probe · links ohne, rechts mit Eingraben · Kontakt · Überlappen · Palette ${PAL.id}` : p.replace('-', ' · ');
}

(window as any).__kfb = {
  ready: false, errors, warnings: [],
  presets: () => Object.keys(cams),
  setCamera, setTime: () => null, player: () => null,
  waitIdle: async () => { await new Promise((r) => setTimeout(r, 400)); },
  stats: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles }),
  info: () => info,
};
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
boot().catch((e) => { console.error(e); errors.push(String(e?.stack ?? e)); });
