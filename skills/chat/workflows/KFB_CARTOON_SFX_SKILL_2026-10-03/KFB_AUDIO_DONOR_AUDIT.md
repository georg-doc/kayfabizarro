# KFB Cartoon SFX · Existing Donor / Asset Audit

Status: RESEARCH CHECKPOINT B
Verified: 2026-10-03
Workflow: KFB-SFX-LANGUAGE-SKILL-01
Branch: chatgpt-web/kfb-sfx-language-skill-01-2026-10-03

This audit prevents the SFX skill from inventing a second audio engine or assuming KFB lacks source material.

## 1 · Verified owner heads

At research checkpoint:

- `georg-doc/kayfabizarro` main: `9b3e8b46aff5f1eeb24ea0f1070ffd3c9da969b2`
- `georg-doc/KFB-Combat-Arena` main: `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`
- `georg-doc/KFB-Stunt-Car-Race` main: `df1e35b5692273e8a48eaa219697c927e2c39faa`
- `georg-doc/KFB-Travel-Globe` main: `8614282aab2ced43bb5dda9fcf7abadf9768100a`

The shared skill must not move runtime ownership out of those consumers.

## 2 · Shared audio inventory is already large

Recursive tree audit at kayfabizarro main `9b3e8b4...`:

- **1,783** paths under `media/3D_Assets/Audio/`
- **1,687 actual audio files** by `.wav/.ogg/.mp3/.flac/.m4a/.aac` extension
- the difference is directories/manifests/docs, not missing audio

Selected existing file-family counts:

| Family | actual audio files |
|---|---:|
| S050C Arcade Shooter | 194 |
| Kenney impact sounds | 130 |
| Musical Effects | 111 |
| Kenney interface sounds | 100 |
| Kenney music jingles | 86 |
| Classic Arcade SFX Complete | 213 |
| Classic Arcade SFX | 80 |
| Kenney sci-fi sounds | 73 |
| curated | 59 |
| Kenney casino audio | 55 |
| Kenney RPG audio | 52 |
| Kenney fighter voiceover | 47 |
| Materials | 33 |
| Footsteps | 33 |
| UI | 30 |
| Retro | 25 |
| Environment | 24 |
| Items | 24 |
| KFB Racer | 19 |
| Combat and Gore | 17 |
| Human | 17 |
| Weapons | 15 |

### Consequence

**Asset scarcity is not the primary global failure.**

The immediate quality problem is mostly:

- weak semantic mapping;
- single-file event design;
- inappropriate substitutions;
- no consistent material/energy recipe;
- too little variation;
- no stable signature palettes;
- procedural tonal placeholders where recorded texture is required;
- insufficient listening acceptance.

Source acquisition should follow an explicit gap audit, not precede curation.

## 3 · Shared catalog debt

### `media/3D_Assets/Audio/sfx.json`

Current shared semantic manifest is intentionally tiny and mostly maps one semantic key to one file.

Observed semantic families include:

`card, land, step, roll, jump, boost, coin, hit, ui, confirm, error, win, gutterFall`.

The manifest itself records placeholder debt for some events.

This is useful as a compatibility shim but inadequate as the long-term SFX design language.

Do **not** destructively replace it in this skill slice.

The future migration is:

```text
legacy key
→ semantic event adapter
→ material/energy recipe
→ variant pools/layers
```

### `media/3D_Assets/Audio/ui-sfx.json`

UI SFX already contains useful debounce/rate/polyphony concepts and silent-by-default events.

The Audio baseline PR #205 contains a known path repair that is not duplicated here.

UI remains a distinct, mostly non-spatial family.

## 4 · Useful material banks already present

### Footsteps

Current bank includes repeated material variants such as:

- digital: grass, gravel, snow, wood;
- Foley: carpet, concrete, gravel, vinyl;
- Kenney impact pack: carpet, concrete, grass, snow, wood.

There are already multiple takes per material.

### Materials

Examples in `media/3D_Assets/Audio/Materials/` include:

- aluminium can pickup/place;
- bamboo drop;
- cardboard drop/hit/pickup/push/tear;
- ceramic open/close;
- clothing movement/thud;
- concrete scrape;
- glass ping;
- metal tap/clang;
- paper movement/scrunch/tear;
- pottery clang;
- stone push;
- wood drop/hollow/pickup.

### Kenney impact bank

Existing families include multiple takes and several energy classes for:

- bell;
- generic;
- glass;
- metal;
- mining;
- plank;
- plate;
- punch;
- soft;
- tin;
- wood.

This bank should be curated into material/energy pools before generating generic synthetic replacements.

## 5 · Combat Arena donor

Current useful files include:

- `docs/AUDIO-SOURCES-v4.json`
- `modules/kfb-arena-sfx.v4.json`
- `modules/kfb-combat-sfx.v2.json`
- `modules/kfb-mech-audio.js`
- `modules/kfb-sfx-layers.js`
- `combat-arena-v1/vfx-sfx.v1.js`

### Keep

Combat already demonstrates:

