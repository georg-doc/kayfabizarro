# KFB ToolBox · KayKit Legacy RPG Rigging · Current Router

**Date:** 2026-09-21  
**Status:** LEGACY_BASE_LOCAL_BROWSER_PASS · KLR_KIT_BROWSER_INTEGRATION_FROZEN  
**Owner:** KFB ToolBox / Rigging  
**Implementation branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`  
**Draft PR:** #155  
**Current branch head:** `0fbf240150fd32274cf93305c8014262b72b860a`

## Legacy base · proven

Source-backed KayKit Dungeon 1.0 candidate:

- 4 static modular bodies: Barbarian, Knight, Mage, Rogue;
- 17 head choices: four defaults, twelve alternate class heads and Skull;
- source body/clothing material inventories;
- five embedded hat/hair/helmet sources;
- 24 tiered weapons across eight families;
- Arrow, three Quivers and Spell Book;
- existing 6-bone / 30-clip `Rig_Legacy` donor;
- Resident Atlas inverse-bind assembly;
- measured rigid-arm held-prop anchor;
- LegacyFaceHost → existing EyeRig v6;
- no source GLTF/GLB mutation and no placeholder geometry.

Exact tested Legacy-base head:

`5b2fa78220ec4127c1b761c4d7f7a8304dfb11e9`

Evidence:

- static/source: **29/29 PASS**;
- KLR-SYNC-01: **41/41 PASS** · run `35550320886`;
- full Legacy browser/WebGL: **44/44 PASS** · run `35550320883`;
- 0 failed browser resources;
- 0 page/console errors.

KLR-SYNC-01 permanently resolved the earlier stale actor-switch proof by adding an explicit assembly request/ready token and rejecting stale async completions.

## KLR-KIT-01 · shared Baukasten / randomizer direction

Goal accepted:

One reusable Legacy appearance/assembly layer for:

- Combat Arena monsters/enemies;
- KFB WhackMan player/ghost presentation;
- later KFB games.

Candidate shared schema:

`kfb.legacy-actor-recipe/0.1-candidate`

Pure core rules:

- body/head/headExtras/held-item appearance only;
- exact source revisions;
- caller-owned RNG;
- no `Math.random()`;
- deterministic selection;
- fail-closed source filters;
- no HP, damage, armor, AI, faction, score, lives, spawn or GhostMode fields.

Pure/static evidence on the KLR-KIT candidate:

- **33/33 PASS** static/source;
- **16/16 PASS** ActorRecipe deterministic suite.

## KLR-KIT browser integration · frozen

Frozen exact candidate:

- branch `chatgpt-web/klr-kit-01-failed-2026-09-21`;
- head `e3a06e3451637a8b447192113cab43f3ece84cd8`.

Browser attempt 1:

- run `35550795805`;
- HTTP / READY / randomizer UI / WebGL PASS;
- first seeded recipe timed out before Ready.

Browser attempt 2:

- run `35551084074`;
- initial source isolate settled;
- first isolated recipe failed with:
  `$(...).forEach is not a function`.

Proven root cause:

During the KLR-KIT code-edit operation, JavaScript `String.replace()` replacement-string semantics collapsed the previously working collection helper:

`$$('[data-mode]')`

to:

`$('[data-mode]')`.

This is an integration/edit regression. It is **not** evidence of a bad Legacy asset, bad Rig_Legacy assembly, bad deterministic randomizer, Combat incompatibility or WhackMan incompatibility.

Full recovery:

https://github.com/georg-doc/kayfabizarro/blob/chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21/tools/KFB-ToolBox/legacy-rpg-rigging/failure-recovery/KLR_KIT_01_FAILURE_RECOVERY_2026-09-21.md

## Consumer boundaries

### Combat Arena

Current receiving evidence:

- implementation PR #5 · head `954f2db7484dc566e468e5ce89b0d95940d97537`;
- CA2-04 PR #7 · head `6df5d4cd3b5e17bacb32438beac528a37c943bb0`.

Combat retains:

- MobBrain;
- spawn/movement;
- enemy mixer lifecycle;
- targeting;
- hit/contact;
- damage/HP/death;
- drops/rewards.

ToolBox may later supply only the Legacy appearance recipe + assembled actor.

### KFB WhackMan

No GitHub implementation owner is currently pinned.

Current Dropbox input:

`/CLAUDE/KFB WhackMan/KFB WhackMan - Perplexity.md`

This is concept/research input only.

ToolBox must not create WhackMan Maze, PlayerMotor, Ghost AI, score, pickups or power-up ownership.

## Stage status

Intended route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/`

**NOT PUBLIC_VERIFIED. Do not use it as a human test link yet.**

Do not publish the frozen KLR-KIT integration candidate.

## Exactly one next gate

**KLR-KIT-F1 · selector regression isolation**

Fresh bounded slice only:

1. start from the frozen KLR-KIT candidate;
2. restore only the collection selector seam;
3. run static contracts;
4. run exactly one browser recipe: `gate-16` = Knight + Rogue Head C + no held item;
5. require Ready + exact recipe/body/head identity + zero browser errors.

Do not resume the three-seed matrix, Combat integration, WhackMan integration, merge or Live promotion before KLR-KIT-F1 passes.
