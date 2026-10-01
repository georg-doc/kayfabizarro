# KFB Clay Performance · Blender P0A · GitHub-only handoff

Status: **READY FOR BLENDER MCP / COWORKER · GITHUB ONLY · NO SITE DEPENDENCY**
Date: 2026-10-01
Receiving Web owner: KFB WorldBuilder / World Corridor 01
Parallel Web gate: `WC1-CLAY-PERF-01`
Blender gate: `CLAY-PERF-P0A`

## Why this exists

The earlier P0A brief routed return through KFB Production Control/Site. The Blender/Coworker lane must not depend on that.

For this job, **GitHub is the only required handoff and return channel**.

Blender P0A and Web WC1 run in parallel:
- Web profiles and optimizes the active procedural K2/v10 fragment path in the exact island scene.
- Blender produces one offline baked-lite derivative of KayKit `building_A`.
- Neither replaces the Clay SSOT, K2, S5, WorldBuilder or Track Core.
- Runtime performance claims are made only later in Web/Three.js.

## GitHub writeback contract

Repository:
`georg-doc/kayfabizarro`

Start branch from exact base:
`d78009c2de75b85a20060485cb591282aaf3cf54`

Create branch:
`blender-mcp/clay-perf-p0a-2026-10-01`

Return folder:
`tools/KFB-ToolBox/_inbox/KFB_CLAY_PERF_P0A_BLENDER_2026-10-01/`

Open a **Draft PR** into `main`. Do not merge.

Required return files:
- `START_HERE.md`
- `RETURN.md`
- `SOURCE.json`
- `TEST_REPORT.md`
- `building_A__kfb-clay-k2-baked-p0a.glb`
- baked maps
- Blender `.blend` **or** deterministic reproducible script/node/export recipe
- `evidence/` with source isolation, matched candidate, close facade/roof/base, topology/wireframe and re-import evidence

Final handoff must state exact repo / branch / Draft PR / head / changed files / actual QA counts / unresolved items / exactly one next gate.

No Site, Production Control, Cloudflare Stage or Live publication is required for this Blender job.

## Exact source pins

### 1. KayKit building_A donor · source-of-record

Pinned donor ref:
`2ff8b350beefe02912bbff6eeeead3882e583d08`

Files:
- `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/building_A.gltf`
  - blob: `71c203c264e37be2e8529459e99d077c4b22b1e4`
- `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/building_A.bin`
  - blob: `bdada5abd0bf5d5e42d22b9fad38b5cb49e24efd`
- `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/citybits_texture.png`
  - blob: `ffffc8998d30b32bdfa6761f33c87bcdfd0ba07f`

Known source facts from the pinned glTF, to be independently rechecked before modification:
- node: `building_A`;
- mesh: `Cube.938`;
- one material: `citybits_texture`;
- one primitive;
- position bounds min `[-1, 0, -1]`, max `[1, 1.6499998569, 1]`;
- index count 2484 = 828 triangles;
- source UV0 and palette texture remain protected.

A loaded URL is not donor proof. Show the unchanged object in isolation first.

### 2. K2 living state

Ref:
`d78009c2de75b85a20060485cb591282aaf3cf54`

Path:
`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/docs/LIVING_CLAY.md`

Blob:
`9f321f5c6b9beae29bd9838712f9d04ff5e6f7e0`

### 3. K2 implementation modules

Same ref:
`d78009c2de75b85a20060485cb591282aaf3cf54`

- `.../lab-clay/clay-material.v10.js`
  - blob `d994a9b656131be3b7a13d45edcb4253d34f3620`
- `.../lab-clay/clay-relief.v4.js`
- `.../lab-clay/clay-toolmix.v1.js`
  - blob `b9a039ccfb90ea04910db3cf05928817d92e9399`
- `.../lab-clay/clay-profiles.v2.js`

Full root:
`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`

Fingerprint source currently used by the parity path:
`tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png`
blob `8f157141a00c8a2b1e29fe90facc407eae3ada58`.

### 4. Building / façade router

Ref:
`d78009c2de75b85a20060485cb591282aaf3cf54`

Path:
`tools/KFB-ToolBox/docs/CLAY_BUILDING_FACADE_ROUTER.md`

S5 remains branch-local as routed there:
`georg-doc-patch-2@3232a1070686896833d6b7942fcd631b9fa8cda6`

### 5. Current Clay visual SSOT + Golden matrix

Draft PR #301:
`work/clay-style-ssot-2026-10-01@d7760278d2b271c61ce5dd177aa4111068291a57`

