# RETURN · KFB Elastic Grotesque Clay v1 · Hürth 01

Date: 2026-09-23  
Status: **V2 IMPLEMENTED · 21/21 BROWSER PASS · BENCHMARK PINNED · GEORG V2 3D REVIEW PENDING · NOT PUBLIC**

## Slice

**Goal:** translate Georg's accepted wonky/clay neighbourhood benchmark into real reusable 3D geometry on a pinned Hürth OSM fixture.

**Owner:** existing **OSM City Lab presentation / KFB ToolBox authoring**.

Receiving Race / Travel / WorldBuilder owners remain unchanged.

## Git state

- repository: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`
- Draft PR: **#194**
- base: `main@dca52479dad9c176acde6e7c7167dc133bf50bdd`
- v2 browser-tested runtime/source head: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- accepted benchmark image added later on same branch; current handoff head must be read from PR #194
- no merge
- no Live promotion

## Georg benchmark decision

Georg accepted the generated clay-neighbourhood image as the **shape / facade-detail / handmade-model benchmark**.

Pinned repository reference:
- `STYLE_BENCHMARK.md`
- `benchmark/KFB_EGC_STYLE_BENCHMARK_2026-09-23.jpg`
- Git blob `d6dcb90770d83513204a6ea96fd56a60c7c3a296`
- 640 × 360 JPEG review derivative
- SHA-256 `cb6de7beca127a84eb47722eb6229a4348f6a1e9ed66a6cb3af80664ff744621`

Accepted direction:
- stronger coherent group deformation;
- rounded/bowed/leaning building masses;
- sparse irregular tall/narrow windows;
- varied door size;
- smooth continuous street/curb language;
- matte clay/model feel.

Requested tuning:
- more explicit cartoon / offbeat 90s-animation palette.

## V2 implemented 3D result

The same real OSM source fixture is still available as CLEAN / CURRENT GROTESQUE / ELASTIC.

### ELASTIC GROUP WARP V2

Actual 3D geometry now uses a low-frequency block field shared by neighbouring buildings.

The field drives:
- lean;
- bend;
- roof-plane slope;
- block pull.

Building-local seeded channels remain secondary:
- belly;
- taper;
- small twist.

This creates a correlated wonky street rather than independently distorted boxes.

### Facade details

Default generated facade:
- one varied door;
- 2–3 visible windows;
- tall/narrow window proportion;
- irregular placement;
- no floor-grid assumption;
- safe distance from door;
- no bright white frame.

Window and door colors are selected from the shared palette family.

### Roads / curbs / paths

The Hürth 01 visual proof no longer builds roads as visible rectangular segments.

V2 uses:
- centripetal Catmull-Rom centerline interpolation;
- one continuous road ribbon;
- separate continuous curb ribbon;
- separate path ribbon;
- explicit vertical layer separation;
- depth-write/polygon-offset presentation handling to reduce z-fighting / bright overlap seams.

OSM centerline/source truth remains unchanged.

### Cartoon clay palette

Candidate:
`KFB_WONKY_90S_CLAY_V1`

Systemic zones:
`walls / roofs / doors / windows / ground / curb / road / path / sky`

Variation is deterministic within one palette family rather than one-off per-object recoloring.

## Source truth

- Hürth normalized source: `tools/osm-city-lab/data/huerth-v0/normalized.json`
- pinned source blob: `936a5d990d2f394ae2bccbb4607d0821ca67a191`
- source spec blob: `9ec4c53f07b78113def073f649a8b4a014ada38e`
- fixture: **22 real OSM buildings**
- browser context: **49 real nearby road parts**

Current Grotesque donor remains:
- `tools/osm-city-lab/src/style/cartoon-city.js`
- blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`

Current City style:
- `tools/osm-city-lab/styles/kfb-city-v0.json`
- blob `f129cca3041b55b84de26048dad7aef8fac8b292`

## Protected boundaries retained

- OSM IDs unchanged.
- OSM footprints/source heights unchanged.
- S2/collision/export geometry unchanged.
- no movement owner created.
- no terrain owner created.
- no landmark owner replaced.
- no vehicle-deformer ownership moved.
- no source GLB destructively edited.
- no Cel/outline dependency required.

## Tests / visible evidence

