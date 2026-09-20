# CA2-02 · Test Report

Date: 2026-09-20  
Final runtime under test: `a5e09d6744f4a26e63a5f7e706be8a631459d28d`  
Proofed branch head: `431723aa69316136aeeb0d7411d28846fe0d41da`

## Final branch browser result

Run `35489658278` · job `106022296749`: **55/55 PASS**

- exact isolated `Character_Gun.gltf`: PASS;
- exact `Rig_Medium_CombatRanged.glb`: PASS, 20 clips enumerated;
- FB + GothGirl weapon mounts: PASS;
- `handslotr`: PASS on both;
- grip/muzzle geometry: measured and finite;
- bind delta: position `0`, forearm `0`, quaternion about `0.000002°`;
- deterministic Release Frame: `0.150 s`;
- scheduled single-shot markers: exactly `[0.150]` per actor;
- later `0.883 s` rotational peak: measured, explicitly not promoted;
- Reload pose: PASS;
- failed HTTP/resources: **0**;
- page/console errors: **0**.

Branch artifact `10598448427` · `sha256:f1dc330364eaf77eb13b2b58634501f2be43582519dcbc125d0deb95acbfbda8`.

## Public Cloudflare proof

Run `35489658278` · public job `106022296782`:
- exact runtime marker: **PASS**;
- KFB Hub → Stage navigation: **PASS**;
- browser: **55/55 PASS**;
- failed HTTP/resources: **0**;
- page/console errors: **0**.

Public artifact `10598651751` · `sha256:7f8140c90f84f2d7f528b27f431a0843ca5e408901057c027bef30f0bf8c7449`.

Proofed publication: `cloudflare-live@cf15f612e6a700608564cadbded4302ba59b1af2`.

## Recovery note

The interrupted chat occurred after the first public proof. Sanity recovery found one preview-only duplicate FX count in the deterministic Release Frame: the manual calibration flash and the next preview tick could both count the same marker. Runtime `a5e09d6…` records that marker as fired before the manual flash. The actual single-shot schedule remained `[0.150]`; grip, muzzle and release measurements were unchanged.
