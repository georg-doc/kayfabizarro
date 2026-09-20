# Batch EyeRig Atlas · Test Report

Date: 2026-09-19  
Owner: KFB ToolBox / Rigging  
Source branch: `toolbox/eye-rig-batch-2026-09-18`  
Implementation checkpoint: `d900fb99f3b04d52f266febd1501368c5fedd360`

## STATIC / CONTRACT TESTS

Executed locally against the exact candidate files before GitHub persistence:

- static contract suite: **22 / 22 PASS**
- JavaScript syntax checks: **3 / 3 PASS**
  - `app.js`
  - `lib/kaykit-eye-adapter.v1.js`
  - `lib/source-face-cleanup.v1.js`

The 22 gates cover:

1. required file presence;
2. one localStorage namespace: `kfb.toolbox.eye-rig-batch.v0`;
3. no `localStorage.clear()`;
4. pinned source revision;
5. EyeRig `update(dt)` in the rendered frame loop;
6. exactly one `THREE.AnimationMixer` constructor;
7. source-eye cleanup fails closed;
8. cleanup reuses `faceShells()` + `buildStripped()`;
9. no GLTF/GLB exporter or canonical source write;
10. lashes forced off;
11. neutral expression + settle ticks before visible-ready;
12. all six existing expression IDs;
13. front / 3/4 L / 3/4 R / side L / side R / face cameras;
14. bind / idle / walk / run / jump motion buttons;
15. non-destructive profile import preview;
16. no promotion to a global `kfb.eye-profile/1` schema.

## GITHUB PERSISTENCE CHECK

After commit `d900fb9`, the branch head and all six runtime/test paths were fetched back through GitHub.

Git blob identity against the tested local candidate:

- `app.js`: exact blob match;
- `lib/kaykit-eye-adapter.v1.js`: exact blob match;
- `lib/source-face-cleanup.v1.js`: exact blob match;
- `tests/static-check.mjs`: exact blob match;
- `index.html`: exact after removing only the terminal newline;
- `styles.css`: exact after removing only the terminal newline.

No semantic difference was introduced by the connector write.

## BROWSER PASSES

Two Chromium attempts were made from the available container:

### Pass 1 · normal headless Chromium

Result: **BROWSER_ENVIRONMENT_UNAVAILABLE** before application execution.

Observed renderer startup errors included:

- `DisplayVkXcb xcb_connect failed`;
- `EGL_NOT_INITIALIZED`;
- GPU process exit / timeout before the page reached the EyeRig runtime.

### Pass 2 · software / SwiftShader attempt

Result: **BROWSER_ENVIRONMENT_UNAVAILABLE** before application execution.

The same EGL/X initialization boundary occurred. Per the two-pass recovery rule, no further local renderer repair was attempted.

This is **not** recorded as an application/browser FAIL because the app did not reach boot. It is also **not** a browser PASS.

## CURRENT TEST STATUS

| Gate | Result |
|---|---|
| static contract suite | PASS · 22/22 |
| JS syntax | PASS · 3/3 |
| GitHub persistence | PASS |
| local Chromium renderer | ENVIRONMENT_UNAVAILABLE · 2/2 pre-app failures |
| exact Cloudflare Stage URL | NOT_TESTED |
| visible 12-component source-face report | NOT_TESTED |
| visible FaceHost `OK` report | NOT_TESTED |
| neutral/open EyeRig visual boot | NOT_TESTED |
| blink / gaze / six-expression visual behavior | NOT_TESTED |
| locomotion attachment regression | NOT_TESTED |
| profile import/export interaction in browser | NOT_TESTED |

The next valid visual gate is the normal-browser Cloudflare Stage route, not another container Chromium workaround.


## PUBLICATION CHECKPOINT

Stage mirror commit: `f309948a3bd265154e6d3f5c959b69ec9b725f26` on `cloudflare-live`.

The publication branch was fetched back after the write and contains:

- the Stage HTML with visible `candidate f23b2f6 · PR #104 · Stage`;
- byte-identical runtime blobs for `app.js`, CSS, adapter and source-face cleanup;
- the GothGirl seed and source audit;
- a KFB Hub card linking directly to the Stage route.

Main router/Hub metadata was updated separately at `ac067d09919f744750649e3652dd00036d7ccd6f` without merging EyeRig implementation code.

Exact public route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Public verification attempt result: **ENVIRONMENT_UNAVAILABLE**. The web fetcher reports the `pages.dev` route as inaccessible, and the execution container reports temporary DNS resolution failure for `kayfabizarro.pages.dev`. No `PUBLIC_VERIFIED` claim is made.

