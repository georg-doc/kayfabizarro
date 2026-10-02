# KLR-KIT-01 · Legacy Actor Kit + Seeded Character/Monster Randomizer

**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Rigging  
**Status:** CURRENT NEXT IMPLEMENTATION SLICE  
**Branch:** `chatgpt-web/toolbox-legacy-rpg-rigging-2026-09-21`

## Goal

Turn the browser-proven KayKit Dungeon 1.0 Legacy assembly into one reusable modular appearance kit for KFB games.

The same recipe/randomizer must serve:

- Combat Arena enemies/monsters;
- KFB WhackMan player/ghost roles;
- later KFB games.

No consumer receives its own copy of the randomizer.

## Source base

Current Legacy technical evidence:

- 4 modular bodies;
- 17 heads;
- 24 tiered weapons;
- 10 gear/prop entries;
- Rig_Legacy = 6 bones / 30 native clips;
- KLR-SYNC-01 **41/41 PASS**;
- full Legacy browser/WebGL **44/44 PASS**.

## Shared ownership

ToolBox may own:

- source-backed body/head/gear/held-prop identity;
- exact source revisions;
- Legacy assembly;
- head replacement;
- modular actor recipe validation;
- caller-seeded random recipe selection;
- optional presentation attachment assembly;
- deterministic recipe serialization/key.

ToolBox must NOT own:

- HP / damage / armor values;
- team/faction;
- Combat hit/contact/damage/death/drop;
- Combat mob movement/spawn clearance/targeting;
- WhackMan maze movement;
- WhackMan GhostMode / chase/scatter/frightened AI;
- score/lives/pickups/power-ups;
- game camera;
- world transform;
- consumer mixer/game state.

## Candidate recipe

```json
{
  "schema": "kfb.legacy-actor-recipe/0.1-candidate",
  "rigFamily": "Rig_Legacy",
  "bodyId": "rogue",
  "headId": "mage-b",
  "headExtras": true,
  "held": {
    "right": "dagger-rare",
    "left": "shield-common"
  },
  "source": {
    "catalogSchema": "kfb.legacy-rpg-catalog/0.1-candidate",
    "partsRevision": "eb48f50489b9e4903ec1e3d2fb1837605ce7d792",
    "rigRevision": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0"
  }
}
```

This is appearance/assembly only.

A consumer can map the same visual recipe to a player, enemy, ghost, NPC or decorative actor without changing the shared recipe.

## Randomizer contract

Primary API accepts a caller-owned RNG.

```js
randomLegacyActorRecipe(catalog, {
  rng,
  bodies,
  heads,
  weaponFamilies,
  weaponTiers,
  includeProps,
  heldChance,
  headExtras
})
```

Rules:

1. no `Math.random()`;
2. same catalog + same RNG sequence + same filters → same recipe;
3. never return an id absent from the catalog;
4. filters narrow candidates; they never invent fallbacks outside source truth;
5. no silent duplicate held item unless explicitly allowed;
6. recipe records exact source revision;
7. RNG state remains consumer-owned.

A small `createSeededRng(seed)` helper is allowed for ToolBox authoring/tests. Games may use their existing seeded RNG instead.

## Combat Arena consumer boundary

Current active integration evidence is on:

- implementation Draft PR #5 · `chatgpt-web/combat-arena-integration-v2-2026-09-19`;
- CA2-04 melee Draft PR #7 stacked on PR #5.

Current Combat rules to preserve:

- MobBrain owns spawn/movement/enemy mixer;
- current combat runtime owns HP/damage/hits/death/drop;
- consumer RNG is already explicit/seeded;
- no hidden `Math.random`;
- existing monster rosters are not replaced.

Future Combat adapter should therefore be:

```text
Combat seeded RNG
→ Legacy random recipe
→ Legacy actor factory
→ Combat Mob/Fighter wrapper
→ existing Combat AI / stats / contact / damage / drops
```

Legacy recipe selection is additive to the existing roster, not a replacement for MonsterCuteCubes or modern KayKit roles.

## WhackMan consumer boundary

Current Dropbox source is concept/research input only:

`/CLAUDE/KFB WhackMan/KFB WhackMan - Perplexity.md`

No GitHub implementation owner is currently pinned.

Therefore KLR-KIT-01 does not create a WhackMan runtime.

Future WhackMan seam:

```text
WhackMan game seed
→ Legacy random recipe
→ Legacy actor factory
→ player/ghost presentation
→ WhackMan-owned Maze / PlayerMotor / Ghost AI / score / pickups
```

The role `player` or `ghost` is consumer state, not part of the Legacy appearance recipe.

## EyeRig boundary

Recipe uses `headId` as the stable face identity seam.

EyeRig v6 remains the eye runtime owner.

Per-head EyeProfile acceptance remains a separate visual gate. KLR-KIT-01 must not pretend all 17 heads are visually approved just because a recipe can select them.

## Done when

1. pure recipe validator exists;
2. caller-seeded randomizer exists;
3. deterministic unit suite passes;
4. existing Legacy Lab can apply a generated recipe and assemble it;
5. browser proof reconstructs at least three seeded recipes;
6. no gameplay/stat/AI field appears in the shared recipe;
7. Combat and WhackMan handoff boundaries are recorded.

No public Stage promotion is required to complete this core slice.
