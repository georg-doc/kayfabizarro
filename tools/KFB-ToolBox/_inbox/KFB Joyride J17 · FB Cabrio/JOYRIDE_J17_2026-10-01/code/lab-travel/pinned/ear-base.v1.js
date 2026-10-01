/* PINNED DONOR SNAPSHOT · kayfabizarro@main tools/KFB-ToolBox/_inbox/KFB ToolBox Production-06/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2/kfb-lib/ear-base.v1.js · 5450 B · pinned 2026-10-01 for Joyride J17 (WSA 30.09: Kopie, keine zweite Engine; ToolBox bleibt Owner) */
/* ear-base.v1.js · BASE bone for a dangle chain (KFB ToolBox, 26.09.2026).
 * Georg 26.09.: »die basis muss verschiebbar & rotierbar sein der ears«. On FB Ear Rig v5 the ear ROOT vertices are skinned
 * to `head`, not to ear.*.1. Moving or rotating ear.*.1 therefore moved the ear but left its base stuck in the head: the ear
 * stretched, and a strip of skin stayed behind (screenshot 21.21).
 * Fix: insert ONE new bone `<chain>.base` between the head and bone 1, at bone 1's rest position with no rotation, so the
 * image does not change. Then hand the head weight of the ear's own vertices to it:
 *   · the ear is its own island (connected mesh part with ear weights) → every head weight in that island goes to base;
 *   · the ear is welded into the head → ear-weighted vertices fully, plus a soft ring around the root (smoothstep falloff).
 * The skeleton is rebuilt with one extra bone (boneInverse = T(base)^-1 · headInverse), and the mesh is bound again with
 * the same bindMatrix. ear-dangle.v1 keeps working unchanged: bone 1's parent is now the base, which moves with the head.
 * The same helper serves any root→tip chain (Lord Hunky's eye stalks, alien build A). */
export const SCHEMA = 'kfb.chain-base/0.1';

export function insertChainBase(THREE, root, firstBone, name, { ring = 0.3 } = {}) {
  const hp = firstBone && firstBone.parent; if (!hp) return { status: 'UNSUPPORTED', reason: 'bone has no parent' };
  if (hp.userData && hp.userData.kfbChainBase) return { status: 'OK', base: hp, reused: true };
  root.updateMatrixWorld(true);
  const base = new THREE.Bone(); base.name = name; base.userData.kfbChainBase = true;
  base.position.copy(firstBone.position); hp.add(base); base.add(firstBone); firstBone.position.set(0, 0, 0); base.updateMatrixWorld(true);
  const chain = new Set(); firstBone.traverse((o) => { if (o.isBone) chain.add(o); });
  const len = (() => { for (const c of firstBone.children) if (c.isBone) return c.position.length(); return 0.1; })();
  const Tinv = new THREE.Matrix4().makeTranslation(base.position.x, base.position.y, base.position.z).invert();
  const skMap = new Map(), rep = { meshes: 0, moved: 0, mode: [] };
  root.traverse((m) => {
    if (!m.isSkinnedMesh || !m.skeleton) return;
    const sk = m.skeleton, hi = sk.bones.indexOf(hp), ci = new Set(); sk.bones.forEach((b, i) => { if (chain.has(b)) ci.add(i); });
    if (hi < 0 || !ci.size) return;
    let ns = skMap.get(sk);
    if (!ns) { const inv = new THREE.Matrix4().multiplyMatrices(Tinv, sk.boneInverses[hi]); ns = { sk: new THREE.Skeleton(sk.bones.concat([base]), sk.boneInverses.map((x) => x.clone()).concat([inv])), bi: sk.bones.length, inv }; skMap.set(sk, ns); }
    const g = m.geometry, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, P = g.attributes.position; if (!SI || !SW || !P) return;
    const n = P.count, earV = new Uint8Array(n);
    for (let v = 0; v < n; v++) for (let k = 0; k < 4; k++) if (SW.getComponent(v, k) > 1e-4 && ci.has(SI.getComponent(v, k))) { earV[v] = 1; break; }
    const par = new Int32Array(n); for (let i = 0; i < n; i++) par[i] = i;
    const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    if (g.index) { const ix = g.index.array; for (let t = 0; t < ix.length; t += 3) { const a = find(ix[t]), b = find(ix[t + 1]), c = find(ix[t + 2]); par[b] = a; par[find(c)] = a; } }
    /* Welded vertices (same position, separate index) belong to the same island. */
    const key = (v) => Math.round(P.getX(v) * 1e4) + ',' + Math.round(P.getY(v) * 1e4) + ',' + Math.round(P.getZ(v) * 1e4), seen = new Map();
    for (let v = 0; v < n; v++) { const k = key(v), o = seen.get(k); if (o == null) seen.set(k, v); else par[find(v)] = find(o); }
    const isl = new Map(); let earN = 0;
    for (let v = 0; v < n; v++) { const r = find(v); let e = isl.get(r); if (!e) isl.set(r, e = { n: 0, ear: 0 }); e.n++; if (earV[v]) { e.ear++; earN++; } }
    if (!earN) return;
    const earIsl = new Set(); let islN = 0; for (const [r, e] of isl) if (e.ear) { earIsl.add(r); islN += e.n; }
    const separate = islN <= earN * 4 + 64;
    /* Bind-space position of the base = translation of inverse(baseInverse). Vertex bind-space = bindMatrix · v. */
    const bw = new THREE.Matrix4().copy(ns.inv).invert(), bp = new THREE.Vector3().setFromMatrixPosition(bw), vv = new THREE.Vector3(), R = Math.max(1e-4, len * ring);
    for (let v = 0; v < n; v++) {
      let f = 0;
      if (separate) f = earIsl.has(find(v)) ? 1 : 0;
      else if (earV[v]) f = 1;
      else { vv.fromBufferAttribute(P, v).applyMatrix4(m.bindMatrix); const d = vv.distanceTo(bp); if (d < R) { const x = 1 - d / R; f = x * x * (3 - 2 * x); } }
      if (!(f > 0)) continue;
      let hs = -1, free = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(v, k); if (SI.getComponent(v, k) === hi && w > 0) hs = k; else if (w <= 1e-6 && free < 0) free = k; }
      if (hs < 0) continue;
      const wh = SW.getComponent(v, hs);
      if (f >= 0.999 || free < 0) { if (f >= 0.5 || free >= 0) { SI.setComponent(v, hs, ns.bi); rep.moved++; } }
      else { SW.setComponent(v, hs, wh * (1 - f)); SI.setComponent(v, free, ns.bi); SW.setComponent(v, free, wh * f); rep.moved++; }
    }
    SI.needsUpdate = true; SW.needsUpdate = true;
    m.bind(ns.sk, m.bindMatrix); rep.meshes++; rep.mode.push(separate ? 'island' : 'ring');
  });
  return { status: 'OK', base, len, report: rep };
}
