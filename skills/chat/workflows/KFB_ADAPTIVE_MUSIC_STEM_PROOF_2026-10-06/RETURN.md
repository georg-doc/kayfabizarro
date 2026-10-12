# RETURN · KFB Audio Module Pre-Integration · No World Writes


## 2026-10-12 · WSA SELF-SERVICE SITE UPGRADE BRIEF · PREP ONLY

**Georg binding correction:** WSA may edit the existing KFB Audio Voice Acting Site once to provide full content/voice/music testing access, but **ordinary future Triplet generation, Bridge edits, Card performance sequences and new source data cannot depend on more Work runs**. This is the new product P0 for the bounded future Site upgrade, not permission to create a second application.

**New exact handoff:** `WORK_WSA_AUDIO_VOICE_ACTING_SELF_SERVICE_CARD_PERFORMANCES_R1_2026-10-12.md` on existing Audio PR #365, branch `web/kfb-adaptive-music-stem-proof-2026-10-06`. Design keeps existing `https://kfb-audio.frizzlebob.chatgpt.site` source/project and D Conversation Base 94 BPM real 10-stem family; existing Audio owns AudioContext/MusicClock/mixer/duck. Source/Card/Triplet candidate truth remains KFB ChatterBox Voice PR #379, exact 48-card original deck; 3 dry recorded voice sources and 150 time cues were produced in conversation ZIPs, **not added as binary blobs in GitHub**.

**One-time Site feature required:** In-place Voice Acting section consumes source-revisioned content from GitHub (approved default and explicitly opted-in candidate preview), reloads new data without Site source redeploy; edits/imports/exports Card/Bridge/narrator/bed/voice locally, preview audition with no new UI shell; secure optional delegated Save only if supported, otherwise explicit JSON export to ordinary Web Chat + GitHub connector workflow. No invented credentials, accidental public promotion, or permanently baked 48-Card source data. **Same A/B voice DRY vs real D-bed** with original music timeline and current Speech Focus is required.

**Acceptance is NOT satisfied** until 2 actually new ordinary data-only GitHub commits (not authored via Work) appear at same real Site after reload with 0 additional Site deploys, with documented real browser/visual evidence, and one actual D-base speech audition. This Web Chat only wrote/verifies a Work brief and recovery metadata. New runnable audio, UI testing, actual Site revisions, measured hot updates: **0**. No hub URL change, Cloudflare, Stage, Live or merge.

**Next one gate:** `AUDIO_SITE_SELF_SERVICE_HOT_RELOAD_AND_D_BED_SITE_AB_R1` carried by the **Sites-capable Work/WSA builder** in existing Audio project; after product behavior is proven, routine content authoring is ordinary Web Chat or in-Site editor (no Work).

---

Date: 2026-10-06
Status: **AUDIO_MODULE_TECHNICAL_GREEN · NO_WORLD_WRITES · NOT_HUMAN_ACCEPTED**
Owner: KFB Audio / Jukebox / Mixer
Executor: ChatGPT Work/WSA
Repo: `georg-doc/kayfabizarro`
Draft PR: **#365**
Branch: `web/kfb-adaptive-music-stem-proof-2026-10-06`
Evidence head before final Return: `8c32d2bf8afecac063c2b1e11362710a1051504e`

## Outcome

The Audio-owned DOM-free runtime is ready for a later tiny World context/event adapter. This slice did not write to the World.

- one injected existing AudioContext / SCORE destination;
- module-created AudioContexts: zero;
- no DOM, WB2 import or Audio Site UI dependency;
- one Audio-owned MusicClock/resolver/mixer/speech-focus owner;
- serialized `setContext()` / `emit()` application;
- smooth family gain crossfades with old-deck retirement after the fade;
- shared full-bar loop endpoints for C/M/N/O;
- real-master fallback when a stem roster fails;
- safe retain-current-or-silence policy when a capability is unavailable;
- G/D behavior and verified status remain intact.

No second runtime, mixer, clock, Site or World architecture was created.

## C/M/N/O technical verdicts

All real stems decoded at 44.1 kHz stereo with **0.00 ms family-internal duration delta**.

| Family | Verdict | BPM | Stems | Stem duration | Runtime loop end | Master fallback |
|---|---|---:|---:|---:|---:|---|
| C · Cozy Base | `RUNTIME_VERIFIED` | 81 | 10 | 180.959977 s | 180.740741 s | PASS · 179.879977 s |
| M · Island Life | `RUNTIME_VERIFIED` | 112 | 10 | 249.527982 s | 248.571429 s | PASS · 249.839977 s |
| N · Dusk/Night | `RUNTIME_VERIFIED` | 70 | 11 | 204.695986 s | 202.285714 s | PASS · 205.840000 s |
| O · Discovery/POI | `RUNTIME_VERIFIED` | 82 | 9 | 251.399977 s | 248.780488 s | PASS · 249.959977 s |

Declared BPM is plausible for all four exports within half a beat. The encoded tails are not exact phrase endpoints; the runtime uses one shared full-bar floor per family instead. Deterministic 100-loop inter-stem drift is 0.00 ms. Phrase-safe enter/exit remains owned by the existing MusicClock vocabulary and gain crossfade.

