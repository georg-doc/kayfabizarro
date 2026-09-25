# HANDOVER · KFB ToolBox · 2026-09-25 r2

## A · User intent
Continue ToolBox Production-01 (PROCEED PASS) — no new ToolBox/Lab. Make it the shared production source for WorldBuilder/Residents/Travel: fix the pose owner once, canonical KayKit locomotion as semantic profiles, keep Mixamo/Motion Library as variant layer, direct stage IK/contact editing in both tabs on the same actor/mixer, first Ear consumer (EAR-DANGLE-01), S39 band performance fixture without baseplate on a WorldBuilder-compatible preview, CARD_SURF seam without flight, visible Studio roadmap.

## B · Current result
Two tabs (Studio · Animation Lab) on one runtime, unchanged shell.
- **Studio**: Body (+ "Studio owners" roadmap) · Face · Pose (+ solver gate A/B/C) · **Fit** (new, CARD_SURF seam) · Scene.
- **Animation Lab** inspector: **Clip** (as r1) · **State** (new: KayKit locomotion profiles, measure/save/export, state preview) · **Ears** (new: EAR-DANGLE-01) · **Band** (new: S39 fixture).
- New actor **FrizzleBob · Ear Rig v5** (FB_TEMPLATE_LOOK_v5.glb, ear.l/r.1–3 skinned to Rig_Medium). Driver Graft now also carries KayKit MovementAdvanced.
- New stage **Resident Band · S39**: band module on a host support plane, three.js Sky via wd-sky.js donor, wd-light BASELINE values, no baseplate.

