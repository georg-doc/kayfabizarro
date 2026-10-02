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

## 2026-10-02 · LOADING OVERLAY REPAIR + EYE-CLEANUP-02 NOTES

Georg reported that the actor was visibly loaded while the central `Loading actor…` overlay stayed on top.

Repair:
- explicit `setLoading(show, detail)` owner;
- `.loading-card[hidden], .loading-card.is-hidden { display:none!important; }`;
- success and failure paths both release the blocking overlay;
- failures remain visible in status/report text instead of trapping the stage.

Cleanup02 visibility:
- new `data/cleanup02-review.v0.json`;
- new **Cleanup notes** roster filter;
- selected-actor EYE-CLEANUP-02 panel;
- Skeleton Warrior/Rogue/Mage show `HUMAN_DECISION_REQUIRED` because their NoEyes derivatives remove the separate Glow eye object/material;
- Prototype Pete is called out as the fourth human-decision case but remains Legacy/off-roster;
- Action Figure texture cleanup, Creepy asymmetry, Avian side-eye normals, glasses and Monster patched-face notes are visible where relevant.

Evidence:
- source implementation head `ac9d63631d528800afbc39db6eb066755c150a7c`;
- test-contract head `be5ca51377f4db4493b551bdb3d2e87457335b43`;
- focused source/contract checks **22/22 PASS**;
- direct `setLoading()` behavior checks **8/8 PASS**;
- app syntax parse PASS;
- prior 95/95 suite remains historical; full expanded Node suite not rerun in this environment.

Stage mirror:
- `cloudflare-live@4a311c20f220d81b43a3a396dedf6a18e6cf1d49`;
- exact mirror file readback PASS;
- GitHub deployment status currently pending / no public-browser verification available;
- therefore **PUBLIC_VERIFIED remains OPEN**.

Human route remains:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

## 2026-10-02 · SOURCE-ANCHOR PLACEMENT R1 · Georg visual rejection repair

### GEORG VISUAL FINDING
Screenshot `Bildschirmfoto 2026-10-02 um 14.09.48.png` on Clown showed the generic placement baseline is not merely untuned:
- Vertical already dragged to **-0.275**;
- Inset already at the old maximum **0.9**;
- Eye size **0.215**;
- EyeRig still visibly too high / too far out relative to the source face.

### ROOT CAUSE
The workbench treated `Rig_Medium` placement `dx=.295 / dy=.045 / ring=.153` as a class default and source geometry as an optional suggestion.

That is invalid for varied KayKit heads because FaceHost center changes with hat/hair/head geometry. A shared `dy` therefore cannot land near the original eyes.

### IMPLEMENTATION
Source placement now follows:

`class style → exact per-actor source-eye placement → character/session adjustment`

New pinned data:
`data/cleanup02-anchors.v0.json`

- **19** current Medium/Large roster actors matched to Cleanup02 by **exact source path only**;
- **15** are eligible for automatic source-anchor placement when their profile is still `UNREVIEWED`;
- Skeleton Warrior/Rogue/Mage remain non-auto because source treatment is a human decision;
- Animatronic Creepy remains non-auto because the current EyeRig placement model is symmetric while its source eyes are intentionally asymmetric;
- Cleanup02 id `monster` is correctly mapped to **Rig_Large Monstrosity**, never Medium Monster Costume.

Runtime transformation:
`Cleanup02 root/bind-pose eye centres → loaded figure world → measured FaceHost local`.

The existing EyeRig placement formula is inverted to derive:
- `dx`;
- `dy`;
- `ring`;
- `inset` needed to put the EyeRig centre at the source-eye depth.

No EyeRig-v6 fork was created.

### MANUAL / SAVED PROFILE POLICY
Existing `ADJUSTED` or approved profiles are not silently overwritten.

For those actors the Placement panel now offers:
**Use Cleanup02 source anchors**

`Reset` also returns an eligible current actor to its source-anchor start rather than the old generic class placement.

### CONTROL RANGE REPAIR
Placement ranges are now:
- Spacing: **0 … 1.5**
- Vertical: **-2 … 1.5**
- Eye size: **0.02 … 1.2**
- Inset: **-1.5 … 6**

and automatically expand further if a measured value lies outside them.

Eye-oval authoring is widened to **0.2 … 3** for width/height/depth and **-75° … +75°** tilt.

### TESTED RESULT
Focused source/contract checks: **24/24 PASS**.
- app syntax PASS;
- adapter syntax PASS;
- exact-path anchor roster 19/19;
- Clown source anchors present + auto policy PASS;
- Skeleton/Creepy no-auto guards PASS;
- Monstrosity/Monster-Costume mapping guard PASS;
- wider range + dynamic expansion checks PASS;
- source-anchor runtime auto-apply guard PASS.

