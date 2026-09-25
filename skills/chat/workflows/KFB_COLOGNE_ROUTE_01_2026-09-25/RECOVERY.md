# KFB Cologne Route 01 · Recovery

**Status:** planning slice complete; implementation not started.

## Recover in this order

1. `skills/chat/START_HERE.md`
2. this folder's `START_HERE.md`
3. `EVIDENCE_AND_GAP_MATRIX.md`
4. `CLAUDE_BLENDER_MCP_BRIEF.md`
5. current `georg-doc/KFB-Stunt-Car-Race/main` → `WSA_START.md`, `RECOVERY.md`
6. current state of Race PRs #39, #40 and #41 before implementation.

GitHub current state overrides the dated heads recorded in the evidence matrix.

## What is decided

- Hürth → Dom → Rhein → Mülheimer Brücke → SAE is the first long Cologne route target.
- OSM, a future simple editor and seeded generation must all compile into one RouteRecipe family.
- Route geometry is separate from surface profile, edge treatment, structure and stunt module.
- Ordinary city street → race track → stunt module → ordinary street is one continuous route system, not separate engines.
- Tokyo Drift is a recipe/assist use of the generic S/chicane/hairpin geometry, not a one-off track asset.
- The next geometry work is RKIT-10 only.

## What is not done

- no full Cologne OSM corridor captured;
- no RKIT-10 geometry built;
- no Race physics changed;
- no loop/skyramp runtime gate executed;
- no editor UI built;
- no Stage/public runtime created by this slice.

## Exactly one next gate

Run `RKIT-10 · Modular Route Adapters v1` from `CLAUDE_BLENDER_MCP_BRIEF.md`.

Stop after isolated M1–M4 proofs plus the compact street → drift → existing stunt socket/bypass → bridge approach → street composition.
