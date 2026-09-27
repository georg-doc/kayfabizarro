# WORLD-M2A-R3 · City Shell LOD

Status: `READY · ONE STRUCTURAL CANDIDATE`  
Owner: existing World-M2A runtime  
Parent evidence: PR #259 @ `3e4cfc1f47408718a4fe751f641b61484483817c`

## Warum

R1 repaired ground/contact and boot time. R2 proved that Apple Metal acceleration is active and that neither hiding facade details nor simplifying the clay shader produces a useful frame gain. The visible city is dominated by walls (509,294 triangles), roofs (215,255) and windows (270,320).

## Ziel

Build exactly one structural runtime LOD candidate:

- keep the current World r2 owner, OSM layout, building heights, silhouettes, roads and collisions;
- create a lightweight mid/far city shell during build/export, not every frame;
- keep full facades, windows and clay detail only inside a bounded near-player radius;
- switch with hysteresis so walking/driving does not flicker;
- keep Player, vehicle, nearby props and clay identity unchanged;
- no Track, HUD, NPC, audio, billboard or new gameplay work.

## Messung

Use the existing identical idle, walk and drive-offroad scenarios.

Primary target: frame p95 <= 33.3 ms.  
Secondary: no fall-through, 4/4 wheel contacts, boot-to-control <= 15 s, no visible city holes, no pop/flicker during LOD transitions.

Record:

- rendered triangles and calls for near / mid / far;
- p50/p95 frame time;
- boot-to-control;
- direct A/B screenshot from the same camera;
- exact near radius and hysteresis thresholds.

## Stop

One candidate only. If the lightweight shell is not measurably faster or breaks the accepted silhouette/seams, preserve it as failure evidence and stop. Do not compensate by reducing Player/vehicle quality or removing the city.

## Human gate

Only after the metric passes: publish a direct Stage candidate for Georg's free walk -> grass -> drive -> offroad -> exit -> flight test.
