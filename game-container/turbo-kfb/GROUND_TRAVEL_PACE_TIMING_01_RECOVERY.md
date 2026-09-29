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
