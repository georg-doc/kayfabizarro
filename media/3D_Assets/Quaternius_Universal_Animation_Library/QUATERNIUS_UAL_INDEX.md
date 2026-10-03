# Quaternius Universal Animation Library 1 + 2 (Standard): index

Source: quaternius.itch.io/universal-animation-library and -library-2. Viewer: quaternius.com/animviewer.html
Licence: **CC0 1.0** (License.txt in each folder). Added 2026-10-03 by Coworker for Georg.

## Role in KFB (binding source order)

1. **KayKit Character Animations 1.1 is the first truth** for all animation.
2. UAL is **additive only**, for proven KayKit gaps. It ranks before Mixamo/KFB Motion Library single clips because it is one consistent rig and style.

## Rig: read before using

- One humanoid rig for UAL1, UAL2 and the female mannequin: 65 joints (`root, pelvis, spine_01-03, neck_01, Head`, clavicle/upperarm/lowerarm/hand, **full fingers**, thigh/calf/foot/ball). Mannequin is 1.83 m tall, realistic proportions.
- **Not the KayKit rig.** KayKit Rig_Medium has 21 bones and chibi proportions. Every UAL clip must be **retargeted** and then checked for foot slip and arm clearance before use. Untested retargets are not allowed into the library.
- Each library has two files: `_RM` = root motion baked in; the other has root motion disabled (in place).

## What UAL fills from the KayKit gap list (KAYKIT_NATIVE_BASELINE_01)

| KayKit gap | UAL candidate | Status |
|---|---|---|
| jog | UAL1 `Jog_Fwd_Loop` (0.93 s) | candidate, retarget test needed |
| sprint (if Running_B rejected) | UAL1 `Sprint_Loop` (0.67 s) | candidate |
| turn in place | — | **not in Standard** |
| strafe walk | — | **not in Standard** |
| start / stop / pivot | — | **not in Standard** |

## Other useful clips (later strands, not locomotion)

- Cars / joyride: `Driving_Loop`
- Travel / traversal: `Roll`, `Slide_Start/Loop/Exit`, `ClimbUp_1m`, `Swim_Fwd_Loop`, `Swim_Idle_Loop`, `NinjaJump_Start/Idle/Land`
- Residents / NPC: `Idle_Talking_Loop`, `Idle_TalkingPhone_Loop`, `Idle_FoldArms_Loop`, `Yes`, `Idle_No_Loop`, `Sitting_Enter/Idle/Talking/Exit`, `LayToIdle`, `Dance_Loop`, `Interact`, `PickUp_Table`, `Chest_Open`, `Consume`, `Push_Loop`, `Walk_Carry_Loop`, `Walk_Formal_Loop`
- Throw (Brickfish): `OverhandThrow`
- Cozy work: `Farm_Harvest`, `Farm_PlantSeed`, `Farm_Watering`, `TreeChopping_Loop`, `Fixing_Kneeling`
- Brawl: `Punch_Jab`, `Punch_Cross`, `Melee_Hook(+_Rec)`, `Hit_Chest`, `Hit_Head`, `Hit_Knockback`, `Death01`
- Other: Sword set, Shield set, Pistol set, Spell set, Zombie set, Lantern/Torch/Rail idles

## Clip list with durations (s)

**UAL1 (43):** A_TPose 2.5, Crouch_Fwd_Loop 2.0, Crouch_Idle_Loop 2.93, Dance_Loop 1.0, Death01 2.4, Driving_Loop 1.67, Fixing_Kneeling 5.2, Hit_Chest 0.33, Hit_Head 0.43, Idle_Loop 2.5, Idle_Talking_Loop 2.93, Idle_Torch_Loop 1.27, Interact 2.0, Jog_Fwd_Loop 0.93, Jump_Land 1.27, Jump_Loop 2.5, Jump_Start 1.33, PickUp_Table 0.83, Pistol_Aim_Down/Neutral/Up 0.17, Pistol_Idle_Loop 1.67, Pistol_Reload 1.67, Pistol_Shoot 0.63, Punch_Cross 1.0, Punch_Jab 0.87, Push_Loop 2.67, Roll 1.47, Sitting_Enter 1.3, Sitting_Exit 1.03, Sitting_Idle_Loop 1.67, Sitting_Talking_Loop 2.93, Spell_Simple_Enter 0.53, Spell_Simple_Exit 0.43, Spell_Simple_Idle_Loop 2.1, Spell_Simple_Shoot 0.5, Sprint_Loop 0.67, Swim_Fwd_Loop 1.33, Swim_Idle_Loop 3.33, Sword_Attack 1.53, Sword_Idle 1.67, Walk_Formal_Loop 1.33, Walk_Loop 1.33

**UAL2 (43):** A_TPose 2.5, Chest_Open 1.37, ClimbUp_1m 0.67, Consume 1.33, Farm_Harvest 2.5, Farm_PlantSeed 2.77, Farm_Watering 3.8, Hit_Knockback 0.83, Idle_FoldArms_Loop 2.5, Idle_Lantern_Loop 2.5, Idle_No_Loop 2.5, Idle_Rail_Call 2.5, Idle_Rail_Loop 2.5, Idle_Shield_Break 1.07, Idle_Shield_Loop 2.5, Idle_TalkingPhone_Loop 2.93, LayToIdle 1.53, Melee_Hook 0.47, Melee_Hook_Rec 0.6, NinjaJump_Idle_Loop 2.0, NinjaJump_Land 1.27, NinjaJump_Start 0.97, OverhandThrow 1.33, Shield_Dash 1.1, Shield_OneShot 0.83, Slide_Exit 0.5, Slide_Loop 2.0, Slide_Start 0.83, Sword_Block 1.23, Sword_Dash 1.57, Sword_Heavy_Combo 4.33, Sword_Regular_A 0.43, Sword_Regular_A_Rec 0.97, Sword_Regular_B 0.53, Sword_Regular_B_Rec 1.03, Sword_Regular_C 2.0, Sword_Regular_Combo 3.0, TreeChopping_Loop 0.97, Walk_Carry_Loop 2.0, Yes 2.5, Zombie_Idle_Loop 1.33, Zombie_Scratch 1.8, Zombie_Walk_Fwd_Loop 1.33

## What is in this folder, and what is not

- In the folder: the GLB files (`*_Standard.glb`, `*_Standard_RM.glb`), License and README for each library, and the Female Mannequin (`.glb`, `.fbx`, `.blend`, README; it has no animations and shares the rig).
- Not in the folder: the Unity FBX copies of the libraries. They are about 24 MB each, duplicate the GLBs, and are at the web-upload limit. The setup screenshots and the original zips are also left out. All of these stay in Dropbox `BLENDER MCP/_inbox/`.
