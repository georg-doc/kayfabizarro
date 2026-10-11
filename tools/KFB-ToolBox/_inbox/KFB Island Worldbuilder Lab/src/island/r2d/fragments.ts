// Fragments (form §2b): broken-off pieces of the first cliff's break. Each piece is the strip the break removed (inner
// edge = the island's jagged rim, outer edge = the original rim), so it fits back like a puzzle piece; it floats `out`
// in front of the break and `dy` up/down. Built from the same R2D pipeline as a small island (own top + Scholle).
import * as THREE from 'three';
import type { IslandSpec } from '../spec';
import type { R2DIslandField } from './field';
import { buildR2DGround, type R2DGround } from './ground';
import { R2DIslandField as Field } from './field';
import { vnoise, type P2 } from './math';
import { signedDist, centroid } from '../shape';

export function buildFragments(f: R2DIslandField, spec: IslandSpec): { group: THREE.Group; grounds: R2DGround[]; specs: IslandSpec[]; fields: R2DIslandField[]; subs: THREE.Group[] } {
  const group = new THREE.Group(), grounds: R2DGround[] = [], specs: IslandSpec[] = [], fields: R2DIslandField[] = [], subs: THREE.Group[] = [];
  group.name = 'fragments';
  const fr = spec.form?.fragments ?? [], cl = spec.form?.cliffs?.[0];
  if (!fr.length || !cl) return { group, grounds, specs, fields, subs };
  const { c0, rAt, form } = f.plan, d2r = Math.PI / 180, half = (cl.width / 2 - 6) * d2r, base = cl.dir * d2r, n = fr.length;
  fr.forEach((fg, k) => {
    // sub-arc of the break for this piece (small gaps between the pieces)
    // compact pieces: arc length ≈ 2 × the break depth (long thin strips are not star-shaped from their centroid and folded)
    const slot0 = base - half + ((2 * half) / n) * k, slotW = (2 * half) / n, midA = slot0 + slotW / 2;
    const thick = fg.depth ?? Math.max(8, form.cut(midA) + 3), span = Math.min(slotW - 0.06, (1.5 * thick) / Math.max(10, rAt(midA)));   // compact: arc ≈ 1.5 × depth
    const a0 = midA - span / 2, a1 = midA + span / 2;
    const inner: P2[] = [], outer: P2[] = [];
    for (let i = 0; i <= 14; i++) {
      const th = a0 + ((a1 - a0) * i) / 14, rIn = rAt(th) + 0.6, rOut = rIn + (fg.depth ?? Math.max(5, form.cut(th) + 3));
      inner.push([c0[0] + Math.cos(th) * rIn, c0[1] + Math.sin(th) * rIn]);
      outer.push([c0[0] + Math.cos(th) * rOut, c0[1] + Math.sin(th) * rOut]);
    }
    // rounded, slightly irregular end caps (straight radial ends were flat cut faces, §01)
    const cap = (from: P2, to: P2, outwardAng: number) => {
      const pts: P2[] = [], mx = (from[0] + to[0]) / 2, mz = (from[1] + to[1]) / 2, rr = Math.hypot(to[0] - from[0], to[1] - from[1]) / 2;
      for (let i = 1; i < 6; i++) { const t = i / 6, a = Math.PI * t, bulge = rr * (0.55 + 0.2 * Math.sin(i * 2.3 + fg.seed));
        const along = Math.cos(a), out = Math.sin(a) * bulge;
        pts.push([mx + (from[0] - mx) * along + Math.cos(outwardAng) * out, mz + (from[1] - mz) * along + Math.sin(outwardAng) * out]); }
      return pts;
    };
    const innerR = [...inner].reverse();
    const poly0 = [...outer, ...cap(outer[outer.length - 1], innerR[0], a1 + Math.PI / 2), ...innerR, ...cap(innerR[innerR.length - 1], outer[0], a0 - Math.PI / 2)];
    let [cx, cz] = centroid(poly0);   // area centroid = the plan's polar centre (the vertex mean showed a notch from there)
    // Lauf 03: star-shaped by construction: the piece in polar form around its centre (first exit of each ray), the radius
    // smoothed along the angle (the break's teeth stay as soft waves, so it still fits; rays never leave the outline)
    const NS = 48, rr: number[] = [];
    for (let i = 0; i < NS; i++) {
      const a = (i / NS) * Math.PI * 2, dx = Math.cos(a), dz = Math.sin(a); let r = 0.5;
      while (r < 200 && signedDist(cx + dx * r, cz + dz * r, poly0) > 0) r += 0.25;
      rr.push(Math.max(1.5, r - 0.25));
    }
    for (let it = 0; it < 3; it++) { const o = rr.slice(); for (let i = 0; i < NS; i++) rr[i] = (o[(i + NS - 1) % NS] + 2 * o[i] + o[(i + 1) % NS]) / 4; }
    let poly: P2[] = rr.map((r, i) => [cx + Math.cos((i / NS) * Math.PI * 2) * r, cz + Math.sin((i / NS) * Math.PI * 2) * r]);
    // piers (RKIT chain, Steuerung 10.10.): a boxy clod, its length along the bridge axis (the piece's radial direction),
    // both bridge sides straight across the axis over the full bridge width (± 11.6 + margin), clay-rounded corners
    // (superellipse n = 8); the long sides keep a little break wobble
    if (fg.at && fg.axis) {
      const dx = Math.cos(midA), dz = Math.sin(midA), a = (fg.depth ?? 17.5) / 2, b = 15, NP = 96;
      poly = [];
      for (let i = 0; i < NP; i++) {
        const t = (i / NP) * Math.PI * 2, ct = Math.cos(t), st = Math.sin(t);
        const u = a * Math.sign(ct) * Math.pow(Math.abs(ct), 0.25), v = b * Math.sign(st) * Math.pow(Math.abs(st), 0.25) * (1 + 0.05 * vnoise(u * 0.25, st > 0 ? 1.3 : 7.1, fg.seed));
        poly.push([cx + dx * u - dz * v, cz + dz * u + dx * v]);
      }
    }
    [cx, cz] = centroid(poly);
    const mid = (a0 + a1) / 2, ox = Math.cos(mid) * fg.out, oz = Math.sin(mid) * fg.out;
    const pier = fg.at && fg.axis;
    const fs: IslandSpec = {
      id: `${spec.id}.frag${k}`, name: `${spec.name} · Brocken ${k + 1}`, palette: spec.palette, seed: fg.seed,
      pos: pier ? [spec.pos[0] + fg.at![0], spec.pos[1] + fg.at![1], spec.pos[2] + fg.at![2]] : [spec.pos[0] + cx + ox, spec.pos[1] + fg.dy, spec.pos[2] + cz + oz], outline: poly.map((p) => [p[0] - cx, p[1] - cz] as P2), outlineExact: true, noComposition: true,
      terrain: { hills: 0.4, hillScale: 0.06, depth: 1.0, beach: 0, pond: null, mount: null },
      nature: { trees: 0, bushes: 0, rocks: 0, towers: 0, treeKind: 'ball' }, buildings: [], residents: [],
      // the side that faced the island is the break: rock (no grass roll), outline exact so it still fits
      form: { undersideStyle: 'cone', breakAge: spec.form?.breakAge, strata: spec.form?.strata, scholle: pier ? 'P' : 'K',
        cliffs: [{ dir: ((mid + Math.PI) / d2r + 360) % 360, width: 150, height: 0, jag: 0 }] },   // no wall rows on a clod this small: rock on the rounding + the body's rock face (a low wall cornered against the body, Q5)
    };
    const ff = new Field(fs), g = buildR2DGround(ff, fs), sub = new THREE.Group();
    sub.name = 'fragment:' + fs.id; sub.userData.fragment = fs.id;
    if (pier) {
      // pier of the arch chain: on the axis, its break depth (radial) along the axis, the break face towards Protopia;
      // nearly level (2°), it carries a bridge
      sub.position.set(fg.at![0], fg.at![1], fg.at![2]);
      const ax = Math.atan2(fg.axis![1], fg.axis![0]);   // axis Town → Protopia: the break face (mid + π) looks along it, to the island it came from
      sub.rotation.y = (mid + Math.PI) - ax;   // rotation.y φ maps a direction angle θ to θ − φ
      sub.rotateOnWorldAxis(new THREE.Vector3(-fg.axis![1], 0, fg.axis![0]), 2 * d2r);
    } else {
      sub.position.set(cx + ox, fg.dy, cz + oz);
      // a floating clod is never level: tipped 7–13° away from the break (its heavy outer side sank)
      const tilt = (7 + 6 * ((fg.seed * 0.618) % 1)) * d2r; sub.rotateOnWorldAxis(new THREE.Vector3(-Math.sin(mid), 0, Math.cos(mid)), -tilt);
    }
    for (const m of g.meshes) { m.name = 'fragment-' + m.name; m.userData.fragment = fs.id; sub.add(m); }   // never found as the island's 'ground' / 'under'
    group.add(sub); grounds.push(g); specs.push(fs); fields.push(ff); subs.push(sub);
  });
  return { group, grounds, specs, fields, subs };
}
