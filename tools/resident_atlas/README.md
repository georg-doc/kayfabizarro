# KFB Resident Atlas

Status: IMPLEMENTATION SLICE — not yet browser-tested or Georg-accepted.

Pinned source baseline: `252449c921d3f8138d68d1faa3f4052e84040dfe`.

Purpose: reusable, mobile-friendly scene atlas for composing real repository characters, habitats and props. Asset truth remains in the repository / Asset Registry. This tool owns only scene composition and presentation. It does not replace Animation Lab compatibility decisions or consumer-runtime ownership.

## Calibration scene

`Caveman · Cave Camp`

The first slice deliberately uses only verified repository assets. The Caveman collection provides `Caveman_Axe`, `Caveman_Club`, `Caveman_Spear`, `Campfire_Base` and `Campfire_Logs`. Rock/cave habitat and additional wooden structures must be selected from verified repository models before they are added; they are not invented placeholders.

## Intended viewer contract

One shared viewer, multiple declarative scene recipes. Mobile-first scene selector; orbit/zoom/reset; front/top/side views; actor/props/habitat visibility; optional grid/bounds; asset inspector with exact collection and repository path.

## Evidence states

- DECISION: shared viewer + declarative recipes.
- IMPLEMENTATION: this folder and Caveman recipe skeleton exist on the feature branch.
- TESTED RESULT: OPEN.
- PUBLIC DEPLOYMENT: OPEN.
- GEORG ACCEPTANCE: OPEN.

Next implementation pass: finish repository inventory for Caveman character, rock/cave habitat and primitive wooden structures; then create the actual Three.js viewer and browser-test it.