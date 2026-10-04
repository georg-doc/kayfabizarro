/* KFB Resident Atlas S10 · Pose-Werkzeug
   Ersetzt im Bedienablauf Puppe + IK + Glieder-Schalter durch EIN Werkzeug, das im Bild bedient
   wird. Befund Georg 2026-09-25: zu viel Hin und Her zwischen Palette, Modus, Zoom und IK;
   Anfasser zu klein zum Treffen; nur die Hand ziehbar, nicht der Ellbogen.

   · Anfasser werden DIREKT gezogen (Ebene parallel zum Bildschirm) — kein Klick-dann-Pfeil.
     Größe und Trefferfläche sind in PIXELN konstant, egal wie klein die Figur im Bild ist.
     Getroffen wird der nächste Anfasser im Umkreis, nicht ein 3-mm-Kügelchen per Strahl.
   · Arme und Beine: analytisches Zwei-Knochen-IK statt CCD. Es überstreckt nie, flippt nicht
     und hat eine explizite Armebene (Pol). Der Pol ist selbst ein Anfasser: der RING am
     Ellbogen/Knie dreht die Armebene um die Achse Schulter→Hand, die Hand bleibt stehen.
   · Handwinkel halten: die Hand behält beim Ziehen ihre Weltdrehung — ein gehaltenes Objekt
     kippt nicht mit dem Unterarm weg.
   · Requisite bleibt stehen: Kinder der Hand (Trompete, Gewehr) behalten ihre Weltlage; ihr
     neuer Sitz in der Hand wird als Objekt-Korrektur gesammelt.
   · Kollision ist eine WARNUNG, keine Sperre: Rumpf-Kapsel und Kopf-Kugel aus den posierten
     Haut-Vertices gemessen, geprüft werden Ellbogen, Unterarm, Hand und Requisiten in der Hand.
     Was schon in der Ausgangspose steckt, zählt als Grundwert und wird nicht angemahnt.

   Geschrieben wird nichts selbst: jede Drehung geht über opts.recordBone, jede Lage über
   opts.recordNode in dieselbe Studio-Sammelstelle wie bisher. */
import * as THREE from 'three';
import { skinnedWorld } from './atlas.js';

const N = (s) => (s || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
const V3 = () => new THREE.Vector3();
const Q = () => new THREE.Quaternion();
const COL = { arm: 0x6fd1ff, leg: 0x9ad36a, head: 0xe8c84a, chest: 0xd39ad3, hips: 0xf0b37e, bad: 0xff5a4a };
const LIMB = {
  arm: { root: ['upperarm', 'arm'], mid: ['lowerarm', 'forearm', 'elbow'], tip: ['hand', 'wrist'] },
  leg: { root: ['upperleg', 'thigh'], mid: ['lowerleg', 'shin', 'calf', 'knee'], tip: ['foot', 'ankle'] }
};
const SIDE_DE = { l: 'L', r: 'R' };

const usable = (n) => !n.includes('slot') && !n.includes('pole') && !n.includes('target') && !n.includes('ik') && !n.endsWith('end');
const sideOk = (n, s) => n.endsWith(s) || n.endsWith(s + '001') || n.includes(s === 'l' ? 'left' : 'right');
const depth = (o) => { let d = 0; while (o) { d++; o = o.parent; } return d; };

function findBone(bones, pats, side) {
  for (const p of pats) {
    const c = bones.filter((b) => { const n = N(b.name); return usable(n) && n.startsWith(p) && (!side || sideOk(n, side)); });
    if (c.length) return c.sort((a, b) => depth(a) - depth(b))[0];
  }
  return null;
}
function ancestor(b, pats) {
  let o = b && b.parent;
  while (o && o.isBone) { const n = N(o.name); if (pats.some((p) => n.startsWith(p)) && usable(n)) return o; o = o.parent; }
  return null;
}
function distToSeg(p, a, b) {
  const ab = V3().subVectors(b, a), t = THREE.MathUtils.clamp(V3().subVectors(p, a).dot(ab) / Math.max(1e-9, ab.lengthSq()), 0, 1);
  return p.distanceTo(V3().copy(a).addScaledVector(ab, t));
}
const pct = (arr, k) => { if (!arr.length) return 0; const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * k))]; };

