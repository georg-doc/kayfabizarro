# KFB MVP Focus Plan · 2026-09-24 evening

Status: **CURRENT PRODUCT FOCUS · no automatic merge/Live promotion**

Focus: **World Building · Resident Scenes · ToolBox · Car Racer**


## CURRENT DELTA · 2026-09-25 evening · EXPORTED CANDIDATES

The earlier "running-work" instruction is now fulfilled.

Received on main @ `8504afa9d14ad46855d0c590bc30eea0fc38d15d`:
- ToolBox Production-01 Session Cut;
- World Integration-01 Session Cut.

Classification and Ear Rig decision:
`INTAKE_SESSION_CUTS_EAR_RIG_2026-09-25.md`.

### ToolBox now
**KEEP.**
It already proves the intended two-workspace direction: Studio + Animation Lab on one actor/runtime, direct IK targets, Motion audition/corrections, Legacy builder and profile persistence.

Next:
**Georg human review first.**
Do not start Face/Voice/Bubbles, CCD solver replacement, Vehicle Fit or Ear-Dangle integration before that review identifies the next real blocker.

### WorldBuilder now
**KEEP.**
The export uses the accepted WB2 authoring state inside Hürth rather than building a second editor.

Next:
**Web rehome 1:1 → World 26/26 + WB2 34/34 → Georg human review.**

The candidate's local animation fixes are useful transition evidence, but canonical locomotion state/cadence/speed/profile ownership moves to ToolBox Animation Lab after the human gate. WorldBuilder consumes that shared truth.

### Ear Rig now
PR #214 is a ToolBox candidate.
- runtime owner: Animation Lab / ToolBox Motion;
- authoring consumer: FrankenStein Studio;
- one runtime copy only: `tools/KFB-ToolBox/ear-rig/ear-dangle.v1.js`.

EAR-DANGLE-01 waits behind ToolBox Production-01 review.

## CURRENT OVERRIDE · 2026-09-25 · Playable Integration Masterplan

Georg's current lead priority is **integration into playable products**, not another round of standalone editors or look-alike labs.

### Running-work rule

WorldBuilder and ToolBox/Animation are already in active external authoring sessions.

**Do not inject a second competing briefing into those running sessions.**

Next action for both lanes:
1. let the current session produce a complete export / Session Cut;
2. intake the export against the current owner and this masterplan;
3. classify each delta as **KEEP / DONOR ONLY / REPAIR / REJECT / OWNER CONFLICT**;
4. issue one bounded correction/integration brief only after that comparison.

A successful export is candidate input, not automatic owner promotion.

### P0 · WorldBuilder inside the world

The accepted WB2 terrain/object authoring capability is not a standalone product. It must operate **inside the same World/Travel scene state that is subsequently played**.

Target:
`play/navigation ↔ edit terrain/object ↔ save/reload ↔ continue playing the same changed world`.

Binding rules:
- no second terrain editor;
- no second object editor;
- WorldBuilder owns terrain authoring/persistence;
- OSM City Lab / World Zone owns geographic truth;
- WB-D2 owns presentation/look only;
- Travel/World owns movement/camera by active mode;
- Race owns Race physics/contact after explicit handoff.

After the current WorldBuilder export returns, first comparison asks:
**did Claude consume the accepted WB2/editor owners inside the world, or rebuild them locally?**
A reconstructed local editor is not integration PASS.

### P0 · Ground locomotion foundation

The default player locomotion must use the **KayKit Character Animations** as the canonical base State/Action vocabulary before Mixamo variants are layered on top.

Core state target:
`Idle · Walk · Run · source-backed Fast Run/Sprint · Backward · Strafe · Jump Start · Air/Fall · Land · Crouch/Sneak/Crawl`.

The shared locomotion profile must bind:
- semantic state;
- source clip;
- playback rate;
- measured cadence/foot cycle;
- expected world speed / stride relation;
- root-motion policy;
- contact facts.

**Movement owns translation/physics. Animation follows state and speed.**
WorldBuilder must not create its own competing animation-state system.

### P0 · Mixamo as variant/action layer

The current Motion Library and new direct FBX intake remain valuable, but they do not define the default player walk/run foundation.

Use them for:
- character/role variants such as zombie/orc/sad/panicked locomotion;
- climb;
- performance/dance;
- react/cheer;
- music/MC;
- combat/actions;
- missing semantic gaps.

Animation Lab owns audition/classification/profile metadata; consumers request semantic roles instead of hard-coded filenames.

### P0 · ToolBox = two main workspaces

The desired daily ToolBox is one product with two primary tabs:

**STUDIO**
- Actor/Profile;
- KayKit body + FrizzleBob graft;
- Legacy Character Builder;
- Face / EyeRig / mouth / viseme;
- material/look;
- speech/thought bubbles;
- direct object/prop editing;
- Pose / IK;
- hand/foot/contact correction;
- Vehicle/Cockpit/Surface Fit profiles.

