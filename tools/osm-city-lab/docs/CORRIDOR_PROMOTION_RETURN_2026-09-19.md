# Return · Corridor tested-stack promotion onto current main

**Date:** 2026-09-19  
**Status:** MAIN PROMOTED · POST-MERGE CONSUMER PASS · PUBLIC STUNT WORLD 29/29 PASS · HUMAN FULL-ROUTE OPEN

## Goal

Promote the already-tested Ehrenfeld ↔ Hürth source, current-detail source and deterministic City consumer artifacts from stacked draft PRs #80 → #81 → #82 without replaying their old branch history or overwriting newer unrelated main work.

## Base / branch

- Repository: `georg-doc/kayfabizarro`
- Current-main base used for r2: `c867788416c50fa9c6e6ce57abc4bad85dca90d1`
- Promotion branch: `osm-city/corridor-promote-tested-stack-r2-2026-09-19`
- First content commit: `5f103de229c7296eb0152bfc2828badaa8600fa4`
- Consumer-CI trigger commit: `cd80f8df87acba13186a8714013182d8187fd8e8`
- Evidence refresh commit produced by CI: `944fd98058cdcd344a6d8826cdfb8590f3237a70`

The 20 unrelated commits that advanced main after the first recovery branch touched Resident Atlas only; no OSM City files were overwritten.

## Promotion method

Large tested artifacts were not downloaded/re-serialized.

Their existing Git blob identities from PR #82 were attached directly to a fresh tree based on current main. This preserves byte identity for the heavy source/normalized/scene payloads.

Not copied from the old stack:

- old README;
- old CHANGELOG;
- old Work Lead handoff;
- old corridor overview doc.

Those newer main documents remain authoritative and are updated additively instead.

## Exact promoted artifact identities

### Current narrow source

- source SHA-256: `a6a6479e540a9c89d73da86a34313708920e5b0e1f551c9ca4c61c59d06928f6`
- source elements: **117,750**

### Normalized corridor

- normalized SHA-256: `e88450d51169f7293bdbfb87955826cf3328a25e00eb3c24e8a08c636e406e6f`

### Consumer scene

- path: `tools/osm-city-lab/scenes/ehrenfeld-huerth-corridor-v0.json`
- Git blob: `5d47021f9380101454b707a028d8675cab37fbe1`
- size: **10,206,808 bytes**
- scene SHA-256: `258c4d5a3872750bc9045d771646e85dbf36aab8a14243db98adc0d288edf07d`

### Route / selection

- physical route: **11,384.3 m**
- route points: **510**
- route half width: **220 m**
- selected roads: **2,486**
- selected buildings: **7,420**
- selected landuse: **332**
- selected water lines: **2**

## Workflow lifecycle adjustment

Networked source refresh is now explicit:

- `osm-city-corridor.yml` → `workflow_dispatch`
- `osm-city-corridor-detail.yml` → `workflow_dispatch`

This prevents a main merge from needlessly refetching public Overpass.

The deterministic, network-free consumer regression remains automatic for the promotion branch and `main`.

## TESTED RESULT

Promotion workflow:

- run: `35415509853`
- job: `105823274200`
- syntax: **PASS**
- existing Ehrenfeld/Hürth normalization regression: **PASS**
- corridor consumer build: **PASS**
- deterministic rebuild: **PASS**
- artifact commit step: **PASS**

Rebuilt hashes:

- normalized SHA-256: `e88450d51169f7293bdbfb87955826cf3328a25e00eb3c24e8a08c636e406e6f`
- scene SHA-256: `258c4d5a3872750bc9045d771646e85dbf36aab8a14243db98adc0d288edf07d`

All recorded consumer gates remain true, including source freshness, OSM identity preservation, endpoint joins, landmark socket, one movement-owner boundary and deterministic output.

## Downstream receiver proof

Race / Free Roam branch:

`georg-doc/KFB-Stunt-Car-Race@wsa/osm-city-drive-corridor-2026-09-19`

Latest tested browser proof:

- run `35414946641`
- job `105821630552`
- module/owner regression: **10/10 PASS**
- existing Hürth C1 browser: **26/26 PASS**
- continuous corridor browser: **17/17 PASS**
- boot: **2237 ms**
- short corridor drive: **6.807 m**
- four C0 wheel contacts
- no new recovery/run
- evidence commit: `7208b4167df6fbea62703177301473eb841522d7`
- artifact: `10574843986`

## PUBLIC DEPLOYMENT · TESTED RESULT

The public Ehrenfeld/Hürth S1 viewer is tested on `kayfabizarro.pages.dev`.

The corridor Stage mirror is also now tested at:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/`

Official proof:

- main proof commit: `d78fa862262184aa0ed172ed42e10db6e3705c71`;
- workflow `35416057009`;
- job `105824845921`;
- **29/29 PASS**;
- 9/9 public runtime bytes exact;
- public WebGL boot 2852 ms;
- 4/4 C0 contacts;
- 6.406 m short public drive;
- no new recovery/run;
- no console/page or failed-HTTP errors;
- artifact `10575592864`.

This is **PUBLIC STAGE BROWSER PASS**, not human full-route or physical mobile acceptance.

## GEORG ACCEPTANCE

OPEN:

**Drive a meaningful longer portion of the connected Hürth → Ehrenfeld corridor and judge scale, road readability, grotesque city/forest balance and overall coherence.**

## Main promotion result

- PR #86
- merge `3813d24e3db04a43117676890e48f7b6baaf6cd9`
- post-merge consumer run `35415680112` / job `105823765381`: **PASS**
- S2 export contract `35415680163`: **PASS**
- main evidence refresh `25c2c616720e18d97028bf06fdd03d10c16b3504`
- normalized/scene hashes unchanged.

## Still open

- longer human full-route drive;
- physical mobile QA;
- Travel Walk↔Drive;
- Drive↔Flight;
- landmark runtime insertion;
- audio integration;
- Live promotion beyond Stage.
