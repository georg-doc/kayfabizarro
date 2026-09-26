# Failure Recovery · KFB Clay Asset 03 · Rough Handmade Meso Height · 2026-09-26

Status: **FROZEN AFTER TWO REPAIR PASSES · NO PRODUCTION PROMOTION**

Owner: **KFB ToolBox / ClayBound material exploration**  
Receiving lane: Blender / Blender MCP after human acceptance only.  
Parent handoff: `tools/KFB-ToolBox/_handover/CLAYBOUND_ASSET_PIPELINE_2026-09-26/`

## Outcome

Georg requested a coarse seamless handmade clay-modelling texture after accepting Asset 01.

Queue handling:
- Asset 01: **HUMAN_ACCEPTED**
- Asset 02: **DEFERRED by explicit jump**
- Asset 03: this recovery

Asset 03 was interpreted as a **16-bit grayscale relative meso-height source** so colour, relief and roughness remain separate production controls.

## Frozen state

- **r2:** tile QA PASS, human look OPEN; usable as the technical review candidate.
- **r3:** sculpted-handmade direction improved, but tile QA FAIL; recovery evidence only.
- No third patch pass is allowed in this slice.
- No Blender source model, GLB, rig, material owner, Stage or Live route was changed.

## One next gate

**GEORG HUMAN REVIEW · r2 look.**

PASS → one isolated Blender CLAY-B0/B1 proof may consume the exact r2 SHA.  
TUNE/REJECT → start a fresh Asset-03 slice using r3's broad sculpt-stroke direction plus the verified PR #173 periodic seam donor; do not patch this frozen slice.
