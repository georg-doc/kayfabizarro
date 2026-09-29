# KFB Container Turbo-01 · Return

Updated: 2026-09-29
Status: EXPERIMENTAL · CHECKPOINT A SOURCE PASS · STAGE PUBLICATION SOURCE WRITTEN · PUBLIC VERIFICATION OPEN

## Outcome
The MIT-licensed Turbo Kart Rally runtime is now imported as a KFB container candidate with an additive EXPLORE path.

EXPLORE:
- one player kart;
- same upstream Kart controller;
- same ChaseCamera;
- same InputController;
- no race countdown/laps/results loop;
- race ItemSystem disabled;
- race progress update bypassed;
- existing Race remains the regression-control path.

## Owner / branch / head
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-container-turbo-01-2026-09-29`
- current pre-return head: `435b242564f92fdc3a3ec6b40af91398f7c11168`

## Upstream source
- `bridge-mind/turbo-kart-rally@c52aca3f10c7995884c316810cac6514daa40e9c`
- MIT license retained under `app/LICENSE`.

## Evidence
- static/source: **34/34 PASS**
- protected donor files: exact blob identity
- browser: NOT RUN / NOT CLAIMED
- public Stage source: `cloudflare-live@aed6a2b6684c21cb7de19d58a00c1ef787ccd23d`
- target Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/turbo-01/`
- PUBLIC_VERIFIED: OPEN because current Web environment cannot open pages.dev

## Protected
No changes to upstream:
- kart driving feel;
- chase camera;
- input controller;
- track implementation;
- model implementation.

No Ground locomotion, Cards, Residents, Voxel, Clay or Flight yet.

## Exactly one next gate
**Checkpoint B · KFB Ground Consumer**

Use the existing KayKit Motion Lab + KCL-M1 results with one real ActionFigure / Rig_Medium in the actual EXPLORE world. No new locomotion lab and no new cadence research.
