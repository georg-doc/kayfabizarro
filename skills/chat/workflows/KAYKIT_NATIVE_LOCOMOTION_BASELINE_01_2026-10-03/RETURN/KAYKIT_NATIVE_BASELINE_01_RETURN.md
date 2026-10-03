# KAYKIT NATIVE LOCOMOTION BASELINE 01 — RETURN (revised brief)

Executor: Coworker (Blender MCP + cloud bpy 5.0.1) · 2026-10-03
Brief: `GEORG_COWORKER_REVIEW/BRIEF_BLENDER_KAYKIT_NATIVE_BASELINE_01_REV.md`
Actor: **KayKit Mannequin_Medium** (two-tone, from the pack itself). Source: **KayKit Character Animations 1.1 only**, playback rate 1.0, 30 fps.
No Mixamo, no Motion Library, no controller, no authored transitions.

## Defects and open points first

1. **Running_B does not hold its feet.** The foot rolls through the contact, so no single ground speed keeps it still (slip 3.6 %, limit 2 %). It is the only fast run in the pack. → HOLD, Georg decides whether the look is acceptable as sprint.
2. **Running_HoldingBow / Running_HoldingRifle use the same legs as Running_B**, so they share the slip. Arms are correct. → HOLD (needed later for bow work).
3. **The side runs are not sideways.** Running_Strafe_Left/Right travel on a ~60° diagonal (forward-left / forward-right), and only at run speed. A pure side step or strafe walk does not exist in the pack.
4. **Speed conflict with J14 (ActionFigure)** on three clips, >10 %: Walking_B (+36 %), Running_B (+35 %), Crouching (+78 %). Not averaged. The review scene has one extra lane per conflict at the J14 speed; whichever lane keeps the feet on the discs is right.
5. **Rig_Large is thin:** Walking_A, Running_A, Idle_A/B, Dodge ×4. No backward, side, stealth or jump clips.
6. **Not done yet in this return:** the live scene in Georg's Blender and the Dropbox copy — Georg's computer was not reachable when this was written. The `.blend` here opens the same scene.

## Pictures

Each sheet: header with the numbers, a side row (on light grey) and a 3/4 row (on checker), 8 frames per clip at native rate.

| Family | Sheet |
|---|---|
| Idle | `sheets/KAYKIT_NATIVE_idle.png` |
| Walk (A/B/C/Backwards) | `sheets/KAYKIT_NATIVE_walk.png` |
| Run (A/B) | `sheets/KAYKIT_NATIVE_run.png` |
| Side runs | `sheets/KAYKIT_NATIVE_strafe.png` |
| Stealth (Sneak/Crouch/Crawl) | `sheets/KAYKIT_NATIVE_stealth.png` |
| Carry (Bow/Rifle run) | `sheets/KAYKIT_NATIVE_carry.png` |
| Jump chain + full jumps | `sheets/KAYKIT_NATIVE_jump.png` |
| Dodges | `sheets/KAYKIT_NATIVE_dodge.png` |
| Source isolation (T-pose / idle; Mannequin only, 21 bones, armature Rig_Medium) | `sheets/KAYKIT_NATIVE_source_isolation_{tpose,idle}.png` |

Blender review: `KAYKIT_NATIVE_BASELINE_01_review.blend` (scene `KFB_KAYKIT_NATIVE_BASELINE_01`, 27 lanes, footprint discs blue = left, red = right; in-place clips ride a lane that moves at their natural speed; three extra lanes marked `@J14`). Rebuildable with `blender_native_review.py` + `KAYKIT_NATIVE_BASELINE_01_review_plan.json` + the Mannequin GLB (GLB and .blend in Dropbox `BLENDER MCP/KAYKIT_NATIVE_BASELINE_01/`, not on GitHub).

## In plain words

The KayKit pack covers almost the whole basic movement set with clean, readable motion: standing, three walks, walking backwards, a run, sneaking, crouching, crawling, jumping in three parts or in one clip, and four dodges. These are good enough to be the base. What the pack does not have: a jog between walk and run, turning on the spot, stepping sideways at walking pace, starting and stopping, and a clean sprint. Those are the only places where Mixamo may be considered later.

## Verdict (Coworker recommendation — Georg decides the look)

