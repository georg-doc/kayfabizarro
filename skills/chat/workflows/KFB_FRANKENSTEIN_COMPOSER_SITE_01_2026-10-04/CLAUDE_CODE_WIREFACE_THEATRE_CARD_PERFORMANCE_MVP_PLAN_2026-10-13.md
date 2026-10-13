# Claude Code planning brief · Wireface Theatre → KFB Card-Performance MVP
Date: 2026-10-13
Status: **GEORG DEMO FACES+VOICES POSITIVE · CLAUDE CODE PLAN/RESEARCH AUTHORIZED · PRODUCTION BUILD CONDITIONAL**
Mode: bounded **PLAN-FIRST**, then existing-owner technical implementation only when the named prerequisites are real, without interpreting this document as authorization to bypass the current Audio human gate.
Single receiving owner / only eventual production writer: KFB ToolBox / **existing** FrankenStein Composer PR #355, `planning/frankenstein-composer-gpt-site-2026-10-04`, `georg-doc/kayfabizarro`.
Authoring/speech/source consumers are other existing owners, **read-only** for this slice:
- Audio PR #365 `web/kfb-adaptive-music-stem-proof-2026-10-06`; existing Audio GPT Site **Source 0.7.1 / version 11**, `https://kfb-audio.frizzlebob.chatgpt.site/`. Its final verified engineering head at planning: `9325a4af861d0a07e1986490f7ee42aa3f047819`.
- Content/Voice PR #379 `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`; observed head `fc85c2e14da2e9768617095d8af4c0774305e0be` (re-fetch on start).
- Composer observed prebrief head `9cf3e25998d5523b3c1844266ab979b8aea6723b` (re-fetch).
- Current Composer private Site v4: `https://kfb-frankenstein-composer.frizzlebob.chatgpt.site/`. **Wireface vendor not yet integrated/deployed**.

## Binding user decisions and questions

Georg personally tried the public **Wireface Theatre Demo** `https://wireface.dev/threejs/demo/` and reports BOTH facial acting AND demo voices **"super"**. This is **HUMAN_DEMO_POSITIVE** for the original vendor demo, **NOT** acceptance of those clips' reuse rights, reproducible TTS identity, KFB Clay/rig fit or a live KFB build.
He asks to reuse the appealing faces/voices for the GitHub KFB Card Triplets and improvised source-qualified Openers and have **Claude Code plan the MVP**. He also asks whether React + Three.js is possible. **Yes**: a React host with `@react-three/fiber` may own UI/Three scene; a vendor plain-Three `Object3D`/face is mounted inside the existing R3F canvas with explicit lifecycle cleanup. **But the actual Composer currently uses ONE imperative Three.js 0.160 renderer**. Do NOT migrate the current Composer to React merely for this small task, or create a second renderer/Canvas. Build a framework-independent adapter now; describe the optional future R3F consumption seam.

## Must read from CURRENT GitHub (GitHub state supersedes this snapshot)

1. `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
2. Composer `START_HERE.md`, `RETURN.md`, `TEST_REPORT_2026-10-12.md`, `WIREFACE_OPTIONAL_FACE_DONOR_MATRIX_2026-10-13.md`, **`WSA_WIREFACE_FACE_DRIVER_MVP_ONE_SHOT_2026-10-13.md`**, `WIREFACE_FACE_DRIVER_MVP_ADAPTER_TEST_REPORT_2026-10-13.md`.
3. Real owner source `kfb-hub/stage/toolbox/frankenstein-composer/app.js`, `wireface-face-driver-contract.mjs`, `tests/wireface-face-driver-contract.mjs`, existing rig/gallery/source bench. Previously adapter stub-tested 17/17 + 25/25 structural; **0 real vendor/browser**; do not duplicate it.
4. **CURRENT** Audio `skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/RETURN.md`, `TRIPLET_OPENER_POOL_CONSUMER_CONTRACT_R1_2026-10-13.md`, `TRIPLET_OPENER_POOL_SITE_TEST_EVIDENCE_R1_2026-10-13.md`, source `tools/KFB-ToolBox/audio/card-performance-self-service/`, actual `evidence/consumer-packet.json`.
5. Voice `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/RETURN.md`, `KFB_CARD_PERFORMANCE_SCENELET_CLAY_STAGE_CONCEPT_R1_2026-10-13.md`, `KFB_GROK_STANDUP_OPENERS_CUT_SPIN_TRIAGE_R1_2026-10-13.md`, `POSTMORTEM_TRIPLETS_R1_SHOW_IT_POWER_LORE_OMISSION_2026-10-13.md`; current candidate pool `data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json`.
6. Official donor: `https://wireface.dev/threejs/`, `https://wireface.dev/docs/three/`, `https://wireface.dev/license/`, `https://wireface.dev/threejs/demo/`; verify **actual downloaded SDK version/rights** before any installation. Do NOT use unrelated `styk-tv/wireface` Babylon.js library. Product page shows 11 Theatre cast character recipes and `face.say(await face.clip('sarah'), {audioContext})`, `attachFace`, `FaceMesh`, `ModelFace`. Do **NOT** equate `face.clip('sarah')` with arbitrary TTS generation.

