# WORK / WSA ONE-TIME SITE UPGRADE · KFB Audio Voice Acting: self-service Card Performances
Date: 2026-10-12
Status: **EXECUTED ON EXISTING SITE · TECHNICAL HOT-RELOAD GREEN · OWNER RELOAD/LISTEN OPEN**
Execution mode: BOUNDED ONE-SHOT · Sites-capable Work/WSA Builder, one production writer only.
Owning product: **existing KFB Audio Site / KFB Audio + Jukebox + Mixer**.
Repo: `georg-doc/kayfabizarro` · Audio Draft PR **#365** · branch `web/kfb-adaptive-music-stem-proof-2026-10-06`.
Existing Site: **https://kfb-audio.frizzlebob.chatgpt.site** · project `appgprj_6ac1c73dc28881919123106bd6d3e90e`.
Consumer source, never a second Site/runtime owner: KFB ChatterBox/Voice **Draft PR #379**, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`, current recovery head at brief creation `4a43779faa5b99ddf9dd34b3b3058e9c3b90ef8d` (re-read when executing).
Human authority: Georg for creative voice and promotion decision. Audio owner only for mixer/clock/Site shell.

## Execution result · 2026-10-12

Status: **ONE-TIME SITE UPGRADE EXECUTED · TWO POST-DEPLOY DATA EDITS VALIDATED · OWNER VISUAL/AUDIO GATE OPEN**

- Existing Site only: Source 0.6.0, Site version 9, deployment `appgdep_6accacccd79c8191be9c35ff35736f35`.
- Audio implementation commit: `0528fa48312278f6a37bc03b1a0cf55e09a47aa9`.
- Two later ordinary Voice content commits: `a3eba17e2473d511268055a2471df0c19ccbc302` and `341fe721a7280c7d0ed025de129ace750a06ed49`.
- Loader contract: 12/12 PASS for both r2 and r3; Site remained version 9; additional Site publishes: 0.
- Full static validation: 18/18 core and 172/172 packaged Site.
- Generated Site screenshot proves Source 0.6.0 and hot-reload marker. Automated access to the private Voice Acting tab still stops at ChatGPT sign-in, so screenshots of r2/r3 inside the editor and an audible D-base verdict are not fabricated and remain open.
- Final evidence: `SITE_CARD_PERFORMANCE_SELF_SERVICE_TEST_EVIDENCE_2026-10-12.md`.


## Binding user correction: ONE Work/WSA implementation, ZERO Work dependency for new Triplets
Georg explicitly wants **full authoring/testing access** to the existing KFB Audio Voice Acting Site. Work/WSA is permitted to enhance the existing Site **once**, but must never become the required executor for a routine new Triplet, Card, editorial Bridge, three-Card scene, full-deck Suno/TTS performance, actor voice selection or a data-only content revision.

**This is an acceptance invariant, not optional UX polish.** A Site that plays the 48-Card audition but requires another Work/Site redeployment whenever a user edits two lines is FAIL for this task. DO NOT build a new Site, second runtime, parallel mixer, replacement branding or generic UI shell.

## Cold start / inspect verified original design first
Read live GitHub versions (GitHub overrides this brief, Site or chat memory):
1. `skills/chat/START_HERE.md`;
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`;
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`;
4. this Audio owner `START_HERE.md`, `RETURN.md`, `CHANGELOG.md`, `SITE_INTEGRATION_PACKET.md`, `SITE_IMPLEMENTATION_CHECKPOINT.md`;
5. Voice donor #379 `START_HERE.md`, `RETURN.md`, `data/VOICE_CASTING_BENCH_R2_CONTRACT.json`, `data/KFB_WRINKLE_48_TTS_TIMED_CUE_AUDITION_R2_2026-10-12.json`, `KFB_WRINKLE_RUMBLE_48_CARD_PERFORMANCE_STAY_FLUFFY_R0_1_2026-10-12.txt`, `data/KFB_CARD_PERFORMANCE_BRIDGES_R0_1_2026-10-12.json`;
6. original `media/kfb/Wrinkle_Rumble_-_ADD_web_ID.pdf.json` blob `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c` (48 cards, not 56), `media/kfb/index.json` for source card address; and existing KFB Card/Crop renderer.

First **open the exact current Site and its source**, show existing Catalog/Mix/Soundscape/Voice Acting in isolation, inspect actual component objects and keep its existing shell/navigation/player. Verify live Site revision and audio donor source before editing. No source URL load is proof of UI visual isolation. Preserve existing D-base (94 BPM / 10 real stems), existing ducking, the AudioContext, MusicClock and `window.KFBAudioSite` contracts. Existing already published G/D proof and other Audio surfaces must not regress.

