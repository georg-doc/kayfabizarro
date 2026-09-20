# CA2-02 · Test Report

Date: 2026-09-20  
Implementation under test: `016ea96b5761b7fd66f34df77f0874acb15ea716` plus marker-policy clarification in the current branch.

## Branch browser result

Run `35487908222` · job `106017552194`: **52/52 PASS**

- source marker: PASS;
- exact isolated `Character_Gun.gltf`: PASS;
- exact CombatRanged source: PASS, 20 clips enumerated;
- FB + GothGirl weapon mounts: PASS;
- right `handslotr`: PASS on both;
- grip/muzzle geometry finite and measured: PASS;
- bind delta measured: PASS;
- deterministic release-frame at `0.150 s`: PASS on both;
- two calibration FX events at the same measured release frame: PASS;
- Reload pose: PASS;
- failed HTTP/resources: **0**;
- page/console errors: **0**.

Artifact `10598476584` · `sha256:fc7c3b05bc1e00f3274ca8c3fbd40329eae479a187b3446fb6951c6e603e1706`.

Evidence files:
- `00-source-gun.png`
- `01-aim-compare.png`
- `02-shoot-release.png`
- `03-reload.png`
- `measurement.json`

## Repair history

Initial run `35487764455` failed only on a wall-clock FX expectation after all source, grip, muzzle and marker checks had passed. The calibration bench was repaired to seek the exact measured release frame deterministically; no grip or muzzle values were changed.

Public Cloudflare proof and Georg's visual gate remain open.
