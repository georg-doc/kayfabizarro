# TEST REPORT · KFB Animation/Motion SSOT Foundation

Date: 2026-10-03
Repository: georg-doc/kayfabizarro
Branch: chatgpt-web/kfb-animation-motion-ssot-2026-10-03
Draft PR: #331
Tested head: aa0166f166c303443a74c7bbae1b84f181fa0900

## Exact implementation under test

Central owner files:
- tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js
- tools/KFB-ToolBox/kfb-lib/anim-map.v1.js
- tools/KFB-ToolBox/kfb-lib/motion-state-machine.v1.js
- tools/KFB-ToolBox/kfb-lib/MOTION_STATE_CONTRACT.v1.json

Measurement seam:
- tools/KFB-ToolBox/kfb-lib/BLENDER_MEASUREMENT_INTAKE.schema.json
- tools/KFB-ToolBox/kaykit-motion-lab-v1/BLENDER_MEASUREMENT_INTAKE.template.json
- tools/KFB-ToolBox/kaykit-motion-lab-v1/BLENDER_MEASUREMENT_BRIEF.md

## Donor identity

Byte-identical promotions:
- locomotion-profiles.v1.js blob 3db9fbd482e6a527c417e79af826138ff28efa33
- anim-map.v1.js blob 7120f80e25e8a91106441039fb036c059a4d0e0d

No local rewrites of those two donor owners.

## CI

Workflow:
ToolBox Motion State Foundation

Run:
37081685327

Job:
111083374738

Result:
PASS

Checks:
- JavaScript syntax PASS
- JSON contracts PASS
- State-machine tests PASS

Repair history:
- first CI attempt failed only because the test imported kfb-lib from one directory too high;
- repair pass 1 corrected the test import only;
- runtime/state-machine implementation was unchanged by that repair.

## Tested state-machine behavior

PASS:
- measured Walk/Run windows expose the existing narrow gap rather than inventing overlap;
- overlapping measured windows derive hysteresis from the overlap itself;
- missing measurements remain PENDING;
- low forward speed resolves START transition semantics rather than a fake clip;
- backward/strafe derive from real local velocity direction;
- Sprint is gated by sprint intent;
- jump lifecycle overrides horizontal gait without taking trajectory ownership;
- current incomplete profile refuses READY_FOR_PROTOTYPE;
- all forward thresholds derive from profile measurements.

## Status

FOUNDATION_CORE = PASS
BLENDER_RECONCILIATION = OPEN
NEUTRAL_ACTIONFIGURE_PROTOTYPE = NOT YET CLAIMED
TRAVEL/COMBAT INTEGRATION = NOT STARTED
HUMAN MOTION ACCEPTANCE = OPEN


## Checkpoint 2 · Reconciler + Motion Lab SSOT integration

Current tested head:
`3b712d03a8cc9e1fa19bc6bc1d7f1156127ee949`

Workflow:
- ToolBox Motion State Foundation
- run 37082360527
- job 111085430050
- result PASS

Now green together:
- central state-machine tests;
- measurement reconciler tests;
- Motion Lab owner-integration tests.

Motion Lab change:
- removed local `speedBandProposal()` threshold owner;
- auto-state now delegates to `kfb-lib/motion-state-machine.v1.js`;
- UI labels measured-window hysteresis as SSOT-owned;
- snapshot exposes central motion-state owner.

Measurement reconciliation:
- exact KCL-M1 evidence blob pinned byte-identically;
- Blender and KCL values are compared side-by-side;
- no arbitrary tolerance silently selects a winner;
- differing measurements remain UNRESOLVED until explicit resolution.


## Checkpoint 3 · Ladder 02 central convergence

Repository: georg-doc/kayfabizarro
Draft PR: #333
Branch: `chatgpt-web/motion-ssot-convergence-2026-10-03`
Tested head: `aaf7f899caee381ede876a50276e0a3d2aaeb6c8`

### Motion Foundation workflow

