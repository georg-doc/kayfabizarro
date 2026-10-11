// Stufe 1 measurements on the built scene (STAGE1_R2D_PORT_PLAN §6, QA_CRITIC_PROTOCOL_R1 §1b). Everything here is a
// number from the meshes / fields, never a judgement by eye. Called through window.__kfb.qcheck() by tools/stage1/qcheck.mjs.
import * as THREE from 'three';
import type { Island } from '../island';
import type { IslandField } from '../terrain';
import type { R2DGround } from './ground';

/** what the geometry checks need: islands and their fragments alike */
export interface QAIsland { group: THREE.Object3D; field: IslandField; r2d: R2DGround | null }
/** island meshes are 'ground' / 'under', fragment meshes 'fragment-ground' / 'fragment-under' */
const meshOf = (isl: QAIsland, n: string) => (isl.group.getObjectByName(n) ?? isl.group.getObjectByName('fragment-' + n)) as THREE.Mesh;
import { R2DIslandField } from './field';
import { measureRoadBed, type RoadBedSpec } from '../roadbed';
import { H } from '../../environment/kits';

const r3 = (v: number) => +v.toFixed(3);

/** T1 = terrain triangles above road / kerb / walk (RKIT surface); T2 = terrain at hw vs the top edge + seam gap */
export function roadCheck(isl: Island) {
  const f = isl.field, rb = isl.roadSpec as RoadBedSpec | null;
  if (!(f instanceof R2DIslandField) || !rb) return null;
  const top = isl.group.getObjectByName('ground') as THREE.Mesh;
  const T1 = measureRoadBed(rb, top.geometry, []).T1;
  // T2a: at the outer support point (key 6, parapet out) the terrain stays ≥ 0.05 below the cross-section's top edge
  let minBelowTop = Infinity, n2a = 0;
  for (const r of rb.roads) for (const S of r.sections) for (const side of [S.L, S.R]) {
    const p = side[side.length - 1];
    if (f.sd(p[0], p[2]) <= 0) continue;   // bridge part outside the island
    const top6 = Math.max(...side.slice(4).map((q) => q[1]));
    minBelowTop = Math.min(minBelowTop, top6 - f.height(p[0], p[2])); n2a++;
  }
  // T2b: RKIT's slope band ends at the seam foot p; terrain below p = gap the road body's skirt (≥ 0.3) must cover
  let maxGap = -Infinity, n2b = 0, over03 = 0;
  for (const r of rb.roads) for (const side of [r.seam.L, r.seam.R]) for (const q of side) {
    if (f.sd(q.p[0], q.p[2]) <= 0) continue;
    const gap = q.p[1] - f.height(q.p[0], q.p[2]);
    maxGap = Math.max(maxGap, gap); n2b++; if (gap > 0.3) over03++;
  }
  return {
    T1: { ...T1, pass: T1.aboveRoadKerbWalk === 0 },
    T2: { terrainBelowTopEdgeMin: r3(minBelowTop), points: n2a, seamFootGapMax: r3(maxGap), seamPoints: n2b, seamGapOver03: over03, pass: minBelowTop >= 0.05 && over03 === 0 },
  };
}