export function applyWorldRot(bone, q) {
  const bw = bone.getWorldQuaternion(Q()), pw = bone.parent.getWorldQuaternion(Q());
  bone.quaternion.copy(pw.invert().multiply(q.clone().multiply(bw)));
  bone.updateMatrixWorld(true);
}
function keepWorldQ(bone, qw) {
  const pw = bone.parent.getWorldQuaternion(Q());
  bone.quaternion.copy(pw.invert().multiply(qw));
  bone.updateMatrixWorld(true);
}
function aim(bone, from, to) {
  const p0 = bone.getWorldPosition(V3());
  const a = V3().subVectors(from, p0), b = V3().subVectors(to, p0);
  if (a.lengthSq() < 1e-12 || b.lengthSq() < 1e-12) return;
  applyWorldRot(bone, Q().setFromUnitVectors(a.normalize(), b.normalize()));
}

function makeMarker(color, shape) {
  const geo = shape === 'oct' ? new THREE.OctahedronGeometry(1.3)
    : shape === 'box' ? new THREE.BoxGeometry(1.6, 1.6, 1.6)
      : shape === 'ring' ? new THREE.TorusGeometry(1, 0.34, 10, 28)
        : new THREE.SphereGeometry(1, 20, 14);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92, depthTest: false, depthWrite: false }));
  const o = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0b0a07, side: THREE.BackSide, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false }));
  o.scale.setScalar(shape === 'ring' ? 1.14 : 1.3);
  m.renderOrder = 1001; o.renderOrder = 1000;
  m.add(o);
  m.userData.outline = o;
  return m;
}
function makeLine(color) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.75, depthTest: false, depthWrite: false }));
  l.renderOrder = 999;
  l.frustumCulled = false;
  return l;
}

