/* KFB Resident Atlas · Studio
   Hand-adjustment layer: gizmo handles for objects, gizmo posing for single bones,
   and a collector that turns every manual nudge into an exportable patch.
   Nothing here overwrites data/cast.js — corrections are collected, then pasted by hand. */
import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const KEY = 'kfb.atlas.studio.v1';
const r3 = (v) => +v.toFixed(3);
const deg = (r) => +THREE.MathUtils.radToDeg(r).toFixed(2);

export function makeStudio(viewer, canvas) {
  const gizmo = new TransformControls(viewer.camera, canvas);
  gizmo.setSpace('world');
  gizmo.addEventListener('dragging-changed', (e) => { viewer.controls.enabled = !e.value; });
  const helper = gizmo.getHelper ? gizmo.getHelper() : gizmo;
  helper.visible = false;
  viewer.scene.add(helper);

  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { store = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} };

  const S = {
    gizmo, helper,
    residentId: null,
    target: null,       // { kind:'node'|'bone', id, obj }
    listeners: new Set(),
    /* absolute bone rotations are re-applied after every mixer update, so a hand-posed
       bone stays where it was put and visibly overrides the clip for that bone only */
    post(actorGetter) {
      const entry = store[S.residentId];
      if (!entry || !entry.bones) return;
      const actor = actorGetter();
      if (!actor) return;
      for (const [name, rot] of Object.entries(entry.bones)) {
        const b = actor.getObjectByName(name);
        if (b) b.rotation.set(...rot.map(THREE.MathUtils.degToRad));
      }
    },
    bucket() {
      store[S.residentId] = store[S.residentId] || { nodes: {}, bones: {} };
      return store[S.residentId];
    },
    of(residentId) { return store[residentId] || { nodes: {}, bones: {} }; },
    count(residentId) {
      const e = S.of(residentId);
      return Object.keys(e.nodes).length + Object.keys(e.bones).length;
    },
    setMode(mode) {
      if (!mode || !S.target) { helper.visible = false; gizmo.detach(); return; }
      gizmo.setMode(mode);
      gizmo.attach(S.target.obj);
      helper.visible = true;
    },
    attach(kind, id, obj, mode) {
      S.target = { kind, id, obj };
      S.setMode(mode);
    },
    detach() { S.target = null; helper.visible = false; gizmo.detach(); },
    /* called on every gizmo change — records the live transform as a patch entry */
    record() {
      if (!S.target || !S.residentId) return;
      const b = S.bucket();
      const o = S.target.obj;
      if (S.target.kind === 'bone') {
        b.bones[S.target.id] = [deg(o.rotation.x), deg(o.rotation.y), deg(o.rotation.z)];
      } else {
        b.nodes[S.target.id] = {
          p: [r3(o.position.x), r3(o.position.y), r3(o.position.z)],
          r: [deg(o.rotation.x), deg(o.rotation.y), deg(o.rotation.z)],
          s: r3(o.scale.x)
        };
      }
      save();
      S.listeners.forEach((f) => f());
    },
    /* re-apply collected node edits after a vignette is rebuilt */
    applyNodes(residentId, nodes) {
      const e = S.of(residentId);
      let n = 0;
      for (const [id, t] of Object.entries(e.nodes || {})) {
        const node = nodes.get(id);
        if (!node) continue;
        node.position.set(...t.p);
        node.rotation.set(...t.r.map(THREE.MathUtils.degToRad));
        if (t.s) node.scale.setScalar(t.s);
        n++;
      }
      return n;
    },
    clear(residentId, what) {
      const e = store[residentId];
      if (!e) return;
      if (what === 'bones') e.bones = {}; else if (what === 'nodes') e.nodes = {}; else delete store[residentId];
      save();
      S.listeners.forEach((f) => f());
    },
    dropOne(residentId, kind, id) {
      const e = store[residentId];
      if (!e) return;
      delete (kind === 'bone' ? e.bones : e.nodes)[id];
      save();
      S.listeners.forEach((f) => f());
    },
    onChange(f) { S.listeners.add(f); },
    all() { return store; }
  };

  gizmo.addEventListener('objectChange', () => S.record());
  return S;
}

/* ---------- declarative reveal timeline ----------
   Keyframes per node property. Cartoon timing lives in the keys (anticipation before the
   pop, overshoot after it), not in the interpreter. */
const EASE = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  outBack: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.5 * Math.pow(t - 1, 2),
  outElastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1)
};
const lerp = (a, b, t) => (Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * t) : a + (b - a) * t);

export function makeReveal(vignette, spec) {
  const base = new Map();
  for (const [id, n] of vignette.nodes) {
    base.set(id, { p: n.position.clone(), s: n.scale.clone(), r: n.rotation.clone(), visible: n.visible });
  }
  function at(time) {
    const t = spec.loop ? time % spec.duration : Math.min(time, spec.duration);
    for (const tr of spec.tracks) {
      const node = vignette.nodes.get(tr.node);
      if (!node) continue;
      const b = base.get(tr.node);
      const keys = tr.keys;
      let v;
      if (t <= keys[0][0]) v = keys[0][1];
      else if (t >= keys[keys.length - 1][0]) v = keys[keys.length - 1][1];
      else {
        let i = 0;
        while (i < keys.length - 2 && keys[i + 1][0] <= t) i++;
        const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
        const raw = (t - t0) / (t1 - t0);
        v = typeof v0 === 'boolean' ? v0 : lerp(v0, v1, (EASE[tr.ease] || EASE.linear)(raw));
      }
      switch (tr.prop) {
        case 'visible': node.visible = !!v; break;
        case 'y': node.position.y = b.p.y + v; break;
        case 'x': node.position.x = b.p.x + v; break;
        case 'z': node.position.z = b.p.z + v; break;
        case 'scale': node.scale.set(b.s.x * v[0], b.s.y * v[1], b.s.z * v[2]); break;
        case 'scaleAll': node.scale.set(b.s.x * v, b.s.y * v, b.s.z * v); break;
        case 'rz': node.rotation.z = b.r.z + THREE.MathUtils.degToRad(v); break;
        case 'ry': node.rotation.y = b.r.y + THREE.MathUtils.degToRad(v); break;
      }
    }
  }
  function reset() {
    for (const [id, n] of vignette.nodes) {
      const b = base.get(id);
      if (!b) continue;
      n.position.copy(b.p); n.scale.copy(b.s); n.rotation.copy(b.r); n.visible = b.visible;
    }
  }
  return { at, reset, duration: spec.duration, phases: spec.phases || [] };
}
