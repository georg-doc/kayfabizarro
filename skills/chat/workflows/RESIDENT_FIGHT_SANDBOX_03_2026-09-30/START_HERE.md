# RESIDENT-FIGHT-SANDBOX-03 · Face each other, dust-cloud beat, lying lift, hammer

Status: **CLAUDE DESIGN BRIEF · RESIDENT ATLAS / RESIDENT SCENERY OWNER · CHANGE TO THE EXISTING FIGHT SANDBOX (S15)**
Date: 2026-09-30
Owner: existing **Resident Atlas / Resident Scenery** Claude Design project
Repo: `georg-doc/kayfabizarro`, branch `georg-doc-patch-3`
Base: your Session Cut `KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1` (`lib/fight-sandbox-02.js`, `data/fight-sandbox-02.json`)
Stage: none

## 0 · Why

Georg's findings F1, F3, F4 and F5 (your `GEORG_FEEDBACK_2026-09-30.md`) and your Blender questions §2.1–§2.5 are answered in one new data file:

`media/3D_Assets/Animations/KFB_Motion_Library/fight/KFB_Fight_Cartoon_Contact_03.json` (`kfb.fight-cartoon-contact/0.3`).

It is 0.2 plus new blocks. Everything 0.2 had is unchanged, except the `kfb_action_sword_and_shield_attack_a` table entries, which are now staged for the hammer.

The sandbox, ring look, panel and verdict export stay. Change only what is listed below.

## 1 · The facing bug (F1, F4, your question 4)

- **What `facingYawDeg` means:** the catalogue value is the **shoulder-line angle**, i.e. how far the body is turned away from the rest facing. It is **not** the direction the body faces. Absolute forward = `facingYawDeg − 90`.
- **What went wrong:** the sandbox uses it as a forward yaw. That turns everyone by 90° (sideways), and the run-in by about 140° (backwards).
- **The fix:** use `facing.clips[clip].forwardYawDeg` from the 0.3 file. Rule: to make an actor playing clip X face world direction D,

  `rotation.y = D − forward(X)`

  (same yaw convention as your `dirOf` / `yawOf`).

Replace these lines in `lib/fight-sandbox-02.js`:

| Where | Today | 0.3 |
|---|---|---|
| brawl run-in | `0 - P.fRun`, `180 - P.fRun` | `0 - fwd(RUN)`, `180 - fwd(RUN)` (fwd(RUN) = −88.7, the feet travel axis) |
| brawl cloud | `phi - P.fFist`, `phi + 180 - P.fTake` | `phi - fwd(FIST)`, `phi + 180 - fwd(TAKE)` |
| brawl dizzy | `P.ej.aYaw + P.fFist - P.fDizzy` | followUp rule (§2): A turns to watch B |
| idle fallback | `-fb`, `180 - fb` | `0 - fwd(IDLE)`, `180 - fwd(IDLE)` |
| throw | `fAgg = facingYawDeg` | only the ring/camera axis uses it; use `fwd(aggressor)` |

`fwd(c)` = `F.facing.clips[c].forwardYawDeg`. Stop reading `def.clips[..].facingYawDeg` for rotation anywhere.

## 2 · Follow-up re-facing (F1: back to back at the end)

- Today, after the attack or the reaction ends, the next clip (`then.*`, IDLE, dizzy, taunt, and the clip after getting_up) keeps the old rotation. Clips with big in-clip turns therefore end sideways or back to back:
  - `sword_and_shield_attack` turns 61°;
  - `shoved_reaction_with_spin` turns 158°;
  - `surprise_uppercut` turns 204°.
- **Rule (`runtimeRules.followUp`):**
  - Turn the actor about its hips so the next clip faces the opponent's hips: `target = yawOf(opponentHips − ownHips) − fwd(nextClip)`.
  - Blend from the current rotation to the target over 12 frames (smoothstep), and keep tracking while the opponent moves.
  - Lying clips are never re-faced.
- **From-behind reactions:** in the free pick, list the four reactions in `reactionNotes.fromBehind` under "from behind".

## 3 · Dust cloud with an impact beat (F4)

Follow `brawlRecipe.steps` exactly:

1. **Run-in:** the fighters run in facing each other (§1).
2. **Impact beat:** when the hips are `D` apart, freeze both for 4 frames and squash both. A clay puff (0.25 m × smaller scale) pops at the hips midpoint, at 0.6 × the smaller head height.
3. **Cloud:** the cloud **grows out of that puff point** over 0.25 s, then drifts about 2 m. Inside it, fist and take face each other (§1).
4. **Eject:** B is ejected as today. A plays dizzy and watches B (§2).
5. **Get up:** after the get-up, both return to IDLE facing each other.

