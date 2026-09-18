# S1b · Simplified / Cartoon Massing

**Date:** 2026-09-18  
**Status:** IMPLEMENTATION · browser proof pending at this checkpoint

## Decision

The OSM City viewer now has two presentation modes over the same normalized source geometry:

```text
?city=ehrenfeld-v0&look=clean
?city=ehrenfeld-v0&look=cartoon

?city=huerth-v0&look=clean
?city=huerth-v0&look=cartoon
```

### Clean Massing

- exact normalized OSM footprint;
- one simple extrusion using the existing OSM/fallback height;
- flat top cap from the extrusion itself;
- no separate roof mesh;
- no facade decoration.

This is the anatomy/debug baseline.

### Cartoon Massing

Starts from the same footprint and height, then applies a deliberately narrow KFB presentation transform:

- mild lean;
- mild bend;
- top taper;
- very small twist;
- ground remains anchored;
- deterministic variation by OSM identity;
- a few irregular window/material-code blocks on suitable facade edges.

This is presentation only. S2 collision/export geometry stays undeformed.

## Donor lineage

The user pointed back to the older VoxelWorld Cartoon-Verbieger. Read-only Dropbox inspection found:

`/CLAUDE/KFB VoxelWorld/KFB Voxel + Assets Worldbuilding + Cartoon Deformer + Zone Registry v3/kfb-cut-v4/kfb-cartoon-deform.js`

The same donor is already preserved in GitHub at:

`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/kfb-cartoon-deform.js`

Useful rules reused:

1. object-normalized deformation, not arbitrary world-unit noise;
2. ground anchor with stronger change toward the top;
3. deterministic per-instance seed.

The old prop defaults were intentionally much stronger. City uses smaller limits because hundreds of neighbouring buildings need one coherent visual grammar rather than every object becoming a hero deformation.

## Road artifact correction

Previous S1 road geometry emitted one independent quad per centerline segment.

That created two problems:

- gaps / overlaps at bends;
- the wider pale sidewalk band underneath could peek through as bright triangles/stripes and shimmer as the camera moved.

S1b uses one continuous joined strip per centerline with a clamped miter at bends.

Layer spacing is also explicit:

- base ground: below all map overlays;
- landuse above base ground;
- sidewalk above landuse;
- road clearly above sidewalk;
- water line separately elevated.

This is preferable to hiding the artifact with a texture or post effect.

## Window material codes

Cartoon windows are not an architectural facade system.

They intentionally act like comic material/readability marks:

- no floor grid;
- no regular rows;
- few windows per suitable facade;
- deterministic but irregular horizontal/vertical placement;
- small box depth for a readable frame/relief;
- limited dark/teal/warm palette.

Later facade systems may replace or enrich them. Their current purpose is to tell the eye “building” without turning every OSM footprint into an art-production task.

## Camera

S1b keeps TOP / OBLIQUE / STREET and adds a first CARTOON VIEW:

- wider FOV;
- lower staging angle;
- small framing offset;
- very restrained Dutch/up skew.

Camera exaggeration stays separate from geometry deformation, matching the existing ToolBox direction.

## Acceptance

### Automated

For both Ehrenfeld and Hürth, and for both clean/cartoon modes:

- browser/WebGL boots;
- expected OSM building/road counts are present;
- separate roof-mesh count is exactly 0;
- S2 geometry is reported undeformed;
- road strip mode is `joined-miter`;
- explicit vertical map-layer separation exists;
- clean mode has 0 window codes;
- cartoon mode has >0 deterministic window codes;
- no page/console errors.

### Georg visual gate

Check:

1. road shimmer/bright triangle artifacts are gone or clearly reduced;
2. Clean Massing reads as useful OSM anatomy;
3. Cartoon Massing feels deliberately crooked, not random/noisy;
4. Ehrenfeld still reads denser than Hürth;
5. windows read as comic shorthand rather than broken facade rows;
6. deformation does not make ordinary streets implausibly narrow.

If cartoon intensity is too strong, tune one shared limit set. Do not add per-building manual exceptions before the shared grammar is accepted.