## Voice portability: MANDATORY first Claude Code investigation

Produce an auditable 11-character **Theatre voice inventory** (Sarah, Walter, Count Dracula, Grub, Unit-7, Zib, Wisp, Patch, Captain Amara, Eleanor, Kit) **from actually accessible vendor SDK/demo files**, distinguishing:
- named character/preset from actual sample `clip()` IDs; actual downloadable/playable clip bytes/format/hash/duration; whether clip is prerecorded vs browser/provider TTS vs API stream;
- provider, Voice ID, synthesis API or model (when source evidence actually gives it); **UNKNOWN** is a valid result;
- license to use/distribute original sample files, license to synthesize arbitrary KFB texts using the same voice, necessary attribution, cost, SDK redistribution, private vs public/commercial boundaries;
- authentic user listen score is **positive for the demo only**, not a right to rip sample audio, clone a voice or represent a source as freely reusable.
Decide `REUSE_RECORDING_PERMITTED`, `TTS_PROFILE_REPRODUCIBLE`, `REFERENCE_ONLY` or `SOURCE/RIGHTS_UNKNOWN` **per voice**. Do not extract protected streams or propose unlicensed cloning. If no legal synthesizable identities exist, use **legitimate existing KFB Voice Layer voice candidates**, audition for similar expressivity; preserve demo audio only in source-isolated vendor evaluation where licensed. A voice clip and a voice model are two different things.
Existing Audio consumer **VoiceClips = []**, no accepted/rights-cleared spoken KFB clips or renderer-specific timings. Do not fabricate a clip receipt or phoneme alignment. Existing eSpeak audition was judged unintelligible and must not be MVP voice baseline. A licensed demo sample may prove the facial engine only, not a new KFB Card utterance.

## Recommended first product: ONE real source-backed theatrical Card performance

**Target visible result:** On the existing Composer's single Three.js stage, one proven real KFB actor (GothGirl Rig_Medium + pinned FrizzleBob v5 head; only actual measured compatible source) is seen beside **one actual printed KFB Card** on the accepted B0 Billboard. Show one author-approved **standalone Card Beat** with a source-qualified intro Opener, voice performance, eyes/brow/mouth reaction, silent partner/look-to-card if cheap, cut/pause/outro. Reuse real KFB Clay materials and authored Stage; no stock KFB look replacement.
First content fixture: Wrinkle Rumble **Card #10 The Cookie of Causality**; current pool has Cookie v3 as `EDITORIAL_CANDIDATE`, **not accepted**. Include DIRECT / HEARD_OF / EVER_TASTED only when supported by the exact source class; compare COMPACT vs FULL_SOURCE_RECITAL. A standalone beat requires **no fabricated Bridge**. Spoken exact `cardName` and true POWER+LORE semantic interaction are compulsory for a strict SHOW IT→SPIN IT→SELL IT Card Triplet; a full-source recital is source-faithful but **not automatically comedy-approved**. One physical Card text line + blank-line cut separation; optional once-per-set greeting, `Stay Fluffy!` final if a full set.
Evidence Card `deckId + cardNumber + cardBlob + exact original PDF page/quadrant/source hash`, voice cue `clipId + providerId + voiceId + rights + SHA256 + durationMs + rendition-specific cue times` only once actual measured/rendered; `sourceRetention` distinct from semantic quality. The PDF full original page was validated in Audio v11; exact printed Card crop still OPEN. Never replace with `artworkPrompt` or invented image.

## Locked construction seams

