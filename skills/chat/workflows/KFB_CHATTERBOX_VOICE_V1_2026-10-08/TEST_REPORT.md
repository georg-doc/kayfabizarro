# TEST REPORT · KFB ChatterBox Voice Layer v1 · 2026-10-08

## 2026-10-10 · Triplet Audio Integration R1 · published evidence

Status: **FUNCTIONAL PRIVATE AUDITION PASS · HUMAN CASTING/QUALITY LISTENING OPEN**

Exact source fixture:
- `core.frame.01` · `Nothing changed / except the frame / everything changed`;
- donor blob `cf975a72637630d97fc626962ef591b356ce0bbf`;
- `AUTHORING_CANDIDATE · NON_CANON_AUDITION`;
- shared-pool candidate, not a character-authored line.

Executable evidence:
- owner manifest/identity test: **51/51 PASS**, including exact role-specific IDs emitted by the existing `real-pool-adapter.tripletToSegments()` contract;
- packaged existing KFB Audio Site validation: **151/151 PASS**;
- 12/12 PCM WAV files exist, are nonempty, match recorded SHA-256 values and have measured positive duration;
- all 12 asset identities eligible only in private `audition` mode; all 12 rejected in `public` mode because source/rights/casting gates are not approved;
- stable identity, text invalidation and missing-revision fail-closed checks PASS;
- exactly one AudioContext constructor remains in the existing KFB Audio owner; Voice Bench creates none.

Published real-browser evidence at `https://kfb-audio.frizzlebob.chatgpt.site`:
- exact URL loaded `SITE SOURCE 0.5.1` after deployment and reload;
- isolated source card showed exact Triplet ID, donor revision, status and three beats;
- Whole Line emitted `actual media started`, TALK LOOP speaking; Pause retained position and returned TALK/duck to idle; Resume reacquired both; Stop reset all states;
- fragments observed in strict `1/3 → 2/3 → 3/3 → complete` order under one utterance lifecycle;
- Browser fallback emitted `Web Speech started` in the in-app browser; Chrome reported no Web Speech start and transparently started the exact identity-matched Whole WAV as an explicitly labelled browser media safety fallback. Both paths drove TALK LOOP; Chrome Pause/Resume/Stop passed;
- D bed remained owned by existing KFB Audio: TTS ducking `off → on → off → on → off` across start/pause/resume/stop;
- edited beat immediately produced `EDITED_DERIVATIVE_NON_CANON`, disabled Whole/fragments and retained Browser fallback only;
- mute disabled static playback while leaving exact transcript visible;
- mobile production check at 390×844: `scrollWidth === clientWidth === 390`, source card and all five route/lifecycle controls present;
- console warnings/errors observed: **0**.

Publication receipt:
- Site source commit `8f472837ea94d0b6f691ec2dfff6a68e68891a01`;
- Site version `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_aedfc74524ac8191beec5c72ac5c8e25`;
- deployment `appgdep_6aca863aca548191b8a79ae1bc54eb5e` · `succeeded`;
- production URL unchanged.

Still UNKNOWN / human-required:
- subjective voice fit, intelligibility over music, fragment seam quality, audible clicks/pumping and final ducking balance;
- real iOS/Android device playback;
- source approval, public rights clearance and final casting KEEP.

No paid provider, microphone/ASR, World runtime, R5, second Site, second AudioContext, merge or Live promotion was used.

Status: **EVIDENCE MILESTONE · SOURCE AUDIT + REAL-POOL ADAPTER GREEN**
Branch-under-test parent: `4d341158b7723732b65e20c94777ac63dcc485d9`

## Scope

This report covers source-package integrity and compatibility evidence only.

It does not claim:
- audio quality;
- human listening acceptance;
- browser playback rerun;
- real ChatterBox consumer integration;
- real Resident mapping;
- Site runtime publication.

## Exact donor

GitHub ZIP blob:
`6b3593a2bc3b33120fdb466c9b4267077dd1fc4b`

Production Control import:
- bytes: 1,953,144
- SHA-256: `f51bc757fb612af942e79cd217ca1faacc32780ffeb532e740cf2759636883c6`

## Structural audit · 18/18 PASS

