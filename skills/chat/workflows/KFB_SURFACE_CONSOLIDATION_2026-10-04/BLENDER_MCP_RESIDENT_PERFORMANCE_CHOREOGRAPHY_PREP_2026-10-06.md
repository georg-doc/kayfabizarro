# Blender MCP · Resident Performance + Choreography Prep · 2026-10-06

Status: **PREP · NO OPEN-WORLD RUNTIME WRITES**
Executor: **Blender MCP**
Owner: **Resident Performance / Motion prep**
Receiving product later: **KFB Open World / Resident Life**
Current Open World writer: **Claude Coworker · protected**

## Outcome

Build a reusable 3D performance/choreography reference layer for Residents from existing real rigs, motions, props and Fluff work motions.

This is not a new Resident runtime and not a request for a large animation batch.

## Read first

GitHub truth:
- Resident Atlas Return:
  `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`
- Resident recipes:
  `tools/resident_atlas_s6/data/cast.js`
- EyeRig v6:
  `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
- PetMouth:
  `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v3/pet-mouth.v1.js`
- Fluff Work Motion Pack PR #356:
  current observed head `9124366b88e5e317cbba8480412a8b90f84c9d5d`
- ChatterBox planning packet PR #357:
  current branch head `886b8e58135553633dda13d0643dc5844078cb35`
  with Site-only correction parent `fc6ad9c76adc22fed8d2876e1ad5a4e8ec742e63`
- Resident architecture prep:
  `RESIDENT_LIFE_ARCHITECTURE_PREP_2026-10-06.md`

## Protected boundaries

- no Open World runtime edits;
- no second dialogue engine;
- no second EyeRig or mouth system;
- do not bake runtime eye/mouth logic into body clips;
- no PNG/cutout Resident substitutes;
- no unverified asset substitutions;
- no bulk animation production before gap proof.

## Existing channels to preserve

Runtime face owners:
- EyeRig v6 → eyes/lids/gaze/blink/life/emote;
- public `eyeFrame()` → brow/nose attachments;
- PetMouth → rest expression + visemes + speaking;
- ChatterBox → semantic speech/content route.

Blender body performance must therefore focus on:
- posture;
- head/torso orientation where body motion is appropriate;
- shoulders/arms/hands;
- prop interaction;
- spatial staging/blocking;
- reusable gesture/action clips or additive layers.

## Initial Affect vocabulary

Prepare readable body-language mappings for:
- calm / neutral;
- curious;
- attentive;
- joyful / pleased;
- amused;
- grateful / affectionate;
- proud;
- surprised;
- worried / anxious;
- sad / disappointed;
- annoyed;
- angry;
- embarrassed;
- suspicious;
- tired / bored.

Each mapping should state:
- existing clip or layered donor;
- body/gesture cue;
- head/torso cue;
- compatible EyeRig/Brow/PetMouth semantic state;
- transition/hold guidance;
- whether a new clip is actually required.

## Encounter choreography

Build small reusable beat studies for:

### Greeting
approach → notice → orient → acknowledge → short reaction → resume.

### Gift
approach → offer → receive → inspect → emotion reaction → thanks/acknowledge → depart/resume.

### Trade
orient → show item → offer/request → exchange → inspect → pleased/doubt reaction → resume.

### Fluff exchange
carry/roll → stop → offer/share → transfer/push/carry → reaction → continue.

### Farmer
home/work start → walk → Fluff source → harvest → gather → carry/roll/push → deposit/market/build target → social interruption → resume.

### Repair/Rebuild
inspect damage → fetch/receive Fluff → carry/roll → knead/place/patch → inspect result → relief/pride/celebrate → seek next task.

## Motion audit

Return one matrix:
- `COVERED`
- `LAYERABLE`
- `NEW_CLIP_REQUIRED`

for:
listening, speaking accent, nod, shake, shrug, point, give, receive, trade, carry, roll/push, knead, place, flatten, patch, inspect, celebrate, worry, surprise, laugh, disagreement, gratitude, suspicion.

Prefer:
- existing KayKit clips;
- Atlas layering;
- additive deltas;
- PR #356 Fluff work clips;
- measured prop/hand-slot logic.

## Deliverables

1. source-isolated donor proof;
2. motion coverage matrix;
3. initial Affect→Body Performance mapping;
4. 5–6 short choreography studies above;
5. exact list of new clips, if any, with why layering cannot solve them;
6. exportable notes/identifiers consumable by Web Chat and later Work/WSA.

## Done when

We can hand the post-Coworker Architecture Freeze a concrete 3D performance vocabulary without guessing which animations, props or staging already exist.

No merge. No Open World runtime write. No Site publication.
