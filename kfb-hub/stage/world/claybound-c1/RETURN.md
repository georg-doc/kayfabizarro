# RETURN · CLAYBOUND-WORLD-C1

Date: 2026-09-26  
Status: **FROZEN BROWSER-UNVERIFIED CANDIDATE · NO STAGE PUBLICATION**

## Defect first

The GitHub runner did not finish loading the accepted Hürth World r2 scene. Two C1 browser runs ended before the C1 adapter mounted, so the visual and interaction acceptance gates cannot be claimed. The accepted World r2 CI browser workflow has the same Hürth timeout on this runner. The cause is not proven.

## What was built

A reversible `Original / ClayBound` presentation adapter on a closed copy of the accepted World r2 Hürth package. It uses the same WorldBuilder entry, scene, seed, camera, route, terrain and player. It touches the dense, rounded OSM building wall presentation mesh only: seeded broad and medium rest-space displacement is masked away from the foot, roof contact, and spawn vicinity. The material is matte/waxy with restrained colour variation and warm key/cool fill. There is no micro-grain or screen-space noise.

Roofs receive material/light treatment only. Roads, spawn, terrain/contact geometry, facade attachments, landmarks, water, rails, actors and low-poly props are excluded from form displacement. The adapter changes neither source vertex positions nor collision/ground functions. It adds one compact A/B control to the existing top UI and exposes a diagnostic report for numeric comparisons.

`FB_TEMPLATE_LOOK_v5_smooth.glb` remains only a structural donor; it is not used as look proof. No Blender slider tuning, texture sourcing or Race Track integration is part of this slice.

## Source and checks

- Base: `georg-doc/kayfabizarro` PR #234, `wsa/world-r2-stage-prep-2026-09-26@7b2393a54c6b31e4bd4d927275030423612cfde8`.
- Candidate: `work/claybound-world-c1-2026-09-26`.
- Implementation: `6f3f1669c18d502460d151913d8be8dc43b32103`.
- Package/syntax: **32/32 PASS / PASS**.
- Browser: **UNVERIFIED** after two timed-out CI runs; see `TEST_REPORT.md`.
- Public Stage: **NOT DEPLOYED**. Intended route: <https://kayfabizarro.pages.dev/kfb-hub/stage/world/claybound-c1/>. This is not a review link yet.

## Exactly one next gate

Complete the C1 desktop/narrow browser A/B proof on a working local HTTP preview of the accepted World r2 scene, including visual silhouette review and route/contact numerics. Publish to KFB Stage and activate Hub metadata only after that gate passes.
