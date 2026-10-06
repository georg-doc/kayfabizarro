# HANDOVER · Coworker / ChatGPT Work/WSA · KFB World Audio Integration · 2026-10-06

Status: READY INPUT · ADDITIVE INTEGRATION ONLY
Primary receiving product: Open World / WB2 · Issue #360 · Draft PR #348
Current execution routing: **Claude Coworker is RUNNING NOW. ChatGPT Work/WSA is the Anschluss-Integrator after Coworker returns.**
Audio owner: KFB Audio / Jukebox / Mixer · Draft PR #365

## Read first

Always fetch current GitHub state before writing:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. Open World reset + integration matrix on PR #348
5. Audio PR #365:
   - `KFB_AUDIO_WORLD_INTEGRATION_CONTRACT_01.md`
   - `KFB_AUDIO_CONTEXT_V1.schema.json`
   - `KFB_AUDIO_EVENT_V1.schema.json`
   - `RUNTIME_PACKAGE_RETURN.md`
   - this handover
6. exact Coworker result / head / evidence when it returns

GitHub state overrides this observed handover state.

## Current pins at handover creation

- main asset source: `276728f3f82f729cd1656b61e81d278856d736bb`
- Open World PR #348 observed head: `3ea6fbd1f81cfb4ff665f609b27825cd84e18cde`
- Audio PR #365 source before this handover: `846853b21db409d07837efb628e3d2ef7bbef5d2`

These are audit pins only. Re-fetch before writes.

## Product outcome

Use the KFB Audio layer as an **integration module** inside the Coworker/Open-World result without creating a second audio engine.

World owns:
- world / biome / zone / deck facts;
- movement / drive / airborne state;
- Resident/Billboard/dialogue state;
- time of day / weather;
- POI proximity / discovery;
- activity intensities and discrete gameplay events.

KFB Audio owns:
- function/family resolution;
- track/master/stem choice;
- MusicClock;
- BPM;
- beat/bar/phrase transition boundaries;
- stem gains/orchestration;
- TTS ducking + Speech Focus;
- mix / fallback / silence.

No World code should hardcode M/N/O/G/D track filenames, stem gains or BPM tables.

## New real source families

Canonical source pin:
`georg-doc/kayfabizarro@276728f3f82f729cd1656b61e81d278856d736bb`

### M · General Island Life
`KFB_M_ISLAND_LIFE_ORCHESTRAL_COZY_01`
- **112 BPM actual export**
- master + 10 stems
- intended after QA: STAYING / LIGHT_MOVEMENT / general island life
- mute Lead Vocals + Other until listening classification

### N · Dusk / Night
`KFB_N_DUSK_NIGHT_ORCHESTRAL_COZY_01`
- **70 BPM actual export**
- master + 11 stems
- intended after QA: time-of-day/night profile modifier or alternate low-activity family
- mute Lead Vocals + Backing Vocals until listening classification
- World sends time/day facts; Audio decides when/how N replaces or blends from a daytime family

### O · Discovery / POI
`KFB_O_DISCOVERY_POI_ORCHESTRAL_01`
- **82 BPM**
- master + 9 stems
- intended after QA: POI / Life Tree / landmark / vista discovery
- no vocal-labelled export stems

Source presence: **33/33 real non-empty MP3 files**.

All three are currently:
`SOURCE_PRESENT_RUNTIME_UNVERIFIED`

Do not promote merely because files exist.

## Existing verified runtime families

- G · MOVEMENT · Site/runtime verified
- D · TALKING · Site/runtime verified
- C · Cozy Base source exists but remains runtime-unverified

Do not regress the Site-green G/D behavior.

## Coworker rule

If the long Coworker run is still active when this handover is read:
- do **not** start a parallel Open World rebuild;
- do not rewrite a working Coworker audio seam mid-run unless its architecture has a safe additive module hook;
- preserve the current Coworker result as the receiving product;
- at most wire the versioned World -> Audio context adapter if it is naturally compatible;
- otherwise leave this package for the Anschluss-Integrator.