## ONE product outcome
One revised **existing** Audio Site lets Georg and ordinary Web Chat/GitHub content sessions create/edit/test new Card/Triplet performances **without running Work/WSA again**. The Site can audition the same voice dry and with the existing D-base stem mix; consume actual source-backed Card identities, non-canonical candidate scripts and accurate audio-specific card/timeline cues. The one-time Site enhancement is itself a bounded Work job; future data/content revisions are NOT Work jobs.

### A · Content ingress: dynamic, authenticated where needed, deploy-independent
- Keep **canonical source cards and text in the existing GitHub KFB content/Voice owner**, never duplicate the 48 Card truths in Site source. Read originals by `deckId/cardNumber/sourceRevision`, not by name as unique key.
- Reuse existing Site `Intake` / `Voice Acting` tabs. Add an **in-context Card Performance authoring section**, not a new global navigation hierarchy.
- Support **paste/import of text + JSON manifest + CSV/SRT/audio**, plus existing authorized local clip intake. Begin with actual original 48-Card `Wrinkle Rumble`; accept individual and 3-Card selections without fabricating missing Cards.
- Implement one **data-only reload path** to fetch accepted published content and explicit candidate preview content from existing GitHub-truth data. Metadata must expose `sourceRepo/sourceRef/sourceRevision/contentRevision/status` and update after reload with **no Site redeployment**. Choose a real supported access route after inspecting capabilities: existing authorized Site server/proxy or safe public GitHub REST read for public files. A branch preview MUST NOT silently become published canon; omit raw/private GitHub credentials from the browser, respect CORS/rate limits, ETag/revision caching, offline last-known-good and schema validation.
- One normal **Web Chat with connected GitHub** must be able to update the Voice content/Triplet candidate JSON on the designated owner branch, and the **already-published existing Audio Site must show the new revision on refresh/explicit Reload**, without opening Work or changing Site source. This is the first mandatory self-service route.
- Within Site, Georg can **edit a proposed Triplet/bridge, reorder Cards, assign character, select intro/outro, choose soundbed and test immediately**; keep local draft isolated from accepted source. Provide copy/export of the exact provenance-tagged JSON/CSV/lyrics for Web Chat GitHub commit. For direct Site-to-GitHub Save, use an **existing supported authenticated delegated server bridge only** if available and validated (CSRF, authorized user, least-privilege Repo, branch lease/concurrency, revision checks, no secrets in client). If a secure write connector is genuinely unavailable, do not fake persistence: clearly label local draft/save and use JSON export + GitHub Chat route. Either way no Work dependency for continuing content edits.
- Preview/accepted split: SOURCE original data (read-only) -> EDITORIAL_CANDIDATE -> REVIEWED / versioned accepted content. No automatic merging, no mutation of original Card JSON, no automatic creative approval, no client-side promotion of unreviewed draft as public canon. Old failing generic Clown material stays blocked.

### B · LLM-free runtime content assembly (within existing ChatterBox semantics)
- One semantic Triplet = **one card-driven spoken sentence** assembled from source title/POWER/LORE (or silence), not three autonomous sentences.
- Read typed causal `Bridge` edges from existing Voice sidecar, preserve `fromCardId/toCardId/relation/cost/callback/sourceRefs/editorialStatus`. No random "but/therefore" glue.
- For 1/3/4/48-Card performance, select only compatible source-backed links with stable deterministic seed and explicit speaker bias. Unknown edge -> stop/change scene/silence/curated reset; no invented card lore. Show lineage and actual original source alongside candidate text.
- Optional actor-specific `Welcome, dear Fluffheads!` style greeting; required final spoken **`Stay Fluffy!`** for **Card Performances only**, not routine NPC notifications.
- Six existing Story Modes tint performance: tragic/comic/absurd/heroic/mystical/forbidden. Keep voice and semantic state separate; orchestra/Orc Band/Speakers Corner/Tavern may perform same source Card sequence differently without forked data owners.

### C · Audio A/B with the real original owner music
- Preserve `window.KFBAudioSite`, the Site-created **single AudioContext**, `musicContext`, `adaptiveMusic`, existing `kfb:voice-focus`, buses/duck and shared MusicClock; **no second mixer, no second clock, no silent re-render of G/D**.
- Same exact source vocal used in A = DRY and B = D-base (real 94 BPM source stem family) with existing Speech Focus/duck. Keep current music time running, audible smooth gain restoration, avoid restarted stems and vocal/music overlap.
- Support existing browser voice picker and cached/local imported authorized TTS clips. Candidate variants can be A/B on the same Card/script, with editable tempo/pitch/delivery and no claims that eSpeak sounds natural merely because it changes pitch. Preview word boundary only when actual renderer emits it; otherwise clip-specific 50-segment timing.
- Read R2 manifest `data/KFB_WRINKLE_48_TTS_TIMED_CUE_AUDITION_R2_2026-10-12.json`: 3 complete eSpeak technical source renders, each with exactly 50 audio-specific segments (intro + 48 Cards + outro). **Their MP3 binaries are conversation-only, not in GitHub/Site**; Work must ingest actual provided authorized ZIP if accessible, or render source again and measure fresh timing; never invent/upload nonexistent audio. Never reuse eSpeak segment times for browser voices or Suno audio.
- Existing KFB Card Crop/Billboard and bubble consumer may use true segment cue ID and playback clock; do not build another card/animation owner. 48 images must be original source/crops, not new mock cards.

