/* clay-skin-attach.v2.js — R1b (Georg 17.10. TUNE: »Augen sitzen zu tief im Sockel«). v1 + eyeForward + socketOpeningDeg.
   v1 stays unchanged next to this file. Everything below the v2 note is v1 behaviour.
   v2 · eyeForward (R, per eye | array | function, default 0): moves the whole eye unit (sclera, pupil, lids group with the E2
        skin) along its own gaze axis (+Z of e, in the parent frame), robust to a host that re-places e every frame (dangle).
   v2 · socketOpeningDeg (deg from the gaze axis, where the shell starts = inner edge of the opening; default null):
        fit with a forward eye. Inside a sphere shell of radius b (socketInnerR) around the ORIGINAL eye centre, an eye moved
        forward by f must keep its skin inside the shell wherever the shell exists (θ ≥ α). The farthest skin point in that
        region lies on the cone θ = α: r(α) = f·cos α + √(a² − f²·sin² α) ≤ b' (b' = b − socketPlay). Hence
          a_max = √(b'² − 2·b'·f·cos α + f²),   s = min(1, a_max / skinOuterMax).
        f = 0 gives path A exactly (a_max = b'). socketOpeningDeg null with f > 0 → α = 0 (closed shell, conservative: s = (b'−f)/1.124).
        Gap skin ↔ shell at the opening edge = socketPlay, i.e. no visible gap and no poke-through where the shell is.
   ----- v1 note ----- */
/* clay-skin-attach.v1.js — puts the approved KFB Clay-Lid E2 (one closed lid skin, V-348 PASS 16.10.) onto EyeRig v6.
   ONE shared module for ToolBox-Studio (WSA) and the game (WS1). Vendor it together with clay-eyelid.v3/v2/v1.js.
   Recipe: ALIEN_STALK_E2_PLAN.md §3 (repo e1e60edff) — no second eye owner, pet-eye-rig.v6.js is not changed.

   What it does, per eye, after every rig.build():
     · hides the v6 lid shells: e._up.visible = e._lo.visible = false (not deleted — v6 keeps writing rotation.x, we read it).
       NOTHING else is put in their place. Lashes are children of _up and disappear with it (both aliens: lashes 0).
     · adds exactly ONE mesh `lid_skin` (E2 geometry, clay-eyelid.v3) as child of e._lids, so the v6 slant
       (_lids.rotation.z), eye placement, eyeFollow and any eyeoval scaling of e/_lids apply without own code.
     · flags as v6: userData.petOverlay = true, raycast = noop, frustumCulled = false, castShadow = false.
     · material = e._up.material (whatever the host makeMat produced; re-synced if reskinLids() swaps it).
       Lid colour is therefore the host's decision (WS0 16.10.: host lidColour as is, no ×0.72 — set that in makeMat).
   Per frame, after rig.update(dt):
     cu = (1.30 + e._up.rotation.x) / 1.18, cl = (1.30 − e._lo.rotation.x) / 1.18 → apertureV6(cu, cl) → updateClayEyelidSkin.
     Only positions/normals change; index buffer and vertex count stay constant (tests/clay-skin-attach.test.mjs).
   Fit in a baked socket shell (plan §5, WS0 decision: path A):
     opts.socketInnerR (in units of R, e.g. 1.10) → eye AND skin are scaled together by
     s = min(1, (socketInnerR − socketPlay) / skinOuterMax) = (1.10 − 0.006) / 1.124 = 0.9733 for the 1.10 R shell.
     Default: none → s = 1, no scaling. The E2 shape stays exactly the approved one; the eye gets ~3 % smaller.
     The socket shell itself is never hidden, replaced or covered by this module. */
import { clayEyelidSkinGeometry, updateClayEyelidSkin, apertureV6, DEFAULTS2, skinOuterMax } from './clay-eyelid.v3.js';

export const CLAY_SKIN_ATTACH_SCHEMA = 'kfb.clay-skin-attach/2';
export const LID_SKIN_NAME = 'lid_skin';
const V6_LID_BASE = 1.30, V6_LID_GAIN = 1.18, V6_C_MIN = -0.35, V6_C_MAX = 1;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* EyeRig v6 lid values back from the shell rotations (inverse of v6 update(): up.rotation.x = −(1.30 − cu·1.18)). */
export function lidValuesFromV6(e) {
  return {
    cu: clamp((V6_LID_BASE + e._up.rotation.x) / V6_LID_GAIN, V6_C_MIN, V6_C_MAX),
    cl: clamp((V6_LID_BASE - e._lo.rotation.x) / V6_LID_GAIN, V6_C_MIN, V6_C_MAX),
  };
}

/* Path A scale factor (v1), extended in v2 by a forward eye. socketInnerR, socketPlay, eyeForward in units of R; opening in deg.
   No / invalid socket → 1 (a forward eye without a socket is not scaled). */
