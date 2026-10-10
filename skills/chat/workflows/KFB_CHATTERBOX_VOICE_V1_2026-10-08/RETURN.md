# RETURN · KFB ChatterBox Voice Layer v1 · 2026-10-08

Status: **S3 EXISTING-SITE VOICE BENCH PUBLISHED · HUMAN LISTENING OPEN · NO WORLD RUNTIME PROMOTION**

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

The exact final PR/branch head after this Return write is verified on PR #379 after push.

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
- `runtime/real-pool-adapter.js`
- `tools/test_real_pool_adapter.cjs`
- `data/NEXT_MVP_VOICE_PROOF_R1.json`
- `NEXT_MVP_VOICE_ACCEPTANCE_ADDENDUM.md`
- `VOICE_ACTING_CASTING_BENCH_R2.md`
- `data/VOICE_CASTING_BENCH_R2_CONTRACT.json`
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

### Actual tests through S3
- static/structural assertions: **18/18 PASS**
- canonical pool adapter: **13/13 PASS**
- static R1 casting bench: **10/10 PASS**
- existing KFB Audio Site validation: **87/87 PASS**
- published-browser structure/interaction inspection: **PASS · 0 console errors**
- browser audio listening: **0 human judgements**
- listening quality gates: **0 run**
- real Resident choreography integration tests: **0 run**
- Site production deployment: **SUCCEEDED**

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

The existing private KFB Audio Site is now the receiving surface for the Voice Acting/Casting Bench. No second Site was created.

Published Site:
`https://kfb-audio.frizzlebob.chatgpt.site`

