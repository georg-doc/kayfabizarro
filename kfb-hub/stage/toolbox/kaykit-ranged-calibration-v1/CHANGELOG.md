# KayKit Ranged Calibration v1 · additive changelog

## 2026-09-20 · CA2-02 initial measured candidate

### SOURCE
Uses exact `Character_Gun.gltf`, exact Rig_Medium CombatRanged library, existing Driver Graft weapon owner and existing ToolBox muzzle/release measurement donors. Source gun is shown in isolation before actor integration.

### MEASUREMENT
FB Driver Graft and GothGirl resolve the same `handslotr` bind frame within measurement precision. Existing Georg grip calibration is retained unchanged. Muzzle local position/axis are identical.

### RELEASE
Single-shot `Ranged_1H_Shoot`: primary release `0.150 s`; later rotational peak `0.883 s` is retained as evidence but not promoted to another projectile. Recovery candidate `0.350 s`.

### TEST
After replacing a wall-clock FX assertion with deterministic release-frame seeking, run `35487908222` passed **52/52**, zero failed resources and zero page/console errors.

### STATUS
Branch browser verified. Public Cloudflare and human visual acceptance remain open.
