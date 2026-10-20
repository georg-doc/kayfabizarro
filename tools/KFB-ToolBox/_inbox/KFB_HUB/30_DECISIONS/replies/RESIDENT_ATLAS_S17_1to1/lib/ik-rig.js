/* KFB Resident Atlas · IK nach dem three.js-Beispiel `webgl_animation_skinning_ik`
   Gleiches Werkzeug wie im Beispiel: `CCDIKSolver` plus `CCDIKHelper`, ein Zielkörper pro Kette,
   den man mit dem TransformControls zieht. Die Kette folgt LAUFEND, jedes Bild, nicht erst beim
   Loslassen.

   Drei Anpassungen an unsere Rigs, jede mit Grund:
   1. Effektor ist ein Stellvertreter-Knoten UNTER dem Spitzen-Bone. Damit kann der Effektor ein
      Punkt sein, der kein Bone ist (der Kopf eines Trommelschlägels), und die Kette bleibt die
      direkte Eltern-Kette, die der Solver erwartet.
   2. Der Solver bekommt ein Stellvertreter-„Mesh" mit eigener Bone-Liste (Kette + Effektor + Ziel).
      Das echte Skelett wird dafür NICHT um Knochen erweitert, sonst stimmen die boneInverses nicht.
   3. Gelenkschlösser: die Drehung jedes Kettenglieds bleibt in einem Winkel um die Pose beim
      Zugreifen. Die ORB-Lehre gilt: Grenzen sind harte Schranken, kein Bericht (DECISION_DRUMMER_
      MANUAL_POSE). Achsweise Blender-Grenzen lassen sich nicht 1:1 übertragen, weil die glTF-Rotation
      Ruhe·Pose ist und nicht Pose allein. Deshalb gilt der Kegel um die Ausgangspose.

   Jede gelöste Drehung geht über `onRecord(bone)` in dieselbe Studio-Sammelstelle wie Puppe und
   Bone-Anfasser. Kein Automatismus: der Solver bewegt nur, was ein gezogenes Ziel verlangt. */
import * as THREE from 'three';
import { CCDIKSolver, CCDIKHelper } from 'three/addons/animation/CCDIKSolver.js';

