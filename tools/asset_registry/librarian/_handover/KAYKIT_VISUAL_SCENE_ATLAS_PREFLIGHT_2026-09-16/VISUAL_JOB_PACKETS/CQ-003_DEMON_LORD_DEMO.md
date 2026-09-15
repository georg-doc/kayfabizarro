# CQ-003 · Demon Lord · Demo / Staging Reference

**Track:** `CANONICAL`  
**Queue position:** 3  
**Status:** `READY FOR CLAUDE DESIGN / FRAME-LEVEL REVIEW`  
**Consumers after review:** Combat / Performance / ToolBox candidate evidence only

## 1. Goal

Inspect `July2026_DemonLord.gif` and extract the actual **large-character staging, pose/action vocabulary, sibling-prop relation, FX/material cues and camera presentation**.

Primary reference:

`July2026_DemonLord.gif`

Stable mirror root:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

## 2. Existing source facts

Physical source family:

`media/3D_Assets/KayKit_Mystery_Series6/DemonLord/`

Semantic grouping from the prior Atlas:

- Series 7
- Jul 2026

The governing preflight records:

- Rig_Large;
- sibling DemonHeart;
- sibling SummoningCircle.

Exact source paths:

- `media/3D_Assets/KayKit_Mystery_Series6/DemonLord/assets/gltf/DemonHeart.gltf`
- `media/3D_Assets/KayKit_Mystery_Series6/DemonLord/assets/gltf/SummoningCircle.gltf`

Character source includes DemonLord and DemonLord_Alternative GLB/GLTF variants.

## 3. Visual tasks

### A. Sequence segmentation

Identify distinct beats/actions in the GIF.

For each beat record:

- frame/time anchor;
- pose/action;
- stance/ground relation;
- prop/FX involvement;
- camera/framing;
- whether the action is locomotion, combat, summon, idle/presentation, or unresolved.

Do not assign an animation clip name unless source evidence proves it.

### B. Large-character scale

Record relative visual scale using ratios where possible:

- actor height / frame height;
- actor width / frame width;
- prop diameter / actor height;
- ground/summoning-circle width / actor stance width if visible.

Do not turn those visual ratios into KFB world meters without calibration.

### C. Demon Heart

If visible:

- position relative to actor;
- held / floating / placed / unresolved;
- approximate scale;
- visible material/FX;
- whether relation persists across frames.

If not visible, record `visible = false/unresolved`; do not include it because the source sibling exists.

### D. Summoning Circle

If visible:

- ground relation;
- actor centering/offset;
- scale ratio;
- rotation/perspective appearance;
- emission/glow/FX if actually visible;
- whether it appears persistent or event-driven.

Do not infer runtime shader/FX behavior from appearance.

### E. Pose / silhouette

Extract:

- torso/head orientation;
- arm spread / asymmetry;
- stance width;
- center-of-mass impression;
- silhouette changes during the sequence;
- any large-rig-specific staging need visible in the demo.

### F. Camera / presentation

Record:

- view height/class;
- framing;
- camera motion if present;
- whether camera compensates for large body size;
- background/floor treatment.

## 4. Source-match rules

Exact sibling paths are source facts. Their **presence in the GIF must still be visually confirmed**.

Return per object:

- `exact` — visible object confidently matches exact source;
- `family-only` — relation to family is clear but exact variant uncertain;
- `unresolved` — visual identity cannot be proven.

## 5. Required outputs

1. `CQ-003_DEMON_LORD_RETURN.md`
2. `CQ-003_DEMON_LORD.visual-scene-recipe.json`
3. `CQ-003_SOURCE_MATCH_DELTA.md`

Use `kfb.scene-recipe.v0` with profile `visual-preflight`.

## 6. Required evidence table

| Frame/time | Actor action | DemonHeart | SummoningCircle | FX/material | Camera | Status/confidence |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... |

## 7. KFB proposal section — only after observation

Potential receiving uses may include:

- Combat large-character/boss presentation;
- summon/ritual scene candidate;
- Performance large-character staging;
- ToolBox candidate relation between actor and sibling props.

Do not recommend any use unless the observation supports it.

## 8. Do not promote

Do not claim:

- Rig_Large compatibility beyond existing source/test evidence;
- automatic DemonHeart attachment;
- working SummoningCircle FX;
- collision/ground fit;
- combat behavior;
- generic large-character retargeting.

## 9. Stop conditions

Stop and return `UNRESOLVED` if:

- GIF frames cannot be inspected;
- prop identity is occluded/ambiguous;
- FX cannot be separated from baked/source presentation;
- transform precision exceeds visual evidence;
- task drifts into combat or ToolBox implementation.

## 10. Acceptance criterion

The job succeeds when Demon Lord has a **frame-anchored large-character scene/performance reference** with exact source provenance for any confirmed sibling props and explicit limits for everything not measured in KFB.