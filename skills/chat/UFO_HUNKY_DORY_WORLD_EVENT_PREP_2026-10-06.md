# KFB UFO / Hunky & Dory World Event · Architecture Prep · 2026-10-06

Status: **PROPOSAL · PREP · NO OPEN-WORLD RUNTIME WRITES**
Owner: **KFB World Events / Presentation**
Receiving product later: **KFB Open World / WB2 · #360 / PR #348**
Current Open World writer: **Claude Coworker · protected**

## 0 · Purpose

Prepare one modular UFO world-event family for Hunky & Dory without requiring Hunky/Dory character presentation in V1.

V1 may show only:
- UFO arrival / hover / departure;
- target acquisition;
- tractor beam;
- abduction / dematerialization;
- return / rematerialization;
- absurd cargo drop;
- world/resident reactions.

Hunky and Dory themselves may remain invisible/offscreen in V1.

## 1 · Best current source donors

### Primary UFO family · Kenney Tower Defense Kit

Registry:
`registry/assets/v1/packs/kenney-tower-defense-kit.json`

Pinned source commit:
`378b209355b13304e3cff656ec0806ca5b89df28`

Complete GLB donors:
- `media/3D_Assets/kenney_tower-defense-kit/Models/GLB format/enemy-ufo-a.glb`
- `media/3D_Assets/kenney_tower-defense-kit/Models/GLB format/enemy-ufo-b.glb`
- `media/3D_Assets/kenney_tower-defense-kit/Models/GLB format/enemy-ufo-c.glb`
- `media/3D_Assets/kenney_tower-defense-kit/Models/GLB format/enemy-ufo-d.glb`
- matching weapon variants exist but are not required for V1;
- `enemy-ufo-beam.glb`;
- `enemy-ufo-beam-burst.glb`.

Why primary:
- actual UFO silhouettes;
- existing beam geometry;
- small self-contained GLBs;
- source-proven in current Registry;
- no need to invent an initial saucer.

Do not choose a final Hunky/Dory UFO before source isolation/visual comparison of A/B/C/D.

### Secondary spaceship family · Quaternius

`media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/`

Contains:
- `Spaceship_FinnTheFrog.gltf`;
- `Spaceship_BarbaraTheBee.gltf`;
- `Spaceship_RaeTheRedPanda.gltf`;
- `Spaceship_FernandoTheFlamingo.gltf`.

Useful as alternatives/reference, but the Kenney UFO family is the better first tractor-beam donor.

### Future Hunky / Dory body candidates · Kenney Platformer aliens

Registry:
`registry/assets/v1/packs/kenney-platformer-kit.json`

Pinned source commit:
`378b209355b13304e3cff656ec0806ca5b89df28`

Five real animated alien candidates:
- `character-oobi.glb`;
- `character-oodi.glb`;
- `character-ooli.glb`;
- `character-oopi.glb`;
- `character-oozi.glb`.

Do not assign Hunky/Dory identities before isolated visual comparison.
V1 does not require them to be visible.

## 2 · Event family

Candidate semantic events:

```
UFO_APPROACHING
UFO_HOVERING
TRACTOR_BEAM_TARGET_LOCKED
ABDUCTION_STARTED
ABDUCTION_MATERIAL_BREAKUP
ABDUCTION_COMPLETED
ALIEN_GIFT_DROPPED
ABDUCTED_OBJECT_RETURNED
UFO_DEPARTING
```

Target classes:
- prop/resource;
- Cube Pet / animal;
- Resident/NPC;
- vehicle;
- building section;
- whole building / castle;
- future special Card/world object.

The event resolver chooses the target and consequence.
The visual UFO/beam layer only renders the event.

## 3 · Transfer / materialization model

Treat UFO abduction as a sibling of the existing planned Build / Destruction / Rebuild grammar.

```
Source Object
   ↓
Transfer Prepare
   ↓
Readable wobble / squash / portal edge
   ↓
Material Breakup
   ↓
Clay particles / chunks / energy stream
   ↓
Beam Funnel
   ↓
Transferred / hidden world state
```

Reverse:

```
Transferred Object
   ↓
Beam / Drop
   ↓
Clay particles / chunks
   ↓
Rematerialize / assemble / pop
   ↓
Restore source-proven final object
```

Important:
- final object remains the real source mesh;
- particles/chunks are presentation states;
- abduction is not automatically destruction;
- destruction/damage state and transfer state must stay distinct.

## 4 · Shared decomposition grammar

Future Architecture Freeze should consider a common semantic layer:

```
Source Recipe
↕
Semantic Sections / Transfer Groups
↕
Final Object
↕
Damage Cells
↕
Rubble / Clay / Fluff Particles
↕
Rebuild / Rematerialize
```

Do not require identical geometry for:
- construction sections;
- destruction cells;
- UFO transfer chunks.

Only stable semantic IDs need to relate them.

This lets:
- a castle be visually reduced into beam particles;
- a destroyed castle be repaired with Fluff;
- an abducted castle be returned intact;
- all three share source identity without one giant bespoke animation.

## 5 · Scale absurdity is intentional

A comparatively small UFO may abduct:
- a crate;
- a Resident;
- a Cube Pet;
- a house;
- a castle.

Do not solve this with realistic interior volume.

Cartoon rule:
**the beam/portal transfer compresses representation, not physical volume.**

For large targets:
- beam footprint expands to target bounds;
- object may squash/wobble;
- breakup begins from edges/sections;
- chunks/particles spiral or funnel upward;
- stream narrows toward UFO aperture;
- final disappearance is hidden by beam/portal transition.

