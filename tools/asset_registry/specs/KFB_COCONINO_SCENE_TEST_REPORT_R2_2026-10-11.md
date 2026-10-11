# KFB Coconino Scene / Joyride / Light R2 · Test Report
Date: 2026-10-11 · Status: Documentation/JSON static checks only; **NO visual 3D or generator proof**.
Branch: `planning/kfb-coconino-mesa-asset-recon-2026-10-11`. Parent R1 tests: 19/19 GitHub file/tree/GLTF checks PASS. These are separate R1 results, not newly rerun in R2.

## R2 source inspection
- 4/4 exact R2 authored GitHub spec/job files re-fetched and full contents checked at branch head after each write.
- JSON parsed cleanly: `kfb.coconino-scene-batch/1`, 3 embedded `kfb.asset-scene-image-job/1` entries.
- 17/17 static checks PASSED from actual GitHub re-fetch:
  1. scene briefing readback nonempty
  2. palette/light doc readback nonempty
  3. JSON file readback + valid parse
  4. Blender MCP/Work brief readback nonempty
  5. exactly three named jobs
  6. schema matches Composer contract on every job
  7. all jobs are `BLOCKED_SOURCE` with `sourcePixelsActuallySupplied=false`
  8. Joyride context present in all prompts
  9. no new unsupported character source identities
  10. each proposal <=6 major build shape families
  11. every asset reference carries 40-hex source blob SHA
  12. P1/P2/P3 palette ids distinct
  13. Four-Island R4 STOP guarded
  14. Track Core / no-Hex owner guards present
  15. guide benchmark numeric vs accepted source distinction made
  16. Blender actual source isolate gate documented
  17. Blender neutral form ordered before materials.
- Existing open GitHub issue #388 successfully amended for Joyride/Composer/Blender/MCP, exact body fetched back.

## Dropbox evidence (metadata and preview, NOT pixel conditioning)
Read-only `/CLAUDE/KFB Claymation Reference`: original root file listing contains `DioramaScenes A,B,C,D,E,F,G,I` + overview (nine Diorama files by title), `FLOATING ISLANDS DESIGN.webp`, and `Race Track Builder` child directory with **15** images. Dropbox preview data for overview, Floating Islands and Diorama B resolved. Could not transfer actual image pixels into a generator; do NOT call thumbnail URLs source conditioning receipts.

## Geometry source references
Real exact GitHub blobs pinned:
- KFB K1/H0 `clay-catalog.v5.js` source `1cb40e45dc4d2ca20a554e4315b68f9331af4152` with existing `mesa()`.
- Kenney `rock_tallA.glb` `31d1fb480f2bd18b47e7d6b8e2308d4b7301da4a`, `cliff_top_rock.glb` `df8835990094d36b796de110a5d1b11c786abefa`, `cactus_tall.glb` `7896d4ee7e478b1f8a138f891cdd0e704d33e95e`.
- KayKit Forest `Rock_1_A_Color1.gltf` `cfee4dd720002583c195f1e4f6ce35eeb984b51d` + BIN `df23c5d4e393fc366f992340aea4433ec7fc3c8e`.
- Quaternius SciFi `Rock_Large_1.gltf` `4074d7c4f766026916138eeb704e561898c91ca0`. License has unrelated pack header; do not mislabel provenance resolved.

## NOT RUN / no acceptance claim
- Source mesh 4-view isolated render: **0**; real source PNG conditioning receipts: **0**.
- Composer image-generation calls: **0**; hero image PNGs: **0**; style visual acceptance: **0**.
- Blender MCP renders/geometry exports: **0**; neutral M01–M03 actual mesh prototypes: **0**.
- Track Core compiled connection/drive/collision checks: **0**; player FPS/perf: **0**.
- Independent critic / World Golden / Georg selection: **0**.
- Public Site, Cloudflare Stage, Stage browser, PR, merge or Live: **0**.

**Next evidence gate (one)**: Source-isolated actual geometry/source view pixels and neutral M01–M03 with track-aware J1/J2 visual design side-by-side; Georg A/B/FAIL before any new scene geometry implementation. Job packets remain BLOCKED_SOURCE until actual source pixels are accessible to the image producer.
