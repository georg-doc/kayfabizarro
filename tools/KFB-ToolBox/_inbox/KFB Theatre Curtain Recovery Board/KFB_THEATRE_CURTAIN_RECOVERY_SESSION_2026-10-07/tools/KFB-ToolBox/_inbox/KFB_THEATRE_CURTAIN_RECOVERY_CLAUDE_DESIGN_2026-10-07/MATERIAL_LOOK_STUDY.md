# MATERIAL_LOOK_STUDY · motion-safe old-theatre velvet

Frames: screenshots/mat-* (detail camera, same light) and cand-02…04 / mat-08…10 (moving).

| Preset | Cloth | Hardware age | Result |
|---|---|---|---|
| donor | #8c3f37, roughness 1, sheen #fff 1.0 / 0.5, opacity 0.85 | 0.2 | satin/silk read, see-through (mat-01, mat-03) |
| A · donor-clean aged velvet | #4a0b11, roughness 0.86, sheen #c4545c 1.0 / 0.34, opaque | 0.35 | deep oxblood, folds carried by sheen (mat-04) |
| B · motion-safe macro patina | A + low-frequency colour/roughness variation | 0.35 | uneven sun-fade, darker hem, shaded top (mat-05) |
| C · clean cloth + aged hardware | A | 1.0 | age carried by frame/gilt/floor (mat-06) |
| **P · preferred** | **B** | **1.0** | selected (mat-07, cand-*) |

## Why B is motion-safe
- Patina is evaluated in **cloth parameter space** (`clothUV` = rest-grid coordinate per render quad), so it moves with the fabric. World-space noise on cloth would crawl; it is used only on static hardware.
- Frequencies: noise at (2.6, 1.35) and (6.1, 2.9) cycles per panel, i.e. 2–6 features across 1.8 m. No tiling, no normal perturbation.
- Normal stays the donor's analytic per-quad normal. Nothing in the shading samples a texture.
- Sequential moving frames at 6-frame spacing (cand-02/03/04 opening, mat-08/09/10 impact, use-08/09/10 impact): patina blotches stay attached to the same folds; no stripes or crawl observed.

## Recipe (for the runtime owner)
```
base #4a0b11 · faded #84352c · dust #3b2724
n = 0.72·noise(uv·(2.6,1.35), seed) + 0.28·noise(uv·(6.1,2.9), seed+3.7)   // 0..1, seed per panel
fade = smoothstep(0.5, 0.85, n)·patina
hem  = smoothstep(0.8, 1.0, uv.y)·patina      // uv.y = 0 top, 1 hem
top  = (1 − smoothstep(0, 0.14, uv.y))·patina
color = mix(mix(base, faded, 0.78·fade), dust, 0.5·hem) · (1 − 0.4·top)
roughness = 0.86 + 0.08·fade + 0.1·hem ; sheen 1.0, sheenColor #c4545c, sheenRoughness 0.34
```
Hardware: world-space noise on static meshes only; gilt tarnish mixes #9a7c4c→#3a2e1e, metalness 0.7→0.3, roughness 0.32→0.7.

## Not done / optional
- no external velvet texture (no repo-backed, licensed source passes brief §7)
- the old-theatre reference's heavy grime and torn hem are not reproduced; stronger hem wear would need geometry, not a map
