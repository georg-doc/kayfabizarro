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


## CURRENT RETURN · SOURCE IDENTITY RESOLVED

### SOURCE

- repo: `georg-doc/kayfabizarro`;
- branch: `toolbox/eye-rig-batch-2026-09-18`;
- identity checkpoint: `949ff8037df2da88eb91ef825984ef57870b8238`;
- PR: **#104 · Draft · Open · Unmerged**;
- exact actor blob: `b56f67e4ddb7db95ff54fef526148a49289f3915`.

### DECISION

Current GothGirl source eyes are **components 2 + 3**, not 6 + 7.

The current 12-component source map is:

`0 face/head · 1 nose · 2/3 eyes · 4/5 ears · 6/7/8 side accessories · 9 hair · 10/11 brows`.

The historical 6+7 measurement remains preserved as diagnostic evidence. It is not reused as an eye seed.

### IMPLEMENTATION

- source cleanup switched to 2+3;
- current-source fail-closed identity signature added;
- static front/side source projections for all 12 components added;
- canonical GLB/GLTF remains untouched;
- EyeRig v6, FaceHost v1 and actor mixer ownership remain unchanged;
- no EyeRig placement number was silently promoted.

### TESTED RESULT

- exact source connected-component analysis: **12/12 resolved**;
- persisted static/contract replay: **28/28 PASS**;
- GitHub branch/file readback after implementation write: **PASS**;
- Stage publication/file readback: **PASS**;
- corrected public browser proof: **OPEN / NOT RUN**.

### PUBLIC DEPLOYMENT

Publication branch head: `c6489fce74f98b2124feb184becd27d2cbe4a922`.

Stage candidate:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Static source-component evidence:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/docs/source-components-0-11.html`

The current tool environment cannot access `pages.dev`, and connector writes did not trigger the public Playwright workflow. This state is therefore **PUBLISHED / PUBLIC_VERIFIED OPEN**, not a new browser PASS.

### GEORG ACCEPTANCE

**OPEN.**

### OPEN · exactly one next gate

Open the corrected Stage, press **Use source-measured baseline** (now calculated from components 2+3), and compare Source / Cleaned / EyeRig in Front / 3/4 / Side plus motion.

Approve or reject that single GothGirl candidate before any Medium batch expansion. No Large/Legacy work, merge or Live promotion before this gate.


## CURRENT RETURN · RIG_MEDIUM EYE SCALE / PUPIL / LID QA

### SOURCE
- branch implementation: `6f7d7988849cf0c74a6551a33ee422d8584c87c2`;
- test/evidence: `ef7a8f203762f670e00ccdd27b540703d855807d`;
- PR #104 remains Draft/Open/Unmerged;
- tuned GothGirl JSON donor blob: `e87e6337a6db67096a9577335f36d60672aa389e`.

### IMPLEMENTATION
- Rig_Medium eye size no longer boots at the oversized `ring=0.30`;
- boot fallback is `0.20`, then runtime ring is derived from current measured source-eye spacing using the tuned GothGirl ratio `0.32/0.49`;
- pupil default is now **0.34** from the actor-specific GothGirl JSON instead of the previous Batch `0.50`;
- eyelid base is the actor face color `#e6cbc3`, passed through EyeRig v6's existing darker-lid function;
- stale untouched local profiles with exact old `ring=.30 / pupil=.50` migrate to the new candidate; manually adjusted profiles are not silently overwritten;
- source-eye cleanup remains 2+3;
- **QA 4-view** captures Front / ¾ L / ¾ R / Side R into one contact sheet.

### TESTED RESULT
- focused calibration checks: **17/17 PASS**;
- persisted full static suite: **37/37 PASS**;
- changed-JS syntax parse: **2/2 PASS**;
- source branch readback: **PASS**;
- Stage mirror readback: **PASS**.

### PUBLIC DEPLOYMENT
- Stage publication head: `786568b1e4434f458379c3aa5f8a83f3fd82a8d9`;
- direct route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`;
- corrected new browser proof: **OPEN** — no Actions run was triggered and the current web tool cannot access `pages.dev`.

### GEORG ACCEPTANCE
OPEN.

### ONE NEXT GATE
Open the fixed Stage with a normal browser, leave Neutral + Bind/T for the first comparison, and click **QA 4-view**.

Judge only:
1. eye size;
2. pupil size;
3. darker skin-derived lids;
4. ¾ / Side attachment.

If one family still fails, adjust only that family and capture the same four views again. No Medium batch expansion, Large/Legacy, merge or Live promotion before this GothGirl four-view gate.


## CURRENT RETURN · MEDIUM AUTHORING + STUDIO CONTROLS

### SOURCE
- branch: `toolbox/eye-rig-batch-2026-09-18`;
- implementation: `c74cbd6e0691d0bd3bcc574203219cdb0e9f647f`;
- evidence: `eeb79850a8142968c418e23b482a330f120dd9c2`;
- PR #104 remains Draft/Open/Unmerged.

### DECISION
Georg's tuned GothGirl browser configuration is promoted to the **starting authoring seed for Rig_Medium**, not an immutable per-character final.

Default:
`dx=.295 · dy=.045 · ring=.153 · track=.15 · pupil=.34 · inset=.40 · lidFit=.90 · converge=.18 · splay=0 · gloss=.10`.

Source measurement is now suggestion-only and never silently replaces that authoring default.

### IMPLEMENTATION
- class seed → character override → session adjustment is explicit in the candidate data contract;
- existing `eyeoval.v1.js` donor integrated without forking EyeRig;
- Width / Height / Depth / inward Tilt exposed;
- pupil tracking UX now has Life / Pointer / Fixed;
- hidden lower-page profile I/O is replaced for normal use by a persistent Batch bar;
- single-character and whole-batch import/export supported;
- `Apply to Selected` exists and currently operates on the one loaded bounded actor while preserving actor identity / face color;
- QA 4-view remains Front / ¾ L / ¾ R / Side R.

### DEFERRED
Recorded in `docs/BATCH_FEATURE_BACKLOG_2026-09-19.md`:
- top/bottom eye-contour shaping;
- Mouth Batch;
- optional Nose/Brow grafts;
- Vehicle EyeRig using a measured front/headlight host;
- later plant/object hosts.

### TESTED RESULT
- full persisted static/contract suite: **46/46 PASS**;
- focused Studio-control checks: **15/15 PASS**;
- changed-JS syntax: **2/2 PASS**;
- source branch persistence/readback: **PASS**;
- Stage mirror persistence/readback: **PASS**.

### PUBLIC DEPLOYMENT
- fixed Stage runtime head: `40133c8b2d6d8f210003a6ef7cfa793aebac63bf`;
- direct route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`;
- public browser verification: **OPEN** — connector write triggered no Actions run and current web tooling cannot open the route.

### ONE NEXT GATE
Georg opens the fixed Stage and checks:
1. screenshot Medium default remains the expected starting look;
2. Oval Width/Height/Depth/Tilt;
3. Life / Pointer / Fixed pupil tracking;
4. persistent Batch Import / Export / Apply-to-Selected;
5. QA 4-view.

If that authoring surface is accepted, the next implementation slice is a deliberately varied **5–8 actor Rig_Medium sample**, not all classes at once.


## CURRENT RETURN · 27-ACTOR RIG_MEDIUM REVIEW WAVE

### SOURCE

- repo: `georg-doc/kayfabizarro`;
- branch: `toolbox/eye-rig-batch-2026-09-18`;
- implementation: `5f2e981cbcf4ca72a6c186c96ed008be535856a9`;
- evidence: `fa7fdb5b9c5b9c4d443e4f19f47260f934c90147`;
- PR #104 remains Draft/Open/Unmerged.

### OUTCOME

The workbench now contains **27 actual Rig_Medium models** and is ready for the productive review loop Georg requested.

The left roster is no longer a one-actor proof. Click any actor to replace the current model.

