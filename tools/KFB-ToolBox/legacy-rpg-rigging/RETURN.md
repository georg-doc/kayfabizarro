# KFB ToolBox · Legacy RPG Rigging Lab · RETURN

**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Rigging  
**Repo:** georg-doc/kayfabizarro  
**Branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`  
**Draft PR:** #155  
**Status:** SOURCE + IMPLEMENTATION PRESERVED · STATIC PASS · BROWSER GATE FROZEN AFTER TWO REPAIR PASSES

## SOURCE

- KayKit Dungeon Pack 1.0 legacy, CC0.
- 4 character body sources.
- 17 head choices.
- 24 tiered weapons.
- 10 gear/prop entries.
- Rig_Legacy donor: 6 bones / 30 embedded clips.
- Eye runtime: existing EyeRig v6.

## DECISION

Reuse the existing Resident Atlas Legacy assembly math and EyeRig v6. Do not create a second animation owner or mutate source assets. Clothing is cataloged as body/material source data where no detached clothing asset exists.

## IMPLEMENTATION

Candidate files:
- `tools/KFB-ToolBox/legacy-rpg-rigging/`
- mirrored candidate source at `kfb-hub/stage/toolbox/legacy-rpg-rigging/`
- workflow `.github/workflows/toolbox-legacy-rpg-rigging-test.yml`

Features:
- source-isolation browser;
- body/head assembly;
- cross-head choices;
- head gear/hair retention toggle;
- 24-weapon + prop selectors;
- native 30-clip Legacy audition;
- LegacyFaceHost;
- EyeRig-v6 batch candidate controls;
- review state under isolated localStorage namespace.

## TESTED RESULT

Repository/static:
**26/26 PASS**

Browser:
- run `35543850991`: proof synchronization timeout after initial source/catalog PASS;
- run `35548588227`: Barbarian assembly PASS; next actor stale-read in test synchronization.

After two browser-gate repair passes, candidate is frozen per KFB recovery rule.

Full recovery:
`failure-recovery/FAILURE_RECOVERY_2026-09-21.md`

## PUBLIC DEPLOYMENT

Intended route:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/

**NOT PUBLIC_VERIFIED · NOT PUBLISHED AS HUMAN TEST SURFACE**

## GEORG ACCEPTANCE

PENDING.

## OPEN

- deterministic actor-switch readiness gate;
- full 4-character browser proof;
- 17-head visual EyeRig review;
- held-prop visual calibration;
- Cloudflare publication.

## ARCHIVED HISTORY

Transient incomplete-tree commit `b3907029f9a3b983ff1a183d9e505fb220505807` is preserved in history and immediately superseded by fast-forward recovery `b9b150b971fcc3fdac087b617b73420fded01575`.

## One next gate

**KLR-SYNC-01 · 4/4 deterministic actor-switch readiness proof.**
