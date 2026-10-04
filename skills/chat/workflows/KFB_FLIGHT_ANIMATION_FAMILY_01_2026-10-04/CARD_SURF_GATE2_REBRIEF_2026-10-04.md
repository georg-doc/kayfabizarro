# KFB Flight Animation Family 01 · CARD_SURF Gate 2 Rebrief · 2026-10-04

Status: **CURRENT GATE-2 OVERRIDE · BLENDER REVIEW RIG ONLY · NO RUNTIME OWNER CHANGE**
Executor: **Blender MCP / Coworker**
Owner split:
- world flight position / steering / camera: **Travel**
- card vehicle presentation/deformation: **Travel `card-carrier.js`**
- card ink: **KFB Ink Canon**
- rider animation/presentation: **Animation/Motion authoring**
- this Blender slice: **review/fit evidence only**

## Why this rebrief exists

Do **not** continue by building a generic or rigid 3D card from memory.

The old rigid card used for flight acceptance / rig measurement is **not** the production donor.

Gate 2 must use the current Travel flying-card owner as its behavioral/geometry source and the current KFB Ink / Combat Arena card-edge fixes as its visual source.

Blender may recreate a review surrogate so the Mannequin can be posed and inspected, but that surrogate is **not allowed to become a second card runtime**.

## Read first · exact sources

### Gate 1
- `skills/chat/workflows/KFB_FLIGHT_ANIMATION_FAMILY_01_2026-10-04/RETURN_GATE1/KFB_FLIGHT_FAMILY_01_RETURN_GATE1.md`
  - branch: `georg-doc-patch-3`
  - blob: `5e164fbeb9b839876efe25e4c1c20c98e1a5662f`

### Travel card owner
- `travel/wip/travel_globe_wsa/terrain-planets-v1/card-carrier.js`
  - current main blob: `2eef4db5aa38fffc8e9c23457815e3be12fc3bd8`
  - current reviewed main head at rebrief time: `ffeb161d7c09c64436fbdf1dc83ce2b71e8f8a74`

### Travel ownership contract
- `travel/wip/travel_globe_wsa/CONTRACT.md`
  - blob: `f61494659b8e111c261c59acd1aa58e01c9edd7c`
- `travel/wip/travel_globe_wsa/docs/reference/OWNER_BOUNDARIES.md`
  - blob: `67edd9d40648653aca0e9adad34d93aee25991af`

### KFB Ink owner
- `skills/kfb-ink-canon.js`
  - blob: `55ce6da2805386bd6373d81d064a37fc7e0efacb`
  - `INK_COLOR = #1f1a14`
  - cards use **BAND** / preset `card`, not a jittered 3D outline.
- `skills/SSOT_Card_Ink_Outline_v2.md`
  - blob: `94d15871a28422b081bfb05c1957ffc2755e209a`

### Combat / card-edge evidence
- `skills/kfb-embed-bundle v3/SOP_KFB-Karte-und-Tuschekante.md`
  - blob: `44b7c8184ddab441a31f4323367dbfc5768bfeba`
- `KFB Combat Arena/combat-arena-v1/arena-ring.v1.js`
  - blob: `102f6eb10283936ccc9863ab3d1b0a7aff602516`
- `KFB Combat Arena/docs/LIVING_combat-arena-v2.md`
  - blob: `abc264188c33baf15fba28193841c7c4e556ccdd`

## Non-negotiable owner rule

**Travel remains the flight/card owner.**

Blender must not create:
- world movement;
- banking physics;
- barrel-roll physics;
- flight camera;
- second card-carrier runtime.

Travel supplies those values later.

Blender Gate 2 proves only:
- source-faithful card geometry/look;
- deformation/readability;
- rider fit;
- rider reaction poses.

## Current Travel card facts to reproduce

From `card-carrier.js`:

- width `CW = 3.0`
- depth `CD = 3.0 × 447/800 = 1.67625`
- top grid = `10 × 14` subdivisions
- physical thickness = `0.055`
- local axes:
  - X = card left/right
  - Y = up
  - Z = flight axis
  - **+Z = rear / trailing edge**
  - flight forward is toward −Z
