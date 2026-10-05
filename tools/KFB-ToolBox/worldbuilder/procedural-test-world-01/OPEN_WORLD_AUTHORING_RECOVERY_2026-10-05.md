# KFB World Studio · Open-World Authoring Recovery · 2026-10-05

Status: **CURRENT PRIMARY PRODUCT RECOVERY**
Execution mode: **RECOVERY / ONE PRODUCT OUTCOME**
Executor: **ChatGPT Work/WSA**
Owner: **KFB WorldBuilder / WB2 · Draft PR #348**
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`

## Outcome

Recover **one continuously usable, buildable KFB open world** that Georg can use as a reusable visual/contextual environment for comics and stories.

The product is **not** "the four-island showcase".

The four existing islands are content/world recipes inside the product. They do not define the product outcome.

The product outcome is the live authoring loop:

`PLAY ↔ BUILD / GOD ↔ PLACE / EDIT / SCULPT ↔ SAVE / RELOAD ↔ PLAY`

on the **same world and same scene document**.

## Why this recovery exists

Current World Studio candidate is HUMAN TOTAL FAIL:

- unreliable load / `Loading 3D engine` stall observed;
- current visible world composition rejected;
- pack/environment direction rejected;
- props read as arbitrary scattering rather than authored composition;
- the current candidate cannot serve as Georg's comic/story world-building tool.

The recovery must not polish that failed showcase forward.

## Read first · exact sources

1. Current KFB router and workflow contracts.
2. This PR #348 current state / Recovery / Return.
3. Current failure evidence:
   - `HUMAN_VISUAL_FAIL_JOYRIDE_2026-10-04.md`
   - `FAILURE_RECOVERY_2026-10-04.md`
4. Original live-authoring product direction:
   - `georg-doc/KFB-Travel-Globe/main/_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/START_HERE.md`
   - `.../REUSE_MATRIX.md`
   - `.../EXECUTION_LOG.md`
5. Current Site/God Mode architecture:
   - `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`
6. Current WB2 authoring modules:
   - `wb2-studio.v1.js`
   - `../wb2-terrain-sculpt-01/terrain-sculpt.js`
   - shared in-scene editor contract `skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`

## Verified donors / existing capabilities to reuse

### WB0 live-authoring donor · KEEP MECHANISM

`KFB-Travel-Globe/site/world-builder/`

Already implemented as one connected proof:
- PLAY / BUILD / GOD;
- object placement;
- TransformControls;
- Surface Snap;
- persistent World Recipe;
- ROAD;
- BlockBits;
- save/reload;
- same-world PLAY after authoring.

Do not copy old Travel visual identity blindly.
Reuse the **authoring mechanisms and contracts**.

### Current WB2 Studio · KEEP

`wb2-studio.v1.js`

Already exposes:
- Asset Librarian-backed building/Resident search;
- exact source inspection;
- place into current WB2 scene;
- transform through existing edit owner;
- same scene shared by Build and Play;
- `A.saveDoc()`.

### Current terrain sculpt · KEEP

`wb2-terrain-sculpt-01/terrain-sculpt.js`

Deterministic Raise/Lower strokes already exist.
Do not create another terrain editor.

### Shared in-scene editor · KEEP / REUSE

Use existing selection / Move / Rotate / Scale / source identity seams.
Do not create another generic Three.js editor.

## Product hierarchy

### PRIMARY PRODUCT

**Buildable open world / visual story space**

Georg must be able to build locations that later serve as:
- comic scene context;
- Resident/social scenes;
- visual storytelling locations;
- exploration/play spaces;
- destinations/world recipes.

### CONTENT / FIXTURES

These are consumers of the authoring product, not its definition:
- KFB Town;
- Dystopia;
- Utopia;
- Protopia;
- Life Trees;
- Joyride roads;
- Residents;
- Cards/Billboards;
- Combat/minigames.

Combat is explicitly **not** a blocker for this recovery.

## Protected boundaries

Do not:
- create a second renderer or world owner;
- create another editor;
- create another Asset Librarian;
- replace WB2 scene/save ownership;
- regenerate the whole scene from prompts;
- use procedural prop scattering as final authored composition;
- require four-island visual completion before proving authoring;
- add Combat, quest, economy or social simulation as acceptance blockers;
- auto-merge or promote Live.

## Recovery sequence

### R0 · Boot the authoring surface

Use the existing World Studio Site/source owner.

PASS requires:
- world enters a real 3D scene reliably;
- no permanent loading overlay;
- no hidden fatal module/import failure;
- Build mode can be entered.

Do not touch world aesthetics until R0 is green.

### R1 · Source-proven placement

From the existing Asset Librarian/Registry seam:

1. search one real building;
2. show its actual source object in isolation;
3. place it in the world;
4. search one real prop;
5. show it in isolation;
6. place it in the world.

No placeholder cubes/primitives.

### R2 · Direct editing

On those real placed assets:

- select;
- move;
- rotate;
- scale;
- Surface Snap / Place on Ground;
- delete/undo or equivalent reversible removal.

The world must not regenerate around the edit.

### R3 · Terrain authoring

Use the existing WB2 terrain sculpt owner:

- Raise;
- Lower;
- brush radius/strength;
- placed loose props re-ground according to the existing response contract.

No second terrain implementation.

### R4 · Persistence

Save the authored world.

Fresh page/session reload.

PASS only if:
- exact asset identities remain;
- transforms remain;
- terrain strokes remain;
- source references remain;
- no manual reconstruction is needed.

### R5 · Play the authored space

Switch back to PLAY without rebuilding the scene.

Georg's actor can walk through the exact authored space.

This is the first actual human gate.

## First recovery fixture

Use **one deliberately small authored scene**, not the four-island showcase:

- one source-proven building;
- three source-proven props;
- optional one Resident only if already stable;
- one small terrain edit;
- one saved camera/view position if the current owner already supports it.

The fixture exists only to prove the tool.

Do not judge KFB Town / Utopia / Dystopia / Protopia composition in this gate.

## Done when

Georg can do this in the existing World Studio surface:

1. open the world;
2. search a real KFB/KayKit/Tiny Treats asset;
3. inspect its real source;
4. place it;
5. move / rotate / scale it;
6. alter nearby terrain;
7. save;
8. reload;
9. find the authored scene unchanged;
10. walk through it.

At that point the project again has a **usable open-world authoring product**.

Only then resume world-content composition such as the four island recipes.

## INDEPENDENT EXECUTION

- **Builder / Integrator:** ChatGPT Work/WSA · only production writer.
- **Integration Tester:** tests boot + place/edit/sculpt/save/reload/play on exact candidate.
- **Independent Critic:** checks only source fidelity and whether the loop is genuinely usable rather than a technical proxy.
- **Production Guard:** routes CONTINUE / REPAIR / QUARANTINE / HUMAN_DECISION / STOP.
- After two non-improving repairs, freeze the smallest failing seam. Do not stop the whole authoring recovery unless that seam blocks the loop.
- **Human gate:** Georg only after R0–R5 are internally proven.

## Exactly one next gate

**WORK/WSA executes R0–R5 on PR #348 and returns one internally proven Open-World Authoring candidate.**
