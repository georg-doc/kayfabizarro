# KFB ChatterBox Voice Layer · Integration Contract v1 · 2026-10-08

Status: **PRODUCTION INTEGRATION PREP**
Owner: **existing KFB ChatterBox output seam**
Audio authority: **existing KFB Audio owner**
Runtime implementation: **not in this planning commit**

## 1 · Purpose

Add characterful speech to KFB ChatterBox without changing what ChatterBox says or who owns playback/mixing.

The Voice Layer is a consumer of semantic dialogue and Resident affect.

It never becomes:
- a dialogue generator;
- a Resident state machine;
- a Card/deck owner;
- a bubble renderer;
- an AudioContext/mixer;
- a music/ducking authority.

## 2 · Cross-product donor relation

The DocCheck handover defines the useful shared abstraction:

`Text → normalization → pronunciation → casting → provider → cache → playback`.

For KFB, reuse the **interface pattern**, not DocCheck runtime ownership.

DocCheck VoiceIO continues to own DocCheck microphone/playback.
KFB Audio continues to own KFB AudioContext/mix/ducking.
The two products may share provider/casting conventions without sharing one live runtime.

## 3 · KFB source flow

```
Canonical Deck/Card refs + World/POI/Event facts
        ↓
Resident identity + chatterProfileRef + Affect
        ↓
existing KFB ChatterBox semantic selection
        ↓
visible bubble text / Triplet roles / silence
        ↓
VOICE REQUEST (output only)
        ↓
pre-render fragment set
  OR pre-render Whole line
  OR optional injected live provider
  OR browser speech fallback
        ↓
onBeat → existing bubble presentation
onSpeaking → existing mouth/performance + KFB Audio ducking
```

## 4 · Voice request · proposed adapter record

```js
{
  utteranceId,          // stable event/line instance id
  residentId,
  voicePreset,          // stable casting key, not sex/gender
  emotion,              // current Resident Affect id
  intensity,            // 0..1 when available
  register,             // speech | whisper | thought
  segments,             // source-backed Triplet/template segments when known
  lineId,               // stable pre-render Whole id when available
  text,                 // exact visible text; never rewritten in presentation
  sourceRefs,           // Card/deck/phrase/triplet provenance
  playbackPolicy        // auto | silent | preview
}
```

The adapter may derive provider-specific text for pronunciation, but the visible `text` remains source truth.

## 5 · Stable fragment identity

Current donor key:
`archetype|emotion|segmentIndex|normalizedText`.

For production, do not rely on normalized text alone as semantic identity.

Recommended source relation:
```
voiceAssetId
  → canonical phrase/triplet part ID
  → exact rendered text revision
  → voicePreset
  → emotion
  → slot/position
  → render recipe/version
```

Normalized text remains a lookup/cache aid, not the provenance key.

Reason:
- canonical wording can change;
- the same words in different source roles may need different cadence;
- Card/deck provenance must survive;
- regenerated audio must be invalidated when source text or render recipe changes.

## 6 · Resolver order

Preserve donor order:

1. **fragments** — every source-backed segment exists;
2. **whole** — accepted pre-rendered Whole line;
3. **live** — optional injected provider for genuinely runtime-created text;
4. **browser** — final availability fallback.

Thought bubbles default to silent.
Whisper may resolve to a whisper-specific accepted preset or remain browser/quiet fallback until proven.

## 7 · Voice tiers

### Tier A · deterministic pool speech
Canonical fixed phrase/Triplet material.

Preferred:
pre-rendered static files + manifest.

Benefits:
- zero runtime synthesis cost;
- deterministic;
- works on local/GPT Site/static mirror;
- easy to cache and audit.

### Tier B · curated event calls
Short player/Resident calls such as:
- Kayfa-BINGO!
- Kayfa-BOGGLE?
- Kayfa-BONGO!
- BLÖDSINN!
- What the FLUFF?!
- Stay fluffy!

These are semantic event assets, not generic UI bleeps.

Existing ElevenLabs Roger/Siren calls remain an optional curated asset pool behind the same manifest/provenance layer.

### Tier C · runtime-created free text
Only when the final line does not resolve to accepted static audio.

Provider is injected.
ElevenLabs may be tested here or for Hero/Golden lines, but it is optional and never a ChatterBox dependency.
API keys stay server-side.
Failure falls through to browser speech.

## 8 · Emotion semantics

The canonical emotional vocabulary is Resident Affect, not provider tags.

Current 15 IDs:
`calm, curious, attentive, joyful, amused, grateful, proud, surprised, worried, sad, annoyed, angry, embarrassed, suspicious, tired`.

Provider adapters translate these IDs to provider-specific settings/tags.

Do not persist external provider markup as ChatterBox semantic truth.

## 9 · Casting

Donor's 11 archetypes are audition presets:
- troll
- orc
- robot
- vampire
- skeleton
- ghost
- goblin
- demon_lord
- lorekeeper
- farmer
- witch

They are not automatically KFB Resident canon.

Production mapping must be explicit:
`residentId → chatterProfileRef → voicePreset → provider recipe`.

Per-Resident pitch/rate/FX overrides may exist without duplicating Resident identity.

## 10 · KFB Audio integration

Voice Layer may:
- provide an audio URL/blob/static asset;
- signal start/end speaking;
- expose duration/beat timing.

Voice Layer may not:
- create a parallel AudioContext;
- own music stems/BPM;
- own master gain;
- own score routing.

`onSpeaking(true/false)` is consumed by the existing Audio owner for ducking/speech focus.

## 11 · Presentation integration

`onBeat(i)` may coordinate:
- bubble segment reveal;
- simple mouth open/close;
- EyeRig/gaze/reaction cue;
- optional semantic emanata.

It does not write Affect or ChatterBox state.

Lip sync/visemes are later enrichment.
Stage 1 is speaking activity + bounded amplitude/beat motion.

## 12 · Site/delivery boundary

Do not create a new ChatterBox Voice Site.

First review/bench work must dock into an existing productive KFB surface when authorized:
- existing Audio Site bench, or
- existing ChatterBox specialist/consumer after its HOLD is explicitly reopened.

KFB Production Control may store source/evidence artifacts without changing public product routing.

## 13 · Acceptance for runtime promotion

A future integration slice passes only when:
- three real source-proven Residents use real canonical dialogue material;
- one Resident per future-deck lane is represented where practical;
- source provenance survives into the audio manifest;
- bubbles remain readable without audio;
- valid silence remains possible;
- voice failure falls back without dialogue failure;
- no second AudioContext/mixer/dialogue owner appears;
- one human listening gate compares accepted voice presets and Assembled vs Whole;
- exact shipped voice licenses/attributions are recorded.
