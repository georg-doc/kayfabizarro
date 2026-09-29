# RETURN · PlayCanvas Vehicle Physics Donor-01

**Date:** 2026-09-29  
**Status:** SOURCE-EXACT MIRROR · LOCAL 11/11 PASS · PUBLIC_VERIFIED 11/11 · HUMAN VISUAL BASELINE AVAILABLE  
**Owner:** `georg-doc/kayfabizarro` · `game-container/turbo-kfb/donors/playcanvas-vehicle-physics-01/`

## Branch / PR / heads

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/playcanvas-donor-01-2026-09-29`
- current source/evidence head before this Return: `610327a56e23939fe850155b95141062997d443f`
- PR: not yet opened
- immutable mirrored runtime commit: `8bcbaf1cf60696e12c32d75a12b4fed0a37dfebc`
- Stage publication: `cloudflare-live@db0fabff71b9bb8943184628b7c7d697ba48cd3b`

## Outcome

The real PlayCanvas Vehicle Physics demo is now on board as a self-hosted KFB donor.

This is **not a rebuild**.

The actual public donor runtime was captured from:
`https://playcanv.as/apps/BfRjx709/index.html`

That runtime is the published Vehicle Physics donor behind:
`https://playcanv.as/p/CxgnAp22/`

Georg's fork remains the editable/project provenance:
- `KFB Joyride 01`
- project `1609943`
- fork of `643289`
- scene `2608057`
- Dropbox project export retained separately.

## Runtime mirror

Captured from the real running donor:
- **42 runtime files**
- **22,054,130 bytes**
- **0 capture errors**

Per-file source URLs, byte sizes and SHA-256:
`static/KFB_DONOR_MIRROR.json`

The immutable runtime contains the real:
- PlayCanvas engine;
- generated app/bootstrap scripts;
- config and scene;
- Ammo physics runtime;
- Basis texture runtime;
- Buggy assets/textures;
- Desert assets/textures;
- sky/cubemap;
- UI/runtime files.

No generated substitute world or proxy car exists in Donor-01.

## Original donor proof

GitHub Actions:
- run `36603881007`
- job `109527828039`
- SUCCESS

Observed:
- Vehicle Physics 1280×720
- Car Physics present
- Follow Camera present
- W drives
- R resets
- 0 page errors
- 0 console errors

Headless W displacement in that source run: `8.996585162084834`.

## Self-host proof

GitHub Actions:
- run `36604195908`
- job `109528909467`
- artifact `11049659392`
- digest `sha256:342f129d64853a2c24843a9c9042815fb55338260bbd40c138b8492ba4e5d924`

**11/11 PASS**
- title
- app
- Car Physics
- Follow Camera
- Car Graphics
- Light
- W moves
- R resets
- 0 page errors
- 0 console errors
- 0 request failures

## Public KFB Stage

Direct route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-donor-01/`

Public proof:
- run `36604921730`
- attempt `1`
- job `109531386518`
- artifact `11051400015`
- digest `sha256:7996aa46bcdadbd359667254a52df09b2d2277d64035393233f5b92bfe4d7f37`

**11/11 PASS**
- exact SOURCE marker
- Vehicle Physics title
- Car Physics
- Follow Camera
- Car Graphics
- W moves
- R resets
- KFB Hub card
- 0 page errors
- 0 console errors
- 0 request failures

Status: **PUBLIC_VERIFIED**.

No claim of Georg visual acceptance of the self-hosted copy is manufactured; the source demo itself was the user-selected good donor.

## Hub repair

The earlier PlayCanvas cube-bench card had been inserted incorrectly into the preceding Turbo card's prompt string.

This slice repairs only that introduced Hub defect:
- `playcanvas-arch-01` current Hub card: removed
- `playcanvas-donor-01` current Hub card: exactly 1
- Turbo card restored as an independent object

The primitive architecture bench remains archived diagnostic evidence only.

## Protected

Donor-01 is the immutable comparison baseline.

Do not modify it in place.

Locked for the next slice:
- vehicle physics values;
- wheel/suspension values;
- collision;
- controls;
- Follow Camera;
- R reset;
- scene geometry.

## Deferred

- T4 / TD03 road integration;
- island/open-world composition;
- KFB vehicle swap;
- Residents;
- Cards;
- Walk↔Drive;
- audio;
- race mode.

These are not prerequisites for the next look pass.

## Exactly one next gate

**PC-LOOK-01 · TEXTURE / MATERIAL ONLY**

Create a new additive variant from Donor-01.

First pass may change:
- Desert surface texture/material;
- Buggy body/tyre/prop material inputs;
- sky/environment grading only if necessary for material readability.

It must not change physics, camera, controls, collision or geometry.

Compare PC-LOOK-01 directly against this immutable Donor-01 route.