This is now a **human browser gate**, not another source-code repair pass.


## FINAL PUBLIC BROWSER PROOF · PASS

Final proof run: `35457983922`  
Publication head: `e56ae972d05e06c5112fe2de4314192c3e3c8110`  
Exact route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Result: **17 / 17 PASS** with **5 screenshots** and **0 page/console errors**.

The Playwright proof verified:

- exact deployment marker for PR #104 / Stage source snapshot `b05172e` / implementation `d900fb9`;
- HTTP 200;
- expected page title and visible revision marker;
- no boot error;
- source / cleanup / FaceHost / EyeRig / motion gates all true;
- GothGirl head = exactly 12 connected components;
- verified source eye components = 6 + 7;
- FaceHost = `OK`, head bone `head`, facing source `Zehen`, yaw 0;
- EyeRig eyeFrame present;
- Idle / Walk / Run / Jump clips present;
- runtime remains clean after happy + Idle + 3/4, thinking + Run + side, surprised + Jump + front, and Blink;
- 832px review layout rendered without runtime errors.

Artifact:

- name: `kfb-eye-rig-batch-public-stage-proof`
- artifact id: `10589300370`
- digest: `sha256:db0ab0d5238d1e97890df21ea43333f1d6fd90aecafa5ae993b5c072b42dd16e`
- screenshots:
  - `01-front-bind.png`
  - `02-three-quarter-happy-idle.png`
  - `03-side-thinking-run.png`
  - `04-front-surprised-jump.png`
  - `05-832-review.png`

### Visual sanity, not acceptance

The screenshots prove the rig is present and attached across the tested views/motions. They also show that the current geometry seed is **not yet visually approved**: `ring=0.30` produces oversized/protruding eyes, especially in the 3/4 and side evidence.

This is intentionally left as `AUTO_CANDIDATE`. Georg's next pass should reduce eye size first, then tune inset/spacing before approving the profile.


## SOURCE-MEASURED SEED · PUBLIC REPORT-ONLY PROOF

Run: `35459726128`  
Stage head: `9a3345a01935fe87651ec49cea3afc19715f84ef`  
Result: **18 / 18 PASS**, **5 screenshots**, **0 runtime/page errors**.

Additional gate added to the previous 17-check suite:

- `source-measured seed report-only` = PASS;
- exact source components 6 + 7 transformed through skinned vertices → world → FaceHost-local;
- candidate values: `dx=0.84913`, `dy=-0.05142`, `ring=0.06925`;
- measurement status: `MEASURED_NOT_APPLIED`;
- visible EyeRig seed remained unchanged during this proof.

Artifact:
- id: `10589617618`
- digest: `sha256:11202846c592b0147584b12b31629eada4f097c2ac45c8194312b7acb73e82fe`
- name: `kfb-eye-rig-batch-public-stage-proof`.


## EXPLICIT MEASURED-BASELINE ACTION · PUBLIC PROOF

Run: `35460179569`  
Stage head: `26810dbc2f5a2d1f650c485b31f08bc2f4b0f8d5`  
Source head: `fd7a123b3747f74f79b2759e1cbb48fc64f823f0`  
Result: **21 / 21 PASS**, **6 screenshots**, **0 runtime/page errors**.

New verified interaction gates:

- measured-baseline button available: PASS;
- explicit apply: PASS — exact `dx=0.84913 · dy=-0.05142 · ring=0.06925`;
- candidate state remains `AUTO_CANDIDATE`: PASS;
- reset seed restores exact `dx=0.345 · dy=-0.10 · ring=0.30`: PASS;
- prior source / cleanup / FaceHost / EyeRig / motion / interaction gates remain PASS.

Artifact:
- id: `10589418791`;
- digest: `sha256:bea3014475b594ea9099897a30338af336579f6ca836327be4cb963f249cb450`;
- screenshots: **6**, including `00-source-measured-baseline.png`.

### Visual evidence gate · NOT PASS

The explicit action is technically correct, but the resulting screenshot does **not** validate components 6 + 7 as the visible eye source.

Observed in `00-source-measured-baseline.png`:

- measured EyeRig spheres land far laterally near the ear region;
- black eye-like source forms remain central under the brows.

Classification:

`TECHNICAL ACTION PASS · SOURCE-FACE IDENTITY UNRESOLVED · VISUAL ACCEPTANCE OPEN`.

No further placement tuning should treat `0.84913 / -0.05142 / 0.06925` as a recommended seed until current source components are isolated and visually identified.


