# HUMAN VISUAL FAIL · World Studio MVP1 · Joyride design missing · 2026-10-04

Status: **HUMAN FAIL · PRODUCT VISUAL FOUNDATION**
Human evidence: Georg freeplay screenshot from primary GPT Site
Primary Site: `https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/`
Runtime owner: WB2 / PR #348

## Result

The Site delivery itself works, but the visible product is not accepted.

This is not a Cloudflare/Sites problem and not a QA-harness problem.

It is a **visible world-design failure**.

## What the screenshot shows

Observed in Georg's Town/Build screenshot:

- giant pale/white road and bridge bands dominate the frame;
- road/barrier geometry reads as a technical Track-Core/support structure rather than a KFB clay road;
- large flat grey void/sky dominates the background;
- the island reads as a thin green terrain patch surrounded by engineering geometry;
- KayKit buildings/Residents/props appear sparsely placed as individual test objects rather than one authored living place;
- the visual hierarchy is road/support first, world/biography second;
- the result reads as an integration/debug world rather than the intended KFB living-toy / Joyride world.

Source-clean assets alone are not enough.

## Missing design layer · Joyride

The expected Joyride road/world design was already explicitly requested in the R2D source package.

R2D current source said:

> Georg wants the island roads in the Joyride standard look (rounded clay strand).

The required donor is pinned:

`georg-doc/kayfabizarro@927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f`

Exact source:

- `.../KFB_JOYRIDE_J14.../lab-track/track-look.v5.js`
  - blob `7c0d248391c3eaf1887a0afc97ee02b25f6dec85`
- `.../lab-track/road-markings.m1.js`
  - blob `68a0c21a2c68c0b7db72046146008b474979ec15`
- `.../lab-track/transition-atlas.v1.js`
  - blob `cfef150a74060bfc6ff00ab049529d8710845bfc`

Joyride J06/J14 direction includes:

- **T4 clay strand as the connecting element**;
- rolling clay terrain instead of visible slabs/engineering plates;
- K2 clay material language;
- M1/M2 road marking language;
- rounded clay barriers / band heads;
- groove / rim bulge / belly mass in the strand;
- transition atlas rather than hard material cuts;
- clay patches/drops rather than smooth generic gradients;
- KFB clay VFX;
- source objects translated into the same clay-world presentation;
- proper shadow/facade canon.

## Known process miss

R2D explicitly listed this as unresolved:

> **WSA: Joyride-Knetstrang as component `buildClayStrand(...)`**

and its completion condition was:

> the island road looks at driving height like J14 under the same light.

Repository search still finds no implemented `buildClayStrand` module outside the old source brief.

Therefore the current MVP was published while a **known required presentation dependency was still OPEN**.

That is the process failure.

The technical Track Core was promoted to visible product presentation because the accepted/pinned Joyride presentation adapter was never completed.

## Typed donor correction

### Track Core
- MECHANISM / DATA: **KEEP**
- route/support/collision: **KEEP**
- current pale engineering presentation as final KFB visual: **REJECT**

### Joyride J14/T4
- PRESENTATION: **REQUIRED**
- road markings / transition grammar: **REQUIRED**
- clay strand geometry/presentation: **REQUIRED**
- old Joyride whole-scene runtime ownership: **DO NOT IMPORT**

### R2D / current source-clean world
- island topology / biome recipes: **KEEP**
- individual asset source families: **KEEP**
- sparse test composition: **REJECT AS FINAL PRODUCT COMPOSITION**

## Recovery objective

Do not rebuild WB2, Player, Residents, Cards, persistence or God Mode.

Perform one **VISUAL WORLD RECOVERY**:

1. extract/rehome the Joyride clay-strand look into one reusable presentation adapter over the existing Track stream;
2. use the existing Track Core route/support/collision unchanged;
3. replace the current oversized pale road/barrier presentation with the Joyride/K2 clay road language;
4. integrate the road into the terrain rather than letting it dominate as a separate engineering slab;
5. repair first-frame composition and living-place density around the existing source-clean objects;
6. preserve the four-island topology and current functional systems;
7. update the existing GPT Site — do not create another Site;
8. Georg reviews the same primary Site again.

## Human acceptance target

A Town screenshot at comparable camera height must read first as:

**KFB claymation living-toy world / Joyride**

and only second as:

**a technically valid road network with buildings on it**.

The current screenshot is the reverse.

## Current status

- GPT Site publication: PASS
- source-clean asset replacement: PARTIAL / KEEP
- Track mechanism: KEEP
- Joyride visible presentation: **MISSING**
- composition/livingness: **HUMAN FAIL**
- current primary Site visual acceptance: **HUMAN FAIL**
- Live promotion: forbidden

Exactly one next product gate:

**repair the visible Joyride/world-design layer in the existing WB2 owner and republish the existing World Studio Site for Georg freeplay.**
