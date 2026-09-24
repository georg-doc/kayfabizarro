# HUMAN RESULT · Hürth 01 V2 · R2 tune = FAIL · 2026-09-24

Reviewed by Georg: the latest tuned review at `kfb-hub/pruefen/huerth-look/`.

## Verdict: FAIL

- **None of the three bugs is fixed:** roof overhang (roofs still sit on top, wall body wider than roof), road/curb seams (wedges), shadow banding.
- **Road rework made it worse:** new artifacts and new gaps in the road/curb ribbons.
- **Works and is kept:** the colour palette part (story mode, card seeds, random harmonic palettes as in KFB Racer Cologne).

## Consequence

- Continuation basis stays the tested V2 geometry @`0c59e92d9d8688f5a88cd309ae8891dcd174c2fc` **plus** the working palette change only.
- Do **not** carry over the R2 road/curb changes.
- The three bugs stay open. Next attempt only with a before/after picture per bug, fixed at the root (roof built from the final deformed wall outline; ribbons and junctions sharing edges; shadow bias/normal bias/shadow-map fit), not by further patching the R2 roads.
- WorldBuilder v1 brief must state this status.
