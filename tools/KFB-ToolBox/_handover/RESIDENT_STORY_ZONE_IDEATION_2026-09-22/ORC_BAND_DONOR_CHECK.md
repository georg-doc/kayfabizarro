# Orc Band + Offica Doppeldenk · Donor / Capability Check

**Date:** 2026-09-23  
**Status:** SOURCE / CAPABILITY EVIDENCE · NO RUNTIME OR VISUAL ACCEPTANCE CLAIM

## Current source context

Primary user selection:

`tools/KFB-ToolBox/_inbox/KFB Style References/RESIDENTS + PROPS kfb-asset-handoff-animation-lab (9).json`

Handoff facts:

- schema: `kfb.asset-handoff.v1`;
- selection status: `candidate-only`;
- 211 candidates;
- receiving consumer in that handoff: Animation Lab;
- exact compatibility still belongs to receiving consumer.

Resident Atlas remains the stronger donor where it has already measured/assembled a scene recipe.

## Orc Band cast

### 1 · Legacy small Orc · candidate front/hype/auxiliary

Source:

`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf`

Facts:

- static Legacy character source itself has no Skin/Bones;
- current Resident Atlas assembles Legacy Orc parts onto the six-bone `Rig_Legacy` donor;
- current Atlas has already proven idle/walk motion across the assembled Legacy Orcs;
- Legacy attack clips exist, but current Atlas evidence records some weapon/head/ground conflicts during attack clips.

Use for first band proof:

- vocalist / hype Orc;
- body bounce / idle / walk;
- microphone or trumpet only after exact performance-pose proof.

Do not make Legacy instrumental mouth/hand alignment a blocker for the first trio read.

### 2 · Medium Orc · lead guitar candidate

Source:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb`

Handoff facts:

- skinned;
- 23 joints;
- `Rig_Medium`.

Electric guitar sources:

- `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/guitar_A.gltf`
- `media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/guitar_B.gltf`

Current Resident Atlas donor:

- Animatronic already has a measured, procedural two-hand guitar hold;
- guitar strum is procedural because the shared 119-clip library contains **no guitar-playing clip**;
- Animatronic uses `Holding_B` plus measured instrument placement, arm reach/CCD and a procedural strum loop;
- electric `guitar_A/B` are proven real source props and share the acoustic guitar's broad axis convention;
- current Atlas does **not** yet claim a finished held electric-guitar profile; exact neck/body grip measurements remain a visual/measurement gate.

Implication:

**Medium Orc electric guitar is a strong adapter-reuse candidate, not a finished donor pose.**

Preferred first visual choice may be `guitar_A` or `guitar_B`; keep this selectable until isolated source/hold proof.

### 3 · Large Orc Brute · war-drum anchor

Source:

`media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`

Handoff / Atlas facts:

- 23 joints;
- `Rig_Large`;
- exact current Atlas band-relevant props:
  - `Orc_Wardrum.gltf.glb`
  - `Orc_WardrumStick.gltf.glb`
- current Atlas scales the Medium Raider drum/stick donor by 2× for the Large Brute based on KayKit's own Medium/Large paired scale evidence;
- current Atlas explicitly states: **Rig_Large has no drum-strike clip**.

Implication:

Do not invent a "Drumming" clip.

Candidate solution for later proof:

- reuse the existing procedural instrument-motion idea;
- measure one drum-surface strike target;
- drive the stick arm between raised/strike poses;
- keep Combat/Locomotion ownership separate.

This procedural percussion adapter is **not yet proven on Rig_Large**.

## Instrument props

### War drum

Verified source:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/assets/gltf/Orc_Wardrum.gltf.glb`

### Drum stick

Verified source:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/assets/gltf/Orc_WardrumStick.gltf.glb`

### Electric guitars

Verified:

- `guitar_A.gltf`
- `guitar_B.gltf`

from KayKit Mixed Bag 1.

### Vocal microphone

Verified:

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf`

Cross-pack use is a Story/Scene decision, not an Atlas source claim.

### Trumpet

Verified source:

`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/gltf/ToySoldier_Trumpet.gltf`

Current Resident Atlas only proves the trumpet as a hand-attached Toy Soldier prop.

**No dedicated trumpet-playing / horn-to-mouth animation was found in the inspected shared motion evidence.**

Therefore:

- trumpet-on-Legacy-Orc = later adapter candidate;
- do not pretend it can be derived trivially from the current clips;
- likely needs a measured hand+mouth pose / procedural arm/prop alignment;
- first Ork Band proof should not depend on it.

## Toy Soldier / Offica Doppeldenk donor

Resident source:

`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/ToySoldier.glb`

Resident Atlas proves an authored **4.8 s gift-box reveal sequence** built from real source states:

- `Present_Base.gltf`
- `Present_UnwrappedBase.gltf`
- Toy Soldier body;
- rifle;
- trumpet.

Important:

This is an Atlas-authored reveal track, **not a source animation clip**.

The reveal uses anticipation → pop → overshoot → prop appearance → Idle.

That is the donor to reuse for Offica's spawn.

### Patrol motion

Toy Soldier is Rig_Medium.

Current motion sources prove:

- `Walking_A` / `Walking_B` / `Walking_C`;
- `Idle_A/B`;
- `Waving`;
- `Interact`;
- `Hit_A`;
- `Melee_Unarmed_Attack_Punch_A` and other Medium melee clips.

Therefore a patrol / social-enforcement loop has credible source motions.

Navigation/path execution remains host-owned.

### Rifle / trumpet

Real props:

- `ToySoldier_Rifle.gltf`
- `ToySoldier_Trumpet.gltf`

The first patrol proof should use the rifle as visual authority prop if needed.

Trumpet performance is not proven and is not required for Offica.

## Spatial audio donor

No dedicated WorldBuilder band-audio owner was proven in this check.

However KFB already contains a reusable WebAudio spatialization donor:

`skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/petstudio-v9/kfb-pinball-audio.js`

It provides:

- listener position/orientation;
- `PannerNode`;
- HRTF panning;
- inverse distance model;
- ref/max distance + rolloff;
- event sources at 3D positions;
- bus / zone concepts.

Its existing music path is non-positional.

For the Ork Band:

- do **not** create a second AudioContext if the receiving WorldBuilder/host already has audio;
- reuse the panner/spatial-source pattern;
- route one or more looping band stems through spatial sources;
- host/player camera updates the listener.

## Proposed audio stems

Later Georg/Suno files can be simple source files owned outside this recipe.

Suggested semantic stems:

- `band.drums`
- `band.guitar`
- `band.hype` / optional vocal
- optional short `band.argument-stinger`
- optional `band.resume-stinger`

Distance behavior should be data, not hardcoded dialogue logic.

Conceptual read:

- FAR: mostly drums / low detail;
- MID: guitar becomes legible;
- NEAR: full jam + chatter/reactions.

Exact distances must be tuned in the receiving world's scale.

## Current blockers vs non-blockers

### Source-green

- three Orc generations exist;
- Medium Orc is Rig_Medium;
- Brute is Rig_Large;
- Legacy Orc assembly donor exists;
- war drum + stick exist;
- two electric guitars exist;
- microphone exists;
- Toy Soldier trumpet/rifle exist;
- Toy Soldier reveal donor exists;
- Medium walk/patrol clips exist;
- existing spatial-audio panner donor exists.

### Needs isolated proof

- electric guitar held/played on Orc Raider;
- procedural drum strike on Rig_Large;
- trumpet or microphone performance pose on Legacy Orc;
- multi-rig coordinated jam timing;
- spatial loop/stem integration in the eventual WorldBuilder host;
- transition from scenic loop into Combat owner and back.

### Explicitly not a blocker for first trio read

- trumpet playing;
- full multi-rig combat choreography;
- random spawn probability tuning;
- final Suno track;
- audience NPCs;
- Fishing set.

## Result

**DONOR SET STRONG ENOUGH FOR A BOUNDED ORK-BAND PREP BRIEF.**

Not yet a runtime/visual PASS.
