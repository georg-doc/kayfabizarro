# KFB ChatterBox Voice Layer · Integration Slices · 2026-10-08

Status: **S0 + S1 COMPLETE · NEXT-MVP VOICE ACCEPTANCE PREPARED · NO WORLD RUNTIME WRITES YET**

Goal: move the accepted donor into KFB through the smallest owner-safe sequence, without reviving the whole ChatterBox Site project prematurely.

## S0 · Source intake and owner audit · COMPLETE

Outcome:
- exact ZIP preserved;
- exact handover preserved;
- naming collision corrected;
- 141-entry source package inspected;
- 18/18 structural/static acceptance assertions pass;
- Production Control source artifact persisted;
- existing ChatterBox and Audio owners identified.

No runtime change.

## S1 · Canonical pool → Voice Asset Adapter · COMPLETE

Owner:
existing ChatterBox content/kernel lane.

Implemented:
- `runtime/real-pool-adapter.js`;
- `tools/test_real_pool_adapter.cjs`;
- `data/NEXT_MVP_VOICE_PROOF_R1.json`;
- `NEXT_MVP_VOICE_ACCEPTANCE_ADDENDUM.md`.

Actual current-source result:
- `chatter-phrases.js` blob `72f0bd5333cdadc2b1dcdbb1d8b782ead1e70ac4`;
- 8 factions;
- 128 faction phrase records;
- 23 synthesis records;
- 15 activity-thought records;
- **166 unique stable source IDs total**;
- `{X}` templates keep stable template identity plus text revision;
- Triplet adapter preserves owner-supplied status, including `AUTHORING_CANDIDATE`;
- thought/philo/activity records default silent;
- no dialogue-selection logic is added.

Acceptance evidence:
- exact committed adapter against exact current phrase source: **13/13 PASS**;
- no illustrative Voice-V1 line promoted as canon;
- source revision and source ID survive into VoiceRequest provenance;
- normalized text is only an asset/cache key aid.

No audio regeneration was required for S1.

## S2 · Three-Resident Casting Proof

Owner:
Resident/ChatterBox authoring + Voice output.

Choose three real Residents using existing sources, ideally representing:
- Utopia;
- Dystopia;
- Protopia.

Work:
- explicit `residentId → chatterProfileRef → voicePreset`;
- start from existing 11 audition presets;
- render only required canonical segments;
- keep 2–3 emotions per Resident, relying on the current fallback chain;
- compare Whole vs Assembled for the same accepted lines.

Acceptance:
- three real Residents;
- real canonical dialogue;
- no private replacement phrase pools;
- exact model/license attribution;
- no non-commercial voice in a public candidate.

## S3 · Existing-Surface Voice Bench

Do not create a new Site.

Preferred first surface is whichever existing KFB owner is explicitly authorized at execution time:
- KFB Audio Site bench for isolated listening, or
- current ChatterBox specialist surface after HOLD is reopened.

Bench shows:
- source line and provenance;
- Resident / voicePreset / emotion;
- Assembled;
- Whole;
- browser fallback;
- optional external live provider only if configured;
- route chosen;
- duration;
- KEEP / TUNE / CUT note/export.

One human gate after the bench is useful:
**Which voices survive, and is Assembled good enough versus Whole?**

## S4 · ChatterBox Consumer Seam

Only after S1–S3 evidence.

Add one bounded call where existing ChatterBox produces a bubble:
`voice.play(request)`.

Required:
- `onBeat` drives existing bubble reveal, not new bubble geometry;
- `onSpeaking` signals existing Audio ducking/performance;
- valid silence remains valid;
- thought defaults silent;
- playback failure never blocks dialogue;
- no AudioContext created by the Voice layer.

Acceptance:
one meaningful real Resident dialogue plays inside an existing accepted surface with source-backed bubble text and no placeholder character/card path.

## S5 · Social Calls / Catchphrase Pack

Separate semantic asset family, same playback/provenance layer.

Seed:
- Kayfa-BINGO!
- Kayfa-BOGGLE?
- Kayfa-BONGO!
- BLÖDSINN!
- What the FLUFF?!
- Stay fluffy!

Use:
- event-triggered reaction/player closure;
- curated takes;
- optional Roger/Siren ElevenLabs assets already present;
- stable `voiceProfile`, not hard-coded male/female.

Acceptance:
call event selects semantic call ID → accepted voice asset → bubble/reaction/audio callbacks.
No ordinary button-click spam.

## S6 · Optional live/provider expansion

Only if static coverage leaves a real product gap.

Provider contract:
`liveTTS(text, preset, emotion) → URL | Blob | null`.

Candidate:
ElevenLabs for selected Hero/Golden dialogue or runtime free text.

Rules:
- server-side key;
- credit/budget guard;
- preserve text/provider/model/voice/settings/provenance;
- cache repeated lines;
- provider tags are adapter details, not canonical emotion state;
- null/error falls through to browser speech.

Resemble Chatterbox-TTS is unrelated and not required.

## S7 · Mouth / viseme enrichment · DEFERRED

Stage 1:
speaking flag / bounded amplitude flap.

Later:
visemes/phoneme timing when a chosen provider supplies trustworthy timing.

Do not block the first useful voice layer on lipsync.

## Guardrails across every slice

- one current ChatterBox content owner;
- one current KFB Audio owner;
- no second Resident state owner;
- no invented canonical Triplets;
- no second productive Site;
- no automatic PR #357 promotion;
- no World runtime write until the receiving World/Resident seam is explicitly reopened;
- no auto-merge;
- no Live promotion.

## One next gate

**S2 · KFB_CHATTERBOX_VOICE_CASTING_BENCH_R1**

Use only the source-backed MVP-proof actors already named in `NEXT_MVP_VOICE_PROOF_R1.json`; audition/render the minimum canonical material needed for Demon Lord, Robot One, Farmer A and optional Lorekeeper, then compare Whole/Assembled/browser routes before any World-runtime integration.
