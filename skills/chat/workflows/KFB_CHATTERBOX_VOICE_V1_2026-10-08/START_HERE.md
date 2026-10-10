# KFB ChatterBox Voice Layer v1 · Production Integration Route

Status: **S3 EXISTING-SURFACE VOICE BENCH PUBLISHED · HUMAN LISTENING OPEN · NO WORLD RUNTIME PROMOTION**
Date: 2026-10-08
Owner: **KFB ChatterBox / Resident Speech output**
Receiving owners: **existing KFB ChatterBox dialogue owner + existing KFB Audio owner**
Branch: `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`
Outcome: turn the accepted Voice V1 donor into a provider-neutral speech-output seam without creating a second dialogue engine, AudioContext, mixer, Resident state owner or Site.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` §14–17
5. `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`
6. `skills/chat/RESIDENT_AFFECT_EMANATA_MAP_PREP_2026-10-06.json`
7. `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`
8. `overworld/overworld/chatter-phrases.js`
9. source package and cross-product donor below.

## Exact source package

- ZIP: `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_VOICE_V1_2026-10-08.zip`
  - GitHub blob SHA: `6b3593a2bc3b33120fdb466c9b4267077dd1fc4b`
  - size: 1,953,144 bytes
  - uploaded with commit `4c4ee3951f29e6c5c7b393bdd206b698170a7356`
- Voice-layer handover:
  `tools/KFB-ToolBox/_inbox/HANDOVER_Voice-Layer_KFB_AudioTutor_2026-10-08.md`

The ZIP stays the exact closed donor package. Do not unpack 119 MP3s into a second canonical asset tree merely for convenience.

## Naming correction · binding

**ChatterBox = the internal KFB dialogue system.**

It is not Resemble AI's unrelated Chatterbox-TTS model.

When the external model must be mentioned, write:
**Resemble Chatterbox-TTS (unrelated)**.

This production route does not require that external service, a GPU server or any paid speech service.

## What the accepted donor proves

The source package contains:
- 141 ZIP entries;
- 119 MP3s;
- 71 pre-rendered position-aware fragments;
- 24 example lines, each with Whole and Assembled audio = 48 line MP3s;
- 11 proposed archetype voice presets;
- the exact 15 current Resident Affect emotion IDs;
- a dependency-free browser resolver;
- build-time Piper / espeak-ng / ffmpeg rendering;
- fallback order `fragments → whole → live → browser`;
- `onBeat` for bubble timing;
- `onSpeaking` for mouth/activity signalling and KFB Audio ducking;
- no runtime-created AudioContext and no runtime fetch in the donor resolver.

See `SOURCE_AUDIT.md`.

## Classification

### KEEP
- provider-neutral output seam;
- static pre-rendered fragments for deterministic pool material;
- pre-rendered Whole line fallback;
- optional live provider seam for text that exists only at runtime;
- browser speech as last fallback;
- position-aware fragment keys;
- current 15-emotion vocabulary;
- explicit `onBeat` / `onSpeaking` events;
- build-time-only Piper / espeak-ng / ffmpeg path;
- Robot as deliberately synthetic voice direction.

### ADAPT
- 11 archetype presets are audition candidates, not Resident canon;
- example Triplets are audition fixtures only;
- manifest keys must be sourced from canonical KFB Triplet/phrase IDs rather than invented fixture prose;
- Resident `chatterProfileRef` needs an explicit mapping to `voicePreset`;
- KFB Audio remains ducking/mix owner; voice output must not create a parallel mixer;
- optional ElevenLabs output is an extension behind the provider seam, not a dependency.

### REJECT
- interpreting KFB ChatterBox as an external TTS product;
- promoting the illustrative example lines into canonical dialogue;
- copying the whole donor as a second dialogue runtime;
- new AudioContext / stem / mixer ownership;
- a second ChatterBox or Audio Site;
- hardcoding sex/gender instead of stable voice-profile IDs;
- shipping non-commercial or unclear voice models into a public build.

## Current owner boundaries

- ChatterBox owns semantic content, speaker, Triplet relation, timing intent and silence.
- Resident Life owns affect and social/world state.
- Bubble / EyeRig / PetMouth / performance owners render presentation.
- KFB Audio remains the sole AudioContext / music / mixer / ducking authority.
- Voice Layer is output only: resolve text → voice asset/provider → playback callbacks.
- DocCheck VoiceIO is a cross-product interface donor, not a KFB runtime owner.

## Current product state

This check-in does **not** reopen or promote PR #357 / issue #362 as a finished ChatterBox product.

PR #357 remains a HOLD/TUNE donor.
PR #365 remains the current KFB Audio module owner and is not modified here.

The existing private KFB Audio GPT Site is the authorized receiving surface for S3. No new Site, Cloudflare route, World runtime, merge or game Live promotion is created.

## S1 implementation milestone · COMPLETE

Implemented:
- `runtime/real-pool-adapter.js`
- `tools/test_real_pool_adapter.cjs`
- `data/NEXT_MVP_VOICE_PROOF_R1.json`
- `NEXT_MVP_VOICE_ACCEPTANCE_ADDENDUM.md`

The adapter consumes the real current `OW_PHRASES` object and exposes **166 stable source records**:
- 128 faction phrases;
- 23 synthesis lines;
- 15 activity thoughts.

Exact committed adapter test against current `chatter-phrases.js`:
**13/13 PASS**.

The first runtime MVP after the Four-Island A/B visual gate must read the Voice Acceptance addendum from the beginning of its frozen matrix.

## Exactly one next gate

**PUBLISHED KFB AUDIO VOICE ACTING BENCH · HUMAN LISTENING OPEN**

Open `https://kfb-audio.frizzlebob.chatgpt.site`, choose one Triplet and compare voice solo / D bed without ducking / D bed with ducking. Georg returns KEEP / TUNE / CUT for voice, bed balance and ducking. No new synthesis credits were spent; all mappings and example lines remain audition-only/non-canon.

## 2026-10-10 · additive S3 implementation

Current user direction authorizes an additive Voice Acting / Casting module on the **existing KFB Audio GPT Site**. This does not create the held PR #357 ChatterBox Site or any second audio/dialogue owner.

Read:
`VOICE_ACTING_CASTING_BENCH_R2.md`

Machine-readable contract:
`data/VOICE_CASTING_BENCH_R2_CONTRACT.json`

Implemented in Site-ready source:
- six editable Story Mode acting candidates;
- English browser voice audition;
- real D conversation bed;
- existing ducking on/off A/B;
- local ElevenLabs/Piper/eSpeak clip intake;
- provider-neutral render queue and session/SSOT export;
- bubble word cues plus `TALK_LOOP_NO_LIPSYNC` performance event;
- no placeholder character and no viseme claim.

Live ElevenLabs generation remains disabled until a server-side Site secret and guarded bridge exist. Final mode/emotion/casting mappings remain open.

Published evidence:
- Site source commit `86e8a77810351e992e073c48d8596263357029b0`;
- Site version `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_fb9dcfe50fe88191a16097759a287686`;
- deployment `appgdep_6ac9cb6f5a8c819190a2721a64318f64` succeeded;
- live `SITE SOURCE 0.4` and `Voice Acting` tab verified at the exact production URL.
