# KFB WorldBuilder v1 · Web-first execution · 2026-09-22

> **CURRENT CORRECTION · 2026-09-23**
>
> WorldBuilder is the ToolBox scene-building surface, not an isolated terrain demo.
> Read first:
> `TOOLBOX_SCENE_AUTHORING_CORRECTION_2026-09-23.md`
>
> Fresh-chat execution:
> `TOOLBOX_SCENE_AUTHORING_FRESH_WEB_START_2026-09-23.md`
>
> R1 functional foundation: **GEORG HUMAN PASS** — texture, Character Y, Character-Y save/reload and palette/FOV.
> R2 shared inline editor: **GEORG HUMAN PASS** — object menu, Move / Rotate / free Scale / Drop / World-Local / Close + transform Save/Reload.
> Current gate: **CLAUDE DESIGN · WORLDBUILDER AUTHORING/UI REFINEMENT ON ACCEPTED WB2 FOUNDATION**.
> Shared editor owner: `tools/KFB-ToolBox/lib/edit-layer.js` · accepted R2 base `c97b3537f71e939176f3ae5ce7ae83feabb7918f` · R3 candidate `c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`.
> Proposal: `SHARED_EDITOR_UNIFORM_SCALE_PROPOSAL_2026-09-23.md`.
> WB2 terrain-authoring brief: `WB2_TERRAIN_SCULPTING_PROPOSAL_2026-09-23.md`. Runtime candidate is now implemented on stacked Draft PR #190; R3 is optional/non-blocking.
> R3 remains an optional/non-blocking shared-editor convenience candidate: **26/26 + 4/4 + 1/1 PASS**, no human R3 claim. WB2 is now reprioritized by Georg. Cloudflare remains HOLD.
> WB2 implementation: branch `chatgpt-web/worldbuilder-wb2-terrain-sculpt-2026-09-23` · stacked Draft PR **#190**.
> WB2 candidate: `worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html` + `WB2_TERRAIN_SCULPT_01_REVIEW.html` + `terrain-sculpt.js`.
> WB2 evidence: **24/24** sculpt math/geometry + **56/56** current Source/Review contract + **31/31** focused interaction contract + **4/4** exact runtime sources; embedded browser self-test **34 prepared / 0 executed**; **GEORG HUMAN PASS**.
> WB2 interaction R1: wheel/touchpad changes Brush Radius only while sculpting; hold Space = temporary Orbit preserving Raise/Lower; `1/2/3` = Object/Orbit / Raise / Lower. **GEORG HUMAN PASS.** WB2 Return: `RETURN_WB2_TERRAIN_SCULPT_2026-09-23.md`. Exactly one next gate: existing `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` authoring/UI refinement.
> The older `WB1-TERRAIN-EDITOR-01` wording is superseded where it omits the Resident/animation seam.

Status: **PREPARED · WEB FIRST · CLAUDE DESIGN AFTER TECHNICAL PREFLIGHT · WORK ESCALATION ONLY**
Owner: existing KFB World / Travel / ToolBox owners; no new universal runtime owner.

## CURRENT OVERRIDE · TERRAIN-FIRST RESET · 2026-09-23

The FLAT/SPHERE/TORUS Hex projection proof is retained only as research evidence.

Georg rejected the visible P2 composition and the follow-up P2R1 repair direction because it drifted away from the intended WorldBuilder product.

**Current direction: CONTINUOUS PROCEDURAL TERRAIN + PRODUCTIVE SCENE EDITOR.**

Read:
`TERRAIN_FIRST_RESET_2026-09-23.md`

Next gate:
**Claude Design authoring/UI refinement on the accepted WB2 source**

