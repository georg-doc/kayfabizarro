/* KFB · Snap-Vertrag (S12, CD-RES-01) — docs/SNAP_EDITOR_CONTRACT_01.md
   Drei Modi, genau einer aktiv, alle am selben Anfasser (edit-layer.js, EIN TransformControls):
   · grid       Raster: Schritt `step` (0,05 Figur-Maßstab), Winkel 15°. Wirkt WÄHREND des Ziehens.
   · connector  Anschluss: beim Loslassen rastet ein Anschlusspunkt der Auswahl auf den nächsten
                Anschlusspunkt eines anderen Objekts, wenn er näher als `tol` liegt. Nur x/z, die Höhe
                bleibt beim Grounding. Kacheln: vier Kantenmitten. Zaun/Pfeiler/Wege (lang): zwei Enden.
   · mount      Halterung: beim Loslassen hängt eine Requisite an die nächste Hand (handslot-Bone), wenn
                sie näher als `tolMount` liegt, mit `mountOffset` im Bone-Raum. Wegziehen löst sie wieder.
   `grid` (Raster an/aus) ist unabhängig vom Modus: Raster kann auch beim Anschluss mitlaufen.
   Der Kopf-Aufsatz (headgraft) bleibt ein eigener Mechanismus und wird hier nicht berührt. */
import * as THREE from 'three';

const _b = new THREE.Box3(), _s = new THREE.Vector3(), _c = new THREE.Vector3();
export const SNAP_MODES = { grid: 'Raster', connector: 'Anschluss', mount: 'Halterung' };

export function makeSnap(EDIT, V, { getRoot, onSnap = () => {} } = {}) {
  const S = { mode: 'grid', grid: true, step: 0.05, angle: 15, tol: 0.35, tolMount: 0.55, mountOffset: [0, 0, 0], last: null };
  const g = EDIT.gizmo;
  const apply = () => {
    g.setTranslationSnap(S.grid ? S.step : null);
    g.setRotationSnap(S.grid ? THREE.MathUtils.degToRad(S.angle) : null);
    g.setScaleSnap && g.setScaleSnap(S.grid ? 0.05 : null);
  };
  apply();

  function connectorsOf(node) {
    node.updateMatrixWorld(true);
    _b.setFromObject(node, true);
    if (_b.isEmpty()) return [];
    _b.getSize(_s); _b.getCenter(_c);
    const y = _b.min.y, out = [];
    const flat = _s.y < 0.35 * Math.min(_s.x, _s.z);
    const longX = _s.x > 2.5 * _s.z, longZ = _s.z > 2.5 * _s.x;
    if (flat) { out.push([_b.min.x, y, _c.z, 'W'], [_b.max.x, y, _c.z, 'O'], [_c.x, y, _b.min.z, 'N'], [_c.x, y, _b.max.z, 'S']); }
    else if (longX) out.push([_b.min.x, y, _c.z, 'Ende'], [_b.max.x, y, _c.z, 'Ende']);
    else if (longZ) out.push([_c.x, y, _b.min.z, 'Ende'], [_c.x, y, _b.max.z, 'Ende']);
    return out.map(([x, yy, z, k]) => ({ p: new THREE.Vector3(x, yy, z), k, flat }));
  }
  const opposite = { W: 'O', O: 'W', N: 'S', S: 'N', Ende: 'Ende' };
  function snapConnector(node) {
    const root = getRoot(); if (!root) return null;
    const mine = connectorsOf(node); if (!mine.length) return { refused: 'keine Anschlusspunkte (weder Kachel noch lang)' };
    let best = null;
    for (const o of root.children) {
      if (o === node || !o.visible || !o.userData.entry) continue;
      for (const b of connectorsOf(o)) for (const a of mine) {
        if (a.flat !== b.flat || opposite[a.k] !== b.k) continue;
        const d = Math.hypot(a.p.x - b.p.x, a.p.z - b.p.z);
        if (d < S.tol && (!best || d < best.d)) best = { d, a, b, to: o.userData.entry.id };
      }
    }
    if (!best) return { refused: 'kein Partner innerhalb ' + S.tol };
    node.position.x += best.b.p.x - best.a.p.x; node.position.z += best.b.p.z - best.a.p.z;
    node.updateMatrixWorld(true);
    return { to: best.to, edge: best.a.k + '→' + best.b.k, moved: +best.d.toFixed(4) };
  }
  function hands() {
    const out = [], root = getRoot(); if (!root) return out;
    root.traverse((o) => { if (o.isBone && /handslot/i.test(o.name)) out.push(o); });
    return out;
  }
  function snapMount(node) {
    if (node.userData.entry?.kind === 'performer') return { refused: 'Figuren hängen nicht an Händen' };
    node.updateMatrixWorld(true);
    _b.setFromObject(node, true); _b.getCenter(_c);
    const mounted = node.userData.mount;
    let best = null;
    for (const h of hands()) { let own = false; for (let p = h; p; p = p.parent) if (p === node) own = true; if (own) continue; const d = h.getWorldPosition(_s).distanceTo(_c); if (d < S.tolMount && (!best || d < best.d)) best = { d, h }; }
    if (!best) {
      if (mounted) { mounted.home.attach(node); node.userData.mount = null; node.userData.attachedTo = null; return { released: mounted.bone }; }
      return { refused: 'keine Hand innerhalb ' + S.tolMount };
    }
    const home = mounted ? mounted.home : node.parent;
    best.h.attach(node);
    node.position.set(...S.mountOffset);
    node.updateMatrixWorld(true);
    node.userData.mount = { bone: best.h.name, home };
    node.userData.attachedTo = best.h.name;
    return { bone: best.h.name, dist: +best.d.toFixed(4), offset: S.mountOffset.slice() };
  }
  g.addEventListener('mouseUp', () => {
    const n = EDIT.node; if (!n || EDIT.borrowed) return;
    let r = null;
    if (S.mode === 'connector') r = snapConnector(n);
    else if (S.mode === 'mount') r = snapMount(n);
    S.last = r ? { mode: S.mode, ...r } : null;
    if (r) onSnap(S.last, n);
  });
  return {
    get state() { return { mode: S.mode, grid: S.grid, step: S.step, angle: S.angle, tol: S.tol, tolMount: S.tolMount, mountOffset: S.mountOffset.slice(), last: S.last }; },
    setMode(m) { if (SNAP_MODES[m]) S.mode = m; },
    cycle() { const k = Object.keys(SNAP_MODES); S.mode = k[(k.indexOf(S.mode) + 1) % k.length]; return S.mode; },
    setGrid(on) { S.grid = !!on; apply(); },
    set(k, v) { if (k === 'step') S.step = Math.max(0.005, +v); else if (k === 'angle') S.angle = +v; else if (k === 'tol') S.tol = +v; else if (k === 'tolMount') S.tolMount = +v; else if (k === 'mountOffset') S.mountOffset = v.map(Number); apply(); },
    connectorsOf, snapConnector, snapMount
  };
}
