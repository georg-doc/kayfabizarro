# KFB ChatterBox Voice Layer · Integration Slices · 2026-10-08

Status: **PLANNED · S0 COMPLETE · NO RUNTIME WRITES YET**

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

## S1 · Canonical pool → Voice Asset Adapter · NEXT

Owner:
existing ChatterBox content/kernel lane.

Input:
- `overworld/overworld/chatter-phrases.js`;
- current Triplet/Curator source if newer;
- canonical Card/deck refs;
- three chosen real Resident profiles.

Work:
1. enumerate a bounded real phrase/Triplet subset;
2. assign stable source IDs to voiceable segments;
3. preserve SHOW/SPIN/SELL or template role/slot;
4. define text-revision invalidation;
5. map source IDs to the donor fragment manifest shape;
6. do not rewrite ChatterBox selection logic.

Acceptance:
- no illustrative Voice-V1 line is promoted as canon;
- every rendered source segment points back to exact KFB source/provenance;
- identical text in different semantic/position roles can remain distinct assets;
- adapter can emit the existing donor resolver input.

No audio regeneration required yet.

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

**S1 · KFB_CHATTERBOX_VOICE_REAL_POOL_ADAPTER_R1**
