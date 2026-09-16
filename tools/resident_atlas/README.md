# KFB Resident Atlas

Status: IMPLEMENTATION SLICE — static syntax checked; live external-asset browser render and Georg acceptance still open.

Pinned asset-source baseline: `252449c921d3f8138d68d1faa3f4052e84040dfe`.

Purpose: reusable, mobile-friendly scene atlas for composing real repository characters, habitats and props. Asset truth remains in the repository / Asset Registry. This tool owns only scene composition and presentation. It does not replace Animation Lab compatibility decisions or consumer-runtime ownership.

## Current implementation

Shared viewer:

- `index.html`
- mobile-first scene selector
- orbit / zoom / reset
- Hero / Front / Top cameras
- Actor / Habitat / Props toggles
- optional grid
- asset inspector with exact repository path and source link
- scene recipes loaded through `scenes/index.json`

Adding another resident scene should therefore primarily mean adding another scene recipe and registering it in the manifest, not cloning the viewer.

## Calibration scene

`Caveman · Cave Camp`

Verified repository assets currently composed in the scene:

- `Caveman.glb`
- `Caveman_Axe.gltf`
- `Caveman_Club.gltf`
- `Caveman_Spear.gltf`
- `Campfire_Base.gltf`
- `Campfire_Logs.gltf`
- `Rock_2_G_Color1.gltf`
- `Rock_1_P_Color1.gltf`
- `Rock_3_E_Color1.gltf`
- `floor_wood_large.gltf`
- `stairs_wood.gltf`

The cave mouth is an authored arrangement of real KayKit Forest Nature rocks. The wood build uses real KayKit Dungeon wood modules. No generated substitute mesh is treated as an asset. The neutral plinth, fog, lighting, grid and warm campfire light are explicitly viewer-only presentation.

## Evidence states

- DECISION: shared viewer + declarative recipes.
- IMPLEMENTATION: viewer, scene manifest and Caveman recipe exist on `resident-atlas/caveman-calibration-2026-09-16`.
- TESTED RESULT: JavaScript module syntax check passed locally. Full live render was not completed in the execution container because that environment could not resolve the external GitHub/CDN hosts.
- PUBLIC DEPLOYMENT: OPEN. A downloadable standalone HTML calibration copy is produced in chat; no canonical public deployment is claimed yet.
- GEORG ACCEPTANCE: OPEN.

## Next pass

1. Georg opens the Caveman calibration viewer on mobile and checks composition / scale / actor orientation.
2. Repair transforms based on the visible result rather than guessing.
3. Once accepted, use the same viewer for Goth Girl and Orc Brute recipes.
4. Only after live QA decide whether to merge or publish a canonical Resident Atlas URL.