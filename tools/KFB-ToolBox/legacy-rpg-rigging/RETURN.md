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


---

## 2026-09-21 · KLR-SYNC-01 RECOVERED

Implementation/test head:

`5b2fa78220ec4127c1b761c4d7f7a8304dfb11e9`

The frozen browser gate has been recovered through an explicit assembly request/ready contract.

Added runtime facts:

- monotonic `assemblyGeneration`;
- request token `<generation>:<bodyId>:<headId>`;
- explicit `assembling → ready | error` lifecycle;
- DOM evidence fields for request/body/head/ready state;
- stale asynchronous assembly completions are discarded before they can overwrite the current actor.

### Dedicated switch proof

Workflow:
`35550320886`

Job:
`106183720310`

Result:
**41/41 PASS**

Sequence:

`Barbarian → Knight → Mage → Rogue`

Each actor proved:

- unique request token;
- matching ready token;
- correct body identity;
- `RIG_LEGACY`;
- `ASSEMBLED`;
- native Rig_Legacy motion;
- correct body id in assembly report;
- 30 clips;
- all core parts placed.

Resources/browser:
- 0 failed requests;
- 0 page/console errors.

Artifact:
- ID `10618176287`
- `klr-sync-01-evidence`
- digest `sha256:d35fad324879c8e6c373a6ae8cda1ac9a447607523a0133403cb8c27783051d0`

### Full Legacy browser proof

The existing full candidate workflow also passed on the same head.

Workflow:
`35550320883`

Job:
`106183719887`

Result:
**44/44 PASS**

In addition to 4/4 actor assembly this proves:

- real source-isolate first;
- WebGL boot;
- source catalog counts;
- native `Attack(1h)` audition;
- exact Sword/common selector path;
- LegacyFaceHost measurement;
- EyeRig v6 mount;
- expression/blink controls;
- 0 failed resources;
- 0 page/console errors.

Artifact:
- ID `10617178796`
- `toolbox-legacy-rpg-rigging-evidence`
- digest `sha256:e7b1d7076f0665e50db6c03902fc2e439494e08e0a54275ec1c76e439c180f9e`

### Status change

The earlier failure-recovery export remains historical evidence, but the technical browser blocker it documented is now resolved.

Current status:

`LOCAL_BROWSER_PASS · PUBLIC_STAGE_PENDING · HUMAN_VISUAL_REVIEW_PENDING`

The intended Cloudflare Legacy route is still not claimed as public until it is deliberately published and opened.

## Product direction accepted for next slice

The Legacy source is intended to become one reusable modular actor construction layer for:

- Combat Arena enemies/monsters;
- KFB WhackMan player/ghost roles;
- later KFB games.

The shared ToolBox layer must own only appearance/assembly selection. Consumer gameplay remains outside it.

Exactly one next gate:

**KLR-KIT-01 · Legacy ActorRecipe + caller-seeded Character/Monster Randomizer core.**