| # | Assertion | Result |
|---|---|---|
| 1 | ZIP entries = 141 | PASS |
| 2 | MP3 files = 119 | PASS |
| 3 | fragment MP3s = 71 | PASS |
| 4 | line MP3s = 48 | PASS |
| 5 | manifest fragments = 71 | PASS |
| 6 | manifest lines = 24 | PASS |
| 7 | every manifest fragment path exists | PASS |
| 8 | every Whole/Assembled path exists | PASS |
| 9 | archetype voice presets = 11 | PASS |
| 10 | package emotions = 15 | PASS |
| 11 | package emotion IDs exactly equal current Resident Affect IDs | PASS |
| 12 | runtime exposes fragments/whole/live/browser routes | PASS |
| 13 | runtime exposes onBeat/onSpeaking callbacks | PASS |
| 14 | runtime creates no AudioContext | PASS |
| 15 | runtime performs no fetch | PASS |
| 16 | donor test source declares 10 cases | PASS |
| 17 | example Triplets explicitly mark themselves non-canon | PASS |
| 18 | selected casting excludes donor-listed non-commercial/unclear voice candidates | PASS |

## Current emotion equality

Both current Resident Affect and donor casting use exactly:

`calm, curious, attentive, joyful, amused, grateful, proud, surprised, worried, sad, annoyed, angry, embarrassed, suspicious, tired`

No translation layer is needed for emotion IDs in the first adapter.

## Donor test source · 10 declared cases

1. exact Triplet → fragments
2. normalization tolerates case/space/punctuation
3. missing emotion fallback behavior
4. joyful → amused fallback hits fragments
5. 3-segment template → fragments
6. 2-segment template → fragments + one gap
7. unknown fragments + known lineId → Whole
8. free LLM text + live provider → live
9. free LLM text without live provider → browser
10. every manifest fragment file exists

Donor START_HERE reports `node tools/test_runtime.cjs → 10/10` and a headless Chromium bench. Those runs were not rerun by this Web Chat.

## Compatibility evidence

### ChatterBox semantics
Current source contract already defines TTS as output:
semantic source → Resident/faction filter → ChatterBox speaker/timing/presentation → Bubble/Emote/TTS.

Verdict: **compatible if kept output-only**.

### Resident Affect
15/15 exact ID equality.

Verdict: **compatible**.

### KFB Audio
Donor resolver has no AudioContext and can emit onSpeaking.

Verdict: **compatible with PR #365 ownership if onSpeaking is routed to existing ducking/speech-focus authority**.

### Canonical phrase pool
Current `chatter-phrases.js` uses faction phrase families and {X} templates; donor fixtures use direct segmented Triplet arrays.

Verdict: **ADAPTER REQUIRED**.

### Resident voice mapping
Current semantic profile includes `chatterProfileRef`; no current runtime proof of `residentId → chatterProfileRef → voicePreset`.

Verdict: **MAPPING REQUIRED**.

## Quality evidence not available

- no human listening in this chat;
- no comparison of Assembled vs Whole by ear;
- no proof that each of the 11 presets fits a KFB Resident;
- no public/browser decode check against this imported ZIP;
- no lipsync/viseme proof.

These remain explicitly UNKNOWN, not FAIL.

## Production Guard conclusion

**CONTINUE to S1 only.**

Smallest missing seam:
`canonical KFB phrase/Triplet source IDs → voice fragment/line manifest`.

Do not spend credits or regenerate the full pool before that seam exists.

## Next gate

`KFB_CHATTERBOX_VOICE_REAL_POOL_ADAPTER_R1`


## S1 · Real canonical pool adapter · 13/13 PASS

Exact source under test:
- `overworld/overworld/chatter-phrases.js`
- blob `72f0bd5333cdadc2b1dcdbb1d8b782ead1e70ac4`
- version `phrases-v1`

Exact adapter under test:
- `runtime/real-pool-adapter.js`
- blob `011f3a96975bd66ed2aaca219577e6108b893f42`

Current source census:
- 8 factions;
- 128 faction phrase records;
- 23 synthesis records;
- 15 activity-thought records;
- **166 unique source records**.

Assertions:
1. version = phrases-v1;
2. current faction count = 8;
3. current record count = 166;
4. all source IDs unique;
5. exact `kingCourt.ueber[0]` template recovered;
6. `{X}` binding produces exact expected visible text;
7. `philo` defaults to silent thought;
8. synthesis source resolves;
9. activity thought defaults silent;
10. VoiceRequest preserves stable source ID/provenance;
11. semantic Triplet adapter produces subject/connector/reframe roles;
12. `AUTHORING_CANDIDATE` status is preserved and never auto-promoted;
13. emotion change changes the audio asset key without changing dialogue identity.

Result:
**13/13 PASS**.

### Still UNKNOWN
- audio quality;
- Whole vs Assembled listening preference;
- final Resident-to-voice casting;
- actual KFB Audio ducking in an integrated surface;
- browser playback of newly rendered canonical lines;
- next-MVP World integration.

