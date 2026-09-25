# KFB Cologne Route 01 · Recovery

**Status:** planning + execution briefs complete; implementation not started in this repo.

## CURRENT RECOVERY · 2026-09-26

Georg reports Blender MCP is currently building the missing connector/offset pieces. At the latest GitHub inspection, no new `rkit-10` branch/PR was visible in Race yet. Treat that work as:

`USER-REPORTED IN PROGRESS · GITHUB OUTPUT NOT YET PINNED`.

Do not guess its output paths.

### Recover in this order

1. `skills/chat/START_HERE.md`
2. this folder's `START_HERE.md`
3. `TRACK_TO_OSM_EXECUTION_LADDER_2026-09-26.md`
4. `EVIDENCE_AND_GAP_MATRIX.md`
5. `WEBCHAT_PLAYABLE_TRACK_R0_PREP_BRIEF.md`
6. `CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md`
7. `CLAUDE_BLENDER_MCP_BRIEF.md`
8. current `georg-doc/KFB-Stunt-Car-Race/main` → `WSA_START.md`, `RECOVERY.md`
9. current Race RKIT/MCP branches/PRs.

GitHub current state overrides the dated heads recorded here.

## Current production order

```text
Blender MCP connector pieces
→ WEB-PREP-TRACK-R0
→ CLAUDE DESIGN PLAYABLE-TRACK-R0
→ WEB REHOME / TEST / HUMAN TRACK GATE
→ WEB PREP real Köln OSM Route 01
→ CLAUDE DESIGN OSM composition
```

Track R0 is built first because it isolates the reusable driving/geometry seams, but its OSM seam contract is written **before** Claude composition.

## What is decided

- Hürth → Dom → Rhein → Mülheimer Brücke → SAE remains the first long real Cologne route target.
- OSM, future simple editor and seeded generation compile into one RouteRecipe family.
- Route geometry is separate from surface profile, edge treatment, structure and stunt modules.
- Track R0 is a closed freeplay loop used to prove this architecture before the real Köln geography is composed.
- Track R0 includes a real RKIT Track ↔ CITY_STREET ↔ Track profile seam, but not fake Köln geography.
- Claude Design composes only pinned sources. It does not model the missing MCP connector pieces.
- Race remains the sole movement/contact/camera/recovery owner.
- Existing Race PR #12 is a donor for continuous OSM corridor/receiver architecture; it is not the desired Route 01 geography.

## What is not done

- Blender MCP output not yet pinned here;
- Web Track R0 input pack not created;
- Track R0 not composed;
- no new Race runtime tests;
- no real Hürth→SAE corridor captured;
- no Claude OSM composition;
- no new Stage/public runtime.

## Exactly one next gate

**WEB-PREP-TRACK-R0** from `WEBCHAT_PLAYABLE_TRACK_R0_PREP_BRIEF.md`.

Its first action is to recover and pin the latest Blender MCP result. If that output is still unavailable, Web may prepare runtime/recipe/OSM seam material but must leave those module refs unresolved rather than inventing them.
