# KFB VFX / SFX Consolidation 01 · Donor Census → Review Bank

Status: **PREPARED FRESH WEB SLICE · VFX FIRST**

## Für Georg

Hier ist schon deutlich mehr vorhanden als nur ein paar lose Effekte.

VFX kann sinnvoll zuerst konsolidiert werden.
SFX kommt als zweite Ebene dazu.

Ziel des ersten Webchats:
**nicht neue Effekte bauen**, sondern die besten vorhandenen Donors sichtbar und vergleichbar machen.

## Existing VFX sources verified

### 1 · KFB Cartoon Combat VFX v10.1

Module donor:
`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/modules/kfb-vfx.js`

Blob:
`62bb08843942c7040e452f1a4873fdf317dec6eb`

Design doc:
`.../docs/VFX_DESIGN_v10.md`

Blob:
`5d716c2020561accb1d486f959622c34ce0ef61a`

Strong existing grammar:
- one pooled drawer;
- atlas roles;
- flipbooks for primary punctuation;
- four orientations;
- impact recipes by energy × surface;
- world-tinted tertiary smoke/dust;
- host-owned shake/hitstop/audio/reaction events;
- ring semantically restricted;
- no VFX ownership of physics/gameplay/audio.

### 2 · Brackeys VFX bundle

Repo:
`media/3D_Assets/FX_Visual/brackeys_vfx_bundle/`

Existing KFB VFX module already consumes masks/flipbooks from it.

Use as exact visual donor, not inspiration-only.

### 3 · FreeHitVfx

`media/3D_Assets/FX_Visual/FreeHitVfx/`

README blob:
`fdadd655571f0f411a6a3af93067287a40bf33af`

Useful SOP donor:
- white/alpha texture layer;
- preset-driven effect;
- burst/ring/layer concepts.

Do not copy Godot runtime ownership into KFB browser runtime.

### 4 · 2D Cartoon Smoke pack

Registry:
`registry/assets/v1/packs/free-cartoon-smoke-effects-asset-pack.json`

Blob:
`518a20b5b570209ec04e2d4378eca5c657a26342`

74 repo-exact 2D frames/assets.
Pinned source commit:
`378b209355b13304e3cff656ec0806ca5b89df28`

Candidate use:
- flipbook/billboard smoke;
- impact aftermath;
- world-life/cartoon punctuation.

### 5 · Tiny Swords 2D effects

Registry:
`registry/assets/v1/packs/tiny-swords-update-010.json`

Blob:
`ecead65fa9d757812f19948b698c2ab3ed938a03`

Includes effect assets such as Explosion/Fire families.

Treat as 2D visual donor candidates.
Do not assume they fit KFB until visually reviewed.

### 6 · Boxel Feedback POC

`KFB Boxel Blitz/audio-feedback-poc/README.md`

Blob:
`a43c8dd23f83d3e1e8a4abe1b910de87f9524358`

Existing paired feedback proof:
- pickup;
- power up/down;
- checkpoint ladder;
- cascade ladder;
- small squash/stretch + particle burst;
- physics unchanged.

### 7 · Event-map seam

`game-ready/pilot-01-lorekeeper-sedan/events/VFX_EVENT_MAP.json`

Blob:
`8b80a6f593943dc0284e4c8c380fe81401d53f80`

Useful owner pattern:
gameplay fact → semantic VFX event map → presentation consumer.

## Existing SFX sources verified

### Pinball Audio v1

`skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/petstudio-v9/kfb-pinball-audio.js`

Blob:
`5968392700de94ff39ef8e38ef518a96871c97ca`

Strong reusable principles:
- event-driven audio;
- shared AudioContext;
- SFX/drone/music buses;
- optional positional HRTF;
- same interface has null implementation;
- audio follows game event;
- user-gesture unlock.

Existing docs state the SFX manifest contains 37 event ids.

### Combat cue/layer lineage

Combat Arena HOUSEKEEPING records existing shared modules:
- `kfb-combat-cues.js`;
- `kfb-sfx-layers.js`;
- `kfb-combat-sfx.v2.json`;
- `kfb-vfx-recipes.js`;
- `kfb-fx-sprites.js`;
- `kfb-fx-trails.js`.

Important:
those exact module files are not all directly present under the current public Combat Arena tree at the guessed path.

First slice must locate/pin their actual current source before promoting them.

No reconstruction from host imports.

## Existing semantic skill

`skills/kfb-cartoon-animation_v2.md`

Already defines:
- VFX semantic classes;
- primary/secondary/tertiary hierarchy;
- ring restriction;
- dust rule;
- one sound word at a time;
- audio punctuation grammar;
- event budgets;
- recovery.

Do not invent a second semantic vocabulary.

## VFX-01 first outcome

Build one **VFX Review Bank** using `REVIEW_SCENE_BASE_V1.md`.

One lightweight Three.js review scene with buttons for exact donor families.

First categories:

1. movement / speedline
2. contact / landing
3. impact / hard hit
4. smoke / aftermath
5. electric / shield
6. reveal / charge
7. 2D flipbook smoke/explosion donor

For each:
- donor id/path;
- semantic class;
- actual visual preview;
- source-isolate mode where relevant;
- no gameplay.

The review bank is not a new VFX engine.

## Review questions

Georg should answer only:

1. Which visual donor families feel KFB?
2. Which should be rejected/quarantined?
3. Which 3–5 effects should become the first shared cross-project recipes?

## SFX-01 after VFX selection

Then build a sound review layer for accepted semantic events.

First inspect/pin:
- existing pinball SFX manifest;
- combat cue/layer current sources;
- Boxel audio POC sources.

One AudioContext owner.
No parallel audio engine.

Map:
`semantic event → visual recipe + audio cue family`

not:
`project-specific hardcoded effect → project-specific sound`.

## Target shared contract later

Candidate only:

```
game/physics event
→ semantic FX event
→ VFX recipe
→ SFX cue
→ optional camera/hitstop host reaction
```

Gameplay/physics facts remain owner-controlled.

## Stop conditions

Stop if:
- a supposed shared module source cannot be pinned;
- a donor must be reconstructed from prose;
- review scene replaces the donor look;
- VFX starts owning physics/audio;
- SFX creates a second AudioContext owner;
- scope expands into full Combat integration.

## Exactly one next gate

**VFX-01 donor census + interactive Review Bank.**

No SFX implementation until the VFX donor families are visibly reviewed.
