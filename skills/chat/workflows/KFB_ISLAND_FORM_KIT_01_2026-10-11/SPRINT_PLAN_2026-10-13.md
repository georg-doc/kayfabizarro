# Island Form Kit 01 · sprint plan 2026-10-13

Branch: `blender-mcp/island-form-kit-01-2026-10-11`, head `d6c4237` plus this commit.

Executor: Blender-Coworker. The build runs in cloud Blender (bpy 5.2.2 + scikit-image); Georg's Mac Blender is not needed until the look check.

## State

| Piece | Status | Source |
| --- | --- | --- |
| R3 island base | variant A chosen, TUNE. No roots. | `RETURN_IFK01_K1_R3.md` |
| Mesas M01 / M02 / M03 (round 3) | PASS, tune later | `VERDICT_GEORG_CC_R4_STEP1_R3.md` |
| Island J1 | PASS, tune later. Main problem: too layered. | `VERDICT_GEORG_CC_R4_STEP2_J1.md` |
| Embedding pattern | Georg's rule, noted for steering | `VERDICT_GEORG_CC_R4_STEP1_R3.md` |

## Open points

**A · Island underside (J1 and R3-A, same problem)**
1. Too layered: stacked strata rings, spinning-top shape.
2. Wanted: one organic, eroded mass. Lobes hang down, fractures run through the mass, and parts flow into each other. Strata survive at most as a faint colour hint and a few broken ledges.
3. Shallower body (about 0.6× the current depth). Two to three hanging lobes instead of one point at the bottom.
4. V-152 still holds: one cohesive mass, no separate rock balls.

**B · Mesa modules (feeds J1 directly)**
1. M01 / M02 too clean and symmetric. Add irregular raised parts.
2. M01 arch: a thick promontory grown out of the body, not a wall leaned against it.
3. Gullies: varied depth and spacing, alcoves, broken ledges.
4. Foot: a rock-coloured talus skirt between cliff and sand, and boulders at the toe of each debris cone.
5. M02: a wider stepped rock base with secondary fingers; it still reads as a box column.
6. Tops in rock colour, with sand only in hollows.

**C · J1 top**
1. The top reads like a dish with a raised rim.
2. The terrace reads as a pale slab with a straight edge.
3. Waffle artefact in the top view (decimation).
4. The road placeholder is one S-bend only; a longer serpentine is wanted. Track Core owns the final road.

**D · Light and material (shared by R3-A and J1)**
1. Raking low evening light, as in the mood references.
2. Sand: warmer, with AO and rock bleed at the contact.
3. Strata colour uneven in spacing.

## Order for 13.10.

| # | Step | Done when |
| --- | --- | --- |
| 1 | **Organic underside**: one SDF technique (domain-warped mass, hanging lobes, fracture planes, smooth blends; strata only as colour). Build it once and apply it to J1 and R3-A. | Side and front views show no continuous horizontal rings. 1 shell, open 0, non-manifold 0. Depth about 0.6× J1. |
| 2 | **Mesa tune** M01 / M02 (B1–B6) as `_R4` files. The round-3 files stay. | Front views are no longer mirror-symmetric. M02 has a base at least 2× the spire width. |
| 3 | **J1 round 2**: rebuild with steps 1 and 2. Fix C1–C3 and lengthen the road placeholder. Files `_R2`. | No pale slab, no rim lip, no waffle in the top view. Anchors are re-exported. |
| 4 | **R3-A tune** with the new underside, as `_R4` files. | Same checks as step 1. |
| 5 | **Light and material pass** (D) for R3-A and J1. | Board with raking light; sand and rock read apart without white lines. |
| 6 | **Critic**: blind, max 2 rounds per step. Then the board goes to Georg. | — |

If time is short, steps 1–3 come first; that is the J1 tune Georg asked for.

## Rules (unchanged)

- Additive only. New rounds get suffixes; nothing is overwritten.
- Never save Georg's .blend.
- Binaries go to GitHub via Chrome upload; check sizes and md5 after every write.
- Grown, not baked: no lids, no columns with a plate on top, no hex-plate thinking, no straight white lines.
- Structures stand in the terrain with sand and earth banked against them (embedding pattern).
- Report ambiguous points instead of inventing (V-148).

## Open for steering

- Register the embedding pattern as a standing rule.
- Is J2 (from the CC2 reference) the next island after the J1 tune, or does the kit stop at J1 for now?
