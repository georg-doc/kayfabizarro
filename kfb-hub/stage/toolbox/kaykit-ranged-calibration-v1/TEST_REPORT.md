# CA2-02 · Test Report

Date: 2026-09-20  
Final runtime under test: `a5e09d6744f4a26e63a5f7e706be8a631459d28d`

## Final branch browser result

Run `35489464770` · job `106021777516`: **55/55 PASS**

- exact isolated `Character_Gun.gltf`: PASS;
- exact `Rig_Medium_CombatRanged.glb`: PASS, 20 clips enumerated;
- FB + GothGirl weapon mounts: PASS;
- `handslotr`: PASS on both;
- grip/muzzle geometry: measured and finite;
- bind delta: position `0`, forearm `0`, quaternion about `0.000002°`;
- deterministic Release Frame: `0.150 s`;
- single-shot scheduled markers: exactly `[0.150]` per actor;
- later `0.883 s` rotational peak: measured, explicitly not promoted;
- Reload pose: PASS;
- failed HTTP/resources: **0**;
- page/console errors: **0**.

Branch artifact `10598656283` · `sha256:6a986f361a91c667a3ef01084fc661435ac8b75071efa5b47963cbe7157eb9bc`.

## Public Cloudflare proof

Run `35489464770` · public job `106021777418`:
- exact runtime marker: **PASS**;
- KFB Hub → Stage navigation: **PASS**;
- browser: **55/55 PASS**;
- failed HTTP/resources: **0**;
- page/console errors: **0**.

Public artifact `10598539749` · `sha256:04fe77711f3af6ba4d1243ea068d37606b7a0685eab54891a60ea3057326a3e9`.

Proofed publication: `cloudflare-live@cf15f612e6a700608564cadbded4302ba59b1af2`.

## Repair note

The previous red metadata run exposed duplicate preview FX counting at the deterministic Release Frame: the manual calibration flash and the next normal preview tick both counted the same primary marker. Runtime `a5e09d6…` marks the primary marker as already fired before the manual flash. The projectile schedule itself remained `[0.150]`; grip, muzzle and release measurements were unchanged.
