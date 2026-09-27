# COMBAT-FREEPLAY-C0 · player-facing Combat MVP

Status: READY AFTER WORLD C0 HUMAN GATE  
Executor: Work · Sol High  
Target route: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/freeplay-c0/`

## Goal

Turn the existing Combat evidence into a playable run rather than another calibration screen.

Minimum loop:

**FrizzleBob Driver → Skeleton Warrior → Aim → Shoot → Hit → Kill → Reward → Run Clear → Respawn**

## Current source map

Re-read exact current heads before work:

- Combat PR #5: CA2 ranged/Driver/KayKit base;
- Combat PR #7: sword/melee technical candidate;
- Combat PR #10: Legacy readiness only;
- central KFB Combat handoff and current public Combat Stage.

Do not assume the PR-body heads are still current. Write exact locks to `SOURCE.json`.

## C0 scope

- use the proven FrizzleBob Driver;
- use one proven Skeleton Warrior;
- preserve Player, DriverCA2, Gunfight, MobBrain and Rewards/RunFlow ownership;
- remove or hide pre-game calibration/test chrome from the player path;
- debug and source information behind one compact docs icon;
- desktop and narrow viewport;
- audio/VFX already belonging to the Combat host remain active;
- fixed public Stage and browser proof.

Skeleton Mage and any single actor/attachment failure are quarantinable. They do not block C0.

## Character expansion

Character selection may expose only actors already proven in the same runtime.

Order:

1. FrizzleBob Driver;
2. one proven KayKit Medium alternative;
3. GothGirl when her exact profile/runtime seam is proven;
4. Rogue Legacy after the Legacy EyeRig human gate;
5. Knight Legacy with melee only after weapon/attack fit passes.

No disabled character is disguised as available.

## Melee

Melee is C1, not a blocker for ranged C0.

- reuse PR #7 active-window, swept contact and AttackLedger;
- start with the proven sword candidate;
- keep the axe source/orientation problem on HOLD;
- one actor, one weapon, one real animation, one target;
- then add RPG weapons one at a time.

## Acceptance

- direct Stage opens into playable freeplay;
- the complete ranged loop succeeds;
- respawn does not duplicate mixer, face, weapon or audio;
- debug UI does not block the scene;
- one optional proven actor can be selected only if already ready;
- no Mage/Legacy/melee completeness requirement;
- Return/changelog/Hub metadata updated.

## Stop rule

If projectile release remains broken, make one bounded root-cause pass through input → target → ready → clip → marker → muzzle → spawn. If the cause is not small and clear, preserve recovery and HOLD rather than spending another large Work slice.
