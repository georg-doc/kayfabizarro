# RETURN · ORB-P1 · The KayfaBizarros band module · 2026-09-23

Status: **PARTIAL · guitarist + leader Georg-OK · drummer FAILED (v1–v4), v0 restored as v5 baseline**
Lane: Blender MCP authoring (Claude, Cowork → Blender 5.2.2 LTS on Georg's Mac). No runtime owner, no merge, no Cloudflare.

## 1 · What exists now (v5)

| Performer | Asset | Clip | State |
|---|---|---|---|
| Leader | Legacy Orc B (`character_orcB.gltf`) + GothGirl microphone on the right arm piece | `bounce` 8 beats: travels A → B → A in front of the stage, downbeat hops, turn on beat 8 | **Georg OK** |
| Guitarist | Orc Raider (Rig_Medium, texture repaired) + pink `guitar_B` on the chest bone | `strum` 1 beat: one strum pose + wrist flick, fretting hand on the neck | **Georg OK** (v4 hold) |
| Drummer | Orc Brute (Rig_Large) + `Orc_Wardrum` (scale 2) + two `Orc_WardrumStick` (scale 2, identity grip) | `drum` 2 beats: v0 clip restored 1:1 | **baseline only** — best look so far, but exceeds the wrist limit (99°) |
| Scenery | Ground, `Orc_Banner_Large`, camp props | — | minimal patch; Warband camp donor not composed |

Review HTML: `review/KAYFABIZARROS_BAND_POC_REVIEW.html` (needs `review/orb_band_module.gltf.json`, `review/module.json` and the track copied as `review/rubbish_groove.mp3` from `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`).

## 2 · Tests actually run

| Level | Check | Result |
|---|---|---|
| numerical | v5 drum restored vs v0 GLB: bone heads + stick grip/tip, 5 sample frames | max error **0** |
| numerical | joint-limit audit v0–v5 (drum 48 f, strum 24 f, both arms) | see `JOINT_LIMITS_AND_AUDIT.md`; **every drum version fails** at least one limit |
| numerical | collision on deformed meshes (arm/club vs head, pauldron, drum), v3/v4 | documented in the postmortem; not re-run for v5 |
| export | GLB v5 (3 clips: bounce 8 s, drum 2 s, strum 1 s), glTF-JSON for the review page | OK |
| playback | review page with the v5 module in a local headless-Chromium harness under a CSP that blocks `fetch(blob:)` (same restriction as the artifact sandbox) | loads and plays, textures OK |
| human | Georg | leader OK, guitar OK, drummer v1–v4 FAIL |

Not tested: playback in an existing KFB runtime (Resident Atlas / Animation Lab); beat events via sidecar.

## 3 · Files in this folder

- `POSTMORTEM_DRUMMER_v1-v4.md` — why the drummer failed, incl. why the weapon clips were not used
- `CHANGELOG_ORB_P1.md` — additive per-version log v0–v5
- `JOINT_LIMITS_AND_AUDIT.md` — candidate limits + audit table
- `HANDOVER_WSA_CHAT.md` · `HANDOVER_COWORKER_LEAD_WS0.md`
- `SOURCE.json` — machine-readable state
- `LESSON_GLB_TEXTURES_IN_ARTIFACT_SANDBOX.md`
- `blender/` — `orb_band_module_v5.blend`, `orb_build.py` (state after v4), `orb_restore_v0_drum.py`, `orb_joint_audit.py`, `kfb_pose_tools.py`, `history/orb_build_v3.py`
- `exports/` — `orb_band_module_v0.glb` … `v5.glb` (all versions, for side-by-side review)
- `preview/` — `orb_preview_v0.gif` (downscaled 60 %, every 2nd frame; full size in Dropbox) … `v5.gif`, contact sheets, drummer loop sheets v4 and v5
- `review/` — review HTML + module.json + glTF-JSON (v5)
- `evidence/joint_audit_v0-v5.json`

Working set (not in Git): Dropbox `CLAUDE/…/3D ASSETS/BLENDER MCP/ORB/` (all .blend states, frame folders, debug sheets).

## 4 · Deviations from the source assets (visible, flagged)

- Orc Raider material: image re-bound (source GLB ships none).
- Drum scale: 2 in v0/v5 (Atlas factor); v2–v4 used 1.6.
- Brute pauldron re-weighting (v3/v4 only) reverted in v5.

## 5 · Unresolved

- Drummer: needs a reference-first rebuild (see handovers), must pass the joint audit.
- Joint limits: calibration per action family (the accepted guitar hold fails the 70° twist budget).
- Catalogue path mismatch: Clown and Orc Raider filed under `KayKit_Mystery_Series6` in the repo, local packs under Series 4.
- Warband camp scenery donor (Legacy Web Pet PR #157) not composed yet.

## 6 · Exactly one next gate

**ORB-D1 · Drummer reference pick:** collect 2–4 references for "heavy orc strikes a war drum" (KayKit melee clips rendered on the Brute, one or two external motion references). Georg picks one. No new drummer animation before that pick.
