# START HERE · Hexagon → Blender MCP

This folder is the **self-contained GitHub handoff** for Claude Coworker + local Blender MCP.

**Do not require KFB Production Control to start.** Production Control is provenance/status only. All inputs needed by Blender are either:
1. copied into this handoff under `data/`, or
2. already present in this exact repository state and pinned in `SOURCE_MANIFEST.json`.

## Human goal

Determine which authored Hex/KayKit assets and which already-proven procedural families should become the practical KFB island/world kit, without inventing a second world/runtime owner.

## Read order

1. `PARALLEL_WORLD_STATUS.md`
2. `SOURCE_MANIFEST.json`
3. `data/HEX_BROWSER_MEASUREMENTS.json`
4. `BLENDER_MCP_BRIEF.md`
5. `SPRINT_PLAN.md`

## Exact input state

This handoff branch is based on:
- procedural Environment P2 current head: `9ff8c9df3aa0230faa8c9b7d9afe10f7cff47b86`
- P2 status: **13/13 exact source donors + 7/7 procedural geometry transfers PASS**
- Hex browser catalog: **15/15 PASS**, copied into this handoff in the second checkpoint.

## Blender working branch

Create/use:
`blender-mcp/hex-blender-bench-2026-10-02`

from the exact handoff head returned by this folder's final commit.

Do not work directly on the experimental P1/P2 donor branches.

## Important product constraints

- `clay_floor_001` is the current preferred lightweight universal Clay-texture candidate by Georg's visual review.
- Heavy procedural Clay remains a near/hero visual reference, not the assumed global runtime material.
- Clay002 is a negative/control candidate for this work.
- Procedural nature P1/P2 geometry is already proven and must be considered alongside authored KayKit assets.
- Procedural buildings are **not yet implemented**. Their form lineage is already source-pinned and must be reused rather than replaced by a generic generator.
- Biome/scatter composition reuses existing KayKit/Travel family/grouping lessons; do not create a new biome owner in Blender.
- Browser measurements own FPS/runtime claims. Blender owns source/geometry/material/preparation findings.

## Stop rule

If an exact referenced source is missing from the checkout, report the exact path/ref. Do not replace it with a lookalike or generic primitive.
