# LOCOMOTION-LADDER-01 · RETURN

Lane: Blender MCP (cowork) · Date: 2026-10-03 · Brief: `BRIEF_BLENDER_LOCOMOTION_LADDER_01.md` (branch `coworker/locomotion-ladder-01-brief-2026-10-03`)
Status: **candidate data, nothing merged, nothing on Stage or Live.**

## For Georg (plain language)

- **Why KayKit walk → run slides:** the KayKit set has no jog. Walking_B (≈1.0 m/s) jumps straight to Running_A (≈3.3 m/s). No blend can hide a 3× gap.
- **The fix is already in our library:** the Mixamo clips on the KayKit rigs give a clean forward ladder **walk → jog → easy run → run** with at most ±21 % speed stretch between neighbours (target ≤ ±25 %).
- **What is still missing:** a walk start, a sprint, a backward jog and a strafe jog. Without the last two, back and side movement have to stretch the clips ~1.6× at the switch (visible). Names to search on Mixamo are listed below. Nothing was downloaded.
- **Not clean yet:** `run` (running_d) slips a bit (2.5 % of height, HOLD), `right_strafe_a` doesn't loop cleanly (21°), the run stop ends with the hips turned 45°, and the 90° right turn actually turns 103°.
- **Jumps:** only the KayKit jump (start/air/land) exists as a split set, and only for Rig_Medium. It is a different style from the rest.
- **Look at it in Blender:** your open Blender has a scene **KFB_LOCOMOTION_LADDER_01**. Press **Space**. Every rung walks in its own lane at its natural speed; blue discs = left foot, red = right foot. If the feet land on the discs, the speed is right. Rig_Large lanes sit further to the right (+x). The splash screen was still open — click it away first. Same scene as a file: `LOCOMOTION_LADDER_01_review.blend` (Dropbox).
- **Your call:** is `strike_foward_jog_a` acceptable as the jog look? (Mixamo alternative: "Jogging".)
- **Different numbers from Motion Lab v1:** Motion Lab measures speed with a looser foot-contact rule, so its speeds are lower (e.g. KayKit Running_A 2.48 vs 3.30 here). Both are reported, see below; the ladder uses the stricter "feet don't slide" speed.

## Outputs

| file | where | note |
|---|---|---|
| `LOCOMOTION_LADDER_01.json` | GitHub + Dropbox | schema `kfb.locomotion-ladder/0.1-candidate` |
| `KFB_Motion_Library.catalog.json` | GitHub + Dropbox | v6 + `locomotionSets.kfb_ladder_v1` and `kfb_ladder_kaykit_v1`; pure byte insertion, all other bytes identical |
| `RESEARCH_LOCOMOTION_PRACTICE.md` | GitHub + Dropbox | best practices, SOP, repos/demos |
| `blender_ladder_review.py` + `KFB_LOCOMOTION_LADDER_01_review_plan.json` | GitHub + Dropbox | rebuilds the review scene |
| `KFB_LOCOMOTION_LADDER_01_Rig_Medium.glb` / `_Rig_Large.glb`, `LOCOMOTION_LADDER_01_review.blend` | **Dropbox only** | contain Mixamo-derived motion; kept off GitHub |

Dropbox folder: `3D ASSETS/BLENDER MCP/LOCOMOTION_LADDER_01/`.

## Method (short)

Full text in `LOCOMOTION_LADDER_01.json → method`.
- Own numpy glTF evaluator on the exact library GLBs; foot positions cross-checked against the Blender import (planted toes sit on the markers to < 5 mm).
- Cycle = frames − 1 for loops (last key duplicates the first). **Catalogue v6 `durationSec` counts that duplicate, so catalogue speeds read ≈3 % low.**
- Natural speed: root travel for root-motion clips; median planted heel/toe speed for in-place clips.
- Contact: joint within 1.2 % of rig height of its minimum. Slip = max creep of a planted joint (velocity-gated). **PASS ≤ 2.0 % of rig height.**
- Handoff = geometric mean of neighbours; flag when a rate leaves 0.75–1.25. phaseOffset = L-down(target) − L-down(source) mod 1.
- Heights: mannequin mesh 2.204 m (Medium), 3.981 m (Large). World factor 1.5/2.204 = 0.6806.

## Ladders

### kfb_ladder_v1 · Rig_Medium (recommended)

| rung | clip | loop · poseDiff° | m/s (rig · world) | L-down | slip | note |
|---|---|---|---|---|---|---|
| idle | kfb_idle_idle_f | yes · 0.2 | — | — | — | |
| walkStart | **GAP** | | | | | |
| walk | walking_c | yes · 0.1 | 1.135 · 0.773 | 0.258 | 0.98 % PASS | |
| jog | strike_foward_jog_a | yes · 3.1 | 1.633 · 1.111 | 0.154 | 0.99 % PASS | style check by Georg |
| runEasy | running_a | yes · 0.0 | 2.029 · 1.381 | 0.026 | 1.69 % PASS | |
| run | running_d | yes · 0.0 | 2.978 · 2.027 | 0.381 | 2.50 % **HOLD** | |
| sprint | **GAP** | | | | | running_b only +9 %; magic_sprint is a magic style |
| walkStop | stop_walking_a | no | — | | | 3.0 s, ends with ~10° turn |
| runStop | run_to_stop_a | no | — | | | 0.93 s, hips end turned 45° |
| walkBack | walk_backward_a | yes · 0.0 | 0.557 · 0.379 | 0.0 | 0.54 % PASS | |
| runBack | run_backward_a | yes · 0.0 | 1.334 · 0.908 | 0.778 | 0.31 % PASS | |
| strafeWalkL | left_strafe_walking_a | yes · 0 | 1.178 · 0.802 | 0.032 | 0.83 % PASS | |
| strafeWalkR | right_strafe_walking_b | yes · 0.0 | 1.178 · 0.802 | 0.968 | 0.79 % PASS | _a is not a clean loop (15.6°) |
| strafeRunL | left_strafe_a | yes · 0.1 | 3.076 · 2.094 | 0.400 | 2.02 % **HOLD** | borderline |
| strafeRunR | right_strafe_a | **no · 21.2** | 2.932 · 1.995 | 0.381 | 0.62 % PASS | **HOLD: loop** |
| turnInPlace L90 / R90 | left_turn_90_a / right_turn_90_a | no | — | | | 90.0° / **102.6°** |
| turnInPlace L180 / R180 | left_turn_b / right_turn_b | no | — | | | 168° / 175° |
| jumpStart / Air / Land | KayKit Jump_Start / Jump_Idle / Jump_Land | no / yes / no | — | | | KayKit family, mixed style |

