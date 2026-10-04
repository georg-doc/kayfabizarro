/* KFB · Grounding-Gate (S12, CD-RES-01) — hartes Gate nach Georgs Vertrag vom 29.09.
   Kontakt wird GEMESSEN, nicht gestellt:
   · Residents: tiefster Punkt der POSIERTEN Haut (skinnedWorld, jede n-te Ecke) = Fuß-/Rig-Kontakt.
   · Requisiten: tatsächliche Unterkante (Box3 präzise über die Geometrie).
   · Fläche: Strahl senkrecht nach unten gegen die SICHTBAREN Flächen (Gelände bzw. Studio-Boden, Kacheln,
     Track). Dieselbe Geometrie empfängt den Schatten — es gibt keine zweite, unsichtbare Ebene.
   · Korrektur höchstens EINMAL im gemeinsamen Schritt (ground()), nie per Bias.
   Toleranz 0,012 Welteinheiten (≈ 0,5 % Figurenhöhe). */
import * as THREE from 'three';
import { skinnedWorld } from './atlas.js';

const _v = new THREE.Vector3(), _b = new THREE.Box3();
export const TOL = 0.012;

export function makeGrounding(V, { surfaces, getRoot }) {
  const ray = new THREE.Raycaster();
  const within = (o, n) => { for (let p = o; p; p = p.parent) if (p === n) return true; return false; };
  const visible = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };

  function bottomOf(node) {
    node.updateMatrixWorld(true);
    let best = null, skinned = false;
    node.traverse((o) => {
      if (!o.isSkinnedMesh || !visible(o)) return;
      skinned = true;
      const n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 2500));
      for (let i = 0; i < n; i += step) { skinnedWorld(o, i, _v); if (!best || _v.y < best.y) best = _v.clone(); }
    });
    if (skinned && best) return { p: best, how: 'Haut (Fußkontakt)' };
    _b.makeEmpty();
    node.traverse((o) => { if ((o.isMesh) && visible(o) && !o.isSkinnedMesh && !o.material?.isMeshBasicMaterial) _b.expandByObject(o, true); });
    if (_b.isEmpty()) return null;
    const c = _b.getCenter(new THREE.Vector3());
    return { p: new THREE.Vector3(c.x, _b.min.y, c.z), how: 'Unterkante', box: _b.clone() };
  }
  /* erste sichtbare Fläche unter dem Punkt, ohne das Objekt selbst */
  /* Flächenliste gecacht je Wurzel — ein Durchlauf des ganzen Friedhofs pro Strahl kostete sonst ~40 ms */
  let cache = null;
  function surfList() {
    const root = getRoot && getRoot(), base = surfaces();
    if (cache && cache.root === root && cache.base.length === base.length && cache.base.every((m, i) => m === base[i])) return cache.list;
    const list = base.slice();
    if (root) root.traverse((o) => { if (o.isMesh && /floor|path|tile|track/i.test(nameChain(o)) && !/debris|inv\./i.test(nameChain(o))) list.push(o); });
    cache = { root, base, list };
    return list;
  }
  const _o = new THREE.Vector3(), _d = new THREE.Vector3(0, -1, 0);
  function surfaceUnder(x, y, z, node) {
    ray.set(_o.set(x, y + 0.6, z), _d); ray.far = 60;
    const hits = ray.intersectObjects(surfList(), false).filter((h) => visible(h.object) && !within(h.object, node));
    return hits[0] ? { y: hits[0].point.y, on: hits[0].object.userData.surface || nameChain(hits[0].object) } : null;
  }
  function nameChain(o) { let s = ''; for (let p = o; p && s.length < 120; p = p.parent) s += (p.name || '') + '/'; return s; }

  /* Kontakt einer Figur: tiefster Punkt JE FUSS (Bones /foot|toe/) plus tiefster Punkt des ganzen Körpers
     (Liegen nach dem Zerfall), jeder gegen SEINE Fläche darunter. Kontakt = kleinster Abstand. Ein
     gehobener Fuß über einer Lücke zwischen Wegsteinen ist dann kein „Schweben". */
  function footSets(sk) {
    if (sk.userData.footSets) return sk.userData.footSets;
    const bones = sk.skeleton.bones, si = sk.geometry.attributes.skinIndex, sw = sk.geometry.attributes.skinWeight, n = sk.geometry.attributes.position.count;
    const feet = new Map();
    bones.forEach((b, i) => { const m = /(foot|toe)[._]?([lr])?/i.exec(b.name); if (m) feet.set(i, (m[2] || (/left|_l|\.l|l$/i.test(b.name) ? 'l' : 'r')).toLowerCase()); });
    const sets = { l: [], r: [], body: [] }, step = Math.max(1, Math.floor(n / 120));
    for (let i = 0; i < n; i++) {
      let bi = -1, bw = 0; for (let k = 0; k < 4; k++) { const w = [sw.getX(i), sw.getY(i), sw.getZ(i), sw.getW(i)][k]; if (w > bw) { bw = w; bi = [si.getX(i), si.getY(i), si.getZ(i), si.getW(i)][k]; } }
      const side = feet.get(bi);
      if (side) sets[side].push(i); else if (i % step === 0) sets.body.push(i);
    }
    for (const k of ['l', 'r']) if (sets[k].length > 40) { const s = Math.ceil(sets[k].length / 40); sets[k] = sets[k].filter((_, j) => j % s === 0); }
    sk.userData.footSets = sets;
    return sets;
  }
  /* S12d · ALLE sichtbaren Häute der Figur. Vorher nur die erste — bei den KayKit-Skeletten ist das ein
     Rumpf-/Armteil ohne Fußknochen: der Rumpf wurde auf die Kachel gesetzt, die Beine steckten 0,4–0,64 darin. */
  function contactOf(node) {
    const sks = []; node.traverse((o) => { if (o.isSkinnedMesh && visible(o)) sks.push(o); });
    if (!sks.length) return null;
    node.updateMatrixWorld(true);
    const cand = [];
    for (const k of ['l', 'r', 'body']) {
      let low = null;
      for (const sk of sks) { const sets = footSets(sk); for (const i of sets[k]) { skinnedWorld(sk, i, _v); if (!low || _v.y < low.y) low = _v.clone(); } }
      if (!low) continue;
      const s = surfaceUnder(low.x, low.y, low.z, node);
      if (s) cand.push({ k, p: low, s, gap: low.y - s.y });
    }
    if (!cand.length) return null;
    cand.sort((a, b) => a.gap - b.gap);
    return { ...cand[0], all: cand };
  }
  /* Requisite: Unterkante gegen die HÖCHSTE Fläche unter dem inneren Fußabdruck (Mitte + vier Punkte
     auf halbem Weg zur Kante) — steht ein Stein auf einem Wegstein, ruht er auf ihm. */
  function propContact(node) {
    node.updateMatrixWorld(true);   // nach einem absoluten position.set() ist matrixWorld sonst von gestern
    _b.makeEmpty();
    node.traverse((o) => { if (o.isMesh && visible(o) && !o.isSkinnedMesh && !o.material?.isMeshBasicMaterial) _b.expandByObject(o, true); });
    if (_b.isEmpty()) return null;
    const c = _b.getCenter(new THREE.Vector3()), hx = (_b.max.x - _b.min.x) / 4, hz = (_b.max.z - _b.min.z) / 4;
    let best = null;
    for (const [dx, dz] of [[0, 0], [hx, 0], [-hx, 0], [0, hz], [0, -hz]]) { const s = surfaceUnder(c.x + dx, _b.min.y, c.z + dz, node); if (s && (!best || s.y > best.y)) best = s; }
    return best ? { p: new THREE.Vector3(c.x, _b.min.y, c.z), s: best, gap: _b.min.y - best.y, k: 'Unterkante' } : null;
  }
  function measure(node) {
    const c = contactOf(node) || propContact(node);
    if (!c) return { id: node.userData.entry?.id || node.name, error: 'keine Fläche darunter' };
    const gap = c.gap, s = c.s;
    return { id: node.userData.entry?.id || node.name, how: c.k === 'Unterkante' ? 'Unterkante' : 'Fußkontakt ' + c.k, bottom: +c.p.y.toFixed(4), surface: +s.y.toFixed(4), on: s.on.split('/')[0] || s.on, gap: +gap.toFixed(4), at: c.p.toArray().map((x) => +x.toFixed(3)), state: Math.abs(gap) <= TOL ? 'PASS' : gap > 0 ? 'schwebt' : 'steckt', pass: Math.abs(gap) <= TOL };
  }
  /* §3: genau einmal. Hang: Fußpunkte an vier Ecken der Grundfläche, Unterkante auf die HÖCHSTE
     Fläche darunter minus nichts — die Knete gibt unter dem Stein nach, schweben ist verboten. */
  function ground(node) {
    const r = measure(node);
    if (r.error || r.pass) return { ...r, moved: 0 };
    node.position.y -= r.gap;
    node.updateMatrixWorld(true);
    const after = measure(node);
    return { ...after, moved: +(-r.gap).toFixed(4), before: r.gap };
  }
  function groundOnSlope(node) {
    node.updateMatrixWorld(true);
    _b.setFromObject(node, true);
    const ys = [];
    for (const [x, z] of [[_b.min.x, _b.min.z], [_b.max.x, _b.min.z], [_b.min.x, _b.max.z], [_b.max.x, _b.max.z], [(_b.min.x + _b.max.x) / 2, (_b.min.z + _b.max.z) / 2]]) { const s = surfaceUnder(x, _b.max.y + 2, z, node); if (s) ys.push(s.y); }
    if (!ys.length) return null;
    const lo = Math.min(...ys), hi = Math.max(...ys);
    node.position.y += lo - _b.min.y;   // Unterkante auf die TIEFSTE Fläche: bergab sitzt sie auf, bergauf steckt sie in der Knete — schweben ist verboten
    node.updateMatrixWorld(true);
    return { spread: +(hi - lo).toFixed(4), sunk: +(hi - lo).toFixed(4), lo: +lo.toFixed(4) };
  }
  return { invalidate() { cache = null; }, measure, ground, groundOnSlope, bottomOf, surfaceUnder, contactOf, propContact, TOL };
}
