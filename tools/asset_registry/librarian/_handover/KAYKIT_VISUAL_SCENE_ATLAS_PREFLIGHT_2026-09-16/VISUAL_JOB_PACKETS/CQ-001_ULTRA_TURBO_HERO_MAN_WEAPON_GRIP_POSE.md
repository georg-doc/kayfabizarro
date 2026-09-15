# CQ-001 · Ultra Turbo Hero Man · Weapon / Grip / Pose

**Track:** `CANONICAL`  
**Queue position:** 1  
**Status:** `READY FOR CLAUDE DESIGN / FRAME-LEVEL REVIEW`  
**Consumers after review:** ToolBox / Combat / Performance candidate evidence only

## 1. Goal

Inspect the official/reference weapon demo and extract the exact **visible weapon / hand / pose / camera relation** without promoting it to generic KFB compatibility.

Primary reference:

`Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`

Related contents reference:

`BLASTER+GUN SETTING - contents (5).png`

Stable mirror root:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

## 2. Existing source facts

Semantic grouping from the prior Atlas:

- Series 7
- Aug 2026

Physical source family currently lives under the historical parent:

`media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/`

Known same-collection source assets include:

- `assets/gltf/UltraTurboHeroMan_Blaster.gltf`
- `assets/gltf/UltraTurboHeroMan_Sword.gltf`
- `assets/gltf/UltraTurboHeroMan_Sword_Double.gltf`
- `assets/gltf/UltraTurboHeroMan_Throwingdisc.gltf`
- `assets/gltf/UltraTurboHeroMan_Cell.gltf`

Character variants include source GLB/GLTF forms for UltraTurboHeroMan and maskless/shiny variants.

The governing preflight records `Rig_Medium` as a source fact.

## 3. Naming discrepancy — preserve literally

Reference filename:

`UltraHeroTurboMan`

Source tree:

`UltraTurboHeroMan`

Do not silently normalize this difference. Return it as a provenance note unless a source page explicitly resolves the naming.

## 4. Visual tasks

For each distinct action/pose in the GIF:

### A. Frame anchors

Choose representative frame/time anchors for:

- neutral/entry pose if present;
- weapon presentation;
- aim/attack pose if present;
- transition/recovery if present.

### B. Hand/grip evidence

Record only what is visible:

- right / left / both hands;
- approximate contact point on the blaster;
- wrist/forearm orientation;
- one-hand/two-hand support;
- whether fingers are modeled/visible enough to support a stronger claim.

### C. Prop orientation

Record:

- barrel direction relative to actor forward;
- local-looking roll/pitch/yaw as a visual inference only;
- prop scale relative to hand/forearm/torso;
- visible pivot/contact region.

Do not convert the visual relation directly into a KFB attachment transform.

### D. Pose/body relation

Capture:

- torso twist;
- shoulder/elbow relation;
- stance width;
- head/gaze direction;
- center-of-mass shift;
- whether the weapon pose appears authored for this specific actor.

### E. Camera/presentation

Record:

- framing;
- view angle;
- whether camera follows/rotates;
- whether the demo is presentation-only or plausibly gameplay-like.

## 5. Source asset matching

Primary exact candidate:

`media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf`

Return:

- `exact` only if the visible demo prop confidently matches;
- otherwise `family-only` and explain why.

Do not assume the `BLASTER+GUN SETTING` contents image and GIF use the same exact model without visual corroboration.

## 6. Required outputs

1. `CQ-001_ULTRA_TURBO_HERO_MAN_RETURN.md`
2. `CQ-001_ULTRA_TURBO_HERO_MAN.visual-scene-recipe.json`
3. `CQ-001_SOURCE_MATCH_DELTA.md`

Use `kfb.scene-recipe.v0` with profile `visual-preflight`.

## 7. Required evidence table

| Frame/time | Hand relation | Prop orientation | Actor pose | Source asset match | Status | Confidence |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | exact/family/unresolved | OBSERVED_DEMO / INFERENCE | ... |

## 8. Do not promote

Do not claim:

- `blaster compatible with Rig_Medium`;
- generic weapon socket exists;
- this transform works on other characters;
- KFB Combat can use it without calibration;
- animation retargeting is proven.

Those require ToolBox/consumer measurement.

## 9. Stop conditions

Stop and return `UNRESOLVED` if:

- animated frames cannot actually be inspected;
- weapon identity is visually ambiguous;
- hand contact is occluded;
- transform precision would exceed what the reference supports;
- task drifts into implementing an attachment system.

## 10. Acceptance criterion

The job succeeds when the source demo has been converted into a **frame-anchored visual grip/pose reference with exact provenance**, ready for later ToolBox/consumer measurement without claiming that measurement already happened.