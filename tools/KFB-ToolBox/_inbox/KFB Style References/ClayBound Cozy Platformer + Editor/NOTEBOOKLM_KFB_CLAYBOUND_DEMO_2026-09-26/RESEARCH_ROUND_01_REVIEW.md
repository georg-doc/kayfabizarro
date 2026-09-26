# KFB × ClayBound · NotebookLM Research Round 01 · Review

Status: **USEFUL RESEARCH INPUT · PARTIALLY VERIFIED · NOT PRODUCTION CANON**  
Date: 2026-09-26  
Owner: **KFB / ToolBox visual exploration**  
Source: [ClayBound_Research_NotebooLM_01.md](../ClayBound_Research_NotebooLM_01.md)  
Source blob at review: `c716442ca2d7c728ccae73a38d86bd95892e077e`

## Summary

Research Round 01 is worth retaining and feeding back into the NotebookLM production-deck experiment.

Its strongest contribution is the move away from a vague "clay filter" toward a layered production model:

- **macro** = geometry / softened massing;
- **meso** = broad sculpt / compression variation;
- **micro** = restrained grain / roughness;
- explicit separation of geometry, texture maps, procedural variation, lighting and animation;
- useful first-pass texture-pack vocabulary;
- strong emphasis on animation-safe UV/tangent-space detail;
- correct KFB direction: no generic fingerprint overlay, no glossy toy-plastic default.

This is a productive research spine.

It is **not yet safe to hand directly to Blender MCP as an exact node recipe** without a correction/calibration pass.

## Keep for the next NotebookLM Production Deck

### 1. Macro / meso / micro decomposition

Keep this structure. It is the clearest part of the report and maps well to the KFB production need.

Recommended production interpretation:

- macro irregularity: geometry / sculpt / non-destructive modifiers where safe;
- meso irregularity: restrained baked height/normal or carefully authored procedural layer;
- micro irregularity: subtle normal + roughness;
- broad hue/roughness variation: low-amplitude mask/procedural modulation.

### 2. Geometry vs texture vs shader responsibility

Keep the principle, but not every listed implementation detail.

The production deck should state explicitly which effect belongs to:

- mesh geometry;
- baked map;
- Blender shader;
- lighting;
- animation.

This prevents the common failure mode of trying to produce the whole ClayBound look with one noisy shader.

### 3. Seamless texture-pack direction

Keep the proposed families as **starting categories**, not locked filenames/values:

- micro grain normal;
- meso sculpt / height;
- roughness variation;
- low-frequency mottle / variation mask.

The important production requirement remains:

- seamless X/Y;
- no baked lighting;
- no dominant central motif;
- no obvious fingerprint stamp;
- low enough amplitude for animation;
- scale calibrated on the actual KFB asset.

### 4. UV / tangent-space animation safety

Keep tangent-space normal maps and stable UV mapping as the default for deforming character detail.

This is directly compatible with the goal of preventing surface detail from visibly sliding during skeletal animation.

## Technical corrections / caution flags

### A. Blender Bevel Shader Node is Cycles-only

The report proposes a Bevel Shader Node as part of the master material.

Blender 4.5 documentation explicitly marks the **Bevel shader node as Cycles Only** and notes that it changes shading rather than geometry.

Therefore:

- do not make it part of the shared Eevee / runtime material contract;
- for portable KFB production prefer actual Bevel geometry/modifier where safe;
- or use the Cycles Bevel node only for look-dev / baking / still-render calibration.

Official reference:
https://docs.blender.org/manual/en/4.5/render/shader_nodes/input/bevel.html

### B. Proposed normal-chain wiring is not a valid Blender Normal Map chain

The report describes feeding a Bevel normal into a Normal Map node and then chaining a second Normal Map node.

In Blender 4.5, the **Normal Map node has Strength + Color inputs and a Normal output; it does not expose a Normal input for stacking an existing normal vector**.

The **Bump node does have a Normal input**, so layered normal/bump construction needs a different implementation.

Production consequence:

- treat the ASCII node graph as conceptual only;
- rebuild the actual node group from valid Blender node sockets before MCP implementation;
- consider a proper normal-combine method, Bump chaining, baked combined normals, or a tested node group.

Official references:
- Normal Map: https://docs.blender.org/manual/en/4.5/render/shader_nodes/vector/normal_map.html
- Bump: https://docs.blender.org/manual/en/4.5/render/shader_nodes/vector/bump.html