Review loop:

`actor → quick face check → adjust if needed → Approve / Adjusted + approve / Unsupported → Next unreviewed`

Filters:

`All · Unreviewed · Adjusted · Unsupported`

Progress is displayed as `reviewed / 27`.

### PROFILE OWNERSHIP

The accepted Medium values remain the class default.

Each actor owns its own override profile. Runtime state follows:

`Rig_Medium class default → actor override → session adjustment`.

Changing one actor no longer changes the class default or another actor's saved override.

### SOURCE-EYE CLEANUP

GothGirl remains exact:

`components 2 + 3`.

For the other actors, the existing donor detector `donoreyes.v1.js` is reused rather than inventing a new eye detector.

The generic path only strips source geometry after a head-named skinned mesh produces a valid mirrored front pair. Otherwise nothing is removed and the actor stays available for manual review / Unsupported.

This is intentionally conservative.

### TESTED RESULT

- persisted static/contract suite: **62/62 PASS**;
- focused actor-browser checks: **14/14 PASS**;
- changed/runtime-critical JS syntax: **3/3 PASS**;
- source branch write/readback: PASS;
- Stage mirror write/readback: PASS.

### STAGE

Runtime mirror:
`cloudflare-live@ae61e50d525e942a755cf46d0ed807b49b5a3e38`

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Public browser proof remains **OPEN** because connector writes did not trigger the Actions proof and the current web source cannot access `pages.dev`.

### ONE NEXT GATE

Georg opens the fixed Stage and begins clicking through Medium actors.

For each actor use only:

- **Approve** if the class default works;
- adjust the ordinary EyeRig controls then **Adjusted + approve** if it needs an override;
- **Unsupported** when source cleanup / anatomy is not suitable for the current automatic path;
- **Next unreviewed** to continue.

Do not start Large/Legacy until this Medium review wave has produced useful override/unsupported data.


## CURRENT RETURN · RIG_LARGE MONSTROSITY CALIBRATION

Large is now available in the same EyeRig workbench as Medium.

### Large actors
- Monstrosity
- Black Knight
- Demon Lord
- Orc Brute

### Current Large workflow
1. click **Large**;
2. Monstrosity loads first;
3. tune the eye placement;
4. check Front / ¾ / Side;
5. click **Set as Large default**;
6. then review the other three Large actors.

There is deliberately **no accepted Large default yet**. The first visible values are only a starting position for Monstrosity.

Medium remains unchanged and keeps its own default and actor overrides.

### Tests
- **82/82 PASS**
- **3/3 JS syntax PASS**
- Stage write/readback PASS

### Stage
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

### Next action
Georg tunes Monstrosity and sends the resulting view / values back. Then the Large default can be locked and tested on Black Knight, Demon Lord and Orc Brute.


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

## 2026-10-02 · CONTROL SEMANTICS / STUDIO PARITY R1 · RETURN

Georg reported that **Eye size** was not a single-purpose control: increasing `ring` also pushed the eye farther into the head.

Root cause is the shared EyeRig-v6 seating equation:

`C = surface - R * (0.24 + inset * 1.15)` with `R = U * ring`.

The Batch workbench now keeps the same EyeRig owner/profile fields but adds a Studio-style semantic adapter:

- **Spacing** → X placement only;
- **Height** → Y placement only;
- **Eye size (ring)** → size only; centre/depth stays fixed by compensating the radius-relative inset coefficient;
- **Inset** → depth only;
- **Gaze drift** → amplitude only and no rebuild;
- Pupil size / Converge / Gloss / Lid fit / Oval retain their named visual responsibility;
- **Splay** remains the deliberate exception: orientation changes and the eye follows the curved surface.

Studio donor comparison:
- Pet Studio v12 Face/Eyes UI blob `90ec845ba09f7ed8a76124bb5b5b905a5e9ad82f`;
- newer ToolBox/Studio face adapter blob `5424bff3f9924587fa3d321138eb8b44915b6550` demonstrates the same owner-preserving adapter pattern.

Implementation: `7d8198f43580c5e2725e59ec5c15c19aaed04c7c`  
Evidence: `6355718fe7e0a6f78b18e35a4ef598d4ac6ccb7f`

Focused evidence:
- **16/16 PASS**
- ring/depth invariant **252/252 PASS**
- maximum numeric seat error `8.881784197001252e-16`
- app syntax PASS
- adapter syntax PASS

Stage mirror:
`cloudflare-live@0f3fa194746c7eabbf15d590a18532ecb42332c1`

Exact mirror file readback PASS. Direct public verification remains OPEN because the current web opener cannot access the pages.dev route and GitHub deployment status is pending.

Human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Next productive gate: Georg checks Eye size over a large range on Clown while watching the eye centre, then tests Inset / Height / Spacing independently and one Splay motion.

## 2026-10-02 · MEDIUM BASELINE DECISION + COVERAGE EXPANSION

Georg accepts the current uploaded Medium authoring batch as a **usable baseline with explicit exceptions**, not as universal visual perfection.

Input:
- `tools/KFB-ToolBox/_inbox/eye-rig-medium.batch.json`
- main blob `8497c52f6e585c4dc27899881e27c8750e458fd4`
- 27 selected actors

### Medium policy

**Keep as baseline**
- the current per-character EyeRig tuning is retained as authoring data.

**Default EyeRig OFF / exclude from consumer use**
- `driver` — sunglasses already own the eye read;
- `ultra-turbo-hero-man` — EyeRig on the visor was exploratory only.

**Keep profile, but source cleanup remains unresolved**
- Animatronic Normal / Creepy — Georg still sees original-eye geometry; one source eye can protrude in front of EyeRig. Treat this as a source-cleanup/layering issue. Final consumer use must prefer a verified NoEyes/cleanup source; do not distort EyeRig to compensate.

**Non-blocking**
- Caveman — slight left/right nose-distance asymmetry. Cleanup02 source evidence itself has an off-centre pair in FaceHost coordinates. Preserve as a known small character-specific mismatch; do not reopen the full Medium batch solely for this.

### Brows

DEFER authored-brow extraction/animation.

For now:
- preserve source brows;
- no giant brow library;
- missing/unusable brows may later use the existing BrowRig v2.

Future brow pass begins with classification:
`NONE / SEPARATE_MESH / EMBEDDED_OR_TEXTURE`.
Only then decide which authored brows are worth Blender separation and animation adaptation.

### Coverage expansion order

1. **Adventurers 2.0 FREE · Rig_Medium extension**
   - Barbarian
   - Knight
   - Mage
   - Ranger
   - Rogue
   - Rogue_Hooded
   - pack includes Rig_Medium General + MovementBasic.

2. **Rig_Large**
   - Monstrosity
   - Black Knight
   - Demon Lord
   - Orc Brute

3. **Legacy · characters only**
   - Skeleton pack: 8 character variants (Archer/Mage/Minion/Warrior + broken variants)
   - Spooktober: Jack + Witch
   - Orc Warband: Orc A + Orc B
   - Character Animations 1.2: Prototype Pete, with the animated GLB preferred over duplicate static representation
   - **13 primary character candidates** total under this interpretation.

Legacy props/Dungeon models are explicitly not EyeRig roster items.

### Pipeline correction

Do not use runtime eye stripping as final source truth.

Preferred sequence for new coverage:
`exact source → verified/Blender NoEyes cleanup + anchors when required → EyeRig profile authoring → consumer reference`.

Exactly one next gate:
**ADVENTURERS_RIG_MEDIUM_EXTENSION_01** — add and prepare the six Adventurers only. Large and Legacy remain separate following slices.

## 2026-10-02 · ADVENTURERS_RIG_MEDIUM_EXTENSION_01 · RETURN

Status: **IMPLEMENTED · 12/12 FOCUSED PASS · STAGE MIRRORED · PUBLIC VERIFY OPEN**

### Result

