# KFB ChatterBox Voice · S4 Source-backed Triplet TTS Prep R1

Date: 2026-10-10
Status: SOURCE PREFLIGHT COMPLETE / NEXT INTEGRATION CONTRACT PREPARED / HUMAN AUDIO KEEP-TUNE-CUT OPEN
Owner: existing KFB ChatterBox / Resident Speech output, Draft PR #379
Branch: planning/kfb-chatterbox-voice-layer-v1-2026-10-08
Receiving host: existing private KFB Audio Site · Voice Acting tab
Execution mode: BOUNDED_PREP_ONLY; no new runtime, audio generation, extra Site or World implementation

## Product direction confirmed by Georg

Continue the existing voice, semantic Triplet and soundscape path, using future Work/WSA for a bounded real source-backed speech integration after a human listening decision. Do not build a second casting bench: the KFB Audio Voice Acting R2 tab already exists. This R1 prepares WSA source truth and Site-accessible documentation now, without treating Georg's 'weiter' as a KEEP verdict on specific voice takes.

## Three independent names, three independent authorities

- KFB ChatterBox = internal resident semantic dialogue/Triplet owner. It selects speech, thought, silence and source IDs.
- Resemble Chatterbox-TTS = unrelated optional third-party speech synthesis model, not required by this project.
- Speakrail = unrelated external full-duplex ASR/turn-taking/conversation orchestration stack; it is not a TTS engine or the KFB dialogue owner.
- KFB Audio PR #365 = only audio clock, AudioContext, stem bed, mixer, speech focus and ducking authority.
- DocCheck VoiceIO = a distinct separate-product mic/playback owner; its Feynman/Spatial Flexikon/CME handover stays on georg-doc/doccheck Draft PR #11. Reuse event/interface patterns only; do not introduce cross-product runtime ownership.

## Exact source-pinned S4 intake (re-fetch at executor time)

| Source | Observed GitHub blob | Evidence |
|---|---|---|
| runtime/real-pool-adapter.js | 011f3a96975bd66ed2aaca219577e6108b893f42 | sourceId, sourceRevision, textRevision, voiceAssetKey, candidate preservation, silent thoughts |
| data/VOICE_CASTING_BENCH_R2_CONTRACT.json | 11a8f2965d5a1d0ab83f55fbce0ba405848662a3 | established Site owner, browser voice, render queue, voice-focus/beat/talk events |
| data/NEXT_MVP_VOICE_PROOF_R1.json | 5f2f299f96bdeb68322dacc4600979731b8aba0f | three source actors, three future worlds, muted text, silence, Social Call proof |
| VOICE_LAYER_INTEGRATION_CONTRACT.md | b94337723846c72e8b2e38ee172f1b824741408f | resolver and ownership contract |

All four files are under skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/ on PR #379. This source preflight inspected those exact file contents, not a live runtime. 16/16 bounded source/contract assertions passed; zero audio/browser/human QA in this prep.

## Concrete observed S4 implementation gaps

1. Current voiceAssetKey includes source ID, preset, affect, slot, and normalized text hash; it does **not** include sourceRevision, provider/model, render recipe revision or explicit license/acceptance state. Two render recipes or source revisions of identical normalized text can collide if the key is reused as production audio cache identity. Existing sourceRefs do preserve sourceRevision, so fix the **asset manifest/cache identity seam**, not the ChatterBox semantic owner.
2. Current tripletToSegments() creates three source-backed part records (subject/connector/reframe), retaining AUTHORING_CANDIDATE status. There is no evidence of a fully accepted production **Whole Triplet** render from three source parts; WSA must demonstrate one source-backed Whole-line path and only select fragment assembly when the audible seams pass.
3. The S3 bench can audition browser voices and ingest local clips; exporting Piper, eSpeak NG and ElevenLabs requests is not evidence that a renderer executed. English model, exact rights and resulting audio remain unapproved until genuine audible samples exist.
4. Current Site gives beat/focus/talk-loop events. They are not proof of precise word timing or visemes. Exact bubble text must remain visible/muted, and audio cancellation must release KFB Audio ducking.
5. The Resident-to-ChatterBox-profile-to-voiceProfile mapping and casting are candidates. Accepted source IDs, speaker choices, rights and voice takes must be separately marked approved before game consumption.

