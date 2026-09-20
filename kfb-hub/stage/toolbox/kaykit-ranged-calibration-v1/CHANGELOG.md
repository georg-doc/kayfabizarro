# KayKit Ranged Calibration v1 · additive changelog

## 2026-09-20 · CA2-02 measured candidate

### SOURCE
Uses exact `Character_Gun.gltf`, exact Rig_Medium CombatRanged library, existing Driver Graft weapon owner and current ToolBox muzzle/release measurement donors. Source gun is shown in isolation before actor integration.

### MEASUREMENT
FB Driver Graft and GothGirl resolve the same `handslotr` bind frame within measurement precision. Existing Georg grip calibration is retained unchanged. Muzzle local position/axis are identical.

### RELEASE
Single-shot `Ranged_1H_Shoot`: primary release `0.150 s`; later rotational peak `0.883 s` is retained as evidence but not promoted to another projectile. Recovery candidate `0.350 s`.

### REPAIR
The deterministic Release Frame initially double-counted the preview FX because the manual calibration flash and the normal preview tick saw the same primary marker. Runtime `a5e09d6744f4a26e63a5f7e706be8a631459d28d` records the marker as fired before the manual flash. Scheduled single-shot releases remain exactly `[0.150]`.

### PUBLIC_VERIFIED
Workflow `35489464770`: branch and public browser jobs both **55/55 PASS**. Public marker + Hub/Stage navigation PASS; 0 failed resources and 0 page/console errors.

Fixed Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

Proofed publication:
`cloudflare-live@cf15f612e6a700608564cadbded4302ba59b1af2`.

Human grip/pose/muzzle/release acceptance remains open.