- semantic cue names;
- player/UI vs spatial world distinction;
- Dry/Wet source policy;
- source provenance;
- impact energy/material keys;
- priority;
- debounce;
- polyphony;
- distance attenuation;
- spatial low-pass/pan;
- common pitch shift across simultaneous layers;
- optional per-event ducking;
- explicit continuous sound lifecycle;
- missing-cue diagnostics.

A particularly valuable current rule in `kfb-sfx-layers.js`:

> missing `impact.*` material cues do not silently fall back to earth.

That rule exists because the old fallback made dissimilar materials sound falsely identical.

### Do not canonize blindly

Current Combat material mappings are still shallow. Some semantically distinct materials reuse unsuitable source sounds.

Also, an internal runtime RMS normalization choice is implementation-specific and is **not** promoted as an industry/KFB-wide loudness standard by this skill.

### Ownership

Combat still owns:

- contact truth;
- damage;
- attack state;
- target identity;
- combat telemetry;
- its runtime SFX adapter.

The shared skill provides recipe vocabulary, not a Combat replacement.

## 6 · Stunt Car Race donor and hard negative evidence

### A2 contact lab

The A2 candidate correctly implemented stateful:

`startContact → updateContact → stopContact`

with parameters such as speed/intensity/slip/roughness/cartoon/pan/material.

Technically it passed a substantial automated/browser test surface.

### Human listening result

Georg rejected the sustained synthetic voices as approximately:

**“halbgares Flöten und Fiepen”**

Affected classes included:

- tire squeal;
- brake scrub;
- body scrape;
- rail grind;
- metal screech.

This is critical product evidence.

### Canonical lesson

For sustained friction/contact:

```text
real / stochastic / granular texture
  = primary audible material

procedural synthesis
  = optional modulation / coloration / sweetener
```

Do not make resonant oscillators the main identity of tire rubber, dragging metal or rail grinding merely because they react nicely to telemetry.

### A3 direction worth retaining

Race's later research correctly moves toward:

- real-source tire categories such as chirp/scrub/squeal/lockup/burnout;
- slip-energy crossfades;
- granular/texture playback;
- ENTER/SUSTAIN/EXIT state;
- material/intensity impact variants;
- cartoon layer as secondary accent.

Race remains physics/contact owner.

## 7 · Travel donor

Travel's existing audio modules remain useful for:

- one active AudioContext/runtime owner;
- jukebox/sample-bank behavior;
- ambient layering;
- sample-first SFX;
- explicit fallback behavior;
- narrator/voice coexistence.

The shared SFX skill does not replace Travel's audio system.

## 8 · AUDIO-CAL-01 is the accepted mix reference

Workflow:

`skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/`

Human state:

**AUDIO-CAL-01 · HUMAN_ACCEPTED**

The accepted semantic roles remain:

`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`

Therefore the SFX skill must plug into that conceptual mix layer.

It must **not** create another universal mixer/bus hierarchy simply to implement material recipes.

## 9 · Gap classes after curation

New sound acquisition is justified when a recipe exposes a real hole.

Likely current gaps include:

1. sustained real/stochastic tire rubber families;
2. longer clean scrape/grind source textures across several materials;
3. more coherent character/Resident signature Foley families;
4. selected sci-fi mechanism/energy signatures that can become KFB motifs;
5. specific water/mud/slime hybrid movement where existing clips cannot cover phase/energy variation;
6. coherent break/debris families for common KFB destructibles;
7. actor-size variants where a single take sounds implausible across tiny/huge actors.

Each new source must have:

- provenance;
- license;
- exact file identity;
- semantic family;
- material family;
- energy/size coverage;
- dry/wet classification;
- loop/sustain suitability;
- listening admission.

## 10 · Proposed shared data separation

Keep four kinds of truth separate.

### A · Source catalog

What audio files exist?

```text
asset id
path
license
provenance
duration
channels
dry/wet
tags
```

### B · Semantic material profile

What should a material sound like?

```text
family
hardness
resonance
roughness
granularity
wetness
hollowness
mass feel
friction
debris/break traits
```

### C · Event recipe

Which functional layers should this event request?

```text
event family
phase
energy/size ranges
source material contribution
target material contribution
variant pools
functional layer budget
signature layer
tail policy
priority/concurrency class
```

### D · Consumer adapter

How does the current game runtime deliver truthful telemetry and play the recipe?

This stays in Combat, Race, Travel, Town, Boxel or the relevant consumer.

## 11 · Donor admission rule

A public repo or KFB donor is admitted only after checking:

```text
[ ] exact source/revision
[ ] license/provenance
[ ] owner compatibility
[ ] no duplicate runtime owner
[ ] source object/module inspected in isolation
[ ] pattern actually fits target event
[ ] listening evidence where sonic quality is claimed
```

Loaded URLs or passing tests are not enough.

## 12 · Audit conclusion

The first implementation target should **not** be “generate hundreds of new sounds.”

It should be:

**build the shared semantic SFX language + recipe contract, then prove it by curating existing KFB banks into a bounded listening fixture.**

That fixture can reveal the true remaining acquisition gaps with far less risk of adding another layer of generic audio.
