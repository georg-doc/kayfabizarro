# CONSUMER PACKET · KFB Audio Module Pre-Integration

Date: 2026-10-06
Status: AUDIO-OWNED MODULE · WORLD ADAPTER NOT IMPLEMENTED
Owner: KFB Audio / Jukebox / Mixer
Receiving consumer later: exact returned Open World / WB2 product

## One host seam

The future World-side adapter supplies the already existing AudioContext and SCORE destination, then sends only versioned context snapshots and events.

```js
import { createKfbAudioRuntime } from './kfb-audio-runtime.mjs';
import registry from './runtime-registry.v1.json' with { type: 'json' };

const audio = createKfbAudioRuntime({
  audioContext: existingAudioContext,
  destination: existingScoreBus,
  assetBaseUrl: existingAssetResolver,
  registry,
  onError: reportAudioError
});

await audio.setContext(worldSnapshot); // kfb.audio.context.v1
await audio.emit(worldEvent);          // kfb.audio.event.v1
```

The adapter does not call `loadFamily()`, `applyPreset()` or `setSpeechFocus()` and does not send track IDs, family IDs, BPM, stem roles, gains or transition timing.

## Adapter responsibilities

- read actual World facts after the exact Coworker Return exists;
- normalize them into `kfb.audio.context.v1`;
- coalesce unchanged continuous context to at most about 10 Hz;
- send discrete `kfb.audio.event.v1` events immediately;
- inject the one existing AudioContext and SCORE bus;
- dispose one runtime when its owning World session ends.

## Audio responsibilities

- resolve Movement to G;
- resolve Staying/day to M, with C as verified fallback;
- resolve Dusk/night to N;
- resolve `POI_DISCOVERED` to O;
- resolve Resident/Billboard dialogue to D + Speech Focus;
- keep host TTS ducking authoritative and add only complementary music gain/EQ/transient restraint;
- schedule one MusicClock, shared stem loop ends, crossfades and master fallbacks;
- retain the current verified family or silence when a requested capability is unavailable.

## Ownership guarantees

- injected AudioContext only;
- module-created AudioContexts: zero;
- no DOM/window/document dependency in runtime/resolver;
- no WB2 import;
- no Audio Site UI dependency;
- no second mixer or MusicClock owner;
- no World code in this packet.

## Public evidence seam

`getCapabilities()` reports only runtime-verified families and contract versions.

`getEvidence()` reports the applied context/event sequence, resolved function/family, current clock, shared loop metrics, playback mode/master fallback, Speech Focus, ownership and bounded errors/logs.

## Gate

Do not implement the World adapter until the exact Claude Coworker Return/branch/head is visible. The Anschluss-Integrator then maps those returned facts into this contract without guessing architecture.
