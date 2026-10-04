# HANDOVER → Coworker lead WS0 · ORB-P1 KayfaBizarros · 2026-09-23

Für Georg: Das ist die operative Übergabe an den Coworker-Lead (WS0). Er übernimmt die Steuerung des nächsten ORB-Schritts; die Blender-Arbeit bleibt im Blender-MCP-Lane.

## Paste-ready start prompt

> Read `tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/` on branch `claude/orb-p1-return-postmortem-2026-09-23`: `RETURN_ORB_P1_2026-09-23.md`, `POSTMORTEM_DRUMMER_v1-v4.md`, `JOINT_LIMITS_AND_AUDIT.md`, `CHANGELOG_ORB_P1.md`.
>
> Own gate **ORB-D1 · drummer reference pick**. Prepare one review page with 2–4 drum-strike references and let Georg pick one. Do not animate the drummer in this gate. Do not touch the accepted leader and guitarist clips.

## Current state

| Item | State | Where |
|---|---|---|
| Leader bounce (8 beats) | Georg OK | `exports/orb_band_module_v5.glb` clip `bounce` |
| Guitarist strum (1 beat) | Georg OK | clip `strum` (v4 hold) |
| Drummer (2 beats) | v0 restored as baseline; exceeds wrist limit | clip `drum`, `blender/orb_restore_v0_drum.py` |
| Review HTML | works with v5 (textures OK under a blob-blocking CSP) | `review/` |
| Joint audit | new tool, candidate limits | `blender/orb_joint_audit.py`, `JOINT_LIMITS_AND_AUDIT.md` |
| Blender working file | `orb_band_module_v5.blend` (Dropbox ORB folder, copy in `blender/`) | |

## ORB-D1 · what the reference review should contain

1. **KayKit melee clips on the Brute** (already local, same rig family, identity grip keeps the clubs in the fist): `Melee_2H_Slam`, `Melee_1H_Slash`, `Melee_2H_Attack`, `Melee_Dualwield_Slash`, `Melee_Unarmed_Smash`. Render each unchanged, side + 3/4 view, contact frame marked.
2. **One or two external motion references** (research leads, content not yet verified):
   - Wondar Studios · "Playing drums" 3D motion (marketplace / Gumroad)
   - MoCap Online (commercial FBX packs; free sampler)
   - CMU motion capture database in BVH (large, general; check for percussion)
   - DRUMS · Drummer Reconstruction Using MIDI Sequences (ACM SIGGRAPH MIG 2025), research reference for stroke mechanics
   - Mixamo: search "drum" (availability not verified)
3. Georg picks one. Record the pick and the contact frame in the Return.

## Rules for the next drummer build (after ORB-D1)

1. **Clip first, placement second.** Keep the picked motion; move/scale drum and Brute until the contact frame lands on the inner head. Do not bend the arm to a fixed target.
2. **Clubs stay in the fist** (Atlas identity grip). No rotation of the prop inside the hand.
3. **Joint audit is a gate.** Run `orb_joint_audit.py`; any frame over the limits is not shown.
4. **Additive only:** at most one shoulder offset and a small wrist tip at contact.
5. **Stop rule:** two rejections on the same issue → stop, document, ask Georg.
6. Read `PERFORMANCE_ANIMATION_PILOT.md` (PR #193) before building, but follow Georg's stylisation: the orc strikes from shoulder/arm; the wrist only tips slightly.

## Open decisions for Georg

- Joint-limit calibration per action family (the accepted guitar hold has 117° forearm twist).
- Drum scale: Atlas factor 2 (v0/v5) or 1.6 (v2–v4).
- Pauldron policy: source skinning (collides with a raised left arm) vs documented re-weighting.
