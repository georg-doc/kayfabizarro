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

## 2026-10-03 · Source palette variants

- recovered 40-profile Medium batch remains the current authoring intake; previous **33/33** profiles are preserved;
- reused Resident Variant SSOT PR #330: **25** multi-texture character families / **56** source appearances;
- added `data/appearance-variants.v1.json` and a compact **Appearance / source palette** selector;
- palette selection reuses the same geometry-owned EyeRig profile rather than duplicating actors/skeletons;
- Magical Girl exposes **A/B/C/D**;
- Driver exposes **BASE/B**;
- Paladin King remains the fixed B precedent;
- other audited palette families are registered through the same manifest;
- Farmers A/B are registered but switching is source-gated until exact palette-to-model mapping is proven;
- persistence remains under `kfb.toolbox.eye-rig-batch.v0` with additive `appearanceByActor`;
- focused readback checks: **20/20 PASS**, including **56/56** exact path/blob/revision match to PR #330;
- Stage mirror: `cloudflare-live@479c4e91967565b583c76ed0c6ea07433c5b28ce`, exact file readback PASS, public browser verification still OPEN;
- one current gate: `GEORG_EYERIG_CONTROL_R2_VARIANTS_VIS_01`.

## 2026-10-03 · Boot repair after Stage feedback

- observed: roster remained at `Loading actor catalog…`; Large button was inactive;
- proven cause: `initInlineNumberEditors()` used `$()` then `.forEach()`, throwing before `wireRoster()`;
- fixed to `$$('output[data-out]').forEach(...)`;
- moved roster/class wiring before runtime-control initialization;
- added visible boot progress and exact visible boot-failure text;
- focused regression **6/6 PASS**;
- palette layer remains intact at 25 families / 56 appearances;
- Stage mirrored at `cloudflare-live@d2cbc94ddde4d7c281a492db350119005f22e153`;
- current gate: `GEORG_EYERIG_BOOT_REPAIR_VIS_01`.

## 2026-10-03 · View comfort + Clay K1

- Georg accepted the prior boot repair;
- reduced Orbit mouse-wheel zoom sensitivity to `0.28` with the existing OrbitControls owner;
- added reversible `Neutral | Clay K1` Stage view;
- copied Resident Atlas S15 `clay-k1.js` and `clay-soften.v1.js` byte-identically rather than rewriting clay deformation;
- retained K1 budgets: 4k tris/mesh, max 2 levels, 160k total added tris, cache, no-subdivision skinned path;
- EyeRig + FaceHost are excluded from K1 deformation;
- floor uses pinned `clay_floor_001` diffuse/normal/roughness;
- GTAO/K2 intentionally remains off in this authoring view;
- focused checks: **15/15 PASS**;
- full historical static suite: **NOT_RUN** due container DNS failure before checkout;
- Stage mirror: `cloudflare-live@6406774131723288b757fd676e6d7be3f08b1123`;
- current gate: `GEORG_EYERIG_VIEW_COMFORT_CLAY_VIS_01`.

## 2026-10-03 · Wheel zoom repair 02

- first `zoomSpeed=.28` comfort pass rejected by human test: wheel still jumped to extremes;
- native OrbitControls wheel zoom disabled;
- added bounded/smoothed wheel input adapter against the same Orbit target;
- safe distance 1.6–8.0;
- fixed step 0.12/event;
- gesture cap 0.65 inward / 0.85 outward;
- 160 ms gesture reset;
- damp factor 14; max 0.09 camera units/frame;
- presets re-sync wheel target;
- focused checks **13/13 PASS**;
- Stage `cloudflare-live@888a57cfe820890fa2ac3a86f991d05a58834ee3`;
- current gate `GEORG_EYERIG_WHEEL_ZOOM_VIS_02`.

## 2026-10-03 · Human acceptance · boot / wheel / Clay K1

- Georg confirmed: **"das klappt alles"**;
- boot/roster + Rig_Large switching accepted;
- bounded wheel repair v2 accepted;
- Neutral / Clay K1 view accepted for continuation;
- accepted runtime app blob: `5635b28496af0e06cfe7f60a01b23e5612bad6e1`;
- that exact app blob remains present at later concurrent `cloudflare-live@26bb3926bde5a2e1e519409d182a62b654cfba71`;
- closed human gates: `GEORG_EYERIG_BOOT_REPAIR_VIS_01`, `GEORG_EYERIG_WHEEL_ZOOM_VIS_02`, `GEORG_EYERIG_VIEW_COMFORT_CLAY_VIS_01`;
- next EyeRig slice: `EYE_RIG_PER_EYE_CONTROL_01`;
- no merge / no Live promotion.

