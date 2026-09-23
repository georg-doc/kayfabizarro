# CHANGELOG · KFB ToolBox Fractal Authoring · post-WB1-P2

## 2026-09-23 · Prepared consolidation brief

### USER DIRECTION
- consolidate the core ToolBox workflows into one usable authoring surface;
- retain nested/fractal editing from EyeRig/face/head through actor/body/scene/world;
- enable practical adjustment of FrizzleBob brows relative to the eyes;
- later allow EyeRig on arbitrary hosts such as a car;
- integrate rather than rebuild Resident Atlas, Scene Builder, EyeRig and WorldBuilder;
- perform this after WorldBuilder P0–P2.

### ORGANIZATION DECISION
- WorldBuilder visual lane remains in the World Design / WhackMan-lighting Claude project;
- ToolBox authoring consolidation remains in the fresh KFB ToolBox Claude project;
- shared seams connect them later.

### GITHUB RECOVERY
- verified current main lacks the claimed Stage-First promotion folder and promoted `stage-first/` owner path;
- retained the merged Stage-First intake as current GitHub truth;
- captured Draft PR state for EyeRig Batch, Legacy EyeRig and Motion Lab.

### CONTRACT
Added `kfb.fractal-authoring-contract.v0`.

### FIRST CLAUDE GATE
Prepared TFA-CD1:
FrizzleBob nested Actor → Head → Face → EyeRig → Brows authoring only.

### BROW FIX DIRECTION
- reuse `brow-rig.v2.js`;
- expose current real controls first;
- stress-test width/gap/position;
- only if measured failure remains, add per-eye-centred width/spacing inside the same owner.

### STATUS
Docs/source recovery only. No runtime, browser, Stage or public verification.
