# CQ-002 · Goth Girl · Demo / Performance Reference

**Track:** `CANONICAL`  
**Queue position:** 2  
**Status:** `READY FOR CLAUDE DESIGN / FRAME-LEVEL REVIEW`  
**Consumers after review:** Performance / ToolBox / Town candidate evidence only

## 1. Goal

Inspect `GothGirl.gif` for **actual performance staging, contact, scale, prop use, camera and look**.

Do not spend this job re-proving rig binding already covered by earlier Librarian/Birthday evidence.

Primary reference:

`GothGirl.gif`

Stable mirror root:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

## 2. Existing source facts

Physical source family:

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/`

Semantic grouping from the prior Atlas:

- Series 7
- Sep 2026

The governing preflight records:

- Rig_Medium;
- same-collection Microphone;
- Mic Stand;
- Speaker;
- Stool.

Exact source paths include:

- `assets/gltf/GothGirl_Microphone.gltf`
- `assets/gltf/GothGirl_MicStand.gltf`
- `assets/gltf/GothGirl_Speaker.gltf`
- `assets/gltf/GothGirl_Stool.gltf`

Local animation source includes:

- `Animations/gltf/Rig_Medium/Rig_Medium_General.glb`
- `Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb`

## 3. Prior tested evidence — reference only

The existing Atlas/Librarian evidence includes narrow successful binding/playback for GothGirl, including the documented `Death_A` 69/69-track preview case.

This remains:

`TESTED RESULT: specific Asset Librarian preview path`

It does **not** establish:

- all Rig_Medium clips work everywhere;
- microphone attachment works;
- stool seating works;
- Performance Suite acceptance.

Therefore visual-analysis budget should target what is still unknown.

## 4. Visual tasks

### A. Sequence segmentation

Identify distinct performance beats/actions in the GIF.

For each beat record:

- frame/time anchor;
- standing/seated/transition state;
- pose/action description;
- prop involvement;
- camera/framing;
- visual emphasis.

### B. Signature prop use

Check explicitly whether the GIF visibly uses:

- microphone;
- mic stand;
- speaker;
- stool.

For each:

- `visible = true/false/unresolved`;
- relation to actor;
- contact/adjacency;
- relative scale;
- source-match confidence.

Do not assume same-collection siblings appear in the GIF.

### C. Seating/contact

If seated:

- pelvis/stool relation;
- foot/ground relation;
- torso angle;
- stool height ratio;
- transition into/out of seat if visible.

This is visual evidence only, not a solved seating rig.

### D. Performance composition

Record:

- hero placement in frame;
- stage/floor/background if visible;
- prop spacing;
- negative space;
- audience/presentation orientation if inferable;
- whether the presentation reads as singer/presenter/general character showcase.

### E. Lighting/material/look

Extract only visible facts:

- key/fill direction;
- contrast;
- background treatment;
- any emission/glow;
- material highlights;
- color hierarchy.

## 5. Required outputs

1. `CQ-002_GOTH_GIRL_RETURN.md`
2. `CQ-002_GOTH_GIRL.visual-scene-recipe.json`
3. `CQ-002_SOURCE_MATCH_DELTA.md`

Use `kfb.scene-recipe.v0` with profile `visual-preflight`.

## 6. Required evidence table

| Frame/time | Performance beat | Prop | Contact/placement | Source match | Status | Confidence |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | exact/family/unresolved | OBSERVED_DEMO / INFERENCE | ... |

## 7. KFB proposal section — only after observation

May propose, separately:

- presenter candidate;
- singer/microphone candidate;
- seated-presenter candidate;
- Town stage/NPC performance candidate.

Every proposal must cite the observed relation it is based on.

## 8. Do not promote

Do not claim:

- stool seating is runtime-ready;
- microphone has a solved hand anchor;
- mic stand alignment is automatic;
- all local animations are accepted;
- source demo proves ToolBox compatibility.

## 9. Stop conditions

Stop if:

- GIF frames cannot actually be inspected;
- a prop cannot be distinguished reliably;
- exact clip names cannot be proven from the visual/source evidence;
- task starts modifying Animation Lab/ToolBox/runtime.

## 10. Acceptance criterion

The job succeeds when GothGirl's reference moves from “known actor with sibling props and tested binding evidence” to a **frame-anchored performance/staging reference** that later owners can deliberately reproduce and test.