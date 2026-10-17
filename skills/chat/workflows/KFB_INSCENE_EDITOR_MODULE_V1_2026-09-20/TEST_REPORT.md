# TEST REPORT · KFB shared Scene Patch v1

Date: 2026-09-20  
Repository: `georg-doc/kayfabizarro`  
Branch: `toolbox/scene-patch-adapter-v1-2026-09-20`  
Tested head: `f3cb12d119a0e565b1d8b09a9eb2d667c6e8b218`  
Workflow: `.github/workflows/scene-patch-resident-host-qa.yml`  
Final run: **35538997214 · SUCCESS**

## Final two-host result

**42/42 browser assertions PASS · 0 page/console errors**

### Resident Atlas · 20/20 PASS

Job: `106153085670`  
Artifact: `10613164419` · `scene-patch-resident-host-proof`  
Digest: `sha256:98cd2c722dbe1b2de427e456112b901ed4f988984ebe6472da36782570eaa2e0`

Proven in real Chromium/WebGL:
- real `caveman-cave-camp` scene loads;
- 10 Habitat/Prop objects register with stable IDs and exact source paths;
- animated actor remains excluded from v1 editing;
- shared editor toggles, selects and exposes object menu + compact patch dock;
- move produces exactly one `kfb.scene-patch.v1` op;
- local draft is written;
- reset restores baseline;
- import restores the moved transform;
- wrong object source is rejected before mutation;
- wrong host revision is rejected before mutation;
- rejected imports leave transforms untouched;
- undo/redo works.

### Dungeon S13.2 · 22/22 PASS

Job: `106153182304`  
Artifact: `10614046695` · `scene-patch-dungeon-host-proof`  
Digest: `sha256:6e68d6b297c2c94a2b2124c1811b309e4d0b224fe3867a7c3d7a355bee1f482c`

Proven in real Chromium/WebGL:
- current S13.2 generator boots and generates a real seeded dungeon;
- at least one real KayKit candle/light prop is registered;
- only `layer:candle` is editable;
- structural generator objects remain read-only;
- exact KayKit Dungeon registry paths stay attached to patch ops;
- read-only structure cannot attach the gizmo;
- move produces one Dungeon patch op;
- original generator `placements` remain byte-for-byte unchanged by move and roundtrip;
- reset restores baseline;
- import restores the moved candle;
- the existing light record follows the moved candle by the same +0.25 world-X delta;
- wrong asset source and wrong host revision are rejected atomically;
- rejected imports leave transforms untouched.

## Repair history kept visible

### Resident gate

Run `35538219263` failed after the interaction checks because a rejected validation result exposed live Three.js nodes and could not be JSON-serialised. Repair removed live objects from the reject API. Runs `35538329685`, `35538452999`, and final run `35538997214` passed.

### Dungeon gate

First Dungeon run `35538696300` failed at boot with `SyntaxError: Unexpected reserved word`. Root cause: the first `Raycaster` occurrence belonged to S13.2's internal `rayProbe()`, not the UI picker; an overly broad replacement cut the original generator control section. Repair rebuilt the Dungeon host from exact `main@6c1b02a3338c005127d45bc7bff3ecbb785f1342`, preserved the original `rayProbe`, `regen`, controls and Recipe export, and replaced only the second UI-picker block. Final run `35538997214` passed.

No third repair pass was used.


## Isolated Stage mirror proof · 2026-09-22

Workflow: `.github/workflows/scene-patch-stage-mirror-qa.yml`  
Run: `35539447295` · **SUCCESS**  
Job: `106154340023`  
Artifact: `10613569458` · `scene-patch-stage-mirror-proof`  
Digest: `sha256:9cdd04a2abbf53fae64c75ab17c7e3216ad0ad0fad2804ecdaa6c8d93baef4a8`

Result: **13/13 PASS · 0 page/console errors**.

The mirror proves the packaged root plus both embedded hosts from the exact Stage tree, including build markers, source identities and editor activation. This is additional to the 42/42 host tests; it does not inflate them into a single count.

## Public publication gate

Publication branch files were fetch-back verified at `cloudflare-live@f0c269904de722b86260e1657928e9a1936127b4`.

Attempt 1: run `35671642443` / attempt 1 — **FAIL** at public child-route readiness; artifact `10671785860`, digest `sha256:75167671838e59b0ed51b2e2badb4560c9af90091c7fe8024bfd55ffc0419ef5`. No Stage-mirror regression was observed. Public PASS is not claimed.

Attempt 2 is the final public-sync retry allowed by this slice. If it fails, the candidate remains preserved as **42/42 host PASS + 13/13 Stage-mirror PASS / PUBLIC BLOCKED**.


## Final public result

Run: `35671642443` · attempt 2 · **SUCCESS**  
Job: `106570350236`  
Artifact: `10671626183` · `scene-patch-public-proof`  
Digest: `sha256:356dbf12428252b54040e50a4077767e0cac3234c74982adbdaf4ca28a4bb2cf`

**13/13 public browser assertions PASS · 0 page/console errors**

Proven on the exact Cloudflare URLs:
- root returns HTTP 200;
- root build marker = `KFB_SCENE_PATCH_V1_2026_09_20`;
- Resident frame is public and its adapter registers 10 editable Habitat/Prop records;
- Resident source ref is exact;
- Resident editor opens;
- Dungeon frame is public;
- Dungeon adapter registers only generated `candle` records as editable;
- Dungeon source ref is exact;
- Dungeon editor opens;
- KFB Hub returns HTTP 200;
- KFB Hub links the Scene Patch Stage;
- final browser/page error list is empty.

Direct route:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/scene-patch-v1/

Evidence ladder for this slice is therefore:
- **42/42** real two-host implementation browser assertions;
- **13/13** isolated Stage-mirror browser assertions;
- **13/13** real public Cloudflare browser assertions;
- human visual/interaction acceptance: **OPEN**.