/** hard rules Stufe 1 that live in the geometry: rim roll, Scholle, budget */
export function hardRules(isl: QAIsland) {
  const f = isl.field, g = isl.r2d;
  if (!(f instanceof R2DIslandField) || !g) return null;
  const T = g.terrain, top = meshOf(isl, 'ground').geometry, body = meshOf(isl, 'under').geometry;
  const tp = top.attributes.position as THREE.BufferAttribute, tn = top.attributes.normal as THREE.BufferAttribute;
  const bp = body.attributes.position as THREE.BufferAttribute, bn = body.attributes.normal as THREE.BufferAttribute;
  const pinned: boolean[] = body.userData.pinned ?? [];
  // seam (Lauf 03 N2 structural fix): the body's ring 0 lies ON the top net's last row; every seam vertex of the top net
  // has a body vertex at the same place (gap ≈ 0) with the same normal
  const ft = T.diveRow;   // the top net's last row = the seam ring K
  const pinIdx: number[] = []; for (let i = 0; i < bp.count; i++) if (pinned[i]) pinIdx.push(i);
  let minTuck = Infinity, maxTuck = -Infinity, pinnedN = 0, seamGap = 0, seamNormal = 0;
  const v = new THREE.Vector3(), w = new THREE.Vector3(), c0 = f.plan.c0;
  for (let a = 0; a < T.NA; a++) {
    v.fromBufferAttribute(tp, ft * T.NA + a);
    const th = Math.atan2(v.z - c0[1], v.x - c0[0]);
    if ((f as R2DIslandField).plan?.form?.niche?.(th).w > 0.3) continue;   // abutment niche: the body runs out under the sole (RKIT bench)
    const st0 = body.userData.seamStart as number | undefined;
    if (st0 !== undefined) { const bi2 = st0 + a; pinnedN++; seamGap = Math.max(seamGap, w.fromBufferAttribute(bp, bi2).distanceTo(v)); seamNormal = Math.max(seamNormal, THREE.MathUtils.radToDeg(w.fromBufferAttribute(bn, bi2).angleTo(v.fromBufferAttribute(tn, ft * T.NA + a)))); continue; }
    let bd = Infinity, bi = -1; for (const i of pinIdx) { const d = w.fromBufferAttribute(bp, i).distanceTo(v); if (d < bd) { bd = d; bi = i; } }
    pinnedN++; seamGap = Math.max(seamGap, bd);
    if (bi >= 0) seamNormal = Math.max(seamNormal, THREE.MathUtils.radToDeg(w.fromBufferAttribute(bn, bi).angleTo(v.fromBufferAttribute(tn, ft * T.NA + a))));
  }
  minTuck = -seamGap; maxTuck = seamGap;
  void minTuck; void maxTuck;
  const gap = seamGap;
  // top view "no bright ring": no roll vertex lies higher than the edge ring it starts from
  let rollUp = 0;
  for (let a = 0; a < T.NA; a++) for (let row = T.NR + 1; row <= T.rollRow; row++) rollUp = Math.max(rollUp, tp.getY(row * T.NA + a) - T.edgeY[a]);
  const S = g.scholle;
  const calls = isl.group.children.filter((o) => (o as THREE.Mesh).isMesh && o.userData.r2d).length;
  return {
    edge: { cap: +f.edge.cap.toFixed(2), ov: +f.edge.ov.toFixed(2), k: +f.edge.k.toFixed(2), quarterCircle: true, scholleTuckMin: r3(minTuck), scholleTuckMax: r3(maxTuck), scholleOutsideRoll: r3(gap), pinnedVerts: pinnedN, rollAboveEdge: r3(rollUp),
      note: 'Gemeinsame Fuge: Scholle-Oberring = letzte Reihe des Oberseiten-Netzes (Lücke < 0,01, Normalen < 5°)', seamGapMax: r3(seamGap), seamNormalDegMax: r3(seamNormal), pass: seamGap < 0.01 && seamNormal < 5 && rollUp <= 1e-6 },
    scholle: { preset: S.preset, style: S.style, knobs: S.knobs, apexToMassCentroid: S.apexOff, massCentroidShift: r3(Math.hypot(S.massCentroid[0] - S.centroid[0], S.massCentroid[1] - S.centroid[1])), spikes: S.spikesDown, spikesPlanned: S.zack, spikeTiltDegMax: S.spikeTiltDeg, depthRatio: S.ratio, ringCV: S.ringCV,
      note: 'Spitze unter dem Massenschwerpunkt (Steuerung 10.10.); spikes = Zapfen ≥ 0,05 D, knobs = kleine Knubbel; broken: Winkel bis 20°; ringCV > 0,02 = folgt dem Umriss', pass: S.apexOff <= 2 && S.spikesDown >= 2 && S.spikesDown <= 6 && S.spikeTiltDeg <= (S.style === 'broken' ? 20 : 10) && S.ringCV > 0.02 },
    budget: { terrainMeshes: calls, pass: calls <= 2 },
    star: f.plan.star,
  };
}

