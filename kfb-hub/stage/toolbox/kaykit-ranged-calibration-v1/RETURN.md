# CA2-02b · Return

Status: **FROZEN FAILED PITCH CANDIDATE · PUBLIC BASELINE PRESERVED**

Georg's visual diagnosis remains valid: fist/grip seating is basically acceptable, while standard Aim reads too high.

Two bounded rotation-only repairs were measured:
- Pass 1: `-5°` X delta → Aim **+12.471°** → FAIL.
- Pass 2: `+1.5°` X delta → Aim **+5.151°** → improved, but still FAIL against ±3.5°.

Stop rule reached. No third blind Euler tuning is attempted.

The canonical public Stage remains the previous proven CA2-02 baseline and was not overwritten:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

Public baseline runtime: `a5e09d6744f4a26e63a5f7e706be8a631459d28d` · run/job `35489658278/106022296782` · **55/55 PASS**.

Full failure-recovery packet:
`kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/failure-recovery/CA2_02B_PITCH_2026-09-20/START_HERE.md`

## Next gate

Consume one transform from Georg's external/universal inline 3D gizmo while `Ranged_1H_Aiming` is frozen at deterministic action time. Keep grip position/offsets, scale, socket, muzzle geometry, release `0.150 s`, locomotion and Arena ownership locked. Then rerun one browser gate.