Technical promotion is not human acceptance.

## Ambiguous source-labelled layers

Disposition: `AMBIGUOUS_RETAIN_MUTED` / default gain 0.

- C Backing Vocals;
- M Lead Vocals;
- M Other;
- N Lead Vocals;
- N Backing Vocals.

O has no Vocal/Other-labelled split. The browser signal audit proves these sources are real and decodable but makes no semantic or human-audible acceptance claim. They remain inaudible by default.

## Public runtime capability

The runtime exposes:

- `createKfbAudioRuntime()`;
- `setContext(kfb.audio.context.v1)`;
- `emit(kfb.audio.event.v1)`;
- `getCapabilities()`;
- `getEvidence()`;
- `suspend()` / `resume()` / `dispose()`;
- existing advanced Audio-owned `loadFamily()` / `applyPreset()` / `setSpeechFocus()` seams, which the future World adapter must not call.

Current mappings owned by Audio:

- Movement → G;
- Staying/day → M, verified C fallback;
- Dusk/night → N;
- `POI_DISCOVERED` → O;
- Resident/Billboard dialogue → D + Speech Focus;
- missing requested capability → retain current verified family or silence.

D Speech Focus remains complementary to the host's existing TTS ducking and never replaces it.

## Fixtures and fallbacks

All eight Audio-owned fixtures use only public `setContext()` / `emit()` input and contain no track/family IDs, BPMs, stems or gains:

- `DAY_ROAM` → G;
- `DAY_STAY` → M;
- `DUSK_TO_NIGHT` → M → N crossfade;
- `POI_DISCOVERY` → M → O crossfade;
- `RESIDENT_DIALOGUE` → D + Speech Focus;
- `BILLBOARD_DIALOGUE` → D + Speech Focus;
- `DRIVE_TO_STAY` → G → M crossfade;
- `MISSING_FAMILY_FALLBACK` → retains G without error/restart.

Forced stem failure produced `MASTER_FALLBACK` for C/M/N/O with the same injected context and zero runtime-created contexts.

## Tests

- existing G/D proof regression: **18/18 PASS**;
- runtime registry/ownership/resolver: **46/46 PASS**;
- synthetic context/event fixtures: **8/8 PASS**;
- real browser audio decode: **44/44 PASS**;
- family alignment: **4/4 PASS**;
- real-master fallback: **4/4 PASS**;
- browser warning/error log: **0**;
- `git diff --check`: PASS.

Detailed evidence:
`AUDIO_MODULE_PREINTEGRATION_TEST_EVIDENCE_2026-10-06.md`

Consumer packet:
`AUDIO_MODULE_CONSUMER_PACKET_2026-10-06.md`

## Changed files in this bounded slice

- `tools/KFB-ToolBox/audio/runtime/README.md`
- `tools/KFB-ToolBox/audio/runtime/context-fixtures.v1.mjs`
- `tools/KFB-ToolBox/audio/runtime/kfb-audio-runtime.mjs`
- `tools/KFB-ToolBox/audio/runtime/music-resolver.mjs`
- `tools/KFB-ToolBox/audio/runtime/qa-browser.html`
- `tools/KFB-ToolBox/audio/runtime/qa-browser-page.mjs`
- `tools/KFB-ToolBox/audio/runtime/qa-fixtures.mjs`
- `tools/KFB-ToolBox/audio/runtime/qa.mjs`
- `tools/KFB-ToolBox/audio/runtime/runtime-registry.v1.json`
- `skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/AUDIO_MODULE_CONSUMER_PACKET_2026-10-06.md`
- `skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/AUDIO_MODULE_PREINTEGRATION_IMPLEMENTATION_2026-10-06.md`
- `skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/AUDIO_MODULE_PREINTEGRATION_TEST_EVIDENCE_2026-10-06.md`
- `skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/RETURN.md`
- `skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/CHANGELOG.md`

## No-touch confirmation

No write to:

- PR #348 / WB2 / any World runtime or architecture;
- Production Hub or central router;
- Cloudflare;
- KFB Audio Site or any second Site;
- Race, Combat or unrelated product files.

PR #365 remains Draft and unmerged. No Live promotion occurred.

## Unresolved

- exact Claude Coworker World Return/branch/head is still absent from this Audio slice;
- World-side adapter is intentionally not implemented;
- ambiguous Vocal/Other layers remain muted pending any future genuine audible product decision;
- no independent critic/guard acceptance or `HUMAN_ACCEPTED` claim is made by the production writer;
- the existing private KFB Audio Site remains unchanged at Site Version 5 / Source 0.3 with its separate G/D listening gate.

## One next gate

**Only after the exact Claude Coworker Return is visible:** ChatGPT Work/WSA Anschluss-Integrator reads that returned World architecture and adds one tiny World-owned adapter that injects the existing AudioContext/SCORE bus and sends only `setContext()` / `emit()` data into this finished Audio module.

No World integration before that exact Return.
