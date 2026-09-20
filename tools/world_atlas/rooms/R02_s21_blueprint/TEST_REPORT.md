# TEST REPORT · World Atlas S14 Room Blueprint · 2026-09-20

Status: **BROWSER/EDITOR PASS · BLENDER .BLEND BUILD PASS · HEADLESS REVIEW RENDER BLOCKED**

Branch: `world-atlas/dungeon-room-blueprint-s14-blender-2026-09-20`  
Tested implementation head: `da04e03378f79ca973a3768e0c934bc5372b1aa5`  
Frozen recovery head before this evidence update: `e040c76eb3f3669d4fd31db96ee2456e4ed71bd4`

## Static/source contract

**22/22 PASS**

The static audit covers S14 host wiring, retained TransformControls editor, namespaced persistence,
browser-owned Blender manifest export, current World Atlas asset pin, 24/24 R02 source-model registry
resolution, Three→Blender basis conversion, .blend/PNG/GLB code paths and the macOS one-click runner.

## Real Chromium/editor proof

GitHub Actions run: `35482605744`  
Job: `106002993282`

**15/15 PASS**

Observed:
- HTTP 200;
- room `R02` booted;
- 41 built root children;
- 21 visible props;
- 0 technical red room checks;
- exactly 4 intentional source-reference deviations remain explicit rather than being replaced;
- `truhe_auf` was nudged +0.1 X through the S14 editor seam;
- the emitted recipe patch was `{ part: 'chest_gold', id: 'truhe_auf', pos: [1.88, 0.19], rot: 60 }`;
- reload restored the same correction and patch;
- Blender manifest schema/room/source pin passed;
- manifest contained 37 visible instances and 4 hidden instances;
- 0 browser console/page errors.

Browser screenshot SHA-256:
`b35b1ce87c48f8aa175fc7553d6dfb1e1e930400cd72cefce22b238f248d9683`

Manifest SHA-256:
`d8431c826ef7aca0c979d3a95e2b8b493730d4eb301de6430fc0977344417b9b`

## Blender proof

Runner Blender: **4.0.2**

The repaired run imported the real pinned KayKit glTF files, then logged:

- `instances=37`
- `importedObjects=39`
- `Info: Saved "KFB_R02.blend"`

Generated Blender file:
- size: **4,115,904 bytes**
- SHA-256: `93e439b122d5c6bb35727c8df79c5611a32fb48f7416d164e0471c2421f3ebef`
- file signature verified after artifact download as `Blender3D ... version 4.00`

The subsequent headless render crashed on the GitHub Ubuntu runner:
`Couldn't open libEGL.so.1: libEGL.so.1: cannot open shared object file`
→ process exit 134.

Therefore:
- `.blend`: **PASS / preserved**
- automated review PNG: **BLOCKED**
- automated exported GLB: **BLOCKED** (script did not reach the export step)
- local macOS Blender run: **NOT_RUN**
- human Blender/Form approval: **OPEN**
- gameplay collision/navigation/runtime: **OUT_OF_SCOPE**

Per KFB recovery rule, the Blender review-render gate is frozen after two failed repair passes.
No third CI repair is attempted in this slice. See
`tools/world_atlas/failure-recovery/S14_BLENDER_REVIEW_GATE_2026-09-20/`.