Read:
- `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md`
  - blob `435b9ca51ce23b1d8c36c7cc89c65c2b1e03b65a`
- `tools/KFB-ToolBox/docs/KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`
  - blob `5d37512ed6583c1f0f005397fe0721dbbfb8bae5`

Locked precedence:
- K1/H0 v8 = visual Golden;
- K2/v10 = new-stage implementation baseline only when Golden parity is preserved;
- building_A = master building gate;
- fixed façade comparison: 6 m camera distance, 30° from above, K1 light.

## Revised P0A scope

The original brief remains valid for donor preservation, geometry QA, no-light bake, source separation and stop rules.

The following corrections supersede its ambiguous parts.

### A. Blender does not recreate v10 visually from scratch

Do **not** treat a hand-built Blender node approximation of K2/v10 as the parity source.

Preferred:
- derive baked shading data from the exact K2/v10 semantics/code path;
- if the Coworker can execute the actual v10 path in browser/JS and project/export that data into the bake, use that;
- Blender owns geometry preparation, a dedicated bake UV, map packing and GLB export.

If exact v10-derived map generation cannot be achieved reliably, return geometry/UV/export prep plus a documented `SOURCE_REQUIRED` blocker. Do not claim visual parity from an approximate Blender-node rewrite.

### B. Preserve source UV0; use a separate clay bake UV

The KayKit donor uses its source UV0 for `citybits_texture.png`.

Do not destroy or repurpose UV0.

Create a second non-overlapping UV set:
`KFB_CLAY_UV`

Document:
- UV channel index/name in Blender;
- exported TEXCOORD channel;
- runtime requirement for K2_BAKED_LITE.

### C. BAKED_LITE means mid/far clay detail, not every near microdetail

P0A is now specifically a **K2_BAKED_LITE** proof.

Bake medium/far detail suitable for replacing expensive fragment work at distance:
- softened pressure/facet character;
- broad/medium relief;
- roughness response;
- other static mid-frequency detail that can survive UV baking.

Do not require fingerprints / tiny cracks to be permanently baked into every distance level.

Near-view fingerprints, hairline cracks and other microdetail may remain procedural in Web if that preserves the Golden look more efficiently.

Source Base Color remains authoritative.

### D. Repetition / per-object seed is a known gate

Procedural K2 varies pattern placement per object/instance. One baked map copied 100× would visibly repeat.

P0A should therefore:
- keep one geometry derivative;
- produce **2–4 deterministic baked detail variants** when the exact v10-derived bake path supports it;
- record their seeds/recipe;
- keep source base color separate.

If only one valid bake variant can be produced in P0A, that is acceptable for the single-instance proof, but the return must explicitly block any claim about 25/100 repeated-building quality until a variation strategy exists.

Do not solve this by duplicating geometry four times.

## Required visual acceptance

The baked candidate is not accepted merely because Blender renders it nicely.

Required matched evidence:
1. unchanged `building_A`;
2. locked K1/H0 Golden reference;
3. current exact K2/v10 procedural `building_A`;
4. `K2_BAKED_LITE` candidate;
5. same camera / projection / scale / K1 light for the comparison;
6. close facade / roof / base evidence;
7. source vs derivative bounds/origin/anchor comparison.

Do not bake scene lighting, directional AO or a particular sun direction into reusable maps.

## Web convergence after Blender returns

The Web/Three.js lane will compare, on representative local GPU hardware:

`SOURCE → K2_PROC_OPT → K2_BAKED_LITE`

and when valid variation exists:

`1 → 25 → 100` repeated buildings.

The existing KFB local-performance method applies:
- self-contained double-click HTML;
- visible Chrome;
- automatic same-scene measurement;
- JSON export;
- no Terminal/Cloudflare requirement for Georg.

Runtime performance is not a Blender claim.

## Parallel Web work

Blender P0A does **not** block:
`WC1-CLAY-PERF-01`

Web is already measuring/optimizing the procedural v10 path first, because the World Corridor cost split identified Clay fragment/pixel work as the dominant current bottleneck.

Blender should not wait for Web unless the exact v10-derived bake needs a specific updated shader revision. If that occurs, return `WAITING_FOR_WC1_SHADER_PIN` rather than inventing a substitute.

## Exactly one Blender next gate

**CLAY-PERF-P0A**

Produce the single source-proven `building_A` K2_BAKED_LITE derivative family + QA on the GitHub branch above, open the Draft PR, and stop.

Do not start terrain, island batches, mass conversion or runtime integration.
