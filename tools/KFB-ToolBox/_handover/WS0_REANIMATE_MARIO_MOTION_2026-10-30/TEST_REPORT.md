# WS0 · Reanimate / Mario-like Motion · Test report (planning checkpoint)
Date: 2026-10-30
Revision status: **RESEARCH BRIEF ONLY**, no performed animation trial.

## Checks actually performed in this chat
- [PASS] Read KFB chat workflow/owner documents on GitHub (document inspection, not implementation test).
- [PASS] Reconciled canonical KFB Cartoon Animation skill, native Medium gait baseline, World movement owner and 2D separation on GitHub.
- [PASS] Searched KFB repo for Mario/motion / prior WS0 animation traces; known old test `Jump_Full_Long` was recorded in historic ToolBox WSA source report.
- [LIMITED] Searched external sources: public launch claim for /reanimate found; exact site page could not be fetched by available web reader.
- [NOT TESTED] /reanimate functionality, license, API, motion export, import compatibility, KFB sprite/rig reconstruction.
- [NOT TESTED] isolated source object, screenshot, real input/output or side-by-side A/B.
- [NOT TESTED] runtime/3D visual QA, performance or public Site/Stage.

Actual KFB runtime tests: **0**
Actual /reanimate conversion tests: **0**
Actual screenshots/videos generated: **0**
Actual site deploys: **0**

## Planned executable checks (DO NOT record as PASS before run)
| Gate | Fixture | Required evidence | Pass / block |
|---|---|---|---|
| G0-1 identity | exact Niaz URL | opened site, screenshot, product identity + rights | no naming collision |
| G0-2 conversion | KFB-owned 1–3 s video/GIF | complete input and exported output inspected isolated | prove format/capability |
| G0-3 editable | output files | saved editable curves/poses/layers/keys or exact limits | viable 3D path vs reference-only |
| P1-1 jump A/B | accepted Medium character, fixed camera | baseline/candidate clips same input trace | clearer launch/apex/contact/recovery |
| P1-2 ownership | Ground controller + motion overlay | trajectory/contact/camera logged unchanged | no dual writer |
| P1-3 QA | actual browser playback + independent critique | capture, measured timings, foot contact, neutral return | no float/slip/jitter |
| P2-1 start/stop | Walking_B/Running_A/Running_B | isolated start and brake comparison | accepted native gait not replaced |
| D1 license | reference/exports | stored ToS/license/allowed reuse | no unlicensed source asset distributed |

## Measurements to record
For each trace: fps; source/output duration; anticipation onset+length; takeoff; apex; descent; contact; squash depth/time; settle; foot plant offsets; 0/1/2+ concurrent world-motion writers; file names + hashes + rendering screenshot.
For visual critique: silhouette, anticipation clarity, rhythm, weight/contact, staging, obvious mechanical interpolation, and improvement versus unchanged baseline.
Do not invent fixed thresholds for artistic quality. A/B paired review wins.

## Classification at this checkpoint
G0 = UNKNOWN, P1/P2 = NOT_STARTED, consumer integration = NOT_AUTHORIZED.
One next gate: G0 exact /reanimate site proof on original owned clip.
