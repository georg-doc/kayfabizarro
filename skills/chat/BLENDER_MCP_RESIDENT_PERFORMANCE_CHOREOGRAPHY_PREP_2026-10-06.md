# KFB · Blender MCP Resident Performance + Choreography Prep · 2026-10-06

Status: **CURRENT PREP · NO OPEN-WORLD RUNTIME WRITES**
Execution mode: **BOUNDED_SLICE**
Executor: **Blender MCP**
Owner: **KFB Resident Performance / Motion Prep**
Repo: `georg-doc/kayfabizarro`
Branch for this briefing: **main**
Receiving product later: **KFB Open World / WB2 · Issue #360 / PR #348**

## 0 · Read this first

This file is intentionally self-contained and lives on **main** so a fresh Claude/Blender job does not need to discover another planning branch first.

Before acting, read:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. **this file**

GitHub state overrides chat memory.

## 1 · Protected current production state

The Open World is currently owned by a running **Claude Coworker** integration job.

Therefore this slice must:
- **not edit the Open World runtime**;
- not edit PR #348 production code;
- not create a parallel world/player/dialogue runtime;
- not start a Site publication;
- not merge or promote Live.

This job is preparation for the later post-Coworker Architecture Freeze.

## 2 · Outcome

Prepare a **reusable 3D Resident performance/choreography vocabulary** from the real KFB/KayKit rigs, motions, props and existing Fluff work.

The result should tell the later integrator:

- what emotional/reaction body language already exists;
- what can be built by layering/additive motion;
- which gestures/activities are already covered;
- which genuinely reusable clips are missing;
- how encounter, trade, gift, Fluff and repair/rebuild choreography should stage in 3D.

This is **not** a request for a large new animation batch.

## 3 · Existing source owners and donors

### Resident Atlas · main

Current main paths:

- `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`
- `tools/resident_atlas_s6/data/cast.js`

Current known state:
- **21 Residents**;
- Rig_Medium / Rig_Large / Rig_Legacy;
- data-driven Resident recipes;
- real props/habitats/activity staging;
- proven layered clips;
- measured hand-slot/prop attachment methods;
- additive motion work already exists.

Use the real Residents and source-proven props.
No PNG/cutout replacement.

### EyeRig v6 · main

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

This remains the runtime eye owner.

Already supports:
- asymmetric lids;
- gaze / point-to;
- blink;
- emotes;
- life/wander/tremor;
- kinetics;
- public `eyeFrame()` anchor for brows/nose.

Do not bake eye behavior into Blender body clips.

### PetMouth · main

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v3/pet-mouth.v1.js`

This remains the mouth owner.

Already supports:
- multiple mouth sets;
- rest expressions;
- named viseme layer;
- talk/rest channels;
- surface-fit/wrap behavior.

Do not create a second mouth/lip-sync system.

### Fluff Work Motion Pack · PR #356

PR:
`https://github.com/georg-doc/kayfabizarro/pull/356`

Current observed head:
`9124366b88e5e317cbba8480412a8b90f84c9d5d`

Current donor truth:
- Rig_Medium **17 clips**;
- Rig_Large **13 clips**;
- push/steer;
- growing-ball variants;
- 2/3-worker Large-ball push;
- ball surf/balance/dance/foot-roll;
- contact-event reuse;
- 6→1 merge reference;
- prior verdict: **NEW CLIP REQUIRED: none** for that motion slice.

Exactly why this job must audit/reuse before creating anything new.

### ChatterBox planning packet · PR #357

PR:
`https://github.com/georg-doc/kayfabizarro/pull/357`

Current branch:
`planning/chatterbox-triplet-curator-site-2026-10-04`

Current branch/PR head:
`886b8e58135553633dda13d0643dc5844078cb35`

Important parent correction:
`fc6ad9c76adc22fed8d2876e1ad5a4e8ec742e63`

Evidence already present:
- planning / Site-readiness: **34/34 PASS**;
- GPT-Site-only surface correction: **12/12 PASS**.

ChatterBox already defines a Reaction/Choreography Lab concept.
Do **not** create a second dialogue/choreography authoring product.

Current routing:
- packet = useful donor;
- Site itself = **not built**;
- later `886b8e…` hold commit currently keeps Site implementation behind current issue gates.

For this Blender slice, consume only the semantic reaction/choreography needs.
Do not build the ChatterBox Site.

## 4 · Ownership boundary

Blender MCP is primary for **real 3D body performance and choreography**:

- emotional body language;
- listening vs speaking posture;
- head/torso/hand reaction cues where they belong to body motion;
- Resident↔Resident staging/blocking;
- gift/trade/Fluff handoffs;
- Farmer work choreography;
- repair/rebuild choreography;
- prop carry / roll / push / knead / place / flatten / patch;
- reusable gesture/action clips or additive layers.

Blender MCP is **not** owner of:
- dialogue semantics;
- Triplet generation;
- EyeRig;
- PetMouth;
- speech/thought bubble UI;
- Audio mixer;
- Open World scheduling;
- pathfinding;
- Resident memory;
- emotion state storage.

## 5 · Required source-first method

For every motion or choreography family:

1. show/inspect the real source Resident/rig/prop in isolation;
2. identify exact source path and rig class;
3. inventory existing clips and current layered/additive solutions;
4. test whether the behavior is already `COVERED`;
5. if not, test whether it is `LAYERABLE`;
6. only classify `NEW_CLIP_REQUIRED` if reusable layering/additive motion cannot safely solve it.

A loaded asset URL is not proof that the actual donor design was used.

## 6 · Initial Affect vocabulary

Prepare readable 3D body-language mappings for:

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

For each state record:

- existing clip / layered donor;
- posture/body cue;
- head/torso cue;
- hands/gesture cue;
- compatible EyeRig semantic cue;
- compatible brow cue if available;
- compatible PetMouth rest/viseme cue;
- transition-in;
- hold behavior;
- transition-out;
- `COVERED / LAYERABLE / NEW_CLIP_REQUIRED`.

The body layer must remain compatible with runtime facial channels.


## 6A · Pose / proximity / micro-motion · REQUIRED

Treat **Pose** as a first-class channel separate from Gesture.

Pose provides distance-readable emotion and social intent before the viewer can read facial detail.

Audit/prepare reusable:
- open vs closed stance;
- attentive stance;
- proud stance;
- tired stance;
- worried/guarded stance;
- suspicious stance;
- lean forward/back;
- side lean;
- head tilt/cock;
- small recoil;
- step-in / step-out;
- orientation toward/away from partner;
- settle/recovery.

Prefer:
- existing stance/idle clips;
- additive torso/head/shoulder offsets;
- foot-safe layering;
- relational spacing changes through a future encounter/navigation seam.

Do not solve each emotion with a bespoke clip.

Required distinction:
- **Pose** = sustained readable whole-body attitude;
- **Gesture** = short semantic accent;
- **Micro-motion** = small additive lean/tilt/recoil/settle;
- **Proximity** = spatial relationship to partner/object.

Distance-readability is an explicit acceptance criterion.

## 7 · Encounter choreography studies

Build small reusable beat studies, not bespoke scripted scenes.

### Greeting
`approach → notice → orient → acknowledge → short reaction → resume`

### Gift
`approach → offer → receive → inspect → emotion reaction → acknowledge/thanks → depart/resume`

### Trade
`orient → show item → offer/request → exchange → inspect → pleased/doubt reaction → resume`

### Fluff exchange
`carry/roll → stop → offer/share → transfer/push/carry → reaction → continue`

### Farmer / daily work
`home/work start → walk → Fluff source → harvest → gather → carry/roll/push → deposit/market/build target → possible social interruption → resume`

### Repair / rebuild
`inspect damage → fetch/receive Fluff → carry/roll → knead/place/flatten/patch → inspect result → relief/pride/celebrate → seek next task`

