# Low-poly trees → KFB / Claude Design · source donor R1

Exact original: https://patch.gg/patch/lowpoly-trees
API /repo verified actual clone_url https://git.patch.gg/patch/lowpoly-trees.git, open/MIT code + MIT art. API/tree and central mirror HEAD both5164e23c0721669d061a0b856f4f0ab2c3243ab5 (1.0.5). One central mirror ~/.codex/mirrors/patch--lowpoly-trees.git created with --mirror --filter=blob:none; server ignored filtering, recorded once. No fallback worktree/clone/global install.

## Source closure and rights

Keep root LICENSE, CREDITS.txt, README.md and vendor/lowpoly-tree-generator/{LICENSE,CREDITS.md,THIRD_PARTY_NOTICES.md,README.md,package.json}. Upstream lowpoly generator by Pajama Studio / Rand Monster contributors, unedited upstream commit4377dd6, MIT. Patch demo/walking/effects are MIT. No binary art or audio in this code-only packet.

Minimal static source closure: vendor/lowpoly-tree-generator/src/{index.js,profile.js,archetypes.js,vines.js}. Optional rig closure adds animation.js and rig.js; optional state machine adds controller.js. Package retains all7 original modules. External dependencies: three0.185.1 (source README also tested0.186.1), three-bvh-csg0.0.18, transitive three-mesh-bvh0.9.7; dedupe THREE. Preserve source Vite alias mapping from package name and subpaths to these vendor files.

Patch src/ examples are retained separately under original/src for provenance/reference, not mounted by a KFB adapter. src/demo.js creates a renderer/world/loop: DO NOT mount it. src/walker.js imports SEA,heightAt,shared from its own world.js: replace these through the receiving KFB motion/Surface Truth owner before adoption; do not introduce its demo island as a world owner.

## Usable generator seam

import {createLowpolyTreeRecipe,buildLowpolyTreeGeometry,buildLowpolyTreePreviewGeometry} from source index;
import {createLowpolyTreeArchetypeParams} from source archetypes;
params=createLowpolyTreeArchetypeParams('groveBloom',{canopySeed:104});
recipe=createLowpolyTreeRecipe(params);
{geometry,stats}=buildLowpolyTreeGeometry(recipe,{triangleBudget:2600});
Mesh material uses vertexColors=true; original faceted identity first. Host owns mesh, materials, shadows, disposal and optional export. Pure geometry generator owns no renderer/frame loop. For rig root mesh name is csg-union-wood-and-lowpoly-canopy; createLowpolyTreeRig before placing root. Optional animation API createLowpolyTreePresetClips/createLowpolyTreeRig/updateLowpolyTreeWalkRig/updateLowpolyTreePresetRig. Six real archetypes: ancientGuardian,windCrownedSentinel,weepingLantern,forkedShrine,stormClaw,groveBloom.

Source README reports80–600ms welded builds, more for aggressive triangleBudget; do not run welding per frame. Use tree-worker.js pattern for authoring or pregenerate a bounded reusable pool. Preview builder skips welding. Runtime caching/scatter cost must be measured in receiving product; donor numbers are not KFB performance results.

## Existing Fernwald stays the forest owner

KFB already has real canonical Fernwald integrated on game/integration-r2, checked head2e5c62abb32106f084ea2d9c8f66b914be24cfc3:
- src/world/fernwald.js blob6f4bb00829fc52297fac3950dc5ab1299936b2b2
- src/vendor/fernwald/fernwald-core.r3.js bloba55245c8b4439eaec364fcecdbd7d16fbac5d51f
- src/world/placeVeg.js blob14c3369c72d41bd85df5d541612edcf3a2a4d514
Fernwald is WS0 V1684, source says R2 accepted12Nov/R3 performance. It does not distribute: placeVeg owns positions and biome. createFernwald({palettes,apply}) returns object3d/add/setOn/lod/grow/tick/drop/onPal/status/ton. add({x,y,z,s,ry,bi,gx,gz}) -> handle. Batched crowns/trunks, shared palette logic; Kit look-at trees only near25–35m max3/group. Far crowns coarse/no trunks with85/95m hysteresis. Flagfernwald=r1; existing Racer Site has not adopted this module yet.

Next integration seam: isolate actual Lowpoly archetypes and existing Fernwald families first; keep Fernwald dense/distant placement/LOD owner and admit chosen Lowpoly hero/near trees through existing placement/identity rules only if desired. Do not replace accepted Fernwald silhouettes with this other donor by accident. Existing authoritative terrain heights and road/junction/building exclusion apply. No new scatter/runtime/renderer owner. Claude Design can generate source-faithful isolated assets or bounded tree variants and preserve recipe, seed, source SHA/notices.

## Checks actually performed

Positive original API identity/LICENSE/CREDITS reads; exact mirrorHEAD;23 original text files231057bytes SHA/blob recorded in SOURCE_LOCK; all7 vendorJS syntaxPASS; relative import closure zero missing. No generator build, browser render, KFBintegration, rig-motion, export or performance acceptance claimed. No game/source-owner changes, GitHub write or publication in this intake.
