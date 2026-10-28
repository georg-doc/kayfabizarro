# KayKit Platformer R6 · Full Source Inventory + Semantic Atlas · Evidence Report
**2026-10-28. Direct source directory/listing + actual small GLTF JSON parse + static data validation. NO LIVE 3D SOURCE PREVIEW/WS1 INTEGRATION.**

## Actual inputs
- Dropbox connected, source folders: `KayKit_Platformer_Pack_1.0_FREE` and `KayKit_Platformer_Pack_1.0_EXTRA` provided by Georg, CC0 licenses read earlier in this conversation. Source file tree checked in each `Assets/gltf/{neutral,blue,red,green,yellow}`.
- **All 10 folder listings complete** (`has_more=false`, no omitted pages). FREE = `neutral=38; colored blue/red/green/yellow=83 each; 370`. EXTRA = `neutral=53; colored=118 each; 525`. Both together **895 GLTF source files** and **895 matching .bin** filenames. Each folder contains `platformer_texture.png`; EXTRA's four colored dirs also contain `threads.png`. Extra=+155 colored/neutral variant GLTFs.
- Every FREE filename has the same name and *listed sizes* inside same-color EXTRA folder: **370/370**, size mismatch **0**. **Binary content hashes were not checked.** Never assert byte identity or safely collapse source duplicates without SHA-256.
- `171` semantically distinct **folder-role keys** in EXTRA: `53 neutral + 118 colored`; `121` FREE keys = `38 neutral + 83 colored`; **50 EXTRA-only keys**. Neutral and colored collections may have same basename but stay separate until geometry/provenance review. These numbers use folder-role keys rather than collapsing overlapping visible names.
- 12 source GLTF JSON files fetched via Dropbox and parsed: names of child node hierarchies, mesh POSITION accessor local bounds, original image/buffer URI. This is real file inspection, but NOT full world-space bounding boxes, GLTF renderer load or actual pivot/physics validation. Examples: FREE `lever_floor_base_blue` with independently nested `lever_floor_blue`; FREE `button_base_blue` button child; EXTRA `cannon_base_blue` separate turret/barrel, `saw_trap_blue` nested sawblade; EXTRA `conveyor_4x4x1_blue` both platformer atlas and `threads.png`; platform slope 4x4x4 local bound [-2,0,-2] to [2,4,2].
- Four proposed real-source board fixtures (SEAM/SWITCH/CONVEYOR_PIPE/HAZARD), **14/14 exact filenames present** in the full source roster; 9 candidate connector test kinds. No board constructed/accepted in 3D.

## Files created/read back this turn
1. `KAYKIT_PLATFORMER_R6_FULL_SOURCE_INVENTORY_2026-10-28.json` — all 895 observed model filenames with listed sizes, color folders, texture names, FREE/EXTRA source/diff.
2. `KAYKIT_PLATFORMER_R6_SEMANTIC_ATLAS_2026-10-28.json` — 171 catalog candidate roles with full color variants, family/interaction guess and **SOURCE_SOCKET_PROBE_REQUIRED**, no approved surfaces.
3. `KAYKIT_PLATFORMER_R6_GLTF_GEOMETRY_SAMPLES_2026-10-28.json` — 12 actual GLTF file structure/bounds/texture-dependency probes.
4. `KAYKIT_PLATFORMER_R6_FOUR_MEASURED_BOARD_FIXTURES_CANDIDATE_2026-10-28.json` — four source-authentic, **not yet measured** test board plans and compatibility probes.
5. `KAYKIT_PLATFORMER_R6_MODULAR_ATLAS_BUILD_BRIEF_2026-10-28.md` — full owner-safe measurement, source renderer, connector/Gizmo/WFC and gating procedure.

## Static assertions actually run
- **30/30** static assertions on Source Inventory, Semantic Atlas, 12 GLTF probes and technical brief: taxonomy, completeness, dependency presence, type keys, composites, no false geometry acceptance. These were run before the board file.
- Additional **26/26** static checks, now including four boards, all fourteen actor source names, nine candidate connector types, unmeasured/null bounds, CC0/owner/gate conservatism. Some assertions overlap the preceding 30; **do not combine them into 56 independent tests**.
- Two original source JSON files and GLTF samples were successfully parsed, and source atlas files were exact read-back from the named planning branch. These are **static source/document tests only**.

## Explicitly NOT performed
- SHA-256 byte closure, FTP/upload/download of actual source archive, private/published Asset Librarian model ingestion, Git LFS verification: **0**.
- Any real GLTF renderer load from this branch, mesh/BVH physical geometry, raycast footpoint, texture/UV visual comparison, edited snap socket, jig/Gizmo operation, individual catalog card screenshot, 3D source-isolation board: **0**.
- WFC runtime, actual route graph animation, combat/mech controls, browser/mobile/GPU/Audio, Work/WS1 game integration, CI, Stage, Site, Live: **0**.

**One next WS0 gate stays `WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE`.** Verify transfer bytes/hash and original model/source visual fit; then measure four boards inside the existing Asset Librarian/World Atlas and validate one L01 Switchyard attachment/route against actual WS1b source. No second asset library, no new runtime, no auto merge or publication.