/** Q1 nothing floats / Q3 no penetration for every placed object (buildings, placeholder, residents, nature instances) */
export function contactCheck(isl: Island) {
  const f = isl.field, out: { id: string; kind: string; minGap: number; maxSink: number }[] = [];
  isl.group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(isl.group.matrixWorld).invert();
  const probe = (o: THREE.Object3D, id: string, kind: string) => {
    // lowest vertices of the object in island space: compare with the terrain under each of them
    const pts: THREE.Vector3[] = [];
    o.traverse((m) => {
      const mm = m as THREE.Mesh;
      if (!mm.isMesh || mm.name === 'placeholder-label') return;
      const p = mm.geometry.attributes.position as THREE.BufferAttribute, M = new THREE.Matrix4().multiplyMatrices(inv, mm.matrixWorld);
      const step = Math.max(1, Math.floor(p.count / 4000));
      for (let i = 0; i < p.count; i += step) pts.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(M));
    });
    if (!pts.length) return;
    const yMin = Math.min(...pts.map((q) => q.y)), foot = pts.filter((q) => q.y < yMin + 0.15 * H);
    let minGap = Infinity, maxSink = 0;
    for (const q of foot) { const g = q.y - f.height(q.x, q.z); minGap = Math.min(minGap, g); maxSink = Math.max(maxSink, -g); }
    out.push({ id, kind, minGap: r3(minGap), maxSink: r3(maxSink) });
  };
  for (const [id, o] of isl.buildingObjs) probe(o, id, o.userData.asset === 'proc:placeholder-castle' ? 'placeholder' : 'building');
  for (const [id, o] of isl.anchorObjs) probe(o, id, 'placeholder');
  isl.group.traverse((o) => { if (o.userData?.residentId) probe(o, o.userData.residentId, 'resident'); });
  // Lauf 03 (HIGH 3): relic parts and rubble re-measured against the real surface: a ray from outside along −n must meet
  // the body where the part was set in; minGap = surface offset − set-in depth (≤ 0: held by the body)
  const body = ['ground', 'under'].map((n) => isl.group.getObjectByName(n)).filter(Boolean) as THREE.Mesh[];
  const rel = isl.group.getObjectByName('relics') as THREE.Mesh | undefined, rparts = (rel?.userData.relicParts ?? []) as { kind: string; p: number[]; n: number[]; size: number; embed: number }[];
  const ray = new THREE.Raycaster(), M = isl.group.matrixWorld, R3 = new THREE.Matrix3().getNormalMatrix(M);
  rparts.forEach((rp, k) => {
    const p = new THREE.Vector3(...rp.p).applyMatrix4(M), n = new THREE.Vector3(...rp.n).applyMatrix3(R3).normalize(), lift = rp.size + 6;
    ray.set(p.clone().addScaledVector(n, lift), n.clone().negate()); ray.far = lift + 40;
    const hit = ray.intersectObjects(body, false)[0], off = hit ? hit.distance - lift : 99;
    out.push({ id: `relic:${rp.kind}#${k}`, kind: 'relic', minGap: r3(off - rp.embed), maxSink: r3(rp.embed - off) });
  });
  // fragments float on purpose: measured as clearance to the island (a near-touch reads as a glitch, ≥ 1.5)
  const fr = isl.fragments;
  if (fr && body.length) {
    const pts = (o: THREE.Object3D, every: number) => { const a: THREE.Vector3[] = []; o.traverse((m) => { const mm = m as THREE.Mesh; if (!mm.isMesh) return; const pp = mm.geometry.attributes.position; for (let i = 0; i < pp.count; i += every) a.push(new THREE.Vector3().fromBufferAttribute(pp as THREE.BufferAttribute, i).applyMatrix4(mm.matrixWorld)); }); return a; };
    const island = body.flatMap((m) => pts(m, 5));
    fr.subs.forEach((s, k) => {
      const fp = pts(s, 3), bb = new THREE.Box3().setFromPoints(fp).expandByScalar(30), near = island.filter((q) => bb.containsPoint(q));
      let g = Infinity; for (const a of fp) for (const b of near) { const d = a.distanceToSquared(b); if (d < g) g = d; }
      out.push({ id: 'fragment:' + fr.specs[k].id, kind: 'fragment', minGap: r3(Math.sqrt(g)), maxSink: 0 });
    });
  }
  return out;
}