These are not treated as failures.

## MVP planning evidence

`NEXT_MVP_VOICE_ACCEPTANCE_ADDENDUM.md` and `data/NEXT_MVP_VOICE_PROOF_R1.json` now freeze the Voice proof for the first runtime MVP after the current Four-Island A/B visual gate.

The current visual-only Story Vision R1 remains unchanged and receives no runtime work.


## S2 · MVP Casting Bench static verification · 10/10 PASS

Production Control artifact:
- `KFB_CHATTERBOX_VOICE_MVP_CASTING_BENCH_R1.html`
- file id: `4d069677-05be-4707-9d0e-4e75e01b5734`
- bytes: 276,793
- SHA-256: `777c9e49ef5fd4033c832cef814357ca3f77bbda66c4404ee42dfaac176fbedf`

The full chunked artifact was reconstructed before verification.

Assertions:
1. exactly four audition card articles;
2. exact IDs: demon-lord, robot-one, farmer-a, lorekeeper;
3. four Whole controls;
4. four Assembled controls;
5. four Browser controls;
6. KEEP/TUNE/CUT controls present;
7. no `fetch()`;
8. MP3 data embedded in the HTML;
9. explicit non-canon audition warning;
10. decisions persist only in browser localStorage.

Result:
**10/10 PASS**.

This is a static artifact check, not a listening PASS.

Human listening:
**OPEN**.

The earlier provisional 2/10 read was discarded because it inspected the chunk wrapper rather than the decoded HTML bytes; it is not product evidence.

## S3 · Existing KFB Audio Site Voice Acting Bench

Status: **IMPLEMENTED + PRIVATE SITE PUBLISHED · HUMAN LISTENING OPEN**

