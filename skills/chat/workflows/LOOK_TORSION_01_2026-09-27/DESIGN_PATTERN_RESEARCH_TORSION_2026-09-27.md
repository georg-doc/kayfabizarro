# LOOK-TORSION-01 · Elastic Torsion research addendum

Status: **FOURTH ISOLATED RECOVERY PROOF · CANDIDATE**  
Date: 2026-09-27  
Lineage: Production Architecture v3 W9 + PR #194 failure recovery/research.

This addendum does not reopen or patch frozen Hürth R2. It records the reusable form-language architecture demonstrated by LOOK-TORSION-01.

## 1. Source silhouette matters to proof quality

A deformation can be mathematically correct and still fail as visual evidence.

The first candidate used the accepted Kölner Dom donor. Its 157.38 m height gave excellent vertical leverage, but the twin towers are close enough to rotational symmetry that modest cumulative Y-axis torsion remained hard to read in a static A/B/C screenshot.

The second candidate therefore uses another **real cached Cologne OSM source**, `way/23574173`, 46.5 m high with an elongated 51.56 × 24.76 m footprint. Nothing about the torsion algorithm was changed to fake the result. The source shape simply exposes orientation change clearly.

**Reusable rule:** prove torsion on an asymmetric / elongated source first. A landmark with rotational symmetry can consume the same architecture later, but is a poor calibration object.

## 2. One height field, not stacked tricks

The proof reuses `tools/osm-city-lab/src/style/cartoon-city.js#deformPoint`.

For normalized height `t`:
- taper scales X/Z progressively;
- torsion rotates X/Z progressively by `twist * t`;
- bend uses a quadratic `t²` offset;
- lean uses a linear `t` offset;
- Y is preserved.

At `t = 0` every term collapses to the original source point. This makes the base mathematically anchored instead of visually re-snapped after deformation.

B and C use the same bend/lean/taper strengths. The only architectural delta in C is non-zero cumulative torsion.

## 3. Roof/body union is topology, not styling

PR #194 already established that a separately transformed roof/lid can break the silhouette even when the body deformation is otherwise correct.

The new proof therefore builds the source mass as **one indexed geometry**:
- 24 stacked footprint rings;
- wall quads connect consecutive rings;
- the roof cap triangulates the final ring;
- roof triangles reference the **same top-ring vertex indices** already used by the walls.

There is no second roof transform and no post-deformation seam repair. Roof and body pass through the same final field because they are literally one boundary.

## 4. Magnitude is a family, not a global default

Current evidence supports distinct ranges:

- **2.6°** — Cologne BuildingElastic ordinary-building maximum evidence;
- **9.5°** — proof hero default, deliberately below City GROTESQUE;
- **11°** — City GROTESQUE strong donor/reference;
- **13.2°** — current LandmarkElastic evidence (`1.2 × 11°`).

The proof intentionally exposes these as selectable references. It does **not** establish one universal twist value for every building.

A future consumer should map torsion magnitude from role/height/silhouette rather than hardcoding the strongest donor globally.

## 5. Camera and lighting are evidence controls

Camera film-offset skew is available only as an optional comparison and starts OFF. The browser report verifies that toggling it does not change the geometry revision.

Neutral material + simple light + shadows OFF is the first-look condition. This avoids repeating the Hürth R2 failure where shadow boundaries and surface layering polluted the read of the underlying form.

## 6. Architectural conclusion

The missing channel is now isolated:

`source mass → vertical segmentation → one anchored height field → taper + bend + lean + cumulative torsion → shared roof/body boundary`.

This is suitable to hand to BuildingElastic / LandmarkElastic consumers as a form-language mechanism. It is **not** permission to patch Hürth R2, change collisions, or promote a universal 11°/13.2° default.

Next decision belongs to the human Stage review: whether the visible A/B/C delta restores the intended bent/twisted 90s-cartoon read strongly enough to adopt the channel in the next clean city/world candidate.
