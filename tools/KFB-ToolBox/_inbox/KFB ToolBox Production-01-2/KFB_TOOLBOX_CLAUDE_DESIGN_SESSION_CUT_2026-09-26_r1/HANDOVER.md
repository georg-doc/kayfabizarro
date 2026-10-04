# HANDOVER → WSA · KFB ToolBox Production-02 · 2026-09-26 r1

**From:** Claude Design (read-only on GitHub, write path 403). **To:** WSA (repo owner lane). **Georg gate:** visual.

## What WSA gets
| Path in this cut | Repo target (proposal) | Kind |
|---|---|---|
| `KFB ToolBox Production-02.dc.html` | `tools/KFB-ToolBox/stage-first/src/KFB ToolBox Production-02.dc.html` | entry point (DC) |
| `kfb-lib/face-mount.v1.js` | `tools/KFB-ToolBox/kfb-lib/face-mount.v1.js` | new owner: face reader for figures without a graft (graft-mount.v1 steps 3–4 on facehost.v1) |
| `kfb-lib/hair-tufts.v1.js` | `tools/KFB-ToolBox/kfb-lib/hair-tufts.v1.js` | **new** · `kfb.hair-tufts/0.1` |
| `kfb-lib/lipsync-text.v1.js` | `tools/KFB-ToolBox/kfb-lib/lipsync-text.v1.js` | **new** · `kfb.lipsync-track/0.1` |
| `kfb-lib/clay-lids.v1.js` | `tools/KFB-ToolBox/kfb-lib/clay-lids.v1.js` | **new** · `kfb.clay-lids/0.1` · donor PR #159 |
| `kfb-lib/pose-rig.v1.js` | patch of `kfb-rigs-embed-v3/petstudio-v9/studio-v13/pose-rig.v1.js` | owner fix from 25.09 (unchanged since r2) |
| `kfb-lib/locomotion-profiles.v1.js`, `kfb-lib/pet-library.v6.js` | unchanged since r2 | carried along for the closure |
| `blender/BLENDER_BRIEF_v2.md` | `tools/KFB-ToolBox/ear-rig/BLENDER_BRIEF_FACEPARTS_v2.md` | brief for the Blender chat |

## Contract changes (additive, no renames)
`kfb.pets/1` pet entry (Rigging › Export) now also carries:
- `hair` = `{schema:'kfb.hair-tufts/0.1', source, on, pick, size, height, depth, spread, lean, tilt, color, rough}`
- `lids` = `{schema:'kfb.eyerig-lids/0.1', u, l, s, du, dl, ds}` → EyeRig `emote.lidUpper/lidLower/slant` as [left, right]
- `clayLids` = `{schema:'kfb.clay-lids/0.1', donor, on, cover, coverLo, thickness, roundness, bulge, curve, curveLo, reach, wrap, open, sweep, color}`
- `mouth.restMap` is written from the new expression editor (the field existed in pet-mouth v4 §2e and is now authored).
face-mount.v1 `load()` ignores unknown top-level keys. The ToolBox import reads `hair/lids/clayLids` itself. mountGraft does not read them yet.

## Decisions taken
1. The clay lid geometry is ported **1:1** from PR #159 (`buildUpperLidVolumeGeometry`). The only addition is `reach` and `wrap`: FB's eyes stick out of the head, and the compact pad left the upper eyeball bare, which read as a visor (contract §15.9 FAIL on the picture). »Compact pad (PR #159)« stays one click away as a preset.
2. The lower lid is the same construction mirrored (§15 »two halves of one shell«).
3. Motion = sweep (§16.1). The clay lids hang in the EyeRig lid joint `e._lids` and take the rig's own shell angle. Blink, emotes, lid sliders and slant drive them without new rig code; `_up/_lo` are only hidden.
4. The hair tufts are selected by POSITION, not by index: head-bone islands, the largest one is the skull, the frontmost mirrored pair is the eye shells, the rest above the skull is tufts. Measured 108 · 84 · 108 tris (matches LIVING_frizzlegraft P34-S35).
5. Lip-sync is a letter-to-decal track, not an audio analysis. The track format (`[{key, ms}]`) matches what a Rhubarb or Papagayo import would deliver later.

## Not done (explicit)
- Driver contract §2b puppet (`pet-puppet.v1.js`: setExpression · playState · speak Testsatz) is **not** in the ToolBox yet. It belongs with emotes and Voice.
- Per-eye roll to compensate wandering around the head: noted for later (Georg).
- Cube Pets still without a Rigging tab (FACE-RIG-02).
- The clay lids are not yet wired into mountGraft/Studio v18.

## Next Gate
**FACE-VIS-01 · Georg looks at the clay lids (open · half · closed · skeptical · side) and the hair tufts on FB Ear Rig v5 in Rigging and answers one question: do the lids read as two rounded clay halves over the eyeball, not as a visor? Yes → Blender builds FB_FACEPARTS_v1.glb per brief v2. No → name the picture.**
