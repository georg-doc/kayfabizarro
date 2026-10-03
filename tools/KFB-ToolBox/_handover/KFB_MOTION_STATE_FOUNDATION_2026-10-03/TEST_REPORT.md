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
