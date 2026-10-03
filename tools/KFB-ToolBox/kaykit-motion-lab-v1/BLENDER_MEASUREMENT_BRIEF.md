# Blender MCP · Motion measurement handoff

## Purpose
Independently measure the exact KayKit Rig_Medium clips that feed the central KFB Animation/Motion SSOT.

Do not invent semantic roles from filenames. Measure source facts.

## Source
- repo: georg-doc/kayfabizarro
- asset source commit: 378b209355b13304e3cff656ec0806ca5b89df28
- actor: ActionFigure
- rig family: Rig_Medium
- animation root:
  media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/

## Measure
For every requested clip that actually exists:
- exact duration
- root/hip translation policy
- stride/reference-speed candidate
- foot contact phases/times
- planted intervals
- normalized foot slip
- takeoff/touchdown when relevant
- visible loop seam
- any clearly defensible playback-rate range; otherwise leave null
- source/Blender version and measurement method

Do not classify a clip as Walk/Jog/Run/Sprint purely from its filename.
Do not change source animation files.

## Output
Fill:
`BLENDER_MEASUREMENT_INTAKE.template.json`

against:
`BLENDER_MEASUREMENT_INTAKE.schema.json`

Unknown stays null / FAILED_MEASUREMENT or UNAVAILABLE.
No guessed numbers.

The Web/ToolBox lane will reconcile these values with the existing Three.js/KCL measurements before prototype tuning.
