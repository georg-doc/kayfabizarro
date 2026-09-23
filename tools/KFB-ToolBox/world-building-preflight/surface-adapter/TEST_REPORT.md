# WB1-P2 · Surface Adapter · Test Report

Status: **IMPLEMENTATION CANDIDATE · STATIC PASS · BROWSER PENDING**
Date: 2026-09-23

## Bounded scope

One immutable logical recipe is projected onto exactly three orientable surfaces:

- FLAT
- SPHERE
- TORUS

The recipe is fixed: seven real KayKit Hex cells, one route data set, real `target.gltf`, the accepted P1 Environment Profile reference, and one StoryMap/Travel-derived radial Surface-FX event.

No World Editor, movement writer, camera owner, terrain owner, OSM owner, Race controller or new Hex solver is introduced.

## Repository-native tests actually run

- `node test/surface-core.test.mjs` → **8/8 PASS**
- `node --check surface-core.mjs` → PASS
- `node --check recipe.mjs` → PASS
- `node --check demo.mjs` → PASS

Checks cover:

1. one immutable recipe identity across all adapters;
2. exactly seven measured KayKit identities and only valid 60° rotations;
3. finite, normalized, orthogonal, consistently right-handed local frames;
4. Flat/Sphere/Torus logical↔address round trips below `1e-9`;
5. surface-point projection round trips below `1e-8`;
6. curved surfaces do not use global Y as universal up;
7. route/prop/Environment Profile/FX data are surface-agnostic;
8. core/recipe source introduces no movement/camera/terrain owner markers.

## Existing-owner validation

The browser harness calls the existing Hex `buildNetwork()` + `solveHexTile()` before rendering. The frozen road fixture must resolve as:

- west: `hex_road_M @ 180°`
- center: `hex_road_A @ 0°`
- east: `hex_road_M @ 0°`

Any mismatch fails loudly rather than substituting another tile.

## Source-object-first contract

The demo initially renders only the real KayKit `target.gltf` prop. FLAT/SPHERE/TORUS selection stays disabled until the source prop has rendered for multiple frames and the page reports:

`SOURCE OBJECT RENDERED · SURFACE PROOF UNLOCKED`

## Browser / Stage

Pending. No browser PASS or public Stage claim is made by this report yet.

## Next technical gate

Run the real browser proof against the persisted implementation. Only then publish a zero-install KFB Stage for Georg’s visual review.
