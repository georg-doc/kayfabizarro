# CA2-03 · Enemy Adapter Proof · Slice Brief

Status: **PREPARED · NO ARENA RUNTIME EDITS**  
Date: 2026-09-20  
Owner: **KFB Combat Arena / WSA consumer**  
Web slice owner: **ChatGPT Web · isolated adapter Stage only**

## Goal

Prove the next planned Combat CA2 web gate with real KayKit enemies before any Dungeon/Raid integration.

The existing Arena keeps its three enemy slots, HP, damage, death, rewards and respawn logic. This slice only proves source/model/rig/state→clip adapters and visual readability.

## Proof pair

### A · Skeleton Warrior · Medium melee

- model: `media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb`
- rig: `Rig_Medium`
- existing Resident Atlas evidence: exact axe + shield sources; `handslot.r` / `handslot.l`; shield push `0.18`
- existing adapter evidence: 23 bones; shared Medium libraries bind cleanly
- target role: ordinary melee mob
- first attack family: enumerate exact `Rig_Medium_CombatMelee` clips in-browser; do not guess runtime names

### B · Orc Brute · Large melee / brute

- model: `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`
- rig: **`Rig_Large`**
- existing evidence: Large is a distinct rig family, not scaled Medium; same bone names do not imply Medium-motion compatibility
- Large animation source: exact `Rig_Large` libraries only; enumerate available state clips in-browser
- target role: heavy/brute mob
- **no weapon alignment gate in CA2-03**; body/scale/ground/state mapping first

## Comparison candidate · Resident pool

### C · Avian Swordsman · Medium melee

- model: `media/3D_Assets/KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb`
- rig: `Rig_Medium`
- sword: `.../gltf/AvianSwordsman_Sword.gltf`
- existing evidence: `Melee_1H_Attack_Jump_Chop` binds/deforms correctly in the Resident Atlas
- role in this gate: **comparison/profile candidate**, not a third combat-runtime owner

## HOLD previews

Skeleton Rogue / Mage may appear as source cards or isolated previews, but:
- Rogue Ranged stays HOLD: current evidence says no complete crossbow load/cock chain is available across the checked libraries.
- No invented ranged fallback or fake muzzle chain.
- Mage ranged/magic is not part of the first melee adapter proof.

## State contract

For each proof actor create an explicit matrix for:

`idle → move → attack → hit → defeat`

Rules:
- exact clip names only after runtime enumeration;
- same-rig fallbacks only;
- no Root/Hips world-motion ownership;
- no HP/damage/reward implementation;
- no Arena `mobs.v2.js` edits in the web slice;
- one mixer per visible actor;
- scale/ground measured per rig family;
- face mode explicit; no double EyeRig.

## Done when

1. exact donor models are shown in isolation first;
2. Skeleton Warrior and Orc Brute each cycle through verified state clips without rig collapse;
3. Medium vs Large scale/ground is visibly sane;
4. Avian Swordsman can be compared as a third Resident candidate without becoming another runtime owner;
5. `ENEMY_PROFILES.json`, `ANIMATION_MAP.json`, `SOURCE.json`, browser evidence and Return exist;
6. fixed public Stage is linked from KFB Hub;
7. Georg human gate remains separate.

## Protected boundary

Do not edit Combat Arena `index.html`, `player.v2.js`, `gunfight.v2.js`, `mobs.v2.js`, damage, rewards, respawn or Dungeon logic.

## Deferred

- Skeleton Rogue ranged chain
- Large-rig weapon alignment
- Kenney alternate-blaster skin POC
- FB/GothGirl free-run Combat/Locomotion integration
- Dungeon/Raid runtime integration
- SKY-01 Spindle module

## Recommended following gates

After CA2-03 public/human review:
1. WSA consumes the two enemy profiles inside the existing three-slot mob logic.
2. WSA Gate 2/3 combines accepted player actor lifecycle + locomotion + Aim/Fire in freeplay.
3. Dungeon Raid can consume the accepted enemy adapter; it should not invent a parallel combat owner.
