/* KFB Proof Stage v1 · eyes (WS0 PROOF_STAGE_R1, 17.10.2026)
 * Every figure on the proof stage gets the KFB EyeRig v6 with the E2 closed lid skin (V-348, V-422), the same way, always:
 *   EyeRig v6 (vendor/pet-eye-rig.v6.js, unchanged) + clay-skin-attach.v1.js + clay-eyelid.v3.js (eyeForward 0, fit = card/recipe).
 * This file only decides WHERE the eyes sit (the seat) and feeds the card values in. It draws nothing itself.
 *
 * Seats, in this order (first match wins):
 *   1. 'kfb-anchor'   nodes KFB_Eye_L_anchor / KFB_Eye_R_anchor / KFB_Eye_C_anchor (WSB convention, Blender empties):
 *                     anchor origin = eye centre, local +Z = gaze. Radius from the card: eyeRig.anchors.<L|R|C>.radius (x scale) in the
 *                     frame named by eyeRig.anchors.frame ("L = node X"), else eyeRig.settings.R in the anchor's own frame.
 *                     Socket fit (path A, V-422): socketInnerR = anchors.<side>.shellRadius / radius when the card has a shell.
 *   2. 'eye-anchor'   nodes eye_anchor.l / eye_anchor.r (EYE-CLEANUP convention, GLTFLoader strips the dot: eye_anchorl / eye_anchorr):
 *                     origin = old eye cap surface, local +Z = outward normal, uniform scale = eye radius; the eye centre sits
 *                     r · (0.24 + inset · 1.15) behind it (same rule as the Lab's anchored-eyes.v1 and EyeRig v6).
 *   3. 'card-facehost' only when the card says eyeRig.seat = 'facehost' (FrizzleBob v5b: no anchors in the GLB, the approved setting
 *                     is anchor dx/dy/ring on the face host, V-240/V-245): facehost.v1 + EyeRig v6 with the card settings. The original
 *                     model eyes listed in card.originals.remove are hidden by the stage.
 *   none            -> status 'NO_ANCHORS': the page shows the red label "KEINE AUGEN-ANKER", the export fails.
 *
 * v1.2.3 (WS0 18.10., WSB B31 demo): several figures in one GLB. GLTFLoader makes duplicate node names unique (KFB_Eye_L_anchor ->
 * KFB_Eye_L_anchor_1, _2 …), so anchors also match with a _N suffix. findEyeFigures() groups the anchors into figure subtrees (the highest
 * node above an anchor whose anchors repeat no side); mountEyesAll() mounts one EyeRig v6 + E2 set per subtree (same card/defaults for
 * each, host frame at the anchors when the subtree has no head bone) and returns one handle over all of them. One figure (or anchors that
 * cannot be grouped) -> exactly mountEyes(root) as before.
 *
 * Eye states (same table as E2_ATTACH_R1/proof.html): rest (v6 rest 0.12/0.06), half (0.5/0.5), closed (1/1). Gaze centre, no blink,
 * no life, no kinetics: a proof image is a still. Lid colour = card lid colour as is (WS0 16.10., V-417: no x0.72); without one the
 * v6 base-darkened colour. Lid material = kfb-clay v1.1 'character' (seed card id + ':lid'), like the figure.
 */
import { EyeRig } from './vendor/pet-eye-rig.v6.js';
import { buildFaceHost } from './vendor/facehost.v1.js';
import { attachClaySkin, lidValuesFromV6, LID_SKIN_NAME } from './vendor/clay-skin-attach.v1.js';

export const EYES_VERSION = 'kfb-proof-eyes.v1';
export const LID_STATES = Object.freeze({ rest: { u: 0.12, l: 0.06 }, half: { u: 0.5, l: 0.5 }, closed: { u: 1, l: 1 } });
const SAN = (s) => String(s || '').replace(/[\s.]/g, '').toLowerCase();

