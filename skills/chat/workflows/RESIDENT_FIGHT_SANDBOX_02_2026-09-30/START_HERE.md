# RESIDENT-FIGHT-SANDBOX-02 · Cartoon contact

Status: **CLAUDE DESIGN BRIEF · RESIDENT ATLAS / RESIDENT SCENERY OWNER · CHANGE TO THE EXISTING FIGHT SANDBOX**
Date: 2026-09-30
Owner: existing **Resident Atlas / Resident Scenery** Claude Design project
Repo: `georg-doc/kayfabizarro`, branch `georg-doc-patch-3`
Stage: none

## 0 · What changes and why

Sandbox 01 staged fights for real mesh contact. With the big KayKit heads that fails:

- Raider heads end up inside each other.
- Reactions fall toward the attacker, because every reaction was turned to face the attacker even when its clip falls forward.

Sandbox 02 switches to **cartoon contact**: nobody touches. Heads and bodies stay apart, and the hit is sold by four effects:

1. **Hit-stop:** both actors freeze for a few frames.
2. **Squash:** a short squash on the defender.
3. **Clay puff:** a clay puff at the impact point, reusing the Racer's clay dust.
4. **Knockback:** the defender is knocked away from the attacker.

Keep the existing sandbox scene, ring, panel and verdict export. Replace only the staging and the impact handling.

## 1 · Source

| File (Motion Library folder `media/3D_Assets/Animations/KFB_Motion_Library/`) | Use |
|---|---|
| `fight/KFB_Fight_Cartoon_Contact.json` | **The only fight data source for 02**: rig collision shapes, runtime rules, reaction knockback directions, the staging table and the proof set |
| `fight/proof_cartoon_contact.png` | What correct placement looks like at the moment of impact. The orange ball marks the puff point. Rows: Raider vs Raider, Raider attacks Brute, Brute attacks Raider, Brute vs Brute. Columns: headbutt, kick, flying kick, prop swing, jab. |
| `KFB_Motion_Library.catalog.json`, `libs/**` | Clips, unchanged |

`fight/KFB_Fight_Combos.json` (0.1) stays in the repo for reference only; do not use its placements any more.

## 2 · Runtime rules (all numbers come from the data file)

1. **Collision shapes per rig** (`rigs`):
   - a head sphere: head bone matrix × `offsetInBoneSpace`, radius `radiusM`;
   - a body capsule from the hips joint to the neck joint, radius `radiusM`.

   Draw them as a debug toggle.
2. **Placement:**
   - The attacker stands at the arena anchor with no extra rotation.
   - The defender stays in `kfb_action_boxing_a`, rotated by `defenderStanceYawDeg`.
   - The defender's hips sit at `attacks[..][rigA].hipsAtContact + hipsDistanceM` along `attackAxisYawDeg`, taken from `table["<attack>|<rigA>|<rigB>"]`.
3. **Separation, every frame:** if the two head spheres, or a head and the other body capsule, or the two capsules come closer than 5 cm × the smaller rig scale, push the defender back along the attack axis. This is the only collision check. No mesh tests.
4. **Impact, when the attacker clip reaches its `contactFrame`:**
   - freeze both actors for 4 frames;
   - squash the defender (starting value: 1.1 wide / 0.9 high over 6 frames, back to 1);
   - spawn the clay puff at `impactPuffAt` (attacker clip space; start size about 0.25 m × defender scale);
   - optionally nudge the camera slightly.

   These are starting values. Expose them as sliders; Georg tunes the look.
5. **Reaction after the hit-stop:**
   - Start the reaction clip at its `impactFrame` and skip the frames before it.
   - Rotate the defender about its hips by `attackAxisYawDeg − reactions[r].byRig[rig].knockbackYawInClipDeg`, so it is always knocked away from the attacker.
   - The turn happens inside the puff, which hides the snap.
6. **Readability:** show `visualGapM` in the panel.
   - Up to about 0.15 m × defender scale, the puff sells the hit.
   - Larger gaps (mostly Brute hitting Raider high) will look like a miss. Leave them visible; they are data for Georg's verdict.

## 3 · Test only the proof set (`proofSet`)

1. Headbutt → taking punch → dizzy
2. Kick → knock-down backward
3. Flying kick → uppercut reaction
4. Prop swing (`sword_and_shield_attack`) with any hand prop in `handslot.r` → side reaction
5. **Dust-cloud brawl:**
   - a clay cloud hides both fighters, fist-fight clips loop inside, and a limb or prop pokes out now and then;
   - the cloud drifts about 2 m;
   - one fighter is ejected (`fall_flat`, then `getting_up`), and the other stays dizzy.

   It works for every rig pairing and needs no staging data.
6. Shoulder throw, Brute vs Brute only (root-aligned pair). For Raider pairs and mixed sizes, use the dust cloud instead.

All four rig pairings stay selectable. The free pick from Sandbox 01 may stay, but it uses the 02 table and the 02 rules.

## 4 · Known limits (show them, do not hide them)

- **Brute attacks Raider:** high punches and kicks stop 0.6–1.9 m short. Low attacks (headbutt, wild swipe, prop swing) work.
- **Getting up** starts face down. It fits after `fall_flat`. After face-up knock-downs (`standing_death_left`, `surprise_uppercut`) there is a pose jump; skip the get-up there or accept the jump.
- **"From behind" reactions** (`fall_flat`, `shoved_reaction_with_spin`, `surprise_uppercut`) turn the defender away at impact. They read as a sucker punch or a hit after a spin.
- **Directions that are judged, not measured:** `reaction_a` was judged by eye and `standing_react_small_from_right` was taken from the clip name. Georg confirms them in the sandbox.
- `hurricane_kick_a` stays excluded (no body motion).

## 5 · Boundaries

- Do not change: Motion Library files, catalogue, other Resident scenes, Graveyard Site Contract work, WorldBuilder, ToolBox Production-05/06.
- Do not add: mesh collision, physics or ragdoll, a timeline editor, IK, or clip retiming.

## 6 · Acceptance

1. The data loads: 17 attacks, 9 reactions, 68 table entries, 6 proof items.
2. **Separation check:** during every proof item, the head spheres and body capsules of the two fighters never overlap by more than 1 cm × scale.
3. **Knockback check:** for items 1–4, the defender's hips move away from the attacker during the first 15 frames after the hit-stop (the distance grows or stays the same).
4. The puff appears at `impactPuffAt` within 2 cm × scale at the contact frame.
5. The hit-stop, squash and puff sliders work. The debug toggle shows the spheres and capsules.
6. The verdict export still works. Other scenes are unchanged.

## 7 · Budget and return

- One implementation pass plus at most one repair pass on a named acceptance blocker. After two failed repairs: stop, export the Session Cut, report.
- Return:
  - the complete Session Cut;
  - `SOURCE.json`;
  - `RETURN.md` (problems first);
  - acceptance results 1–6;
  - one screenshot per rig pairing of proof item 1 during the hit-stop, with the debug shapes on.

## Exactly one next gate

**Georg plays the proof set and exports his verdicts.** Only then decide which moves are worth new clips (shove, tackle, body slam) and which combos the Blender MCP chat reworks.
