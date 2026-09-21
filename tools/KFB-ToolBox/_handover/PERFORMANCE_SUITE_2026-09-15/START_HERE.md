# KFB ToolBox · Performance Suite

**Datum:** 15.09.2026  
**Status:** PROPOSAL / DEFERRED NEXT SLICE — start only after current ToolBox UI recovery is stable  
**Owner intent:** ToolBox / Animation / Presentation authoring. No runtime integration is claimed.

## 1 · Outcome

Create one coherent **Performance Suite** inside the existing Studio / Animation workflow. This supersedes the idea of treating Dance and Presenter as separate implementation slices.

Performance families:

- **Dance / Groove**
- **Presenter / Stand-up / Monologue**
- **Seated Presenter / Stool**
- **Guitar Performance**
- **Percussion / Orc War Drums**
- later additional authored performance families

The suite is not a separate app and must not create a second animation, attachment, Voice, Talk, Bubble or export truth.

## 2 · Hard character / rig coverage requirement

**ALL current KayKit characters and KayKit rig families must be available for selection in animation/performance authoring.**

Do not expose only current Studio favourites or a handpicked cast.

Source/discovery must come from the actual Asset/Resource Registry and current KayKit source collections.

Current tested Registry/Librarian evidence already exposes a broad KayKit character lane and measured rig-family filtering. The UI must remain population-driven rather than hardcoded.

Rules:

- every discovered KayKit character remains selectable;
- show the real rig family where known;
- if a selected performance is incompatible, keep the character visible and show a compact unavailable/partial state rather than hiding the character;
- no `all rigs supported` claim without binding + visual QA evidence;
- performance clips may require separate family variants.

Required matrix:

`character → rig family → performance family → clip/source → binding result → visual QA → PASS | PARTIAL | UNSUPPORTED`

## 3 · Known animation-source facts

The current KayKit shared animation library contains explicit glTF folders for at least:

- `Rig_Medium`
- `Rig_Large`

The current Asset Librarian also tracks measured KayKit character families including `Rig_Small`, `Rig_Medium`, `Rig_Large` and can audition local/shared motions on selected actors.

Therefore:

- use exact rig-family sources where available;
- do not pretend a Medium clip is universal;
- author/retarget/provide family-specific performance clips when required;
- selected actor remains in the UI even when a family lacks a current performance clip.

## 4 · Common performance grammar

Every authored performance should follow a common lifecycle:

`Rest/Idle → Enter/Anticipate → Performance → Accent/Transition → Settle → Rest`

Quality bar:

- visible weight and contact;
- clear anticipation;
- asymmetric, human/cartoon timing rather than mirrored robot motion;
- overshoot/settle where useful;
- loops must not look mechanically perfect;
- prop hands stay credible;
- face, eyes, mouth and Talk remain their existing owners;
- repeated preview creates no duplicate mixer or duplicate prop.

## 5 · Dance / Groove

Goal: a compact but useful shared dance vocabulary, not hundreds of uncurated clips.

Initial roles:

- `Dance_Idle_Groove`
- `Dance_A`
- `Dance_B`
- `Dance_Big`
- `Dance_Celebrate`
- `Dance_Outro_Settle`

First work item is **inventory + audition**, using existing local/shared KayKit clips before authoring anything new.

A clip only becomes a recommended Dance clip after actual visual review, not because its filename sounds dance-like.

## 6 · Presenter / Stand-up / Monologue

Use cases:

- stand-up comedy;
- card/deck/scene introduction;
- tutorial/explanation;
- episode intro/outro;
- marketing/promo presenter;
- scripted character monologue.

Initial performance vocabulary:

- `Presenter_Idle_Mic`
- `Presenter_Talk_A`
- `Presenter_Talk_B`
- `Presenter_Indicate_Left`
- `Presenter_Indicate_Right`
- `Presenter_Punchline_Beat`
- `Presenter_Welcome`
- `Presenter_Outro`
- `Presenter_Card_Showcase`

A manual sequence is sufficient first:

`line → gesture cue → pause → line → indicate → accent/punchline → settle`

No automatic AI gesture direction is required in the first slice.

### Microphone

Use the existing right-hand prop-attachment seam.

Concrete existing source candidate:

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf`

Do not bake the microphone mesh into animation clips.

## 7 · Seated Presenter / Stool

Pinned source supplied by Georg:

`georg-doc/kayfabizarro@891eadf01e218f5fc21387e64cea1fec8332c5b6`

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Stool.gltf`

Measured source bounds are approximately 0.6 × 0.6 footprint and 0.8 height in source units.

The stool is a **presentation prop**, not a GothGirl-only behavior.

Required seated vocabulary:

- `Presenter_Stool_Sit`
- `Presenter_Stool_Idle`
- `Presenter_Stool_Lean` — relaxed pose, one hand/forearm casually supported against the seat/stool where anatomically plausible;
- `Presenter_Stool_Talk_A`
- `Presenter_Stool_Talk_B`
- `Presenter_Stool_Indicate`
- `Presenter_Stool_Punchline`
- `Presenter_Stool_Stand`

Seat contact must be calibrated by rig family/actor where necessary. No foot floating, butt clipping, or hand drifting through the stool.

The existing Studio pose/seat owner must be reused where applicable; do not create an unrelated second seating system.

## 8 · Guitar Performance

Concrete existing guitar source:

`media/3D_Assets/KayKit_Mystery_Series6/5 - November 2023 - Animatronic/assets/gltf/Guitar.gltf`

Treat it as the first real prop candidate, not as a guarantee that it fits every actor without calibration.

Initial vocabulary:

- `Guitar_Equip`
- `Guitar_Idle`
- `Guitar_Strum_Groove`
- `Guitar_Strum_Big`
- `Guitar_Riff`
- `Guitar_Hit_Accent`
- `Guitar_Outro`

Requirements:

- two-hand relationship must remain visually credible;
- guitar body/neck placement calibrated per rig family if needed;
- strap is optional; do not block P0 on cloth/strap simulation;
- performance may be synchronized to audio later but first slice only needs believable authored body performance.

## 9 · Orc Brute / War Drums

Concrete character source exists:

`media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`

The current Orc Brute folder contains character and several Orc props, but a repo search has **not yet resolved a dedicated war-drum asset**. Do not invent one silently.

Direction:

- Orc Brute is the hero QA actor for the first War Drum performance;
- locate/reuse an existing suitable drum if Asset Registry search finds one;
- otherwise make/import a deliberately simple KFB/KayKit-compatible war-drum prop as a separately owned asset before animation authoring.

Initial vocabulary:

- `WarDrum_Ready`
- `WarDrum_Beat_A`
- `WarDrum_Beat_B`
- `WarDrum_Roll`
- `WarDrum_Big_Hit`
- `WarDrum_Celebrate`
- `WarDrum_Outro`

Requirements:

- real stick/drum contact timing;
- left/right arm asymmetry;
- visible recoil/weight after large hits;
- optional camera/SFX sync belongs to consumer/stage layer, not baked into the body clip.

## 10 · Voice / Talk / Bubble integration

Presenter modes consume existing:

- Voice/TTS/audio input;
- mouth/viseme Talk owner;
- EyeRig/gaze where available;
- Speech Bubble owner;
- body animation state;
- existing export/profile/session owners.

Speech may run over Presenter or Seated Presenter without restarting the body clip unexpectedly.

## 11 · Stage / Curtain

If the Birthday curtain/threshold becomes an accepted reusable donor, the Performance Suite may consume it as one optional stage presentation.

Possible grammar:

`Curtain → reveal → performer enters/rests → performance → settle → outro/transition`

Do not couple the animation contracts to that specific curtain.

## 12 · UI direction

Performance lives inside the real Studio `Motion` / `Voice` workflow.

Keep the surface compact:

- Actor selector = complete current KayKit population;
- Performance family selector;
- clip/state thumbnails or short names;
- prop toggle/source where relevant;
- Play / Stop / Rest;
- optional Voice/Bubble toggle for Presenter;
- no explanatory paragraphs in the normal authoring UI;
- compatibility detail belongs behind a compact status/info affordance, not permanent meta clutter.

## 13 · Acceptance slice

A useful first vertical slice proves:

1. complete KayKit actor discovery in the Animation surface;
2. one reviewed Dance/Groove on representative rig families;
3. standing Presenter with microphone + Talk/Voice;
4. Seated Presenter using the pinned GothGirl stool;
5. Guitar performance using the real Guitar asset;
6. Orc Brute War Drum performance once a real drum source is pinned;
7. clean `Performance → Rest` transitions;
8. export/import/consumer compatibility remains the existing owner path.

## 14 · Status

- **DECISION / USER DIRECTION:** Dance and Presenter are one Performance Suite slice.
- **DECISION / USER DIRECTION:** all current KayKit characters/rigs must be selectable for animation/performance authoring.
- **DECISION / USER DIRECTION:** include Guitar playing, Orc Brute War Drums and seated/stool Presenter performance.
- **SOURCE FACT:** GothGirl Stool exists at the pinned commit above.
- **SOURCE FACT:** Animatronic `Guitar.gltf` exists.
- **SOURCE FACT:** Orc Brute GLB exists.
- **UNRESOLVED:** dedicated War Drum prop source.
- **DEFERRED:** implementation until current ToolBox UI recovery is stable.
- **IMPLEMENTATION:** none by this brief.
- **TESTED RESULT:** none for Performance Suite yet.
