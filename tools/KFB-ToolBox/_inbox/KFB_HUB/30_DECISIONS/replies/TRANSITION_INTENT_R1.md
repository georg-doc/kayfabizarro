# Speckled transitions: what they are meant to do (Georg, 17.10.2026) · V-403

**Core idea:** Two surfaces run into each other **in speckles, like liquids or paints**. There is no colour gradient and no hard edge. The construction pattern should not be visible: it should look like a natural, organic transition zone.

## What belongs to it
- **Both directions:** flecks of A appear in B, and flecks of B appear in A. Density thins out with distance on both sides. Example: patches of earth wander into the grass, and tufts of grass wander into the earth.
- **Vegetation that fades out:** grass and plant growth thins out across the zone. Clumps get sparser and smaller until there are none. This uses the fluff/stone grouping rule `nest()`, not a second rule set.
- **Many sizes, irregular shapes:** large islands, medium flecks and fine dots. The shapes are irregular (warped, pulled, merging), **not round discs**.
- **Organic everywhere:** every zone gets its own seed. The same pattern never sits next to itself, there are no visible cells or grids, and the edge of the zone is never a line.

## Known failures (repeated, do not reproduce)
- Clay drops read as **flat discs** (V-138).
- An end runs as a **straight line** into the grass (V-138); there are dashed edge lines and circle decals.
- The **same pattern on every island**; the cell grid is visible.
- A **gradient** instead of speckles. Several texts (V-341, L2-G12, WS0_TO_WS1 "colour transition 3–8 m") were misread that way.
- Joyride is not optimal either: it is the origin of the idea, but not the visual target.

## Technical base vs. visual target
The Lab S1 code (`kfbSpeckleLayer`, world-fixed, quantile coverage, anti-aliased) is the **technical base** of the module `kfb-speckle-transition.v1`. The **visual target** is this intent. S1 is extended where needed: warp/domain distortion against discs, bidirectional layers, multiple scales, and a vegetation layer.

## Acceptance
- **Blind critic** (without knowledge of the rules) at the standard cameras answers "Is a construction pattern visible? Do you see a gradient, a line or circles?". Required result: no.
- Measured: no straight isoline over 1 m; smallest visible level ≥ 3 px; no repeat next to itself (seed per zone).
- Images: walk height, drive height, overview; next to it the Joyride reference and the old S1 images (`Lab docs/feedback/speckle/*`).
