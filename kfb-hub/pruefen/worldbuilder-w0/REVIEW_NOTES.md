# WB-W0 · Human review

This page is the unchanged `WB-W0_2026-09-24` runtime export, repackaged only with a stable `index.html` and source marker.

## Review now

- Does the world finally feel like one measurable place rather than a decorative planet?
- Can the character use the spawn, road and door threshold without sinking, hopping or standing inside scenery?
- Does the globe-to-local-region transition support the intended Travel mode?
- Is this the right foundation for the next OSM/Racer world slice?

## Proven in the browser

- 10/10 built-in gates PASS.
- GothGirl 2.211 m; KayKit door 2.80 m; Tiny Treats house scaled from its real door.
- Route 241.46 m; width 18.0 m plus 2.7 m shoulders.
- Spawn slope 0°; route surface and shoulder max 3.04°.
- Spawn-to-billboard run: 43.22 s, 0 hops, 0 blocked frames, 0 sink.
- Door threshold reached; the house has no interior and is not presented as enterable.
- Unchanged Travel controller stays stable through 25°; 30° and 35° fail as expected.

## Vocabulary correction, no geometry rewrite

The exported runtime calls 18.0 m `STANDARD` because its Racer donor contains the older width vocabulary. The current accepted grammar calls 18.0 m `WIDE` (`NARROW 10.8 · STANDARD 14.4 · WIDE 18.0 · HERO 21.6`). The source geometry remains untouched for this gate; a later integration must update the vocabulary deliberately.

## Known HOLDs — not hidden

- One KayKit tree renders black. Diagnose the source material/texture later; do not recolor it by guesswork.
- Walk/Run changes are too hard. The next animation pass should blend states and couple playback to speed.
- Ink around the round character head is visually doubtful. The existing toggle is the comparison tool; do not invent a second outline system.
- House interior, weather, editor/sculpt layer and vehicle driving are deliberately outside WB-W0.

## Gate

Human decision: `PASS`, `TUNE`, or `REJECT` for the world-scale and traversability foundation. Visual HOLDs do not invalidate the measured core unless they prevent evaluation.
