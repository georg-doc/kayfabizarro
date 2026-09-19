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
