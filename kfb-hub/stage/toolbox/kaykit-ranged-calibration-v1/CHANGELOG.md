# KayKit Ranged Calibration v1 · additive changelog

## 2026-09-20 · CA2-02 measured candidate

### SOURCE
Uses exact `Character_Gun.gltf`, exact Rig_Medium CombatRanged library, existing Driver Graft weapon owner and current ToolBox muzzle/release measurement donors. Source gun is shown in isolation before actor integration.

### MEASUREMENT
FB Driver Graft and GothGirl resolve the same `handslotr` bind frame within measurement precision. Existing Georg grip calibration is retained unchanged. Muzzle local position/axis are identical.

### RELEASE
Single-shot `Ranged_1H_Shoot`: primary release `0.150 s`; later rotational peak `0.883 s` is retained as evidence but not promoted to another projectile. Recovery candidate `0.350 s`.

### RECOVERY / PREVIEW FIX
After the chat interruption, sanity recovery found duplicate preview-FX counting at the deterministic Release Frame. Runtime `a5e09d6744f4a26e63a5f7e706be8a631459d28d` marks the primary marker as fired before the manual calibration flash. The scheduled projectile release remains exactly `[0.150]`.

### PUBLIC_VERIFIED
Final closure workflow `35489658278`: branch and public browser jobs both **55/55 PASS**. Public marker + Hub/Stage navigation PASS; 0 failed resources and 0 page/console errors.

Fixed Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

Proofed publication:
`cloudflare-live@cf15f612e6a700608564cadbded4302ba59b1af2`.

Human grip/pose/muzzle/release acceptance remains open.


## 2026-09-20 · CA2-02b human pitch correction

### HUMAN GATE
Georg accepted the existing fist/grip position but judged Aim/Fire too high in the Stage screenshot. The future universal inline 3D gizmo is explicitly not added to this slice.

### CANDIDATE
Keep the Studio grip base `[-14,77,0]`; apply one rotation-only visual correction of `-5°` pitch, effective `[-19,77,0]`, identically for FrizzleBob Driver Graft and GothGirl. Offsets, yaw/roll, scale, muzzle geometry and release timing remain unchanged.

### GATE
Measure Aim world pitch and Release-frame pitch in-browser. Aim should be near horizontal; the Shoot clip may lift upward as recoil. No Arena ballistics or locomotion tuning in this slice.


## 2026-09-20 · CA2-02b pitch repair pass 2

### PASS 1 RESULT
The `-5°` candidate was rejected by measurement: FrizzleBob Aim world pitch became `+12.471°`. This proved the mounted X-Euler sign was opposite to the visual assumption.

### PASS 2 CANDIDATE
Use a small `+1.5°` X-Euler delta from the Studio base, effective `[-12.5,77,0]`. Same value for FrizzleBob and GothGirl; no position/offset/yaw/roll/scale/muzzle/release changes.

### STOP RULE
This is the second and final repair pass for the same pitch gate. If it does not meet the near-horizontal Aim + upward Release criteria, freeze/export rather than continue tuning in this slice.
