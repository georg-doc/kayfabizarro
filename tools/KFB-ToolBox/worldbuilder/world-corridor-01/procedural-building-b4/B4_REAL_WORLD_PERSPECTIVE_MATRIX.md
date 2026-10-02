# PROCEDURAL BUILDING B4 · REAL-WORLD PERSPECTIVE MATRIX

Status: **SOURCE-BOUND DESIGN GATE · REAL WORLDBUILDER**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Product question

Before increasing building deformation strength, determine how much of the recovered skewed/cartoon read already comes from the **proven camera/perspective layer**.

No building geometry changes in this gate.

## Real product surface

Use the stable real WorldBuilder:

`tools/KFB-ToolBox/worldbuilder/world-integration-01/WORLD_INTEGRATION_01_SOURCE.html?world=huerth-b1`

World chain stays:

`B1 siblings → Elastic V2 → FACADE_RULE v1 → stable WB2`

## Exact camera donor

Source:
`tools/osm-city-lab/src/viewer/app.js`

Blob:
`181edccab50c2b127b95370cc67da55e138b7a78`

### Neutral / oblique

Source `setCameraBasics()` + default frame:
- FOV **45**
- filmOffset **0**
- up **(0,1,0)**
- position:
  - x = cx + span × **0.62**
  - y = span × **0.52**
  - z = cz + span × **0.62**
- targetY **0**

### Cartoon lens/staging

Exact source:
- FOV **59**
- filmOffset **4.8**
- up **(.04,.9992,0)**
- position:
  - x = cx + span × **.46**
  - y = span × **.22**
  - z = cz + span × **.41**
- targetY **7**

### Grotesque lens/staging

Exact source:
- FOV **76**
- filmOffset **10.5**
- up **(.085,.9964,0)**
- position:
  - x = cx + span × **.31**
  - y = span × **.12**
  - z = cz + span × **.28**
- targetY **12**

## Local context span

Do not invent a review radius.

Use the existing ordinary-building semantic range:

`FACADE_RULE.roadMaxM = 40 m`

Therefore the comparison bounds are:
- ±40 m around the selected sibling centroid
- `span = 80 m`

This gives every camera mode the same real neighborhood context and derives the comparison scale from an already-owned semantic constant.

## Subjects

Use the three proven B1 siblings in the real `huerth-b1` WorldBuilder profile:

1. compact-simple
2. ordinary-notched
3. large-complex

## Matrix

Produce 9 real-product screenshots:

| | Neutral | Cartoon | Grotesque |
|---|---|---|---|
| compact-simple | N | C | G |
| ordinary-notched | N | C | G |
| large-complex | N | C | G |

The geometry, material, facade owner, lighting and world context must remain unchanged between columns.

Only camera/perspective parameters may change.

## What this matrix can decide

It can answer:

**Does the previously successful skewed/cartoon camera grammar recover enough of the intended Polly/Rocko character around the current Elastic V2 family, without stronger geometry deformation?**

## What it cannot decide

It does not accept:
- final material/Clay;
- a final universal camera;
- City Grotesque geometry;
- LOOK-TORSION calibration;
- LandmarkElastic strengths;
- Metropolis landmark/tower grammar.

## Source routing after review

If the real-product Grotesque/Cartoon lens is sufficient:
- keep V2 ordinary-building geometry;
- treat skewed perspective as a presentation mode / contextual camera grammar;
- do not add stronger deformation merely for style.

If geometry still reads too conservative:
- next source is the exact historical City Grotesque geometry preset:
  - verticalSteps 8
  - bend .105
  - lean .09
  - taper .22
  - twistDeg 11
  - stackSteps 7
  - stackShift .065
- use it as a **benchmark donor**, not an automatic production replacement.

LOOK-TORSION remains architecture-pass semantics only:
- cumulative height-dependent torsion;
- anchored base;
- shared roof/body final field;
- role/height-dependent magnitude;
- no universal accepted final angle.

LandmarkElastic remains role-specific and is not applied to ordinary low-rise B1 siblings in B4.

## Style grading

### Polly
Look for:
- deliberate skew / graphic spatial tension;
- perspective that feels designed rather than broken.

### Rocko
Look for:
- ordinary buildings gaining cartoon personality while remaining readable.

### Metropolis
Low-rise B1 should remain background fabric.
The camera may increase urban drama, but B4 must not make every house a monument.

## Exactly one gate

**B4 REAL-WORLD PERSPECTIVE MATRIX**

No geometry changes.
No material changes.
No second runtime owner.
