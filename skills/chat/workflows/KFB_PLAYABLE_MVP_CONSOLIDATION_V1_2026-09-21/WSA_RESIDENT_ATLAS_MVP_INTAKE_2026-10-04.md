# WSA Resident Atlas → Playable MVP intake · 2026-10-04

Status: **CURRENT MVP / WSA INTAKE · SOURCE-PINNED · PLANNING / INTEGRATION BRIEF**
Owner of receiving world: **KFB WorldBuilder / WB2**
Resident source/tool owner: **KFB ToolBox / Resident Atlas**
Executor for the first integration seam: **WSA / Codex integration lead**
Stage: **NOT REQUIRED FOR THIS DOCUMENTATION CHECKPOINT**

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this file
5. current source package:
   `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/`
6. inside the package:
   `START_HERE.md → CURRENT_STATE.md → HANDOVER.md → RETURN.md → TEST_REPORT.md`
7. editor details:
   `docs/EDITOR_3D_INLINE_01.md`
8. Disco handoff:
   `docs/HANDOVER_WSA_S40.md`
9. wrestling/fight donor evidence:
   `docs/RESIDENT_FIGHT_SANDBOX_02/GEORG_FEEDBACK_2026-09-30.md`

GitHub source package is already present on `main`.
Current main at intake: `b19a0c7c637847345e83dcd3764d701d8c7f55f4`.

## What the source package actually contains

Resident Atlas S16 is a **design candidate**, not an accepted runtime.

Current package facts:
- `KFB_Resident_Atlas_S16.html`;
- 29 Resident entries including Combat Mech white/olive;
- Batch EyeRig support with mixed review status;
- scenelets in the same host: **Orc Band**, **Disco**, Graveyard, and parked Fight Sandbox 02;
- current Atlas editor layer plus the documented 3D-Inline-Editor contract;
- Resident placement/edit/export data rooted in `data/cast.js`;
- current package includes unpinned remote dependencies that must be pinned before production promotion;
- current test report explicitly has NOT_RUN rows for full console freedom and Band/Disco ensemble after latest S16b changes.

Do not convert package presence into HUMAN_ACCEPTED.

## MVP decision · Resident layer

The playable MVP must include the Resident Atlas as a **source and authoring donor**, not as a second world.

WB2 remains the owner of:
- terrain;
- world support / collision truth;
- world scene document;
- placement;
- save/reload of world transforms;
- Play ↔ God Mode host.

Resident Atlas / ToolBox supplies:
- Resident definitions;
- Resident-set export;
- scenelet/module recipes;
- actor/prop composition;
- role/idles and presentation facts;
- EyeRig/profile references;
- module-local behavior where already owned.

### Required MVP resident seam

Define `kfb.resident-set/0.1` as a derived export from `data/cast.js`.

Target world representation:

`residentSets[]: { setId, variant, transform, overrides }`

Each set carries:
- stable set ID;
- source/provenance pins;
- variants as parameters, not copied recipes;
- figures[];
- props[];
- local transforms relative to one set root;
- animation/presentation roles;
- footprint / bounds;
- grounding/support policy;
- EyeRig profile/status;
- optional scenelet/module reference.

The export is derived data. `data/cast.js` remains the Atlas recipe source until a later explicit Registry migration.

## MVP · 3D In-Place Editor

**Include. Reuse, do not rebuild.**

Current editor semantics already cover:
- one object-local edit menu;
- one TransformControls owner;
- Move / Rotate / Scale;
- World / Local;
- grid snap;
- connector snap;
- mount snap;
- Place on Ground / grounding;
- focus;
- undo / redo;
- semantic single-object vs group/module scope.

Integration direction:
- God Mode / WB2 object mode consumes the current ToolBox editor line (`edit-layer.v2` / `snap.v1` / `grounding.v1` or its reconciled stable successor);
- WB2 world support replaces the Atlas flat/studio support assumption;
- no third editor;
- no second transform-gizmo stack;
- terrain sculpt remains the existing WB2 terrain-authoring mode in the same input router.

This is also the editor seam for the Site-native God Mode / Scene Composer.

## MVP · Asset Librarian ↔ Resident Atlas

Use the **existing Asset Librarian / Registry**.

Add a placeable `resident-set` / scene-module view; do not create another index.

Initial filters:
- pack / source family;
- rig class;
- Ground / Flight / Scenelet;
- Eye status;
- footprint;
- character / Resident set / scenelet;
- Stage/Live eligibility later.

Flow:
`Browse → Preview → Place on Stage → Accept / Revert`.

## MVP · Orc Band

**Include as a placeable performance Scenelet / module.**

Required product role:
- living-world ambient/performance module;
- can be mounted in Town show space or another valid performance anchor;
- place/move as one module root;
- internal performers/props remain module-owned;
- optional audience/interaction/camera anchors;
- Audio/Jukebox context consumed from the canonical audio owner.

Current caveat:
- Band currently has its own transport and a different Motion Library pin from Disco.
- MVP integration must reconcile this to the shared/canonical song transport/Jukebox timing seam rather than preserve a second music transport.

Band is not a Combat owner.

## MVP · Resident Disco

**Include as a placeable performance Scenelet / module.**

