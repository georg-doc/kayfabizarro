# WorldBuilder · Floating-Island Corridor · Return

Status: **WC1 GPU BASELINE + COST SPLIT MEASURED · CLAY BOTTLENECK IDENTIFIED · NO STAGE**
Date: 2026-10-01

## Result

The current Claude Design Floating / Hex Island source is now rehomed under the existing WorldBuilder owner without visual or semantic redesign.

Preserved exact source:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/KFB World Core R2C · Hex-Archipel Katalog.dc.html`

Instrumented entry:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/KFB World Core R2C · WC1 Baseline.dc.html`

Additive probe:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/performance-probe.js`

The original rehome remains byte-identical and is not edited by the probe.

## Source / owner status

- WB2 remains WorldBuilder terrain / scene-authoring host.
- Track Core 0.12 remains sole track frame / slot / check owner.
- R2C remains island + route-layout input, not a second Track Core.
- Race / Ground movement owners remain unchanged.
- Billboard and SKY3 remain queued donors, not yet integrated.

## Actual evidence

### Intake
**13 / 13 PASS** source + owner routing checks.

### Rehome
**10 / 10 BYTE-IDENTICAL PASS**:
R2C HTML, support, island module, shadow, sky core and five Clay dependencies are exact copies of the current Claude inbox source.

### Instrumentation
The instrumented HTML differs from the exact source only by one additive module tag for `performance-probe.js`.

Probe records:
fps, mean/p95/p99/max frame time, calls, triangles, geometries, textures, programs, batches, world items/cells, clouds, billboards, track length/crossings, build/load time and WebGL facts.

### Browser
The GitHub browser environment reached the live R2C scene and the performance probe.

Hosted-runner absolute performance is **not accepted**:
- Run `36861649207`: harness bug before browser execution.
- Run `36861843836`: parity + boot PASS; stopped at `too few measured frames` under SwiftShader.
- evidence artifact `11161609956`.

Per stop rule, no third repair/tuning pass is allowed on this CI performance gate.

Full recovery:
`FAILURE_RECOVERY_WC1_BASELINE.md`.

## Why this is not a product-performance verdict

The second run proves the scene boots and the probe works, but the hosted GitHub runner uses software WebGL and delivered too few frames for the fixed sample assumption.

Therefore it is neither evidence that R2C is performant nor evidence that it is too slow on Georg's GPU.

The previously observed ~56 fps / 71 calls / ~354k triangles remains contextual user-device evidence, not this gate's measured result.


## Representative GPU result · Georg / Apple M1 Max

WC1-GPU-BASELINE is now **MEASURED** on visible Chrome / Apple M1 Max.

Two 10 s samples:
- instanced signature: **28.7 fps · 34.8 ms mean · 179 calls · 414,758 triangles · 89 geometries**;
- individual-mesh signature: **29.0 fps · 34.53 ms mean · 868 calls · 403,264 triangles · 459 geometries**.

Both runs share:
414 world items · 158 cells · 54 clouds · 5 billboards · 2,516 m route · 0 crossings · pixel ratio 1.5.

Source interpretation:
R2C mode B uses InstancedMesh; mode A uses individual Mesh objects. The current probe did not serialize mode, so the mapping is inferred from the runtime signature with high confidence.

Key result:
**~5× more calls/geometries did not materially change frame time.** Hex instancing is therefore not the main limiting factor in this current scene on the measured hardware. The current baseline is already ~34.5–34.8 ms/frame, so the next step is to decompose existing shader/fill/shadow/cloud cost before adding Track Core.

Evidence:
`evidence/WC1_GPU_BASELINE_2026-10-01.json`.

## Cost split result · dominant bottleneck found

The same visible M1 Max / Chrome candidate was measured automatically in mode B:

- **Default:** 30.3 fps · 32.96 ms.
- **Clay off:** 90.2 fps · 11.09 ms · **66.4% less frame time** with the same 179 calls / 414,758 triangles.
- **Clouds off:** 34.5 fps · 28.99 ms · 12.0% less frame time.
- **Shadows off:** 29.5 fps · 33.91 ms; despite 94 calls / 212,712 triangles there is no useful frame-time gain.
- **Pixel ratio 1.0:** 39.1 fps · 25.54 ms · 22.5% less frame time.

This closes the earlier uncertainty:

**The present performance problem is dominated by the Clay material/fragment path and pixel footprint, not Hex instancing, draw-call count or shadow geometry.**

Do not remove the KFB Clay look. The current shared Clay SSOT on PR #301 locks K1/H0 v8 as visual Golden and K2/v10 as the new-stage implementation baseline only when it reproduces that Golden. Performance work must therefore optimize/fade/bake the current path while proving locked visual parity.

Clouds remain a secondary budget item and will be revisited after the Clay path is under control.

Evidence:
`evidence/WC1_COST_SPLIT_2026-10-01.json`.

## Reusable measurement lesson

The successful Georg-facing path is now the KFB default for similar local WebGL performance gates:

- exact candidate first;
- single self-contained **double-click HTML**;
- visible Chrome on representative hardware;
- one-click automatic A/B/cost-split;
- one-click JSON export;
- CI only for source parity / syntax / boot;
- no Terminal, unsigned macOS app, Gatekeeper bypass or Cloudflare unless genuinely required.

This rule is persisted in:
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md §4B`;
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md §4A`;
- the central Chat router hard rules.

The old terminal helper may remain as developer fallback but is **not** the default Georg-facing workflow.

## Blender P0A intake · PR #309

Blender P0A is delivered on Draft PR **#309** / branch `blender-mcp/clay-perf-p0a-2026-10-01` / head `93af8caef6a85caa1f7fd70a59abb46edf85f0a4`.

Accepted as:
**successful source-proven offline bake mechanism proof / K2_STAGE_BAKED_LITE reference**.

Delivered:
- one softened building_A derivative;
- one geometry + four deterministic baked detail variants;
- UV0 preserved, dedicated KFB_CLAY_UV / TEXCOORD_1;
- normal + roughness maps;
- matched source / K1 / v10 / baked evidence;
- Blender source and reproducible scripts;
- 9/9 source-pin PASS;
- 1024² baked result is suitable for mid/far only; near detail is 29–59% of v10 depending on view.

Confirmed scale:
`3.2 / 1.65 = 1.939394...` → **×1.9394** for the locked K1 building height.

### Parameter mismatch that must not be hidden

P0A used:
- ToolOn 1;
- LegacyStroke 0;
- Mottle 0.04;
- Macro 0.5;
- LodK 0.6;
- Stroke 0.7;
- Hand 0.5;
- Tile 1.6;
- PrintTile 4.5.

The currently measured WC1 **parity** path uses:
- ToolOn **0**;
- LegacyStroke **1**;
- Mottle **0.05**;
- Macro **0.5**;
- LodK **1.0**;
- Stroke **0.55**;
- Hand **0.5**;
- Tile **1.6**;
- PrintTile **4.5**;
- PrintOn **1**, additionally gated by `lodNear > 0`;
- HexK 3 / HexRot 1 / HexFlow 0 / FacetSoft 0;
- house profile with `legacy: 1`, no active TOOLMIX.

Therefore PR #309 is **not yet a WC1_PARITY_BAKED_LITE replacement**. It remains valid mechanism evidence and a K2-stage baked reference.

PR #309 received a GitHub review comment with the exact correction. No rebake is requested yet.

Current order:
1. finish `WC1-CLAY-PERF-01` on the parity procedural path;
2. pin the optimized procedural shader/settings;
3. compare SOURCE → K2_PROC_OPT → PR #309 K2_STAGE_BAKED_LITE as mechanism/reference;
4. only if baked remains useful, generate the final baked derivative from the exact aligned shader/settings.

## Clay shader component test ready

Plain-language purpose:
**measure which parts of the Clay shader are actually expensive before changing the look.**

The diagnostic derivative keeps the exact island world and adds only feature switches to a copy of the v10 material. The original baseline source remains untouched.

Automatic local passes:
- current Clay;
- base relief off;
- dents / gouges / cracks off;
- fingerprints off;
- facets / creases off;
- mottle / colour noise off;
- base relief only;
- Clay fully off;
- Clay on/off at renderer pixel ratio 1.0;
- Clay on/off at renderer pixel ratio 0.5.

This directly addresses the Blender return's open question about how much Clay cost scales with pixel count.

Georg-facing artifact:
`KFB_Clay_Bausteine_Test_Doppelklick.html`
SHA-256 `384ddabe1977b4b959f4e6c78508eb7a3142e2c75226e2e7d8f94aaf82d2c754`.

Use: open in Chrome → click **Clay-Bausteine messen** → Download JSON → return JSON to Web chat.

No Terminal / server / app / Cloudflare.

GitHub diagnostic sources:
`clay-perf/clay-material.v10-partsdiag.js`
`clay-perf/hex-archipel.r2c-partsdiag.js`
`clay-perf/README.md`

## Clay component measurement · representative M1 Max

The one-click Clay component test returned valid local Chrome evidence.

Same-sequence baseline:
- current Clay: **24.0 fps · 41.67 ms**;
- Clay fully off: **92.9 fps · 10.76 ms**.

Largest isolated measured savings:
- base relief off: **9.96 ms / 23.9%**;
- facets + creases off: **8.78 ms / 21.1%**;
- dents + gouges + cracks off: **6.19 ms / 14.9%**;
- fingerprints off: **5.88 ms / 14.1%**;
- mottle / colour noise off: **3.92 ms / 9.4%**.

Base-relief-only scene:
**51.3 fps · 19.51 ms**.

Component savings are not additive; GPU branches and scheduling interact. The ranking is used to decide where to optimize first, not to sum a theoretical total.

Pixel-ratio comparison:
- ratio 1.5: Clay on 41.67 ms / off 10.76 ms → Clay cost ~30.91 ms;
- ratio 1.0: Clay on 30.01 ms / off 10.76 ms → Clay cost ~19.25 ms;
- ratio 0.5: Clay on 22.12 ms / off 11.06 ms → Clay cost ~11.06 ms.

Interpretation:
- Clay is strongly pixel-dependent;
- but it does not scale like pure fill-rate;
- expensive per-fragment structure remains significant even at low pixel ratio;
- the first optimization should therefore skip/fade invisible relief/facet/mark work by distance/pixel footprint while preserving the near look.

Absolute fps varied from earlier runs, so same-sequence relative deltas are the primary evidence.

Evidence:
`evidence/WC1_CLAY_PARTS_2026-10-01.json`.

## Existing non-Clay / hybrid look options are now back in scope

KFB WorldDesign Lab v1 was already built as a look-comparison donor and the older WorldBuilder brief explicitly intended its procedural cartoon surface for world ground.

It was **not** part of the current active Clay GPU comparison. That omission is now recorded.

Important existing donor:
**Derek RGB triplanar**:
- one painted RGB tile;
- triplanar world-space projection;
- RGB channels select three colours derived from each source material's colour;
- no per-asset repainting or UV dependency for this layer;
- the tuned Derek preset has no procedural Clay, grain, bump, macro-value modulation or stochastic breakup.

Other existing options:
- RGB TRIPLANAR;
- COMBINED;
- TERRAIN · COMBINED REF;
- NORMALEN-LOOK;
- RAUHEITS-LOOK;
- Paper / Cardboard / Felt / Stone / Plaster / Ground / Wood material families.

These are fallback/hybrid donors, not new runtime owners.

Full routing note:
`clay-perf/WORLDDESIGN_LAB_FALLBACK_HYBRID.md`.

Plain-language order:
1. make the current Clay shader cheaper without changing the near look;
2. remeasure it;
3. measure Derek RGB triplanar as the first cheaper non-Clay comparator;
4. compare the Blender baked-lite path afterwards if still useful.

## Material strategy · global texture first

Current product decision in plain language:

**Do not assume the current procedural Clay shader must be the production solution. Test one small global texture first.**

Strategy document:
`clay-perf/MATERIAL_STRATEGY_2026-10-01.md`

### Order

1. **Global Clay Lite**
   - only `Clay002` and `clay_floor_001` are compared as initial donors;
   - select one;
   - first runtime test uses one 512² global triplanar texture;
   - 1024² is tested only if 512² visibly fails.

2. **Derek RGB**
   - one RGB tile;
   - triplanar world projection;
   - three tones derived from each source material colour;
   - no separate per-asset repainting.

3. **DIY Material Mix**
   - same lightweight shader core;
   - material families: Clay / Plaster / Fabric / Wood;
   - one material texture per object/zone by default;
   - 2-way blends only where visibly useful;
   - 3–4-way blending is deferred until a measured need exists.

### Existing verified donor examples

- Clay: `media/3D_Assets/Textures/Clay002/`
- Clay: `media/3D_Assets/Textures/clay_floor_001/`
- Plaster: `media/3D_Assets/Textures/Plaster001/`
- Fabric: `media/3D_Assets/Textures/Fabric048/`
- Wood: `media/3D_Assets/Textures/Wood036/`

These are donor candidates, not automatic production approvals.

### Intended hybrid

- near / hero: optimized procedural Clay where visible detail matters;
- mid: compare Global Clay Lite / Derek / Blender baked-lite;
- far: Global Clay Lite or Derek;
- terrain: compare Global Clay Lite / Derek / WorldDesign `TERRAIN · COMBINED REF`.

### Exact next practical action

**Build and measure Global Clay Lite from the existing pool before doing more complex material mixing.**

## Global Clay Lite 512 · implementation ready

The first lightweight one-texture material candidate is now implemented for local comparison.

Human-facing purpose:
**test whether one small shared Clay texture can keep enough of the handmade look at a fraction of the shader complexity.**

### Candidate

One active 512×512 RGBA texture:
- R/G = derived relief direction;
- B = donor roughness;
- A = centred material/value variation.

Runtime:
- triplanar world-space projection on X/Y/Z;
- source asset colour remains authoritative;
- one active material pack at a time;
- no per-object texture copies.

Estimated texture memory:
- 1,048,576 bytes base RGBA8;
- ~1.33 MiB including mipmaps.

### Donors compared

Only:
- `Clay002`;
- `clay_floor_001`.

Both are existing KFB texture-pool donors. No new visual asset was invented.

### Code

- `clay-perf/global-clay-pack.v1.js`;
- `clay-perf/clay-material.v10-partsdiag.js`;
- `clay-perf/hex-archipel.r2c-partsdiag.js`;
- `performance-probe.js`.

The preserved baseline source remains unchanged.

### Local comparison

Artifact:
`KFB_Global_Clay_Lite_Doppelklick.html`

SHA-256:
`30bc4ff8e9a39479169301e9a6b198e00a185af402108badfd3e4c481374e81e`

Static proof:
extracted ES module → `node --check` PASS.

Automatic local sequence:
1. current procedural Clay;
2. Global Clay Lite · Clay002 · 512²;
3. Global Clay Lite · clay_floor_001 · 512²;
4. Clay off.

Manual buttons allow direct visual switching between the same four states.

No product-performance result is claimed until Georg returns the local JSON.

Read:
`clay-perf/GLOBAL_CLAY_LITE_512_TEST.md`.

## Global Clay Lite 512 · representative result

The local M1 Max / Chrome comparison is complete.

Same scene / mode B:
- procedural Clay: **36.1 fps · 27.73 ms**;
- Global Clay Lite · **Clay002 512**: **92.1 fps · 10.85 ms**;
- Global Clay Lite · clay_floor_001 512: **77.0 fps · 12.99 ms**;
- Clay off: **89.6 fps · 11.16 ms**.

Interpretation:
- Global Clay Lite is performance-viable.
- Clay002 512 is effectively at Clay-off mean-frame cost within this measurement sequence.
- clay_floor_001 remains fast, but has worse mean/p95 and large p99 spikes in this run.
- **Clay002 512 advances as performance candidate; visual acceptance remains open.**

Evidence:
`evidence/WC1_GLOBAL_CLAY_LITE_512_2026-10-01.json`.

## Clay002 vs Derek · next local comparison ready

The next fair one-texture comparison is ready:

- current procedural Clay;
- Clay002 512;
- WorldDesign Lab Derek RGB reference tile 512;
- Clay off.

Derek comparator deliberately includes only the one-RGB-tile triplanar palette core. Ink, cel, morph and extra grain/bump are not included yet.

Artifact:
`KFB_Clay002_vs_Derek_Doppelklick.html`

SHA-256:
`347663621a2a75d93755813a95916af6e43e63d3a530a357ca52bb7d0748a175`

Static ES-module syntax:
**PASS**.

Read:
`clay-perf/DEREK_RGB_512_TEST.md`.

## 2026-10-02 · Props PROCEED + material correction

The parallel Hivebound-inspired procedural-props lane is now a **HUMAN PROCEED** for geometry/style grammar:
- preserve the soft procedural tree/pebble forms;
- trees are explicitly a positive direction;
- authored Residents/KayKit/FrizzleBob hero assets remain authored;
- current material treatment remains TUNE.

Follow-up review of `KFB_Clay002_Massstab_Doppelklick.html` changes the material order:
1. **clay_floor_001 = best**;
2. current procedural Clay = second, but comparatively buggy;
3. Clay002 at 6 / 9 / 12 m still fails to read as convincing clay texture and mostly produces tonal/shading variation.

Derek RGB remains an open comparator; it was not newly ranked by that scale review.

The previous "Clay002 only needs a larger repeat / instance-phase repair" hypothesis is therefore not the next implementation target. The lightweight pack derives donor diffuse into relief/value channels while preserving source object colour, which can erase Clay002's visible material identity.

Current integrated review harness on Draft PR #313:
`procedural-props-local-proof/KFB_WC1_P0B_MATERIAL_REVIEW.html`

Same frozen runtime/geometry, material-only switches:
- clay_floor_001;
- current procedural Clay;
- Derek RGB;
- Clay002 negative control;
- Neutral / Clay off.

Implementation checkpoint:
`42671b14167ee1872f0f75ce2f2edd57af24e235`.

Returned diagnostic JSON is persisted at:
`evidence/WC1_DEREK_COMPARISON_NONREPRESENTATIVE_2026-10-01T23-32-47.json`.
Its absolute performance numbers are not authoritative because Clay-off itself measured 141.36 ms.

## No further integration yet

Not started:
- R2C → Track Core adapter;
- chunked colliders;
- vehicle / physics;
- Billboard scheduler + cached content;
- SKY3 EnvironmentHost;
- actor / resident runtime;
- 4 → 150 logical-island streaming stress.

They remain intentionally held behind `WC1-CLAY-PERF-01`; the representative GPU baseline and cost split are complete.

## Local GPU baseline packaging

No Cloudflare or public Stage is required for representative hardware measurement.

The successful Georg-facing format is a **single self-contained HTML opened directly in Chrome**. It requires no Terminal/local server. An earlier unsigned macOS helper app was rejected by Gatekeeper and is not the recommended path.

The repository may retain local-server/CLI helpers for developers, but local performance acceptance uses visible Chrome + exported JSON.

## Public / Stage

No Stage was published in this slice.
No merge or Live promotion occurred.

No Stage is required for the current Clay performance work. Public Stage remains reserved for a meaningful integrated milestone or genuine cross-device/public verification.

## Exactly one next gate

**MATERIAL ISOLATION · SAME GEOMETRY · CLAY_FLOOR FIRST**

On the accepted frozen P0B tree/prop geometry, compare:
1. clay_floor_001;
2. current procedural Clay;
3. Derek RGB;
4. Neutral / Clay off.

Clay002 remains only as a negative/control state. Do not alter the accepted prop geometry and do not add anti-repeat/instance-phase complexity unless a visually preferred material still proves that it needs it.

Track Core / Vehicle / Billboard / SKY integration remains held until this world-material choice is resolved.


## Experimental procedural props P0B · stopped integration lane

Draft PR #311 tested Hivebound-style asset-light soft props.

Proven:
- P0 isolation browser PASS;
- P0B soft-form isolation browser PASS;
- integrated candidate reached WC1 boot → Clay002 activation → P0B prop mount.

Not proven:
- completed integrated browser gate;
- representative local performance;
- KFB visual acceptance.

The GitHub/SwiftShader post-mount frame-delta gate was stopped after two repair passes. Frozen candidate: `94443824e6b13f38c611defd06dacedd7c6d0faa`.

Full return/recovery:
- `procedural-props-p0/RETURN.md`
- `procedural-props-p0/FAILURE_RECOVERY.md`
- `procedural-props-p0/SOURCE.json`

This experiment does not change the parent WC1 next material action (Clay002 vs Derek).


## 2026-10-02 · Separate Form/Environment lane · P1 source-derived PASS

The procedural environment **shape/deformation** lane is now explicitly separated from the parallel material lane.

Binding design recovery:
- existing deformation lineage restored under **Use what works**;
- style grading axis = **Polly & Her Pals × Rocko's Modern Life × Fritz Lang / Metropolis**;
- P0B tree remains a human-positive procedural-family donor, not the building deformation authority.

Completed:
- Golden deformation donor extraction;
- source-derived Rocks + Bushes P1 specification;
- reusable geometry-only module `procedural-props-local-proof/environment-family-p1.mjs`;
- internal source-isolation PASS.

P1 verified:
- P0B tree;
- P0B pebble;
- K1 Golden boulder;
- T3 accent rock;
- T3 bush;
- run `36959777774` / job `110690683930`;
- artifact `11207815421`;
- digest `sha256:95bc5a84d5d01e9ba1bf2dc10c56e8913aa04384906e162187616909d913e8c8`;
- 0 console errors / 0 page errors / 0 QA problems.

The first modular QA attempt failed only because direct `file://` cannot serve the neighboring ES module reliably. Repair Pass 1 changed internal QA transport to localhost; geometry was unchanged.

