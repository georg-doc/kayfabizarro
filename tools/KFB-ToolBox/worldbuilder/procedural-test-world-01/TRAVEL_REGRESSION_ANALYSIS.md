# Why Travel kept regressing as a test world

## Observed pattern

Travel PR #43 accumulated 74 commits / 55 changed files on top of main `8614282...` from 2026-09-18.
Later Mobility PR #44 stacked more changes to the central WorldBuilder host.

The actual card-start adapter, world recipe, runtime-mode and support-surface modules remained byte-identical while `wb0.js` / host startup kept changing.

## Card regression already documented in source

`site/world-builder/card-start-hardening.js` records two concrete failures:

1. The frozen host serially built the large mixed card pool before assigning one deck, leaving white cards visible for a long time.
2. Ground suppressed the Flight sky update path, but that path had been pumping terrain-card PDF artwork. Text/card backs could recover while real fronts starved.

## Why tests did not protect the visible product

`wb0-card-start-hardening.test.mjs` mainly asserts:
- correct registry calls;
- correct owner calls;
- no second card owner;
- artwork-pump code remains present.

Those are useful ownership/source tests.
They do **not** prove that the integrated host still displays the full card presentation correctly after every WB0 lifecycle change.

## Structural cause

Travel was being used simultaneously as:
- historical world prototype;
- Ground lab;
- Flight owner;
- card presentation host;
- WorldBuilder host;
- mobility integration surface.

Every locomotion iteration changed the host around unrelated presentation systems.

## Correction

Future core locomotion testing moves to Procedural Test World 01 after Motion SSOT visual PASS.

Travel remains:
- Flight/card donor and historical product reference;
- a later named consumer integration target.

Do not use Travel as the default neutral locomotion test ground again.
