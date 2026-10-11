// Wasser (B+) · Steuerung 11.10.: Claude Design Island Kit R2 fluid.js 1:1 (src/water/vendor, SOURCE.md; F0–F2 Georg PASS). Lab wiring:
//   · fluidMat(k): the kit material; the pattern is evaluated in kit METRES (world xz × uWorldK, uWorldK = 1/k), so the Lab's lab
//     units (1 m = k = 1.967 lab) do not shrink it — geometry, shore distance and (s, n) stay in metres inside a group scaled k
//   · pondWaterFromAtlas: PondLand (StreakByte) has NO basin — its pond is a flat face of `M_Pond Base` ≈ 0.35 m under the meadow,
//     no floor beneath (probe tools/stage2/pond-probe.mjs). So only the surface: the blue atlas faces get a still-water fluid sheet,
//     aShore = metres to the edge of the water faces
//   · water edits on the island recipe (edits[], kfb.island-config/1): addPond / addRiver (pure, for the God-Mode editor) and
//     buildWaterEdit → the kit chain lakeHAt / lakeRiver → heightField, waterline, fieldWater, bedSolid, waterCaps
//   · buildLakeStage (?stage=lake): one river edit as a walkable stage (the full chain with real depth)
import * as THREE from 'three';
import * as FL from './vendor/fluid.js';
import { clayMaterial } from '../clay';
import { buildSurfaceField } from '../play/surface';
const F = FL as any;

export const M2LAB = 3.64 / 1.85;   // kit metre → lab (a figure metre, as the PondLand stage)

/** the kit fluid material, pattern in metres; `tick(t)` drives uTime */
export function fluidMat(k = M2LAB) {
  const m = F.fluidMaterial();
  m.fragmentShader = m.fragmentShader.replace('uniform vec2 uZ;', 'uniform vec2 uZ; uniform float uWorldK;').replace('vec2 P = vW.xz;', 'vec2 P = vW.xz * uWorldK;');
  m.uniforms.uWorldK = { value: 1 / k };
  return m as THREE.ShaderMaterial & { userData: { U: any; ready: Promise<boolean[]> } };
}

// ---------------- recipe edits (God-Mode tool functions) ----------------
export type WaterEdit =
  | { kind: 'pond'; cx: number; cz: number; R: number; level?: number; bed?: number; seed?: number }
  | { kind: 'river'; lake: { cx: number; cz: number; R: number }; pts: [number, number][]; level?: number; drop?: number; hw?: number; depth?: number };
/** add a pond to an island recipe's edits (metres in the island frame); returns the edit */
export function addPond(recipe: { edits?: unknown[] }, o: { cx: number; cz: number; R?: number; level?: number; seed?: number }) {
  const e: WaterEdit = { kind: 'pond', cx: o.cx, cz: o.cz, R: Math.max(2, o.R ?? 9), level: o.level ?? -0.35, seed: o.seed ?? 0 };
  (recipe.edits ??= []).push(e); return e;
}
/** add a lake with an outflowing river (Catmull-Rom points from the lake outward) */
export function addRiver(recipe: { edits?: unknown[] }, o: { lake: { cx: number; cz: number; R: number }; pts: [number, number][]; hw?: number; depth?: number; drop?: number }) {
  if (o.pts.length < 3) throw new Error('addRiver: at least 3 points');
  const e: WaterEdit = { kind: 'river', lake: o.lake, pts: o.pts, hw: o.hw ?? 2.7, depth: o.depth ?? 1.6, drop: o.drop ?? 0.5, level: -0.35 };
  (recipe.edits ??= []).push(e); return e;
}
/** one water edit → terrain height, level, flow (the kit chain) */
export function waterFields(e: WaterEdit) {
  if (e.kind === 'pond') { const hAt = F.lakeHAt({ R: e.R, cx: e.cx, cz: e.cz, seed: e.seed ?? 0, bed: e.bed ?? -2.6 }), LV = e.level ?? -0.35; return { hAt, levelAt: () => LV, flowAt: () => ({ f: 0, s: 0, n: 0, t: [1, 0] }), info: { kind: 'pond' } }; }
  const RV = F.lakeRiver({ lake: e.lake, pts: e.pts, LV: e.level ?? -0.35, drop: e.drop ?? 0.5, hw: e.hw ?? 2.7, depth: e.depth ?? 1.6 });
  return { hAt: RV.hAt, levelAt: RV.levelAt, flowAt: RV.flowAt, info: { kind: 'river', L: +RV.path.L.toFixed(1), s0: +RV.s0.toFixed(1), minR: +RV.minR.toFixed(1), hw: RV.hw } };
}
/** build the meshes of a water edit over a w × d metre field (kit bench F1/F2 order: terrain, solid, caps, water) */
export function buildWaterEdit(e: WaterEdit, o: { w: number; d: number; grass?: string; under?: string; k?: number }) {
  const W = o.w, D = o.d, fld = waterFields(e), mat = fluidMat(o.k ?? M2LAB);
  const tg = F.heightField(fld.hAt, { w: W, d: D, level: fld.levelAt, grass: o.grass ?? '#7cba48' });
  const ter = new THREE.Mesh(tg, clayMaterial('terrain', new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }))); ter.receiveShadow = true; ter.name = 'water-terrain'; ter.userData.stageRole = 'ground';
  const solid = new THREE.Mesh(F.bedSolid(fld.hAt, { w: W, d: D }), clayMaterial('terrain', new THREE.MeshStandardMaterial({ color: o.under ?? '#7a4a2e', roughness: 0.95 }))); solid.name = 'water-solid';
  const caps = new THREE.Mesh(F.waterCaps(fld.hAt, fld.levelAt, { w: W, d: D }), new THREE.MeshStandardMaterial({ color: new THREE.Color(0.16, 0.42, 0.5).multiplyScalar(0.8), transparent: true, opacity: 0.62, roughness: 0.3, depthWrite: false, side: THREE.DoubleSide })); caps.name = 'water-caps';
  const wl = F.waterline(fld.hAt, fld.levelAt, { w: W, d: D }), FW = F.fieldWater(fld.hAt, fld.levelAt, wl, fld.flowAt, { w: W - 0.1, d: D });
  const water = new THREE.Mesh(FW.geo, mat); water.renderOrder = 1; water.frustumCulled = false; water.name = 'water-surface';
  const group = new THREE.Group(); group.name = 'water:' + e.kind; group.add(ter, solid, caps, water);
  return { group, terrain: ter, water, mat, fields: fld, info: { ...fld.info, verts: FW.verts, sJump: +FW.sJump.toFixed(2), waterline: { segs: wl.seg.length, area: Math.round(wl.area), circularity: +wl.circularity.toFixed(2) } } };
}

