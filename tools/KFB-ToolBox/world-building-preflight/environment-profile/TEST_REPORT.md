# WB1-P1 · Environment Profile · Test Report

Status: **PASS FOR WB1-P1 SCOPE · AUTOMATED PUBLIC BROWSER PASS · HUMAN SCOPE PASS · LIGHTING COMPOSITION NOT CANON**
Date: 2026-09-23
Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/world-builder-p1-environment-profile-2026-09-23`
Implementation checkpoint: `bbf9a8ead0750dcb69be68d4d1a2a7136bd25ceb`
Frozen review runtime: `a48729460c28edc2ae95abbfcdef66fe52a84f50`
Public proof run: `35807858806`

## Scope

This report covers WB1-P1 only: the isolated WhackMan-derived Environment Profile candidate under
`tools/KFB-ToolBox/world-building-preflight/environment-profile/`.

It does **not** start WB1-P2 and does not accept the review scene's exact light placement, torch spacing
or final composition as production lighting canon.

## Repository-native tests actually run

```bash
node test/profile-core.test.mjs
node --check profile-core.mjs
node --check material-profile.mjs
node --check environment-rig.mjs
node --check demo.mjs
```

Result: **8/8 PASS**, plus **4/4 syntax checks PASS**.

| # | Check | Result |
|---|---|---|
| 1 | schema is `kfb.environment-profile/1` | PASS |
| 2 | Environment Profile does not own MaterialProfileRef | PASS |
| 3 | nearest-light pool never exceeds configured maximum 6 | PASS |
| 4 | torch flicker differs across independent pool phases | PASS |
| 5 | local visibility changes independently of global dusk/background/fog | PASS |
| 6 | `WHACKMAN_MATTE_CANDIDATE` restores exactly to SOURCE material state | PASS |
| 7 | runtime source contains no WhackMan movement / MazeGraph dependency markers | PASS |
| 8 | source-truth P1 calibration retained: exposure 1.0, fog .019, decay 2, range 18, local 46 / decay 1.6 | PASS |

## Source-object-first proof

The review begins in **SOURCE TORCH** mode using the real `torch_mounted.gltf` donor, imports the
existing Dungeon-owner `collectTris()` and `measureFlame()` functions, measures the source flame
point and unlocks the Environment proof only after the source object has rendered.

Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-builder-p1-review/`

Observed automated marker:
`SOURCE OBJECT RENDERED · ENVIRONMENT PROOF UNLOCKED`

## Historical blocked transport

Two earlier browser attempts from the restricted chat container stopped before page load with
`net::ERR_BLOCKED_BY_ADMINISTRATOR`.

That blocker was resolved by using the permitted zero-install KFB Stage transport. The P1 runtime was
not changed to solve transport.

## Public automated browser proof

GitHub Actions run `35807858806`: **PASS**.

Observed on the exact Cloudflare route:

- exact Stage marker `WB1-P1 · STAGE A487294`: PASS;
- source isolation rendered: **true**;
- source `consoleErrors=0`;
- integrated proof state: **ENVIRONMENT**;
- DUSK `FogExp2` density: **0.019**;
- active torch pool: **6 / 6**;
- Local Visibility tested to **1.00**;
- material switched to MATTE and restored to `SOURCE_MATERIAL`;
- page errors: **0**;
- failed HTTP requests: **0**;
- screenshot artifact: `wb1-p1-stage-review-evidence`, artifact ID `10728163540`.

Representative automated snapshots:

```text
SOURCE:
sourceIsolationRendered=true
consoleErrors=0
activePool=0/6
materialRef=SOURCE_MATERIAL

INTEGRATED:
proof=ENVIRONMENT
activePool=6/6
fogType=FogExp2
fogDensity=0.019
localVisibility=1
consoleErrors=0
materialRef=SOURCE_MATERIAL
```

## Human review · Georg · 2026-09-23

**PASS for the intended WB1-P1 scope.**

Accepted:
- source-object-first review behavior;
- Environment Profile separation and controls;
- DAY/DUSK switching;
- torch profile/flicker mechanism;
- Local Visibility mechanism;
- reversible SOURCE ↔ MATTE CANDIDATE behavior;
- the candidate is sufficient for what P1 is meant to prove now.

Explicit non-canon caveat from human review:

The review scene does **not** represent the eventual production lighting situation. In particular,
the current primary light setup and the staging/spacing of the torches are not accepted as final
lighting composition. They are a deliberately small proof arrangement and must not be promoted as
a World/scene lighting template.

This caveat does **not** block WB1-P1 because final scene lighting composition was not the gate target.

## Optional Game Development Studio

`game-dev` was unavailable in the execution environment. Sealed Game Development Studio evidence is
not required by WB1-P1, so repository-native + public browser evidence is sufficient for this gate.

## Gate result

**WB1-P1 COMPLETE for its bounded Environment Profile proof.**

No runtime repair follows from the human note. Final production light placement, torch staging and
scene-specific lighting composition remain future authoring concerns rather than Environment Profile
contract truth.

Exactly one next gate after this STOP:

**WB1-P2 · prove the same tiny logical recipe across FLAT / SPHERE / TORUS without creating a second
world, terrain, movement or camera owner.**
