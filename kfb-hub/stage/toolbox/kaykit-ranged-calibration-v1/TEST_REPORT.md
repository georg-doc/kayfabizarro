# CA2-02 · Test Report

Date: 2026-09-20  
Final runtime under test: `36072e4797d4915d87673432de176e1fa46dcea9`.

## Branch browser result

Final branch run `35488456185` · job `106019011389`: **55/55 PASS**

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

Branch artifact `10597654212` · `sha256:c35871f008acbffbe6eb1622d2b5cc20841d5f9944bcaa02325499e30fb3c4c6`.

Evidence files:
- `00-source-gun.png`
- `01-aim-compare.png`
- `02-shoot-release.png`
- `03-reload.png`
- `measurement.json`

## Repair history

Initial run `35487764455` failed only on a wall-clock FX expectation after all source, grip, muzzle and marker checks had passed. The calibration bench was repaired to seek the exact measured release frame deterministically; no grip or muzzle values were changed.

## Public Cloudflare proof\n\nRun `35488456185` · public job `106019011425`: marker PASS, KFB Hub/Stage navigation PASS, **55/55 PASS**, 0 failed resources, 0 page/console errors. Public artifact `10597659083` · `sha256:f641fee4394584f12013b2edb455d31ec015e50f48f71fbdef40369ed3f2705c`.\n\nProofed publication: `cloudflare-live@cf71a28f8ca776d3a09e7653729363a52a5b135e`. Georg's visual gate remains open.
