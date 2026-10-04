# RETURN · 2026-09-30 · Production-06 · Eye socket + hinge lids + nose shadow

Brief: georg-doc/kayfabizarro @ georg-doc-patch-3 · skills/chat/workflows/FB_EYE_SOCKET_CLAY_LIDS_01_2026-09-30/START_HERE.md (+ MEASURE.json, renders, source/build.py).

## Delivered
- **§2.1 Socket frame** · `kfb-lib/face-mount.v1.js` `socketEyes()`, behind `eye.socket = 'surface' | 'legacy'`. S = hit on CharacterTemplate_Head (not the invisible facehost box) along the view axis · n = area-weighted normal within 1.2 R · hinge = up × n · oval tilt about n · C = S − n·R·(0.24 + inset·1.15). `splay` stays as extra offset. New `eye.turnL` / `eye.turnR` (° outward, per eye; Georg: every single eye must turn further out).
- **§2.2 Free pupils** · node `kfb-pupil-free` cancels the socket rotation; rest gaze = head forward, drift/track/saccades unchanged. Lids never move for the pupil.
- **§2.3–2.4 Hinge lids** · `kfb-lib/clay-lids.v1.js` `clayLids.mech = 'hinge'`: one hinge, two shells, corners shared by construction, gap/thickness × cos(ψ)^0.7, bead, lower gap +0.006 / thickness ×0.93 / bead ×0.8; blink/emotes move only θu/θl; slant rotates the pair about n. Receive shadow, cast none. All START_HERE start values are sliders.
- `eyeFrame()` keeps the legacy position → brows and nose do not move (acceptance 7).
- **Nose shadow** · `kfb-lib/contact-ao.v1.js`: nose/moustache are their own occluder class with `face` 0.15 and `faceReach` 0.3 (was: full head-group strength, reach 2 × 3.5 % height → big dark patch over mouth). Mouth meshes receive no shadow (P06 `_mouthNoShadow`).
- Legacy untouched: lib default `socket: 'legacy'`; P06 injects `'surface'` only for entries without the field.

## Measured (acceptance run 3, 04:21 UTC) · all PASS
Head normal L 28.8° out / 11.5° up, R 28.9° / 11.4° (Blender 28.9 / 11.4). Hinge L (−0.876, 0, −0.482), R (0.876, 0, −0.483) = MEASURE.json in three axes. Corners −0.09 … −0.10 R inside the head.

## Not done
- Painted mouth `FB_Mouth_Smile` sticks out past the cheek in ¾ view; its soft decal edge reads as a grey smudge (placement/texture, not shadow). alphaTest 0.25 probe removed most of it, a fringe stays (evidence/03). Not applied.
- brow.turn follow (29° ≈ 0.64) — Georg's call.
