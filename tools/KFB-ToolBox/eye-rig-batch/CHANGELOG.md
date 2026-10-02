# Batch EyeRig Atlas · Additive Changelog

## 2026-09-19 · Checkpoint 1 · SOURCE / DECISION

### SOURCE
- recovered `main` at `5650b6c54d8789b20ea80abe857688173d506d3b`;
- read the complete Batch EyeRig brief including source-face cleanup and 2D alignment addendum;
- verified existing EyeRig v6, FaceHost v1, expression contract and source-face component utilities;
- verified the implementation directory previously contained only preparation documentation;
- searched connected Dropbox as secondary historical context; GitHub remains SSOT.

### DECISION
- first bounded proof = GothGirl / `Rig_Medium`;
- reuse exact connected-component cleanup precedent with a 12-component fail-closed guard;
- reuse `faceShells()` + `buildStripped()`, FaceHost v1 and EyeRig v6;
- no Large, Legacy, face-graft, vehicle or plant expansion in this checkpoint.

### IMPLEMENTATION
- added source audit;
- added revision-pinned GothGirl EyeProfile seed.

### TESTED RESULT
- source audit only; runtime/browser not yet built at this checkpoint.

## 2026-09-19 · Checkpoint 2 · IMPLEMENTATION

Commit: `d900fb99f3b04d52f266febd1501368c5fedd360`

### IMPLEMENTATION
- added Atlas-style browser workbench;
- added local KayKit→FaceHost→EyeRig-v6 adapter;
- added reusable donor-based source-face cleanup with exact GothGirl 12-component guard;
- added source/cleaned/EyeRig compare controls;
- added standard evidence cameras;
- added six expression controls, blink, gaze, life and kinetics;
- added one-mixer bind/idle/walk/run/jump motion regression;
- added profile review + import/export workflow.

### TESTED RESULT
- static suite: **22/22 PASS**;
- JavaScript syntax: **3/3 PASS**;
- branch head and all six runtime/test paths fetched back successfully;
- candidate blob identity verified against the tested local files;
- two Chromium attempts stopped before app execution at container EGL/X initialization; classified `BROWSER_ENVIRONMENT_UNAVAILABLE`, not PASS and not application FAIL.

### PUBLIC DEPLOYMENT
- fixed Stage route selected: `/kfb-hub/stage/toolbox/eye-rig-batch/`;
- publication mirror still pending at this checkpoint.

### GEORG ACCEPTANCE
- OPEN.

### OPEN
- Cloudflare Stage publish + exact public URL check;
- Georg visual/tuning gate before expanding Medium batch.

### ARCHIVED HISTORY
- one interrupted, unreferenced Git blob was left outside the branch; recovery proved no partial branch write and resumed without duplicate commit.


## 2026-09-19 · Checkpoint 3 · PR / STAGE / ROUTER HANDOFF

### SOURCE
- draft PR **#104** opened against `main`; no merge performed;
- implementation checkpoint remains `d900fb99f3b04d52f266febd1501368c5fedd360`.

### PUBLICATION
- Stage-only mirror committed to `cloudflare-live` at `f309948a3bd265154e6d3f5c959b69ec9b725f26`;
- fixed route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`;
- KFB Hub publication card updated in the same publication commit;
- main KFB Hub + central router metadata updated at `ac067d09919f744750649e3652dd00036d7ccd6f` without merging EyeRig runtime code.

### TESTED RESULT
- publication branch readback: PASS;
- public URL open: UNAVAILABLE in current web/container environments because `pages.dev` cannot be reached/resolved;
- `PUBLIC_VERIFIED`: OPEN;
- Georg acceptance: OPEN.

### NEXT GATE
Normal-browser review of GothGirl source-eye cleanup, EyeRig placement and head attachment through Front / 3/4 / Side and Idle / Walk / Run / Jump. No Large/Legacy expansion and no Live promotion before that gate.


## 2026-09-19 · Checkpoint 4 · PUBLIC BROWSER PROOF

### PUBLIC DEPLOYMENT
- publication/proof head: `e56ae972d05e06c5112fe2de4314192c3e3c8110`;
- final public proof run: `35457983922`;
- exact Stage route returned HTTP 200 with the expected source/implementation/PR marker.

### TESTED RESULT
- public Playwright checks: **17/17 PASS**;
- screenshots: **5**;
- page/console errors: **0**;
- source-face cleanup measured: 12 components, eyes 6 + 7;
- FaceHost: OK;
- EyeRig frame: ready;
- required Idle / Walk / Run / Jump clips: present;
- interaction sequence stayed clean.

### VISUAL REVIEW
The candidate is technically sound but not visually accepted. Current `ring=0.30` is clearly oversized/protruding in the generated Front / 3/4 / Side evidence. Keep status `AUTO_CANDIDATE`.

### NEXT GATE
Georg tunes Eye size first, then Inset and spacing/vertical, checks the standard cameras and motions, and explicitly approves or rejects. No Large/Legacy work and no Live promotion before that decision.


## 2026-09-19 · Checkpoint 5 · HANDOFF SURFACES ALIGNED

- main KFB Hub / router now surfaces the final public-proof + tuning-gate state at `8d534f013710d4aa57d1ca2baa7358b2957c35a5`;
- Cloudflare KFB Hub mirror carries the same state at `aaf66bfa4e779c59aa7534998e1650a79551f6e4`;
- Stage runtime itself was not changed after the successful proof head `e56ae972d05e06c5112fe2de4314192c3e3c8110`;
- PR #104 stays Draft/Open/Unmerged;
- next gate remains Georg's visual tuning/acceptance.


## 2026-09-19 · Checkpoint 6 · SOURCE-MEASURED SEED · REPORT ONLY

### IMPLEMENTATION
- added FaceHost-local measurement of the already verified GothGirl source-eye components;
- measurement uses actual skinned vertices and the existing FaceHost transform;
- wired measurement into the runtime report only;
- **did not apply** measured values to the visible EyeRig or approved profile.

### TESTED RESULT
- Cloudflare Stage proof run `35459726128`: **18/18 PASS**;
- screenshots: **5**;
- runtime/page errors: **0**;
- measured normalized source baseline: `dx=0.84913 · dy=-0.05142 · ring=0.06925`;
- measurement status: `MEASURED_NOT_APPLIED`.

### PUBLIC DEPLOYMENT
- report-only Stage head: `9a3345a01935fe87651ec49cea3afc19715f84ef`;
- direct route unchanged: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`.

