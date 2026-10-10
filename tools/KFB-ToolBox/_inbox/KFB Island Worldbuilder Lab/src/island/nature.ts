// Joyride nature language (donors/lab-track/track-look.v5.js): crooked tube trunks with sphere-in-sphere crowns,
// squashed bush blobs, lumpy rocks, leaning pillow-block towers. Rule of Three cluster: tree · two bushes · rock.
// Everything is merged into one mesh per palette colour.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { rng } from './noise';
import { mergeSimple, type IslandField } from './terrain';
import type { IslandPalette } from '../palettes';
import { claySeed, clayMaterial, type ClayClass } from '../clay';

const MATS = new Map<string, THREE.Material>();
export function mat(cls: ClayClass, color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.Material {
  const key = cls + color + JSON.stringify(extra);
  let m = MATS.get(key);
  if (!m) {
    m = clayMaterial(cls, new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...extra }));
    MATS.set(key, m);
  }
  return m;
}

export function blob(r: number, detail: number, lumpK: number, seed: number): THREE.BufferGeometry {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(r, detail);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const p = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = v.clone().normalize();
    const f = 1 + lumpK * (Math.sin(n.x * 3.1 + seed) * Math.sin(n.y * 2.7 + seed * 1.7) * Math.sin(n.z * 3.3 + seed * 0.3));
    v.copy(n.multiplyScalar(r * f));
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

export class NatureBuilder {
  private bins = new Map<string, { cls: ClayClass; color: string; list: THREE.BufferGeometry[] }>();
  private R: () => number;
  constructor(private f: IslandField, private pal: IslandPalette) {
    this.R = rng(f.spec.seed * 31 + 7);
  }

  private put(cls: ClayClass, color: string, g: THREE.BufferGeometry, seed: number) {
    if (g.attributes.uv) g.deleteAttribute('uv');
    if (!g.attributes.normal) g.computeVertexNormals();
    claySeed(g, seed);
    const k = cls + color;
    let b = this.bins.get(k);
    if (!b) { b = { cls, color, list: [] }; this.bins.set(k, b); }
    b.list.push(g.index ? g.toNonIndexed() : g);
  }

  private pick<T>(a: T[]): T {
    return a[Math.floor(this.R() * a.length)];
  }

  tree(x: number, z: number, sc: number, seed: number) {
    const R = this.R, y0 = this.f.height(x, z);
    const h = (11 + R() * 9) * sc, bend = (R() - 0.5) * 0.5 * h, bend2 = (R() - 0.5) * 0.35 * h, ang = R() * Math.PI * 2;
    const c = Math.cos(ang), s = Math.sin(ang);
    const pts = [[0, 0], [bend * 0.15, h * 0.3], [bend, h * 0.62], [bend + bend2, h]].map(([u, y]) => new THREE.Vector3(x + u * c, y0 - 0.6 + y, z + u * s));
    const rT = (0.75 + R() * 0.4) * sc;
    this.put('nature', this.pal.trunk, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, rT, 10, false), seed);
    const foot = blob(rT * 1.9, 2, 0.08, seed);
    foot.scale(1, 0.45, 1); foot.translate(x, y0 - 0.1, z);
    this.put('nature', this.pal.trunk, foot, seed + 1);
    const tp = pts[3], cr = (4.2 + R() * 2.6) * sc;
    const leaf = this.pick([this.pal.leaf[0], this.pal.leaf[0], this.pal.leaf[1], this.pal.leaf[2]]);
    const main = blob(cr, 3, 0.1, seed);
    main.scale(1, 0.9, 1); main.translate(tp.x, tp.y + cr * 0.55, tp.z);
    this.put('nature', leaf, main, seed + 2);
    const nb = 2 + Math.floor(R() * 3);
    for (let k = 0; k < nb; k++) {
      const a = R() * Math.PI * 2, rr = cr * (0.45 + R() * 0.25), g2 = blob(rr, 3, 0.1, seed + k);
      g2.translate(tp.x + Math.cos(a) * cr * 0.75, tp.y + cr * (0.3 + R() * 0.7), tp.z + Math.sin(a) * cr * 0.75);
      this.put('nature', R() < 0.25 ? this.pick(this.pal.leaf) : leaf, g2, seed + 3 + k);
    }
  }

  /** Bikini-Bucht kelp tree: tall wavy stalk, small crown blobs, pink blossoms along the stalk. */
  kelp(x: number, z: number, sc: number, seed: number) {
    const R = this.R, y0 = this.f.height(x, z);
    const h = (14 + R() * 8) * sc, ang = R() * Math.PI * 2, c = Math.cos(ang), s = Math.sin(ang), w = (1.2 + R()) * sc, ph = R() * 6;
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 6; k++) { const t = k / 6, u = Math.sin(t * 5 + ph) * w * t; pts.push(new THREE.Vector3(x + u * c, y0 - 0.8 + t * (h + 0.5), z + u * s)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    this.put('nature', this.pal.trunk, new THREE.TubeGeometry(curve, 28, 0.45 * sc + 0.2, 8, false), seed);
    { const foot = blob((0.45 * sc + 0.2) * 1.9, 2, 0.1, seed + 60); foot.scale(1, 0.45, 1); foot.translate(x, y0 - 0.05, z); this.put('nature', this.pal.trunk, foot, seed + 60); }
    const top = pts[6];
    for (let k = 0; k < 3; k++) {
      const g = blob((2.0 + R() * 1.2) * sc, 3, 0.12, seed + k);
      g.scale(1.2, 0.7, 1.2);
      g.translate(top.x + (R() - 0.5) * 2.5 * sc, top.y + k * 0.8 * sc, top.z + (R() - 0.5) * 2.5 * sc);
      this.put('nature', k === 0 ? this.pal.leaf[0] : this.pal.leaf[1], g, seed + 4 + k);
    }
    for (let k = 0; k < 4; k++) {
      const p = curve.getPoint(0.35 + k * 0.14), g = blob((0.7 + R() * 0.5) * sc + 0.2, 2, 0.15, seed + 9 + k);
      g.translate(p.x + (R() - 0.5) * 1.2, p.y, p.z + (R() - 0.5) * 1.2);
      this.put('nature', this.pal.leaf[2], g, seed + 9 + k);
    }
  }

  /** Palm: curved ringed trunk, 6–8 drooping leaf blobs, two coconuts. */
  palm(x: number, z: number, sc: number, seed: number) {
    const R = this.R, y0 = this.f.height(x, z);
    const h = (12 + R() * 6) * sc, ang = R() * Math.PI * 2, c = Math.cos(ang), s = Math.sin(ang), bend = (1.5 + R() * 2) * sc;
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 5; k++) { const t = k / 5, u = bend * t * t; pts.push(new THREE.Vector3(x + u * c, y0 - 0.8 + t * (h + 0.5), z + u * s)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    this.put('nature', this.pal.trunk, new THREE.TubeGeometry(curve, 24, 0.55 * sc + 0.15, 8, false), seed);
    { const foot = blob((0.55 * sc + 0.15) * 1.9, 2, 0.1, seed + 60); foot.scale(1, 0.45, 1); foot.translate(x, y0 - 0.05, z); this.put('nature', this.pal.trunk, foot, seed + 60); }
    for (let k = 1; k < 6; k++) { // trunk rings
      const p = curve.getPoint(k / 6), g = new THREE.TorusGeometry(0.6 * sc + 0.18, 0.16 * sc + 0.05, 6, 12);
      const tg = curve.getTangent(k / 6); g.lookAt(tg); g.translate(p.x, p.y, p.z);
      this.put('nature', this.pal.trunk, g, seed + 40 + k);
    }
    const top = pts[5], nL = 6 + Math.floor(R() * 3);
    for (let k = 0; k < nL; k++) {
      const a = (k / nL) * Math.PI * 2 + R() * 0.3, L = (4.2 + R() * 1.5) * sc;
      const g = blob(1, 2, 0.08, seed + 10 + k);
      g.scale(L * 0.5, 0.18 * sc + 0.08, 0.9 * sc + 0.2);
      g.translate(L * 0.45, 0, 0);
      g.rotateZ(-0.35 - R() * 0.35); // droop
      g.rotateY(-a);
      g.translate(top.x, top.y + 0.2, top.z);
      this.put('nature', k % 3 === 0 ? this.pal.leaf[1] : this.pal.leaf[0], g, seed + 10 + k);
    }
    for (let k = 0; k < 2; k++) {
      const g = blob(0.38 * sc + 0.12, 2, 0.05, seed + 30 + k);
      g.translate(top.x + (k ? 0.5 : -0.4) * sc, top.y - 0.5 * sc, top.z + (k ? -0.3 : 0.4) * sc);
      this.put('nature', this.pal.trunk, g, seed + 30 + k);
    }
  }

  bush(x: number, z: number, sc: number, seed: number) {
    const R = this.R, y0 = this.f.height(x, z), leaf = this.pick(this.pal.leaf), n = 2 + Math.floor(R() * 2);
    for (let k = 0; k < n; k++) {
      const r = (2.0 + R() * 1.4) * sc, g = blob(r, 3, 0.12, seed + k);
      g.scale(1, 0.78, 1);
      g.translate(x + (R() - 0.5) * r * 1.6, y0 + r * 0.3, z + (R() - 0.5) * r * 1.6);
      this.put('nature', leaf, g, seed + k);
    }
  }

  rock(x: number, z: number, sc: number, seed: number) {
    const R = this.R, y0 = this.f.height(x, z), r = (2.2 + R() * 2.0) * sc, g = blob(r, 3, 0.25, seed);
    g.scale(1, 0.62, 1.1); g.rotateY(R() * 3); g.translate(x, y0 + r * 0.15, z);
    this.put('rock', this.pal.rock, g, seed);
  }

  /** Stepped clay pyramid (procedural landmark): rounded sandstone tiers, stairway, gold capstone, dark entrance. Local coords, base at y = 0. */
  static pyramid(pal: IslandPalette, size = 40, seed = 1): THREE.Group {
    const grp = new THREE.Group(), R = rng(seed);
    const bins = new Map<string, THREE.BufferGeometry[]>();
    const put = (color: string, g: THREE.BufferGeometry) => { if (g.attributes.uv) g.deleteAttribute('uv'); claySeed(g, seed + bins.size); const l = bins.get(color) ?? []; l.push(g.index ? g.toNonIndexed() : g); bins.set(color, l); };
    // truncated: six tiers up to a flat top (reserved for the big KFB cartoon eye, the all-seeing eye)
    const tiers = 7, th = size * 0.08;
    let y = 0;
    for (let k = 0; k < tiers; k++) {
      const w = size * (1 - (k / tiers) * 0.7);
      const g = new RoundedBoxGeometry(w, th, w, 3, th * 0.28);
      g.rotateY((R() - 0.5) * 0.04);
      g.translate((R() - 0.5) * 0.15, y + th / 2, (R() - 0.5) * 0.15);
      put(k === tiers - 1 ? '#f8dc98' : pal.tower[k % 2], g); // top tier lighter
      y += th * 0.97;
    }
    grp.userData.topY = y; // flat top: socket for the eye
    grp.userData.topW = size * (1 - ((tiers - 1) / tiers) * 0.7);
    // stairway up the front (+z) face
    const steps = tiers * 2;
    for (let k = 0; k < steps; k++) {
      const t = k / steps, w = size * 0.16;
      const zf = (size / 2) * (1 - t * 0.7) + 0.2, g = new RoundedBoxGeometry(w, th * 0.5, th * 0.9, 2, th * 0.12);
      g.translate(0, th * 0.25 + k * th * 0.485, zf - th * 0.3);
      put(pal.rock, g);
    }
    const door = new RoundedBoxGeometry(size * 0.12, th * 1.3, 0.6, 2, 0.15);
    door.translate(size * 0.24, th * 0.65, size / 2 + 0.05);
    put('#4a3020', door);
    for (const [color, list] of bins) {
      const m = new THREE.Mesh(mergeSimple(list), mat('model', color));
      m.castShadow = m.receiveShadow = true;
      grp.add(m);
    }
    return grp;
  }

  /** Leaning pillow-block tower (Claybound table mountain × O-Town wobble tower). */
  tower(x: number, z: number, sc: number, seed: number) {
    const R = this.R;
    let y = this.f.height(x, z) - 0.6, w = (13 + R() * 14) * sc, dx = 0, dz = 0;
    const lv = 3 + Math.floor(R() * 3);
    for (let k = 0; k < lv; k++) {
      const hgt = w * (0.7 + R() * 0.5);
      const g = new RoundedBoxGeometry(w, hgt, w * (0.8 + R() * 0.3), 4, Math.min(w, hgt) * 0.22);
      g.rotateY(R() * Math.PI); g.rotateZ((R() - 0.5) * 0.18); g.rotateX((R() - 0.5) * 0.14);
      g.translate(x + dx, y + hgt / 2, z + dz);
      this.put('nature', this.pal.tower[k % 2], g, seed + k);
      y += hgt * 0.94; dx += (R() - 0.5) * w * 0.3; dz += (R() - 0.5) * w * 0.3; w *= 0.62 + R() * 0.18;
    }
    if (R() < 0.6) {
      const g = blob(w * 0.55, 3, 0.1, seed);
      g.scale(1, 0.8, 1); g.translate(x + dx, y + w * 0.3, z + dz);
      this.put('nature', this.pick(this.pal.leaf), g, seed + 20);
    }
  }

  /** Is (x,z) usable for vegetation? Off the edge, dry, off pads, out of the open zone and off the path. */
  private ok(x: number, z: number, margin = 2.5): boolean {
    const f = this.f;
    return f.free(x, z, margin) && !f.inOpen(x, z) && f.pathDist(x, z) > 2.4;
  }

  /** Nearest usable spot around (x,z) within r; null if none. */
  private near(x: number, z: number, r: number, margin = 2.5): [number, number] | null {
    if (this.ok(x, z, margin)) return [x, z];
    const R = this.R;
    for (let t = 0; t < 40; t++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r;
      const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
      if (this.ok(px, pz, margin)) return [px, pz];
    }
    return null;
  }

  build(): THREE.Group {
    // Composition (critic R1): one landmark (placed by Georg), one open zone ≥ 30% kept free, a footpath,
    // vegetation in 2–3 tight Rule-of-Three groups (anchor tree · supporting trees · bushes · rock accent), small tower accents.
    const f = this.f, N = f.spec.nature, R = this.R, s = f.spec.seed * 1000, sc = 0.42;
    const [cx, cz] = f.c;
    const oa = Math.atan2(f.openC[1] - cz, f.openC[0] - cx);
    const nG = N.trees >= 10 ? 4 : N.trees >= 6 ? 3 : 2;
    const groupA = [oa + Math.PI * 0.55, oa - Math.PI * 0.55, oa + Math.PI * 0.82, oa - Math.PI * 0.85].slice(0, nG);
    const perGroup = Math.max(1, Math.round(N.trees / nG));
    let trees = 0, bushes = 0, rocks = 0, towers = 0, seed = s + 300;
    const planted: [number, number, number][] = [];
    const clear = (x: number, z: number, d: number) => planted.every(([px, pz, pd]) => Math.hypot(px - x, pz - z) > Math.max(d, pd));
    for (let g = 0; g < nG; g++) {
      const a = groupA[g] + (R() - 0.5) * 0.3, d = f.radius * (0.5 + R() * 0.18);
      const c = this.near(cx + Math.cos(a) * d, cz + Math.sin(a) * d, f.radius * 0.25, 3.5);
      if (!c) continue;
      // anchor tree
      const kind = (x: number, z: number, k: number) => (N.treeKind === 'kelp' ? this.kelp(x, z, k, seed) : N.treeKind === 'palm' ? this.palm(x, z, k, seed) : this.tree(x, z, k, seed));
      kind(c[0], c[1], sc * 1.3); seed += 20; trees++;
      planted.push([c[0], c[1], 4.5]);
      const ga = R() * Math.PI * 2;
      // supporting trees, tight around the anchor
      for (let k = 1; k < perGroup && trees < N.trees; k++) {
        const aa = ga + k * 2.1 + (R() - 0.5) * 0.5, dd = 4.2 + R() * 2.2;
        const p = this.near(c[0] + Math.cos(aa) * dd, c[1] + Math.sin(aa) * dd, 1.5);
        if (!p || !clear(p[0], p[1], 3.2)) continue;
        kind(p[0], p[1], sc * (0.75 + R() * 0.2)); seed += 20; trees++;
        planted.push([p[0], p[1], 3.2]);
      }
      // two bushes per tree, hugging the group edge
      const nb = Math.min(N.bushes - bushes, perGroup * 2 + 1);
      for (let k = 0; k < nb; k++) {
        const aa = ga + 0.7 + k * (Math.PI * 2 / nb) + (R() - 0.5) * 0.4, dd = 2.8 + R() * 3.2;
        const p = this.near(c[0] + Math.cos(aa) * dd, c[1] + Math.sin(aa) * dd, 1.2, 2);
        if (!p || !clear(p[0], p[1], 1.6)) continue;
        this.bush(p[0], p[1], sc * (0.65 + R() * 0.25), seed); seed += 7; bushes++;
        planted.push([p[0], p[1], 1.6]);
      }
      // rock accent
      if (rocks < N.rocks) {
        const aa = ga - 1.4, dd = 5 + R() * 2;
        const p = this.near(c[0] + Math.cos(aa) * dd, c[1] + Math.sin(aa) * dd, 1.5, 2);
        if (p && clear(p[0], p[1], 1.6)) { this.rock(p[0], p[1], sc * 0.85, seed); seed += 7; rocks++; planted.push([p[0], p[1], 1.6]); }
      }
      // small tower accent at the group's outer side (never taller than the landmark)
      if (towers < N.towers) {
        const aa = a + (R() - 0.5) * 0.8, p = this.near(c[0] + Math.cos(aa) * 7, c[1] + Math.sin(aa) * 7, 2.5, 3.5);
        if (p && clear(p[0], p[1], 4)) { this.tower(p[0], p[1], 0.11 + R() * 0.04, seed); seed += 10; towers++; planted.push([p[0], p[1], 4]); }
      }
    }
    // rest: a few loose bushes / rocks near the groups, never in the open zone
    for (let k = 0; bushes < N.bushes && k < 40; k++) {
      const [px, pz] = planted[Math.floor(R() * planted.length)] ?? [cx, cz];
      const p = this.near(px + (R() - 0.5) * 6, pz + (R() - 0.5) * 6, 1.5, 2);
      if (!p || !clear(p[0], p[1], 1.8)) continue;
      this.bush(p[0], p[1], sc * (0.55 + R() * 0.25), seed); seed += 7; bushes++;
      planted.push([p[0], p[1], 1.8]);
    }
    // 2–4 rocks sitting on the rim, breaking the silhouette
    for (let k = 0, put = 0; put < Math.min(4, Math.max(2, N.rocks - rocks)) && k < 60; k++) {
      const i = Math.floor(R() * f.poly.length), [ex, ez] = f.poly[i];
      const dx = cx - ex, dz = cz - ez, L = Math.hypot(dx, dz) || 1;
      const x = ex + (dx / L) * 1.2, z = ez + (dz / L) * 1.2;
      if (f.inOpen(x, z) || f.pathDist(x, z) < 3 || !clear(x, z, 6)) continue;
      this.rock(x, z, sc * (0.9 + R() * 0.5), seed); seed += 7; put++;
      planted.push([x, z, 6]);
    }
    const g = new THREE.Group();
    g.name = 'nature';
    for (const b of this.bins.values()) {
      const m = new THREE.Mesh(mergeSimple(b.list), mat(b.cls, b.color));
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    }
    return g;
  }
}
