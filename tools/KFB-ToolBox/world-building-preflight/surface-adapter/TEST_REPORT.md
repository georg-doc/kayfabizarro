# WB1-P2 · Surface Adapter · Test Report

Status: **TECHNICAL PASS · PUBLIC BROWSER PASS · HUMAN REVIEW PENDING**
Date: 2026-09-23
Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/world-builder-p2-surface-adapter-2026-09-23`
Draft PR: **#180**
Accepted runtime for human review: `0599cc04d2db72ed33c49fb98a30898290a00a68`

## Bounded scope

One immutable logical recipe is projected onto exactly three orientable surfaces:

- FLAT
- SPHERE
- TORUS

The recipe is unchanged across all three:
- seven real KayKit Hex cells;
- one route data set;
- real KayKit `target.gltf` prop;
- accepted WB1-P1 Environment Profile reference;
- one StoryMap/Travel-derived radial Surface-FX event.

No World Editor, movement writer, camera writer, terrain owner, OSM owner, Race controller or new Hex solver was introduced.

## Repository-native deterministic proof

Static workflow run: `35815116764` → **PASS**.

Tests:
- `node test/surface-core.test.mjs` → **8/8 PASS**
- `node --check surface-core.mjs` → PASS
- `node --check recipe.mjs` → PASS
- `node --check demo.mjs` → PASS

The deterministic checks cover:
1. one immutable recipe identity across all adapters;
2. exactly seven measured KayKit identities and valid 60° rotations;
3. finite normalized orthogonal right-handed frames;
4. FLAT/SPHERE/TORUS logical↔address round trips below `1e-9`;
5. surface-point projection round trips below `1e-8`;
6. curved surfaces do not use global Y as universal up;
7. route / prop / Environment Profile / FX data remain surface-agnostic;
8. core/recipe source introduces no movement/camera/terrain owner markers.

## Existing-owner check

The browser harness calls the existing Hex owner:
- `buildNetwork()`
- `solveHexTile()`

Expected road fixture:
- west: `hex_road_M @ 180°`
- center: `hex_road_A @ 0°`
- east: `hex_road_M @ 0°`

The first browser attempt exposed a harness contract bug: `buildNetwork()` expects chain objects with
`{ id, cells }`; P2 initially passed a naked cells array. No owner code was changed.

Repair:
`buildNetwork([{ id: 'wb1-p2-road', cells: chain }])`

Repair static CI: `35815116764` → PASS.

## Source-object-first proof

The exact KFB Stage begins with the real KayKit `target.gltf` prop in isolation.

Required marker observed:
`SOURCE OBJECT RENDERED · SURFACE PROOF UNLOCKED`

Source snapshot:
- `sourceIsolationRendered=true`
- `consoleErrors=0`
- `cellCount=7`
- prop identity `kaykit-medieval-hexagon-pack-1-0-free|target`
- FX type `KFB_RADIAL_RIPPLE`

## Public browser proof

Exact Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-building-preflight/`

GitHub Actions run `35815317560`: **PASS**.

All three surfaces preserved the same:
- recipe fingerprint;
- seven cell identities;
- route data;
- prop identity;
- Environment Profile reference;
- Surface-FX event type.

All three center frames were:
- finite;
- normal length = 1;
- tangent U length = 1;
- tangent V length = 1;
- pairwise orthogonal within floating-point epsilon;
- handedness = +1.

Browser result:
- page errors: **0**
- failed HTTP requests: **0**
- application `consoleErrors=0`
- source proof: PASS
- FLAT: PASS
- SPHERE: PASS
- TORUS: PASS
- FX trigger on each: PASS

Screenshot artifact:
- name: `wb1-p2-stage-evidence`
- artifact ID: `10731296741`
- files uploaded: **5**
- digest: `sha256:93f1325571fe7896945116422ce50a8b161ae3695034e6a30500940a9cd8633e`

## Publication boundary

This is a **technical browser PASS**, not Georg's visual acceptance.

- Human review: **PENDING**
- WB1-P3 / Claude Design: **HOLD**
- PR merge: **not performed**
- Live product promotion: **not performed**

## Exactly one next gate

**Georg Human Review of WB1-P2** on the exact Stage URL.

Review:
1. real `target.gltf` visible alone first;
2. switch to FLAT;
3. switch to SPHERE;
4. switch to TORUS;
5. confirm the same seven-cell recipe / route / target reads coherently on all three;
6. trigger FX ripple on each;
7. look specifically for floating cells/prop or wrong "up" orientation.

After Georg PASS: update evidence/Return and STOP. Do not start WB1-P3 in the same gate.