### D · Normal usage after the ONE-TIME Work pass
**Chat-based:** "Create three Triplets from Wrinkle Cards 6, 11, 12, bridge them, give them Lorekeeper, export" -> existing Voice branch content commit by ordinary GitHub connector (not Work) -> existing Site chooses PREVIEW ref and reloads -> hears new three-Card speech over chosen D bed -> human TUNE / KEEP, without Site code deployment.
**Site-based:** Georg changes Bridge, narrator, voice, pauses and bed in Voice Acting editor; listens immediately; refresh retains explicit local draft, import/export reopens on any permitted session/browser, and authorized Save can persist only if a real secure backend is present. Web Chat/GitHub export fallback is a supported non-Work path, not a faux active cloud Save.
**Accepted content:** via existing GitHub code/content human gate (or already-approved publishing discipline). Public audio Site defaults to accepted version only, while preview of PR/draft branch is explicit and labeled. One-off source schema changes can require Work; ordinary new data rows never do.

## Acceptance: MUST measure actual product behavior
Use the real existing Site, source, D family, original card data and a small **new content commit**. Run, record and prove:
1. Current Site before-edit screenshot(s) and original design objects in isolation; shell/navigation preserved after edit.
2. Exactly one existing AudioContext / clock; existing Catalog/Mix/Soundscape/other player behavior unchanged.
3. D-base 94 BPM real stems audibly decoded/played. Same vocal A DRY vs B D + Speech Focus/duck, independent reviewer/human audio decision pending.
4. Full 48 Cards selectable (source JSON), one source Card -> one valid sentence; first 3 Card audition and final `Stay Fluffy!`.
5. A **new ordinary data-only Triplet GitHub commit** performed *after Site deploy* appears at same Site URL after Reload **without another Site version/deployment**. Show old/new revision and two separate screenshots (before/after). This is P0; if missing, task is NOT COMPLETE.
6. In-Site edit/reorder changes playback immediately and exports original cards+versions+source IDs+bridges+speaker/timing intact.
7. Save semantics distinguish local draft from canonical GitHub; no exposed tokens or private raw media, no automatic promotion of unreviewed content.
8. Bad or missing JSON fails safely to last-known-good/silence, preserves actual original Card truth and avoids partially mismatched artwork/timing.
9. Audio-specific 50-cue/speech/caption alignment proven from exact matching rendition; do not claim 3 renderer voices share timings.
10. Repeat routine data edit and reload without Work. Confirm **at least 2 ordinary edits / 2 same-host reloads / 0 extra Site publishes** after setup.

Roles: Builder/Integrator = single Sites-capable Work/WSA writer; Integration Tester = independently records DOM, browser audio, source revision and CI; Independent Critic = design fidelity, text/music speech intelligibility and original Card fidelity without production writes; Production Guard alone determines REPAIR/QUARANTINE/STOP. After two non-improving repair passes on a failing seam, export/quarantine that seam, continue parent outcome unless Guard proves it is core-critical. **However data hot reload (item 5) is outcome-critical**: without it no success claim.

## Writeback and publication rules
- Implement owner-specific Site changes in Audio Draft PR #365 and existing managed Site project ONLY; verify exact branch head + files after every actual GitHub write. Source candidates stay in Voice PR #379, any cross-owner source mutation requires separate authorized Voice owner write, not silent Audio duplication.
- Phase checkpoint: coherent one-time source/site implementation -> real cross-revision product tests -> additive Audio Return/CHANGELOG/brief and Production Control ledger. Hub/central router only if a canonical URL or P0 routing materially changes; this is the **same Audio URL**, so no automatic Hub publication.
- Same existing Site only; publish **one controlled revision** when QA-green, then verify exact URL and marker in the real browser, repeat data-only hot reload **without republish**. No Cloudflare/Stage substitute; no PR auto-merge, no Live promotion.
- Full Return includes exact Audio repo/branch/PR/head, Site project/source version/deployment and genuinely visible URL proof, touched files, real tests/voice clips, accepted/draft content revisions, permissions behavior, unresolved items and exactly one next human/technical gate.

**Human goal:** In day-to-day KFB authoring Georg creates a new Triplet or entire Card performance in Chat or the Audio Site, tests the real voice + D soundbed immediately and can save/export it **without ever calling Work again for routine content work**.
