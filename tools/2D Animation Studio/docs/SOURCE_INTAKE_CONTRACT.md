# Source Intake Contract

## Purpose

Convert authoritative art packages into reusable animation-building blocks without losing source identity.

## Intake lifecycle

1. DROP into `_inbox/<job>/sources/`.
2. CLASSIFY source files, linked assets, artboards/layers, fonts and external dependencies.
3. RECORD source filename, checksum/revision where available and visual owner.
4. INVENTORY all reusable parts and existing rig/eye/anchor logic before editing.
5. MEASURE bounds, relative proportions, outline families and overlap order.
6. PROPOSE canonical module structure.
7. ACCEPT explicitly into the Studio asset library.
8. BUILD rig/playback against accepted assets.
9. TEST in browser and compare against source reference.
10. RETURN evidence and consumer handoff.

## Hard boundary

`_inbox != SSOT` until acceptance is recorded.

For the upcoming DocCheck AD Illustrator package, do **not** auto-trace or procedurally redraw artwork before inspecting its native vectors/layers. Existing eye rigs, pivots, masks and reusable elements should be preserved when technically viable.
