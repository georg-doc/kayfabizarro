# RETURN · WSA Stairs Tune R2

## What works now

The two front pedestals are visibly higher than the adjacent cheek-wall edge while remaining the same two source meshes. The staircase keeps all five meshes, eight steps, single landing and game-scale dimensions. New fixed-camera renders and direct R1/R2 comparisons are included.

## What remains deliberately unresolved

The procedural clay micro-surface is verified in Blender renders but is not baked into the GLB. The GLB carries the four explicit Family-A base colors. External visual acceptance remains pending.

## Owner and boundaries

- Production owner: WSA stairs branch.
- G4 files remain style guidance; no second geometry owner.
- No PR, merge, Stage, Live or Golden promotion.
- No new props or extra mesh families.

## Checks

- Clean GLB re-import: PASS.
- Mesh identities: 5/5 preserved.
- Triangle budget: 4,568 / 20,000.
- Pedestal hierarchy: PASS; left +0.84 lab, right +0.72 lab above wall at foot.
- Q1/Q3/Q4/Q5/Q6/Q7/Q9: PASS; Q2/Q8: not applicable with reason.
- Cameras/lights in GLB: 0/0.

## Exactly one next gate

External critic plus Georg review of the two direct before/after comparisons. If the form direction passes but the runtime surface is insufficient, open a separate bounded baked-material seam; do not remodel the five meshes again by default.