Run: `37094212032`
Job: `111120689860`
Conclusion: **SUCCESS**

Steps:
- JavaScript syntax: PASS
- JSON contracts: PASS
- State machine tests: **9/9 PASS**
- Measurement reconciliation tests: **6/6 PASS**
- Ladder 02 central-owner integration tests: **6/6 PASS**
- Motion Lab owner integration tests: **5/5 PASS**
- Exact Ladder 02 reconciliation smoke: PASS

Total Node tests: **26/26 PASS · 0 fail**.

Smoke output:
- exact same-clip cross-check unresolved: 2 (`Walking_A`, `Running_A`);
- same-clip `readyForProfile=false` by design;
- Ladder forward order: `walk, jog, run.easy, run, sprint`;
- `technicalForwardReady=true`;
- `humanAccepted=false`.

### Repository owner checks

- KFB Production Resource Registry R0.1 · run `37094211990` · **SUCCESS**
- Refresh KFB Asset Registry · run `37094211962` · **SUCCESS**

### Repair note

Before this final run, the adapter was corrected to derive handoff playback boundaries from the measured handoff speed divided by each measured natural speed. This avoids creating tiny artificial gaps from the donor JSON's rounded three-decimal display-rate fields.

Final accepted technical head is the repaired head above. No second repair was required.

### Product status

- FOUNDATION_CORE = PASS
- MOTION_LIBRARY_V7_CLOSURE = PASS
- LADDER_02_FORWARD_TECHNICAL = PASS
- HUMAN_LOOK_SELECTION = OPEN
- NEUTRAL_ACTIONFIGURE_PROTOTYPE = NEXT
- WORLD #332 CONSUMER INTEGRATION = AFTER HUMAN PASS
- TRAVEL HOST USE = FORBIDDEN FOR THIS PROTOTYPE


## Checkpoint 4 · Neutral ActionFigure freeplay

Tested implementation head:
`f1ce90d31a18973fa981bc982309c4bb01b204b8`

ActionFigure Motion Freeplay:
- run `37125874478`
- job `111210930976`
- result **SUCCESS**
- real Chromium
- Run 2.132 m/s
- Sprint 3.006 m/s
- Backward 0.489 m/s
- Jump Start airborne at jumpY 0.615
- Jog/Run/Sprint A/B selector switch PASS
- 0 console errors
- 0 page errors
- evidence artifact `11275251740`
- digest `sha256:bc6b663622137cc08e0a7e73cf318f77d9b0bf75336da0bd5de657106adeb236`

Motion State Foundation:
- run `37125874493`
- 9/9 state machine
- 6/6 reconciliation
- 7/7 Ladder 02 integration
- 5/5 Motion Lab owner integration
- **27/27 total PASS · 0 fail**

Resource Registry run `37125874476`: SUCCESS.
Asset Registry Refresh run `37125874484`: SUCCESS.

Exact tested HTML Site mirror:
- file `c3588833-b1c3-4392-8582-1f80a2c55eed`
- SHA-256 `ebb861191bf68d1f46d71730ed6298b160fb18182bab46a322bd60402bf211ad`

Status:
**BROWSER PASS · SITE REVIEW READY · HUMAN LOOK OPEN**.


## HUMAN REVIEW OVERRIDE · 2026-10-03

The technical ActionFigure browser gate passed, but Georg's actual freeplay review is **TOTAL FAIL**.

This changes product status, not the historical automation result.

Observed human failures:
- step-length mismatch;
- locomotion jitter/wobble;
- arms too tight / inside torso;
- unclean transitions;
- unclean jump behaviour;
- jerky animation timing.

Final classification:
- browser automation: PASS (historical evidence)
- motion product candidate: FAIL
- candidate: `ARCHIVED_FAILED_CANDIDATE`
- mixed Ladder-02 primary gait family: REJECTED
- Repair 3: forbidden
- next test surface: Blender-native KayKit baseline only

Next gate:
`KAYKIT-NATIVE-BLENDER-BASELINE-01`.