Exact deployment evidence:
- Site project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- Site source commit: `86e8a77810351e992e073c48d8596263357029b0`
- saved version: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_fb9dcfe50fe88191a16097759a287686`
- deployment: `appgdep_6ac9cb6f5a8c819190a2721a64318f64`
- deployment result: `succeeded`
- visible production marker: `SITE SOURCE 0.4`

## Integration slices

- **S0 Source intake/owner audit: COMPLETE**
- **S1 Canonical pool → Voice Asset Adapter: COMPLETE · 13/13 PASS**
- **S2 MVP Casting Proof: BENCH READY · HUMAN LISTENING OPEN**
- **S3 Existing-surface Voice Bench: IMPLEMENTED + PRIVATE SITE PUBLISHED · HUMAN LISTENING OPEN**
- S4 ChatterBox Consumer Seam
- S5 Social Calls / Catchphrase Pack
- S6 Optional live/provider expansion
- S7 Mouth/viseme enrichment · deferred

Next-MVP requirement is now frozen separately in:
`NEXT_MVP_VOICE_ACCEPTANCE_ADDENDUM.md`.

It applies to the **first runtime MVP authorized after Georg's Four-Island A/B visual decision**. It does not alter the current visual-only task.

## S2 casting bench

Persisted in KFB Production Control:
- `KFB_CHATTERBOX_VOICE_MVP_CASTING_BENCH_R1.html`
- file id `4d069677-05be-4707-9d0e-4e75e01b5734`
- SHA-256 `777c9e49ef5fd4033c832cef814357ca3f77bbda66c4404ee42dfaac176fbedf`
- static artifact verification: **10/10 PASS**
- human listening: **OPEN**

The bench reuses donor audio without spending new synthesis credits and compares Whole / Assembled / Browser for Demon Lord, Robot One, Farmer A and Lorekeeper. All embedded donor wording is explicitly marked casting-only/non-canon.

Manifest:
`data/CASTING_BENCH_R1_MANIFEST.json`.

## Current blockers / unresolved items

1. The source-ID seam is now closed for current `chatter-phrases.js`; actual accepted Triplet-pool material still depends on its owner/review status.
2. No accepted runtime mapping yet proves `residentId → chatterProfileRef → voicePreset`.
3. The MVP-proof audition presets have not yet received Georg's listening decision.
4. Assembled versus Whole remains a listening decision.
5. Exact public-license attribution must be frozen for whatever voices actually ship.
6. PR #357 / issue #362 remain HOLD/TUNE history until explicitly reopened.
7. Optional ElevenLabs use remains an extension, not a dependency. The browser contains no key; a scoped server-side Site secret/bridge is still required before direct generation.
8. Piper English and eSpeak NG are represented as render-queue targets; neither local renderer is installed in this environment.
9. Talk/beat events are available, but the real EyeRig/PetMouth/pose/gesture/spatial stage remains a later in-world receiving-owner integration.

## Hub / router / Live

No central KFB Hub or public route update was made. The existing canonical KFB Audio Site URL was retained.

Reason:
this result does not yet change a P0/public human gate or canonical product URL. It is an owner-local integration-prep milestone.

No merge.
No Live promotion.

## 2026-10-10 · Future WSA voice pipeline preparation · planning-only

The already-existing WSA casting-bench brief is now rebaselined onto the actually published **S3 KFB Audio Site Voice Acting tab**. It now explicitly says: do **not** rebuild the bench or create a second ChatterBox/Audio Site; keep PR #365 KFB Audio as mixer/ducking owner; keep PR #379 ChatterBox Voice as speech-output owner and the parallel Triplet/Sinnfeld authoring branch read-only.

Updated future WSA handoff: `skills/chat/WORK_WSA_KFB_VOICE_CASTING_BENCH_MINIMAL_INTEGRATION_BRIEF_2026-10-10.md` on this PR. Conditional sequence after human listening: source/license/capability census → source-backed accepted Triplet voice resolution and whole/fragment/dynamic fallback → real voice/bubble/bed/ducking/cancel QA → optional provider expansion. Speakrail remains a **separate full-duplex technology research donor, not a TTS engine or KFB dialogue replacement**. DocCheck's VoiceIO and Speakrail/CME handover remain under `georg-doc/doccheck` PR #11 with **no cross-repo runtime write**.

New changes in this checkpoint: documentation only, no code, no paid synthesis, no newly auditioned human takes, no Site deployment, no new runtime or browser/audio tests (0 each); previously reported 18/18, 13/13 and 87/87 evidence was not rerun. Do not elevate previous test figures into new PASS. Current user-facing gate remains unchanged: **voice solo / real D bed without ducking / D bed with ducking → Georg KEEP / TUNE / CUT**. No Hub/router/Cloudflare routing change.

## 2026-10-10 · S4 voice/TTS source-prep documented on existing KFB Production Control Site

Georg confirmed the bounded path: continue preparing source-backed Triplet speech for later Work/WSA, document the preparation on the existing Site, **but no voice take was given a human KEEP/TUNE/CUT verdict in this chat**. This is **no authorization** for World R5, another voice/dialogue engine or paid provider generation.

New canonical owner-preparation document:
`skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/S4_SOURCE_BACKED_TTS_PREP_R1_2026-10-10.md`.

Evidence: the exact adapter/casting/next-MVP/voice-contract source files inspected, **16/16 static source assertions PASS**. Material preflight finding: the existing `voiceAssetKey` lacks sourceRevision, provider/model, recipeRevision and asset approval/rights status. The next S4 implementation should fix the output manifest/cache identity seam and prove one source-backed accepted Whole/fragment playback path; **no adapter/runtime modification occurred here**.

KFB Production Control private Site Inbox now contains the exact GitHub text document:
- workflow `KFB_CHATTERBOX_VOICE_LAYER_2026-10-08`;
- record `0925b418-fdae-4d76-b1f0-d37e8374e950`;
- file `83d3d8f4-b664-427f-b33d-9db48e7d8221` (`KFB_S4_SOURCE_BACKED_TTS_PREP_R1_2026-10-10.md`);
- 8,330 UTF-8 bytes, SHA-256 `7f1d7ad20dad0919c5e775346c72ba709271c14e1f93a978c3b7ffc037f6125a`;
- Site artifact was read back and its UTF-8 contents matched GitHub exactly.

Additive evidence is recorded in `TEST_REPORT.md`: 16/16 static/contract checks; 1/1 source document GitHub readback; 1/1 Site save/readback+byte comparison; **0** fresh audio-synthesis, browser listening, human audio, 3D and game-runtime tests. Historic S1 and S3 test figures are unchanged and were not rerun.

Existing **KFB Audio Voice Acting Site** itself was **not edited or republished**; only the private KFB Production Control Site document store changed. No changes to DocCheck VoiceIO/CME PR #11, KFB Audio PR #365, Triplet/Sinnfeld authoring branch, KFB Hub, public Stage, merge or Live.

Current gate remains **HUMAN LISTENING** on existing KFB Audio Voice Acting: voice solo / D bed without ducking / D bed with ducking → Georg KEEP / TUNE / CUT. After real listening acceptance, Work/WSA may be separately authorized to integrate the bounded S4 consumer.

## Exactly one next gate

**HUMAN LISTENING · PUBLISHED KFB AUDIO VOICE ACTING BENCH**

Georg selects one Triplet and compares voice solo / D bed without ducking / D bed with ducking, then returns KEEP / TUNE / CUT for voice, bed balance and ducking. Only accepted mappings and provider takes may then advance; six-mode mappings remain editable candidates meanwhile.
