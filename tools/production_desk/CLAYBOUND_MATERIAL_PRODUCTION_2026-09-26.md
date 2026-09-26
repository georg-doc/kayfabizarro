# KFB Hub · ClayBound / Handmade Material Production · 2026-09-26

Status: **LOOK_AT · ASSET 01 HUMAN_ACCEPTED · ASSET 03 r2 REVIEW · NO STAGE / LIVE CLAIM**  
Owner: **KFB ToolBox / ClayBound material exploration**  
Hub owner: **HUB-CTRL #202 / tools/production_desk**  
Receiving Blender lane: **PR #228 · `claude/claybound-blender-lane-plan-2026-09-26`**

## Current action

**CLAY-ASSET-03 · Rough handmade clay · meso-height r2**

Review only the r2 candidate in the current ChatGPT handoff.

Current state:
- Asset 01 · smooth matte clay r1: **HUMAN_ACCEPTED** · tile QA PASS · not yet Blender-proven.
- Asset 02 · fine-grain clay: **DEFERRED by explicit user jump**.
- Asset 03 r2: 2048×2048 · 16-bit grayscale · Non-Color relative height · **4/4 tile criteria PASS** · human look OPEN.
- Asset 03 r3: broader kneading/compression language but **X/Y seam FAIL** · recovery evidence only.
- two repair passes spent → Asset-03 slice frozen; no r4 patch in this lane.

## Durable handoff

Repo: `georg-doc/kayfabizarro`  
PR: **#228**  
Branch: `claude/claybound-blender-lane-plan-2026-09-26`

Start:
`tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/START_HERE.md`

Return:
`tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/RETURN.md`

Blender MCP brief:
`tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/BLENDER_MCP_BRIEF.md`

Failure recovery:
`tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/failure-recovery/ASSET_03_ROUGH_HANDMADE_2026-09-26/`

## QA summary

- Asset 01 edge equality: **2/2 PASS**.
- Asset 03 r2 seam/half-offset criteria: **4/4 PASS**.
- Asset 03 r3 seam/half-offset criteria: **2/4 PASS · 2 FAIL**.
- Blender tests: **0**.
- Stage/browser tests: **0**.
- No direct Stage review route exists or is required for this raster-only human gate.

## Blender MCP routing

Before Georg PASS:
- inspect/review only;
- do not apply Asset 03 to a production KFB model.

After Georg PASS:
- verify exact r2 SHA from the manifest;
- load as **Non-Color**;
- use as **Height → valid Bump chain**;
- keep Base Color / meso relief / future micro / future roughness separate;
- deforming character: UV/tangent-safe downstream detail and two-pose no-swim proof;
- static scenery: triplanar/object mapping may be tested;
- work on a copy only;
- preserve rig, geometry ownership and material slots;
- keep T1 Cycles / T2 EEVEE / T3 baked runtime tiers separate.

PR #173 remains the verified seam donor.

## Binary / Dropbox boundary

The exact PNGs are current ChatGPT review artifacts.

Dropbox recon found multiple historical ToolBox folders but no unambiguous ClayBound production destination. No file was guessed into a Dropbox folder. After human acceptance, the exact byte-identical source routes into the existing approved Asset Librarian / production destination.

## Source / briefing

Primary intake:
`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/CLAYBOUND_INPUT_INTAKE_2026-09-26.md`

Clay Asset Studio:
`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/KFB_CLAY_ASSET_STUDIO_PLUGIN_v0.1.0_2026-09-26.md`

NotebookLM / ClayBound demo:
`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/`

## Boundaries

- The 50-item plugin queue remains the detailed execution order; do not create 50 Hub cards.
- No character redesign.
- No second asset registry.
- No batch approval.
- No automatic Blender integration.
- No PDF conversion in this sync.
- No Stage / Live promotion.

## Exactly one next gate

**GEORG HUMAN REVIEW · Asset 03 r2 look.**

PASS → one isolated Blender CLAY-B0/B1 proof.  
TUNE/REJECT → fresh Asset-03 slice from r3 sculpt direction + PR #173 periodic seam donor; no r4 patch on the frozen slice.