The historical 95/95 suite remains historical; this environment did not rerun the complete Node suite.

### STAGE MIRROR
Mirrored source:
`cloudflare-live@ed327cbc38ee6ed7e3312619d91374fd8ffa62b5`

Exact Stage source files read back successfully from GitHub.

Direct public/browser verification is still **OPEN**:
- web opener cannot access `pages.dev`;
- local Chromium environment cannot resolve the host;
- GitHub commit status is pending with no deployment status.

Human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

For Georg's currently adjusted Clown profile: reload, then click **Use Cleanup02 source anchors** (or Reset) so the preserved local manual profile is intentionally replaced by the new measured baseline.

## 2026-10-02 · CONTROL SEMANTICS / STUDIO PARITY R1

Georg found a real control leak: changing **Eye size (ring)** also changed eye seating depth because raw EyeRig v6 uses:

`C = surface - R * (0.24 + inset * 1.15)`, with `R = U * ring`.

### Donor comparison

Read before repair:

- Pet Studio v12 Face/Eyes UI · blob `90ec845ba09f7ed8a76124bb5b5b905a5e9ad82f`:
  - Spacing → `anchor.dx`
  - Height → `anchor.dy`
  - Eye size (ring) → `anchor.ring`
  - Gaze drift → `anchor.track`
  - Pupil size / Gloss / lashes
- shared EyeRig v6 remains the geometry owner.
- later ToolBox/Studio `face-mount.v1.js` · blob `5424bff3f9924587fa3d321138eb8b44915b6550` demonstrates the intended adapter pattern: keep owner fields, then correct mounting/surface semantics outside the raw geometry owner.

### Repair

No EyeRig-v6 fork.

Batch adapter now provides:

- `setRingPreserveCenter(newRing)`: changes ring while compensating the radius-relative internal inset so the eye-centre seat stays invariant;
- `setTrack(track)`: updates gaze amplitude directly without rebuilding the EyeRig;
- app routes `dx/dy`, `ring`, `track`, and `inset` through separate semantic paths;
- visible UI wording now follows Studio: **Spacing · Height · Eye size (ring) · Gaze drift**.

Intent matrix:

- Spacing → X placement only
- Height → Y placement only
- Eye size (ring) → size only; eye centre locked
- Inset → depth only
- Splay → orientation + surface seating (intentional coupled motion on curved head)
- Lid fit → lid geometry only
- Oval W/H/D/Tilt → eye shape only
- Pupil size → pupil geometry only
- Gaze drift → gaze amplitude only
- Converge → pupil aim only
- Gloss → material only

### Focused evidence

Head tested: `7d8198f43580c5e2725e59ec5c15c19aaed04c7c`

- focused source/contract checks: **16/16 PASS**
- app syntax: PASS
- adapter syntax: PASS
- ring/depth seat invariant: **252/252 numeric cases PASS**
- maximum numeric seat error: `8.881784197001252e-16`
- Track path verified as direct `anchor.track + _max` update, no `build()` call
- Studio-parity labels/hint verified

The historical broad 95/95 suite remains historical; this slice does not relabel it as current.

## 2026-10-02 · ADVENTURERS_RIG_MEDIUM_EXTENSION_01

Source implementation:
- catalog commit `2ae26d602689819d2dba693e8b9eea8b0a13d4c0`
- test-contract commit `908d8ed3d99f4cf2f796f719bf586cb55a727292`

Added to `Rig_Medium` roster:

1. Barbarian · blob `d06efc99d5fe8541a31affdd0a25d0c519980c89`
2. Knight · blob `793ac234dcc0509222b073a314d2ab5f18551797`
3. Mage · blob `66eac745c7d4360e463bf4c4e5e117e4c0c58b1e`
4. Ranger · blob `8edaf04430036130c3a7fcb6767049aac3c3f3a7`
5. Rogue · blob `6f28b937ec57b06815240fbf4106c58e76a74c0c`
6. Rogue Hooded · blob `7063f6cbca7fd2445c9b804a9f157c11c0e7b0f2`

Direct GLB metadata inspection on `main@f9dd7a64c4ae0907b8752717861eba065e557d9d`:
- all six have one skin;
- skin name = `Rig_Medium`;
- 23 joints;
- zero embedded animations;
- external pack provides `Rig_Medium_General.glb` + `Rig_Medium_MovementBasic.glb`.

Focused catalog checks: **12/12 PASS**
- 33/33 catalog count;
- 33 unique actor IDs;
- six Adventurers present;
- six Rig_Medium;
- six jointCount 23;
- six exact GLB blobs;
- six exact revision pins;
- six provisional runtime cleanup mode records;
- six present in the generated Adventurers pack registry;
- test contract updated to 33;
- six-specific test contract present;
- existing roster sentinels preserved.