- barrel roll = whole card root around local Z
- seat starts around:
  - X = 0
  - Z = `CD × 0.12 ≈ 0.20115`
  - Y is **not** a fixed final height; it follows the deformed surface
- seat footprint donor = `0.13`
- calm/reading lectern = `0.175 rad ≈ 10°`
- top/bottom/skirt bend as **one slab**
- actual rider seat aligns to the card surface normal.

## Visual contract · important correction

### 1 · Face ink is 2D KFB ink, not extruded 3D geometry

The KFB rule is explicit:

**“Die Tusche liegt auf der Bildebene, nicht in der Welt.”**

Do not build a thick 3D outline around the card.

The visible face/back outline must come from the current `kfb-ink-canon.js` **card BAND** family or an already-generated texture made from that exact canon.

Do not copy the older custom `inkPerimeter/drawInkOutline` stroke from `card-carrier.js` as the new visual canon.

### 2 · No bright / cream / white slab sides

The Combat Arena fix is binding for this review target:

- side / thickness material: **KFB ink black `#1f1a14`**
- roughness target: **0.92**
- no glossy bevel highlight
- no pale paper-colored side wall
- no white/cream flat strip visible at grazing angle.

The Travel runtime currently has an older dark-brown skirt value.
For Gate 2, use the current Ink/Combat target so we can judge the intended final look.

This does **not** authorize Blender to patch Travel runtime.
WSA/Travel may later reconcile the runtime skirt to the accepted visual result.

### 3 · No transparent gutter around the face

The Travel donor already documents the old “hellblaues Gutter” failure.

For Blender review:
- card face/background must be fully opaque beneath the ink;
- no alpha gap between paper/art and the black contour;
- inspect specifically at low/grazing camera angles.

### 4 · Face should read as printed surface, not a shiny plastic slab

Do not let scene exposure create a white clipped rim.

Use a stable print-like, high-roughness face for review.
Do not invent a glossy PBR card.

## Gate 2A · isolate the card BEFORE adding the Mannequin

First show the card alone.

Required source proof:
1. neutral/flat;
2. front;
3. 3/4;
4. side/grazing;
5. underside.

Acceptance for 2A:
- dimensions and thickness match the Travel owner;
- top/backside texture is source-backed;
- face outline reads as KFB BAND ink;
- side wall is `#1f1a14`, not pale;
- no halo/gutter;
- no second decorative outline;
- no bright bevel strip.

If this proof is wrong, stop there.
Do not add the rider to a wrong card.

## Gate 2B · build a deformation-capable REVIEW hierarchy

Preferred review hierarchy:

```
CARD_WORLD_ROOT
└─ CARD_VISUAL
   ├─ CARD_SURFACE
   └─ SEAT_FRAME
      └─ MANNEQUIN_ROOT
```

### CARD_WORLD_ROOT

Review-only proxy for the transform that Travel owns later.

- no baked translation;
- no scale animation;
- barrel roll preview happens here around local Z;
- do not export it as a new flight-physics owner.

### CARD_VISUAL

Review proxy for the current Travel presentation layer:
- local pitch;
- local bank/roll spring;
- calm lectern;
- mild sway.

### CARD_SURFACE

Must remain one deforming slab:
- top deforms;
- bottom follows it;
- black side/skirt follows the same rim;
- no gap opens during bend.

Use whatever Blender mechanism is cleanest for review:
- shape keys,
- lattice,
- local armature,
- or a combination.

But preserve one neutral source shape and make every deformation reversible.

### SEAT_FRAME

Must follow:
- deformed surface height;
- deformed surface normal.

Do not keep the Mannequin on a fixed horizontal plane while the card bends.

## Required CARD_SURF review states

Build and show these states from front / 3/4 / side:

1. **SOURCE_NEUTRAL**
   - exact flat source geometry.

2. **CALM_LECTERN**
   - calm card;
   - ~10° reading/hover tilt;
   - very mild wind motion.

