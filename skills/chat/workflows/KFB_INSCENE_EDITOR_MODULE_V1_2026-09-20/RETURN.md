# RETURN · KFB shared 3D Scene-Patch Adapter v1

Date: 2026-09-20  
Status: **TWO-HOST BROWSER PASS · STAGE/HUMAN GATE NEXT**  
Owner: ToolBox shared editor/patch module; receiving host keeps scene/runtime ownership  
Repository: `georg-doc/kayfabizarro`  
Branch: `toolbox/scene-patch-adapter-v1-2026-09-20`  
Tested head: `f3cb12d119a0e565b1d8b09a9eb2d667c6e8b218`

## Outcome

The S21/S38 in-scene editing grammar is now a shared module rather than a third independent editor.

Two existing hosts use the same contracts:

1. **Resident Atlas** — Habitat + Props can be selected, moved, rotated/scaled, reset, exported/imported and restored. The animated resident remains protected for this v1.
2. **Dungeon Generator S13.2** — real generated candle/light props can use the same patch workflow. Layout, walls, floors, corners, stairs, mounted torches and the generator Recipe remain owned by S13.2 and are read-only.

## Shared implementation

- `tools/KFB-ToolBox/shared/scene-patch/edit-layer.v1.js`
  - promoted from the real S38 editor donor;
  - one TransformControls owner;
  - nested record-node support;
  - editable vs read-only picked records.
- `tools/KFB-ToolBox/shared/scene-patch/scene-patch.v1.js`
  - schema `kfb.scene-patch.v1`;
  - baseline + changed ops only;
  - exact object/source identity;
  - strict host/source/revision validation;
  - atomic import rejection;
  - undo/redo/reset;
  - optional local draft;
  - no automatic recipe rewrite.

Host adapters:
- `tools/resident_atlas/scene-patch-adapter.v1.js`
- `tools/world_atlas/source/lib/dungeon-scene-patch-adapter.v1.js`

## Tested result

Final GitHub Actions run `35538997214`: **SUCCESS**.

- Resident Atlas: **20/20 PASS**
- Dungeon S13.2: **22/22 PASS**
- Combined: **42/42 PASS**
- Browser/page errors: **0**
- Generator Recipe mutation: **0**
- Wrong-source/revision imports: rejected before mutation
- Dungeon moved candle: existing light follows mesh

Full evidence: [TEST_REPORT.md](TEST_REPORT.md).

## Owner boundaries kept

- Asset Registry/Librarian remains asset identity/discovery truth.
- Resident Atlas remains resident scene/composition owner.
- Resident actor pose/animation ownership is untouched in v1.
- World Atlas S13.2 remains Dungeon layout/two-level/stairs/Recipe owner.
- Scene Patch owns only reversible transform-session mechanics.
- Tiny Treats is not integrated in this slice.
- No second renderer, scene graph, asset browser, generator or save format was created.

## Dropbox

S21 Room Study and S38 source lines were checked read-only. No Dropbox files were copied, moved, deleted, renamed or promoted.

## OPEN / DEFERRED

- actor/resident bone posing through this patch seam;
- Tiny Treats room/group recipes;
- Environment Atlas/Babel adapters;
- notes/anchors beyond the current transform patch;
- permanent host recipe bake-back (requires host-owned deliberate action, not automatic patch import).

## Exactly one next gate

Publish an isolated Cloudflare Stage candidate and let Georg test one Resident prop and one Dungeon candle with:
**select → move → reset → import → undo/redo**.

Only after that human gate should Tiny Treats room/groups and Resident pose/diorama work start on this shared seam.
