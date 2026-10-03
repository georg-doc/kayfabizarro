# KFB Jukebox Music Graph v1 · Proposal

**Status:** PROPOSAL · SOURCE-INVENTORIED · IMPLEMENTATION NOT STARTED  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Canonical catalog owner:** `media/3D_Assets/Sounds/jukebox.json`  
**Runtime donor:** `georg-doc/KFB-Travel-Globe/travel/globe-v13/travel-audio.js`  
**Date:** 2026-10-03

## Georg decision

All authored songs should be retained and made available through the KFB Jukebox rather than selecting a single winner and discarding alternates.

Current RoadTrip-v2 source snapshot on `main`:
- **42 master MP3s**;
- **12 master+stem families**;
- three newly uploaded master+stem families:
  - `Beetle-Wrestling Entrance 01` · 118 BPM · 11 stems;
  - `Beetle-Wrestling Entrance` · 119 BPM · 10 stems;
  - `Surf Groove 3min` · 100 BPM · 11 stems.
- `Beetle-Wrestling Entrance 01` is deliberately retained as a longer alternate, not a replacement for the shorter signature-theme result.
- one additional Jazz track is still being authored in Suno and can enter through the same intake later; it does not block the catalog design.

## Core architecture

### 1. Jukebox = canonical music catalog

Keep one catalog owner. Extend the existing `jukebox.json` schema additively; do not create a second music registry.

Every track may carry optional metadata while preserving the fields current Travel already consumes:
- `id`
- `title`
- `file`
- `bpm`
- `loop`

Add optional fields:
- `family` / `variantOf`
- `role`: radio | score | signature | resident | biome | event | vocal | reference
- `instrumental`
- `stems` and `stemPolicy`: none | source-only | certified
- `moods`
- `biomes`
- `residents`
- `activities`
- `timeOfDay`
- `autoRadio`
- `collectible`
- `styleRefs`
- provenance / prompt reference.

**Master audio remains Ground Truth.** Stems are optional source material. No cross-song stem remix is implied.

### 2. Catalog is not unlock state

All songs can exist in the canonical library without being immediately unlocked for the player.

Unlock/discovery is gameplay state:
- heard on a radio;
- gifted/performed by a Resident;
- discovered in a biome/location;
- earned after an event;
- collected as a song/memory artifact.

The runtime should store only the track ID + provenance event, never duplicate the audio asset.

### 3. Lean Memory → Fractal Almanac

Use the existing lean-memory/MomentReceipt direction.

A compact music receipt can record:
- `trackId`
- `residentId` / `biomeId`
- discovery/event type
- world/session seed
- location/context
- first-heard / last-heard
- optional replay/favorite state.

The Fractal Almanac can surface that receipt as a **music memory / media artifact**, pointing back to the canonical Jukebox track. It does not need to pretend every song is a Card or copy the MP3 into memory.

### 4. Auto-radio = deterministic selector, not another audio engine

Reuse Travel's current Jukebox/AudioContext owner.

Replace simple linear/random track choice with a deterministic weighted selector that reads:
- currently unlocked tracks;
- biome;
- nearby/active Resident;
- activity/mode;
- time/weather/story tone;
- recent-play suppression;
- explicit user choice;
- stable world/session seed.

Use a seeded shuffle-bag / weighted PRNG so the radio feels varied but a replay can reconstruct the same sequence from the same seed/context.

Audio state remains read-only with respect to gameplay truth.

### 5. Biome / Resident signature soundscape

A `SoundscapeProfile` should reference, not duplicate:
- one or more Jukebox master tracks;
- ambience/global-bed assets;
- local prop/foley loops;
- event stings;
- optional Resident instrument or sonic motif.

This lets a Graveyard, Orc street corner, Beetle wrestling ring or individual Resident bias the radio and ambience without owning a second player.

### 6. Master references + style pool

Use complete authored masters as **style references**.

A style pool may say, for example:
- 40% psychedelic surf;
- 30% electro-funk;
- 20% rockabilly;
- 10% strange jazz.

At runtime this should normally mean **selection / sequencing / weighting of whole masters plus non-pitched ambience**, not arbitrary simultaneous cross-song stem blending.

Safe mixing rules:
- whole master + ambience/SFX = yes;
- whole master + Resident/biome one-shot/sting = yes;
- certified stems from the **same** master = yes;
- stems from different songs = no by default;
- cross-song pitched mixing only after explicit key/chord/phrase compatibility certification.

## Proposed first implementation slice

### KFB_JUKEBOX_CATALOG_01

Goal:
- extend the existing canonical `jukebox.json` to cover all current RoadTrip-v2 master songs;
- preserve all current legacy entries;
- attach master/stem/provenance metadata;
- tag the three new families correctly;
- make `Beetle-Wrestling Entrance` and `Beetle-Wrestling Entrance 01` siblings, not replacements;
- keep the not-yet-uploaded Jazz track as a normal later intake;
- add a deterministic-selector contract, but do not yet change Travel playback.

Done when:
- every current master resolves;
- every declared stem directory resolves;
- duplicate IDs/files are rejected;
- schema remains backward-compatible with current Travel;
- no second AudioContext/player/catalog owner is introduced.

No public Stage is required for the catalog-only slice.
