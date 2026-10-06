# KFB Audio World Integration Contract 01

Date: 2026-10-06
Status: PREPARED CONSUMER CONTRACT · NO WORLD RUNTIME WRITE
Owner: KFB Audio / Jukebox / Mixer
Receiving consumer: KFB WorldBuilder / WB2 · PR #348
Audio source: KFB Audio Site Source 0.3 / PR #365
Purpose: make the new adaptive audio layer consumable by the running Open World without creating a second audio owner.

## 0. Core ownership rule

WORLD OWNS FACTS.
AUDIO OWNS MUSICAL INTERPRETATION.

The World may publish:
- where the player is;
- what biome/zone/world is active;
- movement / drive / airborne state;
- dialogue / Resident / Billboard focus;
- work / race / action / threat intensity;
- time of day / weather;
- POI proximity;
- discrete gameplay events.

The World must NOT own:
- track IDs;
- stem gains;
- BPM;
- beat/bar/phrase scheduling;
- crossfade times;
- orchestration presets;
- TTS duck amount;
- EQ values;
- AudioNodes / GainNodes;
- the MusicClock.

The KFB Audio owner resolves those.

## 1. Why this contract is needed

Current WB2 consumer:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/wb2-musical-world.v1.js`
blob: `4142a1d08130169a7a93f0ede34056f114022328`

It currently:
- reads player/world/drive state directly;
- derives zone identity itself;
- chooses catalog track IDs itself;
- schedules transitions itself;
- owns world-specific palette mapping.

That is acceptable historical evidence but does not scale cleanly to 100+ worlds.

Target:
```
World / Resident / Billboard / Drive
             |
             v
      AudioContextState v1
             |
             v
      KFB Audio Resolver
             |
             v
 Music function / World profile
 stems / clock / transitions / mix
             |
             v
     ONE existing audio graph
```

## 2. Required portable module boundary

Before broad World adoption, KFB Audio should expose one DOM-free repository-resident runtime module derived from the Site-green implementation.

Suggested owner package:
`tools/KFB-ToolBox/audio/runtime/`

Suggested exports:

```js
createKfbAudioRuntime({
  audioContext,
  destination,
  assetBaseUrl,
  onError
})

