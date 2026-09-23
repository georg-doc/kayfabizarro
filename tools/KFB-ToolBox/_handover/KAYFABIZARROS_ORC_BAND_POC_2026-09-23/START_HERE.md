# The KayfaBizarros · Orc Band Beat POC · 2026-09-23

Status: **FRESH-CHAT HANDOFF · HTML-FIRST POC · NO NEW RUNTIME OWNER**

## Product intent recovered from prior ideation

"The KayfaBizarros" are a cartoon Orc street-band / mariachi-ish comic-relief Resident scene.

Current recovered direction:
- Orc band performance, not combat-first;
- visible War Drum;
- guitar / microphone / singer can join after the beat POC;
- playful impro / occasional argument or interruption later;
- band can later appear as a roaming/world Resident event;
- Tourbus remains a broader meta/roadtrip idea, but is not required for the first music POC.

Current update from Georg:
**prove an Orc drummer / bandleader moving visibly in time with the music, with actual band scenery.**

## First POC · keep it small

Signature track:
`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`

Current Git blob:
`368eb5ae8fafcfba1cce3ba3f80488378fe056b0`

### Bandleader

Exact first character:
`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf`

Resident Atlas source revision:
`10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

Human intent:
the black-ponytail Orc B reads as the bouncing bandleader.

Beat presentation:
- small vertical bounce;
- squash/stretch;
- optional body lean;
- deterministic from shared beat clock;
- no new movement/gameplay owner.

### Drummer

Use the existing Orc Brute / Orc Raider source-backed drum setup.

Current measured Resident Atlas sources:
- Orc Brute · Rig_Large;
- `Orc_Wardrum.gltf.glb`;
- `Orc_WardrumStick.gltf.glb`.

Orc Raider asset revision:
`891eadf01e218f5fc21387e64cea1fec8332c5b6`

Resident Atlas already proves:
- Wardrum source identity;
- drumstick source identity;
- Orc Raider props scale to Large with the source-backed factor 2;
- Orc Brute loadout / placement history.

Do not rebuild those props.

### Scenery

Reuse one existing source-backed scene grammar.

Preferred first donor:
the proven **Orc-Warband camp** from Legacy Web Pet PR #157 tested runtime
`f41c59a8178bf77266c0f776f2e20a7948ee6223`.

Alternative/additive Resident Atlas scenery may use:
- Orc banner;
- open stone/camp arrangement;
- existing Campfire source where compositionally useful.

Do not invent a generic concert stage before the street/camp POC works.

## Beat clock · minimal seam

Do not build beat-detection AI.

First proof uses one explicit shared music clock:

`audio currentTime → beatIndex / beatPhase`

Scene metadata may provide:
- `bpm`;
- `phaseOffset`;
- optional `beatsPerBar`.

All performers consume the same beat state.

If exact BPM/phase is not yet source-backed:
provide two compact tuning controls in the HTML review and persist the accepted values.

Do not make BPM calibration a blocking research project.

### First motion mapping

- bandleader bounce: every beat or accepted subdivision;
- squash/stretch: short attack/release around beat;
- drumstick: bounded local swing on selected beats;
- drum/body may receive a subtle hit impulse;
- scenery does not pulse globally by default.

No new skeletal retarget system in POC 1.

## Source-object-first order

Before the composed scene:

1. Orc B alone;
2. Orc Brute / drummer source alone;
3. Wardrum + stick alone;
4. scenery donor alone;
5. signature audio starts only after user gesture;
6. composed band scene.

Use `skills/session-entry-use-what-works_v1.md`.

A loaded URL is not proof that the intended source object was used.

## HTML-first review

Normal review artifact:
`KAYFABIZARROS_BAND_POC_REVIEW.html`

No Cloudflare during iteration.

The HTML should let Georg:
- Play / Pause;
- restart at bar/beat 1;
- adjust BPM and phase offset if still unconfirmed;
- toggle Bandleader / Drummer / Scenery;
- orbit the scene;
- see the source/revision marker.

## Current Tourbus decision

Do not use the old Armored Truck as current Tourbus canon.

Current GitHub decision:
`media/3D_Assets/Frankensteining/KFB Truck/` WaterBowser supersedes the Armored Truck as Tourbus model selection.

WaterBowser is not yet a browser-ready Tourbus and does not block this POC.

The old Armored Truck remains a historical vehicle/deformer donor only.

## Later, after the beat POC passes

Possible next additions:
- guitarist;
- microphone/singer;
- more Orc family members;
- impro/argument interruption;
- stop/resume performance;
- spatial audio;
- roaming Resident encounter;
- Tourbus arrival/departure;
- card/reward/story hooks.

None of these blocks POC 1.

## Done when

Georg opens one HTML and can see:

- the exact Orc B bandleader;
- a real Orc drummer/wardrum fixture;
- both visibly responding to one shared beat clock;
- a coherent source-backed street/camp band scene;
- the signature track playing;
- no need for Cloudflare or Work.

Exactly one next gate:
**ORB-P1 · bandleader + drummer + scenery + shared-beat HTML proof.**
