/* hair-tufts.v1.js — FrizzleBobs drei Haar-Zacken als eigenes Teil (2026-09-26).
 *
 * QUELLE: die Zacken stecken im Spender `FrizzleBob_Yellow.gltf` (derselbe gepinnte Pfad wie
 * frizzlegraft-v1/headgraft.v1.js FB_URL). Gemessen in LIVING_frizzlegraft P34-S35: Kopfnetz =
 * Schädel 768 · Ohren 2 × 120 · Zacken 2 × 108 + Mitte 84 · Augenschalen 2 × 96. Hier wird nur
 * der KOPFKNOCHEN eingesammelt (Ohren hängen an eigenen Knochen und fallen heraus), in Inseln
 * zerlegt und nach LAGE sortiert, nicht nach Index:
 *   größte Insel = Schädel · vorderstes gespiegeltes Paar = Augenschalen · Rest in der oberen
 *   Schädelhälfte = Zacken (links · Mitte · rechts nach x).
 * ZIEL: jede Figur mit einem Knochen `head` (FB Ear Rig v5). Eingepasst Schädel-Oberkante auf
 * Kopf-Oberkante, Maßstab aus der Kopfbreite; danach hängen die Zacken als Kind am Kopfknochen
 * und laufen mit jeder Animation. Eigenes Material `KFB_Hair` (Farbe frei, Vorgabe = Spenderfarbe).
 * Die Spender- und Zieldatei bleiben unberührt. */
export const SCHEMA = 'kfb.hair-tufts/0.1';
export const DONOR_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/eabc87255ee3da6283f9d438390454d70e9d2e55/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf';
export const DEFAULTS = Object.freeze({ on: true, pick: 'three', size: 1, height: 0, depth: 0, spread: 0, lean: 0, tilt: 0, color: null, rough: 0.62 });
export const PICKS = [['three', 'All 3'], ['middle', 'Middle'], ['sides', 'Sides']];
export const META = [
  ['size', 'Size', 0.3, 2.5, 0.01], ['height', 'Height · − sinks into the head', -0.4, 0.4, 0.002], ['depth', 'Forward · back', -0.5, 0.5, 0.002],
  ['spread', 'Spread · side tufts apart', -0.3, 0.5, 0.002], ['lean', 'Lean · side tufts outward (°)', -40, 60, 0.5], ['tilt', 'Tilt · all forward/back (°)', -45, 45, 0.5],
  ['rough', 'Roughness', 0, 1, 0.01],
];
const HEAD = /^head$/i;
let _donor = null;

function dominant(g, i) { const si = g.attributes.skinIndex, sw = g.attributes.skinWeight; let b = 0, bw = -1; for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; b = si.getComponent(i, j); } } return b; }

