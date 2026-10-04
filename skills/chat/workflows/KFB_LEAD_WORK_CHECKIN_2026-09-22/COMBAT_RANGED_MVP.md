# KFB Combat Arena · Ranged MVP consolidation · 2026-09-22

Status: **PREPARED WORK SLICE PLAN · RANGED FIRST · NO MELEE DEPENDENCY**

Owner:

`georg-doc/KFB-Combat-Arena`

Combat Arena remains the only combat gameplay owner.

This plan does not create another player controller, Gunfight, damage system, MobBrain, reward loop or World combat runtime.

---

# Product goal

Produce one genuinely playable, human-reviewable KFB Combat module in the existing Arena:

- current Arena stage/game loop;
- existing three-enemy/run/reward behavior retained;
- one proven K-Kit/Rig_Medium player path;
- one Rig_Legacy ranged player proof;
- existing Gunfight mechanics;
- optional reusable Spindle Sky environment after standalone extraction;
- direct KFB Cloudflare Stage;
- browser/freeplay evidence.

This becomes a candidate mini-game/instance module for the later Playable MVP.

Melee is not required for this first Combat MVP.

---

# Source truth

## CA2 implementation base · PR #5

Branch:

`chatgpt-web/combat-arena-integration-v2-2026-09-19`

Head checked:

`954f2db7484dc566e468e5ce89b0d95940d97537`

Current facts:

- Driver Graft visible player layer;
- Player.v2 = movement/ground owner;
- DriverCA2 = one player mixer;
- current graft muzzle → existing Gunfight;
- Skeleton Warrior + Skeleton Mage admitted as enemies;
- MobBrain = enemy lifecycle/movement/mixer owner;
- Gunfight = targeting/projectile/damage/release owner;
- Rewards/RunFlow retained.

Evidence:

- 68/68 PASS;
- portable build / re-home green;
- browser/human proof still pending.

## Existing Arena game loop

Preserve the current 5A/A1 round:

- three-enemy lifecycle;
- pickups;
- rewards;
- clear/post-clear state.

Do not reduce the MVP to a firing-range demo.

## Legacy readiness · PR #10

Branch:

`chatgpt-web/ca2-legacy-00-readiness-2026-09-22`

Head checked:

`663f0610eb960f322d67b078f1302d0c6178d1c2`

Evidence:

- 106/106 PASS.

Selected ranged source candidate:

- body: Rogue;
- head: rogue-default;
- weapon: common Crossbow;
- clip: `Shoot(2h)`;
- Rig_Legacy, 6 bones / 30 native clips.

Do not substitute a Rig_Medium clip.

Blocking human gate:

`KLR-EYE-VIS-01`.

Then required source proof:

1. Crossbow in isolation;
2. Rogue with accepted EyeRig;
3. two-hand fit;
4. measured muzzle/release transform.

## Rig_Medium ranged donor

Public baseline:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

Public baseline:

- 55/55 PASS.

Actors measured:

- FrizzleBob Driver Graft;
- GothGirl.

Preserved useful facts:

- real `Character_Gun.gltf`;
- Rig_Medium CombatRanged clips;
- common right-hand socket/profile;
- measured muzzle;
- primary single-shot release at 0.150 s.

Human caveat:

Aim pitch is not accepted as final.

Do not run a third blind Euler correction.

For MVP v0, the existing CA2 Driver/Gunfight path may be the K-Kit player proof.

GothGirl remains optional until its required visual weapon transform is accepted.

---

# Recommended bounded sequence

## C-MVP-A · exact CA2 Stage + browser baseline

**Work-suited cross-repo slice.**

Do not add features.

Goal:

publish the exact PR #5 CA2 candidate to the canonical KFB Stage surface and obtain real browser evidence.

Previous Web blocker:

binary transfer boundary for required WOFF2/VFX blobs.

Work/local/cloud-computer can resolve the packaging seam from actual repository bytes rather than replacing assets.

