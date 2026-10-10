# RETURN · KFB ChatterBox Voice Layer v1 · 2026-10-08

Status: **S3 VOICE ACTING SITE ESTABLISHED · HEURISTIC MVP CASTING AUTHORIZED FOR PREP · FINE-TUNING LATER · NO WORLD RUNTIME PROMOTION**

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

## 2026-10-10 · Georg heuristic MVP casting + spoken NPC conversation + shared performance timeline

**Georg steering:** Current S3 Voice Acting usability is reported positively ("funktioniert alles sehr gut"). For first MVPs he approves a reversible **heuristic male/female/synthetic voice-direction audition** based on actual characters and archetypal voice sound; detailed Georg fine-tuning follows later. No individual voice clip/model/rights has been accepted yet, and a voice-lane preference never rewrites Resident identity. This supersedes the older voice-lane step "wait for Georg KEEP/TUNE/CUT before even assigning candidates" only for the **preliminary casting proof**.

Additive owner files on Draft PR #379:
- `MVP_HEURISTIC_CASTING_VOICE_DIALOGUE_PERFORMANCE_DIRECTION_2026-10-10.md` — annotated direction: real PetStudio thought/speech donor, async 3-dot waiting vs semantic thought/silence, subtle look/idle, real playback-clock-driven KFB Audio ducking + existing TALK_LOOP_NO_LIPSYNC + bubble progressive reveal, optional ASR/operator commands and free LLM→Triplet path, future Maker Space stage.
- `data/MVP_HEURISTIC_VOICE_AUDITION_CANDIDATES_R1.json` — 5 editable audition candidates (3 required Demon Lord / Robot One / Farmer A; optional older Lorekeeper / Witch feminine contrast), `mappingFinal:false`, no invented vendor voice IDs, rights unresolved, no irreversible gender truth.
- Updated `START_HERE.md`, `TEST_REPORT.md` and future Work/WSA voice brief route; original donor work and version history preserved.