## 4 · Lying poses in the ground (F5, your question 3)

`lift[clip][rig]` holds per-frame curves (index = clip frame − 1) for the five clips that go down: `surprise_uppercut`, `death_from_the_front`, `standing_death_left`, `fall_flat`, `getting_up`.

- **Two curves; add a panel toggle and let Georg pick per rig:**
  - `liftM`: nothing sinks. The big Raider head then carries the body, which floats a little.
  - `liftBodyM`: body and limbs rest on the ground, and the Raider head sinks by up to 0.5 m when lying face up.
- **Optional `headTuck`:** an extra head-bone rotation that lifts the Raider head clear at `liftBodyM`. It reads as "looking up from the floor". Offer it as a checkbox, off by default.
- **Brute:** its head never goes below its body, so both curves are the same.
- **Standing reactions are not lifted.**
- **Reference:** `lying_options.png`. Top row: standing_death_left. Bottom row: fall_flat. Columns: liftM, liftBodyM, liftBodyM + headTuck.

## 5 · Hammer (F2, your questions 1 and 5)

- **Collision shapes:** `prop.capsulesInPropSpace` gives a handle capsule and a head capsule in glTF prop space. Multiply them by the rig scale.
- **Why the hammer is inside the body:** with `sword_and_shield_attack_a`, the hammer is inside the own body during wind-up and recovery.
  - Raider: frames 1–18 and 31–40.
  - Brute: frames 1–17 and 33–40.
- **None of the checked clips is better:** stabbing, hook punch and punching all intersect more.
- **Rule, "hammer space":**
  - the hammer pops in (scale 0 → 1 over 2 frames) at the start of `prop.visibleWindow` and pops out at its end;
  - Raider window 19–30: the hammer appears exactly on the hit;
  - Brute window 18–32.
- **Staging:** the 0.3 table places the defender for the **hammer head**, not the hand. The puff sits between the hammer head and the defender (`proof_prop_hit.png`). Results:
  - Raider vs Raider: 5.7 cm gap;
  - Raider hits Brute: 5.9 cm;
  - Brute vs Brute: 14.7 cm;
  - **Brute hits Raider: the hammer passes 1.05 m above the Raider** (known limit, show it).

## 6 · Limbs (your question 2) and ring (F3)

- **Limb capsules:** `rigs[rig].limbCapsules` has arm and leg capsules for the debug view. The separation rule stays head and body only.
- **Ring:** `acrossM = 9 × max(scaleA, scaleB)`. Posts and rope heights use the same factor: 9 m for Raider pairs, 23.1 m with a Brute. Rope rebound is a later slice. Keep the current rope build; Georg likes it.

## 7 · Boundaries

- Do not change: Motion Library files, catalogue, other Resident scenes.
- Do not add: physics, IK, retiming, mesh collision.
- Load `KFB_Fight_Cartoon_Contact_03.json` instead of 0.2. Keep 0.2 in the repo.

## 8 · Acceptance

1. **Data loads:** 17 attacks, 9 reactions, 68 table entries, 6 proof items, `facing.clips` ≥ 33, `lift` = 5 clips.
2. **Facing:** in idle and at the end of every proof item (after 12 frames of follow-up), the angle between each fighter's forward and the direction to the opponent's hips is ≤ 25°. Lying actors are exempt.
3. **Brawl run-in:** during the run-in, each fighter's forward is within 25° of the direction to the other.
4. **Brawl beat:** the puff appears at the start of the hit-stop, and the cloud radius is < 30 % of full size 2 frames later.
5. **Lift:** at the last frame of each lying clip, with `liftM`, no skinned vertex is lower than −3 cm × scale.
6. **Hammer:** with `prop_hit`, the hammer is hidden outside `visibleWindow`, and the puff is within 2 cm × scale of `impactPuffAt`.
7. **Ring size:** 9 m for Raider pairs, 23.1 m with a Brute.
8. **Unchanged:** separation (0.2 acceptance 2) and knockback (0.2 acceptance 3) still pass. Verdict export works.

## 9 · Budget and return

- One implementation pass, plus at most one repair pass on a named acceptance blocker. After two failed repairs: stop, export the Session Cut, report.
- Return:
  - the Session Cut;
  - `RETURN.md` (problems first);
  - acceptance 1–8;
  - screenshots: idle Raider vs Raider, the brawl at the impact beat, `standing_death_left` end with each lift option, and `prop_hit` Raider vs Raider during the hit-stop.

## Exactly one next gate

**Georg plays the proof set and picks the lift option and the hammer pop.** Then new boxing combos from the next Motion Library intake (Jab Cross, Body Jab Cross, dodges, the uppercut attacker side).
