# KFB Fluff Work Motion Pack 01 · Reuse Matrix

Status: **PART 1 REQUIRED BEFORE AUTHORING**  
Date: 2026-10-04

This matrix exists to prevent duplicate animation work.

Blender MCP must complete the **Evidence / Decision** columns before building new clips.

## Source actors

| Actor | Exact source | Rig evidence | Use |
|---|---|---|---|
| Robot One | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb` | Resident Atlas: **Rig_Medium**, 23 joints | Robot A / precision worker reference |
| Robot Two | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb` | Resident Atlas: **Rig_Medium**, 23 joints | Robot B / salvage worker reference |
| Skeleton Minion | `media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb` | current Skeleton source: **Rig_Medium** | Skeleton Fluff worker |
| Legacy Skeleton Minion | `KayKit Legacy/.../character_skeleton_minion.gltf` | **Rig_Legacy** | **DO NOT USE as the default Fluff worker** |
| Orc Raider | Motion Library preview actor | Rig_Medium | canonical Medium motion check |
| Orc Brute | Motion Library preview actor | Rig_Large | canonical Large motion check |

## Known source-backed prop

Robot habitat charging station:

`media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/assets/gltf/Robot_ChargingStation.gltf`

Use this exact donor where a charging-station reference is needed.

---

## Existing motion donors already proven in Registry

### Rig_Medium_General

`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb`

- Interact
- PickUp
- Throw

### Rig_Medium_Tools

`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_Tools.glb`

- Chop
- Chopping
- Dig
- Digging
- Hammer
- Hammering
- Holding_A
- Holding_B
- Holding_C
- Pickaxe
- Pickaxing
- Saw
- Sawing
- Work_A
- Work_B
- Work_C
- Working_A
- Working_B
- Working_C

### Rig_Medium_Simulation

Candidate:

- Cheering

### KFB Motion Library

`media/3D_Assets/Animations/KFB_Motion_Library/`

Current accepted two-rig motion family includes:

- dance;
- idle;
- climb;
- locomotion;
- music;
- action.

Use its existing Rig_Large library for two-rig comparison.

### Critical gap

`Rig_Large_Tools.glb` **does not exist**.

Do not load or cite it as an available source.

---

## Role mapping to complete in Blender

Decision vocabulary:

- **KEEP**
- **KEEP + FIT**
- **DERIVE / EDIT**
- **NEW CLIP REQUIRED**
- **NOT NEEDED**

| Semantic role | First donors to audition | Medium evidence | Large evidence | Actor evidence | Decision |
|---|---|---|---|---|---|
| roll_push | Holding_A/B/C; Work_A/B/C; existing Motion Library candidates | TODO | TODO | Robot1 / Robot2 / Skeleton | TODO |
| roll_push_heavy | Work/Working candidates; Large Motion Library body effort candidates | TODO | TODO | Medium + Large ref | TODO |
| steer_left | derive from roll_push if possible | TODO | TODO | Robot/Skeleton | TODO |
| steer_right | derive from roll_push if possible | TODO | TODO | Robot/Skeleton | TODO |
| place_small | Interact; PickUp; Holding | TODO | TODO | Robot/Skeleton | TODO |
| knead_press | Work_A/B/C; Working_A/B/C; Hammering without tool as motion donor only | TODO | TODO | Robot/Skeleton | TODO |
| pack_flatten | Work/Working; Hammering | TODO | TODO | Robot/Skeleton | TODO |
| pass_receive | Interact; Holding_A/B/C; Throw only if useful as pose source | TODO | TODO | paired preview | TODO |
| pull_chunk | Pickaxe/Pickaxing; Saw/Sawing; Interact | TODO | TODO | Robot/Skeleton | TODO |
| collect_debris | Interact; Work; PickUp only if head stays clear | TODO | TODO | Robot/Skeleton | TODO |
| patch_press | Work/Working; Hammering; Interact | TODO | TODO | Robot/Skeleton | TODO |
| work_to_dance | Work → accepted dance clip transition | TODO | TODO | Medium + Large | TODO |
| dance_to_work | accepted dance → Work transition | TODO | TODO | Medium + Large | TODO |
| celebrate_short | Cheering; accepted happy/dance accents | TODO | TODO | Robot/Skeleton | TODO |
| pickup_react_short | Interact / Cheering / tiny dance accent | TODO | TODO | player/NPC-safe | TODO |
| ball_bounce_reference | prop-only; no humanoid donor | n/a | n/a | High + Low Fluff | OPTIONAL NEW PROP REF |
| coop_large_push | derive from roll_push / work candidates before new authoring | TODO | TODO | 2–3 Rig_Medium + Large ball | TODO |
| foot_driven_roll | locomotion + ball contact reference; derive if possible | TODO | TODO | Robot/Skeleton | OPTIONAL |
| ball_balance | balance/idle/dance donors; reference-only contact | TODO | TODO | Medium + Large ref | OPTIONAL |
| ball_dance | accepted dance clips adapted to ball-top contact if viable | TODO | TODO | Medium + Large ref | OPTIONAL |
| ball_surf | balance/dance reference; runtime owns travel | TODO | TODO | Medium + Large ref | OPTIONAL |

---

## Rejection rules

Reject an existing clip for a role when any of these is true:

- head intersects terrain;
- foot slide is visually unacceptable;
- hand target is incompatible with intended Fluff radius;
- root motion conflicts with runtime ownership;
- clip semantic read is clearly wrong;
- retarget to Large breaks body/contact quality;
- clip requires a tool that cannot be cleanly removed/reinterpreted.

A rejected donor is still evidence; record why it failed.

---

## Life Tree pickup constraint

The Life Tree pickup is **not** a literal floor pickup animation.

Runtime behaviour:

`walk-over / proximity → collect → POP → object disappears → Fluff changes`

Therefore:

- `PickUp` is only an audition candidate;
- if it bends the actor toward the ground, mark it **NOT NEEDED for pickup**;
- prefer an upright reaction.

---

## Required Part 1 return

Before any new authored clip:

1. completed matrix;
2. side-by-side Medium/Large preview;
3. Robot One / Robot Two / current Skeleton Minion preview;
4. High-Fluff isolated look;
5. Low-Fluff isolated look;
6. explicit list of true remaining motion gaps.

Only the final gap list becomes Part 2 authoring scope.


---

## Fluff Mass Ladder assumptions for the audition

Use these as the first-pass visual/animation targets:

- **6 Small Fluff → 1 Medium Fluff**
- **3 Medium Fluff → 1 Large Fluff**
- therefore **18 Small → 1 Large**

Default handling:

- one Rig_Medium → one Medium ball;
- one Rig_Large → one Large ball;
- 2–3 Rig_Medium → one Large ball cooperatively.

These are first-pass construction ratios and must not be silently changed by Blender. If the measured actor/ball contact makes a ratio visually impossible, report the geometry/contact issue rather than changing the world rule.

For the resulting Medium/Large ball, preserve visible marbling/mixed-color memory from the source balls where useful.
