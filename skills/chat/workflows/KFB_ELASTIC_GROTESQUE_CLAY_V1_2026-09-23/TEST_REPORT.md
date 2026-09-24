# TEST REPORT · KFB Elastic Grotesque Clay v1 · Hürth 01

Date: 2026-09-23  
Status: **V2 BROWSER PASS · 21/21 · HUMAN 3D REVIEW PENDING**
Implementation tested head: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

## Current V2 browser / WebGL evidence

Workflow:
`OSM Elastic Grotesque Clay · Hürth 01`

Successful v2 run:
- run: `35909757979`
- head: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- result: **SUCCESS**
- browser assertions: **21/21 PASS**
- artifact: `10772592799`
- artifact digest: `sha256:14033aea95c75d006d3333347809a1a147256ba31dd28bda5505570d6572aedf`

Proven in Chromium/Playwright:
- source city = `huerth-v0`;
- 22/22 pinned real OSM building IDs loaded;
- 49 nearby real road parts used as context;
- modes = `clean / grotesque / elastic`;
- all three canvases booted WebGL2;
- current Grotesque path reports donor `src/style/cartoon-city.js`;
- elastic path reports no collision mutation;
- `elasticStyleVersion = ELASTIC_GROUP_WARP_V2`;
- `elasticGroupWarp = COHERENT_LOW_FREQUENCY_FIELD`;
- `elasticDetails = IRREGULAR_2_3_WINDOWS_NO_FRAME_PLUS_ONE_DOOR`;
- `elasticRoadSurface = CONTINUOUS_CATMULL_ROM_RIBBON`;
- `elasticPalette = KFB_WONKY_90S_CLAY_V1`;
- full block = 22 visible buildings in every panel;
- isolated source = exactly 1 visible building in every panel;
- returning from isolation restores 22 in every panel;
- page/console errors = **0**.

Screenshots:
- `01-block-comparison.png`
- `02-isolated-source-comparison.png`
- `report.json`

## Visual evidence boundary

The browser PASS proves actual 3D/WebGL execution and the declared source/owner invariants.

It does not decide taste.

Georg has accepted the **reference benchmark image** for form direction. The newly implemented 3D v2 translation still requires his visual acceptance.

## Benchmark byte proof

Repository benchmark:
`benchmark/KFB_EGC_STYLE_BENCHMARK_2026-09-23.jpg`

- Git blob: `d6dcb90770d83513204a6ea96fd56a60c7c3a296`
- dimensions: **640 × 360**
- local derivative SHA-256: `cb6de7beca127a84eb47722eb6229a4348f6a1e9ed66a6cb3af80664ff744621`

## Prior v1 evidence / recovery history

Previous accepted technical proof before v2:
- head `1db61b9c882e178000cf700a7d5f4d18ec03eba0`
- run `35904415847`
- **16/16 PASS**
- artifact `10769948842`
- digest `sha256:fa8823edeeec10c6e25cb11b08c15d85a205e6ecb17c6c66c9c8f1236e71c9a9`

Earlier diagnostic history remains valid:
- first evidence attempt timed out;
- diagnostic pass isolated one invalid literal `\\n`;
- one syntax repair fixed that instrumentation seam;
- no visual/deformer parameter was changed by that repair.

## Current unresolved test

Only one current acceptance question remains:

**Does the v2 actual 3D result visually reproduce the accepted benchmark direction closely enough to promote this grammar into the Blender-MCP / Geometry-Nodes production recipe?**

No Cloudflare/public Stage proof is claimed in this slice.


## TUNE ONCE · FINAL BROWSER EVIDENCE · 2026-09-24

Human input:
`HUMAN_RESULT_HUERTH01_V2_2026-09-24.md`

Final tuned runtime head:
`75b3c460ac37aac57cb5d9e96260517c5b4cf68d`

Final workflow:
- run `35945185715`
- result: **SUCCESS**
- browser assertions: **29/29 PASS**
- **3/3 WebGL2**
- page/console errors: **0**
- artifact: `10786850367`
- artifact digest: `sha256:716bfcab9dc6f4ed0180e0fd148b7a1494efca796bbe49746de762b0f8a900b0`

Tuned assertions:
- schema = `kfb.elastic-grotesque-clay.huerth01/0.3-tuned-candidate`;
- Elastic default decision recorded;
- retained switch views = `clean / cartoon / grotesque / elastic`;
- details = `FINAL_BOWED_SURFACE_FRAME_FLUSH`;
- shadow = `BIAS_0_NORMAL_BIAS_0_04_TIGHT_FIT`;
- road = `CONTINUOUS_CATMULL_ROM_RIBBON_PLUS_OSM_NODE_PATCHES`;
- real shared-OSM-node asphalt junction patches = **23**;
- roof = `FINAL_TOP_OUTLINE_SMALL_OVERHANG`;
- palette remains `KFB_WONKY_90S_CLAY_V1`;
- source = 22 real Hürth buildings / 49 nearby road parts;
- isolation round-trip = 22 → 1 → 22;
- legacy City Lab CLEAN / CARTOON / GROTESQUE each boot unchanged.

