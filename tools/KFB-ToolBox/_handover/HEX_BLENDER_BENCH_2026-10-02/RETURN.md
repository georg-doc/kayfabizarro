# RETURN · Hex World → Blender MCP handoff

Status: **READY FOR CLAUDE / BLENDER · SELF-CONTAINED GITHUB HANDOFF**
Date: 2026-10-02

## Human result

Claude Coworker + local Blender MCP can start from this GitHub branch without access to KFB Production Control.

Everything required to begin is either:
- copied into this handoff folder; or
- already available at exact pinned paths in the repository.

## Current product truth carried into the bench

- Hex browser measurement: 15/15 PASS.
- Procedural nature P1/P2: source-derived geometry PASS.
- Lightweight material direction: `clay_floor_001` is the current preferred global Clay candidate for comparison.
- Heavy procedural Clay remains Near/Hero reference rather than presumed global runtime solution.
- Procedural building implementation is not yet accepted; Blender should select/measure authored family seeds and consume the existing deformation lineage.
- Existing biome/grouping lessons are reused; Blender does not become a placement/runtime owner.

## Source package

Read:
- `START_HERE.md`
- `PARALLEL_WORLD_STATUS.md`
- `SOURCE_MANIFEST.json`
- `BLENDER_MCP_BRIEF.md`
- `SPRINT_PLAN.md`
- `data/HEX_BROWSER_MEASUREMENTS.json`

## Exact Git state

Repository: `georg-doc/kayfabizarro`
Handoff branch: `chatgpt-web/hex-blender-handoff-2026-10-02`
Draft PR: #317

This branch is aligned with final Procedural Environment P2 head:
`e3a64161a0cf4df4bdb301ef484de4d4f1e897b6`

## Tests/evidence inherited

Hex browser:
- 447 source-pinned models
- 230/230 S0 core loaded
- 176 S1 tiles measured
- 15/15 acceptance tests PASS

Procedural Environment P2:
- 13/13 authored donors PASS
- 7/7 procedural transfers PASS
- 0 QA problems

## Open work

Claude/Blender must still:
- run source-isolation in Blender;
- classify authored/procedural families;
- inspect material/mesh/texture structure;
- select 1–3 normal building-family seeds;
- build exactly one 1-cell, 2-cell and 3-cell semantic scenelet;
- return targeted browser-runtime hypotheses.

## Exactly one next action

Claude Coworker opens `START_HERE.md`, creates `blender-mcp/hex-blender-bench-2026-10-02` from the current handoff head, and executes the four-sprint Blender bench.

No merge or Live promotion is authorized.
