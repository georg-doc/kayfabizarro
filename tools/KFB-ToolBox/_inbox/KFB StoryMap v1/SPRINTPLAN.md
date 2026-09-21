# SMA1 · Sprint plan / TODOs — next session

Priority-ordered. P0 blocks calling the water feature "done."

## P0 · New, from the 2026-09-22 session

1. **Live-focused-tab check of the water shader.** Open the real DC in a normal,
   foregrounded browser tab (not headless/automated), toggle "Wasser" on, and look at it
   for a few seconds of real animation time. Report: is there ANY visible motion/mottling
   in the sea, or is it genuinely flat? This is the one thing last session could not
   settle — see `POSTMORTEM-2026-09-22.md`.
2. **Decide on foam.** The new source-locked donor forces foam off (`u=0.5` constant,
   by design per the original brief). If the live check in item 1 confirms the sea reads
   as too flat/dead, bring this back to Georg as an explicit choice — not a silent
   deviation from source-lock — before touching the GLSL: (a) accept calm water as final,
   or (b) ask the donor owner for a variant with foam re-enabled, or (c) brighten `uCol`
   / raise exposure locally in this project only (documented as a project-side deviation,
   never edited into the source-locked file itself).
3. **Investigate the render-loop stall itself**, independent of water. This session
   measured only 1 GPU frame across 6–14 seconds under a hidden tab. Confirm whether the
   `dt<0.008` early-return guard, or an uncaught exception somewhere in the per-tick
   `step()` body, can strand the loop in *focused* tabs too, not just backgrounded ones —
   this would explain flickers/freezes beyond just the water toggle.

## P1 · Carried from `docs/SMA1-GATE.md` ("Offen für die nächste Sitzung")

4. **Dice physics.** Donor: `3d-dice/dice-box-threejs` (already pinned in T1). Needs a
   real physics world, collision bodies for board/pieces/voxel field, throw-from-height,
   rest-detection. Do this as a dedicated pass — a die that falls through the board or
   never settles breaks the whole stage's credibility.
5. **Warband-Orc rig.** Donor: `Rig_Legacy` (six bones, 30 clips). Binding order: measure
   the Clip × Prop compatibility table on ONE figure first, THEN build the orc. Do not
   assume every prop carries all 30 clips.
6. **Coastal-arc deformer gap.** The cartoon deformer only reaches the landmark geometry
   class; flat country outlines need their own in-plane bulge path.
7. **Voxel instanced-attribute deformer gap.** The deformer writes vertices; an
   `InstancedMesh` needs the displacement as a per-instance attribute instead.

## P2 · Known, blocked on data, not code

8. **Rivers as lines.** `kfb-fluid-v2`'s `setCardZoneV2ConstantFlow` already supports a
   non-zero per-vertex `aFlow` for river current — the OpenPlanetData boundary GeoJSON
   simply contains no watercourse geometry. This is a source gap, not a code gap; needs a
   river-line data donor before it can be built.
