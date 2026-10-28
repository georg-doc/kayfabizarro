# Bell Resonance R5 — Asset Librarian × Mechanics × Modal Acoustics
Date: 2026-10-28
Status: RESEARCH / HANDOFF · no runtime or site change
Owner: existing KFB Audio Site PR #365; WS0 immersive PR #455; bell research Draft PR #458.

## Decision and source findings
Use the existing KFB Asset Librarian (tracked Registry read-only, candidate-only handoff) before sourcing fresh geometry. Two specific original KFB glTF candidates were confirmed by source-file reads:
- `media/3D_Assets/KayKit_Holiday_Bits_1.0_FREE/Assets/gltf/bell.gltf` — distinct bell, bell_ring, bell_clapper meshes; `bell.bin`.
- `media/3D_Assets/KayKit_Holiday_Bits_1.0_FREE/Assets/gltf/bell_decorated.gltf` — distinct decorated bell, ring, clapper; `bell_decorated.bin`.
Both are untested donors, not accepted physical church bells. Exact license note: `media/3D_Assets/KayKit_Holiday_Bits_1.0_FREE/LICENSE_SOURCE.md` (upstream Kay Lousberg CC0 claim recorded). `building_church_red.gltf` from the Medieval Hexagon pack is architectural context, not a bell. No isolated source rendering has been performed.

## Simulation architecture
A — Coupled rigid-body yoke, bell and clapper pendula, pivots and impact; record exact contact location, relative speed and timestamps. Reference: https://euphonics.org/12-4-1-modelling-a-church-bell/ . A visual Blender hinge is an initial test, not proof of correct physical contact dynamics.
B — Elastic bronze shell eigenmodes, on real inner/outer geometry and variable wall thickness (Glockenrippe). Glockenspeise means the Cu/Sn casting alloy, NOT profile. Obtain watertight solid and support/mass/material conditions; offline Gmsh plus Elmer FEM or equivalent. Solve K φ = ω² M φ. A sound FFT alone cannot provide a spatial mode shape. Export paired mesh and corresponding mode-vector data for Three.js.
C — Audio emission and spatial field, based first on authentic CC0/PD recordings, then optional contact-excited modal synthesis and room IR. Existing KFB Audio owns AudioContext, MusicClock, buses, ducking and spatial adapter; no parallel audio renderer.
Do not conflate tower-structure vibrations with bell-shell eigenmodes. Real physical 200+ Hz vibration must be slow-motion/stroboscopic for visual legibility, with the exaggeration disclosed. The occult/Egregore layer remains separately authored narrative material.

## Valid references
https://gmsh.info/doc/texinfo/gmsh.html
https://docs.csc.fi/apps/elmer/
https://www.nature.com/articles/s40494-021-00620-2
https://www.vut.cz/en/students/final-thesis/detail/165785?zp_id=165785
https://www.gresham.ac.uk/watch-now/maths-bellringing (permutations/change ringing, NOT FEM)

## Evidence and next gate
Source reads: 2 exact bell glTF, 1 church building glTF, 1 pack-license sidecar. 0 live Librarian authenticated search, 0 isolated donor images, 0 real bell recordings acquired, 0 FEM computations, 0 new runtime or public Site.
One next gate: KFB_BELL_R5_LIBRARIAN_DONOR_ISOLATION_AND_REAL_BELL_AUDIO_AUDIT — visually isolate two actual KFB donor bells and acquire two verified CC0/PD recordings; then calibrate one physical eigenmode to one measured sound partial.
