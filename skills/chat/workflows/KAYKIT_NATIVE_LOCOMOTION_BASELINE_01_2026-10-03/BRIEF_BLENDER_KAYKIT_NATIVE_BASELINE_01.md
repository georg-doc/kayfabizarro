# BRIEF · KAYKIT-NATIVE-BLENDER-BASELINE-01

## Executor

Coworker / Blender MCP

## Outcome

Create one isolated Blender locomotion-quality review for the real KFB ActionFigure using **only original KayKit Character Animations 1.1 Rig_Medium clips**.

This is not a game controller task.
This is not a Mixamo task.
This is not a transition-authoring task yet.

## Non-negotiable source priority

PRIMARY:
KayKit Character Animations 1.1 · Rig_Medium.

SUPPLEMENTARY LATER:
KFB Motion Library / Mixamo-derived clips, but only for a role that remains genuinely missing after this native baseline gate.

Forbidden in this gate:
- Mixamo clips;
- Motion Library clips;
- retargeted foreign locomotion;
- browser runtime;
- consumer movement controller;
- procedural world;
- Travel Globe;
- new state graph;
- foot IK used to hide a bad source clip;
- playback retiming used to make a bad source clip appear acceptable.

## Source object isolation first

Before integrating any animation review:
1. load the exact ActionFigure source;
2. show it alone in Blender in bind/idle context;
3. confirm the actual source object / armature used;
4. record the object/armature names and scale;
5. only then attach native KayKit Rig_Medium actions.

A loaded URL or successful import is not proof that the correct source actor was used.

## Exact sources

ActionFigure:
`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb`
blob `4785276defdb929cb397954eb74b76aecb84486b`.

Animations @ `b97b5ac55df2724fae623992433685583eece51e`:
- General:
  `Rig_Medium_General.glb` · blob `5d16cb6815fc8371705147188813f851c10ba26a`
- MovementBasic:
  `Rig_Medium_MovementBasic.glb` · blob `98e965e886ec539e80f8984a77a29b0c1c02e5e5`
- MovementAdvanced:
  `Rig_Medium_MovementAdvanced.glb` · blob `f3ea309627f3ad76b92b85877ebc46f945cd4f1d`

Canonical mapping donor:
`tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
blob `3db9fbd482e6a527c417e79af826138ff28efa33`.

J14 native ActionFigure measurement donor:
`.../KFB_JOYRIDE_J14.../evidence/j14-locomotion-profile.ActionFigure.json`
blob `f88522de6a6b087d9ff4d609e8ad0238072a848c`.

## First-pass candidate set

Known exact source clips:
- Idle_A
- Walking_A
- Walking_B
- Walking_C
- Running_A
- Running_B
- Walking_Backwards
- Running_Strafe_Left
- Running_Strafe_Right
- Jump_Start
- Jump_Idle
- Jump_Land

Do not invent a Jog clip.
If KayKit has no native Jog in the inspected source files, record **JOG = GAP**.

Do not call Running_B “Sprint” merely because it is faster.
Report it as Running_B until the visual/mechanical role is accepted.

## Scene

Create:
`KFB_KAYKIT_NATIVE_LOCOMOTION_BASELINE_01`

Neutral setup:
- matte grid ground;
- real ActionFigure;
- no scenery;
- no decorative UI;
- one consistent camera scale;
- side, front and 3/4 review cameras.

Review actions at native playback rate 1.0.

For cyclic gaits, show at least two complete cycles.

## Per-clip measurements

For each candidate record:
- exact clip name and source GLB;
- duration / frames / FPS;
- loop seam pose difference;
- left/right contact intervals;
- cadence;
- foot travel while planted;
- inferred in-place travel speed;
- stride / step length;
- hip vertical range;
- arm-to-torso minimum clearance if measurable;
- obvious self-intersections;
- visual pose notes.

Keep J14 and KCL measurements as comparison columns, not as automatic truth.

## Acceptance statuses

Each native clip gets exactly one:
- KEEP_NATIVE
- HOLD_NATIVE
- REJECT_NATIVE

A clip cannot be KEEP merely because:
- it loads;
- the rig binds;
- the automated slip number is small.

KEEP requires:
- pose reads correctly on ActionFigure;
- arms/hands do not visibly collapse into torso;
- loop itself is smooth;
- feet/contact look plausible;
- no obvious timing stutter at native rate;
- no gross self-intersection.

## Jump

For this gate, review:
`Jump_Start → Jump_Idle → Jump_Land`
as **animation clips only**.

Do not invent a parabola.
Do not combine with gameplay jump physics.
Do not tune world trajectory.

Record:
- takeoff frame;
- airborne pose continuity;
- landing contact;
- pose discontinuity between the three clips.

## Deliverables

1. Blender scene/review file.
2. `KAYKIT_NATIVE_BASELINE_01.json`
3. `KAYKIT_NATIVE_BASELINE_01_RETURN.md`
4. contact/measurement table.
5. one montage/contact sheet or review render showing every candidate.
6. source-isolation image/scene proof.
7. exact KEEP/HOLD/REJECT table.

Keep large Blender/review binaries in Dropbox if needed; GitHub receives the small machine-readable return/evidence.

## Stop conditions

Do not proceed to transition blending in the same pass.

Do not add Mixamo in the same pass.

Do not build a browser prototype.

Return the native baseline first.

## Next gate after PASS

Only if this baseline produces a credible native family:
**KAYKIT-NATIVE-TRANSITIONS-01**
for walk/run phase alignment, transition poses, start/stop and jump sequencing.

Mixamo gap-fill is later and only for explicitly missing roles.
