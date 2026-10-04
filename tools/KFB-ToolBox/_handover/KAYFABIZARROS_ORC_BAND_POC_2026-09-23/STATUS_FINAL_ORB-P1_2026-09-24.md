**Für Georg:** Endstand ORB-P1 zum Einchecken. Leader und Gitarrist sind abgenommen. Der Trommler ist geparkt: Die Arme posierst du selbst in einer vorbereiteten Blender-Werkstatt, To-do dafür ist #196. Die automatisch posierten Arme sind gescheitert und dokumentiert.

### Status per lane (2026-09-24)
| Lane | State |
|---|---|
| Leader (Legacy Orc B, bounce) | **Georg OK** |
| Guitarist, v4 hold (ORB-P1) | **Georg OK** |
| Mixamo lane · Guitar A on Orc Raider (low guitar, IK arms, collision search) | **Georg OK** ("passt so") |
| Mixamo inbox inventory (11 clips, all on KayKit rigs, no retarget needed) | done |
| Drummer v1–v4 (procedural) | FAIL, postmortem |
| Drummer Mixamo v1 (kit/toms) and v2 (big drum, palm-down) | FAIL (v2: arms twisted, limits measured but not enforced) |
| Drummer next step | **Manual posing by Georg**: `DRUMMER_POSE_WERKSTATT.blend` (Dropbox ORB), guide `mixamo/ANLEITUNG_DRUMMER_POSE_WERKSTATT.md` → **#196** |

### Read first
- `RETURN_ORB_P1_2026-09-23.md` · `POSTMORTEM_DRUMMER_v1-v4.md` · `CHANGELOG_ORB_P1.md` · `JOINT_LIMITS_AND_AUDIT.md`
- `DECISION_DRUMMER_PARKED_MIXAMO_LANE_2026-09-23.md`
- `mixamo/RETURN_MIXAMO_GUITAR_A_RAIDER_2026-09-24.md`
- `mixamo/RETURN_MIXAMO_DRUMMER_BRUTE_2026-09-24.md` + `_v2_` (both failed, kept for the record)
- `mixamo/DECISION_DRUMMER_MANUAL_POSE_2026-09-24.md` (why no more automated arm posing)
- `ONBOARDING_BLENDER_MCP_CHAT.md`: lessons learned for the next Blender MCP chat (racetrack RKIT-01)

### Findings worth keeping
- Mixamo keeps the uploaded KayKit skeleton (Rig_Medium / Rig_Large, 23 bones): clips transfer 1:1, no retarget. Body motion sits on the armature object and must be baked into root/hips.
- **Grip bug at the source:** the Atlas/v0 handslot offset puts clubs at the thumb-side edge of the fist. The centred offset is `(±0.203, −0.269, 0.128)`. This probably affects all weapon attachments and should be fixed centrally.
- Joint limits must be **hard constraints** (they are in the pose workshop), not just a report.

### Not changed
Router files, runtime owners, Animation Lab, Resident Atlas, KayKit sources. Mixamo FBX sources stay in Dropbox (licence). `orb_band_module_v5.blend` is unchanged.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01CN36npPHwSpbM6wt9ZpDmP