## ChatGPT Work/WSA Anschluss-Integrator rule

After Coworker returns:
1. ingest the exact Coworker result first;
2. preserve what visually/runtime-wise works;
3. inspect current audio seam in that result;
4. add one World-owned `audio-context-adapter.v1.js` (or exact current equivalent);
5. inject the one existing AudioContext / SCORE destination into the DOM-free KFB Audio runtime;
6. begin with context/evidence parity while existing audible behavior remains intact;
7. validate M/N/O;
8. only then activate data-driven World profile mappings;
9. retire old WB2 track-selection logic only after parity.

No flag-day rewrite.

## Required M/N/O runtime QA before activation

For each family:
- decode every real stem;
- log sample rate / channels / duration;
- max-min duration delta;
- long-loop drift;
- listen to every unclassified vocal/other stem;
- verify no unintended vocals when muted;
- verify phrase-safe enter/exit;
- test master fallback;
- no console/network/audio errors.

Promotion may happen independently:
- M PASS does not require N/O PASS;
- N defect must not block M;
- O defect must not block ordinary island audio.

After two non-improving repair passes, quarantine only the failing family/seam unless it blocks the Open World product outcome.

## Desired World behavior after promotion

### General island roaming
World context:
- low/medium movement;
- no dialogue;
- no race/action;
- normal daytime.

Audio may resolve:
- C or M depending world/profile and availability.
M should carry long island residence without forcing a dramatic event.

### Dusk/night
World sends:
- `environment.timeOfDay01`
- `dayPhase`
- weather facts.

Audio may:
- vertically soften the current mix first;
- move to N on a phrase/bridge boundary when profile says night identity is musically meaningful.

No hard World-side sunset track switch.

### POI / discovery
World sends POI identity/proximity plus `POI_DISCOVERED` event.

Audio decides:
- whether O should enter;
- master vs stems;
- safe musical boundary;
- duration/exit policy.

No fixed reveal sting that predicts animation timing.

## Dialogue priority

Resident/Billboard/Narrator dialogue always outranks island music:
- one speech-focus owner;
- D TALKING behavior;
- music timeline continues;
- M/N/O must yield spectrally/dynamically without pausing.

## Failure isolation / fallback

If M/N/O stems fail alignment:
- keep family SOURCE_PRESENT_RUNTIME_UNVERIFIED;
- master may be used if musically/technically acceptable;
- otherwise keep current verified family or silence;
- never introduce placeholder stems.

If the DOM-free runtime fails:
- preserve current Coworker/WB2 audio continuity;
- log/quarantine the adapter seam;
- do not take down world boot.

## NO TOUCH

Do not:
- create another AudioContext;
- create another mixer or MusicClock;
- import the KFB Audio Site UI into World;
- create a second World runtime;
- modify Production Hub for this routine integration;
- use Cloudflare as substitute;
- redesign Joyride, Skydome, Resident, Billboard or World UI as part of audio work;
- merge/promote Live automatically.

## Acceptance evidence

Return must include:
- exact repo / branch / PR / final head;
- exact Coworker source/result consumed;
- exact Audio PR/source pin consumed;
- changed World-side files;
- context adapter schema/evidence;
- AudioContext owner/count;
- M/N/O decoded metrics;
- vocal/other listening classification;
- tested World states: roaming, staying, night, POI, dialogue;
- transition behavior;
- console/network/audio errors;
- fallback behavior;
- unresolved families/seams;
- one next gate.

## Human gate

Do not manufacture a new technical Georg gate.

Georg is needed only when there is a real audible product choice:
- M as long-session island bed;
- N as dusk/night identity;
- O as discovery/POI mood;
- or a concrete audible defect/tradeoff.

No merge / Live promotion without named authority.