Form/Environment next action:
**ENVIRONMENT FAMILY P2 · EXISTING PROP VOCABULARY EXTRACTION**.

The existing material next gate above remains a separate parallel lane and is not superseded by this form work.


## 2026-10-02 · Form/Environment lane · P2 COMPLETE

Separate from the material/Clay lane.

P2 outcome:
**SOURCE_DERIVED_GEOMETRY_PASS**

Branch / PR:
- `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
- Draft PR #316

Exact authored donor isolation:
- 13/13 PASS;
- source pin `a5fefb273b274e40b3a1e642788c87113fa6ea27`;
- source-object run `36960716414` / job `110693565332`;
- 13 screenshots + state evidence;
- `stump_oldTall` remains explicit negative/outlier.

Procedural transfer:
- geometry-only module `procedural-environment-p2/environment-family-p2.mjs`;
- seven generated roles: log separator, log stack3, stump round, stump detailed, mushroom normal, mushroom group3, grass tuft;
- no material owner, renderer owner, placement owner or frame loop added.

Final PASS after one QA-only repair:
- tested head `5f2a4444feed8f38883499de2a044f0e9e8b36eb`;
- run `37012562325`;
- job `110855562506`;
- source artifact `11228612568`, digest `sha256:3d7d60220fdae97466b503c2237161c5d5f28f7f2fb754572d48482ebfaf0826`;
- procedural artifact `11228413648`, digest `sha256:162562b8da803cf4e9ae5d2a54b91036d59d84f6ee3382e23e2f6424ed108df9`;
- 13/13 source donors PASS;
- 7/7 generated geometries PASS;
- 0 display-material texture maps;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

Repair Pass 1 corrected only a false QA assumption: renderer memory counted the shadow map as one texture. Display materials were texture-free and geometry was unchanged.

Site recovery / P2 source-object checkpoint:
`WORLD-CORRIDOR-01 / e73b2e77-23a2-4dea-a744-4b455dee2e59`.

Full P2 handoff:
- `procedural-environment-p2/RETURN.md`
- `procedural-environment-p2/SOURCE.json`
- `procedural-environment-p2/P2_TEST_REPORT.md`

The form/environment lane has enough procedural nature vocabulary to move on rather than inventing further small props.

### Exactly one next FORM/ENVIRONMENT gate

**PROCEDURAL BUILDING B0 · GOLDEN FAMILY SPEC**

Start with one normal everyday low-rise building family from actual accepted/deformed KFB donors.

Use the existing building lineage:
`Golden/deformed samples → Elastic Grotesque → City Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE v1 → KayKit/K-Kid identity`.

Grade with:
`Polly & Her Pals × Rocko's Modern Life × Fritz Lang / Metropolis`.

No material decision and no generic random-building generator.

The existing material next gate elsewhere in this Return remains a separate parallel lane.


## 2026-10-02 · Procedural Environment crash-safe recovery

The completed FORM/ENVIRONMENT P2 lane now has a canonical recovery entry:

`procedural-environment-p2/RECOVERY.md`

Current lane:
- branch `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
- Draft PR #316
- P2 result: **SOURCE_DERIVED_GEOMETRY_PASS**
- tested procedural head: `5f2a4444feed8f38883499de2a044f0e9e8b36eb`
- final P2 Site checkpoint: `d3a82471-38ad-43ce-bbba-a6f657760678`

Fresh chats recover there first; no transcript reconstruction.

Current next FORM/ENVIRONMENT gate:
**PROCEDURAL BUILDING B0 · GOLDEN FAMILY SPEC**.

The material/Clay next gate elsewhere in this Return remains an independent parallel lane.