Primary external terrain/editor donor:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` · MIT.

Use the promoted ToolBox `lib/edit-layer.js` as the selected-object edit owner. It is the exact Resident S7 extraction of the Dungeon S21/S22 editor; do not rebuild a local TransformControls/picking layer.

Hex remains optional local/semantic content. It is not the macro ground.

WB1-P2/P2R1 does not block the Scene Editor.
P3/Claude mega-authoring remains HOLD until the first useful terrain Scene Editor exists.

## Product goal

Create the first coherent KFB WorldBuilder v1 authoring candidate that is visually useful, editable, saveable and locally reviewable without requiring Work/WSA or Cloudflare for normal iteration.

## Current gate status

### WB1-P0 status · COMPLETE on PR #175

P0 is complete/revalidated on Draft PR #175:

- branch: `chatgpt-web/world-building-preflight-2026-09-22`
- exact head: `17fd31a907b4346fddef7501490f738c251c2a37`
- evidence: 22/22 bounded source/provenance/license checks
- runtime/browser/gameplay tests: 0 by design

Current `main` has advanced beyond the P0 base, so PR #175 currently needs reconciliation before any merge.

**Do not rerun P0.**

The next implementation gate is WB1-P1 after additive reconciliation of the P0 branch with current main.

PR #176 is a separate post-WB1-P2 ToolBox Fractal Authoring planning lane. It does not block P1.

## Execution order

### WB1-P0 · COMPLETE / do not rerun

Historical P0 brief:

`tools/KFB-ToolBox/_handover/WORLD_BUILDING_PREFLIGHT_WEBCHAT_2026-09-22/START_HERE.md`

P0 is already complete on PR #175. Keep its results; do not execute these bullets again:
- read `WHACKMAN_WORLDDESIGN_LAB_DONOR_2026-09-23.md`;
- source/reuse/license matrix;
- exact internal donors;
- protected owners;
- Spindle/StoryMap/WhackMan/Travel/Hex/OSM classification.

Commit and stop.

### WB1-P1 · Environment Profile proof

Fresh Web continuation or fresh replacement chat.

Before implementation:
1. re-read current main;
2. reconcile the completed P0 branch additively against current main;
3. preserve P0 evidence/history;
4. then implement P1 only.

Isolate the WhackMan-derived dusk/torch/fog/local-visibility/matte profile.

Reuse the original WhackMan source as truth and the already isolated `WORLDDESIGN_LAB_2026-09-23/deliverables/wd-light.js` as implementation evidence. Do not rebuild the lighting comparison from prose.

Binding P1 architecture rule from the WorldDesign Lab:

**Material and light remain orthogonal.**

Environment Profile owns light/fog/torch/local-visibility/exposure behavior.
Material/shader style remains a separate `MaterialProfileRef`.
A reversible `WHACKMAN_MATTE_CANDIDATE` may be tested, but must not become a hardwired global material policy inside the Environment Profile schema.

No World Editor yet.

Return a **Portable Preview Pack**.

### WB1-P2 · Surface Adapter proof

Same tiny logical recipe on:
- FLAT
- SPHERE
- TORUS

Use:
- seven real Hex cells;
- one route;
- one real prop;
- Environment Profile ref;
- one Surface FX event.

Return a **Portable Preview Pack**.

### WB1-P3 · Claude Design input

Only after P0-P2 are green, Web creates:

`CLAUDE_DESIGN_INPUT.md`

It contains only proven facts:
- accepted/rejected donors;
- accepted WorldDesign Lab look/light comparison facts;
- explicit WhackMan-origin ownership for that Lab;
- exact owner seams;
- Environment Profile;
- Surface Adapter;
- recipe fixture;
- available Source Object / Scene Patch interactions;
- unresolved visual choices;
- explicit things Claude must not rebuild.

Sharpen the existing Claude World brief; do not create a second mega-brief.

### WB1-D1 · Claude Design authoring

Claude Design builds the first coherent WorldBuilder v1 authoring experience.

Initial candidate scope:
- reuse/adapt the WhackMan-origin WorldDesign Lab comparison grammar instead of building another look dashboard;
- one Source Object Inspector;
- compact in-scene selection/transform controls from the proven S21/S22 donor;
- one authored 12–24-cell real Hex area or equally small World Recipe fixture;
- route/road editing from the shared semantic route;
- environment profile control;
- surface preview using accepted adapters;
- one prop/toy lane;
- save/export/reload;
- no OSM city rebuild;
- no infinite world;
- no universal voxel engine;
- no Combat/Race ownership takeover.

Claude exports a complete Session Cut.

### WB1-R1 · Web rehome + local review

Web:
1. rehomes Claude export 1:1;
2. proves parity before edits;
3. runs tests;
4. produces a **Portable Preview Pack**;
5. Georg reviews locally.

No Work.

### WB1-R2+ · rapid iteration

Visual/composition problem → Claude Design.
Code/contract/debug problem → Web.
Human ambiguity → ask Georg immediately.
Minor optional defect → HOLD/quarantine.

Repeat via portable preview packs.

### WB1-PUBLIC · milestone only

Only after Georg locally accepts a coherent milestone:
- optional KFB Stage publication;
- Hub update;
- public browser verification.

Cloudflare is not the normal edit loop.

## Work / WSA escalation

Default: **NO WORK**.

Work is allowed only through:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/WORK_ESCALATION_CARD.md`

Examples that might justify it:
- exact private binary transfer impossible through Web;
- local multi-repo artifact assembly that cannot be packaged independently;
- final OS/browser automation required for publication.

Work must not debug WorldBuilder v1.

## v1 acceptance

WorldBuilder v1 candidate is useful when Georg can locally:

1. open the portable preview;
2. inspect real source objects;
3. place/move/rotate at least one real object;
4. author a small terrain/Hex composition;
5. edit a short route;
6. switch/apply the accepted environment profile;
7. inspect the same recipe on at least the accepted surface previews;
8. save/export;
9. reload to the same authored state;
10. continue editing.

## Process protections

Apply:
- `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
- `KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`
- `PORTABLE_PREVIEW_PACK.md`

One named gate per Web chat cycle.
After every GitHub write fetch exact head/files.
A timeout is UNKNOWN.
