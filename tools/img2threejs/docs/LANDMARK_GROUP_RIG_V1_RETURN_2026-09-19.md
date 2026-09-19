# Landmark Group Rig v1 · RETURN · 2026-09-19

**Status:** IMPLEMENTATION + STATIC / NUMERICAL TESTED RESULT · BROWSER / CONSUMER / GEORG ACCEPTANCE OPEN  
**Authoring owner:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Implementation head immediately before this RETURN:** `8e1121c05bb7bb978d5629f61263f0aaa1b5a749`

## Goal completed

The visible Pilot-03 failure where Spasskaya clock assemblies separate/distort under grotesque deformation now has an additive grouped-rig path.

Current review entry:

`tools/img2threejs/landmarks/pilot-04/index.html`

## Exact implementation

Semantic groups:

- `towerCore` — core deformable mass;
- `clock:0..3` — four `rigidAttached` groups;
- `wall:left/right` — Kremlin wall study groups;
- `secondarySoft` — small secondary-motion channel.

For grouped City Grotesque / Soft Cubist:

1. the tower / walls use the existing object-normalized deformation field;
2. each clock has an explicit source anchor;
3. that anchor is mapped through the same deformation field;
4. local X/Y/Z basis vectors are sampled around the anchor and orthonormalized;
5. the full clock assembly is moved rigidly through that local frame.

This preserves clock shape and attachment while the host becomes crooked / cubist.

Pilot 04 deliberately retains **Legacy point deform** as an A/B control.

## Living-toy preview

`reactor.mjs` adds a bounded, presentation-only signal layer:

- `idle` breathing;
- `disco` synthetic beat envelope with BPM / intensity controls;
- `impact` left/right reaction preview;
- accent / glazing emissive pulse;
- secondary-soft wobble.

Public API remains signal-oriented so a later receiver can feed real audio / race events. No audio engine is created here.

`bumperProfile` is present in rig metadata as **PROPOSAL_METADATA_ONLY**. No collision, restitution or vehicle impulse has been implemented by this authoring lane.

## Tests actually executed

Current GitHub source was read back and evaluated in-memory after implementation.

**212 / 212 PASS.**

Key measured results:

| Model / mode | Triangles | max rigid-clock error | legacy clock distortion |
|---|---:|---:|---:|
| Spasskaya · base | 3,496 | 0 m | — |
| Spasskaya · City Grotesque | 3,496 | 3.997e-15 m | 0.4181 m |
| Spasskaya · Soft Cubist | 3,496 | 4.441e-15 m | 0.2426 m |
| Kremlin wall · base | 5,008 | 0 m | — |
| Kremlin wall · City Grotesque | 5,008 | 3.997e-15 m | 0.4356 m |
| Kremlin wall · Soft Cubist | 5,008 | 3.997e-15 m | 0.2786 m |

Checks also covered:
- source asset remains byte/logically unchanged by the rig operation;
- triangle count preserved;
- ground anchor preserved;
- four explicit clock groups;
- wall groups where applicable;
- independently recomputed anchor-field mapping;
- orthogonal sampled local attachment basis;
- clocks remain near the mapped host anchors;
- bounded idle / disco / impact signal math;
- impact direction;
- Pilot-04 viewer source parsing;
- required review controls.

Reproducible repository test:
`tools/img2threejs/tests/check_landmark_rig_v1.mjs`

Evidence:
`tools/img2threejs/evidence/2026-09-19-landmark-rig-v1/summary.json`

## Browser evidence boundary

The source viewer is implemented and statically parsed, but this session does **not** claim a successful new WebGL/browser/mobile frame for Pilot 04. A public Cloudflare route was probed but could not be verified through the available web tool.

Therefore:

- source / numerical PASS: **yes**;
- browser/WebGL PASS: **open**;
- public deployment: **not claimed**;
- Georg visual acceptance: **open**.

## Protected owners unchanged

- OSM City: geography, local metres, City style, Landmark Override contract;
- Registry/Librarian: asset identity;
- Travel/Free Roam: movement, terrain contact, persistence;
- Race: vehicle/contact/physics/camera/gameplay;
- Audio: existing audio/runtime owner.

City S2 collision/export geometry and the City landmark manifest were not modified.

## Additive ideation persisted

[Living Toy World / Reactive Landmarks / Surreal Historic Scenery](../docs/IDEATION_LIVING_TOY_WORLD_2026-09-19.md)

Recorded as **PROPOSAL**, not current implementation:
- Acropolis / Athens;
- Area 51 + crashed UFO / public geography + surreal fictional underground layer;
- JFK / Dealey-style source-backed city/scenario slice with speculative layers kept separate from geography;
- underwater Atlantis with general impossible-geometry architecture;
- future audio-driven visualizer seam;
- future Race/Travel bumper/contact seam;
- future `kfb-box-material` + `edge3` surface pass.

## Exactly one open human review question

**Does Grouped Soft Cubist or Grouped City Grotesque feel closer to the intended “breathing living toy” landmark language?**
