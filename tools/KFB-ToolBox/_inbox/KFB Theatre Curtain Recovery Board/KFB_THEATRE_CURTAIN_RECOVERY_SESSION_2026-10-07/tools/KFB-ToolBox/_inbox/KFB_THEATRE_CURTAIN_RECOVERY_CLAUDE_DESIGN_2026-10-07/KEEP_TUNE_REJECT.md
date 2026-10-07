# KEEP / TUNE / REJECT · after donor isolation

## KEEP (verbatim in candidate/kfb-curtain-core.js)
- two independent left/right panels, mirror-sign normal fix
- verlet topology (structural + two diagonals), spring kernel, vertex kernel body, triNoise3D wind on z
- quad-centroid render mesh with analytic per-quad normal in `positionNode`
- no tiled texture; colour + sheen + environment carry the fabric read
- 360 Hz sub-steps, deterministic open/close driven by one uniform family
- curtain presentation separate from host/world state

## TUNE (implemented, numbered as in the core header)
| ID | Tune | Donor value → candidate |
|---|---|---|
| T1 | build hanging + hidden warm-up | horizontal start → vertical start, 900-step warm-up |
| T2 | gathering pins | uniform slide 1.55 → pinX = wing + (1−u)(inner−wing)(1 − 0.8·open) |
| T3 | pinch pleats | none → z zig-zag, amp = ½·√((0.96·cloth)² − spacing²) |
| T4 | render rows | 30 of 40 → all 48 |
| T5 | cover integrity | opacity 0.85, coplanar → opaque, right panel +3.5 cm z, overlap 9 cm, masking border |
| T6 | weight / timing (r2 after Georg TUNE) | damp 0.99, wind 0.3, linear 1.4 s → damp 0.992, wind 0.12, momentum drive `MOTION` (pull ramp aMax 3.4/s², run vMax 1.05/s, end stop + 25 % rebound, ζ 0.42 open / 0.5 close); ≈1.2 s travel, hem trails and swings in. r1 smootherstep 2.6 s rejected: crept into the end |
| T10-r3 | rounder folds (Georg: looked like a folding screen) | 33 cols / pin every 4 / pin depth 100 % / gather 0.8 → 65 cols / pin every 8 / 12 % slack / pin depth 60 % / gather 0.72; hem weight (bottom 10 %, ×2.6 gravity, strongest at the leading edge) |
| HW-r3 | corner + footlights | gilt molding now ends inside the plinth (was a double step at the corner); plinth 0.8 × 0.38; footlight bulbs removed, warm front light kept |
| HW-r2 | plinths | protruded 7 cm into the opening, hem corners poked out in front → flush with the frame (r2-hem-corner-open.jpg) |
| T8 | impact | none → z impulse 0.00022 × hem weight, decay 0.97/step |
| T9 | material presets | #8c3f37 satin → oxblood velvet + motion-safe patina (see MATERIAL_LOOK_STUDY.md) |
| HW | stage hardware | none → arched proscenium, aged gilt molding, swag pelmet + fringe, gilt rail + rings, plank floor, footlights |
| — | dimensions | 1.15 × 1.9 per panel → 1.82 cloth (1.6 span) × 2.32 |

## QUARANTINED (smallest failing seams, evidence kept)
- **T7 tieback force** · pulls the lower inner edge toward the wing. Without self-collision the cloth folds over itself and stays tangled after closing (screenshots/quarantine-tieback-tangle-after-close.jpg). Code kept behind `tieback:false`. Not outcome-critical: the gathered open state already reads as a theatre drape.
- **Impact r0** · first impulse (0.0016) blew the cloth up like a sail (quarantine-impact-too-strong-r0.jpg). One repair pass → 0.00022 reads as a thump (use-08…10). Closed.

## REJECT
- flat CSS/SVG curtain, video curtain, rigid translating panels (D1)
- reinstating the v1 tiled fabric maps or any high-frequency normal map on moving cloth
- plaque/sign/wordmark as identity, splash-screen chrome, UI over the cloth
- a second simulation owner; the candidate is the donor kernel with tuned uniforms
