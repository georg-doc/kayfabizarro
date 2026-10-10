# WSA · KFB Voice Casting Bench — minimal integration brief
Date: 2026-10-10
Status: IMPLEMENTATION BRIEF · BOUNDED SITE TOOL · NO GAME RUNTIME / WORLD R5 AUTHORIZATION
Repo: georg-doc/kayfabizarro
Owner: existing KFB ChatterBox Voice / PR #379
Branch: planning/kfb-chatterbox-voice-layer-v1-2026-10-08
Outcome: ONE user-operated voice audition/casting workbench in the existing ChatterBox Voice owner and Site identity (reuse productive Site if verified in current registry); after first publish author can adjust voices, Triplets, mood assignments and imported clips WITHOUT new Work deployment.
Execution: Work/WSA only production writer; independent QA and Guard required under existing KFB contract.

## Read-first/current truth
1. skills/chat/START_HERE.md
2. skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
3. skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
4. skills/chat/KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md
5. skills/chat/KFB_ELEVENLABS_PIPER_EMOTIONAL_TRIPLET_VOICE_POOL_STRATEGY_2026-10-10.md
6. skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json
7. skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/runtime/real-pool-adapter.js
8. Parallel authoring source (read-only): skills/chat/KFB_TRIPLET_FIRST_PLAYER_BUBBLE_DIALOGUE_DIRECTION_AND_DRIFT_POSTMORTEM_2026-10-10.md on planning/kfb-fluff-crafting-almanac-ideation-2026-10-09, plus its latest Sinnfeld/Triplet sources.
Retrieve current branch HEAD/PR and all existing Site/donor prototypes before writing. Do not copy old demo text as canonical.

## Reuse & token budget
No new ChatterBox semantic engine, no extra AudioContext, no second mixing owner, no separate source registry for Characters or Cards, no duplicated Asset Librarian or Hub dashboard, no generic UI shell.
Inspect the existing ChatterBox Studio donor, voice audition preset and audio mixer. Show any visual donor/source in isolation before compositing it. Reuse source-backed character profiles and current pool adapter (166 records/13 tests as historical baseline, re-run not assume PASS). Use the KFB Audio owner for gain/ducking. Keep Site identity if already owned and productive. Expose ONLY demonstrably functioning engines and controls.

## Smallest viable integration slices
S0 SOURCE / CAPABILITY GATE: locate real reusable donor and check browser WASM/ONNX/WASM-eSpeak support, deployment constraints, licenses, assets, language availability and Site persistence. First implementation must play actual ENGLISH samples in target browser; `de_DE` Thorsten Piper is NOT validated English. eSpeak NG native/built browser donor vs Piper neural are distinct engines. If browser Piper cannot execute, test a verified small server-side render path or choose actual available eSpeak-NG English as first honest audible proof; no inert engine toggle.
S1 CASTING BENCH: source-backed three audition actors Demon Lord, Robot One, Farmer (Lorekeeper optional); editable 3-beat `subject/connector/reframe` with meaningful connector, short bubble transcript, selectable profile, voice engine/preset, six **editable/unapproved** Story Mode slots and extendable mood tags. Listen/compare genuine generated audio, stop/replay, muted text.
S2 DATA-ONLY OPERATIONS: mapping schema and versioned asset manifest in the existing owner with ids/provenance/locale/voiceId/engine/version/rights/status and `clipId,textHash,actorId,moodTag,sourceTripletId,sourceRevision,audioRef,timingRef`. A human can import files, tag/approve, change weights and publish updates without Work code check-in. Select one authenticated writable backend or existing Asset Librarian/Production Inbox service after verified capability; a read-only GitHub feed alone cannot fulfill write requirement. If remote durable write requires an unavailable service, ship honest local export/import and note blocker, not fictive persistence.
S3 TIMED PLAYBACK: recorded sample playback, exact text timing where available (ElevenLabs timestamp API), Piper/eSpeak real duration or validated local alignment, progressive bubble reveal with visible exact text/mute and cancellation; do not promise accurate word-alignment when engine lacks it. Whole-triplet first; fragment stitch only after real listening QA. Audio owner retains mix/duck authority.
S4 OPTIONAL LATER ElevenLabs API: server-side secret only; no API key in client/Site repo or network payload exposed publicly. Use paid API only after user consent/credits and backend security review. For first release permit manual audio-clip import. Preserve Roger/Siren Social Call cues and audition Waffle Fluff / Stay Fluffy as candidates without overwriting accepted clips.

## Test matrix / acceptance
- 3 actors x 3 English triplets x >=2 genuinely audible engine/preset variants IF available; state actual capability if fewer; no synthetic claims.
- 1/2 visible NPC bubble acceptance prototype, BINGO/BOGGLE/BONGO choice and BLÖDSINN escape as read-only UX simulation; optional player reply as a visible short Triplet, no game semantic-state implementation.
- Real browser playback, pause/stop, mobile layout, muted accessibility, text integrity, no engine stubs, repeat play, data import/export, persistence/reload and clip provenance.
- Confirm one voice vs contrasting moods, source rights, 6 Story Mode editable slots (definitions come from concurrent chat; placeholders not canon).
- Publish/update existing GPT Site if Sites capability available, verify exact live Site and source revision; do not substitute Cloudflare. If no Site publisher, persist Site-ready source and issue SITES_PUBLISHER_REQUIRED.
- ZERO ElevenLabs paid renders required at R1. No game runtime/world writes, no merge/Live.

## Checkpoint discipline
Coherent source implementation checkpoint → evidence/tests checkpoint → Return/handoff checkpoint. Verify branch head and intended files after EACH GitHub write. Timeout = UNKNOWN, inspect before retry. Do not rewrite main router/Hub for routine bench status. Preserve concurrent Triplets/story-mode branch from edits.

## Delivery/human operation
Georg needs one tool entry with Listen, Voice Select, Triplet, Mood/Story Mode, import clip, mapping review; after setup normal content work does not require Work. Return actual Site URL only after exact-open visual/audible proof; repo/branch/PR/head, changed files, numerical tests, rights/cost/security gaps and exactly one next gate:
`VOICE_CASTING_BENCH_R1_HUMAN_LISTEN_KEEP_TUNE_CUT`.
