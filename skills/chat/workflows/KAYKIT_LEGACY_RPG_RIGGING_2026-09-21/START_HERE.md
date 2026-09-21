# KFB ToolBox · KayKit Legacy RPG Rigging · Recovery Router

**Date:** 2026-09-21  
**Status:** FROZEN_BROWSER_GATE_AFTER_TWO_REPAIR_PASSES  
**Owner:** KFB ToolBox / Rigging  
**Implementation branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`  
**Draft PR:** #155

## Outcome preserved

A source-backed Legacy Dungeon 1.0 character-rigging candidate exists with:

- 4 static modular RPG bodies: Barbarian, Knight, Mage, Rogue;
- 17 head choices: four defaults, twelve alternate class heads and Skull;
- source body/clothing material inventories;
- five embedded hat/hair/helmet sources;
- 24 tiered weapons across eight families;
- Arrow, three Quivers and Spell Book;
- reuse of the existing 6-bone / 30-clip `Rig_Legacy` animation donor;
- Resident Atlas inverse-bind assembly and measured rigid-arm held-prop anchor;
- a LegacyFaceHost candidate feeding the existing EyeRig v6;
- no source GLTF/GLB mutation and no placeholder geometry.

## Evidence

Static/source contract:
**26/26 PASS**

Browser attempts:
- run `35543850991`: proof synchronization failure on transient motion text;
- run `35548588227`: Barbarian assembly passed, then stale previous-actor identity was read during the Knight async switch.

This is not evidence that Knight or the other source actors fail to assemble. It is evidence that the current proof has no deterministic actor-switch readiness token.

Full branch Return:
https://github.com/georg-doc/kayfabizarro/blob/chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21/tools/KFB-ToolBox/legacy-rpg-rigging/RETURN.md

Failure recovery:
https://github.com/georg-doc/kayfabizarro/blob/chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21/tools/KFB-ToolBox/legacy-rpg-rigging/failure-recovery/FAILURE_RECOVERY_2026-09-21.md

## Stage status

Intended route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/`

**Do not use this as a human test link yet. It is not published or PUBLIC_VERIFIED.**

## Protected owners

- ToolBox / Rigging owns authoring/calibration.
- Resident Atlas legacy assembly remains the donor mechanism.
- EyeRig v6 remains the eye runtime owner.
- Motion Lab keeps Medium/Large motion ownership; Legacy remains a separate rig family.
- Combat/Travel/Race/Town retain gameplay, movement, physics and state.
- Pencil, CapsuleCarl, Eraser and other prop-rigs are future consumers only; no compatibility claim is made here.

## Exactly one next gate

**KLR-SYNC-01 · deterministic 4/4 actor-switch readiness proof**

Fresh slice only:

`Barbarian → Knight → Mage → Rogue`

Expose or await a completion token/request id tied to the requested body, then assert identity, `RIG_LEGACY`, `ASSEMBLED`, 30 clips and placed core parts.

Do not add features and do not publish Stage until this minimal gate passes.