/** Spender einmal laden und die Zacken herausmessen. Ergebnis in Spender-Weltmaß (Ruhelage). */
export async function loadDonor({ THREE, loader }) {
  if (_donor) return _donor;
  _donor = (async () => {
    const T = THREE, src = (await loader.loadAsync(DONOR_URL)).scene; src.updateMatrixWorld(true);
    const P = [], tris = [], key = new Map(), v = new T.Vector3(); let color = null;
    src.traverse((m) => {
      if (!m.isSkinnedMesh || !m.geometry || !m.geometry.index || !m.geometry.attributes.skinIndex) return;
      const g = m.geometry, bones = m.skeleton.bones, n = g.attributes.position.count, loc = new Int32Array(n).fill(-1), ix = g.index.array;
      for (let i = 0; i < n; i++) { const b = bones[dominant(g, i)]; if (b && HEAD.test(b.name)) loc[i] = -2; }
      for (let t = 0; t < ix.length; t += 3) {
        const a = ix[t], b = ix[t + 1], c = ix[t + 2]; if (loc[a] === -1 || loc[b] === -1 || loc[c] === -1) continue;
        const out = [];
        for (const vi of [a, b, c]) {
          if (loc[vi] < 0) { m.getVertexPosition(vi, v); m.localToWorld(v); const k = v.x.toFixed(4) + ',' + v.y.toFixed(4) + ',' + v.z.toFixed(4); let w = key.get(k); if (w === undefined) { w = P.length / 3; key.set(k, w); P.push(v.x, v.y, v.z); } loc[vi] = w; }
          out.push(loc[vi]);
        }
        tris.push(out);
        if (!color) { const mm = Array.isArray(m.material) ? m.material[0] : m.material; if (mm && mm.color) color = '#' + mm.color.getHexString(); }
      }
    });
    if (!tris.length) return { status: 'UNSUPPORTED', reason: 'no head-bone triangles in the donor' };
    const par = new Int32Array(P.length / 3).map((_, i) => i), f = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    for (const [a, b, c] of tris) { par[f(b)] = f(a); par[f(c)] = f(a); }
    const isl = new Map(); tris.forEach((t) => { const r = f(t[0]); if (!isl.has(r)) isl.set(r, []); isl.get(r).push(t); });
    const list = [...isl.values()].map((ts) => { const bb = new T.Box3(); ts.forEach((t) => t.forEach((w) => bb.expandByPoint(v.set(P[w * 3], P[w * 3 + 1], P[w * 3 + 2])))); return { ts, bb, c: bb.getCenter(new T.Vector3()), n: ts.length }; });
    list.sort((a, b) => b.n - a.n);
    const skull = list[0], rest = list.slice(1), sC = skull.c, sS = skull.bb.getSize(new T.Vector3()), tol = sS.x * 0.04;
    let eyes = [];
    for (let i = 0; i < rest.length; i++) for (let j = i + 1; j < rest.length; j++) {
      const A = rest[i], B = rest[j];
      if (A.n === B.n && Math.abs(A.c.x + B.c.x) < tol && Math.abs(A.c.y - B.c.y) < tol && Math.abs(A.c.z - B.c.z) < tol && (!eyes.length || A.c.z > eyes[0].c.z)) eyes = [A, B];
    }
    const tufts = rest.filter((x) => !eyes.includes(x) && x.c.y > sC.y).sort((a, b) => a.c.x - b.c.x);
    const top = new T.Vector3(sC.x, skull.bb.max.y, sC.z);
    return { status: tufts.length ? 'OK' : 'UNSUPPORTED', reason: tufts.length ? '' : 'no tuft islands above the skull', P, top, width: sS.x, height: sS.y, depth: sS.z, color: color || '#f7cb00',
      tufts: tufts.map((x, i) => ({ ts: x.ts, n: x.n, side: tufts.length === 3 ? i - 1 : Math.sign(x.c.x - sC.x), base: new T.Vector3(x.c.x, x.bb.min.y, x.c.z) })),
      report: { islands: list.map((x) => x.n), skull: skull.n, eyes: eyes.map((x) => x.n), tufts: tufts.map((x) => x.n) } };
  })();
  return _donor;
}

