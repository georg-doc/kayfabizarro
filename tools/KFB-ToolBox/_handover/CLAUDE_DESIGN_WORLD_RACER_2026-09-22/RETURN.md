# RETURN · Claude Design World + Racer Handoff · 2026-09-22

Status: **COMMITTED TO MAIN · DOCUMENTATION / AUTHORING HANDOFF ONLY**

## Repository / branch

Repository:

`georg-doc/kayfabizarro`

Branch:

`main`

Source head immediately before this handoff packaging began:

`f9a54c43ac5dae82537ed255ba7280fb5d2d474c`

The exact current main head must be re-read before Claude execution because this handoff itself adds documentation commits.

## Outcome

One single ToolBox handoff folder now contains the current Claude Design routing for:

- Cologne Racer Option C-2;
- World / Environment Authoring;
- source/failure classification across the relevant new inbox exports.

No runtime implementation was changed.

No Stage was published.

No Live promotion was performed.

## Files

- `START_HERE.md`
- `SOURCE_FAILURE_MATRIX.md`
- `CLAUDE_RACER_BRIEF.md`
- `CLAUDE_WORLD_AUTHORING_BRIEF.md`
- `CHANGELOG.md`
- `RETURN.md`
- `WORLD_ARCHITECTURE_RED_TEAM_2026-09-22.md` — proposal/research only; no new runtime owner
- `STORYTELLING_MAP_WORLD_DONOR_2026-09-22.md` — Story/Tactical representation donor, D6 relief, toys, water caveat and Curtain boundary

Central ToolBox handover index updated:

- `tools/KFB-ToolBox/_handover/README.md`

## Current owners retained

- Race movement / contact / route / camera state remain Race-owned.
- OSM remains geography/semantic source truth.
- Hex grid/edge/solver truth remains with existing Hex modules.
- Dungeon layout remains with existing Dungeon owner functions.
- Claude Design is an authoring workspace, not deployment/runtime owner.
- Scene editing must reuse the existing S21/S22 interaction donor and shared Scene Patch architecture instead of creating a third generic editor.
- Style references remain non-canon.
- Inbox exports remain source/donor inputs unless explicitly accepted.

## Input revisions captured

### Cologne Option C-2

Central source intake:

`930c97ca50434d579764e2219739b908816cd21a`

Race mirror:

`georg-doc/KFB-Stunt-Car-Race@cc62767161d9e1b7e0c98d924b1ad72b335e0b30`

### Scene Patch donor

PR #168 head checked:

`51f3d21cef6946adcc90820eaf100d2e42cb5391`

### 3D style/surface direction

PR #165 head checked:

`b73b4393d1f0b78740671a50261c581a31cfe040`

### Card Zone source donor

PR #172 head checked:

`cc1efb55e8d549905c70c8a4cf66552c57755224`

### Tileable Macro surface donor

PR #173 head checked:

`d770f68992c1b36703960cdb501c330b5185d3b8`

## Key recovered World Authoring decision

The combined Hex + WhackMan + S22 evidence changes the authoring order to:

`source object truth → topology/structural owner → in-scene placement → grounding/contact proof → Scene Patch/world recipe`

For difficult/asymmetric objects this replaces repeated coordinate-guessing.

The World Authoring brief therefore starts with a compact Source Object Inspector and reuses the proven S21/S22 editor interaction rather than beginning with another generator.

## 2026-09-22 research delta · Environment + world geometry

Georg identified the current WhackMan Dungeon presentation as a useful production donor direction.

Persisted donor candidate:

- cool dusk world light;
- warm flickering mounted-torch lights with a small nearest-light pool;
- depth fog;
- continuous local visibility/sight-radius control;
- matte material calibration that suppresses the plastic-varnish read.

This is now routed as an Environment Profile candidate for Dungeon Generator / ToolBox / special World zones. It does not promote WhackMan gameplay ownership.

A separate Red-Team proposal now evaluates World geometry as a replaceable Surface Adapter rather than choosing Sphere vs visible Hex vs Voxel as one universal world.

Research recommendation:

