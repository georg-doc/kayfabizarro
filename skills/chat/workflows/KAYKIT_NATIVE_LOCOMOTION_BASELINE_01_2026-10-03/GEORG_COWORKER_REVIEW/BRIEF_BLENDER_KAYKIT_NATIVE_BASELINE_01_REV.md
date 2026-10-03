# BRIEF · KAYKIT-NATIVE-BLENDER-BASELINE-01 · REV (Georg, 2026-10-03)

Replaces `BRIEF_BLENDER_KAYKIT_NATIVE_BASELINE_01.md` in PR #344. The gate ID and the scope (no Mixamo, no controller, no world) stay. Changes from the PR #344 version: actor, inventory, gap honesty and return format.

Executor: Coworker / Blender MCP.

## 1. Source priority (non-negotiable)

1. KayKit Character Animations 1.1 are the first truth for every role they cover.
2. Mixamo / KFB Motion Library come later. They are additive only, and only for a role this gate returns as GAP.
3. Nothing in this gate re-ranks this order. A conflict is a stop-and-ask, not a judgement call.

## 2. Reference actor

**Primary: `Mannequin_Medium`** (part of the animation pack itself)
- Path: `media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb`
- Blob: `c15d93a623acde4c08862290f4465bb994506fd8`
- Why:
  - It is the character the pack and the creator's tutorials are built on.
  - The two-tone body halves make step order, arm swing and contact readable.

**Secondary (only after the Mannequin pass):** the rigged FrizzleBob v5. It is the character that must later carry all travel modes.

**Not used:** the ActionFigure. Its silhouette hides the gait facts this gate is about.

**Large rig:** `Mannequin_Large` (blob `c332cd774562dc053aa93c450fe0eb618a73c213`). Inventory only in this pass.

## 3. Source isolation (Gate A)

Load the Mannequin alone, in T-Pose and in Idle_A. Record:
- object and armature names;
- scale and bone count;
- head height.

Then attach actions. A loaded file is not proof of the right actor.

## 4. Full native inventory (Gate B)

List every clip in **all 8 Rig_Medium files**, not only 3:
- General
- MovementBasic
- MovementAdvanced
- CombatMelee
- CombatRanged
- Simulation
- Special
- Tools

Mark each clip with its role:

| Role | Clips |
|---|---|
| Locomotion | Walking_A/B/C, Running_A/B, Walking_Backwards, Running_Strafe_Left/Right, Sneaking, Crouching, Crawling, Running_HoldingBow, Running_HoldingRifle |
| Jump | Jump_Start, Jump_Idle, Jump_Land, Jump_Full_Short, Jump_Full_Long |
| Evade | Dodge_Forward/Backward/Left/Right |
| Idle | Idle_A, Idle_B |
| Combat, ranged (bow!), simulation, tools, special | Inventory only in this gate |

Repeat the listing for the 6 Rig_Large files. Rig_Large is known to be much thinner. Say so plainly.

## 5. Review set (Gate C, native rate 1.0, at least 2 cycles)

- **Idle:** Idle_A, Idle_B.
- **Walk:** Walking_A, B and C (three styles or three speeds, to be judged), plus Walking_Backwards.
- **Run:** Running_A, Running_B. Do not call Running_B "sprint" unless it reads as one.
- **Side:** Running_Strafe_Left/Right.
- **Stealth:** Sneaking, Crouching, Crawling.
- **Carry-run:** Running_HoldingBow, Running_HoldingRifle. These are needed later for the bow work.
- **Jump:**
  - Jump_Start → Jump_Idle → Jump_Land as one sequence;
  - Jump_Full_Short and Jump_Full_Long on their own.
- **Dodge:** all four directions.

## 6. Known native gaps (return them as GAP; do not fake them)

| Gap | Note |
|---|---|
| jog | nothing between Walking_B and Running_A |
| turn in place 90/180 | none |
| strafe walk | only the strafe run exists |
| start, stop, pivot | none |
| sprint | unless Running_B is accepted as one |

These gaps are the only places where Mixamo may enter later, in a separate gate.

## 7. What to look at

For each clip, at native rate, front / side / 3/4 cameras on a grid:
- feet: contact, step length, sliding while planted;
- arms: distance from the torso, no collapse into the body;
- loop seam;
- timing stutter;
- self-intersection;
- for the jump: pose continuity between the three clips.

## 8. Return (pictures first)

1. One contact sheet per family, on the Mannequin, with one consistent scale.
2. A KEEP / HOLD / REJECT table in plain words, one line per clip.
3. A recommendation: which native clips form one coherent family, and which roles are GAP.
4. A side-by-side with the creator's reference stills, when `BRIEF_VIDEO_REFERENCE_SCAN_01` has delivered them.
5. Appendix only: the measurement JSON (contacts, cadence, natural speed, loop diff). Earlier J14 / KCL values go in comparison columns, never averaged.

Large Blender files stay in Dropbox. GitHub receives the return, the JSON and the sheets.

## Stop rules

- A needed original file is missing: stop and report the exact path.
- Mannequin and clip do not bind: stop.
- Two failed passes on the same check: stop and hand back one smaller gate.
