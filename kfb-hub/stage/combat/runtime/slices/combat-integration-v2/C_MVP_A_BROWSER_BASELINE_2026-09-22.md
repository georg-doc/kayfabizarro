# C-MVP-A · exact CA2 Stage packaging and browser baseline

Status: **EXACT PACKAGE COMPLETE · BROWSER FAIL · PUBLICATION AUTHORIZATION REQUIRED**

> Historical C-MVP-A baseline. Its initial EyeRig diagnosis and its attribution of the
> non-finite bounds to Mage source geometry were disproved by C-MVP-A-R1. Preserve this
> file as the pre-repair observation; use `C_MVP_A_R1_BROWSER_REPAIR_2026-09-22.md` for
> the current diagnosis and gate.

## Source lock

- Repository: `georg-doc/KFB-Combat-Arena`
- PR: `#5`
- Implementation source: `954f2db7484dc566e468e5ce89b0d95940d97537`
- Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- No Combat runtime file was changed by C-MVP-A.

## Exact package

- Public repository candidate branch: `georg-doc/kayfabizarro:stage/combat-ca2-pr5-c-mvp-a-2026-09-22`
- Candidate head after Hub metadata: `906c9e93f36664b685ac21cd894ccd1b96981ff2`
- Target: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`
- Portable runtime: **215 files**.
- Every packaged runtime file was compared by Git blob SHA with the locally rebuilt `dist/`: **215/215 identical**.
- The previously blocked 19 WOFF2 files and `assets/vfx/kfb-combat-atlas_4x3.png` are present with their exact source blobs.

Repository-native recheck before packaging:

- tests: **68 passed / 0 failed / 0 skipped**;
- CA2 checks: **8/8 PASS**;
- portable build: **215 files**;
- re-home: **172 preserved runtime / 66 verified donor files / routes PASS**.

## Real-browser baseline

Browser surface used before publication:

`http://127.0.0.1:4185/slices/combat-integration-v2/`

The exact rebuilt package booted in the Codex in-app Chromium browser. It reached `phase=play` with zero captured page errors, but the playable gate failed.

### Passed / observed

- Exact CA2 route and fixed seed loaded.
- Driver Graft body and gun were visible.
- Player telemetry began at `Idle` and 100 HP.
- Browser Walk probe was executed through the visible test control.
- Audio foundation loaded **22/22** files, **0 missing**, **2,931,032 bytes**, and unmuted successfully after user gesture.
- Desktop and `390 × 844` narrow viewport rendered without page errors.
- Fully loaded scene reported approximately **70 render calls** after the test interactions.
- Source load reached `play` approximately **8.05 s** after the first rendered runtime log in this run.

### Blocking failures

1. `DriverCA2` does not forward the host-provided `eyeRigModule` and `mouthModule` into its internal graft mount. Runtime logs therefore state `EyeRig module missing` and `Mouth module missing`. Weapon rendering alone does not satisfy the face/eyes/weapon gate.
2. The Skeleton Mage produces a non-finite `Box3` result in the current visual-source scaling path. `rohH`/scale becomes `NaN`; pair separation then propagates non-finite X/Z positions to both admitted enemies.
3. Browser telemetry consequently reports both enemy positions as `[null, 0, null]`.
4. The visible Fire probe emitted 14 shots but recorded **0 hits / 0 kills**. Warrior/Mage defeat, Rewards/Run-Clear, and a coherent player defeat/respawn lifecycle therefore cannot be proven.
5. A real target click changed `Idle → Idle_Gun`, but no projectile release was recorded against the invalid enemy state. The real muzzle plus return-to-locomotion gate remains failed.

The existing Respawn control was executed once. It reproduced the same two non-finite enemy positions; no repair was attempted because C-MVP-A forbids Combat feature/runtime changes.

## Console and asset notes

- Application error counter: **0**.
- Console errors: **0 captured**.
- Two Three.js sigma clipping warnings were captured.
- `schrittmass.json nicht erreichbar` was logged, followed by a successful live locomotion measurement fallback.
- EyeRig/Mouth absence is a real module wiring failure, not a transport or 404 substitution.

## Publication state

The exact package is ready on its bounded publication branch. Moving it to `cloudflare-live` was rejected by the protected publication gate because the browser candidate is failing and has not received an explicit post-failure human authorization. Therefore:

- `DEPLOYED`: **NO**
- `PUBLIC_VERIFIED`: **NO**
- `HUMAN_ACCEPTED`: **NO**

## One next gate

Georg decides whether the browser-failing but exact package may nevertheless be published to the fixed Combat Stage as a reproducible failure surface. No C-MVP-B, Legacy, melee, Spindle or other Combat work starts here.
