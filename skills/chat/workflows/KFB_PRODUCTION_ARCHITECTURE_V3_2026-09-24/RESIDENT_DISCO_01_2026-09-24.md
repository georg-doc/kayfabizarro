# RES-DISCO-01 · Resident Atlas Outdoor Disco Ensemble

**Date:** 2026-09-24  
**Status:** RESEARCHED · READY BRIEF · IMPLEMENTATION NOT STARTED  
**Owner:** existing Animation & Residents strand / Resident Atlas + ToolBox Animation Studio consumers  
**Architecture owner:** PR #204 · `chatgpt-web/production-architecture-v3-2026-09-24`  
**Protected performance owner:** `kfb.resident-performance.v1` from MUSIC-PERF-01 / PR #207  
**Planned Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/disco/` · **NOT PUBLISHED**  
**Execution profile:** `WEB_DEEP` · ChatGPT Web · GPT-5.6 Sol · high reasoning · HIGH budget  
**Optional authoring boundary:** Blender MCP only for named missing/retargeted motions, especially Legacy.

## Outcome

Build one reusable baseplate-free Resident performance scene with approximately six to seven KayKit characters dancing and celebrating in an outdoor disco / street-party composition.

The scene must reuse the existing Resident Atlas, Motion Library, Animation Studio and MUSIC-PERF timing owners. It must not introduce a second Resident database, animation catalogue, mixer owner, music player, audio clock or scene-persistence schema.

Target experience:

`real Resident cast → real dance/party actions → bar-aware choreography → one music clock → outdoor party props → reusable Resident performance recipe`.

This is a choreography / performance consumer, not a new universal music visualizer.

## Current source facts

### Existing synchronized performance seam

MUSIC-PERF-01 already proves:
- schema `kfb.resident-performance.v1`;
- one song transport as master clock;
- BPM + beats-per-bar + phase/bar offset;
- per-performer choreography refs;
- start / loop / finish markers;
- Stage recipe + Camera recipe;
- Play / Scrub / Loop on one clock;
- Source Object isolation before integrated performance.

Current proof is the KayfaBizarros / `Rubbish Groove` performance. The disco scene consumes this seam; it does not retune or replace it.

### Current Motion Library

Pinned source revision:
`032c9d50cd5de6764fa37fec65cb203ed35fcb11`

Current catalogue:
`media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`

The shared Medium/Large library contains 33 actions. Current dance actions:

| id | source FBX | duration | loop | root |
|---|---|---:|---|---|
| `kfb_dance_chicken_a` | `Chicken Dance.fbx` | 4.8 s | yes | in-place |
| `kfb_dance_hip_hop_a` | `Hip Hop Dancing.fbx` | 13.6667 s | yes | in-place |
| `kfb_dance_house_a` | `House Dancing.fbx` | 19.8333 s | yes | in-place |
| `kfb_dance_house_b` | `House Dancing (1).fbx` | 19.8333 s | yes | in-place |
| `kfb_dance_locking_hip_hop_a` | `Locking Hip Hop Dance.fbx` | 17.0333 s | yes | travel |
| `kfb_dance_samba_a` | `Samba Dancing.fbx` | 23.9 s | yes | in-place |
| `kfb_dance_slide_hip_hop_a` | `Slide Hip Hop Dance.fbx` | 17.3333 s | yes | in-place |
| `kfb_dance_step_hip_hop_a` | `Step Hip Hop Dance.fbx` | 7.8333 s | yes | travel |
| `kfb_dance_thriller_part3_a` | `ORC BRUTE - MIXAMO - Thriller Part 3.fbx` | 25.6 s | no | travel backward |
| `kfb_dance_wave_hip_hop_a` | `Wave Hip Hop Dance.fbx` | 16.8667 s | yes | in-place |

Additional current party-compatible loop:
- `kfb_idle_happy_a` / `Happy Idle.fbx` / 2.9667 s / in-place.

The library does not currently provide a source-backed standing clap, fists-up cheer, head-bang cheer or general victory hit.

## Proposed first cast · revised by Georg

**Prototype Pete is excluded.** He is a template/proof actor, not a disco Resident.

Use the user-selected source-backed cast direction:

| slot | Resident | rig / presentation lane | role | first motion direction |
|---|---|---|---|---|
| D1 | Skeleton Minion · Legacy character source | Legacy rigid-parts / `legacyAssemble()` lane | comic bouncy skeleton dancer | reuse the proven Orc-band `bounce` presentation pattern; no fake Medium footwork |
| D2 | Avian Swordsman | Rig_Medium | sharp / athletic dancer | Hip-Hop Wave ↔ Hip-Hop |
| D3 | Protagonist_A · teenager role | Rig_Medium | teenage party Resident | House ↔ Slide Hip-Hop / later Cheer |
| D4 | Toy Soldier | Rig_Medium | stiff comic contrast | Chicken Dance ↔ House |
| D5 | Witch | Rig_Medium | loose flowing dancer | Samba ↔ House |
| D6 | Black Knight | Rig_Large | heavy groove / visual anchor | House ↔ Hip-Hop Slide |
| D7 | Demon Lord | Rig_Large | big theatrical dancer | Hip-Hop ↔ Wave / featured Thriller break |

Alternative after visual audition: Ultra Turbo Hero Man or Monstrosity.

### User-pinned source references

Legacy Skeleton Minion source supplied by Georg:
`media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_minion.gltf`
at user-supplied revision `e0037d79af9f0546c73cee02e361f78f7d662df2`.

This exact path is repository-readable and already has KFB `legacyAssemble()` evidence.

Georg also supplied these intended visual counterparts:
- `media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb`;
- `media/3D_Assets/KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb`;
- `media/3D_Assets/KayKit_Mystery_Series6/10 - April 2025 - Protagonists/characters/Protagonist_A.glb`.

Current repository manifests/source code confirm canonical Avian, Protagonist_A and Skeleton Minion assets, but the literal raw URLs supplied for these three did not resolve through the GitHub file API at revision `e0037d79…`. Therefore **do not silently rewrite the user's URLs**. RES-DISCO-A must resolve/show the actual current canonical files first and record the exact revision/path it loads.

Action Figure is removed from this disco cast.

## Legacy / rigid-parts rule

The disco Legacy slot is now **Skeleton Minion**, not Prototype Pete.

The proven Resident-band precedent is the important donor:
- Legacy Orc B is a rigid-parts character, not a Medium/Large skinned dancer;
- the accepted band `bounce` is an 8-beat presentation action;
- the band runtime explicitly consumes the bounce clip/body transform without creating a new movement owner;
- the newer Resident-band slice also demonstrates beat-relative counterpoint rather than pretending every performer shares one skeletal dance.

For Skeleton Minion:
- reuse the same **bounce-performance concept** first: vertical body bounce + optional squash/stretch/lean driven by the shared beat clock;
- keep its canonical scene/world anchor stable;
- do not map Medium/Large footwork-heavy Mixamo tracks onto the rigid-parts Legacy source;
- only create a new Legacy skeletal/part action later if the bounce presentation is visibly insufficient.

This is a better first disco proof than using Prototype Pete as a pseudo-character.

## New Mixamo search shortlist

Research target: fill semantic gaps, not collect another generic dance batch.

Verify these names in the logged-in Mixamo library before download:

### High priority
1. **Cheering** — two-fists pump / crowd celebration.
2. **Cheering** — head-banging variant.
3. **Clapping** — standing clap.
4. **Victory** — standing post-win celebration.
5. **Twist Dance** — useful readable retro contrast.
6. **Jumping in Place / standing jump** — bar-hit accent if a clean in-place candidate is available.

### Secondary variety
- Booty Hip Hop Dance;
- Tut Hip Hop Dance;
- Robot Hip Hop Dance;
- additional House / Breakdance / K-pop variants;
- Waving With Both Hands;
- Happy Idle variants;
- headphones / listening-to-music motion if it reads cleanly without a prop.

Preferred search terms:
`dance`, `hip hop`, `house`, `breakdance`, `twist`, `k-pop`, `cheer`, `winner`, `victory`, `clap`, `head bang`, `jumping in place`, `waving both hands`, `headphones`.

Raw Mixamo FBX stays outside the public repository according to the existing KFB Mixamo intake. Only the established runtime outputs/catalogue/profile changes may enter the KFB repository.

## Prop donors

Use source-backed objects before making anything new.

### Audio / speaker choices

1. Exact Tiny Treats radio:
`media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf`

This donor already has an isolation-first KFB history. It can read as the large party radio / boombox after scale and placement are judged; do not remodel its visible controls.

2. Exact Goth Girl speaker:
`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Speaker.gltf`

The speaker can be reused without using Goth Girl as one of the dancers.

3. Optional live-band mode:
reuse the current ORB / KayfaBizarros performance donor from MUSIC-PERF-01 rather than creating a second band module.

### Disco Ball / Party Light Core Module

**Product decision from Georg:** do not treat the disco ball as a one-off scene prop. Build it as a flexible reusable in-game module, analogous in product role to Theatre Curtain Core.

Working module direction: **DISCO-BALL-CORE-01**.

Required capabilities:
- freely placeable / rotatable / scalable scene object;
- continuous configurable rotation plus optional beat/bar impulses;
- own bounded disco-light / beam / spot effects;
- light/effect pattern parameters such as rotation speed, beam count/spread, intensity, range, color/palette source and beat response;
- may hang above a Resident scene but is not owned by that scene;
- reusable in Town, WorldBuilder, Resident events, Birthday/event scenes and later venues;
- consumes the existing world/event lighting budget and VFX semantics rather than creating a second global light owner;
- deterministic fallback if an advanced reflection/light technique is unavailable;
- future **EyeRig host seam** reserved so the ball may later become an eyed/characterful world object without baking eyes into v1.

The Theatre Curtain precedent is architectural, not visual: a reusable core asset with a small consumer seam and explicit states/parameters, independently mountable into host scenes.

Suggested consumer surface, names proposal-only until implementation:

```js
mountDiscoBall(def, { parent, anchor, lightHost, vfxHost })
→ { root, update(beatState), setMode(mode), setSpin(value), impulse(amount), dispose() }
```

Suggested semantic modes:
`OFF · AMBIENT · DISCO · BEAT_PULSE · SPOT_SWEEP · RESET`.

Do not make the Resident Disco scene the canonical owner of the ball. The Resident performance recipe only references/mounts it.

Existing WorldDesign/Birthday disco-ball experiments remain donors/reference. Before integration, show any reusable existing source/implementation in isolation; do not call a newly generated generic sphere the old donor.

## Scene composition

Baseplate-free local module. Host/world supplies support surface.

Suggested blocking:
- wide loose semicircle / dance cluster rather than a straight stage line;
- 2 Large actors toward rear/outer anchors;
- Legacy actor nearer radio/speaker as crowd-hype contrast;
- 3–4 Medium actors across foreground/midground;
- radio/speaker cluster offset from center;
- disco ball overhead but asymmetric;
- optional ORB band placed at one side as a music-source variant, never required by the dance module.

No generic nightclub box, UI podium or mandatory floor mesh.

## Choreography model

Do not give every dancer one eternal `actionRef`.

Extend the existing per-performer choreography concept additively with a small sequence/cue list owned by Animation Studio, e.g.:

```json
{
  "performerId": "action-figure",
  "cues": [
    { "bar": 0, "actionRef": "kfb_dance_wave_hip_hop_a", "bars": 4, "crossfadeBeats": 1 },
    { "bar": 4, "actionRef": "kfb_dance_hip_hop_a", "bars": 4, "crossfadeBeats": 1 },
    { "bar": 8, "actionRef": "kfb_party_cheer_a", "bars": 1, "crossfadeBeats": 0.5 }
  ],
  "beatOffset": 0.5
}
```

The exact field names remain proposal until the current performance owner accepts them. Do not fork `kfb.resident-performance.v1`.

### Musical structure

First working phrase: **32 bars**.

- bars 1–4: dancers enter their individual groove with staggered beat offsets;
- bars 5–8: first action swaps, still asynchronous;
- bar 9: shared cheer/clap hit;
- bars 10–16: second groove layer;
- bar 17: group jump / arms-up accent;
- bars 18–24: pairwise switches / call-and-response;
- bar 25: optional Thriller or other featured non-loop break on one Large actor;
- bars 26–31: full ensemble;
- bar 32: shared victory/cheer hit, then loop to a compatible groove pose.

Avoid robotic clone-sync. Shared hits are synchronized; normal dance cycles are deliberately phase-offset.

### Transition rules

- schedule action changes on beat/bar boundaries;
- crossfade where start/end poses are compatible;
- use measured phase/contact metadata where available;
- do not stretch every clip blindly to the BPM;
- permit modest speed scaling only within visually acceptable ranges;
- longer motion phrases may span multiple bars while still beginning on a known bar;
- non-loop clips require a defined exit action;
- preserve one master song clock.

## Root-motion rules

Preferred fixed dance positions use in-place clips:
Chicken, Hip-Hop, House, Samba, Slide Hip-Hop, Wave Hip-Hop.

Travel clips:
Locking Hip-Hop, Step Hip-Hop, Thriller Part 3.

For travel motions choose one explicitly:
1. author an in-place derivative in Blender; or
2. give the dancer a bounded local dance zone and let the host legally absorb the measured root travel.

Never silently zero root translation at runtime and never allow performers to drift through one another.

## First review modes

The review candidate must expose:

1. **Source Cast** — each selected actor isolated with rig/source identity.
2. **Motion Audition** — chosen actions on the actual actors; no scene dressing needed.
3. **Performance** — ensemble + radio/speakers + pinned disco-ball donor + one song clock.
4. **Timing** — simple beat/bar ruler inherited from MUSIC-PERF, not a DAW.

The user should be able to Play, Scrub and Loop the same master timeline.

## Implementation route

### Phase A · source proof / audition
- show all six/seven real actors in isolation;
- prove actual rig family;
- audition current dance actions on Medium/Large;
- prove one Legacy-safe party action;
- isolate Tiny Treats radio, Goth Girl speaker and the actual existing disco-ball donor.

### Phase B · missing motion intake
Only after A:
- source the smallest missing set, initially Cheer + Clap + Victory;
- optional Twist / Jump if visually useful;
- transfer/retarget through existing Mixamo→Blender pipeline;
- add runtime actions to the existing Motion Library/profile owner;
- do not create a parallel animation folder/catalog.

### Phase C · choreography
- create one `kfb.resident-performance.v1` consumer recipe;
- add per-performer cue sequences behind the existing owner;
- phase offsets + bar hits + crossfades;
- prove 32-bar loop with no hard pops or collisions.

### Phase D · composition
- outdoor host surface;
- source-backed audio prop;
- disco ball;
- optional ORB band variant;
- camera recipe and lighting through existing presentation/world owners.

### Phase E · milestone Stage
Only after coherent local/browser review:
`https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/disco/`

Do not call it public/live until the exact URL has been opened and the expected revision is visible.

## Acceptance

Human review should answer only:

1. Does the ensemble feel like seven different characters having a party rather than seven copies of one dance?
2. Do action changes and shared hits feel musically intentional during Play and Scrub?
3. Do the three rig classes belong together visually without hiding the Legacy limitations?
4. Do radio/speaker/disco-ball/band props make it feel like an outdoor KFB event rather than a generic stage?

Technical gates:
- one music transport;
- source objects shown before composition;
- no second Resident/Motion/Audio owner;
- all selected motions map to real source files/actions;
- travel motions either have authored in-place derivatives or explicit bounded root-motion policy;
- no unverified disco-ball replacement.

## Current unresolved

- Disco Ball Core implementation is now a named reusable-module requirement; existing donor implementation still needs source isolation/pinning before reuse;
- selected song for first disco proof is not yet locked; MUSIC-PERF `Rubbish Groove` is available as a proof clock but should not be silently made the permanent disco track;
- Skeleton Minion Legacy slot starts from the proven beat-driven Orc-band bounce presentation pattern; visual audition decides whether anything beyond bounce is needed;
- new Mixamo shortlist names are research candidates until verified in the logged-in Mixamo interface and exported through the established intake;
- Medium/Large compatibility for Action Figure, Toy Soldier, Witch and Demon Lord must be visually auditioned, not inferred.

## Exactly one next gate

**RES-DISCO-A · Source Cast + Motion Audition.**

Build one direct browser review using the real seven source actors. Show each source actor first. Skeleton Minion uses the proven beat-driven bounce presentation concept; Medium/Large actors audition the already-owned dance clips. Also show the Disco Ball Core donor/source direction separately before integration. Do not import new Mixamo clips or compose the final disco until Georg can judge which character/motion pairings are worth keeping.