- **Existing Composer** owns body/head/source isolation, native Eyes/FaceHost/HeadGraft/Motion, ONE current Three renderer. Extend existing optional `KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL` modes (screen deferred). Head bone/mount measured, FaceMesh original SDK isolated IN VIEW before insertion; source URL successfully loading is insufficient.
- Wireface facial channels own one region at a time. No parallel KFB EyeRig/PetMouth and Wireface driving same eyes/lids/mouth/rotation. Restore Native on fallback/teardown; exact body motion/eye gaze/idle/silence; retain KFB material/lighting.
- **KFB Audio PR #365** owns AudioContext, transport, duration, ducking and D-Bed/DRY. Inject its current source/clock to vendor `face.say` or `face.listenTo` according to **actual verified** API; avoid vendor-started second AudioContext and double media playback. Never time lip motion against mixed music when dry source or real alignment available.
- Voice PR #379/ChatterBox is semantic/source/candidate owner; scene takes **accepted** `kfb.voice.card-performance-packet/1` via Audio consumer adapter `consumePacket(packet)`. Use `consumePacket(packet,{preview:true})` ONLY in clearly labeled private noncanonical isolated QA, NEVER simulate user acceptance. Unapproved/missing POWER/LORE/disabled opener -> fail closed, silence valid, correct original card still visible.
- Real Billboard/Card Builder owns actual card art, real actor source/pin, Resident Atlas scenelet receives later. No World R5/Island rebuild, second world scene owner, new parallel audio/Triplets Site or generic branding.
- Actor recipe retains `kfb.pets/1` and separate optional `kfb.frankenstein.face-driver-companion/0.1` / vendor `.wireface.json`; no assertion an ordinary GLB alone contains procedural Wireface animation until cold GLB import proves it.
- Current private Composer GPT Site is the ONLY initial user-facing acceptance host. No Cloudflare, no second Site, no public host or Live.

## Claude Code plan-first phases (do NOT silently implement before authorizing build)

**P0 Reconcile & isolate**: exact current repo refs/PRs; original three KFB sources alone (GothGirl GLB, FB head donor, B0 Billboard/original Card), original Theatre actor/face shown independently via actual SDK. Inventory 11 sample voices and licensing. Give explicit React/R3F compatibility recommendation (framework-independent Three driver inside existing imperative owner for MVP, R3F wrapper later) and exact native composer integration points. If vendor package/rights unavailable, `VENDOR_SOURCE_REQUIRED` with smallest user action, no fake stand-in.

**P1 Execution-ready plan & fixtures**: one one-Card source-bound visual/audio cue fixture; exact accepted-only/preview consumer distinction; React alternative sketch **not** parallel implementation; source object screenshot list; code file delta roster; sample A native vs B Wireface same camera/light/clip; voice-owner rights matrix; actions run in existing Site after prerequisites; rollback/reversibility.

**P2 Conditional build after human/content readiness**: Before integrating new KFB Card spoken content, Audio v11's **open** `KFB_AUDIO_TRIPLET_OPENER_POOL_HUMAN_KEEP_TUNE_CUT_R1` must be resolved and packet contain at least one actually authorized source-aligned audio clip, accepted beat+opener and real Card crop. Otherwise Claude can perform source-isolated licensed **face demo research** and finish planning but must not call Card/MVP integration accepted. Prefer direct extraction of recorded permitted KFB voice track through current Voice owner; no automatic TTS payments, unlicensed voice sample copying or bypass. No new deployment until planned and authorized.

**P3 Named MVP QA once P2 permitted**: KFB native/Wireface switch 3x on identical model, one real clipped/source-backed Card with head/gaze/phoneme sync and pause/reaction, exact text muted, missing beats no speech, verified real billboard source, KFB Clay vs Golden screenshots and short audible video, shared audio clock, no fake/duplicate face. Export actor+face companion, cold reload; regular Composer/Creature 22/22 baseline and existing 17/17 adapter regression re-run, plus new tested cases; actual counts, browser logs/performance and individual known failures recorded. Recheck WebGL and former private Composer GLB/JSON human gate. Independent tester+critic+Production Guard, builder sole writer. After two non-improving repairs quarantine smallest noncore seam.

**P4 Return only after facts**: exact repo/branch/PR/head, changed filenames, CI/tests/run counts, SDK version and licenses, source-isolation proof, direct existing GPT Site and *visibly verified* version if published, any audio clip SHA/voice rights, unresolved items, one next gate; no auto merge or Live. Return/changelog/hub routing only for meaningful milestones.

## Immediate Claude Code deliverable (this handoff)

Create an **implementation-ready plan and voice provenance/rights inventory**, not a new runtime or new React app. Use present Composer PR #355 as one future owner; read Audio #365 and Voice #379 only as verified donors; preserve Composer source/tests. One next gate for this **planning** run:
`CLAUDE_CODE_WIREFACE_THEATRE_VOICE_PROVENANCE_AND_ONE_CARD_MVP_PLAN_R1`.
Human Audio production acceptance remains independently pending and unchanged:
`KFB_AUDIO_TRIPLET_OPENER_POOL_HUMAN_KEEP_TUNE_CUT_R1`.
No code/site/deploy/merge/Live claims from this document.
