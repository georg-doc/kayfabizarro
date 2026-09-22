# C-MVP-A-R2 · minimum playable Combat loop

Status: **LOCAL REAL-BROWSER PASS · WARRIOR MVP PASS · MAGE HOLD · PUBLICATION PENDING**

## Corrected gate

This pass optimizes for the smallest playable Combat loop, not parity across every available actor:

`FrizzleBob Driver -> Skeleton Warrior -> aim -> shoot -> hit x3 -> kill -> reward -> run clear -> next-card respawn`

Skeleton Mage is retained in the verified source catalog but marked `C_MVP_MAGE_ADAPTER` and excluded from the current runtime pool. No Mage repair, Legacy actor, melee, Spindle or new Combat architecture is included.

## Root cause and bounded repair

The browser probe proved the chain reached target acquisition, `Idle_Gun`, a ready weapon and the real graft muzzle. It stopped at one exact gate:

- body facing: `1.0000`;
- weapon ready: `true`;
- muzzle present: `true`;
- measured barrel/target dot: `0.9788-0.9793`;
- release threshold: `0.985`.

The graft donor already reports a geometry-measured barrel axis. The previous consumer incorrectly treated `holder origin -> muzzle` as the barrel direction; transverse model offset therefore became false yaw. The repair:

1. consumes the donor's measured local barrel axis;
2. compensates the live graft's measured barrel yaw by turning the body, rather than weakening the release threshold;
3. keeps the existing release marker (`1/24 s`) and existing Gunfight/projectile/damage owners;
4. falls back from triangle ray picking to the same finite visible actor bounds already used by targeting and hit detection when an imported skinned mesh does not answer the triangle raycast.

No damage tuning, fake projectile, guessed muzzle, second player/mixer, or replacement combat owner was introduced.

## Automated evidence

- Full repository suite: **74 passed / 0 failed / 0 skipped**.
- New focused regressions cover measured barrel axis, transverse muzzle offset, yaw compensation, semantic body-box picking and Mage quarantine.
- Portable build: **218 files**.

## Real-browser evidence

Local exact package:

`http://127.0.0.1:4192/slices/combat-integration-v2/`

Observed through real pointer input and the existing runtime:

- `Idle_Gun -> Idle_Shoot -> release` passes;
- marker `0.0416667 s`, recorded release at `0.0533333 s`;
- real graft muzzle origin recorded;
- Warrior HP: `3 -> 2 -> 1 -> 0`;
- final counters: **5 shots / 3 hits / 1 kill / 1 reward die / 1 Pop**;
- Rewards: **1 skull / 3 bounces / 3 coins dropped**;
- visible `Card cleared` / `Floor 1 cleared`;
- `Next card` restores player HP to `100`, returns phase to `play`, and spawns exactly one fresh Warrior with HP `3`;
- application errors: `0`.

The first two diagnostic shots deliberately targeted the floor while isolating the release gate. The three subsequent actor clicks produced the complete hit/kill/clear chain.

## Publication

- Combat implementation branch: `f6ccdcbcca9fde9a234794c8583dbec9b685b4cf`, CI run `35766345655` PASS.
- Candidate/public package: update pending.
- Fixed URL `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`: not changed until the exact pushed revision passes repository checks and is opened at that URL.

## One next gate

**Publish the exact R2 package to the protected Combat Stage and perform Georg's short Combat freeplay.** Mage remains a separate non-critical bug item.