Required route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`

Required visible sequence:

1. Driver Graft spawns with weapon/eyes;
2. Idle → movement;
3. Shoot uses current muzzle and returns to locomotion;
4. hit reaction / defeat lifecycle remains coherent;
5. Skeleton Warrior cycle;
6. Skeleton Mage cycle;
7. rewards/run clear;
8. narrow viewport;
9. console/resources/performance recorded.

No Legacy integration in C-MVP-A.

No melee.

Done when:

the existing CA2 implementation has one direct, exact, publicly verified human test surface.

---

## C-MVP-B · Legacy Rogue ranged fit

Start only after:

- C-MVP-A gives a stable Arena browser baseline;
- `KLR-EYE-VIS-01` accepts/adjusts rogue-default.

This can begin as a bounded Web/ToolBox visual calibration slice before Work integration.

Proof:

1. exact common Crossbow isolated;
2. Rogue source/assembled actor isolated;
3. accepted eye profile;
4. `Shoot(2h)` visible;
5. Crossbow two-hand relation readable;
6. muzzle/release measured;
7. export one Combat-consumable actor/weapon profile.

No target/damage implementation here.

Those remain Gunfight-owned.

---

## C-MVP-C · Legacy Rogue → existing Gunfight

**Work integration slice.**

Consume the accepted C-MVP-B profile.

Do not implement a Legacy combat engine.

Map:

`Legacy Rogue presentation + native Shoot(2h) release`
→ existing Arena Gunfight projectile/target/damage
→ existing MobBrain/enemy lifecycle
→ existing Rewards/RunFlow.

Prefer selecting actor before a run rather than building a complex mid-run roster switch.

MVP actor set:

- FrizzleBob Driver Graft / Rig_Medium path;
- Legacy Rogue / Crossbow path.

This is enough to prove two rig families can use the same Arena ranged owner.

GothGirl can join later from the same Rig_Medium profile family once its pitch gate is solved.

---

# Spindle Sky

Parallel small Web module, not part of the core Combat integration until extracted.

Current brief:

`georg-doc/KFB-Combat-Arena:wsa/ca2-kaykit-prep-2026-09-20`
→ `_handover/CA2_KAYKIT_ACTORS_2026-09-20/prompts/SKY_01_SPINDLE_MODULE.md`

Target candidate:

`kfb.environment.spindle-sky/0.1-candidate`

Prove exact source donor first.

Then standalone module.

Only after standalone human gate may C-MVP consume a preset.

The ranged MVP must remain playable with Spindle Sky disabled.

This prevents scenery from blocking combat.

Potential later consumers:

- World surreal zone;
- Race sky tunnel / special region;
- Story spectacle.

---

# Melee after ranged MVP

Current melee contact core in Combat PR #7 already provides:

- active attack window;
- swept contact;
- AttackLedger.

Evidence head:

`f773dbeb0cfa09fa7e1bd72a4323130b2c0eff06`

98/98 PASS.

Legacy selected melee source:

- Knight;
- common Sword;
- `Attack(1h)`.

But it remains visually gated.

Do not fold this into the first Ranged MVP.

After ranged human acceptance, start:

`CA2-LEGACY-01M`

as a separate slice using the existing contact core.

---

# MVP acceptance

The first Combat Ranged MVP is accepted only when:

- exact KFB Stage is PUBLIC_VERIFIED;
- existing Arena game loop remains playable;
- no second Player/Gunfight/MobBrain/Rewards owner exists;
- Driver Graft ranged run works in-browser;
- Legacy Rogue ranged run works in-browser;
- both consume the same Arena damage/target/reward contract;
- actor/weapon attachments are visibly acceptable;
- console/resource failures are zero or explicitly explained;
- desktop + narrow viewport evidence exists;
- performance is recorded;
- Georg performs a freeplay/readability gate.

Spindle Sky may be an accepted environment preset but is not mandatory to prove Combat mechanics.

---

# Not in this MVP

- melee;
- full 17-head Legacy roster;
- all 24 Legacy weapons;
- Mage spell system;
- HeavyAttack/combos;
- Rig_Large / 2H;
- Black Knight shield repair;
- World portal/return;
- Tactical Map;
- new HUD;
- new damage model;
- new enemy AI;
- new audio architecture.

---

# Exactly one immediate Work gate

**C-MVP-A · exact PR #5 CA2 Stage packaging + browser baseline.**

No new combat feature work in that Work slice.
