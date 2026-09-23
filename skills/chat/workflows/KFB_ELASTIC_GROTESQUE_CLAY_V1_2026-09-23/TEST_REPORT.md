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