## 2026-09-19 · SOURCE COMPONENT IDENTITY RESOLUTION · CORRECTED 2+3

Source identity checkpoint: `949ff8037df2da88eb91ef825984ef57870b8238`  
Stage publication head: `c6489fce74f98b2124feb184becd27d2cbe4a922`

### Exact source geometry

The pinned current `GothGirl.glb` blob `b56f67e4ddb7db95ff54fef526148a49289f3915` was parsed with the same 1e-3 welded connected-component rule as `faceShells()`.

Result: **12 / 12 components resolved**.

- eye pair: **2 + 3** · 69 tris each · frontal and mirrored;
- nose: **1**;
- ears: **4 + 5**;
- lateral accessories: **6 + 7 + 8**;
- hair: **9**;
- brows: **10 + 11**.

The previous 6+7 interpretation is therefore archived as **wrong source identity / useful diagnostic history**. It correctly explained why the old measured preview landed near the ears.

### Static / contract replay

Against the exact persisted branch files after the correction:

- **28 / 28 PASS**;
- one mixer owner preserved;
- EyeRig `update(dt)` preserved;
- donor `faceShells()` + `buildStripped()` reuse preserved;
- source cleanup remains fail-closed;
- corrected eye pair 2+3 is guarded by current-GothGirl triangle/bounds signature;
- 12-card source projection evidence present;
- no source GLB write and no global schema promotion.

The earlier **3/3 JavaScript syntax PASS** belongs to the pre-identity implementation checkpoint. A new Node-module syntax run was not available in this connector-only pass and is **NOT_RERUN**, not silently carried forward.

### Publication / browser status

The corrected 2+3 candidate was mirrored to `cloudflare-live@c6489fce74f98b2124feb184becd27d2cbe4a922`.

Direct routes:

- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/docs/source-components-0-11.html`

The connector push did not create a new GitHub Actions run, and the current web environment cannot open `pages.dev`. Therefore the corrected build is **PUBLISHED / READBACK PASS / PUBLIC_VERIFIED OPEN**.

No claim is made that the corrected measured 2+3 EyeRig placement is visually accepted yet.


## 2026-09-19 · RIG_MEDIUM DEFAULT CALIBRATION · SCREENSHOT QA PREP

Implementation checkpoint: `6f7d7988849cf0c74a6551a33ee422d8584c87c2`  
QA/test checkpoint: `ef7a8f203762f670e00ccdd27b540703d855807d`  
Stage publication head: `786568b1e4434f458379c3aa5f8a83f3fd82a8d9`

### User visual finding

The supplied 3/4 screenshot establishes the rejected baseline:

- eyeballs are much too large / protruding;
- pupils are too large;
- lid shells read yellow rather than as part of the face.

### Calibration source

The existing tuned GothGirl JSON is pinned at blob `e87e6337a6db67096a9577335f36d60672aa389e`.

Relevant actor values:

- eye `dx=0.49`;
- eye `ring=0.32`;
- `pupilSize=0.34`;
- face color `#e6cbc3`;
- lid policy `base-darkened`.

Because the old GothGirl JSON and current FaceHost use different normalized spaces, `ring=0.32` is not copied directly. The current Rig_Medium candidate preserves the tuned visual proportion:

`ring / dx = 0.32 / 0.49 = 0.653061224`

and maps it to the current measured source-eye spacing:

`ring = sourceMeasured.dx × 0.653061224`.

The file seed uses `ring=0.20` only as a pre-measurement boot fallback. Pupil default is `0.34`.

### Lid color

The adapter now passes the actor's face base color into the existing EyeRig v6 `_lidColor()` path. For GothGirl the base is `#e6cbc3`; EyeRig performs the existing darkening operation. The previous yellow fallback is no longer the current actor default.

### Tests

Focused calibration checks: **17/17 PASS**.

Persisted repository static suite after QA additions: **37/37 PASS**.

Changed-JS syntax parse:
- `app.js`: PASS;
- `lib/kaykit-eye-adapter.v1.js`: PASS.

This syntax parse strips import/export statements before parsing; it is not relabeled as a Node module execution.

### QA loop

The workbench now provides **QA 4-view**, producing one `gothgirl-qa-front-3q-side.png` contact sheet with:

1. Front;
2. ¾ L;
3. ¾ R;
4. Side R.

QA questions are fixed in `docs/QA_EYE_CALIBRATION_LOOP_2026-09-19.md`: eye scale, pupil scale, lid/skin relationship, attachment/silhouette.

### Public status

The Stage mirror is persisted and read back at `786568b1e4434f458379c3aa5f8a83f3fd82a8d9`.