## Proposed minimum production manifest (candidate fields, no new SSOT)

Use the existing Voice manifest/bench session asset map as owner. For one rendered voiceAssetId, preserve at least:

- Semantic identity: sourceTripletId / sourcePartId, sourceRevision, sourceStatus (APPROVED vs AUTHORING_CANDIDATE), exact visible displayText and explicit textRevision.
- Voice: residentId, chatterProfileRef, voiceProfile/preset, language, Affect canonical ID, acting hint as provider-only parameter, segment role or Whole, speaker position.
- Render identity: provider, model ID/version, voice ID, recipeRevision, synthesis settings hash, file checksum/audioRef, timing source/timingRef, measured duration.
- Authorization: usage rights/model terms/attribution, consent where applicable, reviewedWithHuman=true/false, acceptance KEEP/TUNE/CUT, allowed playback scope.
- Cache behavior: derive identity from all speech/render-affecting fields, never only normalized text. Retain original canonical content ID for audit; changing recipe/voice/source revision must invalidate audio lookup.

Do NOT independently create a new canonical Card/Resident/Triplet registry. The manifest is one output projection indexed to the existing semantic sources.

## One real-first S4 acceptance path (after human listening)

1. Take one approved source-backed English Triplet from the current semantic owner and the approved Resident/voice mapping. Do not use Voice V1 illustrative demo prose as source canon.
2. Compare an accepted full-line audio take to three position-aware fragments; listen for join gaps, stress, tone continuity, codec and volume. KEEP Whole if stitching is audibly poor.
3. Verify full exact text, source refs, text revision, provider/rights and asset identity are preserved from ChatterBox choice through audible output. A changed phrase or render recipe must not use the stale clip.
4. Exercise one existing bubble consumer and KFB Audio onSpeaking/voice-focus ducking; cancel mid-speech, repeat, mute, thought/silence, and simulate missing asset => existing browser fallback. Check no second AudioContext or dialogue state writer.
5. Continue with actual Demon Lord/Dystopia, Robot One/Utopia and Farmer A/Protopia only when receiving owner and World A/B authorization permit it. Optional Lorekeeper remains deferred. One accepted Social Call through the existing Golden Journey is the later MVP proof, not a bench substitute.

## WSA execution shape

Builder: authorized Work/WSA Integrator, sole writer on existing Voice PR #379. Tester: independent browser/audio evidence. Critic: read-only source and quality review. Guard: KFB Production Guard, sole STOP classification; Georg remains human casting authority. Checkpoint after coherent implementation, measured test evidence, and Return; fetch exact branch head/changed files after every write. Two non-improving repairs quarantine the smallest non-critical seam rather than forcing a new runtime.

Do not enable ElevenLabs paid rendering or any model-key bridge without explicit spend/secrets approval. No unreviewed noncommercial-model outputs for a public game. No new KFB Audio Site, ChatterBox Site, Stage, World R5, PR merge or Live promotion.

## Site documentation and status labels

This document is the GitHub authoritative source and may be mirrored as a PRIVATE KFB Production Control Inbox artifact. Such a Site artifact is **documentation**, not a release of a new KFB Audio Site tab or a verified browser deployment. The existing KFB Audio Voice Acting tab remains unchanged.

**Current next human gate:** Georg auditions Voice Acting: voice solo → D bed unducked → D bed ducked, then KEEP / TUNE / CUT for voice, intelligibility/expressiveness and ducking. The standalone S4 build stays a future authorized Work/WSA job.

**Unresolved:** listening decision; accepted source Triplet/voice profile; English renderer capability and rights; truthful timing/visemes; World/Resident integration clearance; optional Speakrail experimental feasibility.
