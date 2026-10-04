# S2 Consumer Contract · Ehrenfeld v0

**Status: CONTRACT IMPLEMENTATION · RECEIVER INTEGRATION NOT YET TESTED**

Export: `scenes/ehrenfeld-v0.json` after the real S0 build.

## Receiver ownership

- World/Terrain/Mode/Persistence: `georg-doc/KFB-Travel-Globe`.
- Ground: existing Travel/WB0 ground movement seam.
- Drive: existing Race Slice-04 physics donor through the current Free-Roam receiver proposal.
- City Lab: no player root, no vehicle controller, no gravity owner, no save owner.

Exactly one active movement writer remains the governing rule.

## Exported domains

- local frame and WGS84 origin;
- road centerlines, widths, classes and source tags;
- inferred sidewalk bands as geometry hints;
- building obstacle footprints/heights;
- landuse/green/water classes;
- candidate spawn/parking/intersection/road-terrain anchors;
- complete source/provenance/attribution.

Candidate anchors carry required safety predicates. They are **not** called safe until the receiving Travel/Free-Roam physics/contact world validates them.

## Consumer loop

```text
walk
→ street
→ vehicle
→ forward
→ reverse
→ turn
→ park
→ intersection
→ road / Travel terrain
→ stop
→ exit
```

This loop deliberately excludes traffic, wanted/police, economy and a new city-specific movement stack.

## Local physics seam

The current Free-Roam contract proposes a bounded local Cartesian physics frame mapped into Travel. The OSM City local metre frame is suitable input to that seam, but it does not itself prove Travel scale, radial-up error budget, suspension, terrain contact or save/restore. Those remain receiver tests.