The existing `Rig_Medium` EyeRig roster now contains **33 actors** instead of 27.

Added from `KayKit_Adventurers_2.0_FREE`:

- Barbarian
- Knight
- Mage
- Ranger
- Rogue
- Rogue Hooded

All six were inspected directly from their GLBs at `main@f9dd7a64c4ae0907b8752717861eba065e557d9d`:

- one skin;
- skin name `Rig_Medium`;
- 23 joints;
- zero embedded animations;
- exact GLB blobs pinned in the catalog.

The Adventurers pack itself supplies `Rig_Medium_General.glb` and `Rig_Medium_MovementBasic.glb`.

These six are **authoring roster entries**. They do not yet have Blender-verified NoEyes derivatives/source anchors; their runtime cleanup remains provisional `auto-mirrored-front-pair` until a later cleanup pass.

### Tests

Focused extension checks: **12/12 PASS**.

- 33/33 catalog count;
- 33 unique IDs;
- 6/6 Adventurers present;
- 6/6 Rig_Medium;
- 6/6 jointCount 23;
- 6/6 exact GLB blobs;
- 6/6 current-main revision pins;
- 6/6 provisional cleanup records;
- 6/6 Adventurers pack-registry presence;
- static test contract updated from 27 → 33;
- six-specific test contract added;
- existing roster sentinels preserved.

Evidence:
`docs/ADVENTURERS_RIG_MEDIUM_EXTENSION_2026-10-02.md`

### Stage

Mirrored catalog + ToolBox Hub card:

`cloudflare-live@dac15d6ec55bed733aff5d55adfe438d29cb0ec5`

Exact mirror readback:
- actorCount = **33**
- all six Adventurers present.

Human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

No PUBLIC_VERIFIED claim is made until that direct route is opened on the new revision.

### Asset Librarian availability finding

Georg reported that Mannequin was available in EyeRig but not in the Asset Librarian character view.

Confirmed source facts:

- `Mannequin_Medium.glb` exists in `registry/assets/v1/packs/kaykit-character-animations-1-1.json`;
- `Mannequin_Large.glb` is also present there;
- the six new Adventurers are present in `registry/assets/v1/packs/kaykit-adventurers-2-0-free.json`.

Confirmed Town-workbench projection bug:

`tools/asset_registry/librarian/town-workbench.js#isAnimationSource`

currently treats the **entire** `kaykit-character-animations-1-1` pack as animation-source content. `isCharacter()` rejects animation sources, so the Mannequin character models are excluded from the Town Character lane even though their asset records exist.

This slice does **not** modify Asset Librarian runtime ownership.

A complete all-KayKit / all-consumer availability PASS is **not yet claimed**. The next owner audit must compare KayKit character source inventory against Asset Registry canonical/live projection, Librarian character lane, EyeRig catalogs and named downstream character selectors.

Exactly one next gate:
**KAYKIT_CHARACTER_AVAILABILITY_AUDIT_01 · Asset Librarian owner** — fix the Mannequin pack-wide filter and produce a cross-surface character coverage matrix before continuing Large/Legacy expansion.

## 2026-10-02 · EYE-RIG-MYSTERY-COVERAGE-OVAL-01 · RETURN

Status: **READY_FOR_HUMAN_REVIEW · SOURCE IMPLEMENTED · STAGE MIRRORED · PUBLIC_VERIFIED OPEN**

### Exact source state

- Repo: `georg-doc/kayfabizarro`
- Branch: `toolbox/eye-rig-batch-2026-09-18`
- Draft PR: **#104**
- Tested source/evidence head before Return: `2b876b25582bd73ce8ce6263b3d40598a9757d56`
- Latest Georg Medium batch input: `tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json`
- Batch input pin: `main@2c92dd13cbc379ad3a6028144b8976bb3d6a840d` · blob `0ed0a157389e469ce8b6623bd4542ee49cd31a28`

No merge, auto-merge or Live promotion was performed.

### 1 · Eye shape / oval no longer scales pupils

Shared owner repair:
`ed59390ce105e0e47a5ecdcc2b87bc91222f54cb`

The previous EyeOval implementation scaled the entire EyeRig eye root, including the pupil pivot.

Now:
- eye root remains 1×1×1;
- sclera receives W/H/D;
- lids receive W/H/D;
- pupil pivot remains 1×1×1;
- oval Depth moves the pupil pivot only in local Z to remain on the deformed eye front;
- mirrored oval Tilt remains on the eye root.

The canonical ToolBox EyeOval module and the current FrankenStein Studio 16 snapshot read back as the same blob:
`9a559f789fb9dd1d7fb45e0c73ae2b246ef40c55`

Batch adapter pin:
`0542a9020e8eb7144d62aaff73fe8c64a7b7469a`

Direct synthetic EyeOval behavior: **7/7 PASS**.

### 2 · Mystery monthly character coverage

Inventory source:
`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/KAYKIT_PACK_COVERAGE_MATRIX.md`

Scope:
owned monthly Mystery Series 4 + 5 + 6 + current Series 7 physical character GLBs.

Added this slice:
- **19 Rig_Medium**
- **4 Rig_Large**

Current EyeRig catalogs:
- **52 Medium**
- **8 Large**
- **60 total Batch actors**

Mystery monthly coverage:
- **49/49 physical monthly character GLBs**
- **41 Rig_Medium**
- **8 Rig_Large**

Coverage manifest:
`data/mystery-monthly-character-coverage.v1.json`

Non-monthly extras such as Santa, Mummy and CharacterTemplate are not silently counted in the 49/49 monthly claim.

### 3 · Paladin

Both physical model variants are now available:
- `Paladin.glb`
- `Paladin_with_Helmet.glb`

Both are direct-inspected `Rig_Medium`, 23 joints.

Both source GLBs embed palette A. Both palette files are pinned:
- A · `d3e67d9902caa5a75927ad2e0fdcd3e2f162da34`
- B · `eb45816ada5c84bc91abc0225e3b25f5998accc1`

Per Georg, **palette B is the light/blonde King candidate**. EyeRig tuning remains tied to the model/eye geometry; no duplicate fake skeleton is created solely for the palette.

### 4 · Latest Georg batch preserved

The new 33-profile batch resolves exactly against the expanded Medium catalog:
- 33/33 actor IDs present;
- 33/33 source paths exact;
- 30 ADJUSTED;
- 2 ADJUSTED_APPROVED: `mannequin-medium`, `adventurer-rogue-hooded`;
- 1 UNREVIEWED: `gothgirl`.

It remains authoring evidence; it does not auto-approve the newly added Mystery actors.

### Evidence

Focused source/catalog/adapter checks: **26/26 PASS**.  
Direct EyeOval behavior: **7/7 PASS**.  
Latest batch identity/source mapping: **33/33 exact**.

The expanded static test contract is persisted at `d685f23d447193d4ea84034aafefb7f4af78f19c`. A complete in-process run of every historical fixture was not completed because Code Mode reached its tool-call ceiling while materializing the full fixture set; that attempt made no repository write.

Evidence doc:
`docs/MYSTERY_COVERAGE_OVAL_PUPIL_2026-10-02.md`

### Stage

Stage mirror:
`cloudflare-live@8627efb436bbba9e1fec09aad7598892f9eab4d1`

Exact mirror readback:
- adapter uses repaired EyeOval pin;
- Medium = 52;
- Large = 8;
- Mystery monthly = 49 / 41 Medium / 8 Large;
- KFB ToolBox Hub card updated.

Human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

`PUBLIC_VERIFIED` remains OPEN: GitHub deployment status is currently pending and the current web tooling has not visibly opened the new pages.dev revision.

### Unresolved

- Newly added Mystery actors are roster-available, not visually approved.
- Most new entries still use provisional runtime source-eye cleanup until later Blender/NoEyes + anchor work.
- Palette B is pinned for the King Paladin but the EyeRig actor entry does not create a duplicate skin-specific skeleton.
- Large/Legacy profile review remains a later gate.
- Existing Asset Librarian Mannequin projection bug remains owned by the separate availability audit.

