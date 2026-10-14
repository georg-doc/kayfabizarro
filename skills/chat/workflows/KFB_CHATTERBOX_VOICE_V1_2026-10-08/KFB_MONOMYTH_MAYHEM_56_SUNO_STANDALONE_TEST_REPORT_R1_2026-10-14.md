# Monomyth Mayhem · 56 Standalone Card Beats / three dry Suno speech parts — R1 QA

Date: 2026-10-14
Status: **ACTUAL 56-CARD EDITORIAL SCRIPT WRITTEN / TECHNICAL SOURCE + CUT TEST PASS / NOT HUMAN-ACCEPTED AUDIO OR COMEDY**
Single owner: existing `georg-doc/kayfabizarro` Voice/ChatterBox PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`. Original Card SSOT unchanged.

## Current WS1/Claude Code inquiry
- At the GitHub status check this session, existing FrankenStein Composer Draft PR #355 head was `6d881aa3663a473794d28f92e323bc80d83e03d9`, identical to prior Claude Code preparation checkpoint. No additional `ws1` or `wireface` branch was found in GitHub branch-name search. This is **not proof WS1 is idle**; work may be local, in another in-flight ref, or unpushed. We did not write Composer or Audio branches.
- Audio #365 GitHub Site v11 Source 0.7.1 remains the receiving audition surface, current production content pool still `triplet-opener-pool-r5-cookie-tune-v11` (Git blob `dfb5435bc0c913ea48f8f5558f801b293962fbc8`); 14 opener records, only six enabled editorial candidates and eight disabled proposals, with no accepted beat/clip/crop. Separate NIE 14 and Perplexity 43 research suggestions are NOT active.
- New Monomyth content files were authored **additively** in Voice #379 and do not touch the pool/live Site. The candidate JSON is **not** the current Site pool schema; do not claim immediate Site import or hot-loaded audio until explicit editor/consumer reconciliation and actual audition.

## Original source, scope and risk
Deck: `kayfabizarro_monomyth_mayhem` — *Monomyth Mayhem*, original registered `media/kfb/Kayfabizarro_Monomyth_Mayhem_WEB_v1.pdf.json` (Git blob `5ef6057e322c42ff1dbe786f0670dc2abe20ca21`).
- Exact **56 original cards**; every Card has `cardNumber`, `cardName`, `power` and `lore` source fields (56/56 complete).
- Editorial source-pinned JSON `data/KFB_MONOMYTH_MAYHEM_56_CARD_CUT_SPIN_EDITORIAL_R1_2026-10-14.json` records for each of 56 original IDs the FULL exact source POWER+LORE and original Card title beside one adapted English spoken line, selected source-neutral opener mode, `NO_EDGE`, `EDITORIAL_CANDIDATE`, `humanAcceptance:PENDING`, and no audio time claims. Current JSON blob `5178f4dc535b2388a9c8fc709f125b85de6c7ece`.
- This is a **one-time LLM-assisted editorial authoring draft**, not a proof that the deterministic LLM-free runtime can generate equally sound Triplets from arbitrary new cards. In runtime later, reviewed text can be selected/presented without model calls.
- Source completeness is not content fidelity. A conservative per-token lexical-overlap diagnostic on in-field POWER+LORE non-stopwords retained **592/952 = 62.2%** across 56 adapted spoken lines. This is NOT a semantic fact-coverage or strict 3-gram score. It is **below the aspirational ~90% original-content target** and warns the human reviewer to check omitted Card facts. Candidate #16 *Crossing the Return Threshold* showed especially low lexical shared fraction (POWER 35.7%, LORE 25%); #1, #4, #10, #14, #27 also deserve source comparison. No “90% content retained” claim is made.
- Source-complete recital/reference `KFB_MONOMYTH_MAYHEM_56_FULL_SOURCE_REFERENCE_NOT_COMEDY_R1_2026-10-14.txt`, Git blob `da8008ccda020b0704afeeb76542949311491ed0`: all 56 original titles, exact POWER and exact LORE read on one physical line each. This has 100% literal source field reuse but is explicitly **not a tested good semantic Triplet or stand-up number**.
- Cards 49–50 are authentic `[BLANK]` Card titles and 53–56 are authentic instructions/licence/QR/card-back cards. All are included, not suppressed for aesthetic convenience. Any later performance may select a subset but must identify omissions honestly.

## Prepared Suno copy/paste texts, NOT generated Suno audio
- Continuous 56-beat script `KFB_MONOMYTH_MAYHEM_56_STANDALONE_MASTER_SPOKEN_WORD_R1_2026-10-14.txt` — 8,106 characters; intended archival/podcast master, not a single 5k-character Suno input.
- `KFB_MONOMYTH_MAYHEM_56_STANDALONE_SUNO_PART_01_OF_03_R1_2026-10-14.txt` — Cards 1–18, **3,180 characters**.
- `KFB_MONOMYTH_MAYHEM_56_STANDALONE_SUNO_PART_02_OF_03_R1_2026-10-14.txt` — Cards 19–36, **2,602 characters**.
- `KFB_MONOMYTH_MAYHEM_56_STANDALONE_SUNO_PART_03_OF_03_R1_2026-10-14.txt` — Cards 37–56, **2,495 characters**.
- `KFB_MONOMYTH_MAYHEM_56_STANDALONE_SUNO_STYLE_R1_2026-10-14.txt` — dry/spoken-word solo style request; Suno no-music suppression not guaranteed. Existing KFB Audio DRY playback is required for strict absence of music.
- Each part has `[Spoken Word]`, one brief source-neutral intro, **one physical text line per original Card**, blank line between Card Beats, the final spoken **`Stay Fluffy!`** and `[End]`. Separate independent Parts repeat intros/outros deliberately; continuous Master says intro/outro once. **Blank lines are editable text cut boundaries, not measured WAV/MP3 cue times.**
- Limited opener rotation: **46 DIRECT, 5 HEARD_OF, 5 DO_YOU_KNOW**, all source-neutral and from the already implemented prototype catalog. No unlicensed fake meeting, crowd responses, restaurant or generic Fourth-Wall gag. No additional causal Bridge is necessary; all have `bridgeAfter:NO_EDGE`.

## Real checks executed
- Two independent actual readback audits against GitHub fetched original Deck JSON, candidate JSON, full-source recital, four scripts and style file: **21/21 + 21/21 technical PASS**, including exact source revision, 56 original identities/fields, every adapted original title exactly once, all one-line Card text, ordered Parts reconstructing all 56 Beat lines exactly, proper text cut separator, no forced Bridge, per-Part under-5,000-char limit, `Stay Fluffy!` at each part end, full source reference contains ALL original field strings, protected existing pool blob unchanged, no fake audio claim.
- Earlier 56-script update was momentarily rejected with 409 because other concurrent Voice sessions added separate files. Current branch head/file were inspected before retrying exactly the missing update, and successful postwrite readback confirmed. Concurrent sessions wrote **other deck** scripts; no files in this slice were overwritten.
- First text-export preflight failed due a **block count assertion indexing error** (operator mistake), not missing Card text; corrected assertion against real Card blocks before committing any script. Resulting 5 script/style files were successfully written and exact file/head read back.
- Actual **audio tracks generated = 0**; Suno vendor/API invocation = 0; Site import/browser playback = 0; accepted generated performers = 0. Do not reuse unintelligible earlier eSpeak as final proof. WS1/Claude Code owns a separate Composer route.
- No PR auto-merge, live promotion, Audio Site edit, Composer change, external Stage or World runtime.

## One next gate
`KFB_MONOMYTH_MAYHEM_EDITORIAL_SOURCE_AND_SPOKEN_TRIPLET_TUNE_R1`: human/independent review **sample 6–10 source vs adapted Beats** including low lexical-retention Cards (#1, #4, #10, #16, #27), choose expected source coverage and comedic cadence; then create edited ACCEPTED candidate set and, if desired, import deliberately into existing Audio Site v11 Pool through the protected ordinary GitHub content-only route. Afterwards dry voice audition/clip-specific timing; only actual accepted clip/crop/cue packet may be handed to WS1/Claude Code.
