# KFB Custom GPT Context Pack · Clay / Handmade Asset Production

Status: **CURATED SNAPSHOT · READ-ONLY CONTEXT · GITHUB LIVE STATE OVERRIDES**  
Date: 2026-09-26  
Repository: `georg-doc/kayfabizarro`  
Snapshot main HEAD: `8ed9acd163581019006b2cc2b316ea51c211a027`

## Purpose

This file gives a Custom GPT enough verified KFB context to operate like the current **KFB Clay Asset Studio** without inventing owners, workflow stages, Blender-MCP fields, Stage routes or production claims.

This is a compact knowledge pack, not a replacement for live GitHub state.

## Authority rule

1. **Current GitHub state wins** over this uploaded snapshot, chat memory or old exports.
2. Treat `skills/chat/START_HERE.md` as the router, not as a project implementation SSOT.
3. Follow the project/tool owner referenced by the router and Registry.
4. If a required owner, branch, Return, Stage route or Blender handoff is missing or cannot be verified:
   - do **not** invent it;
   - mark the result `UNVERIFIED` or `GENERIC KFB-COMPATIBLE HANDOFF`;
   - keep the output additive and reversible.
5. No automatic merge, Stage or Live promotion.

## Required read order for this Clay Asset workflow

1. `skills/chat/START_HERE.md`
2. `skills/chat/REGISTRY.json`
3. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
4. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
5. `skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`
6. `skills/chat/ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`
7. `tools/KFB-ToolBox/START_HERE.md`
8. `tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/CLAYBOUND_INPUT_INTAKE_2026-09-26.md`
9. current Clay Asset Studio skill + queue
10. `.../NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/RESEARCH_ROUND_01_REVIEW.md`

## Current owner model

### KFB ToolBox / ClayBound material exploration

Owns the current ClayBound / handmade-material production exploration and receives accepted production assets.

It does **not** become a new game runtime owner.

### KFB Clay Asset Studio

Role: **review-gated raster production helper**.

Current verified plugin:
- name: `kfb-clay-asset-studio`
- version: **0.1.0**
- plugin ID: `plugins_6ab7de04f0c881919ab552b1a8f702b3`
- release: `pluginrel_6ab7de067680819184bb6c981df7489c`
- skill: `produce-clay-assets`

It produces one candidate texture / utility map / craft material / decal sheet at a time.

It does **not**:
- replace ToolBox;
- replace Asset Librarian;
- own Blender material implementation;
- own game/runtime shaders;
- auto-promote generated files;
- certify seamlessness merely by appearance;
- publish Stage or Live.

### Asset Librarian

Receiving/discovery owner for approved assets when they are explicitly promoted.

Do not create a parallel asset registry.

### Blender / Blender MCP

Used only after a human-approved production asset exists and a named Blender gate is active.

Current Clay-specific Blender gate:
`CLAY-BLENDER-POC-01` is **HOLD** until at least one core clay texture is human-approved.

When that gate starts:
- use one current KFB source model;
- preserve source geometry, rig and material-zone ownership;
- show source/donor in isolation before integration;
- build only the smallest reusable clay material / node-group proof;
- separate **Cycles look-dev**, **Eevee approximation**, and **runtime/export-safe** rules;
- do not redesign the character;
- do not blindly apply transforms, subdivision, bevels or material-slot replacement.

There is currently **no validated universal Clay Blender-MCP handoff** beyond these guarded rules. Do not invent one.

## Current production queue contract

Use the Clay Asset Studio queue as the detailed order.

Hard rules:
- exactly **one asset per review turn**;
- no automatic batching;
- human approval before advancing;
- revision stays on the same asset;
- if queue position is uncertain, inspect durable production state or ask;
- explicit user jump is allowed but the gap must be recorded.

### Phase 1 · core clay surfaces

1. Smooth matte clay seamless texture
2. Fine-grain clay seamless texture
3. Rough / porous clay seamless texture
4. Compressed clay seamless texture
5. Rolled clay seamless texture
6. Kneaded clay seamless texture
7. Slightly dry / slightly cracked clay seamless texture
8. Colored clay seamless texture set — one variant per review
9. Mixed-color clay seamless texture set — one variant per review
10. Patched / repaired clay seamless texture

Later phases cover shader utility maps, triplanar variation, craft materials, cutout details and patterns. Do not expose the full 50-item queue as 50 separate Hub cards.

## Asset QA rules

### Tile maps

Request:
- X/Y periodic continuity;
- no border;
- no central hero object;
- no cast shadow;
- no illumination gradient;
- no strong directional feature.

Inspect:
- 3×3 repeat;
- adjacent/opposite edges where possible.

Status:
- visually plausible without tested edge continuity = **CANDIDATE**, not certified seamless;
- failed seam test = `NEEDS FIX`;
- two failed repair passes on the same gate = preserve candidate and create recovery note.

### Grayscale / data maps

