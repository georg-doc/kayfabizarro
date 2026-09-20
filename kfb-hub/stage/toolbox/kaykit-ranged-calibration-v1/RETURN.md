# CA2-02 · Return

Status: **PUBLIC_VERIFIED · HUMAN OPEN**

## Goal/result

Weapon / Grip / Muzzle / Release calibration for FrizzleBob Driver Graft and GothGirl, using the exact separate `Character_Gun.gltf` attachment and the real Rig_Medium CombatRanged clips.

Both actors share the same measured Rig_Medium `handslotr` socket/grip/muzzle profile within measurement precision. GothGirl therefore needs no actor-specific grip delta at this gate. Single-shot primary release is `0.150 s`; the later `0.883 s` rotational peak remains evidence only.

## Exact source state

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/ca2-02-ranged-calibration-2026-09-20`
- source PR: `#135` — Draft, no auto-merge
- final runtime revision: `a5e09d6744f4a26e63a5f7e706be8a631459d28d`
- proofed branch head: `431723aa69316136aeeb0d7411d28846fe0d41da`
- Hub/router source sync is included on the same branch.

## Final evidence

Workflow `35489658278`:
- branch job `106022296749`: **55/55 PASS**, 0 failed resources, 0 page/console errors
- branch artifact `10598448427` · `sha256:f1dc330364eaf77eb13b2b58634501f2be43582519dcbc125d0deb95acbfbda8`
- public job `106022296782`: marker PASS · Hub/Stage navigation PASS · **55/55 PASS**
- public artifact `10598651751` · `sha256:7f8140c90f84f2d7f528b27f431a0843ca5e408901057c027bef30f0bf8c7449`

Public Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

Proofed publication:
`cloudflare-live@cf15f612e6a700608564cadbded4302ba59b1af2`

## Delivered

- exact gun donor in isolation before integration;
- full 20-clip CombatRanged inventory;
- FB/GothGirl 1H Aim/Shoot/Reload comparison;
- measured grip, muzzle position and muzzle forward direction;
- deterministic Release Frame;
- one scheduled single-shot release per actor at `0.150 s`;
- measured common weapon profile in `WEAPON_PROFILES.json`;
- KFB Hub, Stage navigator, central router, ToolBox entry and additive changelog source-sync on PR #135.

## Retained owners

Arena Player still owns movement/root/ground. Arena Gunfight still owns target selection, projectile spawn, damage and productive release state. Rewards/runflow/audio remain unchanged. No Combat Arena runtime file is edited.

## Deferred

- additional locomotion/phase optimizations;
- 2H, Bow and Magic integration;
- continuous-fire consumer semantics;
- productive Arena Player/Gunfight integration.

## Next gate

Georg reviews only grip/pose, muzzle direction and the `0.150 s` Release Frame. After acceptance WSA may consume `WEAPON_PROFILES.json`; productive integration remains WSA-owned.
