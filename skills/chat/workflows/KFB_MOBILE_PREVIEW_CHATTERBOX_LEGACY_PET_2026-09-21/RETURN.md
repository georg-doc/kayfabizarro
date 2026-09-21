# KFB Toy / Clay Form Lab v0 · RETURN

**Date:** 2026-09-21  
**Status:** IMPLEMENTED + LOCAL BROWSER PROVEN · PUBLIC BLOCKED · HUMAN VISUAL GATE OPEN  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/mobile-preview-chatterbox-legacy-pet-2026-09-21`  
**Draft PR:** #158  
**Implementation/tested head:** `8825d05caed888e8bc35cc3b49d0cf01da3664da`

## Outcome

A small reusable **KFB Toy / Clay Form Language v0** now exists as a ToolBox authoring donor.

It addresses the recurring hard-edge / over-detailed modelling drift with:
- visible rounded macro masses;
- capsule beams instead of thin rectangular rods;
- smooth lathed spires;
- matte toy/clay material defaults;
- hard authored-part budgets;
- donor-first comparison against a real Tiny Treats object.

The first three generated benchmarks are:
1. rounded rectangular panel with three rounded buttons;
2. simplified Eiffel toy icon;
3. simplified Cologne Cathedral toy icon.

## Retained owners

No owner replacement:
- `tools/img2threejs/` remains landmark authoring owner;
- **City Grotesque remains current landmark default**;
- Soft Cubist remains existing alternate/debug evidence;
- Registry / Asset Librarian keeps asset identity;
- Tiny Treats source assets remain source assets, not re-authored replacements.

## Donor proof

The lab's default first view is the exact registered Tiny Treats Charming Kitchen toaster:
`media/3D_Assets/Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/toaster.gltf`.

The procedural samples can only be selected after that source object is visible in the same lab.

## New implementation

- `tools/KFB-ToolBox/toy-clay-form-lab/lib/kfb-toy-primitives.mjs`
- `tools/KFB-ToolBox/toy-clay-form-lab/lib/samples.mjs`
- `tools/KFB-ToolBox/toy-clay-form-lab/README.md`
- `kfb-hub/stage/toolbox/toy-clay-form-lab/index.html`
- `kfb-hub/stage/toolbox/toy-clay-form-lab/viewer.mjs`
- `kfb-hub/stage/toolbox/toy-clay-form-lab/static-check.mjs`
- `kfb-hub/stage/toolbox/toy-clay-form-lab/browser-proof.mjs`
- `.github/workflows/toy-clay-form-lab.yml`
- `TOY_CLAY_STYLE_RULES.md`
- `POSTMORTEMS.md`

## Actual evidence

Run `35555718144`:
- **15/15 static PASS**
- **16/16 desktop/mobile WebGL PASS**
- desktop 1440×900
- mobile 390×844
- Panel **4/4** authored parts
- Eiffel **13/14**
- Cologne **12/16**
- **0** failed browser resources
- **0** page/console errors

Artifact:
`10619944311`

Digest:
`sha256:7ac890e848f40b3c5456c3512bb6864580b903431fd6a529380ad029ad7aaa34`

## Visual state

The first evidence images show:
- exact Tiny Treats toaster donor on desktop/mobile;
- current Cologne Toy/Clay candidate on desktop/mobile.

The candidate has already moved away from hard low-poly architecture toward a soft collectible/icon language. The current Cathedral spires are still relatively pointed and remain intentionally un-tuned pending human review.

No claim is made yet that Eiffel or Cologne are final preferred designs.

## Stage

Intended human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/toy-clay-form-lab/`

**NOT PUBLIC_VERIFIED.**

Cloudflare PR deployment reports **BUILD FAILED** at the tested implementation head. Do not send the intended route as a working test link yet.

## Unresolved

- Cloudflare publication build;
- Georg visual acceptance of softness and landmark abstraction;
- whether pointed Cathedral spires should be softer/blunter;
- later A/B against existing City Grotesque / Soft Cubist in the actual storytelling-map consumer;
- export/consumer contract only after style acceptance.

## Exactly one next gate

**TOY-CLAY-PUB-1 · publication-only recovery.**

Get the exact Cloudflare Stage route PUBLIC_VERIFIED without changing the proven geometry. Then ask Georg for the first visual verdict on the three benchmark objects.