/** Find the eye seat of a figure. Returns { seat, anchors: [{ node, side }] } or { seat: null, reason }. */
export function findEyeSeat(figure, card) {
  const kfb = [], cleanup = [];
  figure.traverse((o) => {
    const n = o.name || '';
    let m = /^KFB_Eye_([LRC])_anchor(?:_\d+)?$/i.exec(n); if (m) kfb.push({ node: o, side: m[1].toUpperCase() });   // v1.2.3: _N = GLTFLoader duplicate suffix
    m = /^eye_?anchor\.?([lr])(?:_\d+)?$/i.exec(n); if (m) cleanup.push({ node: o, side: m[1].toUpperCase() });
  });
  if (kfb.length) return { seat: 'kfb-anchor', anchors: kfb };
  if (cleanup.length) return { seat: 'eye-anchor', anchors: cleanup };
  const er = card && card.eyeRig;
  if (er && er.seat === 'facehost') return { seat: 'card-facehost', anchors: [] };
  return { seat: null, anchors: [], reason: 'keine KFB_Eye_*_anchor / eye_anchor.* in der GLB und kein Karten-Sitz (eyeRig.seat facehost)' };
}

/* card -> EyeRig v6 options (same field names the ToolBox export uses) */
function rigOptions(card) {
  const er = (card && card.eyeRig) || {}, s = er.settings || {}, pu = er.pupil || {};
  const hex = (h, d) => (h == null ? d : typeof h === 'number' ? h : parseInt(String(h).replace('#', ''), 16));
  return {
    anchor: { ...(s.anchor || {}) },
    pupilStyle: s.pupilStyle || pu.style || 'matte-cute',
    pupilSize: s.pupilSize ?? pu.size ?? 0.4,
    gloss: s.gloss ?? pu.gloss ?? 0.85,
    inset: s.inset ?? 0, lidFit: s.lidFit ?? er.lid?.fit ?? 0.9,
    converge: s.converge ?? 0, splay: s.splay ?? 0,
    blink: { minGap: 2.5, maxGap: 6.5, dur: 0.12, ...(s.blink || {}) },
    lashes: s.lashes ? { length: 0, density: 6, width: 1, ...s.lashes } : null,
    baseColor: hex(s.baseColor, 0xf2c93c),
    kinetics: { enabled: false, gain: 1 },
    life: { on: false, wander: 0, tremor: 0 },
  };
}

const worldScale = (THREE, o) => { const s = new THREE.Vector3(); o.updateWorldMatrix(true, false); o.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), s); return (Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.z)) / 3; };
function findNode(root, name) { let hit = null; const k = SAN(name); root.traverse((o) => { if (!hit && SAN(o.name) === k) hit = o; }); if (!hit) root.traverse((o) => { if (!hit && SAN(o.name).replace(/_\d+$/, '') === k) hit = o; }); return hit; }   // v1.2.3: _N fallback
function headBone(root) { let h = null; root.traverse((o) => { if (!h && o.isBone && /^head$/i.test(o.name)) h = o; }); return h; }

/* Card radius for a KFB anchor, in world units. */
function kfbAnchorRadius(THREE, figure, card, a) {
  const an = card?.eyeRig?.anchors, sideRec = an && an[a.side];
  if (sideRec && sideRec.radius > 0) {
    const fm = /node\s+([\w.-]+)/i.exec(an.frame || ''), frame = fm ? findNode(figure, fm[1]) : null;
    const fs = frame ? worldScale(THREE, frame) : worldScale(THREE, a.node.parent || a.node);
    return { r: sideRec.radius * (sideRec.scale ?? 1) * fs, shell: sideRec.shellRadius > 0 ? sideRec.shellRadius / sideRec.radius : null, src: `card eyeRig.anchors.${a.side} (${frame ? 'frame ' + frame.name : 'anchor parent'})` };
  }
  const R = card?.eyeRig?.settings?.R;
  if (R > 0) return { r: R * worldScale(THREE, a.node), shell: null, src: 'card eyeRig.settings.R (anchor frame)' };
  const ex = a.node.userData && (a.node.userData.radius || a.node.userData.kfb?.radius);
  if (ex > 0) return { r: ex * worldScale(THREE, a.node), shell: null, src: 'node extras radius' };
  return null;
}

/**
 * Mount EyeRig v6 + E2 on a figure (call after the figure is placed and clayed, in bind pose).
 * opts: { card, applyClay (kfb-clay applyClay), clayRef (figure height, world), seed }
 * returns { status: 'OK'|'NO_ANCHORS'|'NO_RADIUS'|'ERROR', seat, reason, rig, skin, eyes(), setState(name), report }
 */
