# CHANGELOG

## 2026-09-30 · r1
- face-mount.v1: `socketEyes`, `skinSignedDistance`, eyeFrame legacy patch, EYE_DEF `socket/turnL/turnR`, build wrapper order build → oval → socket | yaw, `rig.__kfbSkin` = real head skin.
- clay-lids.v1: mech `hinge` (`hingePositions`, `buildHingeGeometry`, `hingeOpts`, `hingeAngles`, `poseHinge`), 10 hinge sliders in META, MECHS + 'hinge'.
- contact-ao.v1: FACE class (nose, moustache, beard), params `face`, `faceReach`; face occluders no longer count as head group.
- Production-06: default `eye.socket = 'surface'`, Seat + per-eye turn controls, hinge note + acceptance button/results, AO face sliders, mouth receiveShadow off, `eyeSocketAcceptance()`.
- Docs: handover/RETURN_TOOLBOX_PRODUCTION_06.md section 30.09., github.md Last sync.

## Earlier in Production-06 (same working version, not cut before)
- body-surface.v2 + kfb-lib/clay/ (K2 clay-material.v10): family »Knete · K2«, clay on brows/nose/beard/ears, eyes/lids/mouth smooth.
- contact-ao.v1: baked contact occlusion head/neck, ear roots, nose base; Rebake button.
