# TEST EVIDENCE · M/N/O source intake · 2026-10-06

Status: SOURCE_PRESENT · RUNTIME_UNVERIFIED
Audio branch tested: `d9972d925ca3d849efbb233f99a188542560129a`
Canonical binary source: `georg-doc/kayfabizarro@276728f3f82f729cd1656b61e81d278856d736bb`

## Exact GitHub asset presence

M · `KFB_M_ISLAND_LIFE_ORCHESTRAL_COZY_01`
- master: 1 / 1 present, non-empty
- stems: 10 / 10 present, non-empty
- actual export BPM: **112**

N · `KFB_N_DUSK_NIGHT_ORCHESTRAL_COZY_01`
- master: 1 / 1 present, non-empty
- stems: 11 / 11 present, non-empty
- actual export BPM: **70**

O · `KFB_O_DISCOVERY_POI_ORCHESTRAL_01`
- master: 1 / 1 present, non-empty
- stems: 9 / 9 present, non-empty
- actual export BPM: **82**

Total:
- masters: **3 / 3 PASS**
- stems: **30 / 30 PASS**
- total source files: **33 / 33 PASS**

## Registry / ownership invariant check

Direct check against committed `runtime-registry.v1.json` and runtime source:
**22 / 22 PASS**

Proved:
- exact source pin recorded;
- G/D remain the only Site-runtime-verified families;
- C/M/N/O remain runtime-unverified;
- M/N/O actual BPMs and stem counts match the source folders;
- M ambiguous Lead Vocals/Other default muted;
- N ambiguous Lead/Backing Vocals default muted;
- DOM-free runtime still has no document/window dependency;
- runtime still creates no AudioContext;
- M/N/O are not auto-mapped by GLOBAL_BASE before QA.

## Explicitly NOT RUN

No claim yet for:
- decoded M/N/O stem duration equality;
- sample rate/channels;
- loop drift;
- phrase alignment;
- audible source-label classification;
- World-context transitions;
- Site integration.

Therefore M/N/O remain:
`SOURCE_PRESENT_RUNTIME_UNVERIFIED`.

Promotion requires the Coworker/WSA integration QA described in:
`COWORKER_WSA_WORLD_AUDIO_INTEGRATION_HANDOVER_2026-10-06.md`.
