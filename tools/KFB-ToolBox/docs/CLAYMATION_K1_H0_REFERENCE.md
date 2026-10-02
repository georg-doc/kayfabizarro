# KFB Claymation · K1 + H0 binding reference

Status: **CURRENT SHARED VISUAL / CODE REFERENCE · SOURCE FIRST**  
Date: 2026-09-29  
Source arrival: `main@440709df3f1cbc9651a97c446e4321caef7e8a38`

## Front door

For any KFB task involving claymation / Knetwelt / Knetgummi / clay façades / houses / nature / trees / clay material / clay deformation, read this exact package before designing or implementing:

`tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/`

Read in this order:

1. `README.md`
2. `DOKU_FASSADEN.md`
3. `screenshots/`
4. `lab-clay/clay-catalog.v5.js`
5. `lab-brain/brain-world.v8.js`
6. `lab-clay/clay-soften.v1.js`
7. `lab-clay/clay-material.v8.js`
8. `lab-clay/clay-profiles.v2.js`
9. newer K2 references only after the K1/H0 source behavior is understood.

A loaded model URL, a generic clay shader, or a screenshot that merely looks “clay-like” is **not** proof that this source grammar was used.

## What K1/H0 actually proves

### Houses / façades

The source house path is:

`real KayKit house → clone → clayify() per mesh → softenGeometry() for eligible static geometry → seedGeometry() → clay material → foot/scale/place → optional later world deformation`.

The important source mechanism is **not just the shader**.

`clay-soften.v1.js` performs the tactile massing pre-pass:
- subdivision to bounded edge length;
- position welding without tearing UV/material seams;
- Taubin smoothing;
- low-frequency normal-direction lump deformation;
- position-based averaged normals;
- skinned meshes remain untouched.

Façade identity remains the **actual source model**:
- windows;
- ledges;
- awnings;
- doors;
- roof pieces;
- authored proportions.

There is no generic “replace the building with a clay box” step.

For later T4/world bending, the package explicitly records:
**clay each house individually first, then bend it.**

A world candidate that only bends raw donor geometry and adds a clay material is therefore not yet a faithful K1/H0 façade adaptation.

### Surface

K1/H0 themselves load `clay-material.v8` + `clay-relief.v2`.

The package also carries newer K2 material/tool references. For new stages, K2/v10 may be the current surface baseline, but that does **not** replace the K1/H0 preprocessing / source-identity grammar.

Material generation and massing preprocessing are separate layers.

### Nature / trees

K1 and H0 intentionally build foliage from **interpenetrating clay blobs / nested spheres**.

This is a different shadow topology from:
- one solid prop;
- one building shell;
- one character body.

If all overlapping crown blobs both cast and receive the shadow map, sibling blobs can create an artificial black contact band at their intersections. Large-scale GTAO can strengthen the same seam.

Therefore clay foliage has a specific rule:

- crown/foliage **casts** the world shadow;
- crown/foliage does **not receive sibling shadow-map self-shadow** by default;
- trunk / branches remain normal receivers;
- the clay material / direct lighting still models crown form;
- if per-object AO cannot exclude the internal intersection, prefer a single-surface or shadow-proxy crown before accepting a black seam;
- never “fix” this with a large global normalBias, because that reintroduces detached prop/building shadows.

This rule is additive to the shared fitted/snapped shadow-camera rule in:
`tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`.

## Source evidence to show before integration

The package contains named pixel references:

- `screenshots/01-d1-haeuser-nacht.png`
- `02-d1-haeuser-a.png`
- `03-d1-haeuser-b.png`
- `04-d1-v3e.png`
- `05-h0-totale.png`
- `06-h0-02.png`
- `07-h0-gelaende-nah.png`
- `08-h0-04.png`
- `09-h0v7-a.jpg`
- `10-h0v7-nah.jpg`
- `11-k2-material-vergleich.jpg`

For a design task, show the actual source object / source screenshot in isolation before adapting it.

For houses, a valid evidence chain is:

1. exact source house;
2. exact K1/H0 clayified/softened behavior;
3. any later bend/torsion;
4. integrated street/world.

Do not jump directly from 1 → 4 and call it K1/H0 claymation.

## Current correction to World Core R0A

The 2026-09-29 R0A visual donor is useful but is **not the K1/H0 canon**.

At the time of this source correction:
- it uses K2-style clay material/tooling;
- it bends donor buildings directly;
- it does not run the K1/H0 `clay-soften.v1` house pre-pass before bend;
- its initial shadow setup still used a fixed ±240 m box and `normalBias = 0.25`;
- its procedural leaf blobs both cast and receive shadows.

Those facts make R0A a candidate consumer to repair, not a source to copy back into K1/H0.

## Hard stop

If a Claude Design / Web / WSA brief says “use KFB claymation” but does not point to this package and cannot identify:
- `clay-soften.v1`;
- K1/H0 screenshots;
- house source identity;
- the surface-version distinction;
- the foliage self-shadow exception;

then the brief is incomplete. Do not improvise a replacement clay style.