Current donor is relatively advanced:
- 9-person cast with one alternate;
- Radio + speakers + drum machine;
- measured/partially mapped playlist timing;
- choreography vocabulary;
- Resident crowd collision;
- Disco Ball Core;
- environment/lighting hooks.

MVP integration rule:
- package as an intact scene/module root;
- activation by proximity/event/World state;
- canonical shared audio transport;
- expensive mixers/EyeRig/light activity sleep outside relevance radius;
- no private world or audio runtime.

Known source caveats remain explicit:
- first beat values are partly set rather than measured;
- HIT 2 is placeholder;
- left-hand microphone identity not fully checked;
- graft reader has raw@main dependency;
- Band/Disco Motion Library pins differ;
- latest S16 report did not rerun full Disco/Band ensemble after S16b changes.

These are not reasons to drop Disco from MVP planning; they are source/integration tasks.

## MVP · Wrestling Ring / Fight donor

**Include the Wrestling / Show Ring as a placeable Town performance/arena module.**

Product scope for MVP:
- Town show/wrestling surface near market/tower;
- placeable module root under Anchor Contract;
- supports ambient show, staging, residents and later combat/performance hooks;
- compatible with God Mode placement and world persistence;
- can host Orc/Resident performance scenelets.

Current source:
- Fight Sandbox 02 provides a real cartoon-contact POC and ring object;
- Georg judged the fight basis/POC useful;
- current ring is a placeholder-sized candidate, not a finished world module.

Do **not** make these MVP blockers:
- full Fight Sandbox completion;
- rope collision / rope rebound physics;
- all complex combos;
- Ragdoll;
- full Combat integration.

Known ring issue:
- current sandbox ring is 9 m and too small for Brute-scale knockback; source feedback suggests rig-scaled sizing or tighter anchors.
- therefore WSA must not copy the 9 m value as canon.

For MVP the **ring/show module is required; full wrestling combat physics is deferred** unless explicitly promoted.

## MVP · Resident runtime behavior

Initial world Residents need only the current bounded living-world seam:
- valid grounded placement;
- source-proven idle/activity role;
- optional EyeRig gaze;
- lightweight soft collision where appropriate;
- encounter/event hook;
- persistence ID;
- Lean Memory / NPC continuity references.

Do not add:
- local locomotion state machine;
- local dialogue runtime;
- new Combat physics;
- per-scene save system.

The Site Lean-Memory contract owns continuity through stable Resident/entity IDs plus Encounter/Moment receipts and Social/NPC memory views.

## God Mode / Site integration

Resident Atlas sources feed the Site-native God Mode already defined in MVP planning.

God Mode must be able to:
- search Resident sets / characters / scenelets through the existing Librarian;
- place a Resident set or intact Scenelet root;
- place one compatible character as Ambient Actor;
- choose an existing compatible idle/activity;
- Move/Rotate/Scale/Snap/Place on Ground through the shared editor;
- combine Residents with props and terrain sculpt into a Mini-Scene;
- group/save as Stage candidate;
- attach event/visibility/persistence metadata;
- validate and rollback before Live promotion.

Atlas remains an authoring/source tool. It does not become the Site/world host.

## Performance / activity budget

Before wide population:
- measure representative Resident set cost;
- sleep animation mixers outside relevant visibility/radius;
- EyeRig only near enough to read;
- expensive Knet/clay detail uses distance/profile budgets;
- static repeated props should instance where appropriate;
- Scenelets only run clocks/lights/behavior while active/relevant.

Optional Resident variants may be quarantined rather than block MVP.

## Required MVP presence

For the integrated MVP planning baseline, retain:
- Resident-set placement + Save/Reload;
- shared 3D In-Place Editor;
- Asset Librarian Resident search;
- selected principal Residents on Town/Dystopia/Utopia/Protopia;
- **Orc Band performance module**;
- **Resident Disco performance module**;
- **Wrestling / Show Ring module**;
- NPC/Resident interaction seam;
- Lean Memory / encounter continuity;
- God Mode placement path for Residents / scenelets.

## Explicit non-goals / protected boundaries

- no third Editor;
- no second Asset Librarian / Registry;
- no second Resident recipe truth beside the current source;
- no Travel/CONVERGENCE host takeover;
- no second world owner;
- no second audio transport in final integration;
- no hidden replacement assets;
- no automatic promotion of unreviewed Medium Eye profiles;
- no requirement to finish all Fight Sandbox defects for MVP.

## Exactly one next WSA gate

### WSA-RES-SET-01

Prove the resident-set contract with exactly three source sets:
- Mummy;
- Combat Mech;
- Clown.

Route:
`S16 export → kfb.resident-set/0.1 → current WB2 scene document → terrain grounding → shared object editor → Save → Reload → same set/root/variant/placement`.

Acceptance:
- exact source refs survive;
- no third editor;
- WB2 remains world/support owner;
- variants remain data parameters;
- each figure grounds correctly to current terrain;
- stable persistence IDs;
- Save/Reload preserves the set;
- validation report lists any unresolved optional eye/source issues without substituting assets.

After this gate, Band / Disco / Wrestling are packaged through the same root/anchor seam; do not start that second slice before WSA-RES-SET-01 is proven.

No merge, Stage or Live promotion is authorized by this intake note.
