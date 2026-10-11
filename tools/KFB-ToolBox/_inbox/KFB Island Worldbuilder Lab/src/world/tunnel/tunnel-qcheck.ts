// V-112 checks beyond topology, run in the probe page (import('/src/world/tunnel/tunnel-qcheck.ts')):
//   seeThrough — from the tunnel axis (deck + 4 m) rays in the cross-section plane every 10 m: each must hit the island mesh within 40 m
//                (a miss = a hole in the tube / body);
//   clearance  — every strand / road vertex of the J17 track inside a tunnel lies inside the TC1 interior with ≥ 0.3 m (Core margin) (Q3).
import * as THREE from 'three';
import { outline } from './tunnel-insert';

export function tunnelQChecks(organ: any) {
  const td = organ.td, S = td.samples, K = organ.K ?? 1.46, rc = new THREE.Raycaster(), meshes: THREE.Mesh[] = [];   // K: track metre → scene unit (bench 1)
  organ.W.built.forEach((B: any) => B.root.traverse((m: any) => { if (m.isMesh && !/water|harnleiter/.test(m.name)) meshes.push(m); }));
  // only the tier groups that are visible now (the probe pins ?organTier)
  const vis = (o: THREE.Object3D) => { for (let x: THREE.Object3D | null = o; x; x = x.parent) if (!x.visible) return false; return true; };
  const M = meshes.filter(vis);
  const out: any = { tunnels: [] };
  for (const t of td.tunnels || []) { const ring = td.tunnelRings[S[t.i0].tunnel?.ringId ?? 0].map((p: number[]) => [p[0], p[1]]), O = outline(ring as any);
    const inPoly = (x: number, y: number) => { let c = false; const P = O.P; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
    const dist = (x: number, y: number) => { let m = Infinity; const P = O.P; for (let i = 1, j = 0; i < P.length; j = i++) {   /* walls + ceiling only: the closing floor edge (Y_CUT, under the deck) is not a wall */ const ax = P[j][0], ay = P[j][1], ex = P[i][0] - ax, ey = P[i][1] - ay, l2 = ex * ex + ey * ey || 1, u = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / l2)); m = Math.min(m, Math.hypot(x - ax - u * ex, y - ay - u * ey)); } return m; };
    let rays = 0, miss = 0; const missAt: any[] = [];
    for (let i = t.i0 + 20; i <= t.i1 - 20; i += 20) { const q = S[i], P = new THREE.Vector3(...q.p), U = new THREE.Vector3(...q.U), R = new THREE.Vector3(...q.R), o = P.clone().addScaledVector(U, 4).multiplyScalar(K);
      for (let k = 0; k < 32; k++) { const a = (k / 32) * Math.PI * 2, d = R.clone().multiplyScalar(Math.cos(a)).addScaledVector(U, Math.sin(a)).normalize(); rc.set(o, d); rc.far = 40 * K; rays++;
        if (!rc.intersectObjects(M, false).length) { miss++; if (missAt.length < 6) missAt.push({ i, deg: Math.round(a * 180 / Math.PI) }); } } }
    // strand / road vertices of the J17 chunks over this tunnel (near level) in the tunnel frame
    let n = 0, outside = 0, minMargin = Infinity; const v = new THREE.Vector3();
    for (const c of organ.chunks) { if (c.i1 < t.i0 + 10 || c.i0 > t.i1 - 10) continue;
      for (const m of c.near.children as THREE.Mesh[]) { m.updateMatrixWorld(true); const pos = m.geometry.attributes.position;
        for (let j = 0; j < pos.count; j += 3) { v.fromBufferAttribute(pos as THREE.BufferAttribute, j).applyMatrix4(m.matrixWorld).divideScalar(K);
          // nearest sample by projection from the chunk's middle
          let s = S[Math.round((Math.max(c.i0, t.i0) + Math.min(c.i1, t.i1)) / 2)].s; for (let it = 0; it < 4; it++) { const ii = Math.max(0, Math.min(S.length - 1, Math.round(s / td.ds))), qq = S[ii]; s += (v.x - qq.p[0]) * qq.T[0] + (v.y - qq.p[1]) * qq.T[1] + (v.z - qq.p[2]) * qq.T[2]; }
          const ii = Math.max(0, Math.min(S.length - 1, Math.round(s / td.ds))); if (ii < t.i0 + 10 || ii > t.i1 - 10) continue; const qq = S[ii], rel = v.clone().sub(new THREE.Vector3(...qq.p)), x = rel.dot(new THREE.Vector3(...qq.R)), y = rel.dot(new THREE.Vector3(...qq.U));
          if (y < -0.7) continue; n++; const dm = dist(x, y), inside = inPoly(x, y); if (!inside) outside++; minMargin = Math.min(minMargin, inside ? dm : -dm); } } }
    out.tunnels.push({ i0: t.i0, i1: t.i1, seeThrough: { rays, miss, missAt }, clearance: { vertices: n, outside, minMargin_m: +minMargin.toFixed(3), pass: outside === 0 && minMargin >= 0.3 } }); }
  out.pass = out.tunnels.every((x: any) => x.seeThrough.miss === 0 && x.clearance.pass);
  return out;
}