**ANIMATION LAB**
- canonical KayKit locomotion states;
- Motion Library audition;
- direct FBX intake;
- semantic role assignment;
- root-motion / stride / speed calibration;
- jump-state preview;
- scrub to frame;
- reuse the same Pose/IK owner for contact/key-pose correction;
- Blender escalation only for genuinely time-varying retarget/curve/weights/topology/bake work.

No separate Pose Lab or IK Lab becomes another runtime owner.

### IK / posing direction

The current Resident Atlas IK is prototype evidence, not the final UX or solver by assumption.

Production requirement:
- direct in-scene target selection;
- compact contextual controls;
- no constant switching among View / Editor / drawer palettes;
- same Pose owner in Studio and Animation Lab.

Technical gate remains:
current KFB solver vs upstream Three.js CCDIKSolver vs constrained CCD on the same rigs.
Promote only after direct visual/technical gain.

### Vehicle / surface fitting

Reuse existing Seat/Cockpit/CardRider/Vehicle-Fit donor mechanisms.

Profiles should separate:
- Actor Profile;
- Pose Profile;
- Vehicle/Surface Fit Profile;
- consumer movement adapter.

Near-term fixtures:
1. **animated KFB CardCarrier** as first Flight vehicle;
2. author a proper KayKit `CARD_SURF` pose in ToolBox Studio;
3. Ground → mount → Flight → landing → Ground using the existing Travel mode bridge;
4. recover/pin Georg's four exact Quaternius transformer-like vehicles before any integration; no substitutes;
5. later prove Cockpit Driver fit and Drive/Flight handoff.

The rigid old Studio card remains measurement/pose donor only; the animated Travel CardCarrier remains the Flight vehicle.

### OSM / World / Race sequence

After the current WorldBuilder export is reconciled:

1. integrate real WorldBuilder editing into one canonical World Zone;
2. re-cache/promote Hürth/Alstädten through the OSM owner where required;
3. build the missing real OSM corridor pieces toward Köln/SAE;
4. test modular Race parts in the real Race/Rapier owner first;
5. only accepted Track modules enter the world through an explicit World → Race handoff.

No invented geography and no Race physics inside WorldBuilder.

### Current human-facing priority order

1. **Recover and review the running WorldBuilder export.**
2. **Recover and review the running ToolBox/Animation export.**
3. Correct those two products against this masterplan; do not restart them from scratch.
4. Ground locomotion: KayKit canonical state graph + cadence/speed calibration.
5. Ground ↔ animated Card Flight with authored Surf Pose.
6. OSM Hürth → Köln/SAE continuity.
7. Race modular runtime proof → World placement/handoff.
8. Continue Resident/NPC/Disco work in parallel only where it reuses these shared owners.

### Success criterion

Progress is measured by **playable integrated capability**, not by the number of editors, labs, PRs or demos created.

A slice is successful when an existing capability is usable in the real consumer product without creating a competing owner.

### Current WorldBuilder gate · WB2 accepted → Claude Design

WB2 terrain sculpting and interaction are **GEORG HUMAN PASS** at PR #190 head `ec52eb746be8c1a0e6f3f3d62857ed4b3121b284`.

Before expanding mobility, execute the already-prepared `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` handoff:
- reduce/collapse redundant side-panel editor controls/copy;
- keep object transforms inline;
- keep Terrain Sculpt compact;
- maximize 3D FOV;
- integrate existing WorldDesign/environment look controls;
- preserve Save/Reload and all owner seams.

Smooth and Flatten/Set Height remain later separate Web slices.

### Intake update · WB-D2 + Resident S40 · 2026-09-25

- WB-D2 now supplies the latest World presentation candidate: Cologne/Hürth/Alstädten, facade-rule v1, shadow fix, street names and homebase. It does **not** replace WB2 or World Zone truth. After WB2 Design/Rehome, next gate is `WB-ZONE-SEAM-01`.
- Resident Disco S40 is already a candidate runtime, not a future design brief. Bridge it into current owners; do not rebuild it. Its 8-song rotation/tempo maps, Disco Ball, collision and DJ/MC are intake candidates with explicit pin/transport/downbeat gaps.

## MVP 1 · WorldBuilder Mobility Playground
One WorldBuilder world with source-proven Ground · Drive · Flight · Boat/Water · Plane/Air · Freefall/Parachute only where real support exists.

Ground motion consumes shared states:
Idle · Walk · Run · source-backed fast-run/Sprint · backward/strafe · Jump Start/Air/Land · crouch/sneak/crawl.

One movement writer; animation follows state/speed. Prepared: `WB-MOBILITY-MVP-01`.

## MVP 2 · Hürth → Cologne Streets → Race Track
Hürth → committed/baked OSM corridor/street zones → Cologne → visible ramp/service connector → `TRACK_A_STUNT_8`.

The Track socket now knows about RKIT-08/09 **by reference only**: LOOP_REAL, LOOP_SLIM, LOOP_MAG_HERO, LOOP_MAG_CASCADE and SKYRAMP-01. Nothing is driven yet.