export function fitScale(socketInnerR, socketPlay = 0.006, skinOpts = {}, eyeForward = 0, socketOpeningDeg = null) {
  if (!(socketInnerR > 0)) return 1;
  const b = socketInnerR - socketPlay, f = Math.max(0, eyeForward || 0);
  const ca = socketOpeningDeg == null ? 1 : Math.cos(socketOpeningDeg * Math.PI / 180);
  const aMax = f > 0 ? Math.sqrt(Math.max(0, b * b - 2 * b * f * ca + f * f)) : b;
  return Math.min(1, aMax / skinOuterMax(skinOpts));
}
/* Where the eye's front and the opening rim sit along the gaze axis, in R of the ORIGINAL (host-placed) eye. */
export function eyeDepthReport({ s = 1, eyeForward = 0, socketInnerR = 1.10, socketOpeningDeg = 58, rimRadius = 0.075, rimOutward = true } = {}) {
  const a = socketOpeningDeg * Math.PI / 180, apex = eyeForward + s * 1.004, equator = eyeForward;
  const rimFront = socketInnerR * Math.cos(a) + (rimOutward ? rimRadius : 0);
  const rhoOpen = socketInnerR * Math.sin(a) - (rimOutward ? 0 : 2 * rimRadius);
  return { apex, rimFront, protrusion: apex - rimFront, equatorBehindRim: rimFront - equator, rhoOpen,
    frontCoverOfEyeRadius: Math.max(0, 1 - rhoOpen / s) };
}

/**
 * attachClaySkin(rig, THREE, opts) → handle
 * @param rig   EyeRig v6 instance (pet-eye-rig.v6.js). May be built already or not.
 * @param THREE three.js namespace (the host's, so geometry classes match).
 * @param opts  {
 *   socketInnerR: null | number | number[] | (eye, index) => number   inner radius of a baked socket shell, units of R (default null = no scaling)
 *   socketPlay:   0.006                                               clearance kept to the shell, units of R
 *   socketOpeningDeg: null | number | number[] | fn                   v2: inner edge of the opening (deg from gaze) for the forward fit
 *   eyeForward:   0 | number | number[] | (eye, index) => number      v2: move the eye unit along its gaze, units of host R
 *   skin:         {}                                                  E2 overrides (clay-eyelid DEFAULTS2 keys); default = the approved E2
 *   claySeed:     0                                                   per-geometry seed for clay-material v10 (eye index is added)
 *   autoUpdate:   true                                                wrap rig.update so sync() runs after every rig.update(dt)
 *   epsilon:      0.1                                                 aperture change (deg) below which the geometry is not rebuilt.
 *                                                                     One rebuild costs ~5 ms per eye (Node, Apple silicon); v6 'life' tremor
 *                                                                     moves the lid ~0.06°, so 0.1 skips tremor-only frames (0.1° ≈ 0.002 R).
 *   settleFrames: 10                                                  a smaller change is applied after this many frames (no lasting offset)
 * }
 * handle: { schema, sync(), detach(), skins, fit, forward, rig, opts }
 */
