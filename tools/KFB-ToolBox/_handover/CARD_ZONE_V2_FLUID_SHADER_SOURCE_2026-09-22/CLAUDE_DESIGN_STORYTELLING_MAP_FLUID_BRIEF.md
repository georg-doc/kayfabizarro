# Claude Design Brief — Storytelling Map Fluid from Card Zone Lab v2

Use the existing Storytelling Map scene and runtime owner. Do not create a second map runtime or replacement UI.

## Required donor

Import or copy only this source-locked module:

`tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/card-zone-v2-fluid-source.js`

Its GLSL has been verified 1:1 against the working Card Zone Lab v2 donor blob:
`43eea82f8727d3581e50374d6263e48a28241d3b`.

Do not source the water look from ToolBox Bench v1/v1.1.

## Preserve exactly

1. Original Vertex Shader.
2. Original Fragment Shader.
3. Original KFB textures:
   - `media/3D_Assets/KFB/waterdudv.jpg`
   - `media/3D_Assets/KFB/water.jpg`
4. Texture contract:
   - dudv = NoColorSpace
   - water.jpg = sRGB
   - RepeatWrapping
   - anisotropy 8
5. Material contract:
   - transparent
   - DoubleSide
   - depthWrite false
   - polygonOffsetFactor -2
   - polygonOffsetUnits -4
6. `uTime` receives elapsed seconds.
7. Keep the source line `float u = 0.5;`.
8. Do not add a `uFoam` control or activate the old foam block.

## Original color choices

Use `setFluid(key)` from the donor module:

- `wasser` — [0.16, 0.42, 0.50]
- `oel` — [0.07, 0.06, 0.05]
- `saeure` — [0.46, 0.72, 0.14]
- `bubblegum` — [0.88, 0.42, 0.62]
- `schlacke` — [0.30, 0.27, 0.25]

For Storytelling Map lakes/rivers, default to `wasser` unless the existing map semantics explicitly choose another source color.

## Lake integration

The existing map owns lake geometry.

For every lake geometry:

```js
const fluid = createCardZoneV2FluidMaterial(THREE, { fluid: 'wasser' });
await fluid.loadTextures();
setCardZoneV2ConstantFlow(THREE, lakeGeometry, 0, 0);
const lake = new THREE.Mesh(lakeGeometry, fluid.material);
```

In the existing animation loop:

```js
fluid.update(clock.getElapsedTime());
```

Do not change the shader to make a lake boundary. The lake mesh boundary is the shoreline.

## River integration

The existing map owns the river strip/mesh.

The shader expects a per-vertex `aFlow: vec2` in world XZ.

For a straight river, a normalized constant XZ direction is sufficient.

For a curved river, write the local curve tangent into `aFlow` per vertex. Tapering the vector magnitude toward banks or river ends is allowed because the original Card Zone v2 also uses flow magnitude as a current-strength ramp.

Do not encode river silhouette, width, branching, or bank shape into the GLSL.

## Source-object isolation gate

Before integrating into the full map, render one isolated donor test with:

- one simple lake mesh using `aFlow = [0,0]`
- one simple river strip using nonzero `aFlow`
- original `wasser` color
- both source textures loaded
- no map labels, UI, terrain or decorative effects

The purpose is to prove the actual donor look first.

Only after that visual proof should the same material be attached to Storytelling Map lake/river geometry.

## Out of scope

Do not port Card Zone v2 moat geometry, water-level classification, bank field, D6 terrain, river carving, or narrative graph in this task.

Those are the later H7 Card-Zone environmental semantics.

This task is only the exact fluid visual/material donor for Storytelling Map.
