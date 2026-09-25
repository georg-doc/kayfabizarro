# RETURN · TOOLBOX-PRODUCTION-01 r2 Stage Review

Date: 2026-09-26

## Exact state

Repo: `georg-doc/kayfabizarro`  
Runtime owner: PR **#185** · `chatgpt-web/toolbox-source-lock-2026-09-23`  
Frozen review PR: **#220 · Draft**  
Review branch: `chatgpt-web/toolbox-r2-stage-review-2026-09-26`  
Frozen implementation candidate: `cab463b6a4b9bfd9cc365694ff462b39bc493b8e`

Review candidate:
`kfb-hub/stage/toolbox/production-01-r2/index.html`

Planned human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/production-01-r2/`

Publication: **HOLD · route was not published**.

## Delivered before stop

The bounded review consumer was implemented without creating another runtime owner:

- source-first isolated `FB_TEMPLATE_LOOK_v5.glb`;
- semantic ToolBox locomotion profile consumption;
- exact KayKit General / MovementBasic / MovementAdvanced clips;
- exact shared PoseRig + public hand IK;
- exact EarRig-v5 Ear Dangle consumer;
- one dominant 3D canvas with compact controls;
- desktop + mobile browser evidence screenshots.

## Evidence

Attempt 1:
- run **36198735113**
- job **108280429921**
- **28/29 PASS**
- failure: sampled movement **0.000 m**
- artifact **10891651306**

Attempt 2 after one bounded State-entry repair:
- run **36198914554**
- job **108280990960**
- **28/29 PASS**
- movement now **PASS · 0.299 m**
- failure: semantic transition count **1**, expected ≥2
- artifact **10891561981**

Stable proof across both runs:
- General **15**, MovementBasic **11**, MovementAdvanced **13** clips load;
- PoseRig builds;
- right lower-arm chain **0.3162 m** vs naive **0.0738 m**;
- EarRig L/R = **3 + 3 bones**;
- IK displaced target **0.2184 m**, final miss **0.0822 m**;
- zero browser page errors;
- zero failed source/module requests;
- desktop stage **1440×900**;
- mobile **390×844**, no horizontal overflow.

See `TEST_REPORT.md` for the complete assertion history.

## Screenshot proof / visual finding

Each run produced:
- `source.png`
- `state.png`
- `pose-ik.png`
- `mobile.png`

The real actor is visible and the review no longer has the old AN-PROFILE palette wall. However, the screenshots expose an additional blocking visual defect: camera framing crops the head top and EarRig-v5 ears; portrait framing is worse.

Therefore the candidate is **not suitable for Georg's human EarRig/source review yet**.

## Writes in this slice

Implementation:
- `kfb-hub/stage/toolbox/production-01-r2/index.html`

Tests:
- `.github/workflows/toolbox-production-01-r2-stage-review.yml`

Failure recovery:
- `tools/KFB-ToolBox/_handover/TOOLBOX_PRODUCTION_01_R2_STAGE_REVIEW_2026-09-26/TEST_REPORT.md`
- `.../RECOVERY.md`
- `.../RETURN.md`
- `.../START_HERE.md`

## Explicitly not changed

- no PR #185 owner rollback or workaround;
- no copy/fork of Ear Dangle;
- no WorldBuilder runtime;
- no Travel/Race owner;
- no `cloudflare-live` publication;
- no KFB Hub test link;
- no Live promotion;
- no merge.

## Unresolved

1. deterministic semantic transition evidence in the Stage browser proof;
2. complete actor/ears camera framing on desktop;
3. complete actor/ears camera framing on mobile;
4. public Cloudflare Stage proof;
5. Georg human review.

## Exactly one next gate

**Fresh ToolBox-r2 Stage Review Recovery slice** using the preserved candidate: fix only deterministic transition observation + full actor/ear framing, then rerun the same source-first browser proof. Do not begin World r2 integration before that review surface reaches its human gate.