runtime.setContext(audioContextState)
runtime.emit(event)
runtime.speak(text, meta)
runtime.getCapabilities()
runtime.getEvidence()
runtime.suspend()
runtime.resume()
runtime.dispose()
```

The browser Site UI remains a consumer of this runtime package.
The World becomes another consumer.
Do not make the World import Site DOM/UI code.

Until this portable runtime is extracted, PR #365 remains the tested reference implementation and Site Source 0.3 remains the behavior proof.

## 3. World -> Audio snapshot

Schema: `kfb.audio.context.v1`

Send event-driven updates, coalesced to max ~10 Hz for continuous values.
Do not push a new object every render frame if nothing meaningful changed.

Required shape:

```js
{
  schema: "kfb.audio.context.v1",
  seq: 1042,
  timestampMs: 1791280000000,

  world: {
    worldId: "world.protopia",
    clusterId: "golden-corridor",
    biomeId: "protopia",
    zoneId: "market-west",
    deckId: "embrace_protopia"
  },

  environment: {
    timeOfDay01: 0.72,
    dayPhase: "evening",
    weatherId: "clear",
    weatherIntensity01: 0
  },

  movement: {
    mode: "DRIVE",
    speed01: 0.63,
    drive: true,
    airborne: false,
    verticality01: 0.1
  },

  social: {
    dialogueActive: false,
    sourceType: "NONE",
    sourceId: null,
    intensity01: 0
  },

  activity: {
    action01: 0.2,
    race01: 0.4,
    threat01: 0,
    work01: 0,
    crowd01: 0
  },

  poi: {
    id: "poi.market.tree",
    type: "SIGNATURE",
    proximity01: 0.35
  },

  tags: ["market", "social", "outdoor"]
}
```

Unknown optional fields are ignored.
Missing optional fields fall back to neutral values.

## 4. Audio-side functional resolution

World does not send B/C/D/G/H/etc.

It sends context.

KFB Audio resolves the functional music state.

Initial resolver concept:

- active addressed dialogue / Resident / Billboard speech -> TALKING
- active Fluff/NPC work -> WORK
- high race/action/stunt state -> ACTION / RACE
- sustained movement / Drive -> MOVEMENT
- low movement / POI / exploration -> STAYING

The Audio registry maps these functions to currently available Styles and world-specific profiles.

Example:
```
MOVEMENT -> B or world-specific movement arrangement
STAYING  -> C
TALKING  -> D
WORK     -> L when available, otherwise profile fallback
RACE     -> H when available, otherwise movement/action fallback
EVENT    -> I/J/K/etc only when the profile declares them
```

G is an orchestration/intensity family, not something the World hard-codes.

## 5. Hysteresis / anti-thrash

The Audio resolver owns stability.

Suggested defaults, data-driven:
- TALKING enters immediately or at the nearest safe boundary;
- TALKING exits after a short quiet hold and safe musical boundary;
- MOVEMENT requires sustained meaningful motion;
- STAYING requires sustained low motion;
- biome/zone changes prefer phrase/bridge boundaries;
- day/night/weather normally modulate vertically before forcing a track switch.

Do not encode these thresholds in WB2.

## 6. Event channel

Snapshot = durable state.
Event = one discrete fact.

Schema: `kfb.audio.event.v1`

Examples:
- ENTER_ZONE
- EXIT_ZONE
- POI_DISCOVERED
- DIALOGUE_START
- DIALOGUE_END
- VEHICLE_ENTER
- VEHICLE_EXIT
- STUNT_LAUNCH
- AIRBORNE
- LANDING
- IMPACT
- RACE_START
- RACE_END
- WORK_START
- WORK_STOP
- CROWD_REACTION
- CARD_ACQUIRED

Example:
```js
runtime.emit({
  schema: "kfb.audio.event.v1",
  seq: 77,
  type: "LANDING",
  sourceId: "player.vehicle",
  intensity01: 0.84,
  timestampMs: performance.timeOrigin + performance.now(),
  meta: { airtimeMs: 1380 }
});
```

The event does NOT dictate:
- which sample/stinger;
- when in the bar it must happen;
- what the orchestra does.

Audio decides whether to:
- play immediate SFX;
- alter stems;
- schedule a musical accent;
- ignore the event.

## 7. Dialogue sources

All addressed speech should use the same social/speech-focus seam.

`social.sourceType` values:
- RESIDENT
- BILLBOARD
- NARRATOR
- PLAYER_UI
- NONE

Resident and Billboard systems do not implement their own music ducking.

They signal:
```
dialogueActive = true
sourceType = RESIDENT | BILLBOARD
sourceId = canonical identity
```

KFB Audio owns:
- TTS / voice focus;
- ducking;
- spectral speech space;
- D-style conversation layer behavior;
- restore boundary.

## 8. World / biome / 100+ worlds scaling

Do not map world IDs in the World runtime to track IDs.

KFB Audio owns a registry:

```
worldId
 -> worldMusicProfileId
 -> cluster palette
 -> biome modifiers
 -> day/night/weather modifiers
 -> function arrangements
 -> hero/event cues