export function mountEyes(THREE, figure, { card = null, applyClay = null, clayRef = 1.8, seed = 'kfb', anchorFrame = false } = {}) {
  const found = findEyeSeat(figure, card);
  if (!found.seat) return { status: 'NO_ANCHORS', seat: null, reason: found.reason };
  figure.updateMatrixWorld(true);
  const er = card?.eyeRig || {}, ro = rigOptions(card);
  const lidHex = er.lid?.colour || null;
  const makeMat = (o) => new THREE.MeshStandardMaterial({ color: lidHex ? new THREE.Color(lidHex) : new THREE.Color(o.color), roughness: 0.9, metalness: 0, name: 'kfb-lid' });
  let ctx, host = null, place = null, socketInnerR = null, radiusSrc = null, single = false;

  if (found.seat === 'card-facehost') {
    host = buildFaceHost({ THREE, figure });
    if (host.status !== 'OK') return { status: 'ERROR', seat: found.seat, reason: 'facehost: ' + (host.reason || host.status) };
    ctx = host.faceCtx(); ctx.o = { makeMat };
    radiusSrc = 'facehost + card eyeRig.settings.anchor (ring ' + (ro.anchor.ring ?? '-') + ')';
  } else {
    /* own host: a Group on the head bone (or the figure root) with an invisible proxy box named 'body' (the EyeRig contract) */
    const hb = headBone(figure), bone = hb || figure;
    const inner = new THREE.Group(); inner.name = 'KFB_EyeHost'; bone.add(inner);
    if (!hb) {                                                          // v1.2.5: no head bone (multi-figure or baked pose off the origin) -> host at the anchors' centre, turned to their gaze; before, both eyes landed on one anchor when the figure stood off the origin
      const c = new THREE.Vector3(), p = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
      for (const a of found.anchors) c.add(a.node.getWorldPosition(p)); c.multiplyScalar(1 / found.anchors.length);
      found.anchors[0].node.getWorldQuaternion(q); bone.getWorldScale(sc);
      new THREE.Matrix4().compose(c, q, sc).premultiply(new THREE.Matrix4().copy(bone.matrixWorld).invert()).decompose(inner.position, inner.quaternion, inner.scale);
    }
    inner.updateMatrixWorld(true);
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshBasicMaterial({ visible: false }));
    box.name = 'body'; box.castShadow = box.receiveShadow = false; box.userData.noMeasure = true; inner.add(box); inner.updateMatrixWorld(true);
    ro.anchor = { dx: 0.3, dy: 0, ring: 0.5, track: 0.15 };            // R = U·ring = 0.5 local; eyes are re-placed on the anchors below
    ctx = { THREE, inner, o: { makeMat }, _squash: null, getFaceShells: () => [] };
    const inv = new THREE.Matrix4().copy(box.matrixWorld).invert(), hs = worldScale(THREE, box);
    const seats = [];
    for (const a of found.anchors) {
      const m = new THREE.Matrix4().multiplyMatrices(inv, a.node.matrixWorld), p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
      m.decompose(p, q, s); const n = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
      let rLocal, shell = null;
      if (found.seat === 'kfb-anchor') {
        const rr = kfbAnchorRadius(THREE, figure, card, a);
        if (!rr) return { status: 'NO_RADIUS', seat: found.seat, reason: `kein Augenradius für ${a.node.name} (Karte: eyeRig.anchors.${a.side}.radius oder eyeRig.settings.R)` };
        rLocal = rr.r / hs; shell = rr.shell; radiusSrc = rr.src;
      } else {
        rLocal = (Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.z)) / 3;
        const seatK = 0.24 + (ro.inset || 0) * 1.15;
        p.addScaledVector(n, -rLocal * seatK); radiusSrc = `anchor scale (seat ${seatK.toFixed(2)} r behind the cap)`;
      }
      seats.push({ side: a.side, node: a.node.name, p, q, r: rLocal, shell });
    }
    single = seats.length === 1;
    /* v1.2.6: gaze fix – anchor +Z is the head-surface normal, which splays outward on round heads (orcs, Monstrosity); the eyes squinted
       outward and card converge was overwritten. Both eyes now look along the common forward (mean normal), turned inward by card converge. */
    if (seats.length >= 2) {
      const fwd = new THREE.Vector3(), cen = new THREE.Vector3();
      for (const x of seats) { fwd.add(new THREE.Vector3(0, 0, 1).applyQuaternion(x.q)); cen.add(x.p); }
      fwd.normalize(); cen.multiplyScalar(1 / seats.length);
      const conv = ro.converge || 0;
      for (const x of seats) {
        const n0 = new THREE.Vector3(0, 0, 1).applyQuaternion(x.q);
        const inward = cen.clone().sub(x.p); inward.addScaledVector(fwd, -inward.dot(fwd)); if (inward.lengthSq() > 1e-12) inward.normalize();
        const d = fwd.clone().addScaledVector(inward, conv).normalize();
        x.q = new THREE.Quaternion().setFromUnitVectors(n0, d).multiply(x.q);
      }
    }
    socketInnerR = seats.some((x) => x.shell) ? (e, i) => { const x = single ? seats[0] : seats.find((t) => Math.sign(t.p.x) === Math.sign(e._sx)) || seats[i]; return x && x.shell ? x.shell : null; } : null;
    place = (rig) => {
      if (!rig.eyes) return;
      rig.eyes.forEach((e, i) => {
        const x = single ? (i === 0 ? seats[0] : null) : (seats.find((t) => Math.sign(t.p.x) === Math.sign(e._sx)) || seats[i]);
        if (!x) { e.visible = false; return; }
        e.position.copy(x.p); e.quaternion.copy(x.q); e.scale.setScalar(x.r / rig._R);
      });
      rig._max = rig._R * 0.3;
    };
    host = { inner, box, dispose() { inner.removeFromParent(); box.geometry.dispose(); } };
  }

  const rig = new EyeRig(ctx, ro);
  if (place) { const b0 = rig.build.bind(rig); rig.build = (...a) => { const r = b0(...a); place(rig); return r; }; }
  const skin = attachClaySkin(rig, THREE, { socketInnerR, claySeed: 0 });   // E2 rides the build hook (eyeForward 0 = v1 module)
  rig.build();
  if (!rig.eyes || !rig.eyes.length) { host?.dispose?.(); return { status: 'ERROR', seat: found.seat, reason: 'EyeRig baute keine Augen' }; }
  rig.setLife({ on: false, wander: 0, tremor: 0 }); rig.setKinetics({ enabled: false });
  rig.rig.traverse((m) => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; m.userData.eyeRig = true; } });
  /* lid clay: convert the (hidden) v6 upper shell material; the E2 skin shares it via skin.sync() */
  if (applyClay) for (const e of rig.eyes) applyClay(e._up, THREE, { profile: 'character', seed: seed + ':lid', scaleRef: clayRef, skip: () => false });
  skin.sync();

  const visibleEyes = () => rig.eyes.filter((e) => e.visible);
  const setState = (name, frames = 240) => {
    const t = LID_STATES[name] || LID_STATES.rest;
    rig.applyEmote({ lidUpper: t.u - rig._rest.u, lidLower: t.l - rig._rest.l, slant: 0, pupil: 'normal', gaze: 'center' });
    for (let k = 0; k < frames; k++) { if (rig._blinkK < 0) rig._blinkT = 1e9; rig.update(1 / 60); }
    skin.sync();
  };
  const report = () => ({
    version: EYES_VERSION, seat: found.seat, anchors: found.anchors.map((a) => a.node.name), radiusSource: radiusSrc,
    eyes: visibleEyes().length, lidSkins: visibleEyes().filter((e) => e._claySkin && e._claySkin.name === LID_SKIN_NAME).length,
    v6ShellsVisible: visibleEyes().reduce((n, e) => n + (e._up.visible ? 1 : 0) + (e._lo.visible ? 1 : 0), 0),
    fit: skin.fit.map((v) => +v.toFixed(4)), lidColour: lidHex || 'v6 base-darkened',
    aperture: visibleEyes().map((e) => { const v = lidValuesFromV6(e); return { cu: +v.cu.toFixed(3), cl: +v.cl.toFixed(3) }; }),
    settings: { pupilStyle: ro.pupilStyle, pupilSize: ro.pupilSize, gloss: ro.gloss, inset: ro.inset, lidFit: ro.lidFit, anchor: found.seat === 'card-facehost' ? ro.anchor : 'seat from anchors' },
  });
  return { status: 'OK', seat: found.seat, rig, skin, host, eyes: visibleEyes, setState, report };
}