Receiving surface:
- existing Site: `KFB Audio`
- project id: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- production URL: `https://kfb-audio.frizzlebob.chatgpt.site`
- saved version: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_fb9dcfe50fe88191a16097759a287686`
- deployment: `appgdep_6ac9cb6f5a8c819190a2721a64318f64`
- Site source commit: `86e8a77810351e992e073c48d8596263357029b0`

This is additive to the existing Audio Site. It does not create another Site, dialogue engine, mixer, AudioContext or runtime owner.

### Static verification · 87/87 PASS

`node dist/validate.mjs` passed against the exact packaged/pushed Site source. Voice-specific assertions cover:
1. Voice Bench schema `0.2`;
2. all six editable story-mode candidates;
3. explicit non-final/non-canon mapping status;
4. four Resident audition candidates;
5. three meaningful Triplet beats;
6. `Waffle Fluff` and `Stay fluffy!` candidates;
7. no Voice-Bench-created AudioContext;
8. reuse of KFB Audio D state + existing speech-focus ducking;
9. talk-animation event with explicit no-viseme claim;
10. no ElevenLabs key or header in browser code;
11. IndexedDB clip intake + session/SSOT export;
12. all Voice controls present.

The 87 total also retains the existing catalog, B/C/D, real-stem, prompt and single-owner assertions.

### Published-browser verification · PASS

The exact production URL visibly showed:
- `SITE SOURCE 0.4`;
- the new `Voice Acting` tab;
- all six story modes;
- `EDITABLE CANDIDATE · NOT CANON`;
- the three meaningful `Personal freedom / expires automatically at / the next checkpoint` beats;
- 41 English browser voices on the verifying device;
- D-bed and existing-ducking controls enabled by default;
- render queue and local clip intake;
- secure ElevenLabs bridge explicitly reported as not configured;
- future Maker Space / God Mode boundary without a substitute actor or viseme claim.

Console errors observed during the browser check: **0**.

The repository Playwright script was not run because the local Playwright package is unavailable. This was recorded once as `PLAYWRIGHT_UNAVAILABLE`; live browser inspection was used instead.

### Audio and performance evidence still OPEN

- no human listening comparison was performed;
- no claim is made for audible ducking quality;
- no ElevenLabs API render was performed;
- Piper and eSpeak NG binaries are not installed in the current environment;
- no real EyeRig/PetMouth/pose/gesture Resident stage was integrated;
- talk and beat events are implemented, but exact character choreography remains a receiving-owner test.

## Next gate

On the published Site, Georg runs one chosen Triplet in three passes:
1. voice solo;
2. voice over D bed without ducking;
3. voice over D bed with ducking;

Return **KEEP / TUNE / CUT** for voice, bed balance and ducking. This single listening gate replaces any assumption based on structural checks.

## S4 preparation · GitHub + KFB Production Control Site documentation · 2026-10-10

Mode: source-only read/contract preparation. No Voice Acting Site deployment, audible render, browser recording, human listening, game runtime or DocCheck runtime run.

### New checks in this preparation

- **16/16 source/contract assertions PASS** by inspecting exact GitHub file contents: real-pool adapter source/roles/revision/silence/candidate status/key pattern; Casting Bench R2 authoritative KFB Audio site/browser route; Next-MVP proof 3 real actors/no second AudioContext/human gate; provider-neutral resolver contract. These are static/source checks, not audio tests.
- **1/1 new GitHub source-prep file readback PASS**: S4_SOURCE_BACKED_TTS_PREP_R1_2026-10-10.md on current PR #379.
- **1/1 KFB Production Control Site document write+readback PASS**, exact UTF-8 contents byte-equal to GitHub (8,324 Unicode string code units, 8,330 UTF-8 bytes; SHA-256 7f1d7ad20dad0919c5e775346c72ba709271c14e1f93a978c3b7ffc037f6125a; Site file id 83d3d8f4-b664-427f-b33d-9db48e7d8221). This is private Site INBOX PERSISTENCE ONLY, not KFB Audio Site source or deployment.
- **0/0 new provider synthesis/browser playback/human audio/3D/runtime tests** (not attempted). Previously recorded 13/13 S1 adapter and 87/87 Audio Site checks were **NOT RERUN** here.

### Material source finding (pre-integration)

Current adapter voiceAssetKey includes sourceId, voicePreset, emotion, slot and normalized-text hash but **not sourceRevision, provider/model, render recipe or license/approval status**. Treat this as a production cache-identity gap before reusing the key for assets; sourceRefs already retains revision and need not be replaced. No new code was written to the adapter.

### Still open

Georg Voice Acting human KEEP/TUNE/CUT; accepted source-backed Triplet and Resident voice profile; exact English TTS renderer models/rights; Whole-versus-fragment listening quality; browser duck/cancel and bubble timing; separate World A/B gate. No automatic S4 implementation/World integration.

Next same human gate: existing KFB Audio Voice Acting tab, compare voice solo / D bed no ducking / D bed ducking and return KEEP/TUNE/CUT.

## 2026-10-10 · Heuristic MVP Voice/Conversation/Performance source-and-Site document proof

Status: **SOURCE / DOCUMENT / SITE-INBOX PROOF ONLY**. Georg reports existing Voice Acting usable and wants heuristic MVP voice mappings ahead of later manual fine-tuning. This is **not** a human voice-clip KEEP decision, acceptance of an ASR engine, 3D visual source-isolation proof, or World runtime implementation.

New source-preparation artifacts:
- `MVP_HEURISTIC_CASTING_VOICE_DIALOGUE_PERFORMANCE_DIRECTION_2026-10-10.md`
- `data/MVP_HEURISTIC_VOICE_AUDITION_CANDIDATES_R1.json`

Checked exact sources: real-pool adapter, R2 casting contract, next-MVP voice proof, Atlas cast, PetStudio bubble.v1, ChatterBox Studio v2 handover, Resident Performance Event Contract, Blender choreography prep and current EyeRig SSOT recovery. Old donors are **inspected source/code/contract references**, **NOT isolated original 3D designs visually shown**.

New deterministic document/data contract assertions: **23/23 PASS**. This check verified 5 distinct candidate actor IDs (3 required: Demon Lord, Robot One, Farmer A; 2 optional: Lorekeeper, Witch); candidate-only/nonfinal mappings; no fabricated provider voice IDs or cleared licenses; described older Lorekeeper and synthetic Robot auditions; staged optional microphone input, official operator IDs and LLM candidate quarantine; loading versus semantic thought separation; source bubble forms; real playback clock/KFB Audio ducking authority; muted text, protected World gate and distinct Speakrail/Resemble/KFB names.

Private KFB Production Control Site Inbox results:
- design document: file `50b32e81-06b4-440e-921d-22b8b5016b5f`, SHA-256 `a41dbf83c0f43399f6d1a59d4622aea986a1fd30c88158b89441d694e2aa5c92` — saved, read, UTF-8 text **byte-equal** to GitHub;
- editable proposal data: file `af5c3ac2-e37b-49dd-8ce8-d0b2a2f6620a`, SHA-256 `2922ea6c135069fe58bbd3fee3345593ae14521954b58a7299cf4544e0fddca2` — saved, read, UTF-8 text **byte-equal** to GitHub;
- Site document mirror **2/2 PASS**, NOT a republish of KFB Audio Site or a tested new Site tab.

New executable/functional proof counts: **0 actual ASR/microphone/LLM calls; 0 rendered/provider voices; 0 new browser audio or lip-sync test; 0 3D original-source isolation screenshots; 0 Stage; 0 game runtime**. Historical 13/13 adapter and 87/87 Site checks are not rerun by this preparation.

One owner-local next gate: `KFB_VOICE_HEURISTIC_THREE_ACTOR_SOURCE_AUDITION_R1` — candidate real English speaking samples and one source-backed Triplet timeline, retaining editable casting and later Georg tuning. In-world integration still separately requires the Four-Island A/B gate + explicit runtime authority.

## 2026-10-10 · Three-actor real eSpeak technical audition + versioned audio identity

Mode: bounded owner-local technical proof, **not a human casting pass, Site deployment, or a canonical Triplet consumer test**.

### Render evidence
- Local available CLI: **eSpeak 1.48.15**, FFmpeg/FFprobe **7.1.5**. `piper` and `espeak-ng` are unavailable in this exact execution environment; no ElevenLabs provider/secret used.
- Exact source for all three spoken lines: existing `data/CASTING_BENCH_R1_MANIFEST.json` blob `e30dc9b7eb020dbdaf9cc346cc3d4cf0feef77f9`. Status: `CASTING_ONLY_NON_CANON`, no canonical Triplet IDs. This is an **audio pipeline/sound contrast** fixture only, not proof of approved semantic NPC conversation.
- **6/6 actual eSpeak renders** and **6/6 ffprobe MP3 codec/duration inspections**, each with two variants for Demon Lord, Robot One and Farmer A.
- Sandbox package `KFB_VOICE_HEURISTIC_AUDITION_R1_ESPEAK_TECHNICAL.zip` (6 MP3s, manifest and README; 8 ZIP entries), 253,347 bytes, SHA-256 `3bc70771f57d690a0c8a91eb5e45f33047149882a48c2162a92731e49e55db49`; ZIP integrity **1/1 PASS**. Exact 6 clip hashes and provenance are persisted in `data/MVP_ESPEAK_AUDITION_R1_RECEIPT.json`. **Audio binaries are in the conversation attachment only; not uploaded to GitHub, KFB Production Control or KFB Audio Site.** Future executor should rerender from recorded parameters if the original attachment is not available.
- Human listening: **0**; Site/browser playback: **0**. The older eSpeak voice is synthetic and not a final natural/neural voice candidate.

### Implementation / local tests
- Added `runtime/voice-asset-identity.v1.js` as **output-only optional module**, not wired to the audio player or existing `real-pool-adapter.js`. Existing source/semantic/runtime ownership remains unchanged.
- New `tools/test_voice_asset_identity.cjs`; local Node **24/24 PASS** on the implementation bytes (exact implementation GitHub blob matched local git blob SHA `3cd1bd4a49db842931ea9284acc44ab4f86ff689`). Tests cover stable identities, invalidation on source/text/preset/affect/provider/model/voice/settings/recipe/locale/part changes, missing-version fail-closed, candidate internal audition allowed, shipping-rights/source/casting guard and public approved asset gating. The committed test file was read back; **no GitHub Actions run was performed**, and the committed test-file bytes are not asserted independently executed in CI.
- Asset identity is a complete JSON tuple (collision-resistant delimiter encoding, **not cryptographic asset signing**); caller may hash it for cache keys. **Rights and human acceptance remain separate release gates**, not meaning embedded in a computed hash. This closes the identified output-identity *design* gap in a dormant adapter; it does not yet integrate cache lookup in the published Site.

### Boundaries / remaining gates
- 0 actual new canonical Triplet Whole-vs-fragment listening comparisons;
- 0 new KFB Audio Voice Acting Site publications or exact published browser checks;
- 0 source-isolated 3D Resident visual proofs;
- 0 ASR/LLM/free-voice input runs, 0 World/WB2 R5 changes;
- no paid rendering, no merge or Live.

**Next productive gate:** `KFB_VOICE_TRIPLET_AUDIO_CONSUMER_SITE_INTEGRATION_R1` after a Sites-capable WSA reopens the existing KFB Audio Voice Acting tab, resolves one approved source Triplet + actual audible model/rights, reuses the tested identity guard and proves one real start/stop/duck/bubble loop. Heuristic casting can remain tentative until Georg later fine-tunes.
