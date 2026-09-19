# Batch EyeRig Atlas · RETURN

Date: 2026-09-19  
Status: IMPLEMENTED CANDIDATE · PUBLIC BROWSER PROOF PASS · SOURCE-FACE IDENTITY GATE OPEN  
Owner: KFB ToolBox / Rigging

## CURRENT OVERRIDE · SOURCE COMPONENT IDENTITY MISMATCH

The explicit source-measured preview is now implemented and browser-proven, but its **visual result contradicts the earlier source-face interpretation**.

Latest source branch head: `fd7a123b3747f74f79b2759e1cbb48fc64f823f0`  
Latest Stage proof head: `26810dbc2f5a2d1f650c485b31f08bc2f4b0f8d5`  
GitHub Actions run: `35460179569`  
Result: **21/21 PASS · 6 screenshots · 0 runtime/page errors**  
Artifact: `10589418791` · digest `sha256:bea3014475b594ea9099897a30338af336579f6ca836327be4cb963f249cb450`

The new **Use source-measured baseline** action is explicit and reversible:

- explicit apply = exact measured values `dx=0.84913 · dy=-0.05142 · ring=0.06925`;
- status stays `AUTO_CANDIDATE`;
- `Reset seed` restores exactly `dx=0.345 · dy=-0.10 · ring=0.30`;
- no automatic approval and no default seed promotion.

### Visual contradiction

Screenshot `00-source-measured-baseline.png` shows the EyeRig spheres from the measured component-6/7 baseline far laterally, near the ear region. At the same time, black eye-like source forms remain visible in the central face under the brows.

Therefore the measured values are **diagnostic evidence only**. They are **not a recommended tuning seed**.

The earlier handover statement “GothGirl eyes = components 6 + 7” is now **UNVERIFIED / CONTRADICTED BY CURRENT VISUAL EVIDENCE** until the 12 head components are isolated and identified in the current source.

Possible explanations remain hypotheses, not conclusions:

1. components 6 + 7 are not the current visible eye pair;
2. the component → FaceHost coordinate interpretation is wrong;
3. the remaining central eye-like forms belong to a separate component/material/geometry layer.

### Next gate

Build a bounded **12-component isolation diagnostic** on the unchanged GothGirl source:

`source-only → select component 0…11 → highlight/isolate it → Front / 3/4 / Side evidence → identify actual eyes/lashes/brows/nose/accessories`.

Do **not** continue EyeRig placement tuning, change the cleanup contract, expand to more actors, merge PR #104, or promote Live before this source-face identity gate is resolved.


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

The exact `pages.dev` route was subsequently opened from GitHub Actions Playwright after the deployment marker matched the Stage source snapshot. Final public proof run `35457983922` passed **17/17 checks**, produced **5 screenshots**, and reported **0 page/console errors**. Status is `PUBLIC_VERIFIED = PASS`; this remains Stage, not Live.

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
- public screenshot/browser proof: **PASS · Run 35457983922 · 17/17 · 5 screenshots · Artifact 10589300370**
- Live promotion: **NOT PERFORMED**
- next gate: **Georg opens the direct Stage URL and judges GothGirl Front / 3/4 / Side plus Idle / Walk / Run / Jump.**


## PUBLIC PROOF · FINAL

- Stage source snapshot: `b05172eccf4687cfd2e8523995d39611e62de81d`
- implementation checkpoint: `d900fb99f3b04d52f266febd1501368c5fedd360`
- publication/proof head: `e56ae972d05e06c5112fe2de4314192c3e3c8110`
- GitHub Actions run: `35457983922`
- runtime checks: **17/17 PASS**
- page/console errors: **0**
- screenshot evidence: **5**
- artifact: `kfb-eye-rig-batch-public-stage-proof` · id `10589300370`

Measured public runtime evidence includes:

- source cleanup: 12 connected head components, verified eye components 6 + 7;
- FaceHost: `OK`, head `head`, facing `Zehen`, yaw 0;
- head bounds: `1.422 × 1.549 × 1.307`;
- head-weighted vertices: `1279 / 5019`;
- EyeRig frame: left `[-0.2672,-0.0774,0.5438]`, right `[0.2672,-0.0774,0.5438]`, radius `0.2323`;
- required Idle / Walk / Run / Jump clips available;
- interactions remain clean after expression, view, motion and blink changes.

### Visual finding for Georg

Technical PASS does **not** equal visual approval. The screenshot set shows the default eye geometry is currently too large/protruding for GothGirl, especially in 3/4 and side views. The seed stays `AUTO_CANDIDATE`.

First tuning order:

1. reduce **Eye size / ring** from the current `0.30`;
2. then adjust **Inset**;
3. only then fine-tune **Spacing / vertical**;
4. re-check Front / 3/4 / Side and motion before `Adjusted + approve`.

No Large/Legacy expansion and no Live promotion before Georg's gate.


## HANDOFF ALIGNMENT · FINAL STATUS SURFACES

The proven Stage runtime remains pinned to source snapshot `b05172eccf4687cfd2e8523995d39611e62de81d` with implementation checkpoint `d900fb99f3b04d52f266febd1501368c5fedd360`.

Post-proof routing/status surfaces were aligned without changing the Stage runtime:

- public proof head: `e56ae972d05e06c5112fe2de4314192c3e3c8110`;
- Cloudflare KFB Hub mirror status head: `aaf66bfa4e779c59aa7534998e1650a79551f6e4`;
- main KFB Hub / central router public-proof status commit: `8d534f013710d4aa57d1ca2baa7358b2957c35a5`.

These later commits only surface the verified 17/17 proof and the human tuning gate. They do not alter the EyeRig Stage runtime proven by run `35457983922`.

The authoritative next gate remains: Georg tunes the visible `AUTO_CANDIDATE`, then explicitly approves or rejects. PR #104 remains Draft/Open and unmerged.


## SOURCE-MEASURED SEED PROOF · REPORT ONLY

Branch measurement head: `52768e828192e77b43d57f882594f304bcc79180`  
Cloudflare Stage proof head: `9a3345a01935fe87651ec49cea3afc19715f84ef`  
GitHub Actions run: `35459726128`  
Result: **18/18 PASS · 5 screenshots · 0 runtime/page errors**

The verified source eye components were measured through the skinned actor into FaceHost-local coordinates. The measurement is recorded only as a candidate and is **not automatically applied** to EyeRig.

Measured source baseline:

- component 6 center: `[-0.66145, 0.00424, 0.01785]`, radiusXY `0.04975`;
- component 7 center: `[0.65370, -0.08388, 0.02421]`, radiusXY `0.05750`;
- FaceHost unit: `0.77441`;
- source pair span X: `1.31515`;
- source vertical asymmetry: `0.08812`;
- normalized candidate: **dx `0.84913` · dy `-0.05142` · ring `0.06925`**;
- status: `MEASURED_NOT_APPLIED`.

This explains the current visual mismatch without inventing replacement numbers: the visible seed remains `dx=0.345 · dy=-0.10 · ring=0.30`, which is much larger and substantially tighter than the verified source-eye baseline.

**Next gate remains visual, not numeric approval:** expose the measured baseline as an explicit reversible preview, then Georg compares it against the current candidate before any value becomes an approved EyeProfile.