/* v1.2.3: figure subtrees with their own eye anchors. A figure root is the highest node above an anchor (below the file root) whose
   anchors repeat no side (at most one L, one R, one C). Returns { multi, seat, figures: [{ root, anchors }] }; multi only with >= 2 groups. */
export function findEyeFigures(root, card) {
  const found = findEyeSeat(root, card), none = { multi: false, seat: found.seat, figures: [] };
  if ((found.seat !== 'kfb-anchor' && found.seat !== 'eye-anchor') || found.anchors.length < 2) return none;
  const under = (o, r) => { for (let n = o; n; n = n.parent) if (n === r) return true; return false; };
  const dup = (node) => { const c = {}; for (const a of found.anchors) if (under(a.node, node)) { if (c[a.side]) return true; c[a.side] = 1; } return false; };
  const groups = new Map();
  for (const a of found.anchors) {
    let top = null;
    for (let n = a.node.parent; n && n !== root; n = n.parent) { if (dup(n)) break; top = n; }
    if (!top) return none;                                              // anchor hangs directly under the root or under a mixed node: one figure, as before
    if (!groups.has(top)) groups.set(top, []); groups.get(top).push(a);
  }
  if (groups.size < 2) return none;
  return { multi: true, seat: found.seat, figures: [...groups].map(([r, anchors]) => ({ root: r, anchors })) };
}

