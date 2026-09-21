# KLR-KIT Matrix · RETURN

**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Rigging  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/klr-kit-matrix-2026-09-21`  
**Base:** `chatgpt-web/klr-kit-f1-2026-09-21@eedf34805bc869fedd8e94ecec9e914d2ea12d59`  
**Tested head:** `8197d8f1b6e1becc550b9eeb6d766b455a0b33ab`  
**Status:** PASS · LOCAL BROWSER / WEBGL · NO PUBLIC STAGE

## Goal

Resume only the deferred KLR-KIT multi-recipe browser matrix on the repaired F1 runtime:

`gate-16 → gate-75 → gate-33 → repeat gate-16`

No runtime code, source asset, ActorRecipe schema, EyeRig, Combat or WhackMan owner changed in this slice. The only new implementation artifact is the dedicated matrix workflow.

## Proven recipes

### gate-16

- body: Knight
- head: Rogue Head C
- head extras: ON
- right held: none
- left held: none
- Ready token: `1:knight:rogue-c`

### gate-75

- body: Barbarian
- head: Barbarian default
- head extras: OFF
- right held: none
- left held: none
- Ready token: `2:barbarian:barbarian-default`

### gate-33

- body: Knight
- head: Barbarian default
- head extras: ON
- right held: Sword rare
- left held: none
- Ready token: `3:knight:barbarian-default`

### repeat gate-16

- Ready token: `4:knight:rogue-c`
- recipe reconstruction exact
- recipe key reconstruction exact

The three initial seeds produced three different recipe keys.

## Tests

Workflow:
`35660231145`

Job:
`106533462704`

### Static/source

**33/33 PASS**

### ActorRecipe

**16/16 PASS**

### Selector regression

**2/2 PASS**

### Browser/WebGL matrix

**35/35 PASS**

Browser proof includes:

- HTTP;
- boot READY;
- randomizer UI;
- WebGL;
- initial source isolate;
- all three recipe assembly states;
- schema identity;
- no gameplay fields;
- exact body/head UI identity;
- exact held-slot identity;
- exact headExtras identity;
- exact recipe key identity;
- visible assembled Rig_Legacy identity;
- repeat-seed deterministic recipe/key;
- multiple unique recipes;
- 0 failed HTTP/resources;
- 0 page/console errors.

Artifact:
`10667035972`

Name:
`klr-kit-matrix-evidence`

Digest:
`sha256:fb050fb44ceea245bfc1db1b243b47e2b2b811659b0e8d719616fecbcd09f625`

Files:
- `desktop.png`
- `browser.json`

## Product status

The reusable Legacy appearance Baukasten / seeded Character+Monster randomizer is now technically proven as a ToolBox candidate.

It may later be consumed by Combat Arena and KFB WhackMan, but consumer integration is still deliberately deferred.

No public Legacy Stage is claimed.

## Exactly one next gate

**KLR-EYE-01 · Legacy Eye Batch 17/17**

Reuse the current EyeRig v6 / Eye Batch profile owner already used for Medium/Large.

Required first outcome:

- all 17 Legacy head identities measured or explicitly classified;
- one default EyeRig profile per head identity;
- real head source shown in isolation before profile use;
- no source geometry mutation;
- profiles stored as data, not hardcoded per game;
- browser batch proof that every profile can mount on its intended Legacy head;
- visual/human acceptance remains separate.

Combat integration remains after KLR-EYE-01.
