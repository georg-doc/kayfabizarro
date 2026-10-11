// R2D ground of one island: top surface + rim roll (one mesh, colour map + S1 speckle) and Scholle v7 (one mesh, grass
// → earth speckle). Budget: 2 terrain draw calls per island (plan §6). Plus R2D v0's pond sheet and RKIT's road preview.
import * as THREE from 'three';
import { claySeed, clayMaterial } from '../../clay';
import { r2dPal, roleColor } from '../../palettes';
import type { IslandSpec } from '../spec';
import { buildRoadPreview } from '../roadbed';
import type { R2DIslandField } from './field';
import { buildTerrainMesh, neckWeights, type TerrainMesh } from './terrain-mesh';
import { paintMaps, type IslandMaps } from './maps';
import { patchSpeckle, patchScholle } from './top-material';
import { buildScholle, type ScholleInfo } from './scholle';
import { vnoise, sstep } from './math';
import { buildRelics } from './relics';
import { cavityAO, horizonAO } from './ao';
import type { P2 } from './math';

export interface R2DGround {
  meshes: THREE.Mesh[];
  terrain: TerrainMesh;
  maps: IslandMaps;
  scholle: ScholleInfo;
  ms: { terrain: number; maps: number; scholle: number };
  dispose(): void;
}

export function buildR2DGround(f: R2DIslandField, spec: IslandSpec): R2DGround {
  const pal = r2dPal(spec.palette), edge = f.edge, t0 = performance.now();
  const T = buildTerrainMesh(f.plan, f.F, edge, f.plan.form, { overgrown: spec.form?.breakAge === 'fresh' ? 1 : 0.8, fine: !!(spec.form?.crags?.length || spec.form?.terraces) });
  const t1 = performance.now();
  const N = T.box.W > 160 ? 2048 : 1024;   // Town (Ø ≈ 256): keep ≈ 0.13 units per texel like R2D's 1024 over Ø ≈ 90
  const roadPolys: P2[][] = f.road ? f.road.spec.mask.map((poly) => poly.map((p) => [p[0], p[2]] as P2)) : [];
  const maps = paintMaps(f.plan, pal, T.box, N, roadPolys, 1 + 2.5 * f.edge.k);
  const t2 = performance.now();
  const S = buildScholle(f.plan, T, edge, spec.form?.scholle ?? f.biomeRow.scholle, { soft: Number(new URLSearchParams(location.search).get('scholleSoft') ?? 2), seed: spec.form?.scholleSeed ?? (Number(new URLSearchParams(location.search).get('scholleSeed')) || undefined), style: spec.form?.undersideStyle, cliffW: (th: number) => Math.max(f.plan.form.cliffW(th), f.plan.form.niche(th).w), niche: f.plan.form.niche, rim0: (th: number) => f.plan.rAt0(th) + Math.min(edge.ov, 0.5) });
  softenBreakBand(S.geo, T, f.plan.c0, S.info.Dprofile ?? S.info.D);
  buildNeck(T, S.geo);
  // baked occlusion (Lauf 03 Punkt 4): horizon on the top net (terrace feet, crags, castle rock) × cavity; cavity on the body
  {
    // top: horizon only (the cavity read the irregular polar net); roll and wall rows keep a little cavity
    const hz = horizonAO(T.geo, T.NA, T.NR + 1), cv = cavityAO(T.geo, 0.2), ao = new Float32Array(hz.length), lim = (T.NR + 1) * T.NA;
    for (let i = 0; i < ao.length; i++) ao[i] = i < lim ? hz[i] : hz[i] * cv[i];

    T.geo.setAttribute('aAO', new THREE.BufferAttribute(ao, 1));
    const sa = cavityAO(S.geo, 0.34), gw = S.geo.getAttribute('aGW') as THREE.BufferAttribute;
    for (let i = 0; i < sa.length; i++) sa[i] = 1 - (1 - sa[i]) * Math.max(0, 1 - 1.5 * gw.getX(i));   // none in the grass band under the roll (it drew a dark line there)
    S.geo.setAttribute('aAO', new THREE.BufferAttribute(sa, 1));
    // seam: the top net's neck eases its AO from the roll end's into the body's at the shared ring (no AO step at the seam)
    const st = S.geo.userData.seamStart as number, end = T.NR + 6, rows = T.diveRow - end;
    for (let a = 0; a < T.NA; a++) { const a0 = ao[end * T.NA + a], a1 = sa[st + a]; for (let j = 1; j <= rows; j++) { const t = j / rows; ao[(end + j) * T.NA + a] = a0 + (a1 - a0) * t * t * (3 - 2 * t); } }
  }
  const t3 = performance.now();

  // R2D terrain: no tool taps (thumb and smear fans aliased into checker patterns in close-ups, Lauf 03 N4); strokes and grain stay
  const TERRAIN_TOOLS = { tools: {} };
  const topMat = patchSpeckle(clayMaterial('terrain', new THREE.MeshStandardMaterial({ map: maps.world }), TERRAIN_TOOLS), pal, 'top', undefined, spec.seed);
  const top = new THREE.Mesh(claySeed(T.geo, 7), topMat);
  top.name = 'ground';
  // Scholle grass colour per vertex = colour map at the rim point of the same angle (no step at the roll → body joint)
  {
    const SP = S.geo.attributes.position as THREE.BufferAttribute, gc = new Float32Array(SP.count * 3), col = new THREE.Color(), { c0, NA, edgeR } = f.plan;
    for (let i = 0; i < SP.count; i++) {
      const th = Math.atan2(SP.getZ(i) - c0[1], SP.getX(i) - c0[0]), fa = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, a = Math.floor(fa) % NA;
      const r = edgeR[a] + edge.ov * 0.7, x = c0[0] + Math.cos(th) * r, z = c0[1] + Math.sin(th) * r;   // the roll / neck colour at this angle
      const pi = Math.min(N - 1, Math.max(0, Math.floor(((x - T.box.minX) / T.box.W) * N))), pj = Math.min(N - 1, Math.max(0, Math.floor(((z - T.box.minZ) / T.box.W) * N))), o = (pj * N + pi) * 4;
      col.setRGB(maps.worldData[o] / 255, maps.worldData[o + 1] / 255, maps.worldData[o + 2] / 255, THREE.SRGBColorSpace);
      gc[i * 3] = col.r; gc[i * 3 + 1] = col.g; gc[i * 3 + 2] = col.b;
    }
    S.geo.setAttribute('aGC', new THREE.BufferAttribute(gc, 3));
  }
  const strata = (spec.form?.strata ?? ['earth.1', 'earth.2', 'earth.2']).map((r) => roleColor(spec.palette, r)) as [string, string, string];
  const bodyMat = patchScholle(clayMaterial('terrain', new THREE.MeshStandardMaterial({ color: strata[0] }), TERRAIN_TOOLS), pal, strata, roleColor(spec.palette, 'stone.1'), undefined, spec.seed);   // body grass = the map at the rim point of the same angle (aGC): under an undercut body the vertex's own x/z lies inside the island, on the top's patches
  const body = new THREE.Mesh(claySeed(S.geo, 7), bodyMat);   // same clay seed as the top: the relief runs on over the joint (Lauf 03 N2 line)
  body.name = 'under';
  for (const m of [top, body]) { m.castShadow = m.receiveShadow = true; m.userData.islandId = spec.id; m.userData.r2d = true; }
  // the body does not receive the rounding's shadow: its hard shadow-map edge drew a straight line along the joint (Lauf 03
  // N2); the body faces away from the key light anyway, its shade comes from its normals and the baked cavity
  body.receiveShadow = false;
  // nor does it cast: its tucked top ring (0.4 above the last roll ring) threw a thin dark strip onto the rounding
  body.castShadow = false;
  const meshes: THREE.Mesh[] = [top, body];
  const rg = buildRelics(spec, f.plan, T, S.geo);
  if (rg) {
    const rm = new THREE.Mesh(claySeed(rg.geo, 13), clayMaterial('model', new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide })));
    rm.name = 'relics'; rm.castShadow = rm.receiveShadow = true; rm.userData.islandId = spec.id; rm.userData.relics = true; rm.userData.relicParts = rg.parts;
    meshes.push(rm);
  }

  // pond: R2D v0 sheet (level = pond.h − 0.32, wobbly circle r + 0.9) until fluid.js F0–F1 is ported
  const pd = f.plan.pond;
  if (pd) {
    const wg = new THREE.CircleGeometry(pd.r + 0.9, 64);
    wg.rotateX(-Math.PI / 2);
    const pa = wg.attributes.position as THREE.BufferAttribute;
    for (let i = 1; i < pa.count; i++) { const x = pa.getX(i), z = pa.getZ(i), a = Math.atan2(z, x), k = 1 + 0.08 * vnoise(Math.cos(a) * 2, Math.sin(a) * 2, spec.seed + 71); pa.setXYZ(i, x * k, 0, z * k); }
    wg.translate(pd.x, pd.h - 0.32, pd.z);
    const wsheet = new THREE.BufferGeometry().copy(wg); wg.dispose();   // a deformed sheet, not a test primitive (Q7)
    const wm = clayMaterial('water', new THREE.MeshStandardMaterial({ color: pal.water, roughness: 0.3 }));
    const water = new THREE.Mesh(claySeed(wsheet, 909), wm);
    water.name = 'water'; water.receiveShadow = true;
    meshes.push(water);
  }
  if (f.road) {
    const rp = new THREE.Mesh(buildRoadPreview(f.road.spec, [roleColor(spec.palette, 'asphalt.1'), roleColor(spec.palette, 'asphalt.2')], (x, z) => f.plan.sdf(x, z) < -f.edge.cap, roleColor(spec.palette, 'sand.1')), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    // a skin 2 mm over the ground: polygon offset so the terrain under it never wins the depth test (diagonal stripes of
    // terrain colour through the asphalt at distance); it receives shadows but casts none
    rp.name = 'road-preview'; rp.receiveShadow = true; rp.castShadow = false;
    meshes.push(rp);
  }
  return {
    meshes, terrain: T, maps, scholle: S.info, ms: { terrain: +(t1 - t0).toFixed(0), maps: +(t2 - t1).toFixed(0), scholle: +(t3 - t2).toFixed(0) },
    dispose() { maps.world.dispose(); maps.mask.dispose(); topMat.dispose(); bodyMat.dispose(); },
  };
}