### NEXT GATE
Expose this verified source baseline as an explicit reversible preview for Georg. Do not silently replace the current candidate and do not merge/promote Live.


## 2026-09-19 · Checkpoint 7 · EXPLICIT MEASURED PREVIEW · VISUAL CONTRADICTION

### IMPLEMENTATION
- added explicit `Use source-measured baseline` action;
- action is disabled until source/FaceHost measurement exists;
- measured values are applied only on user click;
- sliders expand only to the measured values actually required;
- candidate remains `AUTO_CANDIDATE`;
- existing `Reset seed` is the exact rollback path.

### TESTED RESULT
- public Cloudflare Playwright run `35460179569`: **21/21 PASS**;
- screenshots: **6**;
- runtime/page errors: **0**;
- explicit measured apply exact: PASS;
- exact seed reset: PASS;
- artifact: `10589418791`.

### VISUAL FINDING
Screenshot `00-source-measured-baseline.png` contradicts the earlier interpretation that current source eye components 6 + 7 map to the visible eye positions: the measured preview lands near the lateral ear region while central black eye-like source forms remain visible.

The measured `dx=.84913 / dy=-.05142 / ring=.06925` values are therefore reclassified as **DIAGNOSTIC_ONLY**, not a recommended EyeRig seed.

### DECISION
Stop EyeRig placement tuning. Do not guess replacement values.

### NEXT GATE
Build a source-only 12-component isolation/highlight diagnostic and identify the actual current eye/lash/brow/nose/accessory components before changing cleanup or EyeRig calibration. No Medium batch expansion, merge, or Live promotion before this gate.


## 2026-09-19 · Checkpoint 8 · CURRENT SOURCE IDENTITY RESOLVED

### SOURCE
- parsed pinned `GothGirl.glb` blob `b56f67e4ddb7db95ff54fef526148a49289f3915` with the current `faceShells()` connectivity rule;
- confirmed exactly 12 head components;
- added front/side static source projections for components 0–11.

### DECISION
- **eyes = 2 + 3**;
- nose = 1;
- ears = 4 + 5;
- side accessories = 6 + 7 + 8;
- hair = 9;
- brows = 10 + 11;
- historical 6+7 eye interpretation is retained as diagnostic history, not current truth.

### IMPLEMENTATION
- source cleanup now hides 2+3 only behind a fail-closed current-source signature;
- EyeRig, FaceHost, mixer, expressions and seed placement remain otherwise unchanged;
- lashes/brows/nose/mouth remain outside v0 graft scope.

### TESTED RESULT
- source identity checkpoint: `949ff8037df2da88eb91ef825984ef57870b8238`;
- static/contract replay: **28/28 PASS**;
- source write/readback: **PASS**;
- Stage mirror: `c6489fce74f98b2124feb184becd27d2cbe4a922` · readback **PASS**;
- corrected public browser proof: **OPEN** because connector push did not start Actions and current tools cannot access `pages.dev`.

### NEXT GATE
Georg reviews the corrected runtime-generated 2+3 measured baseline on the fixed Stage. No batch expansion, merge or Live promotion before that one visual gate.


## 2026-09-19 · Checkpoint 9 · RIG_MEDIUM CALIBRATION + 4-VIEW QA

### USER VISUAL GATE
The supplied GothGirl 3/4 screenshot rejects the previous default: eye spheres too large/protruding, pupils too large, lids yellow rather than skin-derived.

### IMPLEMENTATION
- added local `rig-medium-default.v0.json` based on the pinned tuned GothGirl JSON;
- mapped old tuned `ring/dx = .32/.49` proportion into current FaceHost measured spacing instead of copying incompatible raw ring units;
- boot fallback ring reduced `.30 → .20`;
- pupil default reduced `.50 → .34`;
- lid base color set from GothGirl face `#e6cbc3`; existing EyeRig v6 darkening remains the renderer owner;
- added legacy untouched-default migration;
- added 4-view QA contact-sheet capture.

