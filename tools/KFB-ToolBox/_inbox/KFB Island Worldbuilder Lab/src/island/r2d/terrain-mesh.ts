// Top surface + rim as ONE mesh: polar net around the centroid, quarter-circle roll over the edge, one ring diving into
// the body. Ported 1:1 from R2D v0 island.js `buildTerrain` (Z. 165–197); `buildBody` (v6) is replaced by Scholle v7
// (scholle.ts). Lab changes: ring count scales with the island radius (R2D: 44 rings for Ø ≈ 90), vertex colours are not
// used on the top (the colour map carries the colour, §4.5), and the mesh keeps the dive ring (hidden in the body).
import * as THREE from 'three';
import type { R2DFields, R2DPlan } from './fields';
import type { FormField } from './form';
import { sstep, vnoise, lerp } from './math';

export interface EdgeParams { cap: number; ov: number }
/** R2D v0 islands: mean rim radius ≈ 34 (seed 3 burg 33.6, seed 11 protopia 32.6); cap 1.4 / ov 0.45 belong to that size */
export const EDGE_REF_R = 34;
/** rim rounding scales with the island (Lauf 03 Schritt 0: at Town size the R2D cap read as a thin brim); never below R2D */
export function edgeFor(base: EdgeParams, edgeR: ArrayLike<number>): EdgeParams & { k: number } {
  let Rm = 0; for (let a = 0; a < edgeR.length; a++) Rm += edgeR[a]; Rm /= edgeR.length;
  const k = Math.max(1, Rm / EDGE_REF_R);
  return { cap: base.cap * k, ov: base.ov * k, k };
}

export interface TerrainMesh {
  geo: THREE.BufferGeometry;
  /** top-down UV box of the colour map */
  box: { minX: number; minZ: number; W: number };
  /** y of the last top ring per angle (start of the roll) */
  edgeY: Float32Array;
  NR: number;
  NA: number;
  /** vertex rows: 0..NR top, NR+1..NR+6 roll, ..footRow wall, ..rollRow neck, diveRow = rollRow + 1 dive (inside the body) */
  footRow: number;
  rows: number;
  rollRow: number;
  diveRow: number;
  /** outward horizontal normal of the last roll ring per angle (x, z): shared with the Scholle's ring 0 */
  rimN: Float32Array;
  /** edge height the body hangs from per angle: wall foot + cap (= edgeY without a wall) */
  bodyEdgeY: Float32Array;
}

