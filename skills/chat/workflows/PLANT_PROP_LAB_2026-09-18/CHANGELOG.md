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
