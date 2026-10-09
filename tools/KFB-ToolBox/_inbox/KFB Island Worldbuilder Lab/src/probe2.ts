// Etherington probe v2 after the Bauweise sheet (docs/biome-sheets/Bauweise_Erdung, Georg PASS 2026-10-08):
// a real island field with a slope and micro relief (lab terrain + field.addEmbed), one Findling, one Mesa group,
// one shrub, one tree with fluff. Every saum element has a cause (rules 1–6): earth wedge uphill, debris fan downhill,
// groundcover on the sun side under the drip line, windfall rolled into the next hollow. Orbit freely; fixed presets
// per object: <obj>-auge (eye height 1 H from downhill), <obj>-fuss (foot close-up), <obj>-oben (45° from uphill).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initClay, clayMaterial, claySeed } from './clay';
import { Island } from './island/island';
import { blobOutline } from './island/shape';
import type { IslandSpec } from './island/spec';
import { PALETTES, ENV_ROLES } from './palettes';
import { H, loadSpecies, type EnvRole, type EnvSpecies } from './environment/kits';
import { envMaterial } from './environment/material';
import { footRadii, footPolygon, radiusToward, nest, fan, rollToRest, type Bit } from './environment/grounding';

const QS = new URLSearchParams(location.search);
const PAL_ID = QS.get('pal') ?? 'canyon';
const PAL = PALETTES[PAL_ID] ?? PALETTES.canyon;
const ROLES = ENV_ROLES[PAL.id];
const errors: string[] = [];
addEventListener('error', (e) => errors.push(String(e.message)));

/** probe island: a broad flank (mount) so every object has an uphill and a downhill side, plus micro relief */
export function probeIsland(): IslandSpec {
  return {
    id: 'probe', name: 'Etherington-Probe v2', palette: PAL.id, seed: 5, pos: [0, 0, 0],
    outline: blobOutline(36, 11, 2.3, 0.16),
    terrain: { hills: 0.9, hillScale: 0.13, depth: 1, beach: 0, pond: null, mount: { x: -20, z: -16, r: 40, h: 7 } },
    nature: { trees: 0, bushes: 0, rocks: 0, towers: 0, treeKind: 'ball' }, buildings: [], residents: [],
  };
}

const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAL.sky);
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 600);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.25; // snappier, no long drift (Georg)
controls.zoomToCursor = true;
scene.add(new THREE.HemisphereLight('#dfeeff', '#c7a790', 1.25));
const SUN = new THREE.Vector3(-60, 90, 45);
const sun = new THREE.DirectionalLight('#fff1dc', 2.4);
sun.position.copy(SUN);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 5, far: 300 });
sun.shadow.bias = -0.00003;
sun.shadow.normalBias = 1.2 * (90 / 4096);
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight('#ffe2c4', 0.9);
fill.position.set(80, -30, 30);
scene.add(fill);
/** sun side on the ground (where groundcover grows under an edge) */
const SUN_A = Math.atan2(SUN.z, SUN.x);

const R = (() => { let s = 11; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822519) + 1013904223) >>> 0) / 4294967296; })();
const cams: Record<string, { target: THREE.Vector3; pos: THREE.Vector3 }> = {};
const info: Record<string, unknown>[] = [];

function mesh(sp: EnvSpecies, x: number, y: number, z: number, rot: number, scale: number, contact?: { from: number; band: number }, tilt = 0) {
  const em = envMaterial(PAL, 1, contact ? { ground: ROLES.ground[2], strength: 0.8, band: contact.from + contact.band, from: contact.from } : undefined);
  const m = new THREE.Mesh(sp.geo, em.material);
  m.position.set(x, y, z);
  m.rotation.set(tilt, rot, 0, 'YXZ');
  m.scale.setScalar(scale);
  m.castShadow = m.receiveShadow = true;
  scene.add(m);
  return m;
}

