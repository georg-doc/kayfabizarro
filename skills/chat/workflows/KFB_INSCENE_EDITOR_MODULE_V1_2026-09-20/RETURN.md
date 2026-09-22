# RETURN · KFB shared 3D Scene-Patch Adapter v1

Date: 2026-09-20  
Status: **PUBLIC_VERIFIED · TWO-HOST HUMAN GATE NEXT**  
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

Georg tests the now-public isolated Stage candidate with one Resident prop and one Dungeon candle:
**select → move → reset → import → undo/redo**.

Direct human route:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/scene-patch-v1/

Only after that human gate should Tiny Treats room/groups and Resident pose/diorama work start on this shared seam.


## Stage mirror + publication checkpoint · 2026-09-22

The isolated two-host Stage package is built from the already-tested source, not a replacement runtime.

- Stage mirror source head: `caf438438007a992d9f65db1fb70d407c4b2dbb9`
- Stage mirror workflow run: `35539447295` · **SUCCESS**
- Stage mirror browser assertions: **13/13 PASS**
- Stage mirror artifact: `10613569458` · `scene-patch-stage-mirror-proof`
- Artifact digest: `sha256:9cdd04a2abbf53fae64c75ab17c7e3216ad0ad0fad2804ecdaa6c8d93baef4a8`
- Browser/page errors: **0**

Exact tested mirror files were copied atomically to the publication branch:
- `cloudflare-live` candidate content commit: `2c2de267b9413b262d51152408e616751c1e8e85`
- current Hub link commit / publication head at checkpoint: `f0c269904de722b86260e1657928e9a1936127b4`

Human/public target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/scene-patch-v1/`

Public QA attempt 1 (`35671642443`) failed at the public child-route gate after the isolated mirror had passed. The exact publication Git ref and all three Scene-Patch markers were fetched back and remain correct. A single retry (attempt 2) is currently the final allowed public-sync pass; until it completes, public status is **PENDING / NOT CLAIMED**.

Main has advanced substantially since this bounded branch was created. Do not auto-merge the old branch over newer main work; reconcile through its draft PR after the human/public gate.

Next ToolBox recon/user direction is persisted separately in GitHub issue **#167** so Card Zone / Texture Browser / Voxel-look / Legacy EyeRig / Cologne work cannot be lost or accidentally folded into this Scene-Patch slice.


## Public Cloudflare proof · final

Public QA run `35671642443`, **attempt 2: SUCCESS**.

- exact public route: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/scene-patch-v1/
- public assertions: **13/13 PASS**
- public Resident host: loaded + source identity + editor activation PASS
- public Dungeon host: generated real candle set + source identity + editor activation PASS
- KFB Hub: HTTP PASS + direct Scene Patch link PASS
- page/console errors: **0**
- public proof artifact: `10671626183` · `scene-patch-public-proof`
- artifact digest: `sha256:356dbf12428252b54040e50a4077767e0cac3234c74982adbdaf4ca28a4bb2cf`
- artifact contents: report + Resident screenshot + Dungeon screenshot + public evidence file set

Attempt 1 is retained as publication-sync history; it does not invalidate the later successful proof. No Live promotion or main merge is implied by PUBLIC_VERIFIED.

Current publication branch checkpoint:
`cloudflare-live@f0c269904de722b86260e1657928e9a1936127b4`.

The implementation branch is intentionally not auto-merged because current `main` has advanced substantially since the bounded slice began. Reconciliation belongs in the draft PR, not in this human gate.