### C. Random Walk SSS is not a universal Eevee/Cycles contract

The report treats Random Walk SSS and its numeric settings as if they were broadly portable.

Blender 4.5 documentation marks **Random Walk as Cycles-only**. Eevee has different SSS limitations; Random Walk, subsurface IOR and anisotropy are not supported there.

Therefore separate:

- **Cycles look-dev recipe**;
- **Eevee / real-time approximation**;
- **GLB/runtime export material**.

Official references:
- Principled BSDF: https://docs.blender.org/manual/en/4.5/render/shader_nodes/shader/principled.html
- Eevee node limitations: https://docs.blender.org/manual/en/4.5/render/eevee/limitations/nodes_support.html

### D. Numeric values are calibration seeds, not ClayBound facts

Treat these as **experimental starting points only**:

- roughness 0.65–0.85;
- IOR 1.45;
- SSS weight 0.25;
- SSS scale 0.02 m;
- RGB radius 1 / 0.35 / 0.2;
- 85–105 mm camera;
- fixed light wattages / temperatures;
- fixed bevel widths in meters.

The current source list does not justify presenting these as confirmed ClayBound production values.

They are highly dependent on:

- real asset scale;
- renderer;
- light size / distance;
- exposure;
- mesh thickness;
- shot framing.

The next deck should label them **CALIBRATION START**, not **DOCUMENTED CLAYBOUND VALUE**.

### E. SSS weight claim needs softer wording

Blender's current Principled documentation notes that the subsurface Weight is typically expected to be zero or one, blending diffuse and subsurface components.

So `0.25` can be tested as an artistic blend, but it should not be presented as a physically documented clay target.

### F. Do not apply transforms / modifiers blindly to production rigs

The report's blanket workflow:

- Apply All Transforms;
- add Bevel;
- add Subdivision;
- change modifier order;

must not be executed automatically across KFB GLBs.

Before any such operation:

- inspect current armature, object scale and bind state;
- preserve a source copy;
- prove one isolated model;
- confirm modifier order against actual deformation;
- verify facial / eye / attachment behavior.

The KFB identity/rig contract outranks the clay conversion.

### G. Do not collapse all material slots into one clay material

The proposal to apply one master material across all mesh slots is too broad.

Keep existing functional material distinctions where needed:

- eyes;
- mouth;
- emissive parts;
- transparent parts;
- hair/fur;
- textile;
- rubber;
- props / accessories.

Use a shared **Clay Master node group** inside appropriate materials rather than replacing the asset's entire material grammar.

### H. Stop-motion surface jitter is optional, not baseline

Frame-quantized procedural offsets are an interesting experiment but conflict with the production goal if they introduce visible texture changes or shimmer.

Baseline should be:

- stable material;
- stable textures;
- animation acting provides the stop-motion character.

Only test stepped material/geometry variation later as an optional look layer.

## Source-quality note

The research contains useful sources and useful observations, but the bibliography is mixed:

- direct ClayBound Reddit references;
- Blender/community/tutorial material;
- general PBR information;
- several low-value or unrelated-looking links.

Therefore the report's **OBSERVED / DOCUMENTED / INFERRED / ANALOGOUS** taxonomy is good, but several claims need reclassification before becoming production truth.

For the production deck, prefer:

1. supplied ClayBound screenshots for **OBSERVED**;
2. actual ClayBound developer statements for **DOCUMENTED CLAYBOUND** where available;
3. official Blender documentation for **DOCUMENTED BLENDER**;
4. tutorials/community sources only for **ANALOGOUS TECHNIQUE**.

## Recommended use in NotebookLM

Add this research round back into NotebookLM as a source, together with:

- the original ClayBound screenshots;
- KFB character/model references;
- `NOTEBOOKLM_SOURCE_TEXT.md`;
- this review note if practical.

Then run `PROMPT_A_PRODUCTION_DECK.md`.

The Production Deck should retain the research's useful production taxonomy while correcting the Blender-specific issues above.

## Acceptance status

**Accepted as research input.**

Not accepted as:

- canonical KFB clay shader;
- exact Blender node graph;
- validated texture pack;
- validated KFB rig-conversion workflow;
- Eevee/runtime material contract.

## Exactly one next gate

**Generate the 15-slide production deck using Research Round 01 as input, with explicit separation between Cycles look-dev, Eevee approximation and runtime/export-safe material rules.**