Visible evidence inspected from the final artifact:
- `01-block-comparison.png`
- `02-isolated-source-comparison.png`

The first road-junction repair temporarily exposed pale curb/path junction discs. That intermediate candidate was visually rejected before publication. Final head `75b3c460…` keeps only same-colour asphalt patches at real shared OSM nodes.

Cloudflare wrapper publication:
- route: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`
- `cloudflare-live` wrapper base pin updated to `75b3c460…`
- wrapper commit: `96d1e75796e051ec6aa91dc26d25c01aafbd4ea3`
- Hub routing commit: `de20e4cb8ddc3bf146d8e289251b145847dddc23`
- **PUBLIC_VERIFIED: UNKNOWN in this chat environment** — direct Pages retrieval is currently unavailable to the tool, so no false public-PASS claim is made.

Exactly one next gate:
**Georg opens the direct Hürth review route and ACCEPTS or REJECTS the tuned V2.**

## R2 FINAL BROWSER EVIDENCE · 2026-09-24

Human gate:
`HUMAN_RESULT_HUERTH01_V2_R2_2026-09-24.md`

Final R2 runtime head:
`4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`

Workflow:
- run `35947303053`
- result: **SUCCESS**
- browser assertions: **38/38 PASS**
- **3/3 WebGL2**
- page/console errors: **0**
- artifact: `10787192998`
- digest: `sha256:aa193dff031169bcfef73c9eb381b6d80a3b5099243818994b999a755073e0a0`

Runtime report:
- schema = `kfb.elastic-grotesque-clay.huerth01/0.4-r2-candidate`;
- 22 real Hürth buildings / 49 real road parts;
- Elastic detail count = **193**;
- details = `ORGANIC_ALL_VISIBLE_FACADES_FINAL_SURFACE_FRAME`;
- shadow = `4096_TIGHT_FIT_BIAS_0_0002_NORMAL_0_055_ROOF_NO_RECEIVE`;
- road = `CATMULL_RIBBON_OSM_NODE_ASPHALT_PATCH_PLUS_PATH_CONNECTOR`;
- real asphalt shared-node patches = **23**;
- path→road connectors = **10**;
- roof = `FINAL_TOP_OUTLINE_EAVE_OVERHANG_R2`;
- palette = `RACER_COLOGNE_HARMONIC_R2`;
- selected harmony scheme = `komplementaer`;
- deterministic palette seed = `2821914198`;
- isolation = 22 → 1 → 22;
- legacy City Lab CLEAN / CARTOON / GROTESQUE each boot unchanged.

### Exact Racer Cologne palette donor

Source repository:
`georg-doc/KFB-Stunt-Car-Race`

Source commit:
`cc80f4a1c6c509db9668df79fd53b13cee093a9d`

Executed source file:
`KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js`

Source blob:
`38246785ec2c9089737b2a195673a3ad4c07bdf8`

The file is copied byte-for-byte into:
`tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/vendor/racer-cologne/cologne-palette.v1.js`

Companion style donor:
- `option-c-style.v1.js`
- source blob `c39c163019ab16c602b32c70202880680f9173c7`
- same Race commit `cc80f4a1…`
- exact byte copy.

The R2 candidate executes Racer Cologne's existing OKLCH harmonic `makePalette()` logic.  
Story-mode/card-semantic ownership remains the existing `world-context.js` lane; R2 does not invent a substitute story/card system because no concrete story mode or card triplet was specified by the R2 gate.

### Shadow before / after

BEFORE:
- V2 runtime `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- run `35909757979`
- artifact `10772592799`
- digest `sha256:14033aea95c75d006d3333347809a1a147256ba31dd28bda5505570d6572aedf`

AFTER:
- R2 runtime `4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`
- run `35947303053`
- artifact `10787192998`

Final R2 screenshots:
- `01-block-comparison.png`
- `01b-elastic-r2-after.png`
- `02-isolated-source-comparison.png`
- `report.json`

The final screenshot was visually inspected before publication. It shows the R2 roof eave, multi-side facade details, Racer Cologne palette, and no open pale curb wedge at the reviewed T-junction.

### Publication

Review route:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`

`cloudflare-live` wrapper base pin:
`4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`

Wrapper commit:
`e4d25a6f7454dd6b86503a168cb9a0795c211b7b`

Hub update:
`f23f9b2cf2e427420366601efbda053079d38ce0`

The current chat web-fetch path returns a cache miss for Pages, therefore **PUBLIC_VERIFIED is not claimed by this agent**. Georg's real-Chrome open is the current public/human gate.

Exactly one next gate:
**GEORG ACCEPT / REJECT R2.**
