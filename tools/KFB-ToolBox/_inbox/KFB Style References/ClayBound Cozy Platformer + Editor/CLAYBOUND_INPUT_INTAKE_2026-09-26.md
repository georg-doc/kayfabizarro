# KFB ClayBound · Input Intake + Production Backlog · 2026-09-26

Status: **ASSET PRODUCTION REVIEW · ASSET 01 ACCEPTED · ASSET 03 TWO-PASS RECOVERY · NO RUNTIME CHANGE**

Owner: **KFB ToolBox / ClayBound material exploration**  
Human: Georg

## Outcome

Persist the current ClayBound / DIY stop-motion material work as one bounded KFB production lane.

This intake deliberately does **not** render, inspect, convert or optimize the four large NotebookLM PDFs. They are registered as source evidence only to avoid a long PDF-processing job and timeout risk.

## Current source folder

`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/`

## New NotebookLM PDF inputs

| File | Size | Git blob SHA | Current status |
|---|---:|---|---|
| `ClayBound_Production_Pipeline.pdf` | 16,372,314 B | `6356601cdeb8796f22a900a8cc828fcc143d8c77` | SOURCE ONLY · not inspected · not web-optimized |
| `Digital_Clay_Grammar.pdf` | 19,922,751 B | `65a32723acd8909e4325a5ff0859530caafbbd32` | SOURCE ONLY · not inspected · not web-optimized |
| `Diorama_Texture_Atlas.pdf` | 16,452,815 B | `221fa0f3df0c5af53854e6836f7ec47209d0153b` | SOURCE ONLY · not inspected · not web-optimized |
| `KFB_ClayBound_Production_Spec.pdf` | 15,815,448 B | `6700ddf126f30860ebb329f2b762bb7478ff5ff5` | SOURCE ONLY · not inspected · not web-optimized |

Combined size: **68,563,328 B (~65.4 MiB)**.

## Other current inputs

- ClayBound screenshot reference set in this folder;
- `ClayBound_Research_NotebooLM_01.md`;
- KFB review: `NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/RESEARCH_ROUND_01_REVIEW.md`;
- NotebookLM prompts / source text under `NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/`;
- `KFB_CLAY_ASSET_STUDIO_PLUGIN_v0.1.0_2026-09-26.md`;
- private plugin **KFB Clay Asset Studio v0.1.0**;
- plugin queue source under `KFB Clay Asset Studio v1 plugin/`;
- KlayBound / ClayBound POC and technical research already present in this folder.

## Production backlog · priority order

### P0 · CLAY-ASSET-01 · start now

Use **KFB Clay Asset Studio** to generate:

**Asset 1 · Smooth matte clay seamless texture**

Acceptance:
- one source texture only;
- actual dimensions/format recorded;
- 3×3 repeat preview;
- edge/tile QA status;
- Georg review before Asset 2.

No batch generation.

### P1 · CLAY-ASSET-CORE · sequential core clay library

Continue plugin queue items **2–10**, strictly one asset / one human gate at a time.

Do not expand into craft materials until the core clay language is visually stable.

### P1 · CLAY-BLENDER-POC-01

After one or more human-approved core clay textures exist:

- apply one approved texture to one existing KFB model in Blender;
- preserve source geometry/rig/material-zone ownership;
- build/test the smallest reusable clay material/node group;
- separate Cycles look-dev, Eevee approximation and runtime/export-safe rules;
- compare against the isolated ClayBound donor references.

No character redesign.

### P1 · CLAY-ASSET-MANIFEST-01

After the first approved assets, create a durable per-asset record:

- queue number / canonical name;
- revision;
- approval state;
- dimensions / format;
- alpha status;
- tile QA;
- intended Blender role;
- source prompt;
- intended UV/triplanar scale;
- approved repository/library destination.

Do **not** create a parallel asset registry; approved assets later route into existing KFB asset/library ownership.

### P2 · CLAY-PDF-WEB-01

Optimize the four NotebookLM PDFs **later and separately** if/when browser delivery is useful.

Requirements:
- preserve originals;
- derive web-friendly copies rather than overwriting source;
- record before/after size;
- visual spot-check after compression;
- no automatic Stage publication.

This is explicitly **not part of the current intake**.

### P2 · CLAY-SEAM-QA-02

After early image-gen calibration, add stronger seam QA:

- pixel-level opposite-edge comparison;
- optional seam repair/post-process;
- retain source + repaired derivative;
- do not equate a visually plausible 3×3 preview with mathematical seamlessness.

### P2 · CLAY-HANDMADE-02

Only after core clay is accepted, continue:

- shader utility maps;
- triplanar-friendly broad variation;
- felt / cloth / paper / cardboard / cork / foam / wood;
- cutout dents / bumps / grooves / tool marks / clay crumbs / DIY diorama artifacts.

The 50-item plugin queue remains the detailed order of execution.

## Current tool split

- **NotebookLM / research:** decompose and specify the look.
- **KFB Clay Asset Studio:** generate and review one raster production asset at a time.
- **Blender / Blender MCP:** test approved assets as actual materials/shaders on existing KFB source models.
- **ToolBox / Asset Librarian:** receiving ownership only after explicit acceptance.

## Protected boundaries

- No new character design owner.
- No second material/asset registry.
- No automatic batch approval.
- No automatic Blender integration from generated images.
- No Stage or Live claim.
- No PDF processing in this intake.
- Large files remain source evidence until a separate optimization/inspection slice is started.

## Exactly one next gate

**GEORG HUMAN REVIEW · Asset 03 r2 look. PASS allows one isolated Blender CLAY-B0/B1 proof; TUNE/REJECT starts a fresh Asset-03 slice from the preserved r3 sculpt direction + PR #173 seam donor.**
