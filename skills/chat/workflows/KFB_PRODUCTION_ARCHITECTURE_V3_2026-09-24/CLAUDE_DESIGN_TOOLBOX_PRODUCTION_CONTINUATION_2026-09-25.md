# Claude Design · ToolBox Production Continuation · 2026-09-25

Status: **READY · CONTINUE CURRENT TOOLBOX-PRODUCTION-01 · DO NOT REBUILD**
Executor: Claude Design
Receiving owner: ToolBox / Web-GitHub Bridge
Current architecture: PR #204

## Outcome

Continue the existing **ToolBox Production-01** candidate that Georg has given a **PROCEED PASS**.

Do not create another ToolBox, Pose Lab, IK Lab, Animation Lab, EyeRig, Mouth runtime or Motion Library.

Keep the current product model:

# TAB 1 · STUDIO
Actor / Rig / Face / Look / Pose / IK / Props / Vehicle-Surface Fit

# TAB 2 · ANIMATION LAB
Motion / State / Audition / Calibration / Contact Correction / Intake

Both tabs use:
- the same actor;
- the same rig;
- the same pose state;
- the same profiles;
- one AnimationMixer per skinned actor;
- the same direct in-scene editing layer.

This continuation turns that good candidate into the shared production source for WorldBuilder, Residents, Travel and later Race.

## Read first

1. Current Session Cut:
   `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`
2. Its:
   - `START_HERE.md`
   - `HANDOVER.md`
   - `SOURCE.json`
   - `RETURN.md`
   - active `CHANGELOG.md`
3. Current masterplan:
   `MVP_FOCUS_PLAN_2026-09-24.md`
4. Shared presentation rules:
   `WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`
5. Ear Rig candidate:
   PR #214 / `tools/KFB-ToolBox/ear-rig/`
   Read `README.md` and `EAR_DANGLE_INTEGRATION.md`.
6. S39 Resident Band donor:
   `tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/`

---

# A · Preserve the current successful ToolBox shell

Do not regress:

- two main tabs only: Studio + Animation Lab;
- one actor survives tab switch;
- direct stage IK targets;
- shared edit-layer gizmo;
- scrub/timeline;
- Motion Library audition;
- Legacy Character Builder;
- Orc Brute Rig_Large fixture;
- Actor / Pose / Motion persistence;
- split-screen usability.

No permanent giant side palette.

No repeated switching between View → Editor → drawer just to move a hand.

---

# B · Fix the Pose owner once

Known current owner defect:

`pose-rig.v1` forearm length is wrong when an intermediate wrist bone sits between forearm and hand.

Measured example from the Session Cut:
Driver: `0.074` vs actual `0.334`.

The current ToolBox candidate locally re-measures.

Do not preserve that as a permanent local workaround.

Fix the shared pose/rig owner once so:
- wrist/intermediate bones are accounted for;
- Studio and Animation Lab use the same corrected chain;
- consumers do not re-measure independently.

Keep the current direct in-scene target UX.

---

# C · Canonical KayKit locomotion profiles

This is the primary new production outcome.

Use **KayKit Character Animations** as the canonical default player movement source.

Create/extend one shared semantic locomotion profile layer consumed later by WorldBuilder.

Inventory and map source-backed states:

- `idle`
- `walk`
- `walk.fast` only when source-backed or clearly marked calibrated variant
- `run`
- `sprint` / fast-run only when source-backed
- `backward`
- `strafe.left`
- `strafe.right`
- `jump.start`
- `jump.air` / fall
- `jump.land`
- `crouch`
- `sneak`
- `crawl`

For every profile record:

- semantic role;
- exact source clip;
- rig family;
- duration;
- loop;
- playback rate;
- measured cadence / foot cycle;
- measured or calibrated stride relation;
- expected world speed;
- root-motion policy;
- foot/contact facts;
- transition hints;
- source/pin.

If a movement tier is a playback-rate variant instead of a unique clip, say so explicitly.

No fake semantic clip.

## State preview

Provide one simple transition preview:

`Idle → Walk → faster Walk / Run → Sprint → Run → Walk → Idle`

plus:

`Jump Start → Air/Fall → Land`.

The preview is for calibration only.
It is not a second game movement engine.

---

# D · Mixamo / Motion Library remains the variant layer

The current KFB Motion Library stays valuable.

Use it for:
- zombie/orc/sad/panicked locomotion variants;
- dance;
- performance;
- react;
- climb;
- combat;
- music actions;
- semantic gaps.

Do not let Mixamo overwrite the default KayKit locomotion foundation.

World/Resident consumers request semantic roles/profile ids.

---

# E · Direct Pose / IK / contact workflow

Keep one Pose owner shared by both tabs.

Required workflow:

1. play or scrub a clip;
2. click hand/foot directly in the stage;
3. move the IK/contact target;
4. save as:
   - Pose Profile;
   - Contact Correction;
   - Key Pose;
   - or Blender exception.

Do not create another gizmo.

Do not hide ordinary transforms in a large drawer.

## Solver

Resident Atlas IK remains prototype evidence.

Keep the prepared technical comparison available:
- current KFB solver;
- upstream Three.js CCDIKSolver;
- constrained CCD.

Do not replace the solver simply because another implementation exists.

Promote only if the same-rig A/B comparison clearly improves stability, twist/flip control and target accuracy.

---

# F · Ear Rig · first real consumer integration

Use PR #214.

Binding ownership:

- **Animation Lab / ToolBox Motion owns the single**
  `ear-dangle.v1.js`
- FrankenStein Studio owns:
  - ear source/geometry;
  - attachment/placement;
  - rest/acted pose;
  - `kfb.ear-rig.v0` profile.

No duplicate ear physics.

## EAR-DANGLE-01 fixture

Use current FrizzleBob on the same actor/mixer with:

- canonical KayKit Idle;
- Walk;
- Run;
- Jump Start/Air/Land;
- one accepted Motion Library dance.

Ear dangle layers after the clip/acted pose.

Landing impulse comes from the actual Jump Land/contact event.

Review:
- ears settle in Idle;
- Walk/Run cadence does not destabilize;
- no head/ear clipping;
- jump follow-through reads;
- dance expressive, not noisy.

Do not solve the still-open ear-to-head mesh junction in this integration gate unless it blocks the test.

---

# G · Resident performance fixture · use the better source

The old MUSIC-PERF visible guitarist/drummer animation is not canonical.

Use the newer S39 Resident Band donor for performance/pose/contact work:

- Leader: Legacy Orc B `bounce`;
- Guitarist: `Guitar A` / `ml.guitar.a.fit`;
- Drummer: `drum.v5c`;
- measured strike/contact workshop;
- no baseplate.

Keep MUSIC-PERF timeline/audio mechanics as donor where useful.

## Scene preview rule

Performance/Resident demo preview should not force a rectangular ground plate.

Use:
- host support plane / terrain anchor;
- WorldBuilder-compatible sky/light/ground preview;
- direct support/ground snap where required.

The ToolBox preview is not a second WorldBuilder.

---

# H · Studio parity · keep visible roadmap, add only where source exists

Studio should ultimately cover the useful FrankenStein/Patch-Studio vocabulary:

- Actor/body;
- FrizzleBob graft;
- Legacy Character Builder;
- EyeRig;
- mouth/viseme;
- face/emote;
- Materials / Look;
- Speech Bubble;
- Thought Bubble;
- prop/held-item fit;
- Pose / IK;
- Vehicle / Surface Fit.

Do not invent replacement systems.

For capabilities not yet mounted:
- show the existing source/owner;
- add only when the donor is verified;
- no placeholder chrome.

---

# I · Vehicle / Surface Fit seam · prepare, do not explode scope

Keep the existing Seat/Cockpit/CardRider donors available.

Shared profiles should remain distinct:

- Actor Profile;
- Rig Profile;
- Pose Profile;
- Motion Profile;
- Vehicle / Surface Fit Profile.

Prepare the Studio so the next fixture can author:

`CARD_SURF`

for the animated KFB CardCarrier.

Do not build the Flight controller here.

Travel owns Flight.

Likewise, exact Quaternius transformer-like vehicles are still source-pin gated; do not substitute other models.

---

# J · World consumer contract

The output of this ToolBox pass must be consumable by WorldBuilder without copying Animation Lab logic.

WorldBuilder needs only:
- semantic locomotion profile ids;
- clip refs;
- speed/cadence facts;
- transition/contact facts;
- pose/profile refs.

Do not export a second movement controller.

---

# Human gate

One coherent updated ToolBox candidate.

Georg should be able to:

1. open ToolBox;
2. load FrizzleBob;
3. move an IK hand/foot directly;
4. save Pose;
5. switch to Animation Lab without rebuild;
6. audition canonical KayKit Idle / Walk / Run / Jump;
7. see semantic state/profile facts;
8. scrub a clip;
9. fix one contact;
10. save Motion/Profile;
11. run EAR-DANGLE-01;
12. load the S39 band performance fixture without a mandatory baseplate;
13. return to Studio with actor/profile state intact.

Do not require Vehicle/Flight completion for this gate.

## Return

Do not publish Live.

At the end run:

`/session-zip`

Return the complete candidate, Handover, active Changelog, SOURCE, test/evidence, open issues and exactly one next gate.

Exactly one next gate:
**GEORG REVIEW · CANONICAL LOCOMOTION + SHARED POSE/IK + FIRST EAR/PERFORMANCE CONSUMERS.**