async function boot() {
  await initClay();
  const isl = new Island(probeIsland());
  scene.add(isl.group);
  await isl.build(false);
  const f = isl.field;
  const L = async (id: string, role: EnvRole) => loadSpecies(id, role);
  const [rock, mesaA, mesaB, mesaC, bush, tree, grassA, grassB, pebA, pebB, rimRock] = await Promise.all([
    L('kk:Rock_3_A', 'rimRock'), L('kn:rock_tallA', 'rimRock'), L('kn:rock_tallB', 'rimRock'), L('kn:rock_tallC', 'rimRock'),
    L('kk:Bush_1_D', 'bush'), L('kk:Tree_1_A', 'anchor'), L('tt:grass_A', 'grass'), L('tt:grass_B', 'grass'), L('kk:Rock_3_H', 'stone'), L('kk:Rock_3_K', 'stone'), L('kk:Rock_3_N', 'rimRock'),
  ]);
  // sites on the flank, off the paths and the lip
  const site = (x: number, z: number): [number, number] => {
    for (let t = 0; t < 80; t++) {
      const a = R() * Math.PI * 2, d = t === 0 ? 0 : 1 + t * 0.15;
      const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
      if (f.sd(px, pz) > 9 && f.bed(px, pz) > 5) return [px, pz];
    }
    return [x, z];
  };
  type Obj = { key: string; sp: EnvSpecies; kind: 'boulder' | 'outcrop' | 'shrub' | 'tree' | 'rim'; at: [number, number]; scale: number; rot: number; sink: number; rise: number; fallK: number; downhill: number; contact?: [number, number] };
  const objs: Obj[] = [
    { key: 'findling', sp: rock, kind: 'boulder', at: site(2, 4), scale: 1, rot: 0.4, sink: 0.42, rise: 0.15, fallK: 0.8, downhill: 0.7, contact: [1.35, 0.35] },
    { key: 'mesa', sp: mesaA, kind: 'outcrop', at: site(-10, 14), scale: 1.4, rot: 0.3, sink: 0.2, rise: 0.12, fallK: 1.2, downhill: 0.8, contact: [1.4, 0.3] },
    { key: 'strauch', sp: bush, kind: 'shrub', at: site(14, -6), scale: 1.1, rot: 1.1, sink: 0.15, rise: 0, fallK: 0, downhill: 0, contact: [-1.05, 0.45] },
    { key: 'baum', sp: tree, kind: 'tree', at: site(16, 14), scale: 1, rot: 2.2, sink: 0.04, rise: 0.045, fallK: 1.5, downhill: 0.3, contact: [-0.9, 0.32] },
  ];
  // rim rock (H12): part of the island body at the edge, ESE towards the overview camera; overhang ≤ 20 % of its depth
  {
    const want = 0.35, sp = rimRock, scale = 1.4;
    let best = f.poly[0], bd = -Infinity;
    for (const p of f.poly) { const d = (p[0] * Math.cos(want) + p[1] * Math.sin(want)) / (Math.hypot(p[0], p[1]) || 1); if (d > bd) { bd = d; best = p; } }
    const rr = footRadii(sp, 0.5), rM = (rr.reduce((a, b) => a + b, 0) / rr.length) * scale, L = Math.hypot(best[0], best[1]) || 1;
    const inward = rM * 0.8;
    objs.push({ key: 'rand', sp, kind: 'rim', at: [best[0] - (best[0] / L) * inward, best[1] - (best[1] / L) * inward], scale, rot: 0.8, sink: 0.5, rise: 0.06, fallK: 1.0, downhill: 0 });
  }
  // the mesa group (fractal: one formation, two smaller noses) is embedded first so the talus is shared
  const extras: { sp: EnvSpecies; dx: number; dz: number; scale: number; rot: number }[] = [
    { sp: mesaB, dx: -4.2, dz: -2.6, scale: 0.75, rot: 1.4 },
    { sp: mesaC, dx: 3.6, dz: -3.4, scale: 0.55, rot: 2.6 },
  ];
  // 1 · embeds (terrain shapes itself around each foot line), 2 · rebuild ground once, 3 · place at ref − sink
  const placed: { o: Obj; radii: number[]; ref: number; down: [number, number]; h: number }[] = [];
  for (const o of objs) {
    const radii = footRadii(o.sp, o.sink), h = o.sp.height * o.scale, rMean = (radii.reduce((a, b) => a + b, 0) / radii.length) * o.scale;
    const fall = o.kind === 'tree' ? rMean * o.fallK : rMean * o.fallK;
    // contact: >0 = share of the mean foot radius, <0 = share of the crown radius (drip line)
    const contact = o.contact ? { radius: o.contact[0] > 0 ? rMean * o.contact[0] : o.sp.crownR * o.scale * -o.contact[0], strength: o.contact[1] } : undefined;
    const r = f.addEmbed({ id: o.key, kind: o.kind, x: o.at[0], z: o.at[1], rot: o.rot, scale: o.scale, footprint: footPolygon(radii), sink: o.sink * h, rise: o.rise * h, falloff: fall, downhill: o.downhill, contact });
    placed.push({ o, radii, ref: r.ref, down: r.down, h });
    if (o.key === 'mesa') extras.forEach((e, i) => {
      const er = footRadii(e.sp, 0.2), eh = e.sp.height * e.scale;
      const ex = o.at[0] + e.dx, ez = o.at[1] + e.dz, em = (er.reduce((a, b) => a + b, 0) / er.length) * e.scale;
      const rr = f.addEmbed({ id: `mesa-${i}`, kind: 'outcrop', x: ex, z: ez, rot: e.rot, scale: e.scale, footprint: footPolygon(er), sink: 0.2 * eh, rise: 0.12 * eh, falloff: em * 1.2, downhill: 0.8 });
      (e as any).ref = rr.ref; (e as any).h = eh;
    });
  }
  isl.rebuildGround();
  const gh = (x: number, z: number) => f.height(x, z);
  const tuft = (b: Bit, sinkK = 0.12) => { const sp = R() < 0.6 ? grassA : grassB; mesh(sp, b.x, gh(b.x, b.z) - sinkK * sp.height * b.size, b.z, b.rot, b.size, { from: 0, band: 0.35 }); };
  const pebble = (b: Bit) => { const sp = R() < 0.5 ? pebA : pebB; mesh(sp, b.x, gh(b.x, b.z) - 0.3 * sp.height * b.size, b.z, b.rot, b.size, { from: 0.3, band: 0.3 }, (R() - 0.5) * 0.5); };
  const counts: Record<string, { tufts: number; pebbles: number; fluff?: number }> = {};
  const fluffMat = clayMaterial('nature', new THREE.MeshStandardMaterial({ color: ROLES.accent[0], roughness: 0.8 }));
  const fluffGeo = claySeed(new THREE.IcosahedronGeometry(1, 3), 21);

  for (const { o, radii, ref, down, h } of placed) {
    const [x, z] = o.at, upA = Math.atan2(-down[1], -down[0]), downA = Math.atan2(down[1], down[0]);
    const rAt = (a: number) => radiusToward(radii, a, o.rot) * o.scale;
    // a rim rock's lower part is the visible continuation into the underside: it keeps its rock colour (no ground band)
    mesh(o.sp, x, ref - o.sink * h, z, o.rot, o.scale, o.kind === 'rim' ? undefined : { from: o.sink, band: o.kind === 'tree' ? 0.04 : 0.1 });
    const c: { tufts: number; pebbles: number; fluff?: number } = (counts[o.key] = { tufts: 0, pebbles: 0 });
    const gs = (k: number) => Math.min(1.2, (k * h) / grassA.height); // tuft scale for a share k of the object height
    if (o.kind === 'boulder') {
      // rule 1: earth wedge uphill holds water → one big nest in the throat, one small nest in a notch; debris fan downhill
      const ru = rAt(upA);
      const big = nest(R, x + Math.cos(upA) * ru * 1.02, z + Math.sin(upA) * ru * 1.02, upA, 0.9, ru * 0.55, gs(0.13), 9);
      const na = upA + 1.9, rn = rAt(na);
      const small = nest(R, x + Math.cos(na) * rn, z + Math.sin(na) * rn, na, 0.5, rn * 0.25, gs(0.09), 3);
      [...big, ...small].forEach((b) => tuft(b));
      const rd = rAt(downA);
      const deb = fan(R, x + Math.cos(downA) * rd * 0.98, z + Math.sin(downA) * rd * 0.98, down, rd * 1.3, (0.1 * h) / pebA.height, 6);
      deb.forEach(pebble);
      c.tufts = big.length + small.length; c.pebbles = deb.length;
    } else if (o.kind === 'outcrop') {
      for (const e of extras as any[]) mesh(e.sp, x + e.dx, e.ref - 0.2 * e.h, z + e.dz, e.rot, e.scale, { from: 0.2, band: 0.08 });
      // talus: what breaks off above collects downhill, big at the foot to small outside
      const rd = rAt(downA);
      const tal = fan(R, x + Math.cos(downA) * rd * 0.95, z + Math.sin(downA) * rd * 0.95, down, rd * 2.4, (0.07 * h) / pebA.height, 12);
      tal.forEach(pebble);
      const ru = rAt(upA);
      const nst = nest(R, x + Math.cos(upA) * ru, z + Math.sin(upA) * ru, upA, 0.8, ru * 0.45, gs(0.06), 6);
      nst.forEach((b) => tuft(b));
      c.tufts = nst.length; c.pebbles = tal.length;
    } else if (o.kind === 'rim') {
      // no saum: the grass band rolls onto the rock, nothing lies on the lip. Side camera: the island silhouette at the edge
      const L = Math.hypot(x, z) || 1, ox = x / L, oz = z / L, gy0 = gh(x, z);
      cams['rand-seite'] = { target: new THREE.Vector3(x, gy0 - 2, z), pos: new THREE.Vector3(x + ox * 16 - oz * 14, gy0 + 1, z + oz * 16 + ox * 14) };
    } else if (o.kind === 'shrub') {
      // groundcover only on the sun side, reaching under the edge; the shadow side stays bare; damp dark earth under the drip line
      const crown = o.sp.crownR * o.scale, rs = crown * 0.9;
      const a = nest(R, x + Math.cos(SUN_A) * rs, z + Math.sin(SUN_A) * rs, SUN_A, 0.7, crown * 0.45, gs(0.22), 7);
      const b = nest(R, x + Math.cos(SUN_A + 0.9) * rs, z + Math.sin(SUN_A + 0.9) * rs, SUN_A + 0.9, 0.4, crown * 0.2, gs(0.16), 3);
      [...a, ...b].forEach((t) => tuft(t, 0.2));
      c.tufts = a.length + b.length;
    } else {
      // tree: thin under the crown, dense at the drip line on the sun side; small nests between the root lobes; fluff in the crown
      const crown = o.sp.crownR * o.scale;
      const drip = nest(R, x + Math.cos(SUN_A) * crown * 0.95, z + Math.sin(SUN_A) * crown * 0.95, SUN_A, 0.6, crown * 0.5, gs(0.07), 11);
      const drip2 = nest(R, x + Math.cos(SUN_A + 2.4) * crown * 0.9, z + Math.sin(SUN_A + 2.4) * crown * 0.9, SUN_A + 2.4, 0.4, crown * 0.25, gs(0.05), 4);
      // root lobes: the directions where the flare reaches furthest
      const lobes = radii.map((r, k) => [r, k] as const).sort((p, q) => q[0] - p[0]).slice(0, 2).map(([, k]) => ((k + 0.5) / radii.length) * Math.PI * 2 - o.rot + 0.4);
      const roots = lobes.flatMap((a) => nest(R, x + Math.cos(a) * rAt(a) * 1.05, z + Math.sin(a) * rAt(a) * 1.05, a, 0.5, rAt(a) * 0.6, gs(0.035), 3));
      [...drip, ...drip2, ...roots].forEach((b) => tuft(b));
      c.tufts = drip.length + drip2.length + roots.length;
      // fluff: on the light side of the crown (leaf vertices high up, facing the sun)
      const p = o.sp.geo.attributes.position, sl = o.sp.geo.attributes.envSlot, cand: THREE.Vector3[] = [];
      const cs = Math.cos(o.rot), sn = Math.sin(o.rot);
      for (let i = 0; i < p.count; i += 7) {
        if (sl.getX(i) !== 0 || p.getY(i) < 0.6 * o.sp.height) continue;
        const lx = p.getX(i) * o.scale, lz = p.getZ(i) * o.scale, wx = lx * cs + lz * sn, wz = -lx * sn + lz * cs;
        if ((wx * Math.cos(SUN_A) + wz * Math.sin(SUN_A)) / (Math.hypot(wx, wz) || 1) < 0.15) continue;
        cand.push(new THREE.Vector3(x + wx * 1.02, ref - o.sink * h + p.getY(i) * o.scale, z + wz * 1.02));
      }
      const balls: THREE.Vector3[] = [], fr = 0.13 * H;
      for (const v of cand.sort(() => R() - 0.5)) { if (balls.length >= 5) break; if (balls.every((b) => b.distanceTo(v) > crown * 0.35)) balls.push(v); }
      for (const v of balls) { const m = new THREE.Mesh(fluffGeo, fluffMat); m.position.copy(v); m.scale.setScalar(fr); m.castShadow = true; scene.add(m); }
      // windfall: two ripe balls dropped at the downhill drip line, rolled into the next hollow
      for (const k of [-0.4, 0.5]) {
        const a = downA + k, [wx, wz] = rollToRest(gh, x + Math.cos(a) * crown * 0.8, z + Math.sin(a) * crown * 0.8, crown * 1.6);
        const m = new THREE.Mesh(fluffGeo, fluffMat);
        m.position.set(wx, gh(wx, wz) + fr * 0.82, wz);
        m.scale.setScalar(fr);
        m.castShadow = m.receiveShadow = true;
        scene.add(m);
      }
      c.fluff = balls.length + 2;
    }
    info.push({ object: o.key, model: o.sp.id, kind: o.kind, heightH: +(h / H).toFixed(2), sinkPct: Math.round(o.sink * 100), riseH: +(o.rise * h).toFixed(2), down: down.map((v) => +v.toFixed(2)), ...c });
    // fixed cameras: eye height 1 H from downhill, foot close-up from the side, 45° from uphill
    const crownW = o.sp.crownR * o.scale, size = Math.max(h, crownW * 1.2), gy = gh(x, z);
    const t = new THREE.Vector3(x, gy + h * (o.kind === 'tree' ? 0.25 : 0.35), z);
    const dA = downA, sA = downA + Math.PI / 2;
    const ad = Math.max(size * 2.2, crownW * 3.2, 9);
    cams[`${o.key}-auge`] = { target: t.clone(), pos: new THREE.Vector3(x + Math.cos(dA) * ad, gh(x + Math.cos(dA) * ad, z + Math.sin(dA) * ad) + H, z + Math.sin(dA) * ad) };
    const fd = Math.max(size * 1.25, crownW * 2.4);
    cams[`${o.key}-fuss`] = { target: new THREE.Vector3(x, gy + h * 0.1, z), pos: new THREE.Vector3(x + Math.cos(sA) * fd, gy + Math.max(size * 0.35, 1.2), z + Math.sin(sA) * fd) };
    cams[`${o.key}-oben`] = { target: t.clone(), pos: new THREE.Vector3(x + Math.cos(upA) * size * 1.8, gy + size * 1.9, z + Math.sin(upA) * size * 1.8) };
  }
  cams.overview = { target: new THREE.Vector3(4, 0, 6), pos: new THREE.Vector3(54, 46, 78) };
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
  document.getElementById('title')!.textContent = p === 'overview' ? `Etherington-Probe v2 · Hang fällt nach Südosten · Palette ${PAL.id} · Maus: drehen, zoomen` : p.replace('-', ' · ');
}

(window as any).__kfb = {
  ready: false, errors, warnings: [],
  presets: () => Object.keys(cams), setCamera, setTime: () => null, player: () => null,
  waitIdle: async () => { await new Promise((r) => setTimeout(r, 400)); },
  stats: () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles }),
  info: () => info,
};
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
boot().catch((e) => { console.error(e); errors.push(String(e?.stack ?? e)); });