export function attachClaySkin(rig, THREE, opts = {}) {
  if (!rig || typeof rig.build !== 'function' || typeof rig.update !== 'function') throw new TypeError('attachClaySkin: EyeRig v6 instance expected');
  if (!THREE || !THREE.BufferGeometry) throw new TypeError('attachClaySkin: THREE namespace expected');
  if (rig.__kfbClaySkin) return rig.__kfbClaySkin;                       // idempotent: one skin per eye, ever
  const o = Object.assign({ socketInnerR: null, socketPlay: 0.006, socketOpeningDeg: null, eyeForward: 0, skin: {}, claySeed: 0, autoUpdate: true, epsilon: 0.1, settleFrames: 10 }, opts);
  const skinOpts = Object.assign({}, DEFAULTS2, o.skin || {});
  const origBuild = rig.build, origUpdate = rig.update;
  const live = new Set();                                                // geometries we own (disposed on rebuild/detach)

  const perEye = (v, e, i) => {
    if (typeof v === 'function') return v(e, i);
    if (Array.isArray(v)) return v[i] != null ? v[i] : v[0];
    return v;
  };
  const socketFor = (e, i) => perEye(o.socketInnerR, e, i);
  const Z = new THREE.Vector3(), tmp = new THREE.Vector3();
  /* eyeForward: e.position = host position + gaze·f·R_host. Re-applied when the host writes position or quaternion. */
  const enforceForward = (e) => {
    const w = e.userData.__claySkinFwd; if (!w || !w.f) return;
    const fit = e.userData.__claySkinFit, sNow = fit ? fit.s : 1;
    const posSame = w.applied && e.position.equals(w.applied), qSame = w.q && e.quaternion.equals(w.q);
    if (posSame && qSame) return;
    if (!posSame) w.base = e.position.clone();                            // host re-placed the eye: that is the new base
    const Rh = rig._R * (e.scale.x / sNow);                               // host-placed eye radius in the parent frame
    Z.set(0, 0, 1).applyQuaternion(e.quaternion);
    e.position.copy(w.base).addScaledVector(Z, w.f * Rh);
    w.applied = e.position.clone(); w.q = e.quaternion.clone();
  };
  const enforceFit = (e) => {
    const f = e.userData.__claySkinFit; if (!f || f.s === 1) return;
    if (f.applied && e.scale.equals(f.applied)) return;                 // host has not touched the scale since we applied it
    f.base = e.scale.clone(); e.scale.multiplyScalar(f.s); f.applied = e.scale.clone();
  };
  const apertureOf = (e) => { const { cu, cl } = lidValuesFromV6(e); return apertureV6(cu, cl, skinOpts); };

  function attachEye(e, i) {
    if (!e || !e._lids || !e._up || !e._lo) return;
    if (e._claySkin && e._claySkin.parent === e._lids) return;
    e._up.visible = false; e._lo.visible = false;
    const ap = apertureOf(e);
    const geo = clayEyelidSkinGeometry(THREE, Object.assign({}, skinOpts, { radius: rig._R, aperture: ap, claySeed: (o.claySeed || 0) + i }));
    live.add(geo);
    const skin = new THREE.Mesh(geo, e._up.material);
    skin.name = LID_SKIN_NAME;
    skin.userData.petOverlay = true; skin.userData.kfbClaySkin = CLAY_SKIN_ATTACH_SCHEMA;
    skin.raycast = () => {}; skin.frustumCulled = false; skin.castShadow = false;
    e._lids.add(skin);
    e._claySkin = skin; e._claySkinAp = ap; e._claySkinWait = 0;
    const fwd = Math.max(0, +perEye(o.eyeForward, e, i) || 0);
    const s = fitScale(socketFor(e, i), o.socketPlay, skinOpts, fwd, perEye(o.socketOpeningDeg, e, i));
    e.userData.__claySkinFit = { s, base: null, applied: null };
    e.userData.__claySkinFwd = { f: fwd, base: null, applied: null, q: null };
    enforceFit(e); enforceForward(e);
  }
  function attachAll() {
    const keep = new Set();
    if (rig.eyes) rig.eyes.forEach((e, i) => { attachEye(e, i); if (e && e._claySkin) keep.add(e._claySkin.geometry); });
    for (const g of live) if (!keep.has(g)) { g.dispose(); live.delete(g); }   // skins of eyes that build() threw away
  }
  function sync() {
    if (!rig.eyes) return;
    for (const e of rig.eyes) {
      const skin = e && e._claySkin; if (!skin) continue;
      if (e._up.visible) e._up.visible = false;                           // nothing else may show a shell
      if (e._lo.visible) e._lo.visible = false;
      if (skin.material !== e._up.material) skin.material = e._up.material;
      enforceFit(e); enforceForward(e);
      const ap = apertureOf(e), p = e._claySkinAp;
      const d = p ? Math.max(Math.abs(ap.U - p.U), Math.abs(ap.L - p.L), Math.abs(ap.A - p.A)) : Infinity;
      if (d < 1e-6) { e._claySkinWait = 0; continue; }                     // exact: nothing to do
      if (d < o.epsilon && ++e._claySkinWait < o.settleFrames) continue;  // small change: catch up after settleFrames
      updateClayEyelidSkin(skin.geometry, Object.assign({}, skinOpts, { radius: rig._R, aperture: ap }));
      e._claySkinAp = ap; e._claySkinWait = 0;
    }
  }
  function detach() {
    rig.build = origBuild; rig.update = origUpdate;
    if (rig.eyes) for (const e of rig.eyes) {
      if (!e) continue;
      if (e._claySkin) { e._claySkin.removeFromParent(); e._claySkin = null; e._claySkinAp = null; }
      const f = e.userData.__claySkinFit;
      if (f && f.base && f.applied && e.scale.equals(f.applied)) e.scale.copy(f.base);
      delete e.userData.__claySkinFit;
      const w = e.userData.__claySkinFwd;
      if (w && w.base && w.applied && e.position.equals(w.applied)) e.position.copy(w.base);
      delete e.userData.__claySkinFwd;
      if (e._up) e._up.visible = true; if (e._lo) e._lo.visible = true;
    }
    for (const g of live) g.dispose(); live.clear();
    delete rig.__kfbClaySkin;
  }

  rig.build = function (...a) { const r = origBuild.apply(this, a); attachAll(); return r; };
  if (o.autoUpdate) rig.update = function (...a) { const r = origUpdate.apply(this, a); sync(); return r; };
  const handle = {
    schema: CLAY_SKIN_ATTACH_SCHEMA, rig, opts: o, sync, detach,
    get skins() { return rig.eyes ? rig.eyes.map((e) => (e && e._claySkin) || null) : []; },
    get fit() { return rig.eyes ? rig.eyes.map((e) => (e && e.userData.__claySkinFit ? e.userData.__claySkinFit.s : 1)) : []; },
    get forward() { return rig.eyes ? rig.eyes.map((e) => (e && e.userData.__claySkinFwd ? e.userData.__claySkinFwd.f : 0)) : []; },
  };
  rig.__kfbClaySkin = handle;
  if (rig.eyes) attachAll();
  return handle;
}
