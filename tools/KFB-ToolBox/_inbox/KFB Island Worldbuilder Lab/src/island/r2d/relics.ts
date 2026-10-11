// What the clod carried out of the old earth (Georg 10.10.): 1–2 hints in the break, Stufe 1 only as suggestion.
// Town (old city): a cellar vault and a pipe cut by the break. Protopia (young mountain): roots hanging out under the
// rim and a crystal vein in the fresh break. Clay, role colours only, one mesh.
// Lauf 03 (HIGH 3, nothing floats): every part is placed on the REAL surface (ray against top + body mesh), set into it
// by a share of its size, with rubble at its foot; each part records its anchor so QA (Q1/Q3) can re-measure it.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { roleColor } from '../../palettes';
import type { IslandSpec } from '../spec';
import type { R2DPlan } from './fields';
import type { TerrainMesh } from './terrain-mesh';
import type { FormField } from './form';
import { rng } from './math';

/** one relic part: anchor on the surface (island-local), outward normal, size and how deep it is set in */
export interface RelicPart { kind: string; p: [number, number, number]; n: [number, number, number]; size: number; embed: number }

export function buildRelics(spec: IslandSpec, P: R2DPlan & { form: FormField }, T: TerrainMesh, body: THREE.BufferGeometry): { geo: THREE.BufferGeometry; parts: RelicPart[] } | null {
  const list = spec.form?.relics ?? [];
  if (!list.length) return null;
  const R = rng(spec.seed * 131 + 7), geos: THREE.BufferGeometry[] = [], parts: RelicPart[] = [], col = new THREE.Color();
  const paint = (g: THREE.BufferGeometry, hex: string, shade = 1) => {
    col.set(hex).multiplyScalar(shade); const n = g.attributes.position.count, c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) c.set([col.r, col.g, col.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g;
  };
  const meshes = [new THREE.Mesh(T.geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })), new THREE.Mesh(body, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))];
  const ray = new THREE.Raycaster(), c0 = P.c0;
  const cliff = spec.form?.cliffs?.[0], dir = ((cliff?.dir ?? (R() * 360)) * Math.PI) / 180;
  const rimY = (th: number) => { const f = ((((th / (Math.PI * 2)) % 1) + 1) % 1) * T.NA, a = Math.floor(f) % T.NA; return T.bodyEdgeY[a]; };
  // surface point on the break at angle th, `below` units under the body edge: ray from outside towards the axis
  const face = (th: number, below: number) => {
    const y = rimY(th) - below, o = new THREE.Vector3(c0[0] + Math.cos(th) * (P.rAt(th) + 60), y, c0[1] + Math.sin(th) * (P.rAt(th) + 60));
    ray.set(o, new THREE.Vector3(-Math.cos(th), 0, -Math.sin(th)));
    const hit = ray.intersectObjects(meshes, false)[0];
    if (!hit) return null;
    const n = hit.face!.normal.clone(); if (n.x * Math.cos(th) + n.z * Math.sin(th) < 0) n.negate();
    return { p: hit.point.clone(), n: n.normalize() };
  };
  // set a geometry built around the origin (its +z = outwards) into the surface: `embed` units behind the surface point
  const place = (g: THREE.BufferGeometry, s: { p: THREE.Vector3; n: THREE.Vector3 }, embed: number, kind: string, size: number, inside = embed) => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), s.n);
    g.applyQuaternion(q); g.translate(s.p.x - s.n.x * embed, s.p.y - s.n.y * embed, s.p.z - s.n.z * embed);
    geos.push(g); parts.push({ kind, p: [s.p.x, s.p.y, s.p.z], n: [s.n.x, s.n.y, s.n.z], size, embed: inside });
  };
  // rubble: a few small clay stones on the surface below a part (half set in). Lauf 03 fix 4 (schwebende Kleinteile): only
  // where the surface faces up enough to carry a loose stone (n.y ≥ 0.45, a ledge or the foot); on the steep or overhanging
  // break they read as stuck on in mid-air, so there is none
  const rubble = (th: number, below: number, n: number, hex: string) => {
    for (let k = 0; k < n; k++) {
      const s = face(th + (R() - 0.5) * 0.06, below + R() * 2.5); if (!s || s.n.y < 0.45) continue;
      const r = 0.35 + R() * 0.6, g = new THREE.DodecahedronGeometry(r, 0); g.scale(1, 0.7 + R() * 0.4, 1); g.rotateY(R() * 6.3);
      place(paint(g, hex, 0.85 + R() * 0.25), s, r * 0.55, 'rubble', r);
    }
  };
  for (const kind of list) {
    if (kind === 'vault') {
      // cellar vault cut by the break: half arch of old stone set into the face, dark opening flush with the surface
      const th = dir + 0.12, s = face(th, 7); if (!s) continue;
      const arch = paint(new THREE.TorusGeometry(4.2, 1.1, 10, 24, Math.PI), roleColor(spec.palette, 'paved.2'));
      const hole = paint(new THREE.CircleGeometry(3.3, 24, 0, Math.PI), roleColor(spec.palette, 'earth.2'), 0.55); hole.translate(0, 0, 0.75);
      const g = mergeGeometries([arch, hole]); g.translate(0, -1.2, 0);
      place(g, s, 0.7, 'vault', 5.3); rubble(th, 9, 6, roleColor(spec.palette, 'paved.2'));
    } else if (kind === 'pipe') {
      // an old pipe cut by the break: a short straight stub, its end broken (jagged rim), set 3 deep into the face
      const th = dir - 0.18, s = face(th, 11); if (!s) continue;
      const g = new THREE.CylinderGeometry(1.6, 1.6, 8, 16, 5, true); g.rotateX(Math.PI / 2); g.translate(0, 0, 4 - 4.5);
      const pa = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pa.count; i++) if (pa.getZ(i) > 3.0) { const a = Math.atan2(pa.getY(i), pa.getX(i)); pa.setZ(i, pa.getZ(i) - 0.9 * (0.5 + 0.5 * Math.sin(a * 3 + 1.1)) * (0.6 + 0.4 * Math.sin(a * 7))); }
      g.computeVertexNormals();
      place(paint(g, roleColor(spec.palette, 'accent.2'), 0.8), s, 0, 'pipe', 3.5, 4.5);
      rubble(th, 13, 5, roleColor(spec.palette, 'stone.2'));
    } else if (kind === 'roots') {
      // a few short, thick roots out of the topsoil under the rim, near the fresh break, set 1.2 deep, hanging down
      for (let k = 0; k < 4; k++) {
        const th = dir + (R() - 0.5) * 1.6, s = face(th, 1.0 + R() * 1.5); if (!s) continue;
        const L = 2.5 + R() * 3, sway = (R() - 0.5) * 1.5;
        const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, -1.2), new THREE.Vector3(0, -L * 0.35, 0.6), new THREE.Vector3(sway, -L, 0.5 + R() * 0.5)]);
        const g = new THREE.TubeGeometry(curve, 10, 0.55, 7);
        const pa = g.attributes.position as THREE.BufferAttribute, path = curve.getSpacedPoints(10);
        for (let i = 0; i < pa.count; i++) { const ring = Math.floor(i / 8), t = ring / 10, cp = path[Math.min(10, ring)], k2 = 1 - 0.6 * t; pa.setXYZ(i, cp.x + (pa.getX(i) - cp.x) * k2, cp.y + (pa.getY(i) - cp.y) * k2, cp.z + (pa.getZ(i) - cp.z) * k2); }   // taper to the tip
        g.computeVertexNormals();
        place(paint(g, roleColor(spec.palette, 'bark.2')), s, 0, 'roots', 0.55, 1.2);
      }
    } else if (kind === 'crystal') {
      // a vein of crystals in the fresh break: half set into the face, pointing out at different angles, small ones between
      const th0 = dir;
      for (let k = 0; k < 7; k++) {
        const th = th0 + (k - 3) * 0.035, s = face(th, 8 + (R() - 0.5) * 4); if (!s) continue;
        const big = k % 2 === 0, r = big ? 1.1 + R() * 0.9 : 0.5 + R() * 0.4;
        const g = new THREE.OctahedronGeometry(r, 0); g.scale(0.6, 0.6, 1.9); g.rotateX((R() - 0.5) * 0.8); g.rotateY((R() - 0.5) * 0.8);
        // set in by ≈ 30 % of its length (Lauf 03 fix 4: at 25 % the shards read as loose splinters, at 40 % as specks)
        place(paint(g, roleColor(spec.palette, k % 3 ? 'water.0' : 'water.1')), s, r * 1.1, 'crystal', r * 1.9);
      }
      rubble(th0, 12, 4, roleColor(spec.palette, 'stone.1'));
    }
  }
  if (!geos.length) return null;
  const out = mergeGeometries(geos.map((g) => { if (g.attributes.uv) g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; }));
  out.computeVertexNormals();
  for (const m of meshes) (m.material as THREE.Material).dispose();
  return { geo: out, parts };
}
