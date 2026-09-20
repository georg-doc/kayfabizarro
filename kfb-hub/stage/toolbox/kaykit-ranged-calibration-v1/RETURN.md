# CA2-02b · Return

Status: **SECOND / FINAL PITCH REPAIR · BRANCH PROOF PENDING**

## Human gate input

Georg accepted the fist/grip position but found Aim and Fire too high. Position/offset stays from the Studio calibration; only the gun's X-Euler pitch is tuned. The future inline 3D gizmo remains outside this slice.

## Pass 1 measurement

The first visual assumption (`-5°` from Studio base) was measured in Chromium and proved to be the wrong axis direction: FrizzleBob Aim world pitch became **+12.471°**.

## Pass 2 candidate

- Studio base: `[-14,77,0]` YXZ.
- Corrected delta: `+1.5°` on X Euler.
- Effective candidate: `[-12.5,77,0]`.
- Applied identically to FrizzleBob Driver Graft and GothGirl.
- Offsets, yaw, roll, scale, `handslotr`, muzzle geometry and `0.150 s` release are unchanged.
- No ballistics, locomotion tuning or inline editor is added.

## Gate

Aim must measure within ±3.5° of horizontal on both actors. Release at `0.150 s` must still lift at least 3.5° above each actor's Aim, preserving visible recoil.

This is the second and final repair pass for this gate.
