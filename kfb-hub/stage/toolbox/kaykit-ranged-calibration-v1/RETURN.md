# CA2-02 · Return

Status: **PUBLIC_VERIFIED · HUMAN OPEN**

## Goal/result

Weapon / Grip / Muzzle / Release calibration for FrizzleBob Driver Graft and GothGirl, using the exact separate `Character_Gun.gltf` attachment and the real Rig_Medium CombatRanged clips.

Result: both actors share the measured Rig_Medium socket/grip/muzzle profile; GothGirl currently needs no actor-specific grip delta. Single-shot primary release is `0.150 s`.

## Source

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/ca2-02-ranged-calibration-2026-09-20`
- first implementation: `4fb8104761e0393c4698206a79b4cc0d0ced6378`
- deterministic release implementation: `016ea96b5761b7fd66f34df77f0874acb15ea716`
- current branch evidence run: `35487908222` / `106017552194`
- tests: **52/52 PASS**, 0 failed resources, 0 page/console errors
- evidence artifact: `10598476584`

## Delivered

- source-first gun isolation;
- FB/GothGirl side-by-side 1H Aim/Shoot/Reload calibration;
- full 20-clip CombatRanged inventory visible;
- deterministic release-frame control;
- common Rig_Medium grip/muzzle profile plus actor records;
- source report, test report and additive changelog.

## Retained owners

Arena Player still owns movement/root/ground. Arena Gunfight still owns target selection, projectile spawn, damage and productive release state. Rewards/runflow/audio remain unchanged. No Arena runtime file is edited.

## Deferred

- additional locomotion/phase optimizations;
- 2H, Bow and Magic integration;
- continuous-fire consumer semantics;
- Arena Player/Gunfight integration.

## Next gate

Publish the exact candidate at `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`, verify the public revision, then Georg reviews only grip/pose, muzzle direction and the 0.150 s release frame.
