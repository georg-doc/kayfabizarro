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

export const CLAY_SKIN_ATTACH_SCHEMA = 'kfb.clay-skin-attach/1';
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

/* Path A scale factor. socketInnerR and socketPlay in units of R. No / invalid socket → 1. */
export function fitScale(socketInnerR, socketPlay = 0.006, skinOpts = {}) {
  if (!(socketInnerR > 0)) return 1;
  return Math.min(1, (socketInnerR - socketPlay) / skinOuterMax(skinOpts));
}

/**
 * attachClaySkin(rig, THREE, opts) → handle
 * @param rig   EyeRig v6 instance (pet-eye-rig.v6.js). May be built already or not.
 * @param THREE three.js namespace (the host's, so geometry classes match).
 * @param opts  {
 *   socketInnerR: null | number | number[] | (eye, index) => number   inner radius of a baked socket shell, units of R (default null = no scaling)
 *   socketPlay:   0.006                                               clearance kept to the shell, units of R
 *   skin:         {}                                                  E2 overrides (clay-eyelid DEFAULTS2 keys); default = the approved E2
 *   claySeed:     0                                                   per-geometry seed for clay-material v10 (eye index is added)
 *   autoUpdate:   true                                                wrap rig.update so sync() runs after every rig.update(dt)
 *   epsilon:      1e-4                                                aperture change (deg) below which the geometry is not rebuilt
 * }
 * handle: { schema, sync(), detach(), skins, fit, rig, opts }
 */
export function attachClaySkin(rig, THREE, opts = {}) {
  if (!rig || typeof rig.build !== 'function' || typeof rig.update !== 'function') throw new TypeError('attachClaySkin: EyeRig v6 instance expected');
  if (!THREE || !THREE.BufferGeometry) throw new TypeError('attachClaySkin: THREE namespace expected');
  if (rig.__kfbClaySkin) return rig.__kfbClaySkin;                       // idempotent: one skin per eye, ever
  const o = Object.assign({ socketInnerR: null, socketPlay: 0.006, skin: {}, claySeed: 0, autoUpdate: true, epsilon: 1e-4 }, opts);
  const skinOpts = Object.assign({}, DEFAULTS2, o.skin || {});
  const origBuild = rig.build, origUpdate = rig.update;
  const live = new Set();                                                // geometries we own (disposed on rebuild/detach)

  const socketFor = (e, i) => {
    const s = o.socketInnerR;
    if (typeof s === 'function') return s(e, i);
    if (Array.isArray(s)) return s[i] != null ? s[i] : s[0];
    return s;
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
    e._claySkin = skin; e._claySkinAp = ap;
    const s = fitScale(socketFor(e, i), o.socketPlay, skinOpts);
    e.userData.__claySkinFit = { s, base: null, applied: null };
    enforceFit(e);
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
      enforceFit(e);
      const ap = apertureOf(e), p = e._claySkinAp;
      if (p && Math.abs(ap.U - p.U) < o.epsilon && Math.abs(ap.L - p.L) < o.epsilon && Math.abs(ap.A - p.A) < o.epsilon) continue;
      updateClayEyelidSkin(skin.geometry, Object.assign({}, skinOpts, { radius: rig._R, aperture: ap }));
      e._claySkinAp = ap;
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
  };
  rig.__kfbClaySkin = handle;
  if (rig.eyes) attachAll();
  return handle;
}