/** Q5: sharp edges on the visible terrain bodies (top + roll, Scholle): dihedral angle between neighbouring faces.
 *  Hidden parts are left out (dive ring inside the body, the body's tucked top ring behind the roll). */
export function sharpEdges(isl: QAIsland, minDeg = 45) {
  const out: Record<string, { edges: number; sharp: number; sharpLong: number; folds: number; maxDeg: number; longestSharp: number }> = {};
  const g = isl.r2d;
  if (!g) return out;
  for (const name of ['ground', 'under']) {
    const geo = meshOf(isl, name).geometry, P = geo.attributes.position as THREE.BufferAttribute, ix = geo.index!;
    const roadQ = (isl.field as R2DIslandField).roadQ;
    const pinned: boolean[] | undefined = geo.userData.pinned, hidden = (_v: number) => false;   // shared seam: nothing of either body is tucked away any more (Lauf 03 N2 structural fix)   // shared seam: the body's top band is visible now (nothing tucked behind the roll)
    const fn: THREE.Vector3[] = [], faceHidden: boolean[] = [], A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
    const edges = new Map<string, number[]>();
    for (let t = 0; t < ix.count / 3; t++) {
      const a = ix.getX(t * 3), b = ix.getX(t * 3 + 1), c = ix.getX(t * 3 + 2);
      A.fromBufferAttribute(P, a); B.fromBufferAttribute(P, b); C.fromBufferAttribute(P, c);
      const n = B.clone().sub(A).cross(C.clone().sub(A));
      // a stitch sliver (the seam ring zipped to the body's stand-in ring: < 1 cm wide) has no visible face: no normal
      const longest = Math.max(A.distanceTo(B), B.distanceTo(C), C.distanceTo(A)), width = longest > 0 ? n.length() / longest : 0;
      fn.push(n.lengthSq() > 1e-12 && width > 0.01 ? n.normalize() : n.set(0, 0, 0));
      // top: faces of the dive strip are inside the body; Scholle: only the tucked ring itself is hidden, the band below is visible
      faceHidden.push(name === 'ground' ? hidden(a) || hidden(b) || hidden(c) : hidden(a) && hidden(b) && hidden(c));
      for (const [u, v] of [[a, b], [b, c], [c, a]]) { const k = u < v ? u + '_' + v : v + '_' + u; (edges.get(k) ?? edges.set(k, []).get(k)!).push(t); }
    }
    let sharp = 0, sharpLong = 0, maxDeg = 0, longest = 0, n = 0, folds = 0;
    const foldAt: number[][] = [], cat: Record<string, number> = {}, catFold: Record<string, number> = {};
    let designedMax = 0, designedN = 0, transN = 0;
    const transAt: number[][] = [];
    const plan = (isl.field as R2DIslandField).plan, capE = (isl.field as R2DIslandField).edge.cap;
    const classify = (u: number, v: number) => {
      A.fromBufferAttribute(P, u); B.fromBufferAttribute(P, v); const m = A.clone().add(B).multiplyScalar(0.5), sc = g.scholle;
      const th = Math.atan2(m.z - plan.c0[1], m.x - plan.c0[0]), ea = Math.floor((((th / (Math.PI * 2)) % 1) + 1) % 1 * g.terrain.NA) % g.terrain.NA;
      return g.terrain.bodyEdgeY[ea] - capE - m.y < 0.2 * (sc.Dprofile ?? sc.D) ? 'oberband' : 'designed';
    };
    for (const [k, ts] of edges) {
      if (ts.length !== 2) continue;
      const [u, v] = k.split('_').map(Number);
      if ((name === 'ground' ? hidden(u) || hidden(v) : hidden(u) && hidden(v)) || faceHidden[ts[0]] || faceHidden[ts[1]]) continue;
      if (name === 'ground' && roadQ) {   // under RKIT's road body incl. its slope band and the 0.3 skirt at the foot: not visible
        A.fromBufferAttribute(P, u); B.fromBufferAttribute(P, v); const h1 = roadQ(A.x, A.z), h2 = roadQ(B.x, B.z);
        if (h1.d < (h1.paintHw ?? h1.hw) + 0.5 || h2.d < (h2.paintHw ?? h2.hw) + 0.5) continue;
      }   // an edge with a face inside the body is not visible
      const n1 = fn[ts[0]], n2 = fn[ts[1]];
      if (!n1.lengthSq() || !n2.lengthSq()) continue;
      n++;
      const deg = THREE.MathUtils.radToDeg(n1.angleTo(n2));
      if (deg > maxDeg) maxDeg = deg;
      if (name === 'under') { const isDesigned = classify(u, v) !== 'oberband'; if (isDesigned) { designedMax = Math.max(designedMax, deg); if (deg > 45) designedN++; } else if (deg > 45) { transN++; if (transAt.length < 8) { A.fromBufferAttribute(P, u); B.fromBufferAttribute(P, v); transAt.push([u, v, r3(A.x), r3(A.y), r3(A.z), r3(B.y), r3(deg), pinned?.[u] ? 1 : 0, pinned?.[v] ? 1 : 0]); } } }
      else if (deg > 45) { transN++; if (transAt.length < 40) { A.fromBufferAttribute(P, u); transAt.push([Math.floor(u / g.terrain.NA), u % g.terrain.NA, Math.floor(v / g.terrain.NA), v % g.terrain.NA, r3(A.x), r3(A.y), r3(A.z), r3(deg)]); } }
      if (deg > 120) { folds++; if (foldAt.length < 6) { A.fromBufferAttribute(P, u); foldAt.push([r3(A.x), r3(A.y), r3(A.z), r3(deg)]); } }
      if (deg > minDeg && name === 'under') {
        A.fromBufferAttribute(P, u); B.fromBufferAttribute(P, v);
        const mid = A.clone().add(B).multiplyScalar(0.5), sc = g.scholle, tips = [sc.apex, ...sc.spikes];
        const nearTip = tips.some((t) => Math.hypot(mid.x - t[0], mid.y - t[1], mid.z - t[2]) < 0.18 * sc.D);
        const c0 = (isl.field as R2DIslandField).plan.c0, th = Math.atan2(mid.z - c0[1], mid.x - c0[0]), NA = g.terrain.NA;
        const ea = Math.floor((((th / (Math.PI * 2)) % 1) + 1) % 1 * NA) % NA, dd = g.terrain.bodyEdgeY[ea] - (isl.field as R2DIslandField).edge.cap - mid.y;
        const cls = dd < 0.2 * (sc.Dprofile ?? sc.D) ? 'oberband' : nearTip ? 'spitze' : 'koerper';
        cat[cls] = (cat[cls] ?? 0) + 1; if (deg > 120) catFold[cls] = (catFold[cls] ?? 0) + 1;
      }
      if (deg > minDeg) { sharp++; const L = A.fromBufferAttribute(P, u).distanceTo(B.fromBufferAttribute(P, v)); longest = Math.max(longest, L); if (L > 0.2 * H) sharpLong++; }
    }
    out[name] = { edges: n, sharp, sharpLong, folds, transAt, transitionOver45: transN, designedOver45: designedN, designedMaxDeg: r3(designedMax), byPlace: cat, foldsByPlace: catFold, foldAt, maxDeg: r3(maxDeg), longestSharp: r3(longest) } as any;
  }
  return out;
}

