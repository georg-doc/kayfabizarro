# WorldDesign Lab v1 · fallback / hybrid look donor

Status: **ACTIVE DONOR OPTION · NOT CURRENT RUNTIME OWNER**
Date: 2026-10-01

Human-facing question:
**If the full Clay shader stays too expensive, what cheaper KFB look options already exist before inventing a new style?**

## Short answer

Yes: **KFB WorldDesign Lab v1** already contains a real alternative surface system and should be part of the comparison.

It was built as a look comparison bank, not as a production runtime owner.

Current source:
`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/`

Pinned evidence ref used for this intake:
`9248211a831d20f5d6cc665af90a2b38759a4609`

Important modules:
- `deliverables/wd-look.js`
- `deliverables/wd-macro.js`
- `deliverables/wd-ink.js`
- `deliverables/wd-light.js`
- `deliverables/textures/derek-rgb-ref.png`

Handover:
`docs/WORLDDESIGN_LAB_HANDOVER.md`

## What the Lab already proved as available options

### 1. Derek RGB triplanar

This is the important single-global-texture option.

The Lab implements the Reddit / r/TechnicalArtist "Derek" method as:
- **one painted RGB tile**;
- the same tile projected triplanar in world space on XY / XZ / YZ;
- R / G / B act as selectors for three colours;
- those three colours are derived from the source material colour, so KayKit source colour remains semantically authoritative;
- no per-asset repainting is required;
- no dependency on the asset's UVs for this surface layer.

The Lab's Derek preset intentionally uses a very small shader feature set:
- RGB palette tile ON;
- macro value modulation OFF;
- procedural Clay OFF;
- grain OFF;
- bump OFF;
- roughness-from-macro OFF;
- stochastic breakup OFF in the tuned Derek preset;
- source gloss partly preserved;
- moderate Cel shading can be applied separately.

This makes Derek a serious **cheap stylised-surface candidate**, but its cost has not yet been measured in the current World Corridor scene.

### 2. Generic RGB triplanar

`RGB TRIPLANAR` uses a triplanar macro source with stronger colour influence while preserving the source material pipeline.

### 3. Combined surface

`COMBINED` mixes macro texture + procedural contribution + grain/bump/roughness.

This is more complex than Derek but still structurally much simpler than the current K2/v10 Clay stack.

### 4. Terrain-specific combined reference

The Lab contains:
`TERRAIN · COMBINED REF`

The source comments preserve Georg's earlier assessment that the combined reference-tile treatment was **"super für terrain"**.

This should remain a terrain fallback/hybrid candidate rather than forcing the character/building Clay solution onto every world surface.

### 5. Normal / roughness looks

The Lab also contains dedicated:
- `NORMALEN-LOOK`
- `RAUHEITS-LOOK`

These are useful as stylisation components or debug/reference donors, not necessarily final whole-world looks.

### 6. Material-family alternatives

The same system can drive:
- Paper;
- Cardboard;
- Felt/Fabric;
- Stone;
- Plaster/Concrete;
- Ground;
- Wood.

These matter for selective mixed-media KFB areas and props, not as an excuse to replace the global Clay language blindly.

## Historical WorldBuilder intent

The earlier WorldBuilder v1 brief explicitly named WorldDesign Lab as the **procedural cartoon surface donor** and instructed the consumer to take on planet ground:

- triplanar RGB palette;
- macro texture;
- Cel shading;
- ink.

So these ideas are not a new fallback invented after the current Clay performance problem.

## What was missing in the current World Corridor work

The current World Corridor / Clay performance path concentrated on:
- K1/H0 Golden Clay;
- K2/v10 procedural Clay;
- Blender baked-lite Clay.

It **did not include WorldDesign Lab's Derek / RGB-triplanar / Combined surface in the active GPU comparison**.

That gap is now explicit.

## Candidate hybrid policy to measure — not yet a decision

Do not pick one global winner yet.

Useful measured candidates:

### Near / hero
Optimized procedural Clay:
- preserve fingerprints, dents, selected facets/hand marks where visible.

### Mid
Compare:
- optimized Clay with distance-gated expensive details;
- Blender K2_BAKED_LITE;
- Derek RGB triplanar + minimal Clay/normal detail.

### Far
Compare:
- Derek RGB triplanar + cheap Cel/ink;
- source colour + cheap Cel/ink;
- baked-lite where texture memory / repetition is acceptable.

### Terrain
Measure separately:
- optimized Clay terrain;
- WorldDesign `TERRAIN · COMBINED REF`;
- Derek / RGB triplanar terrain.

A character/building result must not automatically dictate terrain treatment.

## Performance evidence required

WorldDesign alternatives must be measured in the same representative local Chrome harness.

Do not assume Derek is cheap merely because the code is simpler.

Record:
- fps;
- mean / p95 / p99;
- draw calls / triangles;
- pixel ratio;
- visible GPU;
- same scene / same camera / same content.

For the Derek path specifically, compare at least:
1. SOURCE;
2. optimized procedural Clay;
3. DEREK RGB triplanar;
4. COMBINED or terrain combined where relevant.

## Owner rule

WorldDesign Lab remains a donor/presentation lab.

If one of its looks wins:
- re-home only the required shader/material seam into the existing WorldBuilder / shared material owner;
- do not promote the entire Lab into a second renderer, world owner or material registry.

## Current order

1. finish the current Clay shader simplification using the measured component costs;
2. remeasure optimized Clay;
3. add Derek RGB triplanar as the first non-Clay runtime comparator;
4. then compare Blender baked-lite if the baked route is still useful.

This keeps the current work focused while preserving a real fallback/hybrid path.