**Source evidence:** Resident Atlas `cast.js`; current Voice MVP proof/Casting R2; original PetStudio `bubble.v1.js` code (two thought-tail circles, one bubble form owner); ChatterBox Studio triplet handover; 8-channel Resident Performance Event Contract; current EyeRig SSOT recovery (#375). **No actual isolated 3D donor screenshot or stage render** was produced. No new figure/mouth/eyerig/audio engine was implemented.

**New checks:** 23/23 static doc/data acceptance assertions; 2/2 Site artifact save+readback exact text match. Site private Production Control documents:
- concept file `50b32e81-06b4-440e-921d-22b8b5016b5f`, SHA-256 `a41dbf83c0f43399f6d1a59d4622aea986a1fd30c88158b89441d694e2aa5c92`;
- data file `af5c3ac2-e37b-49dd-8ce8-d0b2a2f6620a`, SHA-256 `2922ea6c135069fe58bbd3fee3345593ae14521954b58a7299cf4544e0fddca2`.

**Actual new audio/ASR/LLM/3D/browser/game/runtime tests:** 0 each; no KFB Audio Site version/update, paid voice generation, World R5, DocCheck runtime, public Stage, Site promotion, PR merge or Live deployment. Existing voice bed/ducking implementation remains unchanged. DocCheck's Speakrail/VoiceIO/CME stays on its separate Draft PR #11.

**Next KFB Voice owner gate (UPDATED): `KFB_VOICE_HEURISTIC_THREE_ACTOR_SOURCE_AUDITION_R1`.** Future WSA if separately authorized: run real audibly grounded English voice auditions against three actual source actors / one source-backed Triplet and existing KFB Audio timeline; retain manual override, annotate sources/licensing and distinguish functional proof from artist acceptance. Optional spoken operator control follows later; free conversational ASR/LLM and actual holographic Maker Space stage are subsequent tasks. In-world voice requires separate Four-Island A/B approval and receiving-owner runtime authorization. Georg fine-tuning remains future, not an early blocking gate.

## 2026-10-10 · Real three-actor eSpeak CLI audition + source-versioned output asset guard

**Product result:** Georg's heuristic first-three-resident voice approach advanced to **six actual locally synthesized English MP3s**, with two eSpeak alternatives each for Demon Lord, Robot One and Farmer A. Source lines are exact earlier `CASTING_BENCH_R1_MANIFEST.json` donor audition fixtures, **CASTING_ONLY_NON_CANON**, not accepted canonical Triplets or final casting. Native eSpeak 1.48.15 and FFmpeg 7.1.5 were available in the local build; Piper, espeak-ng and ElevenLabs bridge were not exercised.

**Actual executable source checkpoint (same voice owner):**
- `runtime/voice-asset-identity.v1.js` — dormant output-only source/version/provider/voice/recipe identity and public shipping-candidate gate; legacy real-pool adapter and KFB Audio runtime left intact.
- `tools/test_voice_asset_identity.cjs` — committed local Node tests.
- `tools/render_espeak_audition_r1.py` — reproduces the exact private audition samples from the JSON receipt with no external account/provider.
- `data/MVP_ESPEAK_AUDITION_R1_RECEIPT.json` — six measured audio durations, source sentences, CLI parameters, SHA-256 per clip, ZIP SHA-256, and explicit *not hosted* storage status.

**Evidence:** local Node 24/24 PASS; actual eSpeak generation 6/6; FFprobe MP3 checks 6/6; strict rerender/hash comparison 6/6; ZIP integrity 1/1. GitHub module blob was matched byte-exact to the tested local source. No CI test run for the committed test script; no browser audio/duck, TTS Site publication, actual canonical Triplet, new 3D source visual, ASR or LLM turn test. The eSpeak donor's synthetic tone is **not accepted as production character acting**.

**Archive:** `KFB_VOICE_HEURISTIC_AUDITION_R1_ESPEAK_TECHNICAL.zip` (253,347 bytes; SHA-256 `3bc70771f57d690a0c8a91eb5e45f33047149882a48c2162a92731e49e55db49`) is provided as a **current conversation download only**. It is NOT claimed present in the repository, private Production Control or deployed KFB Audio Site; any future execution may deterministically rerender using the checked-in Python tool and receipt. Do not invent an asset URL.

The previously detected production cache-identity gap has a safe standalone candidate helper, but **the real browser / ChatterBox consumer has not yet consumed it**. `evaluateAsset` is a contract-level guard over provided status fields, not authenticated license review.

**Publication limit:** current executor has no Sites publisher. `SITES_PUBLISHER_REQUIRED` for in-place updates to the existing `https://kfb-audio.frizzlebob.chatgpt.site` Voice Acting tab. No second Site or Cloudflare fallback, no PR merge/Live, no KFB WB2 R5, and no DocCheck runtime change.

**Current Voice next gate:** `KFB_VOICE_TRIPLET_AUDIO_CONSUMER_SITE_INTEGRATION_R1` — one owner-approved semantic Triplet actually voiced via the existing Site with recorded source rights, audible start/stop, duck restoration, bubble/mute and timing. Georg's detailed final voice fine-tuning remains later, not the current implementation stop. The independent Four-Island A/B World gate remains closed.

## 2026-10-10 · WSA preflight source-status clarification

Current voice owner gate remains **KFB_VOICE_TRIPLET_AUDIO_CONSUMER_SITE_INTEGRATION_R1**. Final WSA launch-read of inspected Triplet donor showed `AUTHORING_CANDIDATE` pool status (ChatterBox Studio v2 donor, blob `cf975a72637630d97fc626962ef591b356ce0bbf`); parallel authoring branch requires review for promotion. An `APPROVED/KEEP` canonical Triplet was **not verified in these inspected sources**. The current WSA brief now explicitly allows one private `NON_CANON_AUDITION` source-backed Triplet for functional playback/bubble/duck tests without falsely treating it as production-accepted semantic content. Public/game promotion still requires approval and license evidence. The future WSA must recheck current owner status before choosing the actual Triplet.

One existing Site only: KFB Audio `Voice Acting` tab. This update changes **documentation only**: zero new runtime/browser/audio tests, zero Site deployment, zero public Stage, no World or DocCheck edit. Historical 6/6 local eSpeak recordings and 24/24 local identity tests remain historical, not rerun by this preflight. Next executor is Sites-capable Work/WSA, single writer on PR #379, with independent tester/critic/guard. No new Georg gate for private audition.
