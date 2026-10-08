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

## S2 · MVP Casting Proof · BENCH READY · HUMAN LISTENING OPEN

Owner:
Resident/ChatterBox authoring + Voice output.

Current bench:
- Production Control artifact: `KFB_CHATTERBOX_VOICE_MVP_CASTING_BENCH_R1.html`;
- file id: `4d069677-05be-4707-9d0e-4e75e01b5734`;
- SHA-256: `777c9e49ef5fd4033c832cef814357ca3f77bbda66c4404ee42dfaac176fbedf`;
- static bench checks: **10/10 PASS**;
- human listening: **OPEN**.

Bounded audition set:
- Dystopia Demon Lord → `demon_lord`;
- Utopia Robot One → `robot`;
- Protopia Farmer A → `farmer`;
- optional Lorekeeper → `lorekeeper`.

Bench compares:
- Whole;
- Assembled;
- Browser fallback;
- KEEP / TUNE / CUT per voice.

Important:
the embedded donor lines are **casting-only, non-canon audition material**. They are not promoted into ChatterBox.

After Georg's listening decision, render only the canonical source-backed lines needed by the next-MVP proof.

Acceptance before S2 closes:
- Georg returns KEEP/TUNE/CUT for the voices actually used;
- no illustrative Voice-V1 line becomes canon;
- exact model/license attribution is frozen for kept voices;
- no non-commercial voice enters a public candidate.

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

**S2 HUMAN LISTENING · KFB_CHATTERBOX_VOICE_CASTING_BENCH_R1**

Georg compares Whole / Assembled / Browser for Demon Lord, Robot One, Farmer A and optional Lorekeeper and returns KEEP / TUNE / CUT per voice. Only then render canonical MVP material.