GitHub Actions did not start from the connector write, and the current web tool cannot open `kayfabizarro.pages.dev`. Therefore:

`PUBLISHED · GITHUB_READBACK_PASS · PUBLIC_VERIFIED_OPEN · GEORG_ACCEPTANCE_OPEN`.

No new screenshot artifact is claimed until the fixed Stage is actually opened.


## 2026-09-19 · MEDIUM AUTHORING SEED + STUDIO CONTROL INTEGRATION

Implementation checkpoint: `c74cbd6e0691d0bd3bcc574203219cdb0e9f647f`  
Evidence checkpoint: `eeb79850a8142968c418e23b482a330f120dd9c2`  
Stage publication: `40133c8b2d6d8f210003a6ef7cfa793aebac63bf`

### User-approved authoring seed

Georg's tuned browser configuration is now the `Rig_Medium` **authoring default**:

- spacing `0.295`;
- vertical `0.045`;
- eye size `0.153`;
- inset `0.40`;
- splay `0`;
- lid fit `0.90`;
- pupil size `0.34`;
- track `0.15`;
- converge `0.18`;
- gloss `0.10`;
- lids = actor face base, darkened by the existing EyeRig-v6 lid path.

The former automatic source-measurement calibration is no longer allowed to override this default. Source measurement remains available through the explicit **Use source-measured baseline** action only.

### Studio controls integrated

- reused existing `frizzlegraft-v1/eyeoval.v1.js`;
- added Width / Height / Depth / inward Tilt;
- added explicit pupil tracking modes **Life / Pointer / Fixed** on top of existing EyeRig-v6 `setGazeFollow()` + `pointTo()`;
- added persistent Batch bar:
  - Import
  - Export Character
  - Export Batch
  - Apply to Selected
  - Reset
  - Approve
- batch schema: `kfb.eye-profile-batch/0.2-candidate`;
- inheritance order: `rigClass → character → session`;
- current bounded roster still loads only GothGirl; multi-select architecture is present, class expansion is not claimed.

### Tests

Persisted branch replay: **46/46 PASS**.

Focused implementation pass: **15/15 PASS**.

Changed-JS syntax:
- `app.js`: PASS;
- `lib/kaykit-eye-adapter.v1.js`: PASS.

Protected boundaries remain PASS:
- one `AnimationMixer`;
- no GLB/GLTF writer;
- source cleanup still 2+3 and fail-closed;
- no global `kfb.eye-profile/1` promotion;
- no Large/Legacy runtime expansion.

### Stage / browser status

The fixed Stage mirror is persisted and read back at `40133c8b2d6d8f210003a6ef7cfa793aebac63bf`.

The updated public proof now checks authoring defaults, Oval, tracking modes, Apply-to-Selected, Batch export/import roundtrip and the existing four-view QA download.

A new Actions run did **not** start from the connector push, and the current web tool cannot open the exact `pages.dev` route.

Status:

`PUBLISHED · GITHUB_READBACK_PASS · PUBLIC_VERIFIED_OPEN · GEORG_STAGE_ACCEPTANCE_OPEN`.


## 2026-09-19 · RIG_MEDIUM ACTOR BROWSER

Implementation checkpoint: `5f2e981cbcf4ca72a6c186c96ed008be535856a9`  
Evidence checkpoint: `fa7fdb5b9c5b9c4d443e4f19f47260f934c90147`  
Stage publication: `ae61e50d525e942a755cf46d0ed807b49b5a3e38`

### Catalog

The one-actor GothGirl proof has been expanded to a **27-entry Rig_Medium actor catalog**.

Catalog:
`data/rig-medium-actors.v0.json`

Evidence:
`docs/RIG_MEDIUM_ACTOR_BROWSER_2026-09-19.md`

The catalog reuses current KFB evidence from Animation Lab, Resident Atlas, resource registry and Frankensteining donors. All entries declare `Rig_Medium` / 23 joints and have unique actor IDs.

### Runtime workflow

The workbench now supports:

- real model switching from the left roster;
- filters: All / Unreviewed / Adjusted / Unsupported;
- per-actor EyeProfile persistence;
- review states:
  - UNREVIEWED
  - ADJUSTED
  - APPROVED
  - ADJUSTED_APPROVED
  - UNSUPPORTED
  - REJECTED
- **Next unreviewed**;
- shared Rig_Medium animation packs loaded once;
- one current actor mixer at a time;
- selected-actor batch export/application.

### Cleanup generalization

GothGirl retains its exact verified 2+3 source-eye rule.

