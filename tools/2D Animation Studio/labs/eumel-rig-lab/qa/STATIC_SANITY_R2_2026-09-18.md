# Eumel Rig Lab · Static Sanity · r2 · 2026-09-18

Status: **TESTED RESULT · STATIC ONLY**

Checks against current `main` after the neutral-bind / explicit-bone / EyeRig update:

- `site/app.js` syntax: **PASS**
- `shared/rig2d/bone2d.v1.js` syntax: **PASS**
- `shared/eye-rig/eye-rig-2d-adapter.v1.js` syntax: **PASS**
- `neutral_bind_pose.json`: **PASS JSON parse**
- `rig_contract.json`: **PASS JSON parse**
- all 17 expected source `rig-*` component IDs present: **PASS**
- required shared-script references present in `site/index.html`: **PASS**

Pinned blobs at this test:
- app.js: `bd4301811e7e072ae05d04ba2bcd30d373a50d89`
- Bone2D: `ebef6ca2224c939192a96a063e0466e2c1c0cf3b`
- EyeRig2D: `31b5326dd72a6eb05846fe403c6f4ad46a099649`
- neutral bind: `3f080dc26b74e3f2b9ae6283aff18a26347a0782`
- rig contract: `742cb0504bdd0f2ed16bb01f618764c5da9c4a17`
- source components: `457bca8a76bd156ba627763098f0dcfc9a54edc1`

## What changed from the previous browser feedback

- leg swing now has explicit fixed hip pivots;
- neutral bind mathematically corrects the authored angled leg axes toward vertical;
- source pose remains switchable and untouched;
- optional knee bend is isolated to a lower-leg proxy;
- stretch/squash sits on bone wrappers;
- shared EyeRig semantic controls are wired;
- atlas fitting now uses transformed root-space bounds rather than local group bounds.

## What this still does NOT prove

- no real browser retest after these repairs has been observed yet;
- no claim that all 17 atlas cards visibly render until browser QA;
- no claim that the neutral stance feels right until Georg freeplay;
- no claim that the 2D blink fallback is final visual canon;
- no claim that the richer DocCheck eye/eyewear source inventory is fully resolved.

Next evidence level: **real browser playback + screenshot/freeplay QA**.
