# GROUND-TRAVEL-PACE-TIMING-01 · Recovery

Status: **SOURCE BROWSER PASS · PUBLIC STAGE PENDING**

Owner:
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-ground-travel-pace-timing-01-2026-09-29`
- Draft PR: **#291**
- base: `542eedb91f96b6f718df9e619fb3d3f746b79854`
- tested runtime: `ada92c557d3ef24dd18e511b4cff6f18e8b721fc`

What is proven:
- Travel-only 1.8× cadence/world-speed coupling PASS;
- Travel-only wall-clock catch-up PASS at simulated 15 FPS;
- full Turbo baseline 29/29 PASS;
- existing Ground+Orbit 27/27 PASS;
- no runtime/page/console errors.

What is not yet proven:
- Cloudflare mirror of this exact runtime;
- Georg human freeplay feel.

Do not resume the archived global timing candidate `9431a89c...`.
Do not change speed/cadence again before Georg reviews the published exact candidate.

Exactly one next gate:
publish `ada92c557d3ef24dd18e511b4cff6f18e8b721fc` to the existing direct Pace-Tune route and obtain exact public Chromium proof. If public proof passes, return only the same direct Stage for Georg's motion feel verdict.


## Publication checkpoint · 2026-09-29
- Cloudflare mirror branch commit: `4035d4a017a55f8f8129639badcfae45ef58c6b1`
- exact runtime intended: `ada92c557d3ef24dd18e511b4cff6f18e8b721fc`
- source runtime blobs are present on `cloudflare-live`
- public proof run: `36602463818`
- public proof job: `109522980455`
- current proof state: **IN_PROGRESS · WAITING FOR EXACT CLOUDFLARE REVISION**
- no second publication write has been attempted
- public status remains **PENDING / UNKNOWN**, not verified

Resume by checking run `36602463818` first. Do not republish unless that run has failed and its log proves the intended Cloudflare revision never appeared.


## Direct runtime proof
Run `36602463818`:
- exact public runtime marker PASS;
- all locomotion/timing/runtime assertions PASS;
- only final Hub-link lookup FAIL;
- therefore direct Stage is valid for human freeplay, while Hub metadata remains non-blocking follow-up.
- artifact `11050371267`.

Direct Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`


## TUNE 5 · canonical profile consumption
Georg reports the public 1.8× Travel candidate is improved but still wrong: W better/not good; run/sprint too slow.

Root architecture issue:
- existing KayKit KCL/ToolBox semantic locomotion profile is not a stable runtime dependency yet;
- Turbo Ground currently hand-wires a subset instead of consuming that owner;
- stable target owner path: `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`;
- main currently does not contain that stable file; current source exists in ToolBox session-cut exports.

Resume only with **GROUND-LOCOMOTION-PROFILE-CONSUMER-01**:
- promote exact existing profile owner without reauthoring its role taxonomy;
- Ground presentation consumes role/transition facts;
- walk-controller stays sole movement writer;
- keep Travel wall-clock fix + Orbit;
- no further local pace multiplier tuning until profile integration is proven.

Queued after Ground only:
- **RACE-VEHICLE-PROFILE-CONSUMER-01** in `georg-doc/KFB-Stunt-Car-Race`, protecting v0.8 accepted driving feel;
- **TRAVEL-FLIGHT-PROFILE-CONSUMER-01** in `georg-doc/KFB-Travel-Globe`, protecting Travel Flight / `carpet.js` movement ownership.

Clay/facade/shadow is explicitly a different chat and out of scope here.


### GROUND-LOCOMOTION-PROFILE-CONSUMER-01 · first browser run · Repair 1 diagnosis

Run `36609780664` · job `109547927367`:
- canonical profile static **16/16 PASS**;
- integration static **10/10 PASS**;
- full Turbo baseline **29/29 PASS**;
- existing Ground+Orbit **27/27 PASS**;
- dedicated Travel proof reached the canonical owner and then failed at the old assumption “sprint = Running_B”.
- artifact `11052522886`;
- digest `sha256:db8d3353e6a967f8463441f5ecc45dbafe43b065d9ce2d0c93c12e7abe852192`.

Observed exact ActionFigure profile:
- `run` = source `Running_A`, measured `2.455 u/s`;
- `sprint` = **Running_A playback-rate variant 1.3×**, measured profile world speed `3.192 u/s`;
- `Running_B` measured **59.6% slower than Running_A** in this exact ActionFigure/measurement path, so the canonical owner correctly rejected it as the faster role.

Cross-check:
- KCL/Motion Lab historically marked Running_B as `HOLD` rather than a promoted gait;
- `anim-map.v1.js` treats Running_B as an alternate Run, not an intrinsic Sprint;
- actor-specific FrizzleBob EarRig evidence can resolve Running_B differently, so this is profile/actor-specific rather than a universal clip label.

Repair 1:
- **do not force Running_B**;
- accept the canonical ActionFigure sprint role;
- raise only the Travel playback safety ceiling from 3.0× to 4.0× so the 9.45-u/s gameplay target can stay synchronized with the resolved Running_A sprint variant;
- when run→sprint uses the same source clip, record/apply the semantic role transition hint without mounting a second AnimationAction;
- update QA to prove the actual canonical role decision rather than the old hand-wired Running_B assumption.

This is repair pass **1/2**. If the next repair run fails, only one final repair remains.
