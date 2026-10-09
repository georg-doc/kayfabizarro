// Shared anatomy measurement (docs/ISLAND_ANATOMY_RULES.md): used on the StreakByte originals and on generated islands.
import * as THREE from 'three';

/** Measure one base mesh: slab, wall, underside profile, stalactite tips, facet size (all relative to width W). */
export function measure(wrap: THREE.Object3D, id = '') {
  wrap.updateMatrixWorld(true);
  const P: THREE.Vector3[] = [], T: number[][] = [];
  wrap.traverse((m) => {
    const mm = m as THREE.Mesh;
    if (!mm.isMesh) return;
    const g = mm.geometry.index ? mm.geometry.toNonIndexed() : mm.geometry;
    const a = g.attributes.position;
    const base = P.length;
    for (let i = 0; i < a.count; i++) P.push(new THREE.Vector3().fromBufferAttribute(a, i).applyMatrix4(mm.matrixWorld));
    for (let i = 0; i < a.count; i += 3) T.push([base + i, base + i + 1, base + i + 2]);
  });
  const box = new THREE.Box3().setFromPoints(P), W = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
  const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
  // classify faces by normal
  let up = 0, side = 0, down = 0, area = 0, edges = 0, nEdge = 0;
  const topYs: number[] = [], downF: { y: number; c: THREE.Vector3; n: THREE.Vector3 }[] = [];
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), n = new THREE.Vector3();
  for (const [a, b, c] of T) {
    e1.subVectors(P[b], P[a]); e2.subVectors(P[c], P[a]); n.crossVectors(e1, e2);
    const ar = n.length() / 2; if (ar < 1e-9) continue; n.normalize(); area += ar;
    edges += P[a].distanceTo(P[b]) + P[b].distanceTo(P[c]) + P[c].distanceTo(P[a]); nEdge += 3;
    const cen = new THREE.Vector3().add(P[a]).add(P[b]).add(P[c]).multiplyScalar(1 / 3);
    if (n.y > 0.6) { up++; topYs.push(cen.y); } else if (n.y < -0.15) { down++; downF.push({ y: cen.y, c: cen, n: n.clone() }); } else side++;
  }
  topYs.sort((x, y) => x - y);
  const topY = topYs[Math.floor(topYs.length * 0.5)];
  const minY = box.min.y;
  // slab: highest y where downward faces appear near the rim (outer 15% radius)
  const R = W / 2;
  const rimDown = downF.filter((f) => Math.hypot(f.c.x - cx, f.c.z - cz) > R * 0.8).map((f) => f.y).sort((x, y) => y - x);
  const slabBottom = rimDown.length ? rimDown[Math.floor(rimDown.length * 0.1)] : topY;
  const D = slabBottom - minY;
  // width profile of the underside: horizontal extent of vertices in depth bands below the slab
  const prof: number[] = [];
  for (let k = 0; k <= 10; k++) {
    const y = slabBottom - (D * k) / 10, band = D * 0.05;
    let mx = 0;
    for (const p of P) if (Math.abs(p.y - y) < band) mx = Math.max(mx, Math.hypot(p.x - cx, p.z - cz));
    prof.push(+(mx / R).toFixed(2));
  }
  // stalactite tips: vertices lower than every vertex within radius rr horizontally
  const under = P.filter((p) => p.y < slabBottom - D * 0.15);
  const uniq: THREE.Vector3[] = [];
  for (const p of under) if (!uniq.some((q) => q.distanceToSquared(p) < 1e-6)) uniq.push(p);
  const rr = W * 0.06;
  const tips = uniq.filter((p) => uniq.every((q) => q === p || q.y >= p.y - 1e-6 || Math.hypot(q.x - p.x, q.z - p.z) > rr));
  const tipT = tips.map((p) => +((slabBottom - p.y) / D).toFixed(2)).sort((x, y) => y - x);
  const tipR = tips.map((p) => +(Math.hypot(p.x - cx, p.z - cz) / R).toFixed(2));
  return {
    id, W: +W.toFixed(2), tris: T.length, faces: { up, side, down },
    slab: +((topY - slabBottom) / W).toFixed(3), depthBelowSlab: +(D / W).toFixed(3), totalDepth: +((topY - minY) / W).toFixed(3),
    widthProfile_0to100pct: prof, tips: tips.length, tipDepth: tipT, tipRadius: tipR,
    meanEdge: +((edges / nEdge) / W).toFixed(3),
  };
}