Current v2 browser proof:
- run `35909757979`
- tested head `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
- **21/21 PASS**
- **3/3 WebGL2**
- page/console errors: **0**
- artifact `10772592799`
- digest `sha256:14033aea95c75d006d3333347809a1a147256ba31dd28bda5505570d6572aedf`

Artifact:
- `01-block-comparison.png`
- `02-isolated-source-comparison.png`
- `report.json`

The screenshots visibly show:
- CLEAN remains undeformed source massing;
- CURRENT GROTESQUE remains stacked/faceted comparison evidence;
- ELASTIC V2 is one continuous rounded/bowed volume;
- the ELASTIC block uses the new systemic palette and smooth road language.

## Future enterable-building seam · DEFERRED

Georg proposed selected buildings with real KayKit door props and later enterable/interior instances.

This is recorded, not implemented.

Next later source-first sequence:
1. locate exact KayKit door AssetRefs;
2. isolate the exact source door;
3. verify whether real open/close animation exists;
4. mount only on selected buildings;
5. define portal/instance enter/return seam.

Do not replace this with a generic generated door asset.

## Stage/publication

Cloudflare Stage: **NOT PUBLISHED**.

This checkpoint stays chat/repository review first. No Live claim.

## Exactly one next gate

**GEORG HUMAN VISUAL GATE · HÜRTH 01 V2 ACTUAL 3D**

Review the actual v2 3D geometry, especially:
- whole-block group warp;
- isolated source building;
- irregular facade details;
- smooth road/curb ribbons;
- new cartoon clay palette;
- absence of the prior bright overlap/segment artifacts.

Decision:
**accept the v2 3D translation / tune it once / reject the translation.**

If accepted, the next production slice is the **Blender-MCP / Geometry-Nodes compiler recipe** for this exact accepted grammar.


## 2026-09-24 · Lead routing + chat review transport

A review-transport problem was reproduced in ChatGPT: the previous chat wrapper depended on an iframe / external source chain and repeatedly triggered an allow/cancel dialog instead of reliably showing the candidate.

Decision:
- canonical V2 Three.js runtime remains unchanged on PR #194;
- the in-chat human review artifact must be a **single self-contained HTML**;
- no iframe;
- no CDN;
- no runtime fetch;
- no cross-origin module chain.

This is a packaging fix, not a style/runtime regression.

Lead anti-regression routing was also strengthened:
- `LEAD_OVERRIDE_2026-09-24.md` added;
- `skills/chat/REGISTRY.json` now has a dedicated `elastic-grotesque-clay-huerth01` CURRENT_REFERENCE entry;
- old City-Lab GROTESQUE and Hürth 01 V1 are explicitly comparison/history, not the continuation basis;
- current candidate remains `ELASTIC_GROUP_WARP_V2` with `KFB_WONKY_90S_CLAY_V1`.

Browser-tested V2 runtime/source checkpoint remains:
`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`
with **21/21 PASS · 3/3 WebGL2 · 0 page/console errors**.

Exactly one gate remains unchanged:
**Georg human visual review of Hürth 01 V2 actual form language.**


## 2026-09-24 · Chat mirror correction / recovery

Georg reviewed the simplified self-contained Canvas chat mirror and rejected it as a faithful representation of V2.

Observed in the mirror:
- wrong / reduced building rendering;
- facade details such as doors/windows not correctly placed/readable;
- overall shrink/simplification impression versus the previously accepted/good-looking V2 direction.

Decision:
- **mirror = REJECTED AS VISUAL REVIEW AUTHORITY**;
- do not tune from it;
- do not use it as donor or continuation source;
- canonical tested V2 Three.js runtime remains unchanged and CURRENT.

Current short recovery is now:
`CHAT_RECOVERY_CURRENT.md`

Exactly one next gate remains:
**show/recover the ACTUAL tested Hürth 01 V2 result for Georg visual review — no substitute renderer.**

## 2026-09-24 · TUNE ONCE IMPLEMENTED

Human result:
`HUMAN_RESULT_HUERTH01_V2_2026-09-24.md`

Verdict received:
**TUNE ONCE → tuned V2 becomes the form-language basis if Georg accepts this review.**

Final tuned runtime head:
`75b3c460ac37aac57cb5d9e96260517c5b4cf68d`

### Four bounded visual changes

1. **Facade details**
   - doors/windows now sample position + full 3D surface frame from the final bowed shell;
   - visible detail face is flush/inset rather than floating off a flat source facade.

2. **Shadows**
   - Elastic-only directional-shadow fit tightened around the block;
   - `shadow.bias=0`;
   - `shadow.normalBias=.04`;
   - palette and V2 form geometry were not changed to hide the artifact.

3. **Road junctions**
   - retained V2 continuous Catmull-Rom ribbons;
   - reused City Lab shared-OSM-node junction-patch donor;
   - final candidate patches asphalt only, in road colour;
   - no curb/path junction discs.

4. **Roof overhang**
   - roof base is derived from an outward offset of the final deformed wall-top ring;
   - overhang remains small and bounded.

### Final evidence

Run `35945185715`: **29/29 PASS · 3/3 WebGL2 · 0 errors**.  
Artifact `10786850367`, digest
`sha256:716bfcab9dc6f4ed0180e0fd148b7a1494efca796bbe49746de762b0f8a900b0`.

Legacy views:
**CLEAN / CARTOON / GROTESQUE boot unchanged**.  
Elastic is the new default decision, not the only available view.

### Review publication

Direct review route:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`

`cloudflare-live` wrapper now pins the unchanged tuned multi-file app at `75b3c460…`; no bundle/substitute preview is used.

This chat cannot independently retrieve the Pages domain, therefore **PUBLIC_VERIFIED remains UNKNOWN** until Georg opens the direct route in real Chrome.

### Exactly one next gate

**GEORG: ACCEPT / REJECT tuned Hürth 01 V2.**

After ACCEPT:
LC-01 from `LOOK_COMPOSITION_01_2026-09-24.md`.
