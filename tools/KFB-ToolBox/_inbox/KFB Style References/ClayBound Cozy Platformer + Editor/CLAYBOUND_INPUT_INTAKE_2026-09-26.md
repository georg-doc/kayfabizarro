# KFB ClayBound · Input Intake + Production Backlog · 2026-09-26

Status: **SOURCE INTAKE VERIFIED · EXTERNAL TOOL/SOURCE REVIEW ADDED · NO RUNTIME CHANGE**

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
- KlayBound / ClayBound POC and technical research already present in this folder;
- external source/tool classification: `CLAY_PRODUCTION_SOURCE_REVIEW_2026-09-26.md`;
- Gemini alternate seam evidence: `CLAY_GEMINI_RX1F_SEAM_QA_2026-09-26.md`.

## External source/tool additions · 2026-09-26

### RandTextureGen / Xargiv

Accepted as a **supporting texture-authoring tool reference**.

Verified source:
- `DD-moe/xargiv`;
- texture sizes 32×32 through 4096×4096;
- intended seamless / unique texture generation;
- generated textures may be processed, published and sold;
- generator terms describe generated images as **CC BY** with commercial use permitted and attribution required.

License caution:
- repository root carries MIT;
- website terms separately describe site features/code/tutorials as CC BY-NC-ND.

Therefore:
- generated texture output may enter KFB with explicit attribution/provenance;
- do not fork/redistribute the full tool code in this slice;
- do not treat output as CC0.

### Dandruff · Clay seamless texture pack

Incoming source:
https://dandruff.itch.io/clay-seamless-textures

Verified page:
- 5 × 1024² clay textures;
- Diffuse / Height / Normal / AO / Smoothness / Metallic / Edge maps;
- no Roughness or Specular map;
- author links Xargiv/RandTextureGen as the creator used.

Georg is uploading the pack under `media/3D_Assets/Textures/`.

Current status:
**EXPECTED SOURCE · LICENSE/ATTRIBUTION BASIS RECORDED · INVENTORY AFTER ARRIVAL**

Do not treat the Metallic map as a KFB clay-material recommendation.

### Clay Knight

Use only as **combat-state / animation-feel reference**.

No source asset license was found on the itch page. KFB already has current KayKit Rig_Medium melee/dodge/run/strafe/hit/death clips, so the useful reference is:
- lock-on;
- attack windows;
- light/heavy/charged timing;
- dodge i-frames/recovery;
- boss telegraphs;
- stamina/punish windows.

No asset or animation extraction.

### Unreal Clay stop-motion project

Use only as **concept donor**:
- subtle texture layer;
- optional wobbly edge/silhouette irregularity;
- configurable clay color/texture.

Do not copy Unreal shader graphs into Blender/WebGL.

### Belimoth Clay (Classic)

Despite the name, this is a patch-based generative-art programming environment, not a clay-material system.

Status:
**DEFERRED GENERATIVE-AUTHORING UX REFERENCE · OUT OF CURRENT CLAY MATERIAL GATE**

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

Current alternate Gemini `rx1f` test:
**NEEDS FIX FOR ASSET 1** because its macro pressed-clay motifs repeat visibly and its X edge is only borderline. Preserve it as a possible later compressed/kneaded clay donor.

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
- approved repository/library destination;
- source/license/attribution where applicable.

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

A first bounded implementation of this QA was used for the Gemini `rx1f` comparison and is recorded in `CLAY_GEMINI_RX1F_SEAM_QA_2026-09-26.md`. It is evidence, not yet a promoted permanent tool.

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
- **RandTextureGen / Xargiv:** supporting external generator/post-process tool for seamless, anti-repeat and size-variant texture experiments; no ownership change.
- **Blender / Blender MCP:** test approved assets as actual materials/shaders on existing KFB source models.
- **ToolBox / Asset Librarian:** receiving ownership only after explicit acceptance.

## Protected boundaries

- No new character design owner.
- No second material/asset registry.
- No automatic batch approval.
- No automatic Blender integration from generated images.
- No Stage or Live claim.
- No PDF processing in this intake.
- No external asset extraction without source/license permission.
- Large files remain source evidence until a separate optimization/inspection slice is started.

## Exactly one next gate

**Generate/review CLAY-ASSET-01: Smooth matte clay seamless texture with source + 3×3 repeat / edge evidence, then Georg decides before Asset 2.**