/** Zacken auf eine Figur setzen. `figure` = geladene Szene mit Knochen `head`. */
export function mountTufts({ THREE, figure, donor, params }) {
  const T = THREE;
  if (!donor || donor.status !== 'OK') return { status: 'UNSUPPORTED', reason: (donor && donor.reason) || 'no donor' };
  let head = null; figure.traverse((o) => { if (!head && o.isBone && HEAD.test(o.name)) head = o; });
  if (!head) return { status: 'UNSUPPORTED', reason: 'no head bone on the figure' };
  figure.updateMatrixWorld(true);
  /* Zielkopf messen: Ecken aller Eckpunkte, die am Kopfknochen hängen, im Figurenraum. */
  const inv = new T.Matrix4().copy(figure.matrixWorld).invert(), tb = new T.Box3(), v = new T.Vector3();
  figure.traverse((m) => {
    if (!m.isSkinnedMesh || !m.geometry.attributes.skinIndex) return;
    const g = m.geometry, bones = m.skeleton.bones;
    for (let i = 0; i < g.attributes.position.count; i++) { if (bones[dominant(g, i)] !== head) continue; m.getVertexPosition(i, v); m.localToWorld(v); tb.expandByPoint(v.applyMatrix4(inv)); }
  });
  if (tb.isEmpty()) return { status: 'UNSUPPORTED', reason: 'no skin weighted to the head bone' };
  const tS = tb.getSize(new T.Vector3()), tC = tb.getCenter(new T.Vector3()), tTop = new T.Vector3(tC.x, tb.max.y, tC.z);
  const k = tS.x / donor.width, toHead = new T.Matrix4().copy(head.matrixWorld).invert().multiply(figure.matrixWorld);
  const p = { ...DEFAULTS, ...(params || {}) };
  const mat = new T.MeshStandardMaterial({ color: p.color || donor.color, roughness: p.rough, metalness: 0 }); mat.name = 'KFB_Hair';
  const group = new T.Group(); group.name = 'kfb-hair-tufts'; head.add(group);
  const meshes = donor.tufts.map((tf, i) => {
    const idx = []; tf.ts.forEach((t) => idx.push(...t));
    const used = [...new Set(idx)], remap = new Map(used.map((w, j) => [w, j]));
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(used.length * 3), 3)); g.setIndex(idx.map((w) => remap.get(w)));
    const m = new T.Mesh(g, mat); m.name = 'kfb-hair-tuft#' + (i + 1) + (tf.side < 0 ? ' L' : tf.side > 0 ? ' R' : ' M');
    m.castShadow = true; m.frustumCulled = false; m.userData.noMeasure = true; m.userData.petOverlay = true; m.raycast = () => {};
    group.add(m); return { m, used, tf };
  });
  const q = new T.Quaternion(), e = new T.Euler(), w = new T.Vector3(), piv = new T.Vector3();
  const apply = () => {
    const s = k * p.size, D = donor;
    for (const { m, used, tf } of meshes) {
      const pos = m.geometry.attributes.position, side = tf.side;
      m.visible = !!p.on && (p.pick === 'three' || (p.pick === 'middle' ? side === 0 : side !== 0));
      piv.copy(tf.base).sub(D.top).multiplyScalar(s);   // Fuß der Zacke, relativ zur Kopf-Oberkante
      q.setFromEuler(e.set(0, 0, -side * p.lean * Math.PI / 180));
      const qt = new T.Quaternion().setFromEuler(new T.Euler(p.tilt * Math.PI / 180, 0, 0));
      used.forEach((wi, j) => {
        w.set(D.P[wi * 3], D.P[wi * 3 + 1], D.P[wi * 3 + 2]).sub(D.top).multiplyScalar(s);
        w.sub(piv).applyQuaternion(q).add(piv);                       // Lean um den eigenen Fuß
        w.x += side * p.spread * tS.x;
        w.applyQuaternion(qt);                                         // Tilt um die Kopf-Oberkante
        w.add(tTop); w.y += p.height * tS.y; w.z += p.depth * tS.z;
        w.applyMatrix4(toHead); pos.setXYZ(j, w.x, w.y, w.z);
      });
      pos.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
    }
    mat.color.set(p.color || donor.color); mat.roughness = p.rough;
  };
  apply();
  return {
    status: 'OK', group, params: p, material: mat, headBone: head.name,
    report: { donor: donor.report, scale: +k.toFixed(4), headSize: tS.toArray().map((x) => +x.toFixed(3)), donorColor: donor.color },
    set(patch) { for (const [kk, vv] of Object.entries(patch || {})) { if (!(kk in DEFAULTS)) return { status: 'UNSUPPORTED', field: kk }; } Object.assign(p, patch); apply(); return { status: 'OK' }; },
    export() { return { schema: SCHEMA, source: DONOR_URL, ...p }; },
    dispose() { if (group.parent) group.parent.remove(group); meshes.forEach(({ m }) => m.geometry.dispose()); mat.dispose(); },
  };
}