/** Q7: primitive / test geometry in the visible scene that is not inside a labelled placeholder */
export function placeholderScan(root: THREE.Object3D) {
  const PRIM = new Set(['BoxGeometry', 'SphereGeometry', 'IcosahedronGeometry', 'CapsuleGeometry', 'CylinderGeometry', 'ConeGeometry', 'TorusGeometry', 'RoundedBoxGeometry', 'CircleGeometry', 'PlaneGeometry']);
  const hits: { name: string; type: string; labelled: boolean }[] = [];
  root.traverseVisible((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !PRIM.has(m.geometry.type)) return;
    let p: THREE.Object3D | null = m, labelled = false;
    while (p) { if (p.userData?.placeholder) { labelled = true; break; } p = p.parent; }
    hits.push({ name: m.name || m.parent?.name || '?', type: m.geometry.type, labelled });
  });
  return { primitives: hits.length, unlabelled: hits.filter((h) => !h.labelled), labelled: hits.filter((h) => h.labelled).length };
}

/** hard rule "no colour gradients": a mix of two roles (grass ↔ sand) has a HUE neither role has; light and clay relief
 *  change value and saturation, not hue. Off = pixel hue further than tolHue from every role (near-grey pixels skipped).
 *  "Area" counts off pixels whose 3 × 3 neighbourhood is (almost) all off: a gradient is an area, AA edges are lines. */
