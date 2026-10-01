/* KFB · snap.v1 — ToolBox port of Resident Atlas S15 lib/snap.js (SNAP_EDITOR_CONTRACT_01).
   Unchanged rules: grid / connector / mount, exactly one active, all on the ONE gizmo of edit-layer.
   ToolBox changes (P07):
   · `recordOf(node)` instead of a hard `userData.entry` (ToolBox records live in doc.objects).
   · Figure refusal is measured: anything that carries a SkinnedMesh is a figure and never hangs on a hand.
   The head graft stays its own mechanism and is not touched here. */
import * as THREE from 'three';

const _b = new THREE.Box3(), _s = new THREE.Vector3(), _c = new THREE.Vector3();
export const SNAP_MODES = { grid: 'Grid', connector: 'Connector', mount: 'Mount' };

export function makeSnap(EDIT, V, { getRoot, onSnap = () => {}, recordOf = (n) => n.userData.entry } = {}) {
  const S = { mode: 'grid', grid: true, step: 0.05, angle: 15, tol: 0.35, tolMount: 0.55, mountOffset: [0, 0, 0], last: null };
  const g = EDIT.gizmo;
  const apply = () => {
    g.setTranslationSnap(S.grid ? S.step : null);
    g.setRotationSnap(S.grid ? THREE.MathUtils.degToRad(S.angle) : null);
    g.setScaleSnap && g.setScaleSnap(S.grid ? 0.05 : null);
  };
  apply();
  const idOf = (o) => { const r = recordOf(o); return r ? r.id : o.name; };
  const isFigure = (o) => { let f = false; o.traverse((x) => { if (x.isSkinnedMesh) f = true; }); return f; };

  function connectorsOf(node) {
    node.updateMatrixWorld(true);
    _b.setFromObject(node, true);
    if (_b.isEmpty()) return [];
    _b.getSize(_s); _b.getCenter(_c);
    const y = _b.min.y, out = [];
    const flat = _s.y < 0.35 * Math.min(_s.x, _s.z);
    const longX = _s.x > 2.5 * _s.z, longZ = _s.z > 2.5 * _s.x;
    if (flat) out.push([_b.min.x, y, _c.z, 'W'], [_b.max.x, y, _c.z, 'E'], [_c.x, y, _b.min.z, 'N'], [_c.x, y, _b.max.z, 'S']);
    else if (longX) out.push([_b.min.x, y, _c.z, 'end'], [_b.max.x, y, _c.z, 'end']);
    else if (longZ) out.push([_c.x, y, _b.min.z, 'end'], [_c.x, y, _b.max.z, 'end']);
    return out.map(([x, yy, z, k]) => ({ p: new THREE.Vector3(x, yy, z), k, flat }));
  }
  const opposite = { W: 'E', E: 'W', N: 'S', S: 'N', end: 'end' };
  function snapConnector(node) {
    const root = getRoot(); if (!root) return null;
    const mine = connectorsOf(node); if (!mine.length) return { refused: 'no connectors (neither tile nor long part)' };
    let best = null;
    for (const o of root.children) {
      if (o === node || !o.visible || !recordOf(o)) continue;
      for (const b of connectorsOf(o)) for (const a of mine) {
        if (a.flat !== b.flat || opposite[a.k] !== b.k) continue;
        const d = Math.hypot(a.p.x - b.p.x, a.p.z - b.p.z);
        if (d < S.tol && (!best || d < best.d)) best = { d, a, b, to: idOf(o) };
      }
    }
    if (!best) return { refused: 'no partner within ' + S.tol };
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
    if (isFigure(node)) return { refused: 'figures never hang on hands' };
    node.updateMatrixWorld(true);
    _b.setFromObject(node, true); _b.getCenter(_c);
    const mounted = node.userData.mount;
    let best = null;
    for (const h of hands()) { let own = false; for (let p = h; p; p = p.parent) if (p === node) own = true; if (own) continue; const d = h.getWorldPosition(_s).distanceTo(_c); if (d < S.tolMount && (!best || d < best.d)) best = { d, h }; }
    if (!best) {
      if (mounted) { mounted.home.attach(node); node.userData.mount = null; node.userData.attachedTo = null; return { released: mounted.bone }; }
      return { refused: hands().length ? 'no hand within ' + S.tolMount : 'no handslot bone on stage' };
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
    set(k, v) { if (k === 'step') S.step = Math.max(0.005, +v); else if (k === 'angle') S.angle = Math.max(1, +v); else if (k === 'tol') S.tol = Math.max(0.01, +v); else if (k === 'tolMount') S.tolMount = Math.max(0.05, +v); else if (k === 'mountOffset') S.mountOffset = v.map(Number); apply(); },
    connectorsOf, snapConnector, snapMount, hands
  };
}