3. **CRUISE**
   - shallow traveling wave;
   - readable surf stance.

4. **BOOST**
   - stronger travel pose;
   - rear/trailing edge lift;
   - no rigid plank look.

5. **BANK_LEFT**
   - whole-card bank is previewed at root;
   - local card cup/flex is also visible;
   - rider reacts, but does not own the world roll.

6. **BANK_RIGHT**
   - mirrored.

7. **CLIMB**
   - Travel root/pitch preview + local card response.

8. **DIVE**
   - same owner split.

9. **BRAKE / RECOVER**
   - card settles toward calm/hover.

10. **BARREL_ROLL**
   - rotate **CARD_WORLD_ROOT** around local Z;
   - show at least 0° / 90° / 180° / 270° / 360°;
   - card surface does not fake the roll with mesh twist;
   - Mannequin may have a reaction pose, but the reaction must not duplicate the root rotation.

11. **LAND / HOVER PREP**
   - card returns to a stable hover/lectern presentation;
   - no new landing physics.

## Mannequin rule

Gate-1 decision F3 remains binding:

- CARD_SURF rider = **KayKit Mannequin**
- not ActionFigure
- use the accepted TMB-1E **2.0× rider-scale relation** as the initial reference.

The Mannequin remains a separate Actor root.

Do not:
- skin the Mannequin into the card armature;
- merge card + Actor into one mesh;
- use Combat Mech SELF_FLIGHT clips for the surfing rider.

CARD_SURF is a separate rider-pose family.

## Rider behavior to author/review

The rider should visibly respond to the card rather than stand frozen:

- calm stance / balance;
- cruise lean;
- boost brace;
- bank left/right counterbalance;
- climb/dive weight shift;
- brake/recover;
- barrel-roll reaction.

Use KayKit source clips as donors where useful, then authored offsets only where source gaps are proven.

Do not invent world translation/root motion.

## Production recommendation

**Preferred runtime path: keep Travel `card-carrier.js`.**

The Blender card is a **review/fit rig**, not a replacement vehicle.

If Gate 2 proves a better neutral card mesh or useful deformation controls, WSA may later decide to:
- keep Travel's existing vertex deformation on a cleaned neutral mesh; or
- map Travel's existing input values to approved morph/bone controls.

Either way:
Travel still owns:
- world position;
- bank;
- pitch;
- boost;
- climb;
- barrel-roll intent;
- card-vehicle state.

## Deliverables

Place under:
`skills/chat/workflows/KFB_FLIGHT_ANIMATION_FAMILY_01_2026-10-04/RETURN_GATE2/`

Required:
- `KFB_CARD_SURF_GATE2_RETURN.md`
- `CARD_SURF_SOURCE_PROOF.png`
- `CARD_SURF_DEFORM_REVIEW.mp4`
- `CARD_SURF_MANNEQUIN_REVIEW.mp4`
- `KFB_CARD_SURF_REVIEW_RIG.blend`
- optional review GLB if cleanly exportable
- `KFB_CARD_SURF_GATE2_manifest.json`

Manifest must record:
- exact source refs;
- dimensions;
- local axes;
- material values;
- controls/shape keys/bones;
- seat position/normal rule;
- which states are KEEP / HOLD / REJECT;
- what is review-only vs runtime candidate.

## Return questions for Georg

Ask only product-visible questions:

1. Does the card read as the **Travel flying card**, not a rigid board?
2. Do idle/cruise/boost/bank/roll deformations feel right?
3. Does the Mannequin stay planted and react naturally?
4. Is the black KFB edge clean from grazing angles, with **no light slab sides or halo**?

Do not ask Georg to approve implementation details that can be tested mechanically.

## Stop rules

- If the isolated card fails the source/look proof, stop before rider authoring.
- Do not repair the old rigid acceptance card.
- Do not create a second Travel card owner.
- Do not use a generic replacement card.
- Do not start Superhero / Ultra Turbo Hero Man in this gate.
- No merge / Runtime / Stage / Live promotion from Blender Gate 2.
