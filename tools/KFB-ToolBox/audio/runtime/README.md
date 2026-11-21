# KFB Audio Runtime · DOM-free integration package

Status: RUNTIME-VERIFIED PRE-INTEGRATION MODULE
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
- C Cozy Base
- M Island Life
- N Dusk/Night
- O Discovery/POI

C/M/N/O use real stems from the pinned asset commit. Their family-internal stem lengths are identical after browser decode, and each uses one shared bar-aligned loop end. A failed stem load falls back to that family's real master without stopping the current deck first.

Source-labelled Vocal/Other layers remain `AMBIGUOUS_RETAIN_MUTED`. Runtime verification is technical and is not `HUMAN_ACCEPTED`.

Synthetic integration fixtures:
- `DAY_ROAM`
- `DAY_STAY`
- `DUSK_TO_NIGHT`
- `POI_DISCOVERY`
- `RESIDENT_DIALOGUE`
- `BILLBOARD_DIALOGUE`
- `DRIVE_TO_STAY`
- `MISSING_FAMILY_FALLBACK`

Fixtures call only `setContext()` and `emit()`. They contain no track IDs, BPM tables, stem identities or gain values.

QA surfaces:
- `qa.mjs` — registry, ownership and resolver invariants;
- `qa-fixtures.mjs` — public-contract synthetic fixture harness;
- `qa-browser.html` — real browser decode/alignment/BPM/loop/master-fallback harness.

The World should consume the versioned context/event contract in the Audio workflow and must not import the Audio Site DOM.