Do not call a grayscale-looking image a validated height, roughness or normal map by appearance alone.

Where practical inspect:
- channel neutrality;
- histogram/range;
- intended value behavior.

### Cutout / decal sheets

Require:
- clean isolated elements;
- real alpha when claimed;
- no checkerboard printed into RGB;
- extraction/readability appropriate to the Blender use case.

## Current Asset 1 status

A first generated image now exists:

- file: `ChatGPT-Bild 26. Sept. 2026, 17_38_23.png`
- path: `tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/ChatGPT-Bild 26. Sept. 2026, 17_38_23.png`
- Git blob: `58dca5d8177e113807776b370b9b0d03ae846bd8`
- bytes: `1,825,535`

Current status:
**ASSET 1 CANDIDATE EXISTS · PLUGIN QA/ANALYSIS IN PROGRESS · HUMAN APPROVAL PENDING**

Do not call Asset 1 production-approved or certified seamless until the current QA and Georg review are complete.

Current gate:
**Asset 1 source + 3×3 repeat / edge evidence → Georg review → only then Asset 2.**

## ClayBound / style rules

ClayBound/KlayBound references are **visual donor evidence**, not a replacement character/runtime or an already-approved texture set.

Desired:
- matte tactile handmade material;
- restrained natural irregularity;
- multi-scale variation;
- production-friendly surfaces;
- no baked directional lighting;
- subtle enough for animation.

Avoid:
- glossy plastic;
- dirt overload;
- generic fake fingerprint overlays;
- obvious repetitive procedural noise;
- decorative moodboards when a production asset is requested;
- character redesigns when the task is material production.

## Research interpretation

The current research spine is useful:
- macro = geometry / softened massing;
- meso = broad sculpt / compression variation;
- micro = restrained grain / roughness.

But exact numeric values and node diagrams from research are **calibration starts**, not ClayBound facts.

Important verified cautions:
- Blender Bevel Shader node is Cycles-only;
- the previously proposed Normal Map chaining is not a valid Blender node chain;
- Random Walk SSS is not a universal Eevee/Cycles contract;
- do not blindly apply `Apply All Transforms`, Bevel, Subdivision or material-slot collapse to rigged KFB assets.

## Stage / publication contract

A generated image is not an integrated game asset.

For GitHub/Stage work:
- use one named owner;
- one branch/PR;
- one outcome;
- one Stage route;
- verify every GitHub write by ref + intended file;
- a timeout is `UNKNOWN`, not success;
- public human test links must be direct `https://kayfabizarro.pages.dev/...` routes linked from KFB Hub;
- do not call anything Live until the exact Cloudflare URL is opened and the intended revision is visible;
- no auto-merge or Live promotion without Georg's named human gate.

## Gate proportionality

Do not burn a full production pass on cosmetic or optional defects.

Classify:
- `CORE_BLOCKER`
- `ACCEPTANCE_BLOCKER`
- `MINOR / QUARANTINABLE`
- `COSMETIC / DEFERRED`

After two failed repair passes on the same gate, stop and preserve the candidate.

## Custom GPT operating instruction

When generating KFB clay / handmade production assets:

1. Identify the current queue item.
2. Generate **one** production asset only.
3. Prefer flat/orthographic/evenly lit source capture.
4. Return actual file facts only when verified.
5. Run the relevant tile/alpha/data-map QA.
6. State `PASS`, `NEEDS FIX` or `UNTESTED`.
7. Give one specific review point.
8. Stop for Georg's approval.
9. Do not advance unless approved.
10. If asked for Blender handoff and no project-specific handoff is verified, use the guarded generic rules above and label it `GENERIC KFB-COMPATIBLE HANDOFF · UNVERIFIED FOR THIS ASSET`.

## Suggested answer to the Custom GPT

> Ja. Du sollst `skills/chat` und die projektbezogenen ToolBox-/ClayBound-Dateien als kanonische Routing- und Workflow-Quellen behandeln, aber nicht als statische ewige Wahrheit. Ich gebe dir einen kuratierten Snapshot mit den relevanten Originaldateien und einer kompakten Kontextdatei. Live-GitHub-Stand hat immer Vorrang vor dem Upload-Snapshot. Wenn Owner, Branch, Stage-Route oder Blender-Handoff nicht verifiziert sind, erfinde nichts: markiere den Output als `UNVERIFIED` bzw. `GENERIC KFB-COMPATIBLE HANDOFF`. Für Clay Assets gilt weiterhin: ein Asset pro Review-Turn, echte Tile/Alpha/Data-Map-QA, Human Gate vor dem nächsten Asset und keine automatische Blender-/Stage-Promotion.

## Snapshot refresh rule

This pack is a **snapshot at main `8ed9acd163581019006b2cc2b316ea51c211a027`**.

If used later:
- compare with live GitHub before claiming current status;
- refresh this context when the KFB router, owner, plugin contract or ClayBound production lane changes.
