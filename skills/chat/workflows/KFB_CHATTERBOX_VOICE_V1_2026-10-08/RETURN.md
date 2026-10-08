# RETURN · KFB ChatterBox Voice Layer v1 · 2026-10-08

Status: **READY FOR INTEGRATION · PLANNING/SOURCE ACCEPTANCE COMPLETE · NO RUNTIME PROMOTION**

## Owner / scope

Owner:
**KFB ChatterBox / Resident Speech output**

Receiving owners remain:
- existing KFB ChatterBox dialogue/content owner;
- existing Resident Life / Affect owner;
- existing Bubble/EyeRig/PetMouth presentation owners;
- existing KFB Audio owner for AudioContext/mix/ducking.

This slice does not create a new runtime owner.

## Repository

Repo:
`georg-doc/kayfabizarro`

Branch:
`planning/kfb-chatterbox-voice-layer-v1-2026-10-08`

Draft PR:
**#379 · [PLANNING] KFB ChatterBox Voice Layer v1 integration**

Base at branch creation:
`a2d338b01edb22f76900c0266cbc6aff3c802eee`

Evidence milestone head:
`bb9441a626fd8bbc4ee83a5543a82f7402162e6a`

The exact final PR/branch head after this Return write is verified in the accompanying Production Control handoff.

## Source package

Existing main sources retained exactly:
- `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_VOICE_V1_2026-10-08.zip`
- `tools/KFB-ToolBox/_inbox/HANDOVER_Voice-Layer_KFB_AudioTutor_2026-10-08.md`

ZIP facts:
- GitHub blob: `6b3593a2bc3b33120fdb466c9b4267077dd1fc4b`
- size: 1,953,144 bytes
- upload commit: `4c4ee3951f29e6c5c7b393bdd206b698170a7356`

Production Control imported ZIP:
- SHA-256: `f51bc757fb612af942e79cd217ca1faacc32780ffeb532e740cf2759636883c6`
- file id: `cb6a5e6b-5517-4ac3-8f58-492eeeb09178`

## New production files

- `START_HERE.md`
- `SOURCE_AUDIT.md`
- `VOICE_LAYER_INTEGRATION_CONTRACT.md`
- `INTEGRATION_SLICES.md`
- `TEST_REPORT.md`
- this `RETURN.md`

under:
`skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/`

## Naming correction locked

**ChatterBox = internal KFB dialogue system.**

The external Resemble speech model is unrelated and must be named:
**Resemble Chatterbox-TTS (unrelated)**.

No GPU server, Resemble account or paid speech provider is required by this Voice V1 route.

## Accepted product direction

### KEEP
- pre-render fixed pool material;
- position-aware fragments;
- Whole-line fallback;
- optional injected live provider;
- browser speech last fallback;
- Resident Affect as the canonical emotion vocabulary;
- source-visible text remains authoritative;
- onBeat for bubble presentation;
- onSpeaking for mouth/performance + KFB Audio ducking;
- provider-neutral casting/voice-profile IDs;
- Piper/espeak-ng/ffmpeg as build-time donor path.

### ADAPT
- 11 voice archetypes need human audition and real Resident mapping;
- illustrative 24 lines remain fixtures only;
- canonical KFB phrase/Triplet IDs must replace fixture prose as provenance keys;
- normalized text is a cache aid, not semantic identity;
- optional ElevenLabs assets/providers remain behind the same manifest/provider seam.

### REJECT
- second dialogue engine;
- second AudioContext/mixer;
- duplicate Site;
- promoting illustrative Triplets into canon;
- hard-coded gender as voice identity;
- non-commercial/unclear voice model in a public candidate;
- interpreting PR #357 as completed ChatterBox runtime.

## Evidence

### Static/source audit
**18/18 PASS**

Verified:
- 141 ZIP entries;
- 119 MP3s;
- 71 fragment MP3s;
- 48 line MP3s;
- 71 manifest fragments;
- 24 manifest lines;
- all manifest audio paths present;
- 11 archetype presets;
- 15 package emotions;
- exact 15/15 match to current Resident Affect IDs;
- fragments/whole/live/browser resolver modes;
- onBeat/onSpeaking callbacks;
- no runtime-created AudioContext;
- no runtime fetch;
- 10 declared donor test cases;
- examples explicitly non-canon;
- selected casting excludes donor-listed non-commercial/unclear candidates.

### Donor-reported tests
Package reports:
- `node tools/test_runtime.cjs` → **10/10**
- Headless Chromium Assembled/fragment/browser route smoke
- no script errors

These were not rerun as browser/audio tests by this Web Chat.

### Actual tests in this slice
- static/structural assertions: **18/18 PASS**
- browser audio playback: **0 run**
- listening quality gates: **0 run**
- runtime integration tests: **0 run**
- Site/public deployment tests: **0 run**

## Production Control / Site persistence

Persisted under workflow:
`KFB_CHATTERBOX_VOICE_LAYER_2026-10-08`

Artifacts:
- exact source ZIP
- exact current Voice-Layer handover
- production START_HERE
- Voice Layer Integration Contract
- Integration Slices
- Test Report

This is authenticated production persistence, not a claim that a new public/product GPT Site was deployed.

No public/Stage URL is required by this planning/source-acceptance slice.

## Integration slices

- **S0 Source intake/owner audit: COMPLETE**
- **S1 Canonical pool → Voice Asset Adapter: NEXT**
- S2 Three-Resident Casting Proof
- S3 Existing-surface Voice Bench
- S4 ChatterBox Consumer Seam
- S5 Social Calls / Catchphrase Pack
- S6 Optional live/provider expansion
- S7 Mouth/viseme enrichment · deferred

## Current blockers / unresolved items

1. `chatter-phrases.js` phrase families are not yet the same data shape as the donor's segmented Triplet fixtures.
2. No accepted runtime mapping yet proves:
   `residentId → chatterProfileRef → voicePreset`.
3. The 11 voice presets have not been human-auditioned here.
4. Assembled versus Whole has not received Georg's listening decision.
5. Exact public-license attribution must be frozen for whatever voices actually ship.
6. PR #357 / issue #362 remain HOLD/TUNE history until explicitly reopened; this slice does not reopen them.
7. Optional ElevenLabs use remains an extension, not a dependency.

## Hub / router / Live

No central KFB Hub or public route update was made.

Reason:
this result does not yet change a P0/public human gate or canonical product URL. It is an owner-local integration-prep milestone.

No merge.
No Live promotion.

## Exactly one next gate

**KFB_CHATTERBOX_VOICE_REAL_POOL_ADAPTER_R1**

Take a bounded real canonical KFB phrase/Triplet subset plus three real Residents and produce stable source-backed voice asset IDs that the existing Voice V1 resolver can consume without changing ChatterBox semantics or KFB Audio ownership.