Gate order is binding:
1. Race drives **LOOP_REAL** first in the existing Rapier host;
2. Race reports measured entry speed/minimum load and capture→commit→release→recover;
3. only then may the other stunt modules proceed;
4. **no WorldBuilder placement of RKIT-08/09 before that gate**.

No invented geography. Streets use Travel/WorldBuilder Drive; explicit Track entry hands contact/gameplay to Race. Prepared: `WB-HUERTH-COLOGNE-RACE-MVP-01`.

## MVP 3 · ToolBox Production + Motion Intake
Stage-First becomes the daily front door **without losing useful Pet/FrankenStein Studio v17+ capabilities**.

Includes semantic State/Action Animation Lab, Melee/Duel mode, direct compatible-FBX Motion Intake and Blender exception queue only when technically required.

Prepared: `TB-V17-INTEGRATION-01`, `MOTION-INTAKE-DIRECT-01`; existing `TB-ANIM-01`, `COMBAT-DUEL-01`, `TB-PROD-01` sharpened.

## MVP 4 · FrizzleBob Body Family → Resident House
One FrizzleBob identity across 2–4 real modern KayKit destination bodies. Preserve destination rigs; browser graft first; Blender only for selected variant if mesh/weights require it.

Then Georg selects one and authors a Resident House/interior through existing Scene Studio/WorldBuilder. Prepared: `ACTOR-FB-BODY-FAMILY-01`.

## MVP 5 · Living Residents KISS
AI Town mechanics donor only:
`activity → notice → one intent → host-valid approach → NPC-LIFE beat → ChatterBox → optional Card/gift → leave/resume → Journey event truth`.

3 Residents. No dialog tree, relationship bars, new global memory DB or mandatory LLM. Optional low-frequency Observer/Almanac reflection supplies meta-narration.

Prepared: `NPC-AITOWN-KISS-01` after NPC-LIFE visible/human gate.

## Parallel Resident performance fixture
`RES-DISCO-01` is READY on the same owners: real Legacy/Medium/Large cast + current dance actions + one music clock. It should use direct Motion Intake for future simple compatible FBX additions.

## Recommended sequence
Parallel now:
1. WB2-DESIGN-REFINE-01 · Claude Design UI/WorldDesign refinement on accepted WB2;
2. WB-ZONE-SEAM + WorldBuilder/Travel modes;
3. MOTION-INTAKE-DIRECT-01;
4. TB-V17-INTEGRATION-01;
5. ACTOR-FB-BODY-FAMILY-01;
6. Race drives RKIT-08 **LOOP_REAL** first in Rapier; TRACK_A/world stunt placement waits on that measured gate;
7. RES-DISCO-A source/motion audition.

Then:
8. Hürth→Cologne→Track;
9. Living Residents KISS after NPC-LIFE review;
10. Georg's FrizzleBob-house Resident Scene.

Work/WSA stays idle unless an executor proves a capability gap.


## CURRENT DELTA · 2026-09-25 evening · GEORG PROCEED PASS

Georg has now reviewed both exported candidates sufficiently to continue.

**ToolBox Production-01: PROCEED PASS**
- continue from the current Studio + Animation Lab candidate;
- preserve open solver/UX/feature gaps;
- canonical locomotion/profile consolidation may start;
- EAR-DANGLE-01 may follow on this accepted working surface.

**World Integration-01: PROCEED PASS**
- keep this integrated WB2-in-Hürth candidate as the current foundation;
- Web must still rehome/regression-test the candidate before owner-side integration;
- then continue OSM continuity / mobility / later Race handoff.

This is explicitly not an exhaustive feature-by-feature acceptance.



## CURRENT ADDITIVE · World / Resident presentation rules · 2026-09-25

Read:
`WORLD_RESIDENT_PRESENTATION_RULES_2026-09-25.md`.

Binding additions:
- Resident modules are terrain-placeable and do **not** bring mandatory ground/base plates.
- S39 Resident Band is the current source-backed donor: host anchor + local support plane, no ORB Ground mesh.
- Demo scenes should use a lightweight current WorldBuilder-compatible sky/light/ground presentation instead of arbitrary lab plates.
- Current MUSIC-PERF timeline/audio mechanics remain useful, but visible guitarist/drummer animation is TUNE; newer S39 `Guitar A / ml.guitar.a.fit` and `drum.v5c` are the preferred performance sources.
- WB-D2 `FACADE_RULE v1` is the starting global ordinary-OSM facade grammar; successful Hürth/Alstädten variation should propagate to Cologne ordinary buildings.
- WB-D1 roof/shadow repair (`orientEG`, FrontSide / shadowSide Back / normalBias 0.9, concavity fallback) is a shared OSM presentation rule, not a one-zone patch.
- Global quality gate includes roof-wall seam, wall-ground contact, shadow clipping/bias and floating-object illusion.
- Graveyard current slice is historical concept/lighting donor only; its movement and placement are not gameplay evidence.