export function paletteChroma(canvas: HTMLCanvasElement, roles: string[], region: [number, number, number, number], sky = '#96bede', tolHue = 12) {
  const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
  const x = c.getContext('2d')!; x.drawImage(canvas, 0, 0);
  const [x0, y0, x1, y1] = region.map((v, i) => Math.round(v * (i % 2 ? c.height : c.width)));
  const d = x.getImageData(x0, y0, x1 - x0, y1 - y0).data;
  const hueSat = (r: number, g: number, b: number) => { const M = Math.max(r, g, b), m = Math.min(r, g, b), dd = M - m; if (!dd) return [0, 0];
    const h = M === r ? ((g - b) / dd) % 6 : M === g ? (b - r) / dd + 2 : (r - g) / dd + 4; return [((h * 60) + 360) % 360, dd / M]; };
  const pal = roles.map((hx) => { const n = parseInt(hx.slice(1), 16); return hueSat((n >> 16) & 255, (n >> 8) & 255, n & 255)[0]; });
  const sk = parseInt(sky.slice(1), 16), sr = (sk >> 16) & 255, sg = (sk >> 8) & 255, sb = sk & 255;
  let off = 0, tot = 0, skyPx = 0, grey = 0;
  const offMap = new Uint8Array(d.length / 4);
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] + d[i + 1] + d[i + 2] < 30) continue;
    if (Math.abs(d[i] - sr) + Math.abs(d[i + 1] - sg) + Math.abs(d[i + 2] - sb) < 40) { skyPx++; continue; }   // sky / fog is not ground
    const [h, sa] = hueSat(d[i], d[i + 1], d[i + 2]);
    if (sa < 0.06) { grey++; continue; }
    let best = 360; for (const ph of pal) best = Math.min(best, Math.abs(((h - ph + 540) % 360) - 180));
    tot++; if (best > tolHue) { off++; offMap[i / 4] = 1; }
  }
  const w = x1 - x0, h = y1 - y0; let area = 0;
  for (let y = 1; y < h - 1; y++) for (let xx = 1; xx < w - 1; xx++) {
    if (!offMap[y * w + xx]) continue; let n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) n += offMap[(y + dy) * w + xx + dx];
    if (n >= 8) area++;
  }
  return { pixels: tot, skyPixels: skyPx, greyPixels: grey, roleHues: pal.map((v) => Math.round(v)), offHuePct: +((off / Math.max(1, tot)) * 100).toFixed(2), offHueAreaPct: +((area / Math.max(1, tot)) * 100).toFixed(3) };
}
