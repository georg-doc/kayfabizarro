# RETURN · Dungeon Room Blueprint S14 · 2026-09-20

Status: **IMPLEMENTED / BROWSER PROVEN / BLENDER FILE BUILT / HUMAN FORM GATE OPEN**

## Slice

- repository: `georg-doc/kayfabizarro`
- owner: `tools/world_atlas/`
- branch: `world-atlas/dungeon-room-blueprint-s14-blender-2026-09-20`
- Draft PR: `#126`
- base main: `b2d5dc445dff045c4579075bee231f2228014319`
- tested implementation head: `da04e03378f79ca973a3768e0c934bc5372b1aa5`
- evidence/recovery head: `e2d9a1fa24d024eb89ad513dc3b97762c0fb460b`
- fixed Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/dungeon-raid-v2/`
- Live: unchanged
- auto-merge: disabled / not requested

## Outcome

S21 R02 was promoted from ToolBox intake into the current World Atlas owner as an isolated room
blueprint. S13.2 remains the BSP/two-level/stairs generator owner. The S21 TransformControls editor
is retained, including persistence and recipe-patch emission.

Blender is deliberately not a second layout owner. The browser exports
`kfb.blender-room-manifest.v1`; Blender imports the exact pinned KayKit glTFs and applies those
world transforms.

## Assets / props

- unique R02 KayKit models: **24**
- registry-resolved: **24/24**
- Meshy/generated props: **0**
- asset revision remains pinned to `8948a06b75cb18c970599afb29b6a772315fad0e`

## Actual tests

- static source/contract: **22/22 PASS**
- real Chromium/editor: **15/15 PASS**
  - HTTP 200
  - R02 boot
  - 41 root children
  - 21 visible props
  - 0 technical room-check failures
  - 4 known source-reference deviations remain explicit
  - `truhe_auf` edit → patch → reload preserved
  - 37 visible Blender-manifest instances / 4 hidden
  - 0 page/console errors
- Blender 4.0.2:
  - **37 manifest instances / 39 imported objects**
  - valid `KFB_R02.blend` saved, 4,115,904 bytes
  - SHA-256 `93e439b122d5c6bb35727c8df79c5611a32fb48f7416d164e0471c2421f3ebef`
  - automated review PNG / GLB: **BLOCKED** after the save because Ubuntu headless Blender lacks `libEGL.so.1`

CI proof: run `35482605744`, job `106002993282`, artifact `10596520958`.

## Recovery

The Blender review-render gate is frozen after two failed repair passes. Full recovery:
`tools/world_atlas/failure-recovery/S14_BLENDER_REVIEW_GATE_2026-09-20/START_HERE.md`.

One intermediate proof-harness commit accidentally omitted the intended Git base tree. It was
immediately repaired in commit `34108a99a09a96169a30ab664c934c8a3df128de`; `main` was never
modified. The temporary Game Dev Studio workflow trigger was restored byte-identically to main.

Optional `game-dev`/Game Development Studio helper was not available for this slice; repository-native
Chromium + Blender CI was used instead.

## Publication

Candidate Stage files and Hub routing are included in this branch. PUBLIC VERIFIED is **not claimed**
until the exact Cloudflare route and its `SOURCE.json` marker are opened after mirroring to
`cloudflare-live`.

## Boundaries

- no Raid/Combat;
- no gameplay collision/navigation acceptance;
- no Tiny Treats merge;
- no shared `edit-layer.js` extraction yet;
- no BSP-generator integration yet;
- no Live promotion.

## One next gate

**Georg opens the fixed S14 Stage room and the preserved `KFB_R02.blend`, then accepts or rejects the
room/editor/Blender parity.** Only after that should R02 become a reusable Dungeon Generator room
module.
