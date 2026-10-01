# KFB-CLAY-GOLDEN-CATALOG-V2 · Claude Design brief

Status: **READY TO START AFTER SSOT MERGE**  
Model/tool: Claude Design desktop, existing ToolBox project  
Purpose: extend the locked KFB clay Golden Samples across the actual asset families without inventing another style or runtime

## Read first

1. `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md`
2. `tools/KFB-ToolBox/docs/KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`
3. `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`
4. K1/H0 package named by the SSOT
5. current ToolBox Production-06 Return/Source

If these paths are unavailable, stop `SOURCE_REQUIRED`. Do not ask Georg to redescribe the Golden Samples.

## Goal

Build one comparison catalogue that makes the KFB clay style reproducible for external LLMs and all current consumers. This is a design/calibration catalogue, not a second runtime owner.

## Required rows

1. **Buildings:** KayKit `building_A` master; `building_E`; one verified Kenney building; one real OSM building group.
2. **Terrain:** H0 terrain near/mid/far; one current island/terrain candidate using the same palette/light.
3. **Nature:** K1 tree, bush, rock; one authored pack cluster unchanged.
4. **Props:** streetlight, trafficlight_A, firehydrant, bench; one small handheld prop.
5. **Characters:** K1 Black Knight Rig_Large; Farmer Rig_Medium; FrizzleBob v5b. Neutral and one moving pose; no static softening of skinned meshes.
6. **Vehicles:** K1 taxi/police plus J17 KayKit Cabrio. Preserve wheels, seat and contact roots.
7. **VFX:** one land puff, one impact, one prop_break/gift burst using the existing clay-vfx event path.

## Comparison layout

For every row:

`UNCHANGED SOURCE | LOCKED GOLDEN/REFERENCE | K2/v10 CANDIDATE | CLOSE-UP | COST`

Use identical camera, projection, scale, light, background and shadow settings within a row. Buildings additionally use the exact FACADE-A/B-01 contract.

## Palette page

Show the same three representative objects under at least three caller-provided biome/deck palettes. Use the current transition atlas for palette transitions. Do not create a new palette owner or linear-gradient substitute. Record seed and semantic color roles.

## Output

- editable `.dc.html` catalogue;
- small source manifest with exact Git refs/paths;
- machine-readable matrix delta;
- images for each fixed comparison row;
- measured cost table;
- `RETURN.md` with `MATCH`, `TUNE`, `FAIL` or `NOT_TESTED` per row;
- exactly one next gate: Georg reviews only rows proposed for Golden promotion.

## Size and persistence

- Do not embed or duplicate canonical GLBs, 3K textures, PDFs, videos or large baked streams.
- Load pinned sources from GitHub or reuse already-project-local donors.
- Handoff target: under 10 MB; hard stop before 15 MB.
- Images may be downscaled evidence; canonical assets remain at their source.
- No GitHub/Cloudflare deploy loop from Claude Design. Return the small code/evidence package for one owner check-in.

## Failure rules

- Candidate-only images are a FAIL.
- A different object standing in for a named source is a FAIL.
- “Visibly deformed” without Golden parity is a FAIL.
- A newer shader version without locked A/B proof remains TUNE.
- After two failed passes on one row, freeze it and return the exact mismatch; do not invent a third look.
