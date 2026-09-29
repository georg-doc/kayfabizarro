# GROUND-CONTROLLER-DONOR-01 · Test Report

**Status:** PUBLIC VERIFIED · HUMAN FEEL OPEN  
**Date:** 2026-09-29

## Source
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-container-ground-controller-donor-01-2026-09-29`
- tested head: `ee1abb9fe6736fe4cf6926846f7d298f9d22b9e4`
- base B2 head: `b4c7bb14cb51d6c5515613593b33c0ea0e183e89`
- external behavior reference only: `NafisRayan/3D-Game-Template-Ultimate@afe15865eafc86fbe1aab017d926ad3820b9a56b`
- external license status: no specific license declared; **no source code copied**

## Actions evidence
- run `36554119832`
- job `109359065140`
- **SUCCESS**
- static: **16/16 PASS**
- B2 regression browser: **29/29 PASS**
- candidate browser: **22/22 PASS**
- errors: 0 runtime · 0 page/console

## Baseline regression
- Explore: one kart, items off, displacement 28.91 u, speed 33.23 u/s
- Race: 8 karts, displacement 22.51 u
- Ground baseline: exact six old B2 clips, Walking_A, Running_A @ 2.4802741670 u/s, Jump_Start/Air/Land, no root-motion world translation

## Candidate
URL contract: `?ground=1&groundFeel=velocity`

Clips bound:
`Idle_A · Walking_A · Running_A · Running_B · Walking_Backwards · Running_Strafe_Left · Running_Strafe_Right · Jump_Start · Jump_Idle · Jump_Land`

Measured checks:
- start after .12 s = 0.4602923058 u/s
- settled Walk = 0.6109509569 u/s
- Run ramp = 2.5867839515 u/s · Running_A
- Sprint = 3.0240851618 u/s · Running_B
- release to Walk = 0.6136849006 u/s
- backward = Walking_Backwards
- left strafe = Running_Strafe_Left
- theoretical jump apex = 1.2075871706 u
- nominal air time = .78 s
- observed sprint-jump horizontal travel = 3.90 u
- landing returned directly to moving Running_B state

## Artifact
- id: `11027300966`
- SHA-256: `67d77fd0dfb136824674e737adc575b569590aa410b6ce45dfd96cf17ceab9c0`

## Not claimed
- no HUMAN_ACCEPTED locomotion feel
- no Orbit-camera integration
- no Enter/Exit Kart
- no merge / Live promotion
- public Stage is verified; human feel remains open

## Next gate
Publish the exact candidate to a dedicated KFB Stage route and ask one freeplay question: **does Walk/Run/Sprint/Jump now read as intentional full-body locomotion rather than tripping/small steps?**


## Public Cloudflare proof

Direct route:
https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-controller-donor-01/?ground=1&groundFeel=velocity

Publication:
- `cloudflare-live@2551ce49532ac705f160448562c95e7b6ba05efb` runtime + Hub link;
- `cloudflare-live@ae38fd29993151b655c668bd5776d0f042d2dd27` QA-only Hub-route correction;
- exact deployed runtime marker: `ee1abb9fe6736fe4cf6926846f7d298f9d22b9e4`.

Final public proof:
- run `36556353970`;
- job `109366329677`;
- **13/13 PASS**;
- 0 runtime errors;
- 0 page/console errors;
- Hub dedicated link PASS;
- artifact `11027623437`;
- digest `sha256:9bc0088bedce00591e9ddb2b6ab2fd2541bd59a70d5f3f8b469be3976d248211`;
- screenshots `stage.png` and `hub.png`.

Repair accounting:
- Public proof attempt 1: Stage/runtime PASS; Hub-link assertion FAIL because QA opened default Heute view.
- Repair 1: QA opens `#briefings`; **PASS**.
- No product/runtime repair consumed.