These are semantic choreography grammars.
Do not hard-code dialogue wording.

## 8 · Motion coverage matrix

Return one matrix for at least:

- listening;
- speaking accent;
- nod;
- shake;
- shrug;
- point;
- give;
- receive;
- trade;
- carry;
- roll/push;
- knead;
- place;
- flatten;
- patch;
- inspect;
- celebrate;
- worry;
- surprise;
- laugh/amusement;
- disagreement;
- gratitude;
- suspicion.

Allowed states:
- `COVERED`
- `LAYERABLE`
- `NEW_CLIP_REQUIRED`

For every `NEW_CLIP_REQUIRED` entry, state exactly:
- why existing clips fail;
- why additive/layered motion cannot solve it;
- which rig families need the new clip;
- whether one reusable clip can cover multiple emotions/beats.

## 9 · Clay / Fluff construction relevance

This prep should also test whether the existing work-motion vocabulary can support the planned visible construction grammar:

`Fluff balls → merge/knead → rough mass → place/stack → press/flatten → patch/sculpt → source-proven final prop/building`

Useful current donor actions include:
- collect;
- carry;
- roll/push;
- knead/press;
- place;
- flatten;
- patch;
- team push;
- give/receive;
- merge.

Do not generate a castle animation set now.

Prove the reusable motion grammar first.
A later runtime consumer can use it for:
- furniture;
- props;
- buildings;
- repair/rebuild after destruction.

## 10 · Face / body arbitration rule

Do not create clips that compete unnecessarily with runtime face owners.

Recommended separation:

- Body Motion → locomotion, posture, torso, shoulders, arms, hands, props.
- EyeRig → gaze, blink, lids, eye emotion/life.
- Brows → via the public EyeRig face anchor where supported.
- PetMouth → rest expression + visemes/speech.
- ChatterBox → semantic speech/reaction tags.
- later Resident Performance Composer → arbitration/composition.

If a head turn is necessary for staging, keep it compatible with runtime gaze rather than replacing it.

## 11 · Deliverables

Return a compact evidence packet:

1. **SOURCE_ISOLATION.md**
   - exact Residents/rigs/props shown and used.

2. **MOTION_COVERAGE_MATRIX.md**
   - `COVERED / LAYERABLE / NEW_CLIP_REQUIRED`.

3. **AFFECT_BODY_MAPPING.md**
   - emotion → body/head/hands + compatible face cues.

4. **CHOREOGRAPHY_BEATS.md**
   - greeting, gift, trade, Fluff, Farmer, repair/rebuild.

5. **PREVIEWS**
   - small contact sheet and/or short 3D previews from the real Residents.
   - No generic placeholder actors.

6. **RETURN.md**
   - exact source refs;
   - what was reused;
   - what was newly authored, if anything;
   - actual tests;
   - unresolved items;
   - one next gate.

If any new Blender assets/clips are authored, keep them in one clearly named prep owner and make them rollback-safe.

## 12 · Token / effort firewall

- Do not recursively inspect unrelated project history.
- Use the exact paths and PR heads above first.
- Do not reopen already-proven attachment/rig questions without new evidence.
- No large speculative animation batch.
- No Open World browser QA.
- No ChatterBox Site implementation.
- No Hub/Cloudflare/Site work.
- If two non-improving passes hit the same motion seam, preserve it and mark it `UNRESOLVED`; continue the rest of the matrix.

## 13 · Done when

The post-Coworker Architecture Freeze can answer, without guessing:

- which Resident emotional/body behaviors already exist;
- which can be layered;
- which genuinely need new Blender clips;
- how the first social/work encounters stage in 3D;
- how the performance layer can compose with EyeRig/PetMouth/ChatterBox rather than replace them.

## 14 · Exactly one next gate

**Return this Blender MCP prep packet. Do not integrate it into the Open World.**

The next runtime step occurs only after:
**Coworker Open World exact RETURN → Work/WSA Architecture Freeze → explicit Resident integration slice.**