Important limitation:
These six are now **authoring roster entries**, not Blender-cleaned/anchor-approved consumer assets. They still follow the current provisional `auto-mirrored-front-pair` runtime cleanup until a later verified NoEyes/anchor pass.

Asset Librarian cross-tool finding is tracked separately: Mannequin exists in its pack registry but is filtered from Town Characters because `isAnimationSource()` excludes the entire `kaykit-character-animations-1-1` pack.

## 2026-10-02 · EYE-RIG-MYSTERY-COVERAGE-OVAL-01

### Latest Georg Medium batch

Pinned authoring input:

`tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json`  
`main@2c92dd13cbc379ad3a6028144b8976bb3d6a840d`  
blob `0ed0a157389e469ce8b6623bd4542ee49cd31a28`

- 33 profiles / 33 selected
- 30 `ADJUSTED`
- 2 `ADJUSTED_APPROVED`: `mannequin-medium`, `adventurer-rogue-hooded`
- 1 `UNREVIEWED`: `gothgirl`
- **33/33** batch profile actor IDs resolve in the expanded Medium catalog
- **33/33** source paths match exactly

This input is authoring evidence; it does not auto-approve the 19 newly added Mystery Medium actors.

### Oval / pupil isolation repair

Root cause:
`eyeoval.v1.js` used `e.scale.set(w,h,d)` on the full EyeRig eye root, whose descendants include the pupil pivot.

Canonical shared-owner repair:
`ed59390ce105e0e47a5ecdcc2b87bc91222f54cb`

- Eye root scale held at 1×1×1.
- Sclera mesh gets W/H/D.
- Lid group gets W/H/D.
- Pupil pivot scale stays 1×1×1.
- Oval Depth moves the pupil pivot only along local Z by `R * (d - 1)`, so it remains on the deformed eye front without changing pupil size.
- Tilt remains mirrored on the eye root.
- ToolBox shared module and current FrankenStein Studio 16 snapshot read back as the **same blob** `9a559f789fb9dd1d7fb45e0c73ae2b246ef40c55`.

Batch adapter pin:
`0542a9020e8eb7144d62aaff73fe8c64a7b7469a`

Direct synthetic behavior proof: **7/7 PASS**:
root unit; sclera scaled; lids scaled; pupil scale unit; pupil depth follow; mirrored tilt; report marks pupil unit.

### Mystery monthly coverage

Inventory source:
`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/KAYKIT_PACK_COVERAGE_MATRIX.md`

Scope is the owned monthly Mystery Series 4 + 5 + 6 + current Series 7 physical character GLBs. Non-monthly extras such as Santa, Mummy and CharacterTemplate are not silently counted as monthly characters.

Before this slice the EyeRig catalogs covered 26 of those physical monthly GLBs.

Added **23**:
- **19 Rig_Medium**
- **4 Rig_Large**

Catalog commit:
`f12a063b456cf7105bd3792ddf5b6daa404762a0`

Current totals:
- Medium catalog: **52**
- Large catalog: **8**
- Mystery monthly coverage: **49/49**
  - **41 Rig_Medium**
  - **8 Rig_Large**

Focused source/catalog/adapter checks: **26/26 PASS**.

Static test contract was updated at:
`d685f23d447193d4ea84034aafefb7f4af78f19c`

The complete historical static suite was not rerun in-process because Code Mode hit its tool-call ceiling while materializing the full fixture set. That attempt made no repository write. The focused owner/source checks above are the current evidence.

### Paladin

Both physical model variants are now in Rig_Medium:
- `Paladin.glb`
- `Paladin_with_Helmet.glb`

Both source GLBs embed palette A. Palette B is separately pinned:
- A blob `d3e67d9902caa5a75927ad2e0fdcd3e2f162da34`
- B blob `eb45816ada5c84bc91abc0225e3b25f5998accc1`

Georg identifies **palette B as the light/blonde King candidate**. The EyeRig calibration stays geometry/model based; no fake duplicate skeleton is created for the palette. Palette pin metadata commit:
`7165a7c0087ceee57d6269ecf2b1fdf3f35c6931`

### Remaining gate

The 23 added Mystery characters are roster-available for batch authoring. They are not thereby visually approved and do not all have Blender NoEyes/anchor evidence yet.

## 2026-10-02 · FINAL FOCUSED EVIDENCE · KING VISIBLE + FULL CONTAINER CLASSIFICATION

Implementation head tested:
`491be1e6c05332371a3d671079d8588f6a7b949c`

### Oval / pupil behavior
Independent synthetic EyeOval behavior proof: **7/7 PASS**.

- root scale remains 1×1×1;
- sclera follows oval W/H/D;
- lids follow oval W/H/D;
- pupil pivot remains 1×1×1;
- Depth only re-seats the pupil in local Z;
- mirrored Tilt remains correct;
- report records `pupil 1×1×1`.

