# KFB MVP · Curtain Character Select / Cross-Rig QA · 2026-10-04

Status: **CURRENT MVP PLANNING CONTRACT · NO RUNTIME / STAGE / LIVE PROMOTION**
Owner: **KFB playable MVP integration**
Receiving runtime later: **WB2 world + current central Motion owner**
UI host later: **Theatre Curtain start sequence**

## Product decision

Add an optional 3D Character Select to the Curtain start flow.

Order:
1. physical Curtain covers world;
2. clay `BLÖDSINN!` loading plaque handles real critical-load progress;
3. when the shell is ready, the selected player Actor is shown in front of the Curtain;
4. FrizzleBob is preselected;
5. player may switch Actor before entering;
6. once the selected Actor + required first-run motion set are ready, clay `Enter` drops in;
7. Enter opens the Curtain and starts the Town scene with the selected Actor.

**PULL, DON'T GATE:**
Character selection is optional.
A default is already selected; the player is never forced through a creator wizard.

## Why this belongs in MVP

The selector doubles as real integrated QA for:
- Rig_Medium versus Rig_Large;
- native clip coverage;
- locomotion ladder compatibility;
- grounding/scale;
- silhouette/anatomy;
- attachments/capes;
- EyeRig/presentation differences;
- Ground → later Drive handoff.

This is more useful than a separate motion dashboard because the same Actor goes directly into the real world after selection.

## Current source truth

### FrizzleBob v5b

A current v5b figure exists:
`tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb`.

Current source evidence is split:
- ToolBox Production-06 records the figure at `23615cff`;
- Joyride J17 loads the same path from `93abbf22`.

Therefore:
**SOURCE_PIN_RECONCILE before runtime promotion.**

Current v5b / Ear-v5 work proves the figure is a real current source candidate.
The frozen Combat FB-v5b attempt is **not** a reason to reject the figure: that candidate stopped on Ranged-input evidence, not on actor-source identity.

Rule:
- FrizzleBob v5b may be used as an isolated selectable actor candidate.
- Do not inherit Combat runtime, weapon input or Combat movement.
- Do not call v5b the accepted Player runtime until source pin + Ground integration pass.

Desired default:
`player.frizzlebob-v5b`.

Safe technical fallback until that proof:
`player.mannequin-medium`.

ActionFigure remains an optional compatibility smoke only.

### Rig_Medium baseline

Exact current native baseline owner:
Motion Draft PR #344 / `KAYKIT-NATIVE-BLENDER-BASELINE-01`.

Primary reviewed fixture:
**Mannequin_Medium · Rig_Medium**.

Secondary actor:
FrizzleBob v5.

ActionFigure:
optional compatibility smoke only; it is not the baseline decision.

Primary animation source:
KayKit Character Animations 1.1.

Motion PR #344 native review is **COMPLETE**.
Decided Medium set:
Walking_B → Running_A → Running_B, with jog as a speed/phase blend.

### Existing Medium comparison donor

GothGirl / Rig_Medium already has real Motion-Lab evidence and is useful as a second anatomy/silhouette reference.

It is optional for the first public selector; useful for Stage/QA.

### Rig_Large baseline

Black Knight is a proven Rig_Large source and already appeared in:
- Resident Atlas;
- KayKit Motion Lab;
- Joyride J14 actor selector.

Exact known source:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb`.

Existing Large animation source:
- `Rig_Large_General.glb`
- `Rig_Large_MovementBasic.glb`

Existing evidence:
- Motion Lab already proved Medium + Large in one tool;
- Large Walk/Run handoff was measured around ~1.811 m/s with near-native playback rates in that technical candidate;
- Running_A automatic slip remained visually suspect / review-worthy;
- Joyride J14 proved switching ActionFigure Medium ↔ Black Knight Large without reload.

Important J14 finding:
Large did **not** have parity with the Medium action set.
Confirmed usable set there included:
Idle / Walk / Run / Dodge / Hit / Death / Flexing.

Known gaps there:
Jump / backward / side movement were unmapped;
Sprint used a Running_A rate variant and remained unproven.

Therefore Large must never inherit the Medium ladder blindly.

## Initial selector roster

### Public / MVP-facing candidates

1. **FrizzleBob**
   - desired default
   - v5b presentation candidate
   - Medium-host/graft lineage
   - source pin must be reconciled before runtime promotion

2. **Mannequin_Medium**
   - Rig_Medium
   - native-motion reference / safe baseline
   - primary Motion #344 review/runtime fixture

3. **Black Knight**
   - Rig_Large
   - Large compatibility probe
   - exposes anatomy/scale/attachment/cape issues early

### Optional Stage/QA candidates

4. **GothGirl**
   - Rig_Medium
   - second Medium anatomy/face/attachment reference

5. **ActionFigure**
   - Rig_Medium
   - compatibility smoke only
   - must not reopen baseline clip decisions

Do not expose the whole Resident Atlas roster in the start screen for MVP.
The Asset Librarian can later feed a larger source-clean player roster through the same contract.

## Player Actor contract

A start-screen choice creates one stable Player Actor profile:

```
playerActorProfile = {
  id,
  sourceRef,
  rigFamily,
  appearanceProfileRef?,
  eyeProfileRef?,
  motionCapabilityProfileRef,
  presentationOverrides,
  scalePolicy,
  sourceStatus
}
```

The world stores:
`player.actorProfileId`.

It does not duplicate the entire Actor recipe into the save.

Player Actor identity and Resident identity remain separate.
Selecting Black Knight as Player does not turn the Town Resident Black Knight into the Player object or delete the Resident identity.

## Motion capability profile

Do not model the locomotion ladder as one universal clip table.

Use semantic movement intents:

- IDLE
- WALK
- RUN
- SPRINT
- JUMP_START
- JUMP_LOOP
- JUMP_LAND
- TURN / PIVOT
- BACKWARD
- STRAFE
- optional HIT / DODGE / EMOTE

Each rig/profile resolves intents to:
- NATIVE clip;
- APPROVED rate/variant;
- PROCEDURAL owner-approved transition;
- HOLD / UNSUPPORTED.

Example:

```
Rig_Medium:
  WALK → Walking_B
  RUN → Running_A
  SPRINT → Running_B
  JOG → speed/phase blend WALK↔RUN
  JUMP_* → native KEEP family, integration follows after the first Ground seam