## C · What changed this session
1. **Pose owner fix once** — `kfb-lib/pose-rig.v1.js` = pinned owner @8922d4b1 + fix: chains measured from world positions incl. intermediate wrist (`mid`), re-measured in `_solve`, leg chains, public `ikChain / effector / solveIK / chainReport`. ToolBox local re-measure hack **removed**; Studio and Lab both call `pose.solveIK`. Graft's PoseRig is rebuilt from the fixed owner with graft-mount's own constructor args. Measured on Driver: handR lenL **0.3338** (child.position gave 0.0738).
2. **Locomotion profile layer** — `kfb-lib/locomotion-profiles.v1.js` (owner: Animation Lab/ToolBox Motion): 14 roles → real KayKit clip names, measured per actor (contacts, cadence, stance-slide stride, world speed, root policy, take-off/touchdown events), explicit playback-rate variants, transition hints, consumer view for WorldBuilder. Timeline shows measured contact bands for stock clips.
3. **State preview** Idle→Walk→Walk.fast→Run→Sprint→Run→Walk→Idle and Jump Start→Air→Land on the one mixer, root moved at measured speed on a circle, camera follows. Calibration only.
4. **EAR-DANGLE-01** — `ear-dangle.v1.js` @19088b14 (PR #214) imported directly, `rigEars()` on FB Ear Rig v5, updated after mixer + root per integration §1; take-off/landing impulses from measured Jump_Start take-off f20 / Jump_Land touchdown f11; Motion Library dance `kfb_dance_chicken_a`; per-phase peak/settle review record.
5. **Solver gate** — A (owner) vs B (three.js CCDIKSolver r160) vs C (CCD + elbow hinge) on the same rig/target: miss, elbow flip, hand twist. A stays unless B/C clearly win.
6. **S39 band fixture** — `mountBandModule(def,{parent,anchor})` @b64d7edc; host clock (song optional), drum contact + ground report on demand; no ground-snap of the module (support plane y 0 kept).
7. **CARD_SURF seam** — `kfb.vehicle-surface-fit-profile/0.1` saved from current pose + foot pins; carrier source pin pending; Travel owns flight.

## D · Source / owners / donors
| Name | Role | Path @ pin | Status |
|---|---|---|---|
| pose-rig.v1 (owner fix) | Pose/IK owner | kfb-lib/pose-rig.v1.js ← tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v13/pose-rig.v1.js @8922d4b1 | USED (local patch, push pending) |
| locomotion-profiles.v1 | semantic locomotion | kfb-lib/locomotion-profiles.v1.js (new) | USED |
| KayKit Character Animations 1.1 Rig_Medium | canonical locomotion | media/3D_Assets/KayKit_Character_Animations_1.1/…/Rig_Medium_{General,MovementBasic,MovementAdvanced}.glb @b97b5ac5 | USED |
| KFB Motion Library 01 | variant/action layer | media/3D_Assets/Animations/KFB_Motion_Library/ @032c9d50 | USED (dance, drums, audition) |
| ear-dangle.v1.js + fb-default.ear-rig.json + FB_TEMPLATE_LOOK_v5.glb | ear owner + fixture | tools/KFB-ToolBox/ear-rig/ @19088b14 (PR #214 head) | USED |
| S39 band module | performance fixture | tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/{lib/band-module.js,data/resident-band-module-01.json} @b64d7edc | USED |
| wd-sky.js | WorldBuilder-compatible sky | …/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/wd-sky.js @b64d7edc (mode 'real') | USED |
| wd-light.js | light profile | same cut, WORLDDESIGN_LAB deliverables | DONOR_ONLY (BASELINE values copied, module not imported) |
| MUSIC-PERF | timeline/audio | — | DONOR_ONLY · its guitarist/drummer set NOT canonical |
| edit-layer, graft-mount chain, EyeRig v6, pet-mouth v1, Legacy/Brute pins | as r1 | @8922d4b1 etc. | USED (unchanged) |
| three.js 0.160 + CCDIKSolver | runtime | unpkg | CDN_EXTERNAL |

## E · Protected boundaries
No second movement controller (preview only) · Travel owns flight · WorldBuilder owns terrain/sky/world placement (ToolBox preview host only) · FrankenStein Studio owns ear geometry/placement/acting · no fork of ear physics · EyeRig/Mouth owners unchanged · Motion Library never overwrites KayKit roles · one mixer per skinned actor · solver A not replaced without a clear same-rig win.

## F · Controls / workflow
Header: Studio | Lab · Actor ▾ · Stage ▾ (Neutral / Resident Caveman / **Resident Band · S39**) · ▥ inspector · … sources/self-test · Save (⌘S).
Studio › Pose: click hand/foot dots on stage → shared gizmo → Save pose; Compare A·B·C. Studio › Fit: preset → pin feet → Save CARD_SURF.
Lab › Clip: clip ▾, Space play, ←/→ frame, scrub, click dot → correction at frame, Save motion profile. Lab › State: Measure → rows audition the clip at its rate → ▶ previews → Save profiles (also fills empty Motion roles) / Export JSON. Lab › Ears: on/off, stiffness/damping/rubber, kicks, Run EAR-DANGLE-01. Lab › Band: clock, song, Measure.
Storage key `kfb-toolbox-production-01` (workspace v1 + `locomotion`, `fits`, `earReview`, `solverGate`).

## G · Working / tested
Claude Design preview, real sources: self-test 01–19 PASS (see TEST_REPORT.md). Locomotion set measured on FB Ear Rig v5 (data/). EAR-DANGLE-01 real-time run in Georg's tab: finite, peaks 3.8–29.5°, kicks take-off + land fired.

## H · Open / tune / blocked
- TUNE · locomotion speeds are stance-slide measurements (walk 0.62 m/s, run 3.01 m/s at stage scale 0.947) — Georg judges foot skating in the preview.
- TUNE · ear amplitudes after Run/Jump (idle peaks up to ~22–25° before settling, settle 0.8–1.9 s); ear wobble reads by eye only.
- OPEN · Driver Graft ears are baked rigidly into the head mesh (headgraft.v1) → ear dangle on the Driver waits for the ear-to-head junction decision (Ear Rig README gap 1). EAR-DANGLE-01 runs on FB Ear Rig v5.
- OPEN · solver gate result not yet reviewed by Georg; A stays.
- OPEN · S39 drummer v5c stands 0.08–0.105 in the support plane (band doc) — not corrected here.
- SOURCE_REQUIRED · CardCarrier (animated) model pin for CARD_SURF; Quaternius transformer vehicles still pin-gated.
- DEFERRED · Materials/Look UI (matzones.v1), speech/thought bubbles (bubble-shaper.v3 / bubbles.v4) — owners listed, not mounted.
- BLOCKED · GitHub push (integration 403) — pose-rig patch lives in `patches/`.

## I · Rejected / superseded
Local IK re-measure in ToolBox (removed) · MUSIC-PERF guitarist/drummer animation as canonical (superseded by S39) · baseplate under Resident modules · Walking_B as walk.fast (measured +9.8 % < +10 % gate → playback-rate variant instead).

## J · Next gate
**GEORG REVIEW · CANONICAL LOCOMOTION + SHARED POSE/IK + FIRST EAR/PERFORMANCE CONSUMERS.**
