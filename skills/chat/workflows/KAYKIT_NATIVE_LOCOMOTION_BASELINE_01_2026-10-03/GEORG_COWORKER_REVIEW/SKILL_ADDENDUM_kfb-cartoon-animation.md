# Skill addendum · kfb-cartoon-animation · 2026-10-03

Target: `skills/kfb-cartoon-animation/` (main, merged in PR #343).

The doctrine is good: ownership, the "missing stays missing" rule and the complexity ladder. It lacks the KFB source rules, and its KFB routing file is stale in a way that reproduces today's failure.

Three changes:
- **A.** Add `references/85-kfb-source-priority-reference-actor.md` (full text below).
- **B.** Add 4 lines to `SKILL.md`.
- **C.** Rewrite `references/kfb-integration-current-ssot.md`.

---

## A · new file `references/85-kfb-source-priority-reference-actor.md`

```markdown
# KFB Source Priority, Reference Actor and Creator Reference

## Source priority (Georg, binding)

1. KayKit Character Animations 1.1 (Rig_Medium / Rig_Large) are the first truth for every role they cover: locomotion, jump, dodge, stealth, combat melee, ranged / bow, simulation, tools.
2. KFB Motion Library / Mixamo are supplementary. They are allowed only:
   - for a role a native gate returned as GAP;
   - for transitions between native clips (start, stop, pivot, turn, jog);
   - additively, never replacing a KEEP_NATIVE clip.
3. A supplementary clip must match the native family in look (arm carriage, cadence, silhouette). Look parity is a review item, not a metric.
4. Any agent that finds itself ranking a supplementary source above a native one must stop and ask Georg. "Synthesis across many sources" is not a reason to re-rank.

## Reference actors

| Use | Actor |
|---|---|
| Neutral gait / motion fixture | `Mannequin_Medium` (pack: KayKit_Character_Animations_1.1/Mannequin Character). Two-tone halves make step order readable; it is the creator's tutorial character. |
| Product actor | FrizzleBob v5 (rigged), after the Mannequin pass. |
| Not as a fixture | ActionFigure, any prop-heavy or silhouette-hiding character. |

**Same-character rule:** walk mode and every travel mode are tested on the same character. A stand-in (e.g. the cube pad in Travel) is not enough to judge travel animation together with walk animation. Vehicles are the deliberate exception: the car drives, the character sits.

## Travel modes owned by this skill (KFB)

- ground gait (native-first ladder);
- air / jump;
- stealth (sneak / crouch / crawl);
- dodge;
- **card ride:** FrizzleBob or another resident standing on the flying KFB card (surf pose), as on the Travel Globe card backside. Base pose and balance are authored; banking / roll is layered on top. See `flightLabSet` in the motion catalogue.
- vehicle seat (exception above).

## KayKit 1.1 inventory facts (Rig_Medium)

| File | Contents |
|---|---|
| General | Idle_A/B, Hit_A/B, Death_A/B (+Pose), Spawn_Air/Ground, Interact, PickUp, Throw, Use_Item |
| MovementBasic | Walking_A/B/C, Running_A/B, Jump_Start/Idle/Land, Jump_Full_Short/Long |
| MovementAdvanced | Walking_Backwards, Running_Strafe_L/R, Sneaking, Crouching, Crawling, Dodge ×4, Running_HoldingBow/Rifle |
| CombatMelee | 1H / 2H / dual-wield / unarmed attacks, block |
| CombatRanged | 1H / 2H aim, reload, shoot; Bow draw / aim / release (+Up); Magic raise / shoot / cast / summon |
| Simulation | sit chair / floor, lie, push-ups, sit-ups, cheer, wave |
| Special | Skeleton variants, Transform |
| Tools | chop, dig, fish, hammer, lockpick, pickaxe, saw, holding, work |

- **Native gaps:** jog, turn in place, strafe walk, start / stop / pivot, (sprint).
- **Rig_Large** has far fewer locomotion clips. Check before assuming parity.

## Creator reference workflow

The KayKit creator's tutorials show how the pack's clips are chained on the Mannequin. They are the human acceptance reference.
- Use timestamped stills from the creator's videos (see BRIEF_VIDEO_REFERENCE_SCAN) beside our Blender frames of the same clip.
- A clip or chain can be KEEP only if it reads at least as clean as the creator's own use.
```

---

## B · `SKILL.md` inserts

- In "Start every task", after step 4:
  > `4b. KFB: read references/85-kfb-source-priority-reference-actor.md. Native KayKit first; a supplementary source above a native one = stop and ask.`
- In the Reference map:
  > `- references/85-kfb-source-priority-reference-actor.md — KFB source priority, reference actor, same-character rule, KayKit inventory, creator reference.`
- In Prime directives:
  > `- A priority set by the owner is never re-ranked by an agent. Conflicts are signalled, not resolved by guessing.`

---

## C · `references/kfb-integration-current-ssot.md` (rewrite)

The current file names Motion Library v7 / `kfb_ladder_v2` as "current proven runtime state". It also names a Jog / Run / Sprint A/B choice between Mixamo clips as the next gate. Both are wrong after Georg's 2026-10-03 review.

Replace those sections with:
- **Current motion gate:** KAYKIT-NATIVE-BLENDER-BASELINE-01 (REV): Mannequin, all native files, KEEP / HOLD / REJECT, GAP list.
- **ActionFigure freeplay** (PR #333 head `f1ce90d…`): ARCHIVED_FAILED_CANDIDATE. Technical pass, human TOTAL FAIL. Cause: supplementary source used as primary.
- **`kfb_ladder_v1` / `v2`** (Motion Library v7): supplementary candidate data. Usable only for roles the native gate returns as GAP. Not a runtime baseline.
- **Next gate after the native baseline:** KAYKIT-NATIVE-TRANSITIONS-01. Then a gap-fill gate for the GAP roles only.
- Keep the rule "GitHub state wins". Add: "Georg's stated priorities win over any routing text in this file."