### Exactly one next gate

**GEORG_EYERIG_MYSTERY_OVAL_VIS_01**

On the direct Stage:
1. check Oval Width/Height across a large range and confirm pupil size does not change;
2. inspect Paladin + Paladin Helmet;
3. sample several newly added Mystery Medium actors and at least Clanker / FrostGolem / 4GTN on Large;
4. stop for Georg acceptance before any profile promotion, Blender cleanup batch, merge or Live promotion.

## 2026-10-02 · EYE-RIG-MYSTERY-COVERAGE-OVAL-01 · FINAL ADDENDUM

Status: **READY_FOR_HUMAN_REVIEW · STAGE MIRRORED · PUBLIC_VERIFIED OPEN**

### Exact tested state

- Implementation head: `491be1e6c05332371a3d671079d8588f6a7b949c`
- Evidence head before Return metadata: `1214c36c84f000d0cf22d1dd5858e125c3c97314`
- Stage mirror: `cloudflare-live@c42e8cbf2e31d39b7ca6d851e0525254c2009664`
- Latest Georg batch input: `tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json`
- Batch blob: `0ed0a157389e469ce8b6623bd4542ee49cd31a28`

### Mini-step 1 · Oval / pupil

Shared `eyeoval.v1.js` now shapes sclera + lids without scaling the pupil pivot.

Independent behavior proof: **7/7 PASS**.

- root unit scale
- sclera W/H/D
- lids W/H/D
- pupil scale 1×1×1
- Depth only re-seats pupil in local Z
- mirrored Tilt preserved
- report marks pupil 1×1×1

Shared ToolBox + current FrankenStein Studio 16 snapshot blob:
`9a559f789fb9dd1d7fb45e0c73ae2b246ef40c55`

### Mini-step 2 · Mystery coverage

Current EyeRig catalogs:
- **55 Rig_Medium**
- **8 Rig_Large**
- **63 visible Batch actors total**

Monthly physical Mystery coverage remains:
- **49/49**
- **41 Medium**
- **8 Large**

Whole historical Mystery source-container GLB classification:
- **53/53 candidate GLBs classified**
- **51 supported physical character GLBs**
- Mummy A/B added as direct-verified `Rig_Medium` / 23 joints
- Santa explicitly classified as custom `Rig` / 41 joints / 95 embedded animations and **not falsely put into Medium/Large**
- CharacterTemplate explicitly classified as custom/template `Rig` / 41 joints / 95 embedded animations

### Paladin / King

Available physical model entries:
- `Paladin.glb`
- `Paladin_with_Helmet.glb`

Both physical GLBs use palette A.

Visible additional authoring entry:
- `paladin-king` = Paladin geometry + exact `paladin_texture_B.png`
- palette B blob `eb45816ada5c84bc91abc0225e3b25f5998accc1`
- A/B texture dimensions both 1024×1024
- texture override runs before source-eye cleanup and face-color sampling

Thus the light/blonde King is now actually visible in the workbench, not metadata-only.

### Current tests

- Oval behavior: **7/7 PASS**
- final focused coverage/runtime contract: **22/22 PASS**
- latest Georg batch mapping: **33/33 IDs + 33/33 exact source paths**
- previous monthly source/catalog contract remains **26/26 PASS**

The historical full static suite is not re-labeled as current; focused evidence above is the current acceptance proof.

### Stage

Exact mirrored files read back on:
`cloudflare-live@c42e8cbf2e31d39b7ca6d851e0525254c2009664`

Readback confirms:
- texture-override runtime present
- Medium 55
- Large 8
- 53/53 container classification
- ToolBox Hub card updated

Human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

### Unresolved

- newly added Mystery actors are roster-available, not visually approved;
- most new entries still need later Blender NoEyes/anchor cleanup before consumer promotion;
- Santa remains a custom-rig special case outside the current Medium/Large workbench;
- CharacterTemplate remains explicitly a template/custom-rig source;
- Asset Librarian Mannequin projection bug remains a separate owner issue;
- no merge / no Live promotion.

### Exactly one next gate

**GEORG_EYERIG_MYSTERY_OVAL_VIS_02**

On the direct Stage:
1. verify Oval Width/Height does not resize pupils;
2. inspect Paladin, Paladin Helmet and visible light/blonde `Paladin · King (Light B)`;
3. inspect Mummy A/B;
4. sample several newly added Mystery Medium and Large actors;
5. stop for Georg approval before profile promotion or the next Blender cleanup batch.

## 2026-10-02 · EYE-RIG-BATCH-CONTROL-R2-01 · RETURN

Status: **READY_FOR_HUMAN_REVIEW · SOURCE TESTED · STAGE MIRRORED · PUBLIC_VERIFIED OPEN**

### User feedback addressed

1. **Pupil clipping on oval eyes**
   - pupil remains independent in size;
   - seating is now recomputed after every gaze update against the tangent plane of the current eye ellipsoid;
   - this prevents the independent pupil cap from being swallowed by strongly deformed sclera.

2. **Slider limits / cross-eye**
   - Converge widened to **-2 … 3** and can expand further around directly typed values;
   - Gaze drift **0 … 1.5**;
   - flexible placement and Oval controls can expand around entered values;
   - Pupil size now exposes **0 … 1**, matching the owner clamp;
   - Lid fit exposes **0 … 1**;
   - kinetics A/C/J expose **-1.5 … 1.5**.

3. **Direct numeric entry**
   - click any numeric output in the EyeRig Batch workbench;
   - type exact value;
   - Enter / blur commits;
   - Escape cancels.
   - This is implemented in the Batch owner only. Separate FrankenStein/Pet Studio UI parity remains a later owner slice.

4. **Orc Raider texture**
   - source GLB blob `875c648a9d01929bff06fcb9de54416ae32da1f7` contains material `orc_texture_A` but zero image/texture records;
   - exact source texture `orc_texture_A.png` blob `2035dea050702373c5d2d3c9c49a3381c93b1122`;
   - actor now uses a named-material texture override so a source material with no existing `map` can still receive its exact source texture.

### Persistence

Browser storage key remains:

`kfb.toolbox.eye-rig-batch.v0`

Existing `profiles` persistence remains unchanged. No storage clear/remove/reset was introduced.

Therefore saved numeric authoring profiles remain available across the new build. A visual result can intentionally change where rendering semantics were fixed (notably pupil seating), but the stored values are not silently discarded.

### Evidence

Implementation:
- robust shared EyeOval tangent-plane seating: `2bfbe0d2d73aeb5f2fc3af5b11983dc099016792`
- Batch controls / inline edit / Orc texture: `9927bdd1fee790e28b583f3ac614e2044df06630`
- evidence checkpoint: `c518d1154f6e25f11ea67ed2a1f374eb1a5322d6`

Focused checks: **15/15 PASS**.

Pupil stress:
- **3,125** combinations;
- **0** sampled cap points inside ellipsoid;
- worst sampled ellipsoid `F=1.0397125325424128`.

Shared ToolBox EyeOval + current FrankenStein Studio snapshot blob:
`90c5e44b17bbb59b1cc26dc5dc943f1091cd5b3b`.

### Stage

Mirror:
`cloudflare-live@7fc4e208cb956a74cfa8ab409f9eed74eb2ef69c`

Exact Stage file readback PASS:
- inline editor runtime present;
- widened Converge range present;
- Orc exact texture contract present;
- repaired EyeOval pin present;
- ToolBox Stage Hub card updated.

Human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

GitHub deployment status is currently pending; direct public-browser proof is therefore not claimed.

### Deferred

