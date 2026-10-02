# Claude Coworker + Blender MCP · Hex / Procedural World Bench

## Access model

You do **not** need KFB Production Control.

Use only this checked-out GitHub handoff branch and the paths in `SOURCE_MANIFEST.json`.
The browser-measured Hex catalog is copied into `data/`.

## Goal

Produce a source-proven recommendation for the first practical KFB island/world kit by comparing:
- authored KayKit Hex/Builder assets;
- already-proven procedural environment families;
- the current lightweight universal Clay material candidate;
- authored building seeds for the next procedural-building family.

Blender is a measurement/authoring bench. It does not own FPS, world runtime, topology, movement, or placement.

## First gate · show sources in isolation

Before integration, show these exact authored Hex donors alone:
1. `hex|hex_grass`
2. `hex|hex_road_B`
3. `hex|hex_coast_B`
4. `hex|hex_road_A_sloped_high`
5. `hex|building_windmill_blue`

Resolve each through the copied browser catalog. Verify source path, dimensions, origin/pivot, support, meshes, triangles, material slots and textures.

Then show the current procedural controls in isolation from the existing modules:
- P1 tree;
- P1 pebble / boulder / accent rock / bush;
- P2 log / stump / mushroom / grass roles.

Do not replace any source with lookalike primitives.

## Authored-vs-procedural question

For each relevant environment role, decide whether the practical production path is:
- authored asset;
- procedural family;
- authored hero + procedural background siblings;
- optional/deferred.

Use factual reasons: silhouette, source identity, mesh/material complexity, repeatability, role coverage, support/topology needs.

Do not produce a numerical quality score.

## Material question

Primary lightweight comparison:
- neutral/source material;
- `clay_floor_001` using the exact repo maps.

Optional comparators only when useful:
- current heavy procedural Clay as near/hero reference;
- Derek RGB;
- Clay002 only as negative/control.

Do not invent a new shader or material owner.

Record:
- material slots before/after;
- texture count;
- whether one shared material can cover a family;
- whether authored palette/source colour can remain authoritative;
- whether topology/edge readability survives.

No Blender result may be described as FPS optimization.

## Buildings

Procedural building B0 has not been implemented.

In this bench:
- select 1–3 strong **authored normal-building family seeds** from the Hex/Builder sources;
- isolate them;
- measure them;
- inspect roof/body/facade structure and material reuse;
- compare their structural suitability against the existing Golden deformation lineage.

Do not invent a random-house generator.

The next building family must consume the existing lineage documented in the Golden extraction:
Elastic Grotesque → City Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE.

## Biome / composition

Do not create a new biome owner.

For the three scenelets, use current source-backed grouping:
- one leader + smaller companions;
- grass in 3–5 blade clusters;
- mushrooms in family patches / stump detail;
- size tiers for rocks;
- Rule-of-Three cluster as one valid recipe.

Store these as semantic recipe hints, not baked scatter.

## Three bounded scenelets

After source isolation and family classification:
1. one-cell scenelet: simple ground + small prop group;
2. two-cell scenelet: directed road/coast/height relation;
3. three-cell scenelet: small landmark/social composition mixing authored structure and approved procedural environment roles.

For every scenelet retain:
- exact source keys;
- valid Hex rotations;
- support relationships;
- resident/prop anchors;
- walk ring;
- required/optional props;
- LOW/TARGET/MAX density.

Do not bake the world into an anonymous mesh.

## Classification

Classify production-relevant families as:
- USE
- PREPARE
- OPTIONAL
- SKIP

One concrete reason each.

`hex|hex_river_L_waterless` starts UNPROVEN/SKIP because the browser run found no deck surface and could not classify it.

## Outputs

Return on the Blender working branch:
- `RETURN.md` — normal-language conclusions first
- `SOURCE.json`
- `asset_inventory.json`
- `asset_classification.json`
- `BLENDER_MEASUREMENTS.json`
- `SCENELET_RECIPE_1CELL.json`
- `SCENELET_RECIPE_2CELL.json`
- `SCENELET_RECIPE_3CELL.json`
- `SOCKETS_SUPPORT.json`
- `MATERIAL_BENCH.json`
- compact contact sheet / evidence images
- editable .blend / reproducible scripts when supported

## Return must answer

1. Which authored Hex modules should remain core?
2. Which roles are better served by the proven procedural families?
3. Which buildings/landmarks are good reusable seeds?
4. Where can `clay_floor_001` act as one shared material without losing source identity?
5. Which geometry/material costs are worth PREPARE/SKIP?
6. What exact hypotheses must Web/browser measure next?

## Protected boundaries

- no S0/S1 edits;
- no hex-grid/topology rewrite;
- no new world/runtime/placement owner;
- no movement/physics changes;
- no generic building generator;
- no new material SSOT;
- no FPS claims from Blender;
- no merge/Live promotion;
- after two failed repair passes on the same gate, freeze and return recovery.
