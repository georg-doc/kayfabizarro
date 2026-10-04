# Joint limits + audit gate · KayKit Rig_Medium / Rig_Large · candidate · 2026-09-23

Georg: **"wir müssen solche Extrem-Haltungen & Biegungen verhindern durch Limits"**

Status: **CANDIDATE RULE · limits need Georg's calibration · audit tool tested on v0–v5**

## Rule

No pose or clip is shown for review until `blender/orb_joint_audit.py` passes on every frame of the loop.
A frame over a limit is a **FAIL**, not a "tune later".

## Candidate limits (stylised cartoon, both rigs)

| Joint measure | Limit | Meaning |
|---|---|---|
| Elbow angle (shoulder–elbow–wrist, 180 = straight) | **≥ 35°** | arm must not fold into itself |
| Wrist bend (hand vs forearm, relative to the modelled rest) | **≤ 35°** | covers flexion, extension and deviation together |
| Forearm twist (lowerarm about its own axis vs upper arm, relative to rest) | **≤ 70°** | pronation/supination budget |

The measures are axis-independent (joint positions and rest-relative rotations), so they work on imported GLBs as well as on the authoring rig.

## Audit of everything built today

48 drum frames / 24 strum frames × 2 arms. Full per-frame output: `evidence/joint_audit_v0-v5.json`.

| Clip | worst elbow | worst wrist | worst twist | frames over limit |
|---|---|---|---|---|
| drum v0 / v5 | 133° | 99° | 15° | 96 / 96 |
| drum v1 | 71° | 47° | 54° | 78 / 96 |
| drum v2 | 62° | 105° | 0° | 96 / 96 |
| drum v3 | 132° | 15° | 118° | 50 / 96 |
| drum v4 | 100° | 25° | 180° | 96 / 96 |
| strum v0 | 153° | 88° | 28° | 48 / 48 |
| strum v4 = v5 (accepted look) | 117° | 15° | 117° | 24 / 48 |

## Open calibration question for Georg

The accepted guitar hold (v4) fails the twist limit (fretting forearm 117°): a fretting hand is strongly supinated by nature. Two ways out:

1. per-clip limits (instrument holds get a larger twist budget, strikes do not), or
2. rebuild the fretting hand with less forearm twist and more shoulder rotation.

Proposal: option 1 with an explicit table per action family (strike / hold / strum / carry), stored next to the clip in the performance sidecar.

## Enforcement in Blender (next step, not yet applied)

- Authoring: add `Limit Rotation` constraints on `wrist.*` / `hand.*` and a twist budget on `lowerarm.*` while posing; bake before export (constraints do not export to glTF).
- Gate: run `audit(rig, frames)` before every preview/export; include the result in the Return.
