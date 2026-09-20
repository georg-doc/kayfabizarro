# KFB ToolBox · KayKit Character Compatibility v0 · TEST REPORT

**Date:** 2026-09-20  
**Branch:** `chatgpt-web/toolbox-kaykit-character-compat-2026-09-20`  
**Runtime head tested:** `0fd958f6c35c1b6d74abac2dfc37340eaec6c0c5`  
**Status:** REPOSITORY CHECKS PASS · PUBLIC BROWSER PROOF PENDING

## Result

**28 / 28 repository checks PASS**

No human visual acceptance is claimed by this report.

## A · Contract / HTML / JS · 21 / 21 PASS

Exact branch blobs:

- Stage HTML: `3958370b7695a3b3a144c6d916c3878dc89ce779`
- Stage app: `2dc2d2bc1529c12f9f3c5a386296abb9b43fe2ad`
- workflow source matrix: `bc57eba1dabb162521a2c8d433e73ee2ba1df34a`
- Stage mirror matrix: `bc57eba1dabb162521a2c8d433e73ee2ba1df34a`

Checks:

1. source-matrix schema exact;
2. `noPlaceholderPolicy=true`;
3. seven declared source rows;
4. exactly six rows have renderable real asset URLs;
5. Rubber/Eraser remains `SOURCE_REQUIRED` with no URL;
6. Bath legacy config records `cut=false`;
7. Rover legacy config records `cut=true`;
8. Stage source matrix is the exact same Git blob as workflow source matrix;
9. HTML title marker exists;
10. HTML source list exists;
11. HTML 3D stage exists;
12. HTML loads `./app.mjs`;
13. HTML exposes the SOURCE REQUIRED state;
14. HTML links the existing KayKit Motion Lab proof;
15. app imports GLTFLoader;
16. app enforces `noPlaceholderPolicy`;
17. app has explicit `LOAD FAILED — NO FALLBACK`;
18. app has explicit `SOURCE REQUIRED`;
19. app loads exactly `row.assetUrl`;
20. app reads the Stage-local `./SOURCE_MATRIX.json`;
21. app parses successfully after ESM import declarations are removed for syntax-only compilation.

## B · text glTF external dependencies · 4 / 4 PASS

### Bath

Source:
`media/3D_Assets/Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf`

Source blob:
`9e9fed8db5e347611185a2ece7af661d7c20b10a`

Resolved dependencies:

- `bath.bin` → `8ea85088096195b45567d186734e3417666c59ba`
- `tiny_treats_texture_1.png` → `9998bd6d92265fe6c9a9ce43928e85f9c815ca7a`

### Rover Round

Source:
`media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf`

Source blob:
`83c2556726c604e517698c2b5c37bc96ccbbc648`

No external buffer/image URI is declared by the source.

### Pencil A long

Source:
`media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf`

Source blob:
`0b634a084bbbf6459b26292d11da8a0d39396549`

Resolved dependencies:

- `pencil_A_long.bin` → `2a6be8ee5242ccbb1aebe54c2ac64a97bc083b7a`
- `tools_bits_texture.png` → `58cf2b3fa0eabf381a66f8f1c99b8313317f4007`

## C · binary donor presence · 3 / 3 PASS

Directory metadata proves the exact binary source objects exist on `main`:

- GothGirl.glb → `b56f67e4ddb7db95ff54fef526148a49289f3915` · 323724 bytes
- Driver.glb → `1a25cb515a7f0332df3bc2d1909d7383f06b42fc` · 196408 bytes
- Paper Plane by Anonymous - 5X4zRUBadun.glb → `3be9c908b5824960e912d7518b3e06cc8bc4375b` · 3216 bytes

## D · legacy measured vehicle facts checked

Bath legacy rig config:
`ec392d1fcdd8d1f2ac01ee751185f56f2a753753`

Confirmed facts used by KCC:

- `cut=false`
- `base=false`
- `cockpit=false`
- hips are measured 0.355 below the configured waterline

Rover legacy rig config:
`3978516dd20dc434d69582ca3ce47fb0757b9aaf`

Confirmed facts used by KCC:

- `cut=true`
- `base=true`
- `cockpit=true`

These facts are evidence for the migration direction only. They are not a VehicleMount implementation pass.

## E · environment note

A direct local-container fetch of raw GitHub files could not run because that isolated container had no DNS resolution for `raw.githubusercontent.com`.

This is recorded as an environment limitation, not as a product failure. Exact files were instead fetched through the connected GitHub repository API and validated there.

## F · still open

Not tested yet:

- local headless WebGL rendering of all six real donor rows;
- exact public Cloudflare Stage revision;
- public HTTP/resource/page-console cleanliness;
- screenshot evidence;
- human visual source-identification gate.

Those checks belong to the Stage publication/proof checkpoint. Do not label this slice PUBLIC PASS from this report alone.
