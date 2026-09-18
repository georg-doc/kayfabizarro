# Eumel Rig Lab · RETURN

Updated: 2026-09-18  
Status: IMPLEMENTATION · R2 STATIC SANITY PASS · BROWSER RETEST PENDING

## Human browser feedback that drove r2

Georg's screenshots/freeplay established:

- the source-exact actor and animation direction are useful;
- leg swing detached visually because the old transform-origin approximation was not a proper hip bone;
- the authored one-leg/angled source stance is unsuitable as the reusable locomotion bind;
- a basic limb rig should allow restrained bend plus squash/stretch;
- many isolated component-atlas cells were blank;
- 2D eye control should reuse the existing KFB EyeRig semantics rather than become a new control grammar;
- the DocCheck face/eye source collection is richer than the current FrankenStein surface and needs a separate modifier-atlas inventory.

This feedback is **not** recorded as a PASS; it is defect evidence plus accepted direction.

## r2 implementation

### Neutral bind / bones

- source pose remains available unchanged for QA;
- neutral bind centers the body on the page;
- source leg major axes were measured and corrected toward vertical:
  - leg-A correction: ~42.248°
  - leg-B correction: ~14.337°
- explicit fixed hip anchors are stored in `data/neutral_bind_pose.json`;
- leg swing is now applied around those hip bones;
- optional lower-leg proxy provides a restrained knee bend without changing source paths;
- leg stretch/squash acts on bone wrappers only;
- added a neutral-based procedural walk cycle.

### EyeRig unification

Shared protocol:

`tools/2D Animation Studio/shared/eye-rig/eye-rig-protocol.v1.json`

2D adapter:

`tools/2D Animation Studio/shared/eye-rig/eye-rig-2d-adapter.v1.js`

The API mirrors the existing 3D EyeRig-v6 public seam:

`eyeFrame · setBlink · blinkNow · setGazeFollow · pointTo · applyEmote · setKinetics · setLife · update`

This allows shared semantic eye clips while 2D/3D differ in renderer output.

Current 2D blink/lid motion is a reversible wrapper fallback because the visible AD/PDF layer has not yet yielded canonical lid geometry. It is not promoted as final visual canon.

### Headwear / source semantics

The previously unresolved black/white foreground pair is visibly the large **hat/headwear** in Georg's browser screenshot. Only its semantic metadata changed; source path data did not.

### Component atlas

The old atlas fitted local group bounds against a root-transformed SVG, which caused blank cards.

r2 calculates each component bbox in root SVG coordinates before creating the isolated card viewBox. Browser retest is still required to prove 17/17 visible cards.

## Rich eye/face assets

Prepared shared lane:

- `shared/eye-rig/DONOR_MAP.md`
- `shared/eye-rig/FACE_MODIFIER_ATLAS.md`

Existing KFB donors are referenced rather than forked:
- EyeRig v6;
- BrowRig v2 and its public `eyeFrame()` seam;
- current EyeRig Batch handover;
- existing 3D sunglasses donor.

The richer DocCheck rings/lids/glasses/goggles set is not invented from memory. It requires native source-layer inventory and then plugs into the same EyeFrame attachment contract.

## Static evidence

`qa/STATIC_SANITY_R2_2026-09-18.md`

PASS:
- app / Bone2D / EyeRig2D syntax;
- rig/bind JSON;
- 17/17 source IDs present;
- site shared-script references.

## Next browser gate

Georg should now check:

1. **Neutral Bind** — both legs begin symmetrically under the body.
2. **Walk** — leg roots stay attached throughout the cycle.
3. **Hampelmann** — larger swing still keeps hips fixed.
4. **Bend** — ± small knee bend remains visually plausible and should normally stay near 0.
5. **Stretch / Squash** — cartoon deformation remains readable without destroying outline identity.
6. **EyeRig** — gaze sliders, pointer-follow, Blink Now, idle eye life.
7. **Atlas** — all 17 component cards visible.
8. **Hat** — follows head as an accessory and does not behave like an occlusion mask.
9. **Source pose** — still reconstructs the original authored stance for QA.

Only after that should r2 be called browser-tested or Georg-accepted.
