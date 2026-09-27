# NEXT GATE · WB-ZONE-CROP-PARITY-01

Status: **DIAGNOSTIC ONLY · NO HUMAN GATE · NO RENDERER**

## Question

What exact deterministic selection rule produced the frozen Cologne fixture's **369 building ids** from normalized blob
`14d3f09da6e14fb7f5dc9478f78be9f876bffab9`
and crop
`x -620..180 · z -300..300`?

## Required test

Use a repository-native Node script on a fresh diagnostic branch. Load:
- pinned baked `normalized.json`;
- frozen `cologne-dom-crop-v0.json`.

Print the exact ID set delta for:
1. vertex-average centre;
2. polygon-area centroid;
3. bbox centre;
4. strict vs inclusive crop edges;
5. explicit named rounding/epsilon variants only where a differing centre lies at an edge.

For every missing/extra id print:
- id;
- all three centres;
- bbox;
- distance to each crop boundary;
- OSM building kind/name where present.

## PASS

Exactly one documented deterministic rule reproduces the **same 369-id set** as the frozen fixture.

Count-only equality is insufficient.

## After PASS

Restart WB-ZONE-SEAM-01 from Draft PR #252, change only the crop selector, then run the existing seam/static/browser workflow.

No new Stage, UI or Georg review is part of this diagnostic.