Bands (Rig_Medium, rig m/s; rates = from / to at handoff):

| from → to | handoff | rates | phaseOffset | flag |
|---|---|---|---|---|
| walk → jog | 1.361 | 1.199 / 0.834 | 0.896 | — |
| jog → runEasy | 1.820 | 1.115 / 0.897 | 0.873 | — |
| runEasy → run | 2.458 | 1.211 / 0.825 | 0.355 | — |
| walkBack → runBack | 0.862 | 1.548 / 0.646 | 0.778 | **stretch** |
| strafeWalkL → strafeRunL | 1.904 | 1.616 / 0.619 | 0.368 | **stretch** |
| strafeWalkR → strafeRunR | 1.858 | 1.578 / 0.634 | 0.413 | **stretch** |

### kfb_ladder_v1 · Rig_Large

Same clips. Speeds (rig · world): walk 2.915 · 1.984, jog 4.191 · 2.852, runEasy 5.209 · 3.545, run 7.646 · 5.203 (slip 3.06 % HOLD), walkBack 1.431, runBack 3.424, strafeWalk 3.025, strafeRun 7.90 / 7.53 (L slip 2.25 % HOLD). Forward rates identical to Medium (1.199 / 1.115 / 1.212); the same three stretch flags. **No jumps** (no Rig_Large jump clips exist).

### kfb_ladder_kaykit_v1 · Rig_Medium (alternative, KayKit only)

Walking_C 0.518 · Walking_A 0.708 · Walking_B 0.980 · **jog GAP** · Running_A 3.303 · Running_B 5.255 (slip 3.57 % HOLD, also HOLD in Motion Lab) · Walking_Backwards 0.760 · strafe runs 3.437 / 3.39. walkBrisk → run needs 1.84× / 0.55× (**flagged**). This is the slide Georg sees today.

## Stop-rule check: Motion Lab v1 (> 10 % on the same clip)

Reported both, not picked silently. Motion Lab measures ankle-only with a wide contact window (min + max(1.2 % H, 22 % of range)), which lowers the median speed.

| rig · clip | Motion Lab v1 | its method re-run here | strict (ladder) |
|---|---|---|---|
| Medium · Walking_A | 0.611 | 0.648 | 0.710 |
| Medium · Running_A | 2.480 | 2.702 | 3.303 |
| Large · Walking_A | 1.772 | 1.747 | 2.09 |
| Large · Running_A | 1.850 | **2.590** | 4.39 |

- Walk agrees within 10 % when the same method is used. The gap to the strict value is a definition difference.
- **Large · Running_A: 40 % apart even with Motion Lab's own method. Cause not found** (Motion Lab may have measured another actor, e.g. Black Knight). Open item for the Motion Lab owner.

## Gaps · Mixamo search names (not downloaded)

| rung | need | Mixamo name | name verified |
|---|---|---|---|
| walkStart | idle → walk, left foot first | "Start Walking" | no |
| sprint | ≈3.6–4.1 m/s on Rig_Medium | "Sprint", "Fast Run" | no |
| jogStrafe L/R | between 1.18 and 2.9 m/s | "Jog Strafe Left/Right" | no |
| jogBack | between 0.56 and 1.33 m/s | "Slow Jog Backwards" | yes |
| jog (style option) | only if strike_foward_jog_a is rejected | "Jogging" | yes |
| walkStop / runStop (option) | shorter stops without end turn | "Stop Walking", "Run To Stop" | no |

Also confirmed to exist: "Left/Right Strafe Walking", "Left/Right Strafe", "Walking Backwards".

## Blender review

- Live in Georg's Blender 5.2.2 (untitled file, not saved): scene `KFB_LOCOMOTION_LADDER_01`, Medium 32 lanes + Large 17 lanes, frames 0–200. No render loop.
- Fix applied during the check: the glTF importer's bone display spheres covered the mannequins; they are now hidden (also patched in `blender_ladder_review.py`), ground length capped, labels enlarged.
- Rebuild: `exec(open('blender_ladder_review.py').read()); build_review(glb, plan, 'Rig_Medium')`.

## Not in this job

No controller/state machine, no Three.js, no edits in ToolBox / Travel / Combat / Resident Atlas, no motion edits, no downloads.

## Open owner question

Shared gait controller: **one ToolBox-owned module that Travel and Combat import unchanged**, or **each consumer keeps its own state code fed by this ladder JSON**? Asked to Georg in chat.
