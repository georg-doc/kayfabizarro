# KFB Audio Runtime · DOM-free integration package

Status: SOURCE-GREEN CANDIDATE
Date: 2026-10-06
Owner: KFB Audio / Jukebox / Mixer

This folder is the repository-resident integration seam derived from the Site-green adaptive audio work.

It deliberately contains:
- no DOM access;
- no Site UI;
- no AudioContext creation;
- no World gameplay reads;
- no hard-coded WB2 object access.

Host requirements:
- inject the existing AudioContext;
- inject the destination/SCORE bus;
- provide asset base URL or resolver;
- provide the runtime registry.

Public API:
- `createKfbAudioRuntime()`
- `setContext(kfb.audio.context.v1)`
- `emit(kfb.audio.event.v1)`
- `loadFamily()`
- `applyPreset()`
- `setSpeechFocus()`
- `getCapabilities()`
- `getEvidence()`
- `suspend()/resume()/dispose()`

Current runtime-verified families:
- G Cosmic Roadtrip Orchestral
- D Conversation Base

C Cozy Base is recorded as source-present but not promoted to runtime capability until the same decode/listening gate is run.

M/N/O are prompt/content candidates only and are not runtime capabilities until real files exist.

The World should consume the versioned context/event contract in the Audio workflow and must not import the Audio Site DOM.
