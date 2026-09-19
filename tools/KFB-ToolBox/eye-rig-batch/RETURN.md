# Batch EyeRig Atlas · RETURN

Date: 2026-09-19  
Status: IMPLEMENTED CANDIDATE · STATIC PASS · PUBLIC VISUAL GATE PENDING  
Owner: KFB ToolBox / Rigging

## SOURCE

Repository: `georg-doc/kayfabizarro`  
Branch: `toolbox/eye-rig-batch-2026-09-18`  
Implementation checkpoint: `d900fb99f3b04d52f266febd1501368c5fedd360`  
Draft PR: `#104` · `https://github.com/georg-doc/kayfabizarro/pull/104`  
Merge base: `5650b6c54d8789b20ea80abe857688173d506d3b`  
Concurrent `main` observed during handoff: `ebed22c4245bdbd9541ad8287028f773bc08d66e`

Current `main` still contains only the preparatory EyeRig README at this path. The candidate does not overwrite parallel work.

## DECISION

First bounded proof = **GothGirl / Rig_Medium**.

Reason: the repository already proves this actor's structural class and the exact source-face cleanup precedent: one head mesh with 12 connected components, original eyes at components 6 + 7. This lets the first proof test the EyeRig mount instead of simultaneously inventing a generic source-eye detector.

The runtime preserves existing ownership:

- EyeRig v6 owns eyes/lids/gaze/blink/life/kinetics;
- FaceHost v1 owns measured arbitrary-biped face host construction;
- actor `AnimationMixer` remains the only skeleton animation owner;
- source GLB/GLTF remains immutable.

## IMPLEMENTATION

Added the first browser workbench:

- `index.html`
- `styles.css`
- `app.js`
- `lib/kaykit-eye-adapter.v1.js`
- `lib/source-face-cleanup.v1.js`
- `data/gothgirl.seed.json`
- `docs/SOURCE_AUDIT.md`
- `tests/static-check.mjs`

Workbench capabilities:

- source-only / cleaned-source / EyeRig compare toggles;
- front, both 3/4, both side and face camera views;
- placement controls: spacing, vertical, size, inset, splay, lidFit;
- pupil style/size/gloss, track, converge and explicit gaze;
- stable expressions: neutral, happy, angry, sad, surprised, thinking;
- manual blink;
- life / wander / tremor;
- kinetics preview;
- bind/T, Idle, Walk, Run and Jump regression buttons;
- one-mixer policy;
- single profile + reviewed-batch export;
- schema/revision-validated non-destructive import preview;
- reset seed + revert last approved;
- review actions.

Source-eye cleanup is runtime-only and fail-closed: if GothGirl no longer measures exactly 12 head components, components 6 + 7 are **not** hidden and the tool reports human review required.

## TESTED RESULT

- static contract tests: **22 / 22 PASS**
- JS syntax: **3 / 3 PASS**
- GitHub persistence/readback: **PASS**
- local Chromium renderer: **ENVIRONMENT_UNAVAILABLE**, two attempts failed at EGL/X initialization before application boot
- public visual behavior: **NOT_TESTED** until Cloudflare Stage is opened

See `TEST_REPORT.md` for exact gates.

## PUBLIC DEPLOYMENT

Designated Stage route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Publication owner/bridge: `cloudflare-live`.

Stage mirror is written on `cloudflare-live` at `f309948a3bd265154e6d3f5c959b69ec9b725f26`, and the KFB Hub card links directly to the route. Main router/Hub metadata is current at `ac067d09919f744750649e3652dd00036d7ccd6f`.

The exact `pages.dev` route could not be opened from the available verification environments: the web fetcher reports it inaccessible and the container cannot resolve `kayfabizarro.pages.dev`. Status is therefore `PUBLICATION_BRANCH_WRITTEN / PUBLIC_VERIFIED OPEN`, not Live.

## GEORG ACCEPTANCE

OPEN.

Human test question:

**Does GothGirl visibly retain her own KayKit head while the verified original eye components are removed cleanly and KFB EyeRig v6 sits correctly through Front / 3/4 / Side plus Idle / Walk / Run / Jump?**

Then tune placement only as needed and use `Approve` or `Adjusted + approve`.

## OPEN

1. open the exact Cloudflare Stage URL in a normal browser and confirm the visible `candidate f23b2f6 · PR #104 · Stage` marker;
2. Georg visual/tuning gate on source-eye cleanup, eye placement and motion attachment;
3. only after Medium approval expand the calibration sample;
4. no Rig_Large or Legacy implementation before the Medium gate.

## ARCHIVED HISTORY

The interrupted connector operation produced one unreferenced Git blob before commit. Recovery re-read the branch and target directory first; no partial runtime file had entered the branch, so work resumed from checkpoint `c4dd0c8` without duplicate writes.

Dropbox search found historical PetStudio / Vehicle+Rigging / Stunt-Race exports. None superseded current GitHub state; Dropbox remains secondary reference only for this slice.


## FINAL HANDOFF METADATA

- source PR: **#104 · DRAFT · OPEN · NOT MERGED**
- publication mirror: `cloudflare-live@f309948a3bd265154e6d3f5c959b69ec9b725f26`
- main router / KFB Hub metadata: `ac067d09919f744750649e3652dd00036d7ccd6f`
- screenshots: **none** — both local Chromium passes failed before app boot at the container EGL/X boundary
- public screenshot/browser proof: **OPEN**
- Live promotion: **NOT PERFORMED**
- next gate: **Georg opens the direct Stage URL and judges GothGirl Front / 3/4 / Side plus Idle / Walk / Run / Jump.**