Canonical shared owner and current FrankenStein Studio 16 snapshot are the same blob:
`9a559f789fb9dd1d7fb45e0c73ae2b246ef40c55`.

### Coverage / King runtime
Focused contract: **22/22 PASS**.

- Medium catalog = **55/55**, IDs unique, all `Rig_Medium` / 23 joints;
- Large catalog = **8/8**;
- monthly physical Mystery coverage remains **49/49 = 41 Medium + 8 Large** with unique physical paths;
- full Mystery source-container candidate GLBs = **53/53 classified**;
- supported physical character GLBs = **51** (49 monthly + Mummy A/B);
- Mummy A/B direct GLB parse = `Rig_Medium`, 23 joints, 0 embedded clips;
- Santa = custom skin `Rig`, 41 joints, 95 embedded clips → explicit unsupported current Medium/Large workbench;
- CharacterTemplate = custom/template skin `Rig`, 41 joints, 95 embedded clips → explicit template exclusion;
- physical Paladin + Paladin Helmet present;
- both Paladin GLBs reference/embed palette A;
- palette A and B are both **1024×1024**;
- `paladin-king` is now a visible authoring actor using exact palette-B texture override;
- texture override runs before source-eye cleanup / face-color sampling;
- latest Georg batch resolves **33/33 IDs + 33/33 exact source paths**;
- static contract includes the new 55/53/King guards.

Palette B:
`eb45816ada5c84bc91abc0225e3b25f5998accc1`.

No full historical static-suite claim is added here; current acceptance evidence is the explicit focused contract above.

## 2026-10-02 · EYE-RIG-BATCH-CONTROL-R2-01

Georg feedback addressed:
- oval-shaped eyes could swallow/clip the now-independent pupil;
- Converge and some ranges were too narrow;
- numeric readouts needed direct edit-in-place;
- Orc Raider rendered without its source texture.

### Pupil seating repair

The first independent-pupil implementation only moved the pivot by Oval Depth. Stress testing exposed that this was insufficient when Width/Height and gaze direction changed together.

Final shared-owner implementation:
- EyeOval owner commit `2bfbe0d2d73aeb5f2fc3af5b11983dc099016792`;
- shared + FrankenStein Studio snapshot blob `90c5e44b17bbb59b1cc26dc5dc943f1091cd5b3b`;
- pupil size remains independent;
- the complete spherical pupil cap is placed in front of the tangent plane of the deformed ellipsoid after every EyeRig gaze update.

Why tangent plane:
the ellipsoid is convex. If the complete pupil cap is in front of the surface tangent plane, it cannot be inside/occluded by the sclera.

Stress proof:
- **3,125** W/H/D × gaze combinations;
- dense cap sampling;
- **0** cases inside the ellipsoid;
- worst sampled ellipsoid equation value `F=1.0397125325424128` where `F>1` is outside.

### Controls

Workbench implementation head:
`9927bdd1fee790e28b583f3ac614e2044df06630`

- Converge: `-2 … 3` + dynamic expansion;
- Gaze drift: `0 … 1.5` + dynamic expansion;
- placement + Oval controls can expand around directly typed values;
- Pupil size: `0 … 1` matching EyeRig's underlying clamp;
- Lid fit: `0 … 1`;
- kinetics A/C/J expose the underlying `-1.5 … 1.5` owner range.

Every numeric `output[data-out]` is now click-to-edit:
- click → edit in place;
- Enter / blur → commit;
- Escape → cancel;
- flexible controls expand their slider range around an entered value.

Browser persistence is intentionally unchanged:
`kfb.toolbox.eye-rig-batch.v0`
and the existing `profiles` map remains the stored source. No clear/remove/reset was added.

### Orc Raider texture

Source GLB:
`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb`
blob `875c648a9d01929bff06fcb9de54416ae32da1f7`.

Direct GLB JSON:
- material `orc_texture_A`;
- **0 images**;
- **0 textures**.

Exact source image:
`textures/orc_texture_A.png`
blob `2035dea050702373c5d2d3c9c49a3381c93b1122`.

The actor now uses an explicit texture override targeting material name `orc_texture_A`; runtime texture override now supports named source materials even when the GLB material originally has no `map`.

### Focused checks

**15/15 PASS**

Stage mirror:
`cloudflare-live@7fc4e208cb956a74cfa8ab409f9eed74eb2ef69c`
exact file readback PASS; deployment status pending.

### Deferred owner decisions

Not implemented in Control R2:
- independent left/right eye position/visibility authoring;
- Survivalist eyepatch → one EyeRig eye hidden;
- deciding whether those controls belong in Batch EyeRig vs the 3D Editor;
- same click-to-edit numeric UX in the separate FrankenStein/Pet Studio UI owner.
