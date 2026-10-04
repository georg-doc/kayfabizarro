# DocCheck Eumel · source-exact candidate module

Status: **IMPLEMENTATION_CANDIDATE**.

This folder is the reusable consumer-facing candidate library for mini-games, microlearning and other 2D/2.5D surfaces.

## Files

- `EUMEL_SOURCE_COMPONENTS.svg` — visible source geometry split into named reusable groups without retracing.
- `EUMEL_SEMANTIC_ALIASES.json` — candidate left/right and semantic aliases; source IDs remain unchanged.
- `rig_contract.json` — hierarchy, exact source matrices, derived pivots and hard constraints.
- `MODULE_MANIFEST.json` — consumer contract.

## Consumer rule

Use wrapper transforms around the source groups. Do not edit the source paths merely to make animation easier.

The candidate is not yet a Georg/AD-approved canonical export. The browser/source visual gate remains open.