export function makePoseTool(viewer, canvas, edit, opts = {}) {
  const group = new THREE.Group();
  group.name = 'pose-handles';
  group.visible = false;
  viewer.scene.add(group);
  const proxy = new THREE.Object3D();
  proxy.name = 'pose-proxy';
  viewer.scene.add(proxy);
  const host = opts.tipHost || canvas.parentElement;
  const tip = document.createElement('div');
  tip.className = 'posetip';
  tip.hidden = true;
  host.appendChild(tip);

  const listeners = new Set();
  const notify = () => { listeners.forEach((f) => f()); opts.onChange?.(); };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane();

  const P = {
    on: false, actor: null, node: null, nodeId: null, label: '',
    handles: [], chains: {}, bones: {}, lines: [], missing: [], height: 2,
    sel: null, hover: null, drag: null, body: null, base: {},
    holdHand: true, pinProps: false, pinFeet: true,
    warnings: [], warnKey: '', bad: new Set(),

    onChange(f) { listeners.add(f); },

    mount(actor, node, nodeId, { label = '' } = {}) {
      P.unmount();
      P.actor = actor; P.node = node || actor; P.nodeId = nodeId; P.label = label;
      const bones = [];
      actor.traverse((o) => { if (o.isBone) bones.push(o); });
      if (!bones.length) { P.missing = ['kein Skelett — starre Teile, keine Anfasser möglich']; notify(); return P; }
      actor.updateWorldMatrix(true, true);
      P.height = new THREE.Box3().setFromObject(actor).getSize(V3()).y || 2;

      for (const kind of ['arm', 'leg']) for (const side of ['l', 'r']) {
        const spec = LIMB[kind];
        const t = findBone(bones, spec.tip, side);
        const m = t && ancestor(t, spec.mid);
        const r = m && ancestor(m, spec.root);
        const name = (kind === 'arm' ? 'Arm ' : 'Bein ') + SIDE_DE[side];
        if (!r) { P.missing.push(name); continue; }
        const key = kind + '.' + side;
        const c = { key, kind, side, root: r, mid: m, tip: t, residual: 0, pole: null };
        c.fallback = () => V3().set(0, 0, kind === 'arm' ? -1 : 1).applyQuaternion(actor.getWorldQuaternion(Q()));
        P.chains[key] = c;
        const col = COL[kind];
        P.handles.push({ key: (kind === 'arm' ? 'hand.' : 'foot.') + side, label: (kind === 'arm' ? 'Hand ' : 'Fuß ') + SIDE_DE[side], kind: 'ik', chain: c, bone: t, color: col, px: 9, shape: 'sphere', group: key });
        P.handles.push({ key: (kind === 'arm' ? 'elbow.' : 'knee.') + side, label: (kind === 'arm' ? 'Ellbogen ' : 'Knie ') + SIDE_DE[side], kind: 'pole', chain: c, bone: m, color: col, px: 8, shape: 'ring', group: key });
        const line = makeLine(col);
        line.userData.chain = c;
        P.lines.push(line);
        group.add(line);
      }
      const head = findBone(bones, ['head']);
      const chest = findBone(bones, ['chest', 'upperchest', 'spine2', 'spine1', 'spine', 'torso']);
      const hips = findBone(bones, ['hips', 'pelvis', 'root']) || bones.sort((a, b) => depth(a) - depth(b))[0];
      P.bones = { head, chest, hips };
      if (head) P.handles.push({ key: 'head', label: 'Kopf', kind: 'rot', bone: head, color: COL.head, px: 9, shape: 'oct', group: 'head' });
      else P.missing.push('Kopf');
      if (chest && chest !== hips) P.handles.push({ key: 'chest', label: 'Brust', kind: 'rot', bone: chest, color: COL.chest, px: 9, shape: 'oct', group: 'chest' });
      else P.missing.push('Brust');
      P.handles.push({ key: 'hips', label: 'Hüfte', kind: 'root', bone: hips, color: COL.hips, px: 9, shape: 'box', group: 'hips' });
      if (hips && (chest || head)) {
        const sp = makeLine(0xb4ab8e);
        sp.userData.spine = true;
        P.lines.push(sp);
        group.add(sp);
      }
      for (const h of P.handles) { h.mesh = makeMarker(h.color, h.shape); group.add(h.mesh); }
      /* Kalibrierung NICHT hier: beim Einbau steht die Enthüllung noch auf Bild 0 und die
         Haut ist nicht gelöst (gemessen: Rumpfradius 0,000). Erst beim ersten Bild mit an. */
      P.body = null; P.base = {}; P._cal = true;
      group.visible = P.on;
      notify();
      return P;
    },

    unmount() {
      if (P.drag) finish();
      for (const h of P.handles) { group.remove(h.mesh); h.mesh.geometry.dispose(); h.mesh.material.dispose(); h.mesh.userData.outline.material.dispose(); }
      for (const l of P.lines) { group.remove(l); l.geometry.dispose(); l.material.dispose(); }
      P.handles = []; P.lines = []; P.chains = {}; P.bones = {}; P.missing = []; P.body = null;
      P.sel = null; P.hover = null; P.actor = null; P.node = null; P.warnings = []; P.warnKey = ''; P.bad.clear();
      tip.hidden = true;
    },

    setOn(on) {
      const was = P.on;
      P.on = on;
      if (on && !was && P.actor) P.recalibrate();
      group.visible = on && P.handles.length > 0;
      if (!on) { if (P.drag) finish(); P.sel = null; P.hover = null; tip.hidden = true; canvas.style.cursor = ''; }
      notify();
    },
    set(k, v) { P[k] = v; notify(); },
    handle(key) { return P.handles.find((h) => h.key === key) || null; },
    select(key) { P.sel = P.handle(key); if (P.sel && edit.borrowed && edit.borrowed.obj !== proxy) edit.release(); notify(); return P.sel; },
    clearSel() { if (!P.sel) return; P.sel = null; if (edit.borrowed && edit.borrowed.obj === proxy) edit.release(); notify(); },
    setHover(key) { P.hover = key ? P.handle(key) : null; },

    /* Achsen-Anfasser für den gewählten Griff — für die, die es millimetergenau wollen. */
    precise() {
      const h = P.sel;
      if (!h) return false;
      opts.onBegin?.(h);
      if (h.kind === 'rot') { edit.borrow(h.bone, 'rotate', () => rec([h.bone]), h.label); return true; }
      if (h.kind === 'root') {
        edit.borrow(P.node, 'translate', () => { P.node.updateWorldMatrix(true, true); pinLegs(P._pins); opts.recordNode?.(P.node, P.nodeId); }, h.label);
        P._pins = savePins();
        return true;
      }
      const c = h.chain;
      const pole = currentPole(c), tipQ = c.tip.getWorldQuaternion(Q()), tipPos = c.tip.getWorldPosition(V3()), props = saveProps(c);
      proxy.position.copy(h.bone.getWorldPosition(V3()));
      proxy.updateMatrixWorld(true);
      edit.borrow(proxy, 'translate', () => {
        if (h.kind === 'ik') { solve(c, proxy.position, pole); if (P.holdHand) keepWorldQ(c.tip, tipQ); }
        else { solve(c, tipPos, V3().subVectors(proxy.position, c.root.getWorldPosition(V3()))); keepWorldQ(c.tip, tipQ); }
        restoreProps(props);
        rec([c.root, c.mid, c.tip]);
      }, h.label);
      return true;
    },

    post() {
      if (!P.on || !P.actor || !P.handles.length) return;
      P.actor.updateWorldMatrix(true, true);
      if (P._cal) P.recalibrate();
      const cam = viewer.camera;
      const hpx = canvas.clientHeight || 600;
      const k = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) / hpx;
      checkCollisions();
      for (const h of P.handles) {
        h.bone.getWorldPosition(h.mesh.position);
        const d = h.mesh.position.distanceTo(cam.position);
        const on = h === P.sel || h === P.hover;
        h.mesh.scale.setScalar(d * k * h.px * (on ? 1.3 : 1));
        if (h.shape === 'ring') h.mesh.quaternion.copy(cam.quaternion);
        h.mesh.material.color.setHex(P.bad.has(h.group) ? COL.bad : h.color);
        h.mesh.userData.outline.material.color.setHex(h === P.sel ? 0xffffff : 0x0b0a07);
      }
      for (const l of P.lines) {
        const a = l.geometry.attributes.position;
        if (l.userData.chain) {
          const c = l.userData.chain;
          c.root.getWorldPosition(V3()).toArray(a.array, 0);
          c.mid.getWorldPosition(V3()).toArray(a.array, 3);
          c.tip.getWorldPosition(V3()).toArray(a.array, 6);
          l.material.color.setHex(P.bad.has(c.key) ? COL.bad : c.kind === 'arm' ? COL.arm : COL.leg);
        } else {
          const b = P.bones;
          (b.hips).getWorldPosition(V3()).toArray(a.array, 0);
          (b.chest || b.hips).getWorldPosition(V3()).toArray(a.array, 3);
          (b.head || b.chest).getWorldPosition(V3()).toArray(a.array, 6);
        }
        a.needsUpdate = true;
      }
      const t = P.drag ? P.drag.h : P.hover;
      if (t) {
        const r = canvas.getBoundingClientRect(), hr = host.getBoundingClientRect();
        const p = t.mesh.position.clone().project(cam);
        /* rechts oben NEBEN dem Griff, nie darüber: über dem Griff lag das Schild auf den
           Nachbar-Anfassern (Ellbogen, Brust) und machte kleine Figuren wieder fummelig */
        tip.style.left = (r.left - hr.left + (p.x * 0.5 + 0.5) * r.width + t.px + 6) + 'px';
        tip.style.top = (r.top - hr.top + (-p.y * 0.5 + 0.5) * r.height - t.px - 4) + 'px';
        const res = P.drag && t.chain && t.chain.residual > 0.004 ? ` · fehlt ${t.chain.residual.toFixed(2)}` : '';
        tip.textContent = t.label + res;
        tip.hidden = false;
      } else tip.hidden = true;
    },

    state() {
      const s = P.sel;
      return {
        on: P.on, label: P.label, missing: P.missing.slice(), height: P.height, body: !!P.body,
        holdHand: P.holdHand, pinProps: P.pinProps, pinFeet: P.pinFeet,
        sel: s ? { key: s.key, label: s.label, kind: s.kind, residual: s.chain ? s.chain.residual : 0, props: s.chain ? propsOf(s.chain).map((n) => n.userData.entry.id) : [] } : null,
        handles: P.handles.map((h) => ({ key: h.key, label: h.label, kind: h.kind, color: h.color, bad: P.bad.has(h.group) })),
        warnings: P.warnings.slice()
      };
    }
  };
  P.recalibrate = () => {
    P._cal = false;
    if (!P.actor) return null;
    const bones = [];
    P.actor.traverse((o) => { if (o.isBone) bones.push(o); });
    P.actor.updateWorldMatrix(true, true);
    P.actor.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.update(); });
    P.body = calibrate(P.actor, bones, P.bones);
    P.base = {};
    if (P.body) for (const pr of probes()) {
      P.base[pr.id] = depthOf(pr.p).d;
      if (pr.prop) P.base['floor.' + pr.name] = Math.min(P.base['floor.' + pr.name] ?? 0, pr.floorY);
    }
    return P.body;
  };
  /* Prüfzugang für Sonden und Verifikation — ändert nichts */
  P.debug = () => ({
    body: P.body ? { rT: +P.body.rT.toFixed(3), rH: +P.body.rH.toFixed(3) } : null,
    probes: P.body ? probes().filter((x) => !x.prop).map((x) => ({ id: x.id, d: +depthOf(x.p).d.toFixed(3), where: depthOf(x.p).where, base: P.base[x.id] != null ? +P.base[x.id].toFixed(3) : null })) : [],
    warnings: P.warnings.slice()
  });
  P.solveTo = (key, T) => { const h = P.handle(key); if (!h || !h.chain) return null; const r = solve(h.chain, T, currentPole(h.chain)); rec([h.chain.root, h.chain.mid, h.chain.tip]); return r; };

  /* ---------- IK ---------- */
  function currentPole(c) {
    const S = c.root.getWorldPosition(V3()), E = c.mid.getWorldPosition(V3()), W = c.tip.getWorldPosition(V3());
    const ax = V3().subVectors(W, S).normalize();
    const p = V3().subVectors(E, S);
    p.addScaledVector(ax, -p.dot(ax));
    return p.lengthSq() < 1e-8 ? c.fallback() : p.normalize();
  }
  function solve(c, T, poleDir) {
    const S = c.root.getWorldPosition(V3()), E = c.mid.getWorldPosition(V3()), W = c.tip.getWorldPosition(V3());
    const L1 = S.distanceTo(E), L2 = E.distanceTo(W);
    const toT = V3().subVectors(T, S), dist = toT.length();
    if (dist < 1e-6 || L1 < 1e-6 || L2 < 1e-6) return 0;
    const dir = toT.divideScalar(dist);
    const dc = THREE.MathUtils.clamp(dist, Math.abs(L1 - L2) + 1e-4, (L1 + L2) * 0.9995);
    const a = (L1 * L1 - L2 * L2 + dc * dc) / (2 * dc), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    let p = poleDir.clone().addScaledVector(dir, -poleDir.dot(dir));
    if (p.lengthSq() < 1e-10) { const f = c.fallback(); p = f.addScaledVector(dir, -f.dot(dir)); }
    p.normalize();
    aim(c.root, E, V3().copy(S).addScaledVector(dir, a).addScaledVector(p, h));
    aim(c.mid, c.tip.getWorldPosition(V3()), V3().copy(S).addScaledVector(dir, dc));
    c.residual = Math.max(0, dist - dc);
    return c.residual;
  }
  function propsOf(c) {
    const out = [];
    c.tip.traverse((o) => { if (o !== c.tip && o.userData && o.userData.entry && !out.some((x) => { let p = o.parent; while (p) { if (p === x) return true; p = p.parent; } return false; })) out.push(o); });
    return out;
  }
  function saveProps(c) { return propsOf(c).map((n) => ({ n, m: n.matrixWorld.clone() })); }
  function restoreProps(list) {
    if (!P.pinProps || !list) return;
    for (const { n, m } of list) {
      n.parent.updateWorldMatrix(true, false);
      V3(); const l = new THREE.Matrix4().copy(n.parent.matrixWorld).invert().multiply(m);
      l.decompose(n.position, n.quaternion, n.scale);
      n.updateMatrixWorld(true);
      opts.recordNode?.(n, n.userData.entry.id);
    }
  }
  function savePins() {
    const out = [];
    if (!P.pinFeet) return out;
    for (const side of ['l', 'r']) {
      const c = P.chains['leg.' + side];
      if (c) out.push({ c, pos: c.tip.getWorldPosition(V3()), q: c.tip.getWorldQuaternion(Q()), pole: currentPole(c) });
    }
    return out;
  }
  function pinLegs(pins) {
    if (!pins || !pins.length) return;
    for (const pn of pins) { solve(pn.c, pn.pos, pn.pole); keepWorldQ(pn.c.tip, pn.q); rec([pn.c.root, pn.c.mid, pn.c.tip]); }
  }
  const rec = (bones) => { for (const b of bones) opts.recordBone?.(b); };

  /* ---------- Kollision (Warnung) ---------- */
  function calibrate(actor, bones, B) {
    if (!B.hips || !B.head) return null;
    const torso = new Set(bones.filter((b) => /^(hips|pelvis|spine|chest|upperchest|torso|neck|body)/.test(N(b.name))));
    const under = (b, top) => { let o = b; while (o) { if (o === top) return true; o = o.parent; } return false; };
    const hs = B.hips.getWorldPosition(V3()), he = B.head.getWorldPosition(V3());
    const dT = [], hp = [];
    const w = V3();
    actor.traverse((o) => {
      if (!o.isSkinnedMesh || !o.visible) return;
      const g = o.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, n = g.attributes.position.count;
      if (!si || !sw) return;
      const step = Math.max(1, Math.floor(n / 3000));
      for (let i = 0; i < n; i += step) {
        let bi = -1, bw = 0;
        for (let k = 0; k < 4; k++) { const x = sw.getComponent(i, k); if (x > bw) { bw = x; bi = si.getComponent(i, k); } }
        const b = o.skeleton.bones[bi];
        if (!b) continue;
        if (under(b, B.head)) { skinnedWorld(o, i, w); hp.push(w.clone()); }
        else if (torso.has(b)) { skinnedWorld(o, i, w); dT.push(distToSeg(w, hs, he)); }
      }
    });
    if (dT.length < 12) return null;
    const out = { rT: pct(dT, 0.8), hips: B.hips, head: B.head, rH: 0, headLocal: null };
    if (hp.length >= 12) {
      const c = hp.reduce((a, p) => a.add(p), V3()).divideScalar(hp.length);
      out.rH = pct(hp.map((p) => p.distanceTo(c)), 0.8);
      out.headLocal = B.head.worldToLocal(c.clone());
    }
    return out;
  }
  function probes() {
    const out = [];
    for (const side of ['l', 'r']) {
      const c = P.chains['arm.' + side];
      if (!c) continue;
      const E = c.mid.getWorldPosition(V3()), W = c.tip.getWorldPosition(V3());
      out.push({ id: c.key + '.e', g: c.key, name: 'Ellbogen ' + SIDE_DE[side], p: E });
      out.push({ id: c.key + '.f', g: c.key, name: 'Unterarm ' + SIDE_DE[side], p: V3().lerpVectors(E, W, 0.5) });
      out.push({ id: c.key + '.h', g: c.key, name: 'Hand ' + SIDE_DE[side], p: W });
      /* Handfläche: Handslot, sonst ein Stück über das Handgelenk hinaus verlängert */
      let palm = null;
      c.tip.traverse((o) => { if (!palm && o !== c.tip && /slot/i.test(o.name)) palm = o; });
      out.push({ id: c.key + '.hp', g: c.key, name: 'Hand ' + SIDE_DE[side], p: palm ? palm.getWorldPosition(V3()) : V3().subVectors(W, E).multiplyScalar(0.35).add(W) });
      for (const n of propsOf(c)) {
        const b = new THREE.Box3().setFromObject(n);
        if (b.isEmpty()) continue;
        const ctr = b.getCenter(V3()), hs = b.getSize(V3()).multiplyScalar(0.35);
        for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
          out.push({ id: c.key + '.p.' + n.userData.entry.id + sx + sy + sz, g: c.key, name: n.userData.entry.id, prop: true, p: V3().set(ctr.x + sx * hs.x, ctr.y + sy * hs.y, ctr.z + sz * hs.z), floorY: b.min.y });
        out.push({ id: c.key + '.p.' + n.userData.entry.id, g: c.key, name: n.userData.entry.id, prop: true, p: ctr, floorY: b.min.y });
      }
    }
    return out;
  }
  function depthOf(p) {
    const B = P.body;
    const hs = B.hips.getWorldPosition(V3()), he = B.head.getWorldPosition(V3());
    const dt = (B.rT - distToSeg(p, hs, he)) / B.rT;
    let dh = -1;
    if (B.headLocal) dh = (B.rH - p.distanceTo(B.head.localToWorld(B.headLocal.clone()))) / B.rH;
    return dh > dt ? { d: dh, where: 'Kopf' } : { d: dt, where: 'Rumpf' };
  }
  function checkCollisions() {
    P.bad.clear();
    const list = [];
    if (P.body) {
      const agg = new Map();
      for (const pr of probes()) {
        const r = depthOf(pr.p);
        const base = P.base[pr.id] ?? -1;
        if (r.d > 0.04 && r.d > Math.max(0, base) + 0.04) {
          const k = pr.name + '|' + r.where;
          const a = agg.get(k) || { g: pr.g, name: pr.name, where: r.where, prop: pr.prop, n: 0, d: 0 };
          a.n++; a.d = Math.max(a.d, r.d);
          agg.set(k, a);
        }
        if (pr.prop && pr.floorY < Math.min(0, P.base['floor.' + pr.name] ?? 0) - 0.02 && !agg.has(pr.name + '|Boden')) agg.set(pr.name + '|Boden', { g: pr.g, name: pr.name, where: 'Boden', prop: true, n: 3, d: 1 });
      }
      for (const a of agg.values()) {
        if (a.prop && a.n < 2) continue;
        P.bad.add(a.g);
        list.push(a.where === 'Boden' ? `${a.name} unter dem Boden` : `${a.name} ${a.prop ? 'steckt im' : 'im'} ${a.where === 'Kopf' ? 'Kopf' : 'Rumpf'} · ${Math.round(a.d * 100)} %`);
      }
    }
    for (const side of ['l', 'r']) {
      const c = P.chains['leg.' + side];
      if (c && c.mid.getWorldPosition(V3()).y < 0) { P.bad.add(c.key); list.push('Knie ' + SIDE_DE[side] + ' unter dem Boden'); }
    }
    const key = list.join('|');
    if (key !== P.warnKey) { P.warnKey = key; P.warnings = list; notify(); }
  }

  /* ---------- Zeiger ---------- */
  function pickAt(cx, cy) {
    if (!P.on || !P.handles.length) return null;
    const r = canvas.getBoundingClientRect();
    let best = null, bd = Infinity;
    for (const h of P.handles) {
      const p = h.mesh.position.clone().project(viewer.camera);
      if (p.z > 1 || p.z < -1) continue;
      const sx = r.left + (p.x * 0.5 + 0.5) * r.width, sy = r.top + (-p.y * 0.5 + 0.5) * r.height;
      const d = Math.hypot(sx - cx, sy - cy);
      if (d < h.px + 10 && d < bd) { bd = d; best = h; }
    }
    return best;
  }
  function hitPlane(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, viewer.camera);
    return ray.ray.intersectPlane(plane, V3());
  }
  function begin(h, e) {
    opts.onBegin?.(h);
    P.sel = h;
    if (edit.borrowed) edit.release();
    viewer.controls.enabled = false;
    const cam = viewer.camera;
    const start = h.bone.getWorldPosition(V3());
    const fwd = V3().set(0, 0, -1).applyQuaternion(cam.quaternion);
    let mode = 'move';
    if (h.kind === 'rot' || (h.kind === 'ik' && e.altKey)) mode = 'rotate';
    else if (h.kind === 'root') mode = e.shiftKey ? 'lift' : 'slide';
    if (mode === 'slide') plane.setFromNormalAndCoplanarPoint(V3().set(0, 1, 0), start);
    else if (mode === 'lift') { const n = fwd.clone().setY(0); if (n.lengthSq() < 1e-6) n.set(0, 0, 1); plane.setFromNormalAndCoplanarPoint(n.normalize(), start); }
    else plane.setFromNormalAndCoplanarPoint(fwd, start);
    const c = h.chain;
    P.drag = {
      h, mode, start, hit0: hitPlane(e) || start.clone(), last: [e.clientX, e.clientY],
      pole: c ? currentPole(c) : null, tipQ: c ? c.tip.getWorldQuaternion(Q()) : null, tipPos: c ? c.tip.getWorldPosition(V3()) : null,
      props: c ? saveProps(c) : null,
      nodeWorld: P.node.getWorldPosition(V3()), pins: h.kind === 'root' ? savePins() : null
    };
    canvas.style.cursor = 'grabbing';
    notify();
  }
  function move(e) {
    const d = P.drag, h = d.h, c = h.chain;
    if (d.mode === 'rotate') {
      const dx = e.clientX - d.last[0], dy = e.clientY - d.last[1];
      d.last = [e.clientX, e.clientY];
      const cam = viewer.camera, k = 0.012;
      const up = V3().set(0, 1, 0).applyQuaternion(cam.quaternion), right = V3().set(1, 0, 0).applyQuaternion(cam.quaternion), fwd = V3().set(0, 0, -1).applyQuaternion(cam.quaternion);
      const q = e.shiftKey ? Q().setFromAxisAngle(fwd, -dx * k) : Q().setFromAxisAngle(up, dx * k).multiply(Q().setFromAxisAngle(right, dy * k));
      const bone = c ? c.tip : h.bone;
      applyWorldRot(bone, q);
      rec([bone]);
      return;
    }
    const hit = hitPlane(e);
    if (!hit) return;
    const T = d.start.clone().add(hit.sub(d.hit0));
    if (h.kind === 'ik') {
      solve(c, T, d.pole);
      if (P.holdHand) keepWorldQ(c.tip, d.tipQ);
      restoreProps(d.props);
      rec([c.root, c.mid, c.tip]);
    } else if (h.kind === 'pole') {
      solve(c, d.tipPos, V3().subVectors(T, c.root.getWorldPosition(V3())));
      keepWorldQ(c.tip, d.tipQ);
      restoreProps(d.props);
      rec([c.root, c.mid, c.tip]);
    } else if (h.kind === 'root') {
      const delta = V3().subVectors(T, d.start);
      if (d.mode === 'lift') delta.set(0, delta.y, 0); else delta.y = 0;
      const w = d.nodeWorld.clone().add(delta);
      P.node.parent.updateWorldMatrix(true, false);
      P.node.position.copy(P.node.parent.worldToLocal(w));
      P.node.updateWorldMatrix(true, true);
      pinLegs(d.pins);
      opts.recordNode?.(P.node, P.nodeId);
    }
  }
  function finish() {
    P.drag = null;
    viewer.controls.enabled = true;
    canvas.style.cursor = P.hover ? 'grab' : '';
    notify();
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!P.on || e.button !== 0 || edit.busy()) return;
    const h = pickAt(e.clientX, e.clientY);
    if (!h) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    begin(h, e);
  }, { capture: true });
  canvas.addEventListener('pointermove', (e) => {
    if (P.drag) { e.stopImmediatePropagation(); move(e); return; }
    if (!P.on || e.buttons) return;
    const h = edit.busy() ? null : pickAt(e.clientX, e.clientY);
    if (h !== P.hover) { P.hover = h; canvas.style.cursor = h ? 'grab' : ''; }
  }, { capture: true });
  const end = (e) => { if (!P.drag) return; e.stopImmediatePropagation(); finish(); };
  canvas.addEventListener('pointerup', end, { capture: true });
  canvas.addEventListener('pointercancel', end, { capture: true });
  canvas.addEventListener('pointerleave', () => { if (!P.drag && P.hover) { P.hover = null; canvas.style.cursor = ''; } });

  return P;
}

/* ---------- Rückgängig ----------
   Schnappschuss VOR jedem Griff. Was ein Schnappschuss enthält, entscheidet die Seite. */
export function makeHistory(capture, restore, limit = 80) {
  let undo = [], redo = [];
  return {
    push() { undo.push(capture()); if (undo.length > limit) undo.shift(); redo = []; },
    undo() { if (!undo.length) return false; redo.push(capture()); restore(undo.pop()); return true; },
    redo() { if (!redo.length) return false; undo.push(capture()); restore(redo.pop()); return true; },
    clear() { undo = []; redo = []; },
    get canUndo() { return undo.length > 0; },
    get canRedo() { return redo.length > 0; }
  };
}
