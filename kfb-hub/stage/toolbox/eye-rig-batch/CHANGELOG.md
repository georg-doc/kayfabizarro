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
