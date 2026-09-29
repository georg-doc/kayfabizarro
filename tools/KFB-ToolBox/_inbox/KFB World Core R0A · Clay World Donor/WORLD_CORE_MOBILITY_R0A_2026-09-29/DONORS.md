# DONORS · reused, not rebuilt · R0A

## Asset donors (pin `georg-doc/kayfabizarro@378b209355b13304e3cff656ec0806ca5b89df28`)

Each one is shown alone on the donor bench (camera `donor:<id>`, source left, clay right) before it appears in the tile. Measured sizes are after scale.

| id | file | scale | size m (x·y·z) | tris | use |
|---|---|---|---|---|---|
| kk-A | KayKit City Builder Bits 1.0 · building_A_withoutBase.gltf | 5.0 | 6.0 · 7.8 · 7.3 | 435 | B04 |
| kk-C | building_C_withoutBase.gltf | 5.0 | 6.0 · 11.3 · 6.5 | 666 | B03 |
| kk-D | building_D_withoutBase.gltf | 5.0 | 8.0 · 11.3 · 6.5 | 848 | B07 slope |
| kk-E | building_E_withoutBase.gltf | 5.0 | 10.0 · 11.3 · 7.3 | 950 | B01 |
| kk-F | building_F_withoutBase.gltf | 5.0 | 10.0 · 11.3 · 6.5 | 1097 | B06 |
| kk-G | building_G_withoutBase.gltf | 5.0 | 10.0 · 11.3 · 7.3 | 1053 | B05 |
| kk-H | building_H_withoutBase.gltf | 5.0 | 10.0 · 14.8 · 6.5 | 1333 | B02 landmark |
| ks-c | Kenney City Kit Suburban 2.0 · building-type-c.glb | 6.6 | 8.5 · 6.8 · 6.8 | 1196 | B09 slope |
| tt-house | Tiny Treats Homely House · house.gltf | 1.3 | 7.7 · 8.5 · 8.5 | 3759 | B08 hill |
| kk-streetlight | streetlight.gltf | 5.95 | 1.6 · 5.7 · 0.4 | 176 | 8× |
| kk-hydrant | firehydrant.gltf | 3.49 | 0.5 · 0.8 · 0.5 | 180 | 2× |
| kk-taxi | car_taxi.gltf | 4.1 | 1.7 · 1.8 · 3.9 | 1256 | socket car-A |
| tt-bench | Pretty Park · bench.gltf | 0.85 | – | 396 | plaza |
| tt-trashcan | trashcan.gltf | 0.8 | – | 504 | plaza |
| tt-tree | tree_large.gltf | 1.9 | 5.2 · 9.5 · 5.1 | 500 | 5× |
| tt-bush | bush_large.gltf | 1.7 | 2.6 · 1.3 · 2.4 | 312 | 2× |
| tt-fence / tt-post | Homely House · fence_straight_long / fence_post | 1.0 | 2.5 · 1.3 · 0.3 | 200 / 56 | Hausberg fence |
| tt-mailbox | mailbox.gltf | 0.65 | – | 508 | gate |

Scale changes against T4 (said, not hidden): KayKit buildings 4.1 → 5.0 (read as toy boxes next to the 14.4 m TD03 road at 4.1); bench/trashcan/fence/mailbox reduced to human scale (T4 values were tuned to kart scale, a 1.85 m figure made them 2–3 m tall).

## Code and look donors

| donor | from | used for |
|---|---|---|
| `lab-clay/clay-material.v10.js` + `clay-relief.v4.js` + `clay-toolmix.v1.js` + `clay-profiles.v2.js` | K2 (accepted base 28.09.) | every material, hand scale k = 3 |
| `lab-clay/clay-relief.v2.js` | H0 | legacy stroke map for road, water, markings |
| `sideProfile`, lips, road strip, markings, `mkKart`, tree/bush/rock/cloud grammar | `lab-track/track-look.v5.js` (T4) | ported into `clay-world.r0a.js`, same numbers |
| `patchify`, `bend`, `place`, `geoOf` pattern | `lab-track/transition-atlas.v1.js` (T4) | Knetflecken on terrain and strang; facade rhythm |
| `KFB_BLEND_GLSL` | `lab-track/road-markings.m1.js` | Knetflecken track → street on the road |
| M2 colours and rules | `lab-track/road-markings.m2.json` | city markings |
| `makeClayVFX` + `clay-particle-profiles.v1.json` | T4 VFX | roll / landing / biome cues |
| TD03 stream | `lab-track/data/td03.stream.json` | the T4 piece, identity transform |
| TinySkies DAY / EVENING gradients | `travel/wip/travel_globe_wsa/globe-v13/sky-presets.js` (1:1 from TinySkies SkyPresets.ts) | sky dome |
| H0 how-to §4 light table, §5 Kugel-in-Kugel, §7 bridges/ridges idea | `KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/HOWTO_…md` | light, clouds, trees, track on a ridge |

## New in R0A (not taken from a donor)

- Terrain heightfield from the recipe: base wave, hills, T4 ridge with cut/fill and ridge noses at the air gap, creek carve, city flattening, building pads and slope cuts, edge fade.
- Knetspuren in the mesh (Georg 29.09.): Worley stamps thumb / spatula / notch / pinch, power-law sizes, class scales, protection by traversal masks, orientation along contours and seams.
- Knetwulst seam around every building instead of a plate.
- City road strips on the T4 road material, sidewalk slabs, kerb stones, footbridge, portal, tunnel mouth, traversal-mask overlay, donor bench.

## Unresolved, runtime-only (R0B)

1. Stride-synchronised locomotion (walker, clip timing, gait governor)
2. Walk / Auto / Flight state machine and transitions (one movement writer per mode)
3. [I] enter/exit at `car-A` (taxi) and `car-B` (clay kart); unify keys on [I]
4. Collisions: terrain heightfield incl. mesh traces, bent buildings, props, strang, kerbs, fence, bridge
5. Contact shadows and ground contact for figure and vehicles
6. Vehicle physics on the T4 piece incl. kicker, air, landing, off-road on `OR-sued` / `OR-nord`
7. Performance: instancing of kerbs/slabs, terrain chunks/LOD, shadow budget, K2 cost, boot time
8. TinySkies runtime (day/night, 7-light rig) instead of the static gradient; fingerprint map delivery
9. Browser tests (desktop, mobile)
