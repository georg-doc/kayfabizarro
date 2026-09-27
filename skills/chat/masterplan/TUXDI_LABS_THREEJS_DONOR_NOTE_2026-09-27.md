# Tuxdi Labs · Three.js donor research note

Status: **RESEARCH / DONOR CANDIDATE · NOT IMPLEMENTED**  
Date: 2026-09-27  
Owner: Georg / KFB routing only  
Receiving owners: WorldBuilder / Travel world presentation / ToolBox as applicable

## Why this is parked

Georg asked to retain the useful mechanisms from Tuxdi Labs for later KFB work without creating a new runtime owner or copying a showcase wholesale.

Public entry:
- https://labs.tuxdi.com/

This note records only what was verified in the current GitHub/source pass.

## 1 · Grass shader

Verified public source:
- https://github.com/FeliDipi/Grass
- current inspected default branch: `main`

The repository describes and implements:
- Three.js via React Three Fiber;
- instanced grass blades with a custom raw vertex/fragment shader;
- procedural wind sway and wave motion;
- per-blade scale/phase variation;
- curvature and colour variation;
- optional source-geometry sampling so grass can be distributed over arbitrary geometry;
- orientation to sampled surface normals;
- pointer/touch interaction through an interactor position/radius/strength;
- live parameter controls through Zustand + lil-gui.

KFB relevance:
- reusable reference for GPU-cheap repeated surface detail;
- useful beyond literal grass: moss, fibres, fur-like tufts, soft clay hairs, vegetation and other repeated surface accents;
- the geometry-following distribution and local interaction model are especially relevant to WorldBuilder;
- the mechanism should be adapted to the KFB material/look contract rather than imported as a visual style.

Important source boundary:
- a repository-level licence was **not verified in this pass**. Dependency licences in `package-lock.json` are not a licence for the repository itself.
- Until a repository licence or author permission is pinned, treat the implementation as a **research donor / mechanism reference**, not source approved for copying.

## 2 · Reflection probes

Public Labs presentation names a Three.js reflection-probe experiment.

KFB relevance:
- local environment reflection per room/zone/object cluster instead of relying only on one global environment map;
- potentially useful for Town interiors, OMS City, shops, vehicles and clay/material presentation;
- could help keep local reflective response coherent when the world contains several materially different spaces.

Current evidence boundary:
- no corresponding public GitHub implementation repository was located in the 2026-09-27 search pass;
- therefore this is a **concept/mechanism donor only** until source, revision and licence are pinned;
- do not claim donor-code reuse from a loaded Labs URL alone.

## 3 · Adoption rule

Do not build a separate “Tuxdi system”.

If one of these mechanisms becomes useful:
1. show the exact donor/source object or source implementation in isolation;
2. pin repository + revision + licence/permission;
3. identify the existing KFB receiving owner;
4. port the smallest mechanism required;
5. test it inside the real receiving product surface.

No standalone human gate is required merely because this research note exists.
