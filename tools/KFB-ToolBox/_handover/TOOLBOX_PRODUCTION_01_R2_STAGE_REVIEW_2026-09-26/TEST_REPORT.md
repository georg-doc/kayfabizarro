# TEST REPORT · TOOLBOX-PRODUCTION-01 r2 Stage Review

Date: 2026-09-26  
Repo: `georg-doc/kayfabizarro`  
Owner: existing ToolBox PR #185 / `chatgpt-web/toolbox-source-lock-2026-09-23`  
Review branch: `chatgpt-web/toolbox-r2-stage-review-2026-09-26`  
Draft PR: #220  
Frozen implementation candidate head: `cab463b6a4b9bfd9cc365694ff462b39bc493b8e`  
Planned Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/production-01-r2/`  
Publication status: **NOT PUBLISHED / NOT PUBLIC_VERIFIED**

## Gate result

**FAIL / FROZEN after two browser-gate attempts.**

No third repair pass is authorized in this slice. The candidate stays preserved for a fresh recovery slice.

## What the browser gate actually proved

Both attempts loaded the real pinned owners and the real source actor in Chromium, not fallback geometry:

- ToolBox PoseRig + locomotion owner: `5dcf34bcdf9d87445e927c98f60d41adae72f00e`;
- FrizzleBob EarRig-v5 / Ear Dangle owner: `19088b142c6a7e7626f27fba8e80caf6ab2437c1`;
- KayKit Rig_Medium animation source pin: `b97b5ac55df2724fae623992433685583eece51e`;
- exact actor: `FB_TEMPLATE_LOOK_v5.glb`;
- three KayKit packs loaded: General **15**, MovementBasic **11**, MovementAdvanced **13** clips;
- shared PoseRig built;
- EarRig chains found: L **3 bones**, R **3 bones**;
- fixed right lower-arm chain measured **0.3162 m**, versus naive wrist-child length **0.0738 m**;
- direct shared-IK test reached its displaced target with **0.0822 m miss** after a **0.2184 m** target displacement;
- no browser page errors and no failed source/module requests in either recorded pass;
- desktop canvas: **1440 × 900**;
- mobile shell: **390 × 844**, no horizontal overflow.

Those facts are technical evidence only. They do not constitute Georg visual acceptance.

## Attempt 1

Actions run: **36198735113**  
Job: **108280429921**  
Candidate head: `688ec29ad4e59de93c0e0cb6bfc00d81f80452f5`  
Result: **28/29 PASS · FAILURE**

Single failed assertion:

- `profile-driven actor actually moves`: **0.000 m**.

Cause isolated from the test trace:

- entering State mode started `idle`;
- the sequence then started with `idle` again;
- the sampling window therefore had not reached a moving semantic role.

Artifact:

- name: `toolbox-production-01-r2-stage-evidence`
- artifact ID: **10891651306**
- files: `source.png`, `state.png`, `pose-ik.png`, `mobile.png`.

## Repair pass

One bounded repair only:

- State review now starts immediately on measured semantic `walk`;
- sequence continues `walk.fast → run → sprint → run → walk → idle`;
- no owner/module/pin changed.

Repair commit / frozen implementation head:
`cab463b6a4b9bfd9cc365694ff462b39bc493b8e`.

## Attempt 2

Actions run: **36198914554**  
Job: **108280990960**  
Candidate head: `cab463b6a4b9bfd9cc365694ff462b39bc493b8e`  
Result: **28/29 PASS · FAILURE**

The previous failure is repaired:

- `profile-driven actor actually moves`: **PASS · 0.299 m**.

New single failed assertion:

- `semantic transitions occur`: expected at least 2, observed **1** in the fixed 3.3 s sample window.

The exact actor remained on semantic `walk`; all owner/source/IK/mobile assertions still passed.

Artifact:

- name: `toolbox-production-01-r2-stage-evidence`
- artifact ID: **10891561981**
- SHA-256 reported by Actions: `6b96cc55f84e261921701c22c27f1487e069d6e23ba988a88b27995422cabf65`
- files: `source.png`, `state.png`, `pose-ik.png`, `mobile.png`.

## Visual evidence review

The screenshots expose an additional human-review defect that is not represented by the 29 assertions:

- the camera is framed too tightly;
- the top of FrizzleBob's head and the EarRig-v5 ears are cropped in Source, State and Pose/IK;
- the mobile screenshot is even tighter;
- therefore the proposed EarRig-v5 source-isolation review is not visually adequate even though the correct source object is loaded.

This is a review-surface failure, not evidence that the underlying PoseRig, locomotion profile or Ear Dangle owners are broken.

## Stop condition

This gate has now produced two failed browser attempts in the same bounded slice. Per KFB recovery protocol:

- **stop repair work here**;
- preserve candidate head `cab463b6a...`;
- do not publish the planned Cloudflare Stage route;
- do not add a KFB Hub human-test link;
- do not merge PR #220;
- do not alter PR #185 owner modules to make the review test pass.

## Fresh-slice recovery target

A fresh review-surface slice may resume from the preserved candidate and should address only:

1. deterministic semantic-state timing in the browser proof, without weakening the assertion;
2. actor-fit camera framing that keeps the complete EarRig-v5 silhouette visible on desktop and mobile;
3. then repeat the exact source-first → State → Pose/IK proof;
4. only after green browser proof, publish the direct Cloudflare Stage and link it from KFB Hub.

Underlying ToolBox r2 owner rehome remains technically green at owner head `5dcf34bc...`; this failure does not roll it back.