const N = (s) => (s || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
const _v = new THREE.Vector3();
export const IK_LIMIT_DEG = { hand: 35, wrist: 50, lowerarm: 75, upperarm: 100, foot: 30, lowerleg: 80, upperleg: 70 };
const SPECS = [
  { key: 'arm.r', label: 'Arm R', tip: 'hand', side: 'r', up: ['wrist', 'lowerarm', 'upperarm'], color: 0x6fd1ff },
  { key: 'arm.l', label: 'Arm L', tip: 'hand', side: 'l', up: ['wrist', 'lowerarm', 'upperarm'], color: 0x6fd1ff },
  { key: 'leg.r', label: 'Bein R', tip: 'foot', side: 'r', up: ['lowerleg', 'upperleg'], color: 0x9ad36a },
  { key: 'leg.l', label: 'Bein L', tip: 'foot', side: 'l', up: ['lowerleg', 'upperleg'], color: 0x9ad36a }
];

export function makeIKRig(viewer, edit, opts = {}) {
  const group = new THREE.Group();
  group.name = 'ik-targets';
  viewer.scene.add(group);
  const listeners = new Set();
  const notify = () => listeners.forEach((f) => f());

  const R = {
    on: false, limits: true, showHelper: true, actor: null, chains: [], missing: [], solver: null, helper: null, iks: [],
    onRecord: opts.onRecord || (() => {}),
    onChange(f) { listeners.add(f); },

    /* effectors: { 'arm.r': (outVec3) => outVec3 } — Weltpunkt, der statt der Hand das Ziel treffen soll */
    mount(actor, { effectors = {}, label = '' } = {}) {
      R.unmount();
      R.actor = actor;
      R.label = label;
      const bones = [];
      actor.traverse((o) => { if (o.isBone) bones.push(o); });
      if (!bones.length) { R.missing = ['keine Bones — starre Teile, IK braucht ein Skelett']; notify(); return R; }
      actor.updateWorldMatrix(true, true);
      const h = new THREE.Box3().setFromObject(actor).getSize(_v).y || 2;
      const unit = Math.max(0.03, h / 30);
      const list = [];
      const idx = (o) => { let i = list.indexOf(o); if (i < 0) { list.push(o); i = list.length - 1; } return i; };
      for (const s of SPECS) {
        const tip = bones.find((b) => { const n = N(b.name); return n.startsWith(s.tip) && !n.includes('slot') && n.endsWith(s.side); });
        if (!tip) { R.missing.push(s.label); continue; }
        const links = [tip];
        let o = tip.parent;
        for (const pre of s.up) { if (!o || !o.isBone || !N(o.name).startsWith(pre)) break; links.push(o); o = o.parent; }
        if (links.length < s.up.length + 1) { R.missing.push(`${s.label} (Kette ${links.map((b) => b.name).join('→')} unvollständig)`); continue; }
        const proxy = new THREE.Object3D();
        proxy.name = 'ik-effector.' + s.key;
        tip.add(proxy);
        const target = new THREE.Mesh(new THREE.SphereGeometry(unit, 18, 12),
          new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.9, depthTest: false }));
        target.renderOrder = 999;
        target.name = 'ik-target.' + s.key;
        target.userData.ik = s.key;
        group.add(target);
        const ik = {
          target: idx(target), effector: idx(proxy),
          links: links.map((b) => ({ index: idx(b) })),
          iteration: 14, minAngle: 0, maxAngle: 0.35
        };
        R.iks.push(ik);
        R.chains.push({ ...s, tip, links, proxy, target, ik, effector: effectors[s.key] || null, engaged: false, ref: null, dirty: false, residual: null });
      }
      const fake = { skeleton: { bones: list }, matrixWorld: new THREE.Matrix4() };
      R.solver = new CCDIKSolver(fake, R.iks);
      R.helper = new CCDIKHelper(fake, R.iks, unit * 0.45);
      viewer.scene.add(R.helper);
      R.sync();
      R.setOn(R.on);
      notify();
      return R;
    },
    unmount() {
      if (R.active) edit.release();
      for (const c of R.chains) { group.remove(c.target); c.target.geometry.dispose(); c.target.material.dispose(); c.tip.remove(c.proxy); }
      if (R.helper) { viewer.scene.remove(R.helper); R.helper.dispose?.(); }
      R.chains = []; R.iks = []; R.missing = []; R.solver = null; R.helper = null; R.actor = null; R.active = null;
    },
    setOn(on) {
      R.on = on;
      group.visible = on && R.chains.length > 0;
      if (R.helper) R.helper.visible = on && R.showHelper;
      if (!on) { if (R.active) edit.release(); R.active = null; }
      notify();
    },
    setHelper(on) { R.showHelper = on; if (R.helper) R.helper.visible = R.on && on; notify(); },
    setLimits(on) { R.limits = on; notify(); },
    releaseAll() { for (const c of R.chains) { c.engaged = false; c.ref = null; } if (R.active) edit.release(); R.active = null; R.sync(); notify(); },

    /* Effektor-Stellvertreter an den gewünschten Weltpunkt legen (Hand oder Schlägelkopf) */
    placeProxy(c) {
      if (c.effector) { c.effector(_v); c.tip.updateWorldMatrix(true, false); c.proxy.position.copy(c.tip.worldToLocal(_v)); }
      else c.proxy.position.set(0, 0, 0);
      c.proxy.updateMatrixWorld(true);
    },
    /* nicht gegriffene Ziele sitzen auf dem Effektor — sie ziehen nichts */
    sync() {
      if (!R.actor) return;
      R.actor.updateWorldMatrix(true, true);
      for (const c of R.chains) {
        if (c.engaged) continue;
        R.placeProxy(c);
        c.target.position.copy(c.proxy.getWorldPosition(_v));
      }
    },
    grab(key) {
      const c = R.chains.find((x) => x.key === key);
      if (!c) return null;
      if (!c.engaged) { c.engaged = true; c.ref = c.links.map((b) => b.quaternion.clone()); }
      R.active = c;
      edit.borrow(c.target, 'translate', () => { c.dirty = true; }, `IK ${c.label}`);
      notify();
      return c;
    },
    /* jedes Bild NACH Clip, Patch und Studio-Auftrag */
    post() {
      if (!R.actor || !R.solver) return;
      R.sync();
      if (!R.on) return;
      R.actor.updateWorldMatrix(true, true);
      for (const c of R.chains) {
        if (!c.engaged) continue;
        R.placeProxy(c);
        c.target.updateMatrixWorld(true);
        R.solver.updateOne(c.ik);
        if (R.limits && c.ref) {
          c.links.forEach((b, i) => {
            const pre = Object.keys(IK_LIMIT_DEG).find((k) => N(b.name).startsWith(k));
            const max = THREE.MathUtils.degToRad(IK_LIMIT_DEG[pre] ?? 60);
            const ang = c.ref[i].angleTo(b.quaternion);
            if (ang > max) b.quaternion.copy(c.ref[i]).slerp(b.quaternion.clone(), max / ang);
          });
          c.links[c.links.length - 1].updateMatrixWorld(true);
        }
        R.placeProxy(c);
        c.residual = +c.proxy.getWorldPosition(_v).distanceTo(c.target.position).toFixed(4);
        if (c.dirty) { for (const b of c.links) R.onRecord(b); c.dirty = false; notify(); }
      }
      if (R.helper && R.helper.visible) R.helper.updateMatrixWorld(true);
    },
    state() {
      return { on: R.on, limits: R.limits, helper: R.showHelper, label: R.label, missing: R.missing.slice(), active: R.active ? R.active.key : null,
        chains: R.chains.map((c) => ({ key: c.key, label: c.label, engaged: c.engaged, residual: c.residual, links: c.links.map((b) => b.name), custom: !!c.effector })) };
    }
  };

  edit.addClaim((ray) => {
    if (!R.on || !R.chains.length) return false;
    const hit = ray.intersectObjects(group.children, false)[0];
    if (!hit) return false;
    R.grab(hit.object.userData.ik);
    return true;
  });
  return R;
}

