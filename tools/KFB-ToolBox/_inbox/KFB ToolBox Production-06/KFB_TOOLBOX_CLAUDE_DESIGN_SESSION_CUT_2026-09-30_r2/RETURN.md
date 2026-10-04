# RETURN · KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r2

## Done this turn (Production-06, additive)
- **Lids, neutral alignment (Georg: "cannot align/rotate the new lids").** Cause: tilt 'level' only cancelled the oval tilt; the socket-frame roll of the eye stayed in. Now `clay-lids.v1.js` `_lvl()` measures the line through both eyes live and levels the lid line to it (hinge + slide). New param `roll` (°, ±45). `follow` unchanged. Shell (EyeRig) style untouched.
- **Mouth not dark.** `_mouthNoShadow` ran once at load; now re-applied when the rig/painted mouth mesh identity changes (`_applyLids` tick).
- **FB-MOUTH-FIT-01 §2–4** in `face-mount.v1.js`: `conformOriginalMouth()`. Painted mouth card (orig.mouth) is restored to its rest vertices, then every vertex is cast along the card normal onto a baked skin proxy (+4 mm). Hook = wrapped `orig.mouth.apply`. `mouth.conform` (default true; false = legacy), `mouth.edge` (alpha test 0…0.6). Status in `face.mouthConform`.
- **Standalone HTML** of Production-06 (super-inlined, 763 KB).
- **Handover docs** for the Blender MCP lane and WSA, onboarding for a fresh sprint.

## Not done / not verified
See TEST_REPORT.md. Mouth acceptance 1–7 (FB-MOUTH-FIT-01 §6) NOT_RUN; lid level/roll not measured, only implemented.
