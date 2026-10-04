# NotebookLM Prompt · KFB Clay Production Deck

Create a **15-slide KFB 3D Production Deck** from the supplied KFB models, ClayBound visual references, and research sources.

This is **NOT a character-design exercise, illustration exercise, moodboard, or concept-art exercise**.

Do not redesign the KFB characters.

Do not generate alternative character concepts.

Do not spend slides showing stylized portraits, cute illustrations, cinematic renders, or speculative redesigns.

The supplied KFB models are already the design.

Your job is to create the **production system required to convert those existing 3D assets into the target handcrafted ClayBound-style material and rendering language in Blender**.

# PRIMARY OUTPUT GOAL

The deck must deliver production-ready specifications for:

- seamless clay texture packs
- secondary seamless material packs
- Blender shader systems
- Principled BSDF material specifications
- material parameters
- procedural shader layers
- UV / texture-scale rules
- displacement / bump strategy
- roughness strategy
- color variation strategy
- material-zone assignments
- Blender node recipes
- lighting specifications
- render specifications
- animation-safe material rules
- asset-export requirements
- naming conventions
- production QA criteria

Think like a **3D look-development TD preparing an asset package for production**.

Every slide must help someone build, texture, shade, light, animate, or validate the actual KFB 3D assets.

# NON-NEGOTIABLE RULE

The KFB character designs themselves are LOCKED.

Preserve:

- geometry identity
- proportions
- silhouette
- facial construction
- costume
- accessories
- colors unless technically adjusted for material response

The ClayBound references define:

- surface language
- material response
- sculptural softness
- handcrafted irregularity
- lighting character
- texture scale
- render character

They do NOT authorize a new character design.

# IMAGE GENERATION PRIORITY

If image generation is available, prioritize images that can function as **production assets or technical references**.

HIGH PRIORITY:

- seamless square texture swatches
- tileable material sheets
- roughness references
- normal / height references
- material-zone diagrams
- shader-node diagrams
- close-up material calibration samples
- neutral lighting comparison renders
- UV-scale comparison samples
- texture-atlas examples

LOW PRIORITY / AVOID:

- character illustrations
- alternate character concepts
- decorative moodboards
- cinematic scenes
- poster art
- storytelling images
- unrelated environment art
- generic clay mascots

Do not use image-generation capacity to reinvent the characters.

# TEXTURE PACK REQUIREMENTS

Develop a compact production texture library.

Start with approximately:

1. Smooth Matte Clay
2. Fine Handworked Clay
3. Softly Compressed Clay
4. Slightly Porous Clay
5. Fine Felt / Textile if required
6. Soft Matte Rubber if required
7. Paper / Cardboard if required
8. Additional secondary material only when justified by the actual KFB asset

Each seamless material should have a production specification containing:

- material name
- intended mesh/material zone
- physical interpretation
- recommended texture resolution
- recommended real-world scale
- seamless X/Y requirement
- Base Color specification
- Roughness specification
- Normal specification
- Height / Bump specification
- optional AO
- optional displacement
- color-space requirement per map
- intensity ranges
- recommended Blender parameters
- repetition-control strategy
- animation-safe constraints
- what must NOT appear

Where possible, provide a ready-to-use generation prompt for each required texture/map.

# SEAMLESS TEXTURE STANDARD

All production textures must:

- tile perfectly horizontally and vertically
- have no visible borders
- have no dominant central feature
- have no directional lighting baked into them
- contain no object silhouette
- avoid obvious repeated motifs
- avoid large-scale features that reveal tiling
- remain subtle enough for close-up animation
- support controlled scaling in Blender

Avoid the cliché that clay must contain large fingerprints.

Do not create decorative fingerprint patterns.

Do not simulate handmade material with excessive dirt, scratches, dents, or noise.

Handmade should emerge from controlled multi-scale variation.

# MAP STRATEGY

For each core clay material, define an ideal pack such as:

- BaseColor
- Roughness
- Normal
- Height

Optional where justified:

- AO
- micro-normal
- mask
- displacement

Clearly state whether a given effect should come from:

A. image texture  
B. Blender procedural nodes  
C. geometry / sculpt  
D. lighting  
E. animation

Do not put every visual property into one baked texture.

# BLENDER TARGET

Assume a current Blender production workflow using:

- Principled BSDF
- physically meaningful roughness
- reusable node groups
- non-destructive material controls
- animation-friendly shaders
- Eevee and/or Cycles compatibility where practical

For every important material provide approximate parameter ranges rather than vague adjectives.

Examples:

- Roughness: numeric range
- Normal strength: numeric range
- Bump distance / strength
- texture scale
- macro variation amount
- micro variation amount
- subsurface amount if justified
- coat / sheen only if justified

If exact numbers depend on render scale, provide a sensible starting range and explain the dependency.

# SHADER ARCHITECTURE

Design a reusable Blender clay shader or node group.

At minimum consider these independent controls:

- Base Color
- Clay Hue Variation
- Macro Surface Variation
- Micro Surface Variation
- Roughness Variation
- Fine Bump
- Broad Form Breakup
- Edge / curvature response only if technically justified
- optional subsurface scattering
- texture scale
- random seed
- intensity master controls

The node system should avoid visible procedural repetition.

Prefer layered frequencies and low-amplitude variation over obvious Noise Texture effects.

Describe the node graph clearly enough that a Blender user or Blender MCP agent can reproduce it.

# MATERIAL ZONES

Define how the shader system should be applied to the existing KFB assets.

Distinguish:

- clay body
- face
- eyes
- mouth
- clothing
- hair/fur if present
- accessories
- props
- rubber-like elements
- textile elements
- paper/card elements
- exceptional materials

Do not force all zones into the same clay shader if doing so destroys visual identity.

# LIGHTING AND RENDERING

Define the target rendering conditions needed to reproduce the reference look.

Specify:

- key-light character
- fill
- rim if needed
- environment contribution
- shadow softness
- contact shadows
- contrast
- ambient occlusion strategy
- color management
- exposure
- background behavior
- depth of field only if relevant
- camera focal-length range
- render-engine implications

Separate material appearance from lighting effects.

Do not bake lighting characteristics into texture assets.

# ANIMATION SAFETY

All texture and shader recommendations must work on animated KFB characters.

Prevent:

- texture swimming
- temporal shimmer
- high-frequency flicker
- unstable procedural patterns
- displacement that breaks silhouettes unpredictably
- visible UV seams
- material changes between frames

Specify which procedural effects should remain object-space, UV-space, or geometry-based.

# REQUIRED 15-SLIDE STRUCTURE

## Slide 01 — Production Target
Very concise visual definition of the target material/render system.
No redesign.

## Slide 02 — Reference Decomposition
Extract observable surface, shape, material, lighting and render properties from the ClayBound references.

## Slide 03 — Existing KFB Asset Constraints
Identify which current character properties are locked and which material/render properties can change.

## Slide 04 — Master Clay Material Architecture
Overview of the reusable Blender clay shader system.

## Slide 05 — Blender Shader Node Specification
Detailed node-group logic, inputs, ranges and layer order.

## Slide 06 — Core Seamless Clay Texture Pack
Production specification for the main clay textures.

## Slide 07 — Texture Maps
BaseColor / Roughness / Normal / Height strategy and generation requirements.

## Slide 08 — Secondary Material Pack
Textile, rubber, paper/cardboard, etc., only where required.

## Slide 09 — Scale & Tiling Calibration
Real-world scale, UV scale, anti-repetition strategy and close-up limits.

## Slide 10 — Material Zone Assignment
Map the material families onto the existing KFB model.

## Slide 11 — Surface Variation System
Explain geometry vs texture vs shader contributions at macro, meso and micro scale.

## Slide 12 — Lighting & Render Recipe
Production lighting, camera and color-management setup.

## Slide 13 — Animation-Safe Material Rules
Motion-safe shading, bump, displacement and procedural rules.

## Slide 14 — Production Asset Package
Exact deliverables, filenames, maps, Blender node groups, presets and folder structure.

## Slide 15 — QA / Acceptance Sheet
Objective checks for whether a KFB asset successfully matches the target production look.

# PRODUCTION PACKAGE

The final slide deck should define a deliverable package approximately like:

```
/KFB_CLAY_MATERIAL_SYSTEM/
    /textures/
        clay_smooth/
        clay_fine/
        clay_compressed/
        secondary_materials/
    /blender/
        KFB_Clay_Master.blend
        KFB_Clay_Master_NodeGroup
        material_presets/
    /specs/
        MATERIAL_SPEC.md
        TEXTURE_SPEC.md
        LIGHTING_SPEC.md
        QA_CHECKLIST.md
```

Use this as a conceptual production structure even if the actual files cannot be generated directly.

# FINAL QUALITY TEST

A slide is useful only if it answers:

“What does the production artist or Blender agent do with this information?”

If the answer is only:

“Look at this nice clay-styled character image,”

replace that slide with technical production information.

The final output should resemble a **look-development / material-production bible**, not a concept-art presentation.
