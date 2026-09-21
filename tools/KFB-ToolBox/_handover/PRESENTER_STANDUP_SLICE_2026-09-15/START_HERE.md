# KFB ToolBox · Presenter / Stand-up Performance Slice

**Datum:** 15.09.2026  
**Status:** PROPOSAL / DEFERRED until current ToolBox UI/coverage work is stable  
**Owner intent:** ToolBox / Animation / Presentation tooling. No runtime integration is claimed by this brief.

## 1 · Outcome

Add a reusable **Presenter / Stand-up performance mode** for KayKit characters and compatible KFB rigs so a character can stand on a small stage, hold a microphone in the **right hand**, deliver monologues/intros/card presentations, and combine body performance with Voice/Talk/Speech-Bubble output.

This is **not** part of the current UI-rescue/rework. Start only after the ToolBox Studio UI has recovered full feature coverage and the roster/owner contracts are stable.

## 2 · Product use cases

- stand-up-comedian style monologue;
- character introduces a card / deck / scene / episode;
- short scripted welcome or outro;
- narrator/presenter in front of the Birthday curtain or another accepted stage backdrop;
- animated explanation while a card, slide, prop or panel is visible;
- reusable low-effort character video/presentation production.

The target is a **performance language**, not one hardcoded joke animation.

## 3 · Character / rig scope

User direction: all KayKit characters and KFB rigs that can legitimately consume the shared animation/attachment contracts.

Implementation must therefore work by **real rig family / binding evidence**, not by assuming that one clip magically fits every skeleton.

For each actual rig family discovered in current ToolBox/Animation Lab:

1. identify compatible skeleton/retarget path;
2. measure binding coverage;
3. preview representative actors;
4. record PASS / PARTIAL / UNSUPPORTED.

No `all KayKit rigs supported` claim without the matrix.

## 4 · Microphone prop

User requested the **Goskerl microphone** in the character's right hand.

Current GitHub search did **not** resolve a source asset named `Goskerl`/`Goskerl_Microphone`, so asset identity remains **UNRESOLVED** and must not be silently substituted.

A concrete existing microphone candidate is:

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf`

This is only a **SOURCE FACT / CANDIDATE**, not a decision that it is the intended Goskerl microphone.

### Attachment rule

- microphone mounts through the existing right-hand/prop attachment seam;
- do not bake the microphone mesh into animation clips;
- no per-character duplicate prop system;
- prop orientation/offset may use rig-family or actor-specific calibration data where required.

## 5 · Minimum Presenter animation vocabulary

A compact first set is preferable to a huge library.

Suggested P0 vocabulary:

1. `Presenter_Idle_Mic` — relaxed stage idle, microphone held naturally.
2. `Presenter_Talk_A` — conversational free-hand gestures, restrained.
3. `Presenter_Talk_B` — broader emphasis / rhetorical beat.
4. `Presenter_Point_Indicate` — indicate card/screen/prop beside character.
5. `Presenter_Punchline_Beat` — short hold / reaction / settle after line.
6. `Presenter_Intro_Welcome` — short welcoming/opening beat.
7. `Presenter_Outro_Thanks` — short close / acknowledgement.
8. `Presenter_Card_Showcase` — body/open-hand composition that leaves visual room for a presented card/graphic.

These are working labels, not final clip IDs.

### Animation quality

Use the same presentation principles now established for KFB:

- readable anticipation;
- weight and clear contact;
- asymmetry rather than sterile mirrored gestures;
- overshoot + settle where appropriate;
- useful pauses for speech;
- loops that do not look mechanically repetitive;
- microphone hand remains credible and stable;
- free hand / torso / head carry most expressive motion;
- face/mouth systems stay independent owners.

## 6 · Voice / Talk / Speech Bubble integration

Presenter mode should consume existing owners rather than create a parallel dialogue stack.

Required seams:

- Voice/TTS/audio input;
- Talk / mouth / viseme system;
- optional Speech Bubble rendering;
- current animation state / clip playback;
- audio ducking/mix only through the existing audio owner where used in a runtime scene.

A script should be able to run as segments, e.g. conceptually:

`line → gesture cue → pause → line → indicate card → punchline beat → rest`

Do not require automated gesture generation for the first slice. Manual/cued sequence authoring is enough.

## 7 · Stage / curtain reuse

If the Birthday curtain/threshold implementation becomes visually accepted and technically reusable, it may become a presentation-stage donor.

Possible scene grammar:

`Curtain closed → reveal → Presenter_Idle_Mic → intro → card/prop appears → monologue beats → outro → curtain/transition`

Reuse is conditional on an actual accepted donor. Do not copy an unfinished Birthday experiment into ToolBox merely because it exists.

## 8 · Relationship to Dance

Dance and Presenter are separate performance categories that may share the same Animation Lab/casting infrastructure.

Do not merge them into one vague `performance` control surface if that makes discovery worse.

Suggested taxonomy:

- Idle / Locomotion
- Gestures / Reactions
- **Presenter / Talk Performance**
- Dance / Groove
- Special

## 9 · Authoring UI requirement

When the ToolBox UI is stable, Presenter should be discoverable in the full Studio workflow, most likely around `Motion` + `Voice`, without creating a separate application.

Minimum authoring controls:

- choose Presenter clip/state;
- right-hand microphone toggle/attachment;
- preview with current actor;
- play a short text/voice sample;
- optional Speech Bubble toggle;
- cue a card/prop presentation marker;
- return to stable idle/rest;
- export the same underlying actor/animation/voice contract, not a second format.

## 10 · QA matrix

At minimum test representative actors across each real KayKit rig family plus current KFB special/graft cases where compatible.

For each:

- right-hand microphone mount visually correct;
- no hand/prop drift through the clip;
- no major skeleton binding loss;
- face/mouth remains functional;
- Talk/Voice can run without restarting body animation unexpectedly;
- transitions `Idle → Presenter → Rest` are clean;
- Card Showcase leaves readable space for the presented visual;
- no duplicate mixers / duplicate prop instances after repeated preview.

## 11 · Explicit non-goals for first slice

- automatic AI gesture direction from arbitrary prose;
- full stage editor;
- lip-sync replacement;
- mocap system;
- full video editor;
- one-off per-character hand-authored implementation;
- universal support claim before rig-family QA.

## 12 · Status discipline

- **DECISION / USER DIRECTION:** ToolBox should later gain a dedicated stand-up/presenter animation slice with right-hand microphone, monologue/presentation use and stage/curtain reuse.
- **PROPOSAL:** compact 8-state Presenter vocabulary above.
- **SOURCE FACT:** `GothGirl_Microphone.gltf` exists as a microphone asset candidate.
- **UNRESOLVED:** exact source identity of the user-named `Goskerl` microphone.
- **DEFERRED:** implementation until current ToolBox UI/coverage/roster work is stable.
- **IMPLEMENTATION:** none by this brief.
- **TESTED RESULT:** none for Presenter mode yet.