This impossibility is part of the joke.

## 6 · Visual language

Preferred V1 presentation:
- source-proven UFO;
- subtle hover/bob;
- broad soft cone/cylinder beam;
- optional Kenney beam mesh as geometric donor;
- shader gradient / Fresnel / controlled opacity;
- clay particle/chunk breakup;
- directional suction;
- portal-like rim/transition;
- stable seeded irregularity;
- no random per-frame shape flicker.

Etherington portal/transition references may be used as **functional visual grammar** once the exact source is pinned:
- silhouette breakup;
- transition rim;
- directional motion;
- readable entry/exit.

Do not copy a tutorial drawing as final art.

## 7 · Audio architecture

Audio remains owned by the existing KFB Audio/Jukebox/Mixer stack.

World/UFO presentation emits semantic hooks only:

```
ufo.arrive
ufo.hover
beam.charge
beam.lock
beam.transfer.start
beam.transfer.loop
beam.transfer.complete
ufo.drop
ufo.depart
```

Current donor shortlist:
`skills/chat/UFO_EVENT_AUDIO_DONOR_SHORTLIST_2026-10-06.md`

Likely useful families already in repo:
- Kenney digital audio: `phaseJump*`, `phaserUp*`, `phaserDown*`, `spaceTrash*`, `zap*`;
- 400 Sounds Pack: `whoosh_1/2`, `white_noise_long/short`, `hydraulic_up/down`, `air_burst`, `wobble`.

No second AudioContext.
Claude Design may audition/select candidates for the isolated event proof; final runtime routing remains Audio-owned.

## 8 · Resident / world reactions

The Resident Reaction Matrix should consume UFO events like any other world event.

Examples:
- UFO approaching → curious / suspicious / worried;
- beam lock → surprise / step-out / point;
- nearby NPC abducted → shock / worry / seek help;
- Cube Pet abducted → surprise / worry / curiosity;
- gift dropped → curiosity / delight / suspicion;
- building abducted → high-priority surprise/worry → inspect/help/rebuild consequences;
- returned object → surprise / inspect / relief / amusement.

Presentation remains:
Pose + Proximity + Gesture + Face + Emanata + optional Bubble + Audio hook.

## 9 · V1 / V2 / V3

### V1 · Event Actor only
- UFO A/B/C/D donor comparison;
- arrival/hover/departure;
- beam;
- small prop target;
- Cube Pet/animal target;
- rematerialize/drop;
- audio proof;
- no Hunky/Dory visible.

### V2 · World consequence
- Resident abduction/return;
- alien gift drop;
- group reactions;
- temporary target-unavailable state;
- building section / small building transfer;
- inspect/aftermath.

### V3 · Signature spectacle
- whole building / castle;
- transfer/deconstruction/reconstruction hybrid;
- Hunky/Dory visible in cockpit/window;
- optional ChatterBox commentary;
- special narrative events.

## 10 · Current Coworker architecture input · PENDING RETURN

The active Coworker run currently reports:
- module evaluations complete;
- `docs/ARCHITECTURE_AS_BUILT.md` created without architecture rewrites;
- actual module boundaries/interfaces/events documented;
- **Authoring is absent**;
- **Persistence is absent**;
- duplicate ownership/tight coupling points documented;
- performance limits/evidence documented;
- Round 4 final whole-product critic is still running;
- final browser/build evidence and `RETURN.md` still pending.

This is **not yet GitHub-authoritative final truth**.
Do not implement against it until Coworker returns its exact branch/head/files.

Planning consequence:
- UFO VFX/event prep may proceed in isolation;
- no world-state/persistence adapter should be invented now;
- post-Coworker Architecture Freeze decides how `target unavailable / transferred / returned` states live in the real runtime.

## 11 · Executor split

### ChatGPT Web Chat
- event taxonomy;
- donor/source audit;
- target/consequence schema;
- reaction matrix;
- audio shortlist;
- integration brief.

### Claude Design · preferred isolated V1
- source-isolate UFO A/B/C/D;
- choose best UFO donor;
- create isolated browser/3D Event Lab;
- beam shader/presentation;
- clay breakup/rematerialization;
- scale tests: small prop / Resident-sized proxy / castle-sized proxy;
- audition source-proven SFX;
- return exact visual/audio evidence.

### Blender MCP · later only if proven necessary
- new UFO/cockpit geometry;
- Hunky/Dory-specific posing;
- custom clay chunk geometry if browser approach fails;
- mesh-level decomposition unavailable through runtime presentation.

### Work/WSA · after Coworker
- Architecture Freeze;
- real World event adapter;
- target state/persistence boundary;
- integration with Resident reactions / destruction / rebuild / Audio.

## 12 · First acceptance target

One isolated Event Lab proves:
1. real source UFO isolated first;
2. hover/arrival/departure;
3. target lock;
4. beam width adapts to target bounds;
5. small prop abduct + return;
6. Resident-sized proxy abduct + return;
7. castle-sized proxy visually compresses into same UFO;
8. clay/portal dematerialization remains readable;
9. SFX sequence supports anticipation → suction → completion;
10. no second Audio owner;
11. no Open World writes;
12. no fake persistence/world-state claims.

## 13 · Next gate

**Georg selects/confirms the preferred UFO donor if needed → Claude Design isolated Event Lab when resource timing permits.**

Runtime integration remains:
**Coworker exact RETURN → Work/WSA Architecture Freeze → explicit UFO World Event integration slice.**