- independent L/R eye placement controls;
- per-eye visibility, with Survivalist eyepatch as first concrete case;
- decision whether those belong in Batch EyeRig or 3D Editor;
- same click-to-edit numeric UX in the separate FrankenStein/Pet Studio UI;
- later Blender/NoEyes cleanup for newly rostered characters.

### Exactly one next gate

**GEORG_EYERIG_CONTROL_R2_VIS_01**

On the direct Stage:
1. distort Oval W/H and move gaze; pupil must remain fully visible and unchanged in size;
2. test strong positive Converge for inward cross-eye;
3. click a numeric value and type `1`;
4. inspect Orc Raider source texture;
5. reload and confirm existing saved profiles remain.

Stop before any profile promotion, per-eye feature work, Blender cleanup, merge or Live promotion.

## 2026-10-03 · CURRENT RETURN · RECOVERY + SOURCE PALETTE VARIANTS

Status: **SOURCE TESTED · STAGE MIRRORED · PUBLIC_VERIFIED OPEN · HUMAN VISUAL GATE OPEN**

### Recovery baseline

The newer browser export `eye-rig-medium.batch (2).json` is now durable on this same owner/branch:
- intake commit `a346a219a54e53f690d1ff840363aff8d8729e58`;
- **40 profiles / 40 selected**;
- previous **33/33** profile payloads preserved unchanged in source / eye / blink / life / kinetics / review-state fields;
- seven additive profiles: `paladin-king`, `mummy-a`, `mummy-b`, `survivalist`, `hoarder`, `space-ranger-flight`, `combat-mech`;
- added roster/source resolution: **7/7 + 7/7 PASS**.

### Appearance variants

Resident variant truth is reused from PR #330 rather than re-audited or forked.

Implementation:
- source implementation: `d6c9d28d0861c1e29fa23f2a9cc6fc9094456c48`;
- evidence head before this Return: `fa851af3478a338e174777a32d9f81e0c5400c68`;
- new manifest: `data/appearance-variants.v1.json`;
- **25** character texture families;
- **56** exact source appearance textures;
- **31** existing EyeRig geometry actors carry those families;
- **24/25** families are runtime-selectable;
- **1/25** is registered but source-gated: Farmers.

Architecture:
- one geometry actor keeps one EyeRig geometry profile;
- palette selection is separate appearance state;
- no duplicate skeleton/rig actors are invented for color variants;
- existing `applyActorTextureOverride()` remains the texture owner;
- LocalStorage key remains `kfb.toolbox.eye-rig-batch.v0`;
- `appearanceByActor` is additive and does not reset `profiles`.

Concrete coverage:
- **Magical Girl: A / B / C / D** on the shared `magical-girl` geometry;
- **Driver: BASE / B** on the shared `driver` geometry;
- Paladin B / `paladin-king` remains the existing fixed precedent;
- the other audited multi-texture families are represented by the same manifest;
- Farmers A/B are visible in the registry but switching stays disabled until the exact texture A/B → Farmer_A/Farmer_B mapping is source-proven.

### Tests

Focused readback contract: **20/20 PASS**.

Includes:
- JavaScript syntax for runtime + static-check;
- **25/25** families;
- **56/56** exact path/blob/revision matches against the PR #330 variant SSOT;
- all families mapped to current geometry;
- all mapped actor ids present;
- Magical Girl A/B/C/D;
- Driver BASE/B;
- Paladin King precedent retained;
- Farmers source gate retained;
- selector UI/runtime;
- one shared geometry profile;
- unchanged LocalStorage key;
- additive appearance persistence;
- catalogs remain **55 Medium / 8 Large**.

No full historical static-suite or browser visual PASS is inferred from these focused checks.

### Stage

Cloudflare publication mirror:
`cloudflare-live@479c4e91967565b583c76ed0c6ea07433c5b28ce`

Exact mirrored file readback PASS:
- `kfb-hub/stage/toolbox/eye-rig-batch/app.js`;
- `.../index.html`;
- `.../data/appearance-variants.v1.json`;
- ToolBox Stage Hub card.

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

The current web opener still cannot access the `pages.dev` route and the Stage commit has no attached workflow/status contexts. Therefore **PUBLIC_VERIFIED remains OPEN** and no Live claim is made.

### Unresolved

- Farmers exact A/B texture → Farmer_A/Farmer_B mapping;
- independent L/R eye placement;
- per-eye visibility for Survivalist eyepatch;
- separate FrankenStein/Pet Studio click-to-edit parity;
- later Blender/NoEyes cleanup where still needed.

### Exactly one current next gate

**GEORG_EYERIG_CONTROL_R2_VARIANTS_VIS_01**

On the direct Stage:
1. Control R2: extreme Oval W/H + moving gaze keeps pupil fully visible and same size;
2. strong positive Converge works;
3. direct numeric entry works;
4. Orc Raider source texture is correct;
5. Magical Girl switches A → B → C → D without changing the EyeRig geometry profile;
6. Driver switches BASE ↔ B;
7. reload preserves both eye profiles and the chosen appearances.

No profile promotion, Farmers mapping guess, per-eye feature work, merge or Live promotion before this gate.

## 2026-10-03 · CURRENT RETURN · BOOT REPAIR

Status: **SOURCE FIXED · STAGE MIRRORED · POST-REPAIR HUMAN VERIFY OPEN**

Georg reported two coupled Stage symptoms:
- roster stuck at `Loading actor catalog…`;
- `Large` click inactive.

Root cause is proven in source: `initInlineNumberEditors()` used the single-element helper `$()` and then called `.forEach()`. That exception occurred inside `wireRuntimeControls()` before `wireRoster()`, so the same boot abort both left stale loading text and prevented the Medium/Large handlers from being installed.

Repair:
- `$$('output[data-out]').forEach(...)`;
- roster/class handlers are now wired **before** runtime-control initialization;
- visible boot progress now reports catalogs → profiles → 3D stage → controls/motion → first actor → ready;
- failures now show exact `Boot failed · <message>` text in the visible roster/audit area.

Focused regression: **6/6 PASS**.
Full historical static suite: **NOT RERUN** in this repair.

Current source evidence:
- selector/runtime fix: `da5e4cd0025b0f7e3dd3300f740dd0afc174959f`;
- regression assertion: `6238fd0a2e98d5ba820b2b645ec1ad8e9353f46b`;
- repaired app blob: `48674bd29ac54f70243f3132c18671a0d570e29c`;
- detailed evidence: `TEST_REPORT.md#2026-10-03--eye-rig-batch-boot-repair-01`.

Stage mirror:
`cloudflare-live@d2cbc94ddde4d7c281a492db350119005f22e153`

Exact Stage `app.js` blob matches source app blob.
The same Stage commit updates the ToolBox card and actual `hub-ui-v2` EyeRig task.

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Post-repair `PUBLIC_VERIFIED` remains **OPEN** because this environment cannot open `pages.dev`.

### Exactly one current next gate

**GEORG_EYERIG_BOOT_REPAIR_VIS_01**

Reload the direct Stage and check only:
1. loading progresses and roster appears;
2. `Large` loads the Large roster;
3. switch back to `Medium`;
4. if it still fails, copy the newly visible exact boot/progress message.

After PASS, resume the existing Control R2 + Magical Girl/Driver palette visual gate. No merge or Live promotion.

## 2026-10-03 · HUMAN PASS · BOOT REPAIR

Georg verified the repaired Stage:
- actor catalog / roster loads;
- `Large` switch works.

Therefore `GEORG_EYERIG_BOOT_REPAIR_VIS_01` is **HUMAN_ACCEPTED / PASS** and is closed.

New feedback for the next bounded display/comfort slice:
- mouse-wheel Orbit zoom is much too sensitive;
- add a reversible clay presentation view, preferably reusing the proven Resident Atlas / K1-H0 performance clay path and existing `clay_floor_001` source instead of inventing a new material owner.

Next implementation slice:
`EYE_RIG_VIEW_COMFORT_CLAY_01`.

