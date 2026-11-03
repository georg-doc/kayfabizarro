# R2 KayKit Prototype Factory Maze – Source & Editorial Test Report · 2026-10-28

**DESIGN/SOURCE CHECKS ONLY.** Existing-owner game/runtime, Blender, visual source isolation, CI, mobile, Stage and publication remain UNTESTED.
Owner branch: planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19; Draft PR #435.

## Checks actually run
- Exact GitHub R2 design and JSON source selection fetched on active branch: 2/2.
- Exact main GitHub directory contents for Prototype Bits 1.1 and City Builder Bits 1.1 fetched: 2/2.
- For 16 proposed GLTF models, direct main directory listing contains 16/16 exact .gltf and 16/16 matching .bin names, plus each kit's texture name. File existence does NOT prove decoding, rendering, mounting, texture fidelity or collision.
- **26/26** static source/editorial assertions PASS, 0 failed:
- PASS: Design/not runtime status
- PASS: Single WS1 receiver
- PASS: R4 STOP
- PASS: 3 Levels
- PASS: Gameplay loop
- PASS: Measured kit donor
- PASS: Maze graph donor
- PASS: Gizmo authoring
- PASS: City noBase
- PASS: Platformer gap
- PASS: Extra tier conditional
- PASS: Prototype 85
- PASS: City 73
- PASS: Goo and Ink separate
- PASS: D6 canonical names
- PASS: Quest experiment
- PASS: Qiva separate
- PASS: One next gate
- PASS: No code claims
- PASS: JSON not registry
- PASS: 16 candidates
- PASS: none isolated
- PASS: City atlas
- PASS: Prototype atlas
- PASS: All 16 gltf
- PASS: All 16 bin

## NOT performed
- Platformer official pack imported into KFB: NOT VERIFIED. KFB GLB_platformer listed five unrelated character files; not a true Platformer kit.
- Source-isolated object views, bboxes/pivots, grounded fit, colliders, faces, visual QA: 0.
- Maze generation, packet rerouting, Mech gameplay, Node tests, browser, mobile, FPS, Audio, full fresh-reload, Site/Cloudflare Stage or deployment: **0 new tests**.
- The older Kit Lab/S13 and Seed World POC test claims were not rerun and do not prove new integration.

## Unresolved / next gate
**WS0_SOURCE_ISOLATION_AND_LEVEL01_FIXTURE:** in current Asset Librarian/Kit Lab isolate real City/Prototype objects, resolve official Platformer FREE/EXTRA availability, pin active WS1b receiver, choose Level01 one fork/two routes/one switch/one wave. No auto-merge or Live.