// ---------------- ?stage=lake: the full chain as a walkable stage ----------------
export async function buildLakeStage() {
  const k = M2LAB, W = 64, D = 44;
  // the kit bench F2 river (fluid.js lakeRiver default lake + the bench points), as ONE recipe edit
  const recipe: { edits?: unknown[] } = {};
  const edit = addRiver(recipe, { lake: { cx: -14, cz: 2, R: 9.5 }, pts: [[-14, 2], [-2, 0], [10, -5.5], [22, -3], [34, 3]] });
  const B = buildWaterEdit(edit, { w: W, d: D, k });
  await B.mat.userData.ready;
  const stage = new THREE.Group(); stage.name = 'stage:lake'; stage.add(B.group); stage.scale.setScalar(k); stage.updateMatrixWorld(true);
  // walk surface: the terrain; deep water (bed more than 0.3 m under the level) is a wall
  const base = buildSurfaceField([B.terrain], 2, () => false), { hAt, levelAt } = B.fields;
  const surface = { ...base, at(x: number, z: number) { const h = base.at(x, z); if (!h) return null; const mx = x / k, mz = z / k; return hAt(mx, mz) < levelAt(mx, mz) - 0.3 ? { ...h, wall: true } : h; } };
  // spawn: dry bank near the second bend, facing the river
  let spawn: [number, number, number] = [0, 0, 0];
  for (const [mx, mz] of [[10, -12], [8, -13], [12, -12], [4, -10], [16, -11]]) { if (hAt(mx, mz) > levelAt(mx, mz) + 0.5 && Math.abs(mx) < W / 2 - 3 && Math.abs(mz) < D / 2 - 3) { spawn = [mx * k, mz * k, Math.atan2(10 - mx, -5.5 - mz)]; break; } }
  const box = new THREE.Box3().setFromObject(stage), t0 = performance.now();
  return { name: 'lake', scale: k, group: stage, surface, box, spawn, update() { B.mat.uniforms.uTime.value = (performance.now() - t0) / 1000; }, info: { scene: 'lake (Island Kit F2 chain)', edit, ...B.info, surfaceTris: base.tris } };
}

