# KFB Plant Prop Lab · Changelog

## 2026-09-18 · PPL-00 · Prepared

### USER DIRECTION
- combine Tiny Treats house plants/pots with Quaternius sci-fi botanicals;
- use giant potted plants in landscapes with a Crazy-Cat/KFB scale logic;
- explore transform-based prop rigging;
- prepare deterministic generator mental model similar to Dungeon Generator;
- explore colorful mathematically generated pot patterns;
- develop a broader KFB/TinySkies-compatible color/light concept;
- optionally animate plants as “living props” using the existing KFB EyeRig;
- prepare later Game Development Studio packaging;
- keep this lane from becoming another competing P0.

### SOURCE
Tiny Treats ZIP unpacked successfully:
- ZIP blob `7f4d1581c6f56d4090f9d728f4b684dceccfff4a`;
- 113 GLTF + 113 BIN sidecars;
- 233 extracted files total;
- ZIP preserved.

Quaternius sci-fi environment plant/tree families identified from existing GitHub source.

Existing KFB EyeRig v6 is the required eye donor; no plant-specific eye fork approved.

### DECISION
Plant Prop Lab is P2 donor/lookdev infrastructure. Static composition → pattern system → prop rig → living overlay. Consumers remain owner-specific.

### IMPLEMENTATION
Documentation/briefing only apart from the completed source ZIP extraction.

### TESTED RESULT
ZIP extraction safety/identity workflow PASS. Plant composition/rig/pattern/EyeRig work not yet implemented or tested.


## 2026-09-18 · PPL-01 · Registry / Librarian source promotion

### IMPLEMENTATION
Asset Registry refresh reviewed and merged through PR #69.

### TESTED RESULT
- Registry/Librarian unit-contract suite: PASS;
- canonical registry build + validation: PASS;
- rigfacts build + validation: PASS;
- consumer handoff smoke: PASS;
- Asset Librarian browser smoke v1–v1.7: PASS.

### REGISTRY RESULT
Pack:
`tiny-treats-house-plants-1-0-free-2`

- 117 registry assets;
- 113 model-3d entries;
- sampled GLTF dependencies complete;
- canonical registry totals after generated source revision: 14,343 assets / 6,094 model-3d / 108 packs.

### BOUNDARY
This proves discoverability/provenance only. PlantRecipe, prop rig, pot patterns and LivingProp EyeRig remain authoring candidates.


## 2026-10-12 · PPL-WOBBLEFLORA-CERAMIC-01 · Georg art-direction update · NOT IMPLEMENTED

### GEORG DIRECTION
- Wobbleflora belongs inside existing KFB Plants/Living Plants; **potted** in a boldly decorated, even oversized Crazy-Cat-style pot and **ground-rooted** without pot are two equal valid presentation modes, also combinable with ordinary existing plant assets in authored groups.
- Pot patterns should be **bigger, less busy, more graphic**, taking inspiration from the Mexican-influenced, hand-painted ceramic ornament rhythms already found in Crazy-Cat. Reduce fine repeated texture and let one large visible motif lead the composition.

### SOURCE-BASED DESIGN RESPONSE
- New owner brief: `WOBBLEFLORA_CRAZY_CAT_POT_STYLE_DIRECTION_2026-10-12.md`.
- **Keep** current S19 implemented pattern *register grammar* and existing 12 biome palettes, dark common outline and contrast checks; no return to S18 dense cell grid. Candidate **macro** art-direction test: 3–5 dominant large shapes around one broad register, at most one quiet companion register; keep generous rest areas. These are **LOOKDEV candidates, not changed code thresholds or measured visual acceptance**.
- Existing v2 `plant-recipe.js` constructs pots: a potless plant needs a separate receiving-owner placement adapter and is **NOT IMPLEMENTED**. `plant-rig.js` + `plant-eyes.js` are the intended existing source modules. S19 actual deformation and S20 clip library are still proposed/unbuilt.
- Keep original source assets untouched; no second EyeRig, world position, audio/wind owner, UI, stage or Live.

### EVIDENCE / DISPOSITION
- Current main source docs and v2 plant-pattern/recipe/rig/eyes read; owner concept note written and exact GitHub head/file readback verified. No current visual source-isolation screenshots, new meshes, browser animation, mobile performance, Site/Stage or human art-direction PASS.
- Parent World Lab Research PR #389 is the existing intake carrier; this owner-specific design note doesn't authorize WB2 R4/R5 or replace the weather/VFX/SFX research gate.
- **One optional Plant Lab next gate:** real original S19 pot source at fixed seed/camera, current patterns vs enlarged macro pattern A/B, independently checked in isolation before any Wobbleflora integration.