export function buildTerrainMesh(P: R2DPlan, F: R2DFields, U0: EdgeParams, form?: FormField, opts: { overgrown?: number; fine?: boolean } = {}): TerrainMesh {
  const { c0, NA, edgeR } = P;
  let Rm = 0; for (let a = 0; a < NA; a++) Rm += edgeR[a]; Rm /= NA;
  // roll: 6 steps over the quarter circle (R2D: 3 = 30° per step, which made > 45° creases at outline corners, Q5)
  // + WALL rows: at form cliffs the rounding turns into a rock wall (height per angle); elsewhere a 0.4 band under the roll
  const NR = Math.max(44, Math.round(((44 * Rm) / 40) * (opts.fine ? 1.3 : 1))),   // fine: peaks / terraces (thin polar quads twisted over 45° near the centre)
    ROLL = 6, WALL = form && P.rollK ? 14 : 4, NECK = 4, NU = ROLL + WALL + NECK + 1, rows = NR + 1 + NU, footRow = NR + ROLL + WALL, rollRow = footRow + NECK, diveRow = rollRow + 1;
  // NECK rows (Lauf 03 N2/N6): built lying on the wall foot; ground.ts zipDive turns them into a soft neck from the foot of the
  // wall (or the end of the roll) into the body, so no strip hangs under the rim and cuts the body (Geister- / Messerlinie)
  const pos = new Float32Array(rows * NA * 3), wts = new Float32Array(rows * NA * 3), edgeY = new Float32Array(NA);
  let vi = 0;
  const put = (x: number, y: number, z: number, w: ArrayLike<number>) => { pos[vi * 3] = x; pos[vi * 3 + 1] = y; pos[vi * 3 + 2] = z; wts[vi * 3] = w[0]; wts[vi * 3 + 1] = w[1]; wts[vi * 3 + 2] = w[2]; vi++; };
  // moss on rock as clay patches (Lauf 03: no noise spray): 1 = rock, inside a patch the rock weight drops to the
  // grass map; old breaks carry more moss. Patch boundaries are S1 speckle in the shader.
  const mossCover = 1 - (opts.overgrown ?? 1);
  const moss = (along: number, y: number, k = 1) => 1 - k * Math.min(0.9, mossCover * 4.5) * sstep(0.08, 0.42, vnoise(along / 11, y / 6, P.seed + 57));   // wide: the S1 drops draw the patch edge (a narrow step made pixel edges)
  for (let i = 0; i <= NR; i++) {
    const t = 1 - Math.pow(1 - i / NR, 1.35);
    for (let a = 0; a < NA; a++) {
      const th = (a / NA) * Math.PI * 2, r = edgeR[a] * t, x = c0[0] + Math.cos(th) * r, z = c0[1] + Math.sin(th) * r, y = F.heightAt(x, z);
      if (i === NR) edgeY[a] = y;
      // rock shows where the ground is steep (crags, terrace risers): same rock speckle layer as R2D's rock channel
      const w = F.weightsAt(x, z), gx = F.heightAt(x + 0.8, z) - F.heightAt(x - 0.8, z), gz = F.heightAt(x, z + 0.8) - F.heightAt(x, z - 0.8), slope = Math.hypot(gx, gz) / 1.6;
      // Burgfels: at a cliff the rock reaches over the top edge (a band that wanders, with moss patches)
      const cwT = form ? form.cliffW(th) : 0, rimBand = cwT > 0 ? cwT * (1 - sstep(3 + 3 * vnoise(th * edgeR[a] / 9, 0.7, P.seed + 51), 9, edgeR[a] - r)) * moss(th * edgeR[a], y, 0.6) : 0;
      put(x, y, z, [w[0], w[1], Math.max(w[2], sstep(0.7, 1.25, slope), form ? form.rock(x, z) : 0, rimBand, (P as { riser?: (x: number, z: number) => number }).riser?.(x, z) ?? 0)]);
    }
  }
  // Kante (Georg 03.10.: kein Wulst, Gras bis zum Rand): Viertelkreis über die Kante, dann taucht ein Ring in den Körper
  const bodyEdgeY = new Float32Array(NA), rockK = opts.overgrown ?? 1;
  for (let j = 1; j <= NU; j++) for (let a = 0; a < NA; a++) {
    const th = (a / NA) * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th), eR = edgeR[a], eY = edgeY[a];
    // abutment niche: worked rock face down to the sole (RKIT's bench), same band as a cliff
    const nc = form ? form.niche(th) : { w: 0, soleY: 0 }, cw = Math.max(form ? form.cliffW(th) : 0, nc.w);   // no band without a cliff (zero-height rows, no faces; a thin band creased at tight bays)
    // Lauf 03 (Burgfels): at a cliff the rounding shrinks to a rock edge (no grass bulge, no overhang over the wall)
    const capH = lerp(U0.cap, Math.min(U0.cap, 1.6), cw), ov = lerp(U0.ov, Math.min(U0.ov, 0.5), cw);
    const wallH = Math.max(form ? form.wallH(th) : 0, nc.w * Math.max(0, eY - capH - nc.soleY));
    let r: number, y: number, rock = 0;
    if (j <= ROLL) { const ang = (j / ROLL) * Math.PI / 2; r = eR + ov * Math.sin(ang); y = eY - capH * (1 - Math.cos(ang)); rock = cw * sstep(0.1, 0.6, j / ROLL) * (nc.w > 0.5 ? 1 : moss(th * eR, y)); }
    else if (j <= ROLL + WALL + NECK) {
      // rock face: stands upright (slightly out at mid height, no undercut under the edge), big clay knobs ≈ 9 wide and
      // ≈ 6 tall, one ledge that wanders; smooth from row to row (vertex-frequency noise creased and folded the wall)
      const k = Math.min(1, (j - ROLL) / WALL), yy = wallH * k, env = Math.sin(k * Math.PI * 0.92 + 0.12) * Math.min(1, wallH / 12);   // low walls (fragments): smaller knobs and ledge
      const knob = cw * 1.3 * (vnoise((th * eR) / 10, yy / 7 + 1.3, P.seed + 5) - 0.5) * env;
      const ledge = cw * 0.9 * Math.min(1, wallH / 12) * sstep(0.3, 0.62, k + 0.12 * vnoise((th * eR) / 15, 2.2, P.seed + 6)) * (0.5 + 0.5 * vnoise((th * eR) / 20, 4.1, P.seed + 8));
      r = eR + ov - cw * wallH * 0.03 * k - ledge + knob; y = eY - capH - yy; rock = cw * (nc.w > 0.5 ? 1 : moss(th * eR, y));   // niche walls are worked rock: no moss   // upright, a little in towards the foot: no bulge
    } else { r = eR - 1.5; y = eY - capH - wallH - 1.0; rock = cw; }   // dive strip: same as the wall foot (it peeks out under knobs)
    if (j === ROLL + WALL) bodyEdgeY[a] = y + U0.cap;
    put(c0[0] + ct * r, y, c0[1] + st * r, [0, 0, rock]);
  }
  const idx: number[] = [];
  for (let k = 0; k < rows - 1; k++) for (let a = 0; a < NA; a++) {
    const a1 = (a + 1) % NA, v00 = k * NA + a, v01 = k * NA + a1, v10 = (k + 1) * NA + a, v11 = (k + 1) * NA + a1;
    if (k === 0) { idx.push(v00, v10, v11); continue; }   // ring 0 is the centre point repeated: fan, no zero-area quads
    idx.push(v00, v10, v11, v00, v11, v01);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  // Q5 safety on the top (Lauf 03): peaks and terrace risers can crease thin polar quads over 45° in a few spots; ease
  // only the heights of vertices at edges over 40°, rows inside the rim (rim ring, roll and wall stay exact)
  relaxTop(pos, g.index!.array as ArrayLike<number>, NA, NR - 1, 40);
  g.attributes.position.needsUpdate = true; g.computeVertexNormals();
  if (g.attributes.normal.getY(NA * 5) < 0) {
    const ix = g.index!.array as Uint32Array | Uint16Array;
    for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
    g.index!.needsUpdate = true; g.computeVertexNormals();
  }
  // top surface normals from the height field (central differences), not from the polar net: the long thin quads
  // shaded as faint diagonal stripes (Lauf 03 N4); blended into the mesh normals over the last 3 rows before the rim
  {
    const nrm0 = g.attributes.normal as THREE.BufferAttribute, e = 0.35;
    for (let i = 0; i <= NR; i++) {
      const w = Math.min(1, (NR - i) / 3);
      if (w <= 0) continue;
      for (let a = 0; a < NA; a++) {
        const o = i * NA + a, x = pos[o * 3], z = pos[o * 3 + 2];
        let nx = -(F.heightAt(x + e, z) - F.heightAt(x - e, z)) / (2 * e), ny = 1, nz = -(F.heightAt(x, z + e) - F.heightAt(x, z - e)) / (2 * e);
        const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
        const mx = lerp(nrm0.getX(o), nx, w), my = lerp(nrm0.getY(o), ny, w), mz = lerp(nrm0.getZ(o), nz, w), m = Math.hypot(mx, my, mz) || 1;
        nrm0.setXYZ(o, mx / m, my / m, mz / m);
      }
    }
    nrm0.needsUpdate = true;
  }
  // the last roll ring is vertical (φ = 90°): its normal is the horizontal outward normal of the ring. The dive ring's
  // faces would tilt it down/in; set it exactly so the Scholle (same ring, same normal) continues without a shading step.
  const rimN = new Float32Array(NA * 2), nrm = g.attributes.normal as THREE.BufferAttribute, rr = rollRow;
  for (let a = 0; a < NA; a++) {
    const p = (rr * NA + ((a + 1) % NA)) * 3, q = (rr * NA + ((a - 1 + NA) % NA)) * 3;
    let nx = pos[p + 2] - pos[q + 2], nz = -(pos[p] - pos[q]);
    const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
    const vx = pos[(rr * NA + a) * 3] - c0[0], vz = pos[(rr * NA + a) * 3 + 2] - c0[1];
    if (nx * vx + nz * vz < 0) { nx = -nx; nz = -nz; }
    rimN[a * 2] = nx; rimN[a * 2 + 1] = nz;
    for (const row of [rr, rr + 1]) nrm.setXYZ(row * NA + a, nx, 0, nz);
  }
  nrm.needsUpdate = true;
  let mx = Infinity, Mx = -Infinity, mz = Infinity, Mz = -Infinity;
  for (let i = 0; i < vi; i++) { const x = pos[i * 3], z = pos[i * 3 + 2]; if (x < mx) mx = x; if (x > Mx) Mx = x; if (z < mz) mz = z; if (z > Mz) Mz = z; }
  const W = Math.max(Mx - mx, Mz - mz) + 2, box = { minX: mx - 1, minZ: mz - 1, W }, uv = new Float32Array(vi * 2);
  for (let i = 0; i < vi; i++) { uv[i * 2] = (pos[i * 3] - box.minX) / W; uv[i * 2 + 1] = (pos[i * 3 + 2] - box.minZ) / W; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('aTW', new THREE.BufferAttribute(wts, 3));
  // received shadow weight: full on the top, fading out over the roll (see top-material rollShadow)
  const shk = new Float32Array(vi);
  for (let i = 0; i < vi; i++) { const row = Math.floor(i / NA); shk[i] = row <= NR ? 1 : 1 - sstep(0.15, 0.85, (row - NR) / ROLL); }
  g.setAttribute('aShK', new THREE.BufferAttribute(shk, 1));
  g.computeBoundingBox(); g.computeBoundingSphere();
  return { geo: g, box, edgeY, NR, NA, rows, rimN, footRow, rollRow, diveRow, bodyEdgeY };
}

/** height-only relaxation of the top net where neighbouring faces meet at more than `limitDeg` (rows 1…maxRow) */
function relaxTop(pos: Float32Array, idx: ArrayLike<number>, NA: number, maxRow: number, limitDeg: number) {
  const cosL = Math.cos((limitDeg * Math.PI) / 180), lim = (maxRow + 1) * NA, nT = idx.length / 3, fn = new Float32Array(nT * 3);
  const nb = (v: number) => { const r = Math.floor(v / NA), a = v % NA; return [(r - 1) * NA + a, (r + 1) * NA + a, r * NA + ((a + 1) % NA), r * NA + ((a - 1 + NA) % NA)]; };
  for (let round = 0; round < 40; round++) {
    for (let t = 0; t < nT; t++) {
      const a = idx[t * 3] * 3, b = idx[t * 3 + 1] * 3, c = idx[t * 3 + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1;
      fn[t * 3] = nx / l; fn[t * 3 + 1] = ny / l; fn[t * 3 + 2] = nz / l;
    }
    const edge = new Map<number, number>(), flag = new Set<number>();
    for (let t = 0; t < nT; t++) for (let e = 0; e < 3; e++) {
      const a = idx[t * 3 + e], b = idx[t * 3 + ((e + 1) % 3)];
      if (a >= lim && b >= lim) continue;
      const k = a < b ? a * 4194304 + b : b * 4194304 + a, o = edge.get(k);
      if (o === undefined) { edge.set(k, t); continue; }
      if (fn[o * 3] * fn[t * 3] + fn[o * 3 + 1] * fn[t * 3 + 1] + fn[o * 3 + 2] * fn[t * 3 + 2] < cosL)
        for (const f of [o, t]) for (let q = 0; q < 3; q++) { const v = idx[f * 3 + q]; if (v >= NA && v < lim) flag.add(v); }
    }
    if (!flag.size) return round;
    const y0 = Float32Array.from(flag, (v) => pos[v * 3 + 1]);
    let i = 0;
    for (const v of flag) { let s = 0; const N = nb(v); for (const j of N) s += pos[j * 3 + 1]; pos[v * 3 + 1] = y0[i++] + 0.5 * (s / 4 - y0[i - 1]); }
  }
  return 40;
}

/**
 * Neck weight per angle (Lauf 03 N2 structural seam): 1 where no wall stands under the roll (the top net's neck runs from
 * the roll end), 0 under a wall (the seam continues the wall). From the wall height, eased over ≈ ±10 angles so wall
 * starts never twist neighbouring columns. One function for both meshes (Scholle seam ring, top net neck).
 */
export function neckWeights(T: TerrainMesh): Float32Array {
  const P = T.geo.attributes.position as THREE.BufferAttribute, NA = T.NA, w = new Float32Array(NA);
  if (T.geo.userData.neckW) return T.geo.userData.neckW as Float32Array;
  for (let a = 0; a < NA; a++) {
    const e = (T.NR + 6) * NA + a, f = T.footRow * NA + a;
    w[a] = 1 - sstep(0.3, 2.0, Math.hypot(P.getX(e) - P.getX(f), P.getY(e) - P.getY(f), P.getZ(e) - P.getZ(f)));
  }
  let o = w;
  for (let it = 0; it < 12; it++) { const n = new Float32Array(NA); for (let a = 0; a < NA; a++) n[a] = (o[(a + NA - 1) % NA] + 2 * o[a] + o[(a + 1) % NA]) / 4; o = n; }
  for (let a = 0; a < NA; a++) o[a] = Math.min(o[a], w[a] + 0.35);   // easing never lays a long neck over a real wall
  T.geo.userData.neckW = o;
  return o;
}