// ---------------- PondLand: fluid sheet over the pond faces (no basin there) ----------------
export async function pondWaterFromAtlas(stageGroup: THREE.Group, k = M2LAB) {
  const base = stageGroup.getObjectByName('M_Pond Base') as THREE.Mesh | undefined;
  if (!base) return null;
  const map = (base.material as THREE.MeshStandardMaterial).map!;
  const img: any = map.image; if (!img || !img.complete) await new Promise((r) => { const iv = setInterval(() => { if ((map.image as any)?.complete) { clearInterval(iv); r(null); } }, 50); });
  const im = map.image as HTMLImageElement, cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const cx = cv.getContext('2d')!; cx.drawImage(im, 0, 0);
  const px = cx.getImageData(0, 0, cv.width, cv.height).data;
  const g = base.geometry, P = g.attributes.position, UV = g.attributes.uv, I = g.index, n = I ? I.count : P.count;
  base.updateWorldMatrix(true, false);
  const inv = new THREE.Matrix4().copy(stageGroup.matrixWorld).invert(), M = new THREE.Matrix4().multiplyMatrices(inv, base.matrixWorld);   // base → stage-local (= metres × 1)
  const blue = (u: number, v: number) => { const x = Math.min(cv.width - 1, Math.max(0, Math.floor(u * cv.width))), y = Math.min(cv.height - 1, Math.max(0, Math.floor((1 - v) * cv.height))), o = (y * cv.width + x) * 4, r = px[o] / 255, gg = px[o + 1] / 255, b = px[o + 2] / 255; return b > 0.4 && b > r + 0.15 && b > gg + 0.02; };
  const pos: number[] = [], key = new Map<string, number>(), idx: number[] = [], edgeCount = new Map<string, number>(), v = new THREE.Vector3();
  const vid = (i: number) => { v.fromBufferAttribute(P, i).applyMatrix4(M); const kk = v.x.toFixed(3) + ',' + v.z.toFixed(3); let id = key.get(kk); if (id == null) { id = pos.length / 3; key.set(kk, id); pos.push(v.x, v.y + 0.012, v.z); } return id; };
  for (let t = 0; t < n; t += 3) {
    const a = I ? I.getX(t) : t, b = I ? I.getX(t + 1) : t + 1, c = I ? I.getX(t + 2) : t + 2;
    const u = (UV.getX(a) + UV.getX(b) + UV.getX(c)) / 3, w = (UV.getY(a) + UV.getY(b) + UV.getY(c)) / 3;
    if (!blue(u, w)) continue;
    const A = vid(a), Bv = vid(b), C = vid(c); if (A === Bv || Bv === C || A === C) continue;
    // keep only up-facing faces (the water top)
    const ny = (pos[Bv * 3 + 2] - pos[A * 3 + 2]) * (pos[C * 3] - pos[A * 3]) - (pos[Bv * 3] - pos[A * 3]) * (pos[C * 3 + 2] - pos[A * 3 + 2]);
    idx.push(A, Bv, C); for (const [p, q] of [[A, Bv], [Bv, C], [C, A]]) { const e = p < q ? p + ':' + q : q + ':' + p; edgeCount.set(e, (edgeCount.get(e) ?? 0) + 1); }
    void ny;
  }
  if (!idx.length) return null;
  // shore = edges used by one water face; aShore = metres to the nearest shore edge
  const seg: [[number, number], [number, number]][] = [];
  for (const [e, c] of edgeCount) if (c === 1) { const [p, q] = e.split(':').map(Number); seg.push([[pos[p * 3], pos[p * 3 + 2]], [pos[q * 3], pos[q * 3 + 2]]]); }
  const nv = pos.length / 3, sh = new Float32Array(nv), fl = new Float32Array(nv * 2), sn = new Float32Array(nv * 2);
  for (let i = 0; i < nv; i++) { const x = pos[i * 3], z = pos[i * 3 + 2]; let m = 1e9; for (const [a, b] of seg) { const dx = b[0] - a[0], dz = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1))); m = Math.min(m, Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz)); } sh[i] = m; sn[i * 2] = x; sn[i * 2 + 1] = z; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('aShore', new THREE.BufferAttribute(sh, 1)); geo.setAttribute('aFlow', new THREE.BufferAttribute(fl, 2)); geo.setAttribute('aSN', new THREE.BufferAttribute(sn, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const mat = fluidMat(k); await mat.userData.ready;
  const mesh = new THREE.Mesh(geo, mat); mesh.name = 'pond-fluid'; mesh.renderOrder = 1; mesh.frustumCulled = false;
  stageGroup.add(mesh);
  const t0 = performance.now(); let maxS = 0; sh.forEach((x) => { if (x > maxS) maxS = x; });
  return { mesh, update() { mat.uniforms.uTime.value = (performance.now() - t0) / 1000; }, info: { faces: idx.length / 3, verts: nv, shoreSegs: seg.length, maxShoreM: +maxS.toFixed(2), basin: 'none (flat face of M_Pond Base ≈ 0.35 m under the meadow, no floor beneath)' } };
}
