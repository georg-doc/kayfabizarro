# TEST PLAN · KFB Billboard Quote Hypernormalisation

Status: **PLANNING VALIDATION COMPLETE · IMPLEMENTATION TESTS NOT RUN**
Date: 2026-10-04

## Planning checks actually run

Result: **8/8 PASS**

1. canonical registry count = 130 decks;
2. generated profile seed count = 130;
3. profile packIds are unique;
4. profile packIds exactly match `media/kfb/index.json`;
5. profile titles match canonical registry titles;
6. `QUOTE_POOL_SCHEMA.json` parses and identifies `KFB Quote Pool v1`;
7. `AUDIO_VISUALIZER_HANDOFF_SCHEMA.json` parses and identifies `KFB Audio Visualizer Handoff v1`;
8. audio handoff explicitly remains read-only consumer contract and does not own playback.

These checks validate planning/data scaffolding only. They do not prove any runtime, quote provenance, rights clearance, 3D rendering, audio sync or Stage publication.

## Required implementation evidence

### Donor isolation
- H13 current reference visibly running in isolation;
- current clay Billboard object visibly isolated;
- current WorldContext/Card/Biome palette result isolated;
- accepted Audio Calibration/audio source isolated.

### Data
- 130/130 canonical deck profiles load in the curator;
- all mapped deck/Card refs resolve;
- quote schema validation;
- unique quote ids;
- duplicate and near-duplicate reporting;
- public-ready quote records require provenance + allowed rights state;
- Brain Food URLs validate;
- same deterministic seed inputs select the same quote/plan on reload.

### 3D / Billboard
- front / 3/4 / back views;
- physical clay Billboard palette follows existing WorldLook/context owner;
- H13 face runs on the existing face owner;
- clean-stage viewport has no content-covering debug/palette UI;
- selected Billboard variant swaps without a second renderer;
- 3D → full-screen → 3D preserves quote position and master time;
- clay TV/full-screen control uses existing interaction routing.

### Quote sequence
- complete quote fixture;
- semantic phrase/clause read-along;
- attribution;
- one FrizzleQuestion;
- Brain Food action;
- next deterministic quote cycle.

### Audio / visualizer
- one host AudioContext;
- existing track/soundbed reference resolves;
- analysis frame updates;
- BPM/time/beat where available;
- kick, bass, mid, high, RMS and transient visibly affect named H13 dimensions;
- visualizer sync can be compared ON/OFF;
- mute works;
- voice focus ducks without stopping the source timeline;
- entering/exiting full-screen does not reset audio time.

### Device/browser
- desktop Chromium;
- mobile/touch smoke;
- no first-party console errors;
- no duplicate rAF/render owner;
- no resource leak from repeated 3D/full-screen transitions.

## Stage acceptance

Formal human review only after the integrated milestone is published and visibly verified at:

`https://kayfabizarro.pages.dev/kfb-hub/stage/billboard-hypernorm-curator/`

The private GPT Site may be the authoring/control product, but it is not a substitute for direct Cloudflare Stage verification.