/**
 * Lauf 03 protopia N6 (Messerlinie Fels/Erde): under the rim the body's steep break band turns into the underside at a
 * ≈ 30° crease that runs straight along the rim; lit from the side it read as a knife cut (and a second hairline one ring
 * lower). The positions stay (v7 facets, Q-measured); only the shading normals of the upper band are eased over their
 * neighbours, fading out ≈ 0.45 D under the rim so the facets of the lower body and the spikes keep their edges.
 */
function softenBreakBand(geo: THREE.BufferGeometry, T: TerrainMesh, c0: P2, D: number) {
  const P = geo.attributes.position as THREE.BufferAttribute, N = geo.attributes.normal as THREE.BufferAttribute, ix = geo.index!, n = P.count;
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const th = Math.atan2(P.getZ(i) - c0[1], P.getX(i) - c0[0]), a = Math.floor((((th / (Math.PI * 2)) % 1) + 1) % 1 * T.NA) % T.NA;
    w[i] = 1 - sstep(0.25 * D, 0.45 * D, T.bodyEdgeY[a] - P.getY(i));
  }
  const nb = Array.from({ length: n }, () => new Set<number>());
  for (let t = 0; t < ix.count; t += 3) { const a = ix.getX(t), b = ix.getX(t + 1), c = ix.getX(t + 2); nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b); }
  for (let it = 0; it < 6; it++) {
    const o = (N.array as Float32Array).slice();
    for (let i = 0; i < n; i++) {
      if (w[i] <= 0) continue;
      let x = o[i * 3] * 2, y = o[i * 3 + 1] * 2, z = o[i * 3 + 2] * 2;
      for (const j of nb[i]) { x += o[j * 3]; y += o[j * 3 + 1]; z += o[j * 3 + 2]; }
      const l = Math.hypot(x, y, z) || 1, k = w[i];
      x = o[i * 3] * (1 - k) + (x / l) * k; y = o[i * 3 + 1] * (1 - k) + (y / l) * k; z = o[i * 3 + 2] * (1 - k) + (z / l) * k;
      const m = Math.hypot(x, y, z) || 1; N.setXYZ(i, x / m, y / m, z / m);
    }
  }
  N.needsUpdate = true;
}

