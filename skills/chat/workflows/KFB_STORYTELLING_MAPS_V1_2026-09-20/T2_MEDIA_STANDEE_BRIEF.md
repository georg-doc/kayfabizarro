# T2 Brief · Exact KayKit Media Standee

Status: **AUTHORIZED NEXT SLICE**
Date: 2026-09-20
Branch: `stage/storytelling-maps-v1-t2-media-standee-2026-09-20`
Parent gate: T1 PUBLIC_VERIFIED and Georg explicitly requested continuation to T2.

## Goal

Build the first adapted Storytelling Maps standee while preserving the proven KayKit donor geometry.

Two A/B presentations:

- **Portrait**
- **Landscape**

Both use:

- exact `playerstand_red.gltf`;
- exact `playercard_knight_red.gltf`;
- original KayKit frame/board material;
- only the `red_knight` front-art material replaced.

No political media.

## Diagnostic media

T2 may use a clearly labeled **calibration media texture** generated at runtime.

It is not product content and not a substitute card model.

Purpose:
- prove that only the front media surface changes;
- prove crop/orientation behavior;
- prove landscape rotation/remap;
- keep provenance simple before Odyssey/public-domain ingestion.

## Portrait

- original card orientation;
- media texture upright;
- card seated into exact KayKit stand.

## Landscape

- same exact card geometry rotated 90°;
- media content counter-rotated/remapped so it reads upright;
- recompute ground/slot placement from measured bounds;
- same exact KayKit stand.

## Visible evidence

Each panel must report:

- source asset paths;
- original material names discovered;
- frame material preserved;
- art material replaced;
- orientation;
- current FRONT mode: MEDIA / ORIGINAL.

Controls:
- `MEDIA / ORIGINAL`;
- reset view.

## No scope creep

No:
- map integration;
- dice collision;
- standee hopping;
- Odyssey art;
- contemporary/political art;
- KFB PDF CardBuilder rendering;
- second generic card mesh.

## Machine report

Expose:

`window.KFBStorytellingT2.report()`

Required fields:
- build;
- both standees ready;
- exact asset pin;
- source material names;
- framePreserved;
- mediaMaterialReplaced;
- orientation.

## Browser gate

Public proof must capture:
- desktop A/B;
- mobile landscape;
- MEDIA→ORIGINAL→MEDIA switch;
- 0 page/script errors;
- 0 failed HTTP requests.

## Done when

The viewer can see that the *same real KayKit card* survives both orientations and that only its front image changes.

## Next gate

Georg chooses:
- portrait treatment;
- landscape treatment;
- whether both remain first-class.

Only then begin T3 motion.
