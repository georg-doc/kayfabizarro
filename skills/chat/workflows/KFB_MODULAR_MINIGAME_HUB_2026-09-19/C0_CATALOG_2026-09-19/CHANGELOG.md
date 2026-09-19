# C0 Baukasten · additive changelog

## 2026-09-19 · implementation branch

- recovered current `main` at `5650b6c54d8789b20ea80abe857688173d506d3b` before branch creation;
- created `chatgpt-web/baukasten-c0-2026-09-19`;
- added fixed Stage slice at `/kfb-hub/stage/minigames/baukasten-c0/`;
- reads the current central registry pack shards instead of creating a second asset catalog;
- covers Kenney Platformer, KayKit Dungeon, KayKit Medieval Hexagon + Builder, all six Tiny Treats packs and KayKit Mystery Series 6;
- reuses Resident Scene Module `clown-juggling-island` and the current FrizzleBob Driver Graft contract/reader;
- added four-role proof layout plus a second Tiny Treats witness specifically to prove modular-interior vs loose-scenery distinction;
- added dedicated browser QA that records measurements and screenshots before the PR is offered for review.


## 2026-09-19 · TESTED RESULT · browser proof

- corrected Tiny Treats House Plants from an unsupported modular-interior claim to `LOOSE SCENERY · STRUCTURAL UNKNOWN`; the current registry shard exposes plant/pot/leaf/vine families but no positive wall/floor/door/modular filename in the C0 scan;
- kept Bakery Interior and Bubbly Bathroom as proven mixed modular-interior + loose-prop packs, Pretty Park as ground-modules + loose-scenery, Pleasant Picnic as loose scenery, and Homely House as limited scene/ground parts rather than a universal interior grammar;
- rejected static GLTF accessor bounds as final world measurements and measured the actual loaded browser scenes through `THREE.Box3`;
- dedicated browser QA run #3 (`35443475397`) succeeded on implementation head `df1ba37def5259996433659bebb42d3ee873b03d`: 19/19 assertions, 11/11 pack cards, 6/6 Tiny Treats cards, 5/5 measured witnesses, 0 runtime errors, 0 console errors;
- browser measurements: carries `4.000 × 0.150 × 4.000`; modular door `1.600 × 2.800 × 0.740` with re-derived scale `0.732` for a 2.05 target; loose bench `2.000 × 1.406 × 1.317`; Resident module `7.768 × 4.632 × 4.606`; FrizzleBob graft `1.943 × 2.278 × 0.994`;
- persisted `SOURCE.json`, `TEST_REPORT.md`, compact `browser-report.json` and five screenshots at evidence commit `bfd72cb46a0315e903a213911cdab96cc223a105`;
- reduced the QA evidence payload from a full pack-shard snapshot to compact registry summary + proof/module references, preserving the central Asset Registry as the only asset identity/provenance owner;
- visually inspected desktop overview, Tiny Treats classification, Resident module, FrizzleBob Driver Graft and mobile carry proof; no source-fallback geometry is used;
- `PUBLIC DEPLOYMENT` remains pending because the fixed Cloudflare Stage route is not claimed before review/merge.
