# WB1-P2 · Human Review · 2026-09-23

Status: **HUMAN FAIL · SURFACE CONFORMANCE NOT VISUALLY ACCEPTABLE**

Reviewer: Georg

Reviewed Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-building-preflight/`

Reviewed runtime:
`0599cc04d2db72ed33c49fb98a30898290a00a68`

## Human observation

The FLAT / SPHERE / TORUS proof does not read as a cleanly integrated world/surface composition.

On the reviewed TORUS frame in particular:

- the rigid Hex assets visibly collide / overlap instead of reading as one coherent surface-attached patch;
- the route reads as a separate yellow/orange strip laid across the cluster rather than a road integrated into the local surface;
- the Surface-FX reads as a simple ring/debug circle rather than a meaningful integrated surface effect;
- overall the components look inserted into the surface proof rather than authored as one surface-coherent world recipe.

Georg described the same general weakness across the surface views.

## What the automated PASS still proves

Do not discard the useful technical evidence.

The existing P2 tests still prove:

- the same immutable recipe/data can be addressed on FLAT / SPHERE / TORUS;
- frames are finite, normalized, orthogonal and right-handed;
- global-Y is not used as universal up;
- recipe identity / route data / prop identity / Environment ref / FX event identity remain unchanged.

## What the Human FAIL reveals

The current renderer applies each rigid Hex object through one local frame at its center:

`applyFrame(obj, logicalPose(...))`

That is insufficient for visibly coherent placement on strong curvature.

A large rigid flat tile can be tangent-correct at its center while its edges:

- penetrate neighbors;
- leave gaps;
- cut through the curved support surface.

This is an architectural presentation seam, not a cosmetic colour/light issue.

The current route is also deliberately only a proof tube:

`TubeGeometry(projected centerline)`

It proves route projection but not a usable road/surface ribbon.

The current FX is a debug LineLoop generated from projected ring samples. It proves event addressing, not the eventual KFB surface-wave look.

## Gate classification

- Surface/Hex visible conformance: **ACCEPTANCE_BLOCKER**
- Route visible conformance: **ACCEPTANCE_BLOCKER**
- Prop support/contact: **must be rechecked in repaired proof**
- Ripple visual richness: **MINOR / DEBUG PRESENTATION**, unless geometry itself fails to follow the surface

## Exactly one next gate

**WB1-P2R1 · Surface Conformance Repair**

Do not start P3.

P2R1 must preserve the proven logical recipe and Surface Adapter math while replacing the center-frame-only presentation with a visibly coherent surface-attached rendering proof.