Protected boundary:
Control R2, source palettes, saved EyeRig profiles, actor catalogs, EyeRig owner and repaired boot flow remain unchanged.

## 2026-10-03 · CURRENT RETURN · VIEW COMFORT / CLAY K1

Status: **BOOT REPAIR HUMAN PASS · VIEW SLICE SOURCE TESTED · STAGE MIRRORED · HUMAN VISUAL/PERF GATE OPEN**

### Human input

The prior boot repair is accepted by Georg: roster loads and Rig_Large switching works.

New bounded feedback:
- mouse-wheel Orbit zoom was much too sensitive;
- requested a Resident-Atlas-like clay-floor / optimized claymation presentation mode.

### Implementation

Implementation commit:
`f40937f50f7d61fdcd50f24c25658c113b389ad0`

Evidence checkpoint:
`9cb0217695bbca42f711326f333a6dac243d3232`

#### Orbit comfort

Existing OrbitControls owner retained:
- `zoomSpeed = 0.28`;
- `minDistance = 0.8`;
- `maxDistance = 14`.

No new camera owner or wheel handler was introduced.

#### Neutral ↔ Clay K1 view

A reversible toolbar view switch was added:

`Neutral | Clay K1`

Clay geometry donor is the exact Resident Atlas S15 K1/H0 implementation:
- `lib/clay-k1.js` source/copy blob: `4712a6527921c180847afa4dd77788041351860b`;
- `clay-soften.v1.js` source/copy blob: `fef287f244661ebc985dfc6fc47857af94b6223b`.

The copied modules are byte-identical to the verified donor.

Performance contract retained:
- max **4,000 tris per mesh**;
- max **2** subdivision levels;
- total added-triangle budget **160,000**;
- skinned meshes use the K1 no-subdivision smoothing path;
- geometry cache retained;
- apply/revert is reversible.

EyeRig and FaceHost diagnostic meshes are explicitly marked `noClay`. The view may soften the KayKit actor body, but must not alter the authored EyeRig geometry/pupils.

Clay floor reuses the existing source maps pinned at `main@74f7a690fbec88cf98ce0936f31b72ad3f1148f5`:
- diffuse `d889ddd32d38ef9fac55ea802e47da73cbd77deb`;
- normal `59092c601272f265e7e96cbae3f9d753be47b6a6`;
- roughness `4d5b3e7634e532111c7608156f4a49b6b18d2ffb`.

GTAO/K2 is intentionally **OFF** in this EyeRig authoring view. This is the lightweight K1 form/floor comparison, not another clay renderer owner.

`stageLook` persists additively inside the existing `kfb.toolbox.eye-rig-batch.v0` namespace. Existing EyeRig profiles and palette choices are not reset.

### Tests

Focused source/readback checks: **15/15 PASS**.

Includes donor byte identity, JS syntax, slower zoom, view UI, explicit K1 budget, reversible apply/revert, EyeRig exclusion, pinned floor, AO-off boundary, boot-repair retention, roster wiring order, palette layer retention and Control R2 retention.

Full historical Node static suite: **NOT_RUN** because the isolated test container could not resolve `github.com` before checkout. This is recorded as an environment limitation, not a PASS or FAIL.

### Stage

Exact Stage mirror:
`cloudflare-live@6406774131723288b757fd676e6d7be3f08b1123`

Readback PASS for:
- repaired/current `app.js`;
- current `index.html`;
- byte-identical `lib/clay-k1.js`;
- byte-identical `lib/clay/clay-soften.v1.js`;
- ToolBox Stage card;
- actual public `hub-ui-v2` EyeRig task.

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Current environment still cannot visibly open `pages.dev`, therefore `PUBLIC_VERIFIED` remains **OPEN**.

### Unresolved

- human wheel-feel check on desktop;
- human Neutral ↔ Clay K1 comparison on Medium and Large;
- verify Clay K1 does not visually distort EyeRig itself;
- judge clay-floor scale/contrast and K1 runtime cost on Georg's browser;
- Farmers exact A/B texture → Farmer_A/Farmer_B mapping remains source-gated;
- per-eye placement/visibility remains deferred.

### Exactly one current next gate

**GEORG_EYERIG_VIEW_COMFORT_CLAY_VIS_01**

On the direct Stage:
1. test mouse-wheel zoom on Medium and Large;
2. switch `Neutral ↔ Clay K1`;
3. confirm actor body gets the K1 clay form while EyeRig/pupils keep their authored shape;
4. inspect the `clay_floor_001` floor;
5. change actors / switch Medium ↔ Large while Clay is active, then return to Neutral;
6. report any visible lag, geometry artifact or floor-scale problem.

No AO/K2 enablement, profile promotion, merge or Live promotion before this gate.

## 2026-10-03 · CURRENT RETURN · WHEEL ZOOM REPAIR 02

Status: **SOURCE FIXED · 13/13 FOCUSED PASS · STAGE MIRRORED · HUMAN VERIFY OPEN**

Georg reports the first comfort pass still jumps to extreme positions.

The previous `zoomSpeed=.28` adjustment is therefore superseded for wheel input.

### Repair

Native OrbitControls wheel zoom is disabled:
`controls.enableZoom=false`.

OrbitControls still owns orbit rotation, target and camera interaction. A bounded wheel-input adapter only changes distance to the same target.

Contract:
- absolute distance **1.6–8.0**;
- base step/event **0.12**;
- one gesture capped to **0.65 inward / 0.85 outward** from gesture start;
- gesture resets after **160 ms** idle;
- distance target damped by **14**;
- physical movement capped to **0.09 units/frame**;
- camera presets re-sync the target distance.

Implementation:
`797e5a81bbcdc339282ea1873363dd6804d9bd31`

App blob:
`5635b28496af0e06cfe7f60a01b23e5612bad6e1`

Focused regression:
**13/13 PASS**.

Boot repair, Clay K1, Control R2, 40-profile recovery and 25-family/56-appearance palette layer remain intact.

### Stage

`cloudflare-live@888a57cfe820890fa2ac3a86f991d05a58834ee3`

Exact source ↔ Stage app blob: **PASS**.

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

### Exactly one current gate

**GEORG_EYERIG_WHEEL_ZOOM_VIS_02**

Test one notch, a longer wheel/trackpad gesture, Face view and Large. The camera must no longer jump straight to near/far extremes.

After PASS, resume the existing Neutral ↔ Clay K1 review.

## 2026-10-03 · HUMAN PASS · VIEW COMFORT + WHEEL REPAIR 02

Georg confirmed: **"das klappt alles."**

Accepted on the direct EyeRig Stage:
- actor roster / Rig_Large switching remains functional;
- bounded wheel zoom no longer jumps to extreme positions;
- the current view-comfort / Clay K1 Stage is accepted for continuation.

Accepted runtime identity:
- source implementation app blob: `5635b28496af0e06cfe7f60a01b23e5612bad6e1`;
- originally mirrored in `cloudflare-live@888a57cfe820890fa2ac3a86f991d05a58834ee3`;
- still present unchanged in the current later `cloudflare-live` head when this acceptance was recorded;
- Clay K1 donor remains exact blob `4712a6527921c180847afa4dd77788041351860b`.

Closed human gates:
- `GEORG_EYERIG_BOOT_REPAIR_VIS_01` · PASS;
- `GEORG_EYERIG_WHEEL_ZOOM_VIS_02` · PASS;
- `GEORG_EYERIG_VIEW_COMFORT_CLAY_VIS_01` · PASS for continuation.

No merge or Live promotion is implied by this acceptance. PR #104 remains the working EyeRig owner.

### Next EyeRig slice

**EYE_RIG_PER_EYE_CONTROL_01**

Reason:
the highest-value remaining authoring gap is already known from prior review:
- current placement is still fundamentally paired/mirrored;
- some actors require independent left/right placement;
- Survivalist / eyepatch is the concrete first case requiring per-eye visibility.

