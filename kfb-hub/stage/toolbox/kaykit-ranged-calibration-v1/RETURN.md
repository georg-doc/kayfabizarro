# CA2-02b · Return

Status: **PITCH-TUNING CANDIDATE · BRANCH PROOF PENDING**

## Human gate input

Georg accepted the basic fist/grip position but found Aim and Fire too high. Requested correction: keep the Frankenstein/Studio position, tip the separate gun forward/down a little, and do not build the future inline 3D gizmo into this calibration slice.

## Bounded change

- Studio base grip stays documented as `[-14, 77, 0]` in YXZ.
- Human visual pitch delta: `-5°`.
- Effective candidate: `[-19, 77, 0]`.
- Same correction is applied explicitly to FrizzleBob Driver Graft and GothGirl.
- Position offsets, yaw, roll, scale, hand socket, muzzle geometry, `0.150 s` primary release and Arena ownership are unchanged.
- Locomotion optimization remains deferred.

## Intended behavior

- `Ranged_1H_Aiming`: muzzle should read approximately horizontal.
- `Ranged_1H_Shoot` at `0.150 s`: animation may lift the muzzle above Aim as recoil.
- Ballistics/projectile physics are still Arena-owned and are not added here.

## Source

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/ca2-02-ranged-calibration-2026-09-20`
- runtime candidate: `d32b71d800a8d5ffc7c58828b1544e6d47731143`
- PR: `#135` remains Draft.

## Next gate

Branch browser measures Aim world pitch on both actors and compares it to Release-frame pitch. Only after that passes is this candidate mirrored to the fixed Cloudflare Stage.