/* v1.2.3: one EyeRig v6 + E2 set per figure subtree; a single figure goes through mountEyes(root) unchanged (byte-identical renders).
   The multi handle has the mountEyes interface (status, seat, eyes(), setState(), report()) plus figures[] (one mountEyes handle each). */
export function mountEyesAll(THREE, root, opts = {}) {
  const F = findEyeFigures(root, opts.card);
  if (!F.multi) return mountEyes(THREE, root, opts);
  const figures = F.figures.map((f, i) => ({ index: i, name: f.root.name || 'figure_' + i, root: f.root, anchors: f.anchors.map((a) => a.node.name), h: mountEyes(THREE, f.root, { ...opts, anchorFrame: true }) }));
  const ok = figures.filter((f) => f.h.status === 'OK');
  const bad = figures.filter((f) => f.h.status !== 'OK');
  const eyes = () => ok.flatMap((f) => f.h.eyes());
  const setState = (name, frames) => { for (const f of ok) f.h.setState(name, frames); };
  const report = () => {
    const per = figures.map((f) => (f.h.status === 'OK' ? { figure: f.name, status: 'OK', ...f.h.report() } : { figure: f.name, status: f.h.status, reason: f.h.reason || null, anchors: f.anchors }));
    const okR = per.filter((r) => r.status === 'OK');
    return {
      version: EYES_VERSION, seat: F.seat, multi: true, figureCount: figures.length, figuresOK: okR.length,
      anchors: figures.flatMap((f) => f.anchors), radiusSource: okR[0]?.radiusSource || null,
      eyes: okR.reduce((n, r) => n + r.eyes, 0), lidSkins: okR.reduce((n, r) => n + r.lidSkins, 0), v6ShellsVisible: okR.reduce((n, r) => n + r.v6ShellsVisible, 0),
      fit: okR.flatMap((r) => r.fit), lidColour: okR[0]?.lidColour || null, aperture: okR.flatMap((r) => r.aperture), settings: okR[0]?.settings || null,
      figures: per,
    };
  };
  return { status: ok.length ? 'OK' : bad[0].h.status, multi: true, seat: F.seat, reason: bad.length ? bad.map((f) => `${f.name}: ${f.h.status} ${f.h.reason || ''}`.trim()).join(' · ') : null,
    figures, eyes, setState, report };
}
