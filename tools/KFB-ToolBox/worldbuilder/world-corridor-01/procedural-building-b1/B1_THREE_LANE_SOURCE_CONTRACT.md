# B1 · THREE-LANE SIBLING SOURCE CONTRACT

Status: **SOURCE-BOUND · READY FOR ISOLATION IMPLEMENTATION**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Rule

Every B1 sibling combines two real members of the accepted 22-building Hürth V2 corpus:

- **topology donor** → exact footprint vertex graph / roof class family;
- **envelope donor** → observed area / aspect / height / roof-height target.

No synthetic corner insertion/removal.

Scaling happens around the topology donor centroid in its local principal-axis frame.

B0/V2 remains the only body/roof deformation owner.

## Lane A · compact/simple

Topology donor:
- `way/371401529`
- 4 corners
- flat
- 60.72 m²
- aspect 1.385
- height 10.13 m

Envelope donor:
- `way/371401477`
- flat
- 71.84 m²
- aspect 1.717
- height 12.23 m

Sibling:
- preserve 4-corner topology;
- preserve flat roof role;
- target the observed envelope donor area/aspect/height;
- flat roof height remains source-observed 0.35 m.

## Lane B · ordinary/notched

Topology donor:
- `way/371401481`
- 7 corners
- hipped
- 115.76 m²
- aspect 1.532
- height 12.60 m

Envelope donor:
- `way/371401497`
- hipped
- 154.17 m²
- aspect 1.210
- height 12.56 m
- roof height 1.40 m

Sibling:
- preserve 7-corner topology;
- preserve hipped role;
- target observed envelope area/aspect/height/roof-height.

## Lane C · large/complex

Topology donor:
- `way/371401488`
- 9 corners
- flat
- 157.21 m²
- aspect 1.091
- height 12.46 m

Envelope donor:
- `way/371401495`
- flat
- 210.86 m²
- aspect 1.128
- height 12.60 m

Sibling:
- preserve 9-corner topology;
- preserve flat role;
- target observed envelope area/aspect/height;
- flat roof height remains 0.35 m.

## Scaling mechanism

Use a deterministic 2D principal-axis frame from the topology donor footprint.

1. Compute footprint centroid.
2. Compute 2D covariance.
3. Use principal eigenvector as long axis, perpendicular vector as short axis.
4. Measure donor projected long/short extents.
5. Derive target long/short extents from the **envelope donor's measured bbox aspect and area**:
   - targetLong = sqrt(targetArea × targetAspect)
   - targetShort = sqrt(targetArea / targetAspect)
6. Scale donor coordinates in principal-axis space by:
   - longScale = targetLong / donorLong
   - shortScale = targetShort / donorShort
7. Transform back.
8. Preserve exact vertex count/order.

This uses source-observed envelope metrics but does not copy the target donor topology.

## Height / roof

- sibling height = envelope donor source height;
- sibling roof type = topology donor roof type, which is the same role as envelope donor in all three lanes;
- sibling roof height = envelope donor source roof height.

No new roof role.

## Elastic deformation

Sibling id must be deterministic and distinct from both donors, so V2 may create its normal per-building local seed while still using the same coherent block field.

B1 does **not** expose bend/lean/twist sliders.

## Façade

Owner stays:
`kfb-facade-rule-v1`.

Isolation proof records the owner but does not clone the implementation.

## Done when

For all three lanes machine evidence proves:
- topology donor exists in pinned 22 corpus;
- envelope donor exists in pinned 22 corpus;
- corner count unchanged;
- sibling area reaches target within bounded tolerance;
- sibling aspect reaches target within bounded tolerance;
- sibling height/roof/roof-height match source envelope contract;
- Elastic V2 body/roof build succeeds;
- base remains anchored;
- no material decision;
- one renderer;
- no WC1 integration.

Visual evidence must show per lane:
1. topology donor V2;
2. synthetic sibling V2;
3. envelope donor V2;

as three separate stages.