Other actors reuse the existing `frizzlegraft-v1/donoreyes.v1.js` mirrored-front-pair detector through `medium-source-eye-cleanup.v1.js`.

The generic path is fail-closed:

- no head-named indexed skinned mesh → HUMAN_REQUIRED;
- no valid mirrored front pair → HUMAN_REQUIRED;
- strip failure → HUMAN_REQUIRED;
- in every failure case source geometry remains intact.

### Tests

Persisted branch replay after implementation: **62 / 62 PASS**.

Focused actor-browser candidate checks: **14 / 14 PASS**.

Syntax parse:
- `app.js`: PASS;
- `lib/medium-source-eye-cleanup.v1.js`: PASS;
- `lib/kaykit-eye-adapter.v1.js`: PASS.

The tests cover the 27 unique Medium entries, exact GothGirl cleanup preservation, generic donor reuse, fail-closed behavior, dynamic loader, per-actor profiles, review states, filters and Next unreviewed.

### Stage status

The actor browser is mirrored to:
`cloudflare-live@ae61e50d525e942a755cf46d0ed807b49b5a3e38`.

The Stage workflow was extended to smoke-switch GothGirl → Clown → Ninja → Magical Girl → GothGirl and verify source / FaceHost / EyeRig stability while allowing generic cleanup to report manual review.

No new Actions run was started by the connector write, and the current web tool cannot open the fixed `pages.dev` route.

Classification:

`PUBLISHED · GITHUB_READBACK_PASS · PUBLIC_VERIFIED_OPEN · HUMAN_REVIEW_WAVE_OPEN`.


## 2026-09-19 · RIG_LARGE MONSTROSITY CALIBRATION

Implementation: `a843a9e9666d2d0d7d0c6a95f801a969f57941c3`  
Evidence: `e60f1db1e2436f11549e44def25ab9b2718eac3b`  
Stage: `670e11d56fe5b85e6264d8a294868c32540db5c6`

- Large catalog: **4 actors** — Monstrosity, Black Knight, Demon Lord, Orc Brute.
- All four exact GLBs report a 23-joint skin named `Rig_Large`.
- Monstrosity is the explicit first calibration actor.
- No accepted Large class default exists initially.
- The initial eye values are only a visible calibration start.
- `Set as Large default` is available only on Monstrosity.
- `Apply to Selected` remains blocked until that explicit promotion.
- Large uses its own General + MovementBasic files.
- Large supports Idle / Walk / Run in this slice; Jump is disabled because the Large library does not contain `Jump_Full_Short`.
- Medium and Large defaults/selections/current actors persist separately.

Tests: **82/82 PASS**.  
Runtime-critical JS syntax: **3/3 PASS**.

Stage files were written and read back successfully. Browser-side class-switch proof is prepared; no new automated browser run started from this write.


## 2026-09-20 · COMMON ACTOR LOADER FIX

The recurring `Cannot read properties of undefined (reading 'push')` failure was traced to the shared source-eye cleanup path, not to individual actor files.

KayKit actors such as Clown and Monstrosity use a single GLTF primitive on the head. Three.js therefore exposes no explicit geometry group. The reused donor stripper assumed at least one group.

Repair:
- add a temporary full-head group only when none exists;
- run the existing donor stripper unchanged;
- remove the temporary group again on restore/failure;
- clear stale technical Unsupported states after a successful reload.

Evidence: `docs/LOADER_SINGLE_MATERIAL_FIX_2026-09-20.md`.

Tests after repair: **84/84 PASS**; focused loader checks **8/8 PASS**.


## 2026-09-20 · LARGE BATCH ACCEPTED + AUTO LID COLOR

Georg's committed Large batch at `tools/KFB-ToolBox/_inbox/eye-rig-large.batch.json` is accepted as the per-character Large baseline.

Accepted:
- Monstrosity
- Black Knight
- Demon Lord
- Orc Brute

Canonical reviewed copy:
`data/rig-large-reviewed.v1.json`.

The shared fallback lid base `#b58f83` is not persisted in the reviewed copy.

Lid-color repair:
- new `lib/face-color-sampler.v1.js`;
- samples the loaded actor's own head/face texture around the EyeRig placement;
- writes that color to `sourceFace.faceColor` / `eye.baseColor`;
- existing EyeRig v6 still owns the darker lid rendering.

Tests: **95/95 PASS**; runtime-critical JS syntax **4/4 PASS**.

Stage: `e9f97c594bce46607e95928dd349cf081c36783d`.

Next: reload the Stage and visually check the four Large lid colors.
