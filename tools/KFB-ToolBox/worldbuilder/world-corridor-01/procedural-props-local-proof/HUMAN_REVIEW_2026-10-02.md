# HUMAN REVIEW · 2026-10-02

Reviewer: Georg
Surface: `KFB_WC1_P0B_LOCAL_REVIEW.html`
Runtime pin: `94443824e6b13f38c611defd06dacedd7c6d0faa`

## Human result

**SHAPE / PROCEDURAL STYLE: PROCEED**

Georg reports that the procedural look is visually promising and specifically calls the trees very cool.

**MATERIAL / TEXTURE: TUNE**

The current shared texture treatment makes the parts look:
- generic;
- repetitive;
- somewhat buggy.

This review does **not** reject the procedural geometry. It separates the good generated form language from the current Clay002 treatment.

## Source diagnosis

Current Global Clay Lite uses one repeated 512² donor texture with object-space triplanar sampling.

In the P0B instanced families, `claySeed` is currently a geometry attribute set once per family geometry, while instance transform/colour vary through `InstancedMesh`. Therefore same-family instances share the same Clay coordinate phase. The Clay varying position/normal are also sourced from local geometry before instance transform.

This makes repeated material patterning a plausible source-level explanation for the human report.

## Local JSON

Exact returned JSON is persisted beside this review.

Important:
- Apple M1 Max / WebGL2;
- props add +6 calls / +44,656 triangles;
- +0 geometries / +0 textures / +0 programs;
- props-on vs props-off mean frame result is negative delta (-23.611 ms), therefore the props A/B frame delta is not treated as a stable cost estimate from this sample;
- no runtime errors.

## Decision

Do not redesign the trees or procedural geometry from this feedback.

Exactly one next gate:
**MATERIAL ISOLATION ON THE SAME SCENE** — Clay002 vs Derek RGB vs Clay Off/neutral, same camera and same P0B geometry. Determine whether the visible defect is Clay002-specific or requires instance-aware material-coordinate variation.