### TESTED RESULT
- implementation head `6f7d7988849cf0c74a6551a33ee422d8584c87c2`;
- QA/test head `ef7a8f203762f670e00ccdd27b540703d855807d`;
- focused checks **17/17 PASS**;
- full persisted static suite **37/37 PASS**;
- changed-JS syntax parse **2/2 PASS**.

### PUBLICATION
- Stage mirror `786568b1e4434f458379c3aa5f8a83f3fd82a8d9`;
- GitHub readback PASS;
- public browser proof OPEN because connector writes did not trigger Actions and this environment cannot access pages.dev.

### NEXT GATE
Georg captures the fixed four-view sheet and accepts or rejects the new default before any batch expansion.


## 2026-09-19 · Checkpoint 10 · MEDIUM AUTHORING SEED + STUDIO FEATURES

### DECISION
Georg's tuned browser values become the `Rig_Medium` authoring start:
`.295 / .045 / .153 / track .15 / pupil .34 / inset .40 / lidFit .90 / converge .18 / splay 0 / gloss .10`.

The source-measured baseline remains diagnostic/suggestion-only.

### IMPLEMENTATION
- integrated existing `eyeoval.v1.js` donor;
- added eye Width / Height / Depth / inward Tilt;
- replaced ambiguous Follow-pointer checkbox with Life / Pointer / Fixed tracking modes;
- added always-visible Batch bar;
- added Character + Batch import/export, batch v0.2 roundtrip, selected-actor application and explicit inheritance `rigClass → character → session`;
- documented Mouth/Nose/Brow/Vehicle/plant follow-up lanes without implementing them.

### TESTED RESULT
- implementation `c74cbd6e0691d0bd3bcc574203219cdb0e9f647f`;
- evidence `eeb79850a8142968c418e23b482a330f120dd9c2`;
- **46/46 PASS** persisted suite;
- **15/15 PASS** focused controls;
- **2/2 PASS** changed-JS syntax.

### PUBLICATION
- fixed Stage mirror `40133c8b2d6d8f210003a6ef7cfa793aebac63bf`;
- exact GitHub readback PASS;
- current public-browser proof OPEN; no new Actions run and current web tool cannot access `pages.dev`.

### NEXT GATE
Human review of the expanded authoring surface, then a varied 5–8 actor `Rig_Medium` sample.


## 2026-09-19 · Checkpoint 11 · 27-ACTOR RIG_MEDIUM BROWSER

### SOURCE
- merged verified Medium paths from Animation-Lab handoff, Resident Atlas and existing Frankensteining/resource evidence;
- created `data/rig-medium-actors.v0.json`;
- catalog contains **27 unique Rig_Medium actors**, all declared 23-joint Medium class.

### IMPLEMENTATION
- dynamic actor roster replaces the one-GothGirl roster;
- real model switching;
- All / Unreviewed / Adjusted / Unsupported filters;
- per-actor review/profile persistence;
- review progress count;
- Next unreviewed;
- shared Medium motion clips loaded once;
- one active mixer at a time;
- generic source-eye cleanup reuses `donoreyes.v1.js` and fails closed;
- GothGirl exact 2+3 cleanup remains untouched.

### TESTED RESULT
- implementation `5f2e981cbcf4ca72a6c186c96ed008be535856a9`;
- evidence `fa7fdb5b9c5b9c4d443e4f19f47260f934c90147`;
- **62/62 PASS** persisted contract suite;
- **14/14 PASS** focused actor-browser checks;
- **3/3 PASS** critical JS syntax.

### PUBLICATION
- Stage runtime mirror: `ae61e50d525e942a755cf46d0ed807b49b5a3e38`;
- GitHub readback PASS;
- actor-browser Playwright proof prepared for Clown / Ninja / Magical Girl switching;
- new Actions run NOT started by connector;
- exact public URL inaccessible from current web tool;
- therefore PUBLIC_VERIFIED remains OPEN.

### NEXT GATE
Georg performs the fast Medium review wave in the browser and accumulates real character overrides / unsupported cases.


## 2026-09-19 · Checkpoint 12 · RIG_LARGE MONSTROSITY CALIBRATION

- added verified four-actor `Rig_Large` catalog;
- added Medium/Large class switch;
- Monstrosity chosen as first Large calibration actor;
- no Large default is claimed before explicit human promotion;
- added **Set as Large default** action;
- class defaults, selected actors and current actors persist separately;
- Large uses actual Large animation files; Jump is disabled because no matching Large clip exists;
- Medium workflow remains intact.

Evidence:
- implementation `a843a9e9666d2d0d7d0c6a95f801a969f57941c3`;
- evidence `e60f1db1e2436f11549e44def25ab9b2718eac3b`;
- **82/82 PASS**;
- **3/3 syntax PASS**;
- Stage `670e11d56fe5b85e6264d8a294868c32540db5c6`.

Next: tune Monstrosity, promote the Large default, then compare the other three.


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
