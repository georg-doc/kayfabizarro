# Orc Band World-Life PoC · WorldBuilder / Claude Design preparation

**Date:** 2026-09-23  
**Status:** PREPARED INPUT · NOT YET EXECUTABLE CLAUDE GATE  
**Concept owner:** Resident Story Zones / ToolBox composition  
**Receiving owner:** existing WorldBuilder / World host after its current preflight gates  
**No new runtime owner.**

## 0 · Hard prerequisite from current WorldBuilder SSOT

Current:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md`

states:

- WB1-P0 Source/Reuse/License preflight first;
- WB1-P1 Environment Profile proof;
- WB1-P2 Surface Adapter proof;
- only then WB1-P3 creates `CLAUDE_DESIGN_INPUT.md`;
- Claude Design authoring begins after those proofs.

Therefore this Orc Band brief is prepared now to reduce later Claude tokens, but:

> **Do not hand this to Claude Design as a build order until WB1-P0–P2 are green.**

It is an additive future fixture/input for the proven WorldBuilder.

## 1 · Outcome

Prove one compact **World-Life Scene** that feels as if KFB keeps living without the player.

Scene:

**Orc Band · Funky War Jam**

Three Orc generations perform an impro/funk/jazz-flavoured street-band loop.

A bureaucratic Toy Soldier resident, **Offica Doppeldenk**, can later spawn from a present, patrol the area, interrupt the band over absurd permit/noise/order violations, provoke a comic conflict and leave grumbling while the band resumes.

This scene is:

- comic relief;
- world ambience;
- a multi-Resident activity proof;
- a spatial-audio navigation proof;
- a reusable interruption/resume proof.

It is **not** a quest, concert game, Combat rewrite or autonomous-NPC framework.

## 2 · Exact donor cast

### A · Large Orc Brute · War Drum

Actor:

`media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`

Rig:

`Rig_Large`

Props:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/assets/gltf/Orc_Wardrum.gltf.glb`

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/assets/gltf/Orc_WardrumStick.gltf.glb`

Resident Atlas already uses both on the Large Orc with the documented 2× profile.

**Known limitation:** no Rig_Large drum clip exists.

Do not invent `Drumming`.

Performance must either:

1. use an explicitly authored/procedural strike adapter; or
2. remain a convincing ready/groove pose in the earliest visual gate.

### B · Medium Orc Raider · Electric Guitar

Actor:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb`

Rig:

`Rig_Medium`

Electric guitar candidates:

`media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/guitar_A.gltf`

`media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/guitar_B.gltf`

Preferred donor mechanism:

Resident Atlas Animatronic measured guitar placement + arm reach/CCD + procedural strum.

**Known limitation:** electric guitar exact grip/body profile is not yet visually proven on Orc Raider.

Do not use the acoustic-guitar measurements blindly.

### C · Legacy small Orc · Front/Hype

Actor:

`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf`

Assembly:

current Resident Atlas Rig_Legacy donor.

First-proof role:

- hype/front Orc;
- groove/body bounce;
- simple gestural performance.

Optional later props:

Microphone:

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf`

Trumpet:

`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/gltf/ToySoldier_Trumpet.gltf`

**Do not block the first band proof on microphone-at-mouth or trumpet-at-mouth animation.**

No dedicated trumpet-playing clip is currently proven.

## 3 · Donor-first visual proof order

Claude / any implementer must not begin with the full scene.

### OB-P0 · Source objects in isolation

Show individually:

1. Legacy Orc A;
2. Orc Raider;
3. Orc Brute;
4. war drum;
5. drum stick;
6. guitar A;
7. guitar B;
8. optional microphone;
9. Toy Soldier;
10. closed present;
11. unwrapped present;
12. rifle;
13. trumpet.

Acceptance:

- exact source;
- readable scale;
- no replacements;
- no generic placeholder instruments;
- no rebranding.

Only then integrate.

### OB-P1 · Static trio composition

One local scene root.

Required:

- Large Orc + war drum;
- Medium Orc + one selected electric guitar;
- Legacy Orc at front;
- no Offica;
- no Combat;
- no ChatterBox dependency;
- no final audio required.

Acceptance:

> the three-generation Orc trio reads instantly as one band.

### OB-P2 · Performance readability

Add only enough motion to read as performance.

Large:

- procedural/authoring candidate `WarDrum_Beat_A`;
- stick visibly approaches a measured drum surface;
- visible recoil/settle;
- no fake clip name.

Medium:

- reuse measured instrument-body/arm-follow architecture;
- procedural strum;
- electric guitar profile measured separately.

Legacy:

- groove / gesture;
- microphone/trumpet may remain OFF.

One shared musical phase clock may expose:

`bpm`, `beat`, `bar`.

The actors do not need perfectly identical loops.

Prefer small phase offsets / asymmetry so it reads as musicians, not synchronized robots.

### OB-P3 · Spatial audio

Use real audio, not silent placeholder UI.

For a technical panning/falloff test before final Suno content, available source-backed stems include:

Drum technical donor:

`media/3D_Assets/Sounds/Van_Metronome_2026-07-17T163547 Stems/0 Drums.mp3`

Guitar technical donor:

`media/3D_Assets/Sounds/KFB Roller coaster Van_Metronome 02 (cover) Stems/3 Guitar.mp3`

These are **technical donor stems only**, not the accepted Ork Band music.

Final Georg/Suno stems may later replace them without changing the spatial contract.

Spatial donor pattern:

`skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/petstudio-v9/kfb-pinball-audio.js`

Reuse:

- listener position/orientation;
- HRTF PannerNode;
- inverse-distance falloff;
- host audio bus.

Do not create another AudioContext if WorldBuilder/host already owns one.

Target read:

- FAR → drum hint;
- MID → guitar joins;
- NEAR → full band / optional hype.

Exact distances belong to receiving world scale.

### OB-P4 · Offica Doppeldenk forced encounter

First test is **forced/deterministic**, not random.

Spawn source:

current Resident Atlas Toy Soldier present reveal.

Use real source states:

- closed present;
- unwrapped present;
- Toy Soldier;
- rifle/trumpet source props.

After reveal:

`Walking_A` patrols one short authored path.

Encounter:

1. Offica notices band;
2. approaches;
3. band performance enters `INTERRUPTED`;
4. Offica issues one absurd permit/noise/order warning through Bubble/ChatterBox fallback;
5. band responds with one bounded banter beat;
6. Offica withdraws grumbling;
7. band resumes from `RESUME_JAM`.

No Combat required yet.

Acceptance:

> a moving Resident can interrupt a scenic loop and the scene can resume without reset.

### OB-P5 · Random spawn + Citation

Only after P4 works.

Replace forced spawn with:

- seeded chance;
- cooldown;
- max one active Offica;
- no frame-random spam.

Patrol pattern:

`SPAWN → PATROL → NOTICE → APPROACH → INSPECT → ENFORCE → RESOLVE → RESUME/EXIT`

Possible enforcement themes:

- no performance permit;
- no location permit;
- volume violation;
- unauthorized gathering;
- suspicious/subversive activity;
- absurd paperwork.

Citation may initially be semantic/Bubble-only.

For player-facing citation encounters reuse existing Calls:

- KayfaBINGO;
- KayfaBONGO;
- KayfaBOGGLE;
- BLÖDSINN!

Possible outcomes:

- accept;
- ask what rule;
- mock;
- reject;
- escalate.

A meaningful citation may create a Lean Memory / Almanac receipt.

Do not create a physical ticket/inventory item until a source prop is deliberately selected.

### OB-P6 · Optional Kayfabe Scrap handoff

WorldBuilder must not implement Combat.

Scene may emit:

`KAYFABE_SCRAP_REQUEST`

Combat owner may later perform the physical exchange.

Desired story outcome:

- three Orcs collectively overwhelm Offica;
- no permanent hostility;
- band laughs / settles;
- Offica gets up and leaves grumbling, still convinced authority was disrespected;
- band resumes.

The scene owns before/after context.

Combat owns fighting.

## 4 · Offica as reusable Patrol Resident Pattern

Offica is not merely a scripted one-off.

Proposed reusable semantic pattern:

`kfb.patrol-resident.v0`

Phases:

`SPAWN → PATROL → NOTICE → APPROACH → INSPECT → INTERACT/ENFORCE → RESOLVE → RESUME/EXIT`

Future consumers may include:

- guards;
- ambient mobs;
- inspectors;
- wandering vendors;
- comic antagonists.

Host owns navigation.

The pattern owns semantic intent only.

## 5 · Offica characterization alignment

Existing Town direction already defines Offica as:

- bureaucratic Threshold Guardian;
- loyalist / denunciator;
- self-appointed keeper of order;
- ignorant confidence;
- incorrectly used official language;
- tiny authority gestures maximally overplayed;
- capable of hassling someone, being outwitted and reporting success anyway.

The new Ork-Band encounter is a concrete scene implementation of that existing direction, not a replacement characterization.

## 6 · Toy Soldier reveal donor

Current Resident Atlas has a real authored reveal:

- duration: 4.8 s;
- anticipation;
- present squish/wiggle;
- pop;
- `Present_Base → Present_UnwrappedBase`;
- Toy Soldier overshoot/settle;
- delayed rifle/trumpet appearance.

Reuse this source recipe.

Do not substitute a generic particle spawn.

## 7 · Trumpet / mouth-prop status

The trumpet source is real.

A believable trumpet-playing animation is **not currently proven**.

Likewise a Legacy-Orc microphone/horn performance is not "free" just because the prop can attach to a hand.

Possible future authoring path:

- measured mouth target from head/face;
- measured hand/arm target;
- prop axis aligned between hand and mouth;
- procedural arm pose;
- breathing/body groove.

But this is an Animation/Performance authoring task.

Do not burn OB-P1/P2 on it.

## 8 · Relation to existing Performance Suite

Current Performance Suite already contains conceptual families:

- Guitar Performance;
- Percussion / Orc War Drums.

One old line in that brief said a war-drum source had not been resolved.

**Current source truth supersedes that open point:** Resident Atlas + the new user handoff prove real Orc Wardrum and WardrumStick sources.

Do not duplicate the Performance Suite.

Consume or extend its authoring vocabulary later.

## 9 · WorldBuilder integration rule

The scene should mount as a local recipe / Story Zone / Scene Module.

WorldBuilder owns:

- placement;
- local transform;
- route/path authoring;
- environment/surface mount;
- host navigation;
- save/reload reference.

The Ork Band recipe owns:

- cast refs;
- performance anchors;
- scene state;
- audio semantic refs;
- interruption/resume beats.

Do not bake the band into one world.

The same scene should later be placeable in:

- Town market/street;
- camp;
- dungeon courtyard;
- festival;
- roadside;
- other WorldBuilder environments.

## 10 · Surface rule

The recipe remains in local coordinates.

If WorldBuilder's Surface Adapter is accepted, mount through the host surface frame.

Do not hardcode global Y-up assumptions into the scene recipe.

## 11 · Minimal UI for authoring

Do not build a dashboard.

In-scene editor only needs compact controls for this fixture:

- select scene root;
- move/rotate/scale scene root;
- select each performance anchor;
- move actor spots;
- choose guitar A/B;
- enable/disable Legacy mic/trumpet candidate;
- edit short Offica patrol path;
- force Offica spawn for testing;
- play/pause band;
- audio preview / mute;
- export/reload recipe.

Everything else stays out.

## 12 · Debug surface

Temporary authoring/debug readout is useful:

```
Band: JAM
Beat: 2 / Bar 4
Large: WAR_DRUM adapter
Medium: GUITAR_STRUM adapter
Legacy: HYPE fallback
Audio: MID · drums+guitar
Offica: PATROL · waypoint 2/4
Encounter: none
```

Not player-facing UI.

## 13 · Acceptance ladder

### SOURCE PASS

- exact donor objects isolated;
- source refs correct.

### STATIC SCENE PASS

- trio composition reads.

### PERFORMANCE PASS

- drum/guitar/hype motions visually plausible;
- no invented clips.

### AUDIO PASS

- listener movement changes directional/falloff read;
- no duplicate AudioContext.

### INTERRUPTION PASS

- forced Offica reveal;
- patrol;
- warning;
- band stops/pauses;
- Offica exits;
- band resumes.

### RANDOM PATROL PASS

- seeded/cooldown spawn;
- no duplicates;
- no social loop spam.

### COMBAT HANDOFF PASS · optional

- WorldBuilder requests;
- Combat owner handles;
- completion returns;
- scene resumes.

### HUMAN VISUAL GATE

Georg reviews:

- band comic read;
- instrument contact;
- audio approach read;
- Offica timing;
- whether fight/banter feels KFB rather than generic NPC scripting.

## 14 · Explicit non-goals

Not in first PoC:

- Fishing;
- general autonomous AI;
- general mob system;
- quest system;
- full concert UI;
- procedural music generation;
- trumpet performance;
- crowd/audience;
- key/access logic;
- unrelated Combat VFX;
- infinite WorldBuilder;
- final Suno production.

## 15 · Reserved future Stage route

If/when the WorldBuilder prerequisite gates are green and this fixture is actually built:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/orc-band-world-life/`

This route is **reserved only**.

It is not built, deployed or public-verified by this brief.

## 16 · Claude Design token-saving rule

When WB1-P0–P2 are green, the future Claude input should reference this file rather than restating the concept.

Claude should receive only:

1. current WorldBuilder `CLAUDE_DESIGN_INPUT.md`;
2. `ORC_BAND_DONOR_CHECK.md`;
3. `ORC_BAND_WORLD_LIFE_RECIPE_v0.json`;
4. this brief;
5. exact current donor source files/screenshots produced by the source-isolation gate.

Claude must not:

- rediscover the cast;
- substitute assets;
- invent instrument clips;
- invent another scene graph;
- invent another audio owner;
- invent Combat;
- redesign Offica's character;
- include Fishing;
- rebuild WorldBuilder foundations.

## 17 · One next gate for this concept lane

Do **not** start Claude Design yet.

Current WorldBuilder SSOT still requires WB1-P0–P2 first.

Once those gates are green, feed this already-prepared fixture into WB1-P3 as the preferred first **World-Life Scene** candidate.