/* ---------- Glied unter dem Mauszeiger ----------
   Skinned: der Bone mit dem größten Gewicht an den drei Ecken des getroffenen Dreiecks — der
   Arm, den man anklickt, ist der Bone, der diese Haut trägt. Starre Teile (Legacy-Orcs): der
   nächste Vorfahr, der ein Bone oder ein benanntes Gelenk ist. Eine Requisite (Knoten mit
   `userData.entry`) ist KEIN Glied — sie fällt an die normale Objekt-Auswahl zurück. */
export function jointAt(hit, jointNames = null) {
  const o = hit.object;
  if (o.isSkinnedMesh && hit.face) {
    const si = o.geometry.attributes.skinIndex, sw = o.geometry.attributes.skinWeight;
    const acc = new Map();
    for (const v of [hit.face.a, hit.face.b, hit.face.c])
      for (let k = 0; k < 4; k++) {
        const w = sw.getComponent(v, k);
        if (w <= 0) continue;
        const b = o.skeleton.bones[si.getComponent(v, k)];
        if (!b || /slot|root/i.test(b.name)) continue;
        acc.set(b, (acc.get(b) || 0) + w);
      }
    let best = null, bw = 0;
    for (const [b, w] of acc) if (w > bw) { best = b; bw = w; }
    return best ? { bone: best, via: 'Hautgewicht ' + bw.toFixed(2) } : null;
  }
  let p = o;
  while (p) {
    if (p.userData && p.userData.entry && p !== o) return null;
    if (p.userData && p.userData.entry) return null;
    if (p.isBone) return { bone: p, via: 'Elternteil' };
    if (jointNames && jointNames.has(p.name)) return { bone: p, via: 'Gelenk-Knoten' };
    p = p.parent;
  }
  return null;
}
