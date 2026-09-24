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

## Proposed first cast

Prefer actors not already used as the current ToolBox Resident-scene examples (Goth Girl, Orc Warband, Animatronic) and not the existing Clown module.

| slot | Resident | rig | role | first motion direction |
|---|---|---|---|---|
| D1 | Prototype Pete | Rig_Legacy | eccentric old-school party / crowd hype | Legacy-safe bounce / cheer / arms-up gesture |
| D2 | Action Figure | Rig_Medium | sharp / toy-like dancer | Hip-Hop Wave ↔ Hip-Hop |
| D3 | Toy Soldier | Rig_Medium | stiff comic contrast | Chicken Dance ↔ House |
| D4 | Witch | Rig_Medium | loose flowing dancer | Samba ↔ House |
| D5 | Black Knight | Rig_Large | heavy groove / visual anchor | House ↔ Hip-Hop Slide |
| D6 | Demon Lord | Rig_Large | big theatrical dancer | Hip-Hop ↔ Wave / featured Thriller break |
| D7 optional | Ultra Turbo Hero Man | Rig_Medium | high-energy accent | Hip-Hop Slide ↔ future Cheer/Victory |

Alternative Large substitution after visual audition: Monstrosity.

Do not infer compatibility merely from rig-family names. Black Knight is already named compatible in the current Motion Library catalogue; every additional actor must be auditioned on the actual source object before being accepted into the scene.

## Legacy rule

`Rig_Legacy` is structurally different: six bones (Body, Head, armLeft, handSlotLeft, armRight, handSlotRight) and 30 embedded Legacy clips, rather than the Medium/Large 23-bone structure.

Therefore:
- do not apply Medium/Large footwork-heavy Mixamo clips directly to Legacy;
- do not generic-rerig Legacy;
- Prototype Pete should initially use a Legacy-native or deliberately authored upper-body party gesture;
- if a named Legacy party motion is missing, route exactly that motion through the established Blender/Mixamo retarget boundary and return it as a reusable Legacy Action.

This makes the three rig classes visible without pretending they share one skeleton.

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

### Disco ball

A disco ball is visibly implemented in the existing WorldDesign Lab lineage and repeatedly specified in the Birthday/World Design source, but current repository search has not yet resolved a canonical reusable object/module path.

Rule:
- first isolate and show the actual existing disco-ball source object/implementation;
- if it is a reusable authored object, use it;
- if it is only a one-off procedural construction, extract/adapt that exact mechanism through the existing World/Presentation owner rather than inventing a replacement;
- rotation is presentation choreography, not a second physics owner.

Status: **DONOR_IMPLEMENTATION_TO_PIN before integration**.

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

- exact reusable disco-ball implementation path still needs source pinning;
- selected song for first disco proof is not yet locked; MUSIC-PERF `Rubbish Groove` is available as a proof clock but should not be silently made the permanent disco track;
- Prototype Pete needs a specific Legacy party action selection/authoring decision;
- new Mixamo shortlist names are research candidates until verified in the logged-in Mixamo interface and exported through the established intake;
- Medium/Large compatibility for Action Figure, Toy Soldier, Witch and Demon Lord must be visually auditioned, not inferred.

## Exactly one next gate

**RES-DISCO-A · Source Cast + Motion Audition.**

Build one direct browser review using the real six/seven source actors. Show each source actor first, then audition only the already-owned dance clips plus one Legacy-native party motion. Do not import new Mixamo clips or compose the final disco until Georg can judge which character/motion pairings are worth keeping.