Bounded outcome:
1. keep the current mirrored pair as the default/backward-compatible mode;
2. add optional independent L/R position offsets without rewriting EyeRig ownership;
3. add per-eye visibility `left/right`;
4. first proof = Survivalist eyepatch / one-eye-off;
5. existing 40-profile browser data must load unchanged;
6. no automatic migration/reset of old profiles;
7. then review whether any other actors genuinely need asymmetric eye authoring.

Deferred until after that proof:
- Farmers A/B exact texture → Farmer_A/Farmer_B mapping;
- Blender/NoEyes cleanup batch for unresolved source-eye actors;
- separate FrankenStein/Pet Studio inline-number parity;
- profile promotion / consumer rollout.

Exactly one next gate:
`EYE_RIG_PER_EYE_CONTROL_01`.

## 2026-10-03 · FINAL HANDOFF · HUMAN-ACCEPTED VIEW/WHEEL SLICE

Status: **HUMAN ACCEPTED · CHECKED IN · READY NEXT SLICE**

### Exact owner

- repo: `georg-doc/kayfabizarro`
- branch: `toolbox/eye-rig-batch-2026-09-18`
- Draft PR: **#104 · OPEN · UNMERGED**
- metadata parent before this final Return: `8e7b90a735519aeff7a15e77bc4c128c2b933315`

### Accepted runtime

Human feedback:
**"das klappt alles."**

Accepted Stage behavior:
- actor catalog / roster boot;
- Rig_Large switching;
- bounded wheel zoom v2;
- Neutral / Clay K1 view.

Accepted app blob:
`5635b28496af0e06cfe7f60a01b23e5612bad6e1`

Original wheel-repair Stage:
`cloudflare-live@888a57cfe820890fa2ac3a86f991d05a58834ee3`

The same accepted app blob was re-read unchanged at later concurrent Cloudflare heads before closing this handoff.

Current public Hub routing metadata:
`cloudflare-live@5f9030e84073f890bf4680db673640cfceed5f13`

Direct Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

### Evidence

Focused technical evidence retained:
- boot repair: **6/6 PASS**;
- Clay/view comfort slice: **15/15 PASS**;
- bounded wheel repair v2: **13/13 PASS**;
- human browser acceptance: **PASS**;
- screenshots supplied in this acceptance turn: **0**;
- formal browser proof artifact: **none**; human direct-Stage acceptance is the acceptance evidence.

No new runtime code was written after the accepted wheel revision.

### Durable surfaces updated

- `SOURCE.json`
- `RETURN.md`
- EyeRig `CHANGELOG.md`
- central `skills/chat/CHANGELOG.md`
- `skills/chat/REGISTRY.json`
- `kfb-hub/index.html`
- public ToolBox Stage Hub card
- public `hub-ui-v2` task
- next-slice brief:
  `docs/PER_EYE_CONTROL_BRIEF_2026-10-03.md`

### Current unresolved items

1. independent L/R eye authoring;
2. per-eye visibility, with Survivalist eyepatch as first proof;
3. Farmers exact A/B texture → Farmer_A/Farmer_B mapping;
4. unresolved Blender/NoEyes cleanup for selected actors;
5. separate FrankenStein/Pet Studio inline-number parity;
6. later approved-profile / consumer promotion.

### Exactly one next slice

**EYE_RIG_PER_EYE_CONTROL_01**

Bounded outcome:
- mirrored pair stays default and backward-compatible;
- optional L/R position deltas;
- left/right visibility;
- existing 40-profile browser data loads unchanged;
- first proof = Survivalist eyepatch / one-eye-off;
- no second EyeRig owner;
- no merge / no Live promotion.

First human gate after implementation:
`GEORG_EYERIG_PER_EYE_SURVIVALIST_VIS_01`.

## 2026-10-03 · PRIORITY CORRECTION · LEGACY BEFORE PER-EYE DETAIL

Georg correctly reprioritized the roadmap: **Legacy character coverage is the next major EyeRig step; per-eye/eyepatch controls are a later detail slice.**

Current Legacy truth already exists and must be reused rather than rebuilt:

- Draft PR: **#162**
- branch: `chatgpt-web/legacy-eye-batch-17-2026-09-21`
- current PR head: `7b1b52a60d64c9dc710514a59d1a7365f8a168e7`
- persisted-profile tested head: `91cca48809fb8a86c8ea7a8326eb6637fa89a066`
- **17/17 Legacy head profiles persisted**
- **16 MEASURED_CANDIDATE**
- **1 HUMAN_REQUIRED: Skull**
- automatic source-first browser/WebGL: **247/247 PASS**
- persisted-profile reconstruction: **215/215 PASS**
- zero failed resources / zero browser-console errors in both proven runs
- existing profile schemas and EyeRig v6 owner retained
- no shared Legacy class default invented

17 head identities:
- Barbarian default / A / B / C
- Knight default / A / B / C
- Mage default / A / B / C
- Rogue default / A / B / C
- Skull