```

Suggested profile fields:
- worldId
- clusterId
- signatureMotifIds
- orchestrationPreset
- instrumentPalette
- harmonicBias
- tempoBias
- functionMappings
- biomeModifiers
- dayNightProfile
- weatherProfile
- heroCueRefs
- fallbackProfile

A new world should usually require DATA, not World runtime code.

## 9. Capability negotiation

World must not assume every Style or Stem family exists.

At boot:
```js
const caps = runtime.getCapabilities();
```

Minimum useful result:
```js
{
  schema: "kfb.audio.capabilities.v1",
  contextSchema: "kfb.audio.context.v1",
  eventSchema: "kfb.audio.event.v1",
  adaptiveMusic: true,
  speechFocus: true,
  quantizedTransitions: ["NOW","BEAT","BAR","PHRASE"],
  functions: ["MOVEMENT","STAYING","TALKING"],
  optionalFunctions: ["WORK","RACE","EVENT"],
  worldProfiles: true
}
```

If a function is unavailable, Audio chooses its fallback.
World does not branch on individual track assets.

## 10. Evidence / telemetry seam

For WB2 QA, expose only read-only evidence:

```js
runtime.getEvidence()
```

Recommended:
- context sequence currently applied;
- resolved function;
- resolved world profile;
- current music family/cue;
- current MusicClock epoch;
- beat/bar/phrase;
- pending transition;
- active stem roles;
- speechFocus;
- AudioContext owner/state/count;
- current errors;
- recent transition/event log.

This allows the World critic to prove continuity without owning the mixer.

## 11. Migration from current WB2 musical world

KEEP from current `wb2-musical-world.v1.js`:
- one shared graph principle;
- physical ambience intent;
- voice focus behavior;
- evidence logging;
- world continuity requirement.

MOVE OUT of WB2:
- `PALETTE` track mapping;
- track ID selection;
- phrase scheduling;
- track loading policy;
- world-specific music decisions.

REPLACE direct World inspection inside Audio with:
```
wb2 audio-context-adapter
   -> setContext(snapshot)
   -> emit(event)
```

The WB2 adapter may read WB2 internals because it is the World-side translator.
The KFB Audio runtime may not.

## 12. Minimal WB2 adapter responsibilities

One small World-owned adapter:
`audio-context-adapter.v1.js`

Responsibilities:
- read existing WB2 truth;
- normalize values to 0..1;
- assign stable world/biome/zone/source IDs;
- emit context only when meaningfully changed;
- emit discrete events;
- never access audio assets/nodes/clock.

Pseudo:
```js
const bridge = createWorldAudioContextAdapter({ world: A });

function update(dt) {
  bridge.sample(dt);
  if (bridge.changed()) audio.setContext(bridge.snapshot());
}

resident.onDialogueStart = id =>
  audio.emit({ type:"DIALOGUE_START", sourceId:id });

resident.onDialogueEnd = id =>
  audio.emit({ type:"DIALOGUE_END", sourceId:id });
```

## 13. Integration order for the running Open World One-Shot

Do not interrupt the current Integrator with an Audio subsystem rewrite.

Recommended:
1. keep current world boot/audio continuity working;
2. add the World-side context adapter behind the existing audio seam;
3. expose snapshots/evidence without changing audible behavior;
4. inject the portable KFB Audio runtime once repository-resident;
5. run B/C/D context transitions;
6. add world profile / biome / day-night data;
7. add G/H/L/etc only as capabilities become real;
8. retire old WB2 track-selection code only after parity is proven.

This allows additive migration instead of a flag day.

## 14. P0 integration tests

Required:
- one and only one active AudioContext;
- World has zero track IDs and zero stem gains in its new adapter;
- context update <= 10 Hz continuous, events immediate;
- movement -> staying -> talking -> movement does not thrash;
- Resident and Billboard speech use same Speech Focus owner;
- dialogue does not pause/restart music;
- biome/zone transition preserves one audio owner;
- Save/reload does not duplicate audio runtime;
- Vehicle enter/exit does not duplicate transport;
- muted/unclassified stems remain muted;
- missing Style capability falls back safely;
- world boot survives optional adaptive-audio failure;
- evidence identifies exact context seq + resolved function.

## 15. No-touch boundaries

This preparation does NOT authorize:
- changes to PR #348 by the Audio slice;
- replacing WB2 core;
- a second mixer;
- a second MusicClock;
- a second AudioContext;
- cross-site iframe audio;
- Audio Site UI inside World;
- Hub/Cloudflare changes;
- hardcoded 100-world track tables in WB2.

## 16. Next implementation seam

The missing reusable artifact is:

**DOM-FREE KFB AUDIO RUNTIME PACKAGE**

derived from the Site-green Source 0.3 code, with:
- existing-context injection;
- context/event API from this contract;
- MusicClock;
- adaptive stem engine;
- speech focus;
- world-profile resolver;
- evidence API;
- no Site DOM dependency.

Until that exists, the current Open World Integrator should consume only this contract and keep audio integration additive.