- keep Travel Sphere as proven donor;
- preserve Hex as semantic/local build layer;
- use smooth continuous macro terrain for Race/OSM;
- reserve volumetric/Voxel chunks for caves/destruction;
- keep shader/data-driven Surface FX separate from topology;
- first architecture stress test, if Georg accepts the proposal: same tiny recipe on Flat + Sphere + Torus.

The current implementation gate below is **not silently replaced** by this proposal.

## Storytelling / Tactical representation delta · 2026-09-22

Current StoryMap intake reviewed:

`tools/KFB-ToolBox/_inbox/KFB StoryMap v1/`

Important classification:

- broad Europe source = OpenPlanetData country-boundary GeoJSON, not OSM-Europe;
- OSM remains the local/city semantic source lane;
- StoryMap does not become a second World runtime.

Recommended relationship:

`World Recipe / stable zone IDs / routes / portals / event state`
→ playable World view
→ Tactical tabletop/meta-navigation view
→ Storytelling physical/animated view.

Strong reusable evidence:

- canonical geography is separate from reversible presentation transforms;
- Flat/Table/Flyover/Pop-up camera-role vocabulary;
- Ink vs physical Shadow edge presentations;
- one map-derived raster reused across map analysis;
- D6 `cell/6` height quantization and coast-distance stepped relief as a stylised terrace donor;
- existing radial ripple as the first Surface-FX donor;
- BoardGameBits and World Atlas Domino S9 as a future shared World Toy Props vocabulary.

Do not promote:

- coast-distance relief as factual elevation;
- current StoryMap water appearance;
- StoryMap as a second OSM or World owner.

Current StoryMap water integration is source-correct programmatically, but the human-visible result remains unresolved/too flat. Reuse the wet-mask / geometry / flow separation only until a new visible water gate passes.

Theatre Curtain remains a separate Game Dev Studio transition owner. Current v1 technical foundation is kept, while the next human visual refinement is lower-third tieback/swag + optional cord and repair of strong-bend crease/line artifacts before aged/burned fabric polish.

## Lead Work / Spindle delta · 2026-09-22

Cross-project coordination is returned to the original KFB Lead / WSA Work lane.

Current Lead Work onboarding:

`skills/chat/workflows/KFB_LEAD_WORK_CHECKIN_2026-09-22/START_HERE.md`

Prepared Combat ranged-first companion:

`skills/chat/workflows/KFB_LEAD_WORK_CHECKIN_2026-09-22/COMBAT_RANGED_MVP.md`

World/Claude brief remains the same design brief and was extended only with the existing Combat Spindle Sky as a reusable Environment Element donor.

Current extraction source:

`georg-doc/KFB-Combat-Arena:wsa/ca2-kaykit-prep-2026-09-20`
→ `prompts/SKY_01_SPINDLE_MODULE.md`

Target candidate remains:

`kfb.environment.spindle-sky/0.1-candidate`

Spindle Sky is not a Surface Adapter and does not become a World owner.

Recommended Combat sequencing now preserved:

1. Work C-MVP-A: exact existing CA2 PR #5 Stage packaging + browser baseline;
2. Web/ToolBox + human gate: Legacy Rogue EyeRig + Crossbow two-hand/muzzle fit;
3. Work C-MVP-C: Legacy Rogue consumes existing Arena Gunfight;
4. melee remains later and separate.

No runtime implementation changed in this documentation delta.

## Tests / evidence for this packaging slice

This is a documentation persistence slice.

Checks performed:

- source inputs read from current GitHub;
- new handoff files created on main;
- each file write followed by branch-head readback and file readback;
- ToolBox `_handover/README.md` updated and read back with the new link present.

No browser/gameplay test is claimed from this packaging operation.

## Public Stage

N/A for this documentation-only handoff.

Existing product Stages are not reclassified by this package.

## Unresolved

- Racer visual style gate is running separately in Claude Design.
- World Authoring implementation has not started from this handoff yet.
- Scene Patch PR #168 and style PR #165 remain drafts and are not silently promoted to main implementation truth.
- Final World visual canon remains a human gate after the interactive Racer style proof.

## Exactly one next gate

**Claude World / Environment starts from this handoff and proves donor parity + three isolated Source Object profiles before building the first 12–24-tile authored Hex world.**
