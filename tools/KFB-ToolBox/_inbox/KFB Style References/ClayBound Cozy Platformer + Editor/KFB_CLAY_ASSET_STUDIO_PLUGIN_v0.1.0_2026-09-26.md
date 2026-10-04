# KFB Clay Asset Studio · Plugin v0.1.0

Status: **EXPERIMENTAL · VERIFIED PLUGIN METADATA · NO ASSET GENERATED YET**  
Date: 2026-09-26  
Owner: **Georg / KFB**  
Receiving production area: **KFB ToolBox · ClayBound / handmade material exploration**  
Runtime ownership: **none**

## Plugin identity

- Display name: **KFB Clay Asset Studio**
- Backend name: `kfb-clay-asset-studio`
- Plugin ID: `plugins_6ab7de04f0c881919ab552b1a8f702b3`
- Version: **0.1.0**
- Current release ID: `pluginrel_6ab7de067680819184bb6c981df7489c`
- Scope: **USER**
- Discoverability: **PRIVATE**
- Plugin URL: https://chatgpt.com/plugins/plugins_6ab7de04f0c881919ab552b1a8f702b3
- Verified description: “Generate and review KFB claymation texture, mask and decal assets one at a time for Blender production.”

The metadata above was read back from the live owned-plugin record before this check-in.

## Current skill

Skill: **`produce-clay-assets`**

Verified source inventory:

- `.codex-plugin/plugin.json`
- `plugin.json`
- `skills/produce-clay-assets/SKILL.md`
- `skills/produce-clay-assets/references/asset-queue.md`

The skill is designed as a review-gated production lane, not as a bulk image generator.

## Core contract

- fixed **50-item priority queue**;
- start at **Asset 1: Smooth matte clay seamless texture**;
- generate **exactly one asset per review turn**;
- show the produced asset and actual QA;
- wait for Georg's explicit acceptance before continuing;
- revision stays on the same asset;
- no auto-approval and no silent skipping;
- explicit jump requests are allowed but the gap must be recorded.

## QA contract

For tile maps the skill requests:

- X/Y periodic continuity;
- no border;
- no central hero object;
- no cast shadow;
- no illumination gradient;
- no strong directional mark;
- 3×3 repeat inspection where possible.

Important status rule:

A visually plausible tile is only a **candidate** until boundary continuity has actually been inspected. The skill must not call a texture certified seamless merely because image generation produced something plausible.

For cutout/decal sheets:

- clean element isolation;
- true transparency where the format supports it;
- no fake checkerboard alpha;
- extraction/usefulness reviewed against a Blender use case.

For grayscale/data maps:

- no embedded color or lighting;
- channel/range behavior should be inspected where practical;
- a generated grayscale-looking image is not automatically a validated height/roughness map.

## Queue summary

### Phase 1 · Core clay surfaces · 1–10
Smooth, fine-grain, porous, compressed, rolled, kneaded, dry/cracked, colored, mixed-color, patched/repaired clay.

### Phase 2 · Shader utility · 11–18
Macro color variation, roughness variation, bump/height, breakup mask, triplanar color breakup, mottling, patch/blob mask, handmade irregularity.

### Phase 3 · Secondary craft materials · 19–29
Felt, woven cloth, burlap, handmade paper, cardboard, corrugated cardboard, foam, cork, rough wood/MDF, tape-like material, uneven painted surface.

### Phase 4 · Cutout/detail/decal sheets · 30–45
Dents, bumps, grooves, thumb presses, tool marks, cuts, scrapes, seams, pressed edges, crumbs, flakes, pellets, lumps, patch repairs, imperfections, diorama debris.

### Phase 5 · Optional pattern / repair sheets · 46–50
Rolled patterns, stamps/imprints, patch/repair patterns, seams/joins, mixed handmade patterns.

## KFB boundaries

This plugin:

- produces candidate texture / mask / decal source assets;
- can QA tileability/transparency to the degree actually inspected;
- can preserve one-at-a-time review state in the conversation or a durable production record.

It does **not**:

- replace KFB ToolBox, Asset Librarian, Blender/MCP, shader owners or game runtimes;
- promote generated assets into production automatically;
- make an image-generated grayscale map physically calibrated by declaration;
- make a generated image mathematically seamless without inspection/post-processing;
- merge, publish Stage or promote Live.

The ClayBound/KlayBound references remain **visual donor evidence**, not a replacement runtime or an already approved texture pack.

## Relationship to current ClayBound work

Current supporting sources:

- ClayBound Style Reference folder
- KFB KlayBound POC 01
- NotebookLM ClayBound research round 01
- KFB technical review of that research
- NotebookLM production-asset / material exploration

The plugin is the **production execution lane for raster assets** emerging from that research.

NotebookLM / research answers “what do we need / how should it behave?”  
KFB Clay Asset Studio answers “generate and review one concrete production source asset now.”

## Assessment · v0.1.0

### Strong decisions already present

1. **One asset per review turn**  
   This directly protects against batch slop and lets visual direction converge early.

2. **Priority queue starts with foundational clay surfaces**  
   The first outputs can immediately calibrate the material language before secondary craft materials or decals consume time.

3. **Candidate vs verified seamless distinction**  
   This is important. Image generation can approximate seamless textures but cannot be trusted merely from appearance.

4. **Explicit transparency and grayscale-map discipline**  
   Avoids common production failures such as checkerboard-in-RGB pseudo-alpha or decorative grayscale being treated as physical height data.

5. **Two-pass stop/recovery rule**  
   Prevents repeated generation loops on one failing visual gate.

### Recommended later improvements — do not block v0.1.0

After the first 1–3 real assets, consider adding a durable per-asset manifest containing:

- asset number / canonical name;
- revision;
- approval state;
- actual pixel dimensions / format;
- alpha status;
- tile QA status;
- intended Blender role;
- source prompt / revision note;
- real-world scale or intended UV/triplanar scale where relevant;
- approved file location.

For truly production-seamless assets, later add a **pixel-level seam-fix + edge-difference check** rather than relying only on visual 3×3 inspection.

Approved outputs should eventually route into the existing KFB asset/library owners rather than becoming a parallel asset registry.

## Current state

- Plugin created: **YES**
- Plugin metadata verified: **YES**
- Skill + 50-item queue inspected: **YES**
- Asset 1 generated: **NO**
- Any asset human-approved: **NO**
- Any texture promoted to KFB production: **NO**
- Stage / Live change: **NO**

## Exactly one next gate

**Generate Asset 1 — Smooth matte clay seamless texture — then review the source image plus the 3×3 repeat evidence before Asset 2.**