| Clip | Verdict | Why |
|---|---|---|
| Idle_A, Idle_B | KEEP | Clean loops. |
| Walking_A | KEEP | Standard walk, feet hold. |
| Walking_B | KEEP | Brisk walk, same rhythm, longer steps. J14 speed conflict. |
| Walking_C | KEEP | Slow walk; 2.5° loop seam, not visible. |
| Walking_Backwards | KEEP | Clean. |
| Running_A | KEEP | Cleanest clip; clear flight phase. |
| Running_B | **HOLD** | Feet roll (slip 3.6 %), wide arm pumping; sprint only after look decision. |
| Running_Strafe_Left/Right | KEEP | 60° diagonal, run speed only. |
| Sneaking, Crouching, Crawling | KEEP | Clean. Crouching has J14 speed conflict. |
| Running_HoldingBow/Rifle | **HOLD** | Running_B legs. |
| Jump_Start → Jump_Idle → Jump_Land | KEEP | Joins with 0°; Land ends 23° from Idle_A → short blend. |
| Jump_Full_Short/Long | KEEP | One-clip jumps, in place. |
| Dodge ×4 | KEEP | 0.4 s one-shots, end holding the dodge pose → need a blend back. |
| — | REJECT: none | |

## Recommended native family

| Role | Clip |
|---|---|
| idle | Idle_A (+ Idle_B variant) |
| walk slow / walk / walk brisk | Walking_C / Walking_A / Walking_B |
| run | Running_A |
| sprint | Running_B — HOLD |
| back | Walking_Backwards |
| side (run) | Running_Strafe_Left / Right |
| jump | Jump_Start → Jump_Idle → Jump_Land; Jump_Full_Short/Long |
| stealth | Sneaking, Crouching, Crawling |
| evade | Dodge_Forward/Backward/Left/Right |

## Gaps (the only candidates for later Mixamo additions)

- **Jog:** nothing between Walking_B (0.98 m/s) and Running_A (3.30 m/s) — factor 3.4.
- **Turn in place** 90/180.
- **Strafe walk** (side runs exist only at run speed, diagonal).
- **Start / stop / pivot.**
- **Sprint**, unless Running_B is accepted.
- **Bow/rifle run at Running_A speed.**
- Rig_Large: everything beyond Walking_A, Running_A, Idle, Dodge.

## Speed conflicts with J14 (reported both ways, not averaged)

| Clip | J14 (m/s) | Coworker (m/s) | Planted-foot creep: Coworker vs J14 | Reading |
|---|---|---|---|---|
| Walking_B | 0.721 | 0.980 | 9.5 cm vs 17.1 cm | favours Coworker |
| Running_B | 3.880 | 5.255 | 12.7 cm vs 12.5 cm | ambiguous (foot roll) → HOLD |
| Crouching | 0.649 | 1.154 | 22 cm vs 32 cm | favours Coworker |

Other clips agree within 10 %. Check by eye: the `@J14` lanes in the Blender scene.

## Appendix — numbers

Method: own glTF evaluator. All locomotion clips are in place; natural speed = median planted heel/toe speed (no-skate ground speed); slip = max creep of a planted joint at that speed, PASS ≤ 2 % of 2.204 m; arm clearance = hand distance to the hips–chest axis ÷ shoulder half-width (>1 = hand clear of the body).

| Clip | Speed m/s | Cadence /min | Stride m | Slip % | Notes |
|---|---|---|---|---|---|
| Walking_A | 0.708 | 112.5 | 0.755 | 0.8 | |
| Walking_B | 0.980 | 112.5 | 1.045 | 0.2 | |
| Walking_C | 0.518 | 75 | — | 1.02 | seam 2.54° |
| Walking_Backwards | 0.760 | — | — | 0.43 | |
| Running_A | 3.303 | 150 | 2.64 | 0.34 | airborne 58 % |
| Running_B | 5.255 | — | 4.20 | 3.57 | arm ratio 1.96 |
| Running_Strafe_L / R | 3.437 / 3.391 | — | — | 0.43 / 0.39 | travel ±60.1° |
| Sneaking | 0.561 | 56 | — | 0.12 | |
| Crouching | 1.154 | — | — | 0.0 | |
| Crawling | 0.483 | — | — | 0.0 | |
| Running_HoldingBow / Rifle | 5.255 | — | — | 3.57 | Running_B legs; bow arm ratio 1.21 |

Jump/blend seams: Start→Idle 0.0°, Idle→Land 0.0°, Land→Idle_A 23.4°, Idle_A→Walking_A 71.3°, Walking_B→Running_A 44°.
Dodges: root travel 0.25–0.65 m, 0.4 s.

Full data: `KAYKIT_NATIVE_BASELINE_01.json` (inventory of all clips on both rigs, per-clip measurements, jump chain, creep check, gaps, family).
