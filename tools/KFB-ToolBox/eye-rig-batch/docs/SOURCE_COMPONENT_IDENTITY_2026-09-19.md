# GothGirl Source Component Identity · 2026-09-19

Status: **SOURCE IDENTITY RESOLVED · EYE PROFILE STILL AUTO_CANDIDATE**  
Owner: KFB ToolBox / Rigging  
Actor source: `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`  
Pinned revision: `5650b6c54d8789b20ea80abe857688173d506d3b`  
Blob: `b56f67e4ddb7db95ff54fef526148a49289f3915`

## Finding

The current source geometry disproves the historical `6 + 7 = eyes` interpretation.

Using the exact `faceShells()` rule — positions welded at 1e-3, components ordered by triangle order — the current `GothGirl_Head` has exactly 12 components. Components 6/7/8 sit laterally at ear depth (z around 0) and cannot be the visible frontal eyes. The frontal symmetric eye pair is 2/3.

| Component | Identity | Triangles | Key geometry evidence |
|---:|---|---:|---|
| 0 | head / face shell | 218 | central full face/head shell |
| 1 | nose | 82 | centered x≈0, most forward z up to 0.525 |
| 2 | eye · x+ | 69 | frontal, x 0.133…0.257, y 1.543…1.670, z 0.336…0.444 |
| 3 | eye · x− | 69 | exact mirrored frontal counterpart of component 2 |
| 4 | ear · x+ | 66 | lateral x 0.367…0.543, near side depth z −0.082…0.046 |
| 5 | ear · x− | 66 | mirrored counterpart of component 4 |
| 6 | side accessory · x− | 24 | far lateral x −0.595…−0.512, near ear depth |
| 7 | side accessory · x+ lower | 24 | far lateral x 0.496…0.592, near ear depth |
| 8 | side accessory · x+ upper | 24 | far lateral x 0.495…0.579, near ear depth |
| 9 | hair | 832 | largest shell, spans crown/back and most head volume |
| 10 | brow · x− | 72 | frontal, above eye pair at y 1.689…1.762 |
| 11 | brow · x+ | 72 | mirrored counterpart of component 10 |

## Decision

- Current source-eye cleanup uses **components 2 + 3**.
- Components 6/7/8 remain preserved.
- The cleanup now includes a fail-closed GothGirl identity signature: 12 components, 2/3 each 69 triangles, mirrored frontal bounds.
- No EyeRig anchor value is promoted by this decision.
- The old measured `6 + 7` baseline remains archived diagnostic evidence only.
- Lash sub-identity is not promoted: it may be part of the eye assembly or texture and remains outside v0 cleanup.

## Evidence

- Static projections: [source-components-0-11.html](source-components-0-11.html)
- Original package artwork exists at `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/artwork.png` as a secondary visual crosscheck.
- Primary truth for this decision is the pinned GLB geometry above.

## Next gate

Recompute the measured source baseline from the corrected eye pair 2/3, expose it only as a reversible candidate, and browser-compare source / cleaned / EyeRig. Do not expand the Medium batch until that corrected single-actor proof is visually accepted.
