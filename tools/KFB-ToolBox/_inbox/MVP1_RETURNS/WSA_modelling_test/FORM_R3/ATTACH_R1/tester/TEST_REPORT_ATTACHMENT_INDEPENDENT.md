# Independent R3 attachment geometric test · 2026-10-11

Tester /root/r3_attach_tester performed fresh clean Blender GLB imports against locked combined SHA256 `239a2a559ce772e7928c6eb666f5322d470c4ef9ba20843f53d942569a370c50`. Prior R3 PASS was not reused. GitHub R3 Return and brief (brief blob e16674ac95478f84be4e9b49d5fcd5c2aeb4911d) were read.

**GEOMETRIC_ATTACHMENT PASS, with stated finite-sampling scope. Runtime locomotion NOT_RUN.** Independent critic/human style judgement remains separate. No production file mutated by Tester.

## Preservation and export

Frozen isolated SHA256 remains `df59928f0d45cbd0ea6669cd78be7adc3850a766000e537c0ab5d09c73cb622c`. All45 retained stair mesh world-space unique vertex-position sets and triangle-position multisets are exactly equal at1e-5 after combined export/reimport. Combined export changes vertex duplication/index ordering because glTF splits material/UV seams; raw vertex-index equality is therefore not claimed.

GLB2 clean imports:46mesh objects, terrain7096triangles, combined20132triangles; every part<=20k (stair max380). No cameras. Terrain has exactly one connected component with3534positions after1e-5 seam welding, underside-.200000003lab. The underside is an anchored placement datum, not evidence of receiving-world integration, which is not part of this slice.

## Walk and exit

21609 downward samples at.01lab intervals on9transverse lines, including foot-surface endpoints±5.46lab (=10.92lab=3H), report no incremental rise>.68lab or abrupt drop>.0728lab. Eight step transitions remain. Earth exit at y>=17.97 is5.08lab; greatest measured absolute height difference from landing5.08 is.00000962lab, below.02H=.0728lab. The preceding arris transition is intentionally included in raw records but is not confused with the earth exit plateau.

Capsule-style body radius.18H=.6552lab was tested on center lines x=-4.8,-4,0,4,4.8, with three body elevations and eight rim offsets. 288000 continuous world-BVH segment rays between adjacent.01lab path positions yielded zero collisions; sampled radial body probes in the same safe center band also yielded zero. The maneuver approximation lifts before advancing across a step. Foot-surface width3H is distinct from body-center width: capsule centers at±5.46 naturally extend outside that surface and collide with walls/pillars; those endpoint collisions are preserved rather than called failures of3Hfootwidth. This is a continuous segment sweep at finitely sampled capsule offsets, not analytic full-volume collision proof or an actual locomotion controller.

Minor soil intersection into flat Tread01 at its rear transition y≈1.61–1.63 reaches.009933lab maximum; below.0728lab tolerance, recorded explicitly. Rounded landing arris overlap does not bury the flat exit deck.

## Actual pillar footing

All sampled bottom-band vertices of both foot meshes have actual terrain below/through them: left signed bottom-to-soil intervals-.613 to-.114lab; right-.6125 to-.1148lab. Actual nearest surface contacts left.007413/right.000596lab, with220/187foot vertices within.0728lab. Thus both real foot volumes are embedded. Shafts transfer support through the retained foot architecture; direct shaft-to-soil contact is not claimed (minimum nearest distances.1391/.1480lab; shaft bottom gaps at least.1456/.1551lab). Caps remain above soil. This distinguishes footing embedding from an invented direct soil contact to every pillar zone.

## Source evidence

Both actual hill_single_A.gltf/bin SHA256s independently match the documented original source bytes. Source isolation render viewed, followed by foot-left and landing-connection images; the source object is a genuine tiered KayKit hill. Adaptation is explicitly **ADAPTED_HILL**, source footprint/topology subdivided, upper envelope reshaped and bottom anchored. Neither affine-source equality nor original unmodified terrain is claimed. Source palette/visual KFB quality is critic scope.

Raw evidence: FINAL_ATTACHMENT.json, FINAL_SOURCE_EXPORT.json, verify_attachment.py. DIAGNOSTIC_ATTACHMENT.json is prototype history and not final acceptance evidence. No runtime, receiving-world, Golden, Live, Site or Stage acceptance claimed.
