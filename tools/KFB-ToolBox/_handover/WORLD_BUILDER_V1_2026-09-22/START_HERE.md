# KFB WorldBuilder v1 · Web-first execution · 2026-09-22

Status: **PREPARED · WEB FIRST · CLAUDE DESIGN AFTER TECHNICAL PREFLIGHT · WORK ESCALATION ONLY**
Owner: existing KFB World / Travel / ToolBox owners; no new universal runtime owner.

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