/**
 * Lauf 03 N2 (Geisterlinie), structural fix: one seam ring K, generated once in the Scholle (its ring 0, `seamStart`).
 * The top net's last row (dive) is laid on exactly these points with the body's normals there, and the rows before it
 * form a soft S-neck onto them: from the end of the roll (no wall: the collapsed wall rows + the NECK rows) or from the
 * foot of a wall (NECK rows), leaving downwards and arriving along the body; normals eased from the rim's into the body's.
 * The two necks are blended by the wall height, so neighbouring angles never twist. Same positions, normals, AO (see the
 * AO block) and colour source (the map at the same x/z) on both sides; no strip under the lip, no overlap.
 */
function buildNeck(T: TerrainMesh, body: THREE.BufferGeometry) {
  const P = T.geo.attributes.position as THREE.BufferAttribute, NR = T.geo.attributes.normal as THREE.BufferAttribute, NA = T.NA;
  const BP = body.attributes.position as THREE.BufferAttribute, BN = body.attributes.normal as THREE.BufferAttribute, st = body.userData.seamStart as number;
  const end = T.NR + 6, foot = T.footRow, rows = T.diveRow - end, nk = T.diveRow - foot;
  const neck = new Float32Array(NA), ease = (t: number) => t * t * (3 - 2 * t), NW = neckWeights(T);
  const cubic = (E: THREE.Vector3, H: THREE.Vector3, nH: THREE.Vector3, t: number, out: THREE.Vector3) => {
    // arrive along the bisector of the chord E → H and the body's downward tangent at H: under a strongly undercut body
    // that tangent points outwards and the neck overshot past H and folded back (Q5 folds)
    const k = 0.4 * E.distanceTo(H), down = new THREE.Vector3(0, -1, 0).addScaledVector(nH, nH.y).normalize();
    const arr = H.clone().sub(E).normalize().add(down).normalize();
    const C1 = E.clone().setY(E.y - k), C2 = H.clone().addScaledVector(arr, -k), u = 1 - t;
    return out.copy(E).multiplyScalar(u * u * u).addScaledVector(C1, 3 * u * u * t).addScaledVector(C2, 3 * u * t * t).addScaledVector(H, t * t * t);
  };
  const A = new THREE.Vector3(), B = new THREE.Vector3(), nE = new THREE.Vector3(), nF = new THREE.Vector3(), nA = new THREE.Vector3(), nB = new THREE.Vector3();
  for (let a = 0; a < NA; a++) {
    const H = new THREE.Vector3().fromBufferAttribute(BP, st + a), nH = new THREE.Vector3().fromBufferAttribute(BN, st + a).normalize();
    const E = new THREE.Vector3().fromBufferAttribute(P, end * NA + a), F = new THREE.Vector3().fromBufferAttribute(P, foot * NA + a);
    nE.fromBufferAttribute(NR, end * NA + a); nF.fromBufferAttribute(NR, foot * NA + a); if (nF.lengthSq() < 0.5) nF.copy(nE);
    const s = NW[a];
    neck[a] = s;
    for (let j = 1; j <= rows; j++) {
      const row = end + j, i = row * NA + a, tl = j / rows;
      cubic(E, H, nH, tl, A); nA.copy(nE).lerp(nH, ease(tl)).normalize();
      if (row <= foot) { B.fromBufferAttribute(P, i); nB.fromBufferAttribute(NR, i); if (nB.lengthSq() < 0.5) nB.copy(nA); }   // wall row as built
      else { const ts = (row - foot) / nk; cubic(F, H, nH, ts, B); nB.copy(nF).lerp(nH, ease(ts)).normalize(); }   // short neck under the wall
      B.lerp(A, s); nB.lerp(nA, s).normalize();
      if (j === rows) { B.copy(H); nB.copy(nH); }   // the dive row IS the seam ring
      P.setXYZ(i, B.x, B.y, B.z); NR.setXYZ(i, nB.x, nB.y, nB.z);
    }
  }
  T.geo.userData.neck = neck;
  P.needsUpdate = NR.needsUpdate = true;
  T.geo.computeBoundingSphere(); T.geo.computeBoundingBox();
}
