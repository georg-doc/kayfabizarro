# TEST REPORT · ENVIRONMENT FAMILY P2 · SOURCE-DERIVED PROCEDURAL GEOMETRY

Status: **PASS · 13/13 SOURCE DONORS + 7/7 PROCEDURAL TRANSFERS**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
Draft PR: #316

## Scope

P2 extends the approved procedural environment lane with logs, stumps, mushrooms and grass while keeping:
- the material/Clay lane separate;
- P1 tree/rocks/bushes unchanged;
- no WorldBuilder placement owner;
- no building implementation;
- no Stage.

## Exact source-object proof

Exact authored donors were isolated first from source pin:

`a5fefb273b274e40b3a1e642788c87113fa6ea27`

Donors proven:
- logs: `log`, `log_large`, `log_stack`;
- stumps: `stump_old`, `stump_round`, `stump_roundDetailed`;
- negative stump control: `stump_oldTall`;
- mushrooms: `mushroom_red`, `mushroom_redTall`, `mushroom_redGroup`, `mushroom_tanGroup`;
- grass: `Grass_1_A_Color1`, `Grass_2_A_Color1`.

Source-object assertions:
- original materials = true;
- deformation = false;
- material adaptation = false;
- fallback = false;
- measured bounds agree with source catalog evidence;
- explicit `stump_oldTall` outlier classification retained.

## Procedural transfer

Geometry-only module:

`environment-family-p2.mjs`

Generated roles:
1. `SOFT_LOG_SEPARATOR`
2. `SOFT_LOG_STACK3`
3. `SOFT_STUMP_ROUND`
4. `SOFT_STUMP_DETAILED`
5. `SOFT_MUSHROOM_NORMAL`
6. `SOFT_MUSHROOM_GROUP3`
7. `SOFT_GRASS_TUFT`

Transfer basis:
- log anatomy and stack composition from exact Kenney source objects;
- stump round/detailed/old anatomy from exact source objects, with `stump_oldTall` excluded;
- mushroom normal/tall/group roles from exact source objects;
- KayKit Grass_1 broad blade + Grass_2 narrow spear roles;
- already-proven P0B soft bent-blade construction;
- existing Travel cluster lessons (leader + smaller companions).

## Initial procedural QA failure

Run:
`37012182727`

Result:
source-object isolation PASS, procedural geometry step FAIL.

Only problem:
`expected 0 textures, got 1`.

Diagnosis:
the renderer memory counter includes the **shadow map texture**. The neutral display materials themselves contained no texture maps.

Classification:
**QA METRIC ERROR ONLY**.

No geometry, source donor, material choice or runtime owner defect was shown.

## Repair Pass 1

Repair changed only evidence semantics:
- viewer now counts texture slots on the neutral display materials directly;
- QA asserts `displayTextureMaps === 0`;
- renderer memory texture count remains visible and is explicitly allowed to include shadow maps.

No generated geometry changed.

Tested head:
`5f2a4444feed8f38883499de2a044f0e9e8b36eb`

Run:
`37012562325`

Job:
`110855562506`

Conclusion:
**SUCCESS**

## Evidence artifacts

### Exact source donors
- artifact: `11228612568`
- files: 14 = 13 donor screenshots + state JSON
- size: 1,395,274 bytes
- digest: `sha256:3d7d60220fdae97466b503c2237161c5d5f28f7f2fb754572d48482ebfaf0826`

### Procedural transfer
- artifact: `11228413648`
- files: 2 = comparison screenshot + state JSON
- size: 111,588 bytes
- digest: `sha256:162562b8da803cf4e9ae5d2a54b91036d59d84f6ee3382e23e2f6424ed108df9`

## Procedural proof facts

- objects: **7/7**;
- WebGL2;
- render calls in internal isolation viewer: 15;
- rendered triangles in internal isolation viewer: 6,386;
- display material texture maps: **0**;
- renderer memory textures: 1 (shadow map, expected infrastructure);
- page errors: **0**;
- console errors: **0**;
- QA problems: **0**;
- material decision: false;
- world integrated: false;
- building implemented: false.

Hosted SwiftShader warmup FPS is not representative product-performance evidence.

## Classification

**P2_SOURCE_DERIVED_GEOMETRY_PASS**

The environment vocabulary now has source-grounded procedural roles for:
- trees;
- pebbles / boulders / accent rocks;
- bushes;
- logs;
- stumps;
- mushrooms;
- grass.

Authored flowers and further tiny ground detail remain available as existing vocabulary but are not required to establish another procedural family before moving to buildings.

## Exactly one next gate

**PROCEDURAL BUILDING B0 · GOLDEN FAMILY SPEC**

Use the already-completed Golden deformation extraction and the Polly × Rocko × Metropolis axis to define the **first normal building family** from actual accepted/deformed donors.

No material decision in B0.
No freehand “wonky house” invention.
No universal random-building generator.