Direct Legacy review route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/legacy/`

### Correct next gate

**KLR-EYE-VIS-01 · 17-head human visual review**

Review all 17 in Front + 3/4:
1. approve / adjust / reject each profile;
2. judge EyeRig placement separately from source-eye cleanup;
3. manually place Skull or leave unsupported;
4. only accepted/adjusted profiles become Combat-/consumer-ready.

### Per-eye status

`EYE_RIG_PER_EYE_CONTROL_01` is **DEFERRED_DETAIL_AFTER_LEGACY**.

The brief remains preserved at:
`docs/PER_EYE_CONTROL_BRIEF_2026-10-03.md`

Use it later for asymmetric cases such as Survivalist eyepatch, but it is no longer the current production gate.

No merge or Live promotion.

## 2026-10-04 · CURRENT RETURN · UNIFIED EYERIG SITE SOURCE READY

Status: **THREE-CLASS SOURCE IMPLEMENTED · 33/33 FOCUSED PASS · SITE PUBLICATION PENDING WORK**

### Product correction completed

The productive EyeRig workbench is now one interface:

`Medium | Large | Legacy`

PR #104 is the single productive UI/runtime owner.

The separate Legacy UI from PR #162 is no longer the intended working surface. PR #162 remains donor/evidence for:
- 17/17 persisted Legacy profiles;
- 16 MEASURED_CANDIDATE;
- Skull HUMAN_REQUIRED;
- proven Legacy assembly / LegacyFaceHost;
- historical browser evidence.

### Exact implementation

Donor/data intake:
`4c34e076360b5e9ece502ff42c8d00130bb41f63`

Unified runtime:
`847954178551952c9f5860cede3cae7fe57bf3ed`

Static contract:
`9247d6b3832bdb73fac20d55bf76a766bc2d4453`

Site contract:
`5084600906fd4cf1b85c237adbbf63730ff1ce62`

Evidence:
`d70223e93ae8d8c81379a22c48f9f4b300d38034`

Source truth:
`cbfe676f8795bab786faf3881d9f1893b1393673`

### Unified class inventory

- Rig_Medium: **55**
- Rig_Large: **8**
- Rig_Legacy: **17**
- total: **80 review identities**

Legacy donor copies in the unified bundle:
- rig adapter `41ba111d264cb73f2b3fbd70370dbb0ba042c91d`
- LegacyFaceHost `186323777ff78a9e4f4a246ad10232dd8ef82bc9`

Those two modules are byte-identical to the proven donor revision.

Legacy data copied exactly:
- `data/rig-legacy-heads.v0.json`
- `data/rig-legacy-default.v0.json`
- `data/rig-legacy-auto.v1.json`

### Shared interface retained

All three classes use the same:
- roster;
- review states;
- Front / ¾ / Side / Face views;
- bounded wheel zoom;
- Neutral / Clay K1;
- source-eye cleanup control;
- Placement;
- Oval;
- Pupil / gaze;
- expressions / blink;
- direct numeric entry;
- import/export;
- Approve / Adjusted approve / Reject flow.

Legacy is class-specific only at actor construction:
exact Legacy source → proven modular assembly → LegacyFaceHost → persisted Legacy profile → existing EyeRig v6 → common controls.

### Persistence

Storage remains:
`kfb.toolbox.eye-rig-batch.v0`

Legacy is additive. No storage clear, reset, namespace replacement or destructive migration was introduced.

### Evidence

Focused unified readback:
**33/33 PASS**

Expanded static contract:
**160 assertions persisted · NOT_RUN**

No GitHub Actions run exists on the tested head, therefore the 160 assertions are not claimed as current CI PASS.

Historical Legacy evidence remains:
- **24/24 + 247/247 PASS** automatic source-first;
- **30/30 + 215/215 PASS** persisted-profile reconstruction.

Medium/Large baseline was human-accepted before this integration.

### Site publication package

Source root:
`tools/KFB-ToolBox/eye-rig-batch/`

Entrypoint:
`index.html`

Manifest:
`site.manifest.json`

Publishing brief:
`docs/EYE_RIG_UNIFIED_SITE_01.md`

Target:
**ChatGPT Site**

Cloudflare is now recovery/regression infrastructure only for this tool. This slice intentionally did **not** create another Cloudflare acceptance fork.

The current Webchat toolset does not expose a Site create/publish action, so publication is not falsely claimed here.

### Exactly one next gate

**EYE_RIG_UNIFIED_SITE_PUBLISH_01**

Work publishes the existing source root as one Site:
- no redesign;
- no Legacy iframe/embed;
- preserve Medium | Large | Legacy;
- preserve relative data/lib files;
- preserve storage key;
- no merge required.

After a Site URL exists:

**GEORG_EYERIG_UNIFIED_SITE_01**

Check Medium, Large and Legacy in the same interface and reload persistence.

Per-eye / eyepatch remains deferred until after Site acceptance.

No auto-merge or Live promotion.



## 2026-10-04 · SITE PUBLISHED · GEORG UNIFIED HUMAN GATE OPEN

Status: **CHATGPT SITE PUBLISHED · SOURCE OWNER UNCHANGED · HUMAN VISUAL ACCEPTANCE OPEN**

Work published the existing unified PR #104 workbench without redesign.

Publication:
- Site: `https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`
- Site project: `appgprj_6ac1b73620f48191ae6e7f101f4b0786`
- Version: `appgprj_6ac1b73620f48191ae6e7f101f4b0786~appgver_5717d8849ad48191b6e277502df17312`
- Deployment: `appgdep_6ac1b854cd3081919f783990f88039f4` · succeeded
- publication source revision: `4f8a82cbea7a0a8c82eafc917b7968b8e77d4e00`
- owner source at publication: PR #104 / `toolbox/eye-rig-batch-2026-09-18` @ `ad26045e8a7b389afe0c8127e80bb66f3e9f2ac3`
- 50 source-root files copied unchanged into the Site publication candidate
- no merge, no Legacy iframe/second UI, no Cloudflare acceptance fork

Published runtime smoke:
- Medium roster: 55
- Large roster: 8
- Legacy roster: 17
- Barbarian Default assembled through LegacyFaceHost + EyeRig v6
- Skull remained `HUMAN_REQUIRED`
- shared controls, views, Neutral / Clay K1, import/export and review controls present

Published exact-source static contract:
**187/191 PASS · 4 FAIL** locally in Work.
The four existing deviations are:
- `source-measured-explicit-candidate`
- `placement-ranges-expanded`
- `placement-range-auto-expands`
- `roster-wired-before-control-init`

This is not relabeled as CI PASS. The earlier focused unified source check remains **33/33 PASS**.

### Exactly one next gate

**GEORG_EYERIG_UNIFIED_SITE_01**

On the Site, verify:
1. Medium loads with prior saved state;
2. switch to Large;
3. switch to Legacy and see all 17 heads in the same interface;
4. load Barbarian Default plus one alternate Legacy head;
5. confirm Skull remains clearly manual / HUMAN_REQUIRED;
6. test numeric controls, bounded wheel zoom and Neutral / Clay K1;
7. reload and confirm class + profile persistence.

Per-eye / eyepatch remains deferred until this unified Site gate is accepted.

No auto-merge or Live promotion.


## 2026-10-04 · HUMAN PASS · UNIFIED SITE FUNCTIONAL · PROFILE RECOVERY OPEN

Georg reviewed the published unified ChatGPT Site and reported that the interface looks good and the tested functions appear to work.

Accepted for continuation:
- one shared `Medium | Large | Legacy` interface;
- class switching;
- Legacy roster/functionality;
- controls;
- bounded wheel zoom;
- Neutral / Clay K1;
- reload/persistence behavior on the Site itself.

Therefore `GEORG_EYERIG_UNIFIED_SITE_01` is **HUMAN_ACCEPTED / PASS FOR CONTINUATION**.

One data-state issue remains:
the new ChatGPT Site does not contain Georg's most recently saved/approved EyeRig profiles from the older Stage session.

Likely mechanism:
the storage key is unchanged (`kfb.toolbox.eye-rig-batch.v0`), but browser LocalStorage is origin-bound. The old `kayfabizarro.pages.dev` Stage origin and the new `frizzlebob.chatgpt.site` origin do not share LocalStorage automatically.

This is a profile/state recovery issue, not a failure of the unified runtime.

### Exactly one next gate

**EYE_RIG_PROFILE_RECOVERY_01**

Recover the newest available Georg-authored batch from:
1. committed GitHub inbox/source exports;
2. Dropbox/toolbox exports;
3. if necessary, one fresh export from the old Cloudflare Stage browser state.

Compare candidates by profile count, review/approval state and source coverage, then import/persist the newest proven batch into the unified Site without resetting newer source/runtime work.

Per-eye/eyepatch remains deferred until profile recovery is resolved.

No auto-merge or Live promotion.


### EYE_RIG_PROFILE_RECOVERY_01 · evidence checkpoint

Recovered export inventory:

- Dropbox `/Mac/Downloads/eye-rig-medium.batch.json` · 2026-10-02 14:03Z · 252,623 B
- Dropbox `/Mac/Downloads/eye-rig-medium.batch (1).json` · 2026-10-02 14:43Z · 303,709 B
- Dropbox `/Mac/Downloads/eye-rig-medium.batch (2).json` · 2026-10-02 17:35Z · 363,596 B
- GitHub PR #104 contains the same semantic 40-profile payload as `eye-rig-medium.batch (2).json` (blob `9e6f10068160cd2c66ee33660f7b1d927273524b`).

40-profile state:
- 40 selected / 40 profiles;
- 2 `ADJUSTED_APPROVED`: `mannequin-medium`, `adventurer-rogue-hooded`;
- 37 `ADJUSTED`;
- 1 `UNREVIEWED`: `gothgirl`;
- additive seven versus the earlier 33-profile export: `paladin-king`, `mummy-b`, `mummy-a`, `survivalist`, `hoarder`, `space-ranger-flight`, `combat-mech`.

This does **not** match Georg's recollection of the later Stage session where many more actors were explicitly Approved. No newer EyeRig batch file was found in Dropbox or the current GitHub owner branch.

Conclusion:
the newest remembered approvals were most likely retained only in the old Cloudflare Stage origin's browser LocalStorage. They cannot be read from the new ChatGPT Site origin or from server-side GitHub/Dropbox unless exported.

The current import path is safe for recovery:
a `Rig_Medium` batch import applies only matching Medium profiles/current Medium selection and persists them into the existing shared storage object. It does not reset Large/Legacy profiles.

Recovery action:
open the old Stage in the same browser profile, export the Medium batch, then compare it against the known 40-profile file before committing/importing it.

Old Stage route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

No runtime change is made until the newest export is recovered.
