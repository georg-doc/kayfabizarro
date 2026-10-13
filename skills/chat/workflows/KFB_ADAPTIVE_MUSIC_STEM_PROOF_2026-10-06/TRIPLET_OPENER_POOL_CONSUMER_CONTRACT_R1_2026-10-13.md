# Triplet & Opener Studio · consumer contract R1
Date: 2026-10-13
Status: TESTED_PREVIEW_CONTRACT · HUMAN_ACCEPTANCE_PENDING · PHASE_2_DEFERRED

## Exact owners
Audio owner: georg-doc/kayfabizarro PR #365, web/kfb-adaptive-music-stem-proof-2026-10-06.
Editorial content owner: same repo PR #379, planning/kfb-chatterbox-voice-layer-v1-2026-10-08.
Existing Audio Site: https://kfb-audio.frizzlebob.chatgpt.site/ · Source 0.7.0 · version 10.
Site source: 43d78782a652ce852ae923fe42193807a8d6a168.
Composer #355 head read-only context: 9cf3e25998d5523b3c1844266ab979b8aea6723b. No Composer/Wireface/Scenelet writes.

## One tested data read path
GitHub Contents API:
GET https://api.github.com/repos/georg-doc/kayfabizarro/contents/skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json?ref=planning%2Fkfb-chatterbox-voice-layer-v1-2026-10-08

Decode UTF-8 Base64 content, validate kfb.voice.triplet-opener-pool/1.
Record returned Git blob SHA separately from contentRevision. Current r3:
- Voice commit d9cfc557875a6f9067221bd050820b32938c1768.
- contentRevision triplet-opener-pool-r3-cookie-tune.
- content blob 8991f29acd239b6b0dc66c25462ea166a15ebd49.
Resolve originals via media/kfb/index.json and exact media/kfb Card JSON blob. No 60-to-3 default. Pool preview is explicitly opted in; no accepted public pool is currently published.

## Actual exported packet
Schema kfb.voice.card-performance-packet/1, additive JSON adapter in triplet-pool-core.mjs:
consumePacket(packet) defaults to accepted-only.
consumePacket(packet, {preview:true}) is the explicitly marked QA route.
The actual Site-downloaded packet is in evidence/consumer-packet.json. Both preview read and default candidate rejection were executed against that actual file.

CardBeats: stable beatId + version, deckId, cardNumber, cardBlob, mode COMPACT or FULL_SOURCE_RECITAL, surfaceText, evidence spans for audible original title/Power/Lore, sourceRetention, independent semanticCoverage/novel-claim/human review fields, speaker, delivery, openerId + pinned openerVersion, performerFictionApproval, status/reviewer/history.
Openers: stable openerId + version, exact English title pattern, source class and required evidence, performerFiction, enabled/retired, review status, owner/reviewer/source/history.
PerformanceSet: orderedBeatIds, optional bridgeIds (empty NO_EDGE in this standalone MVP), optional intro, required Stay Fluffy!, blank-line text cuts. No guessed alignment.
CardVisuals: original PDF path, verified PDF Git blob when the user opens it, registry-derived page and quadrant. Actual original full page rendered and hash-verified for Cookie; exact crop remains PENDING. No replacement artwork.
VoiceClips: currently EMPTY. A later actually rendered/authorized clip must have clipId, SHA-256, durationMs, provider/voice identity, source beat IDs/versions, exact rendition cues with cueId/startMs/endMs and rights/review metadata. No source-only packet is advertised as containing audio.
Browser speech start/boundary events are factual runtime events, not saved clip timestamps or visemes.

## Acceptance and source protection
Default consumer rejects preview/candidate records, missing source evidence, absent original title/Power/Lore, unsupported or retired/disabled opener, opener version drift, and missing human approval.
Local KEEP is a local preference, not ACCEPTED. Import clears untrusted reviewer/human approval in current beats AND history; Undo cannot restore imported acceptance claims. QUARANTINED/PROPOSED remain blocked.
Independent editorial source review of Cookie v1 is in history. Cookie v2 is EDITORIAL_CANDIDATE. Human comedy/intelligibility acceptance stays PENDING. No ACCEPTED pool records were invented.
Full-source recital preserves source wording but is not automatically a semantic Triplet or comedy PASS.
SemanticCoverage is an editorial claim for human review; token-position retention is separately measured. Compact Cookie references 14/28 original source tokens (50%); full source references 28/28 (100%).

## Everyday content edits without Work
1. In the same Audio Site: enable preview, select Deck/Card, compare original source; edit a Card line/evidence/delivery or maintain opener JSON, audition, save locally.
2. Download editor + writeback JSON. It includes expected Git blob and noncanonical local state. A stale base is visibly marked REVISION CONFLICT; reconcile in ordinary Web Chat rather than blindly replacing the remote file.
3. Ordinary Web Chat + GitHub fetches the current Voice branch pool; compares expectedBlob and current blob; merges the explicitly requested Beat/Opener changes; keeps originals immutable and review status truthful.
4. Commit only the content file on PR #379; fetch exact branch head and intended file after write. Timeout UNKNOWN requires inspection before retry.
5. Same Site: Reload pool, compare old/new contentRevision and fingerprint, Reload Card recipe to deliberately adopt the new remote Beat. No Site source publish or recurring Work invocation.
Direct in-Site cloud Save is unavailable; no browser GitHub token or fake authenticated backend exists.
Deck-scoped local storage preserves edits/selection/history across Deck switches. Source revision conflicts preserve the old draft and fail closed rather than silently migrate. Editor JSON recreates the state in another browser; external review claims are downgraded.

## Honest remaining boundaries
Only a curated Cookie compact recipe is seeded. Other complete source cards get explicitly labeled source recitals; new compact recipes require source-grounded editorial authoring.
Typed Bridge editing remains available in the protected legacy Card Performance editor; the new standalone consumer uses NO_EDGE. No new Bridge was fabricated or automatically admitted.
No new Audio renderer/context/clock. Audition delegates to KFBCardAudition in the existing Card Performance renderer and KFBAudioSite. DRY temporarily mutes the owner's music master while keeping the timeline alive; D uses existing real stems/Speech Focus.
The consumer adapter is tested for candidate read/rejection. Actual accepted audio/voice/crop reuse and Claude Code execution remain deferred until the human product gate.

## One next gate
KFB_AUDIO_TRIPLET_OPENER_POOL_HUMAN_KEEP_TUNE_CUT_R1: Georg auditions Cookie compact/full source with DIRECT / HEARD_OF / gated EVER_TASTED, chooses the intelligible voice/delivery and source fidelity. Phase 2 begins only after that acceptance and an actual accepted voice/crop packet.