Rig_Large:
  WALK → native
  RUN → native
  SPRINT → HOLD until visually proven
  JUMP_* → HOLD if no matching source clip
  BACKWARD / STRAFE → HOLD unless exact Large source is proven
```

The central Ground controller remains the only movement writer.
The capability profile selects presentation clips; it does not create rig-specific movement physics.

## Cross-rig QA generated by normal play

For Stage/debug evidence, record:

- selected actorProfileId;
- rig family;
- resolved clip per semantic intent;
- unsupported/fallback intents;
- actor scale / feet-ground offset;
- visible foot slip sample;
- current movement speed band;
- attachment/presentation overrides;
- current FPS/frame-time;
- any animation binding warning.

This makes a normal Town→Track run useful evidence for both rig classes.

## Cape / attachment policy

Do not destructively delete capes or accessories from source models.

Use reversible Player presentation overrides:

- `KEEP`
- `HIDE_PLAYER_ONLY`
- `OWNER_DEFINED`
- later `DYNAMIC_SECONDARY_MOTION`

If a cape is rigid and visibly bad during locomotion:
1. prove it in the real Actor;
2. hide it only in the Player profile if that is the best MVP result;
3. preserve the original source asset;
4. record the override;
5. later secondary-motion work may restore it.

Same rule for oversized props, shields, backpacks, hair/attachments.

## Start-screen interaction

The selector should stay visually light.

Recommended:
- actual 3D Actor in front of Curtain;
- left/right arrows or horizontal drag;
- name + small rig badge;
- optional compact `More`/QA details only on Stage;
- no stat sheet;
- no RPG class selection;
- no body sliders in MVP.

The selected Actor may play:
- Idle by default;
- optional short Walk/Run preview toggle in Stage/QA.

Do not run a separate Character-Creator app inside the Curtain.

## Loading strategy

Do not preload the whole roster.

Critical path:
1. world shell / Curtain;
2. default Actor;
3. minimal motion set required to enter;
4. Enter becomes available.

Other Actors:
lazy-load when focused/selected.

If a selected Actor fails to load:
- keep Curtain closed;
- show concise source/load failure;
- allow immediate return to the last-known-good Actor;
- do not crash the world.

## Save / Lean Memory

Persist:
- `player.actorProfileId`;
- source/profile version used for the save;
- presentation overrides if player-specific.

Do not treat Actor choice as NPC social memory.

On import:
- resolve the same Actor profile where compatible;
- if source unavailable/incompatible, report migration and choose the named safe fallback;
- never silently switch appearance.

## Golden Journey update

The Curtain Beat becomes:

`BLÖDSINN! loading plaque → optional Actor Select → selected Actor ready → Enter plaque → Curtain opens → Town / Clown`.

The acceptance fixture should test at least:
- ActionFigure / Rig_Medium; and
- Black Knight / Rig_Large

through a bounded locomotion smoke once Motion #344 supplies the accepted Medium baseline.

FrizzleBob remains the desired product default once its source pin and Ground adapter are green.

## What this does NOT authorize yet

- no Player integration before Motion #344's native Blender gate;
- no runtime edit to WB2 PR #348 in this planning slice;
- no promotion of Combat FB-v5b runtime;
- no assumption that Large supports the full Medium ladder;
- no mass Resident roster as playable Avatars;
- no Character Creator;
- no destructive cape/mesh edits.

## Next technical dependency

The native Medium baseline is complete.

Exactly one current hard dependency is now:
**KFB-LOCO-WB2-PLAYER-01**.

After the Medium Player seam is real in WB2:
1. integrate FrizzleBob/Mannequin selector through the shared Player Actor profile;
2. map/probe Rig_Large against the same semantic intents;
3. integrate the selector with the Curtain without creating a second movement owner.
