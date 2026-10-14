# KFB Protopia 56 · Standalone Triplet/Stand-up Spoken-Word Set R0.1

Date: 2026-10-14
Status: **56/56 SOURCE-LINKED EDITORIAL DRAFT / SUNO COPY-READY / NOT A SUNO TRACK / NOT A HUMAN-ACCEPTED TRIPLET POOL**.
Owner: existing `georg-doc/kayfabizarro`, Voice/ChatterBox Draft PR #379, `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Original source (untouched): `media/kfb/Kayfabizarro_Protopia_WEB_v1_ID.pdf.json`, blob `8a8312db50cddf30212439b735d7595d797f793d`, 56 Card titles with nonempty POWER + LORE. Registry `media/kfb/index.json` blob `af276a8b941a84a6b1856b9897dca196d1b7760a`, `packId:protopia_web`.

## Four independent copy-paste Suno lyrics
Each part: `[Spoken Word]`, a single set greeting, exactly 14 **one-physical-line-per-Card** standalone microstories with exactly one blank line between, `Stay Fluffy!` as the closing spoken line and `[End]`. No required cross-Card Bridge. All four parts can be independently presented or split into 56 separate Beats. They are **four scripts**, not four actual generated song/audio renders.

| Part | Original Cards | Spoken lyric characters | File |
|---|---|---:|---|
| 01 | 01–14 | 2,427 | `KFB_PROTOPIA_56_STANDALONE_SUNO_SPEECH_PART_01_OF_04_2026-10-14.txt` |
| 02 | 15–28 | 2,469 | `KFB_PROTOPIA_56_STANDALONE_SUNO_SPEECH_PART_02_OF_04_2026-10-14.txt` |
| 03 | 29–42 | 2,394 | `KFB_PROTOPIA_56_STANDALONE_SUNO_SPEECH_PART_03_OF_04_2026-10-14.txt` |
| 04 | 43–56 | 2,293 | `KFB_PROTOPIA_56_STANDALONE_SUNO_SPEECH_PART_04_OF_04_2026-10-14.txt` |

**Master edit transcript** (9,397 characters, **NOT** one Suno input): `KFB_PROTOPIA_56_STANDALONE_MASTER_FOR_EDITING_R0_1_2026-10-14.txt` — same 56 complete Beat lines in original source order, greeting once/outro once. Stable Card-to-Beat mapping: `data/KFB_PROTOPIA_56_STANDALONE_BEATS_SOURCE_CUE_MANIFEST_R0_1_2026-10-14.json` (includes exact original Card IDs/blobs, title, derived line, opener version, original PDF source page/quadrant, editorial QA and missing actual audio/crop status).

### Suno Style field (separate from Lyrics)
> Solo dry spoken-word stand-up. ONE clear, naturally expressive narrator with confident intimate club delivery, not singing, no choir, no chorus, no instruments, no background music, no musical backing. Each paragraph is a separate Card bit. Brief natural pauses between bits, faster setup and deliberate silence after the absurd result. Clear articulation and dynamic timing. Avoid robot voices and excessive dramatic acting.

Suno may disregard no-music prompts; **dry vocal / no backing is not guaranteed by a text Style instruction**. Suno clip lengths, real spoken take, exact cuts and rights remain **UNTESTED**. The previously user-rejected unintelligible eSpeak samples are NOT reused here. If strictly clean speech stems are required, create them through the existing KFB Audio owner, not a separate music/audio runtime.

### Real production flow, no Work required for routine content
1. COPY a Part's plain text into Suno Lyrics (including stage tags); paste Style separately. **No Suno generation has been called or paid for by this chat**.
2. Or, on `https://kfb-audio.frizzlebob.chatgpt.site/` (Source 0.7.1/v11 at latest actual Work proof), use `Voice Acting → Triplet & Opener Pool → PREVIEW` to **edit/audition against the true original Protopia Deck**. The 56-Beat sidecar is **NOT** automatically imported into its current protected r5 pool. The v11 Site supports Deck selection/edit/export, but actual sidecar schema import into Site has **NOT** been verified for this draft.
3. After editorial approval, use explicit export/ordinary Chat+GitHub-content update/Reload; the active `data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json` must NOT be overwritten by a bulk candidate. No direct Site cloud Save is available.
4. For cuttable audio: render each Beat/part, actually measure per-renderer audio interval and hash the clip. Blank lines mark editing **boundaries**, not measured timestamps. Store real clip `SHA256/duration/providerId/voiceId/rights/cueId` only after render.
5. For Billboard: original PDF Card/registry page/quadrant is derivable in manifest, but **no crop has been visually isolated or accepted**. Never render an `artworkPrompt` stand-in. Only actual accepted Card crop, voice and beat permit downstream Wireface/Scenelet consumed via the existing Audio v11 `kfb.voice.card-performance-packet/1` accepted-only contract; private QA may be explicitly previewed.

## Editorial source/fidelity honesty
- This is NOT 56 magically optimized comedy Goldens; it is a coherent **first authoring pass** from the real 56/56 Card title/POWER/LORE sources. 56 original titles were spoken exactly once; 56/56 Beats have traceable lexical anchors to both POWER and LORE. No cross-Card bridges were invented. English conversational `HEARD_OF`/ `DO_YOU_KNOW` pattern options are from the existing v11 library; most beats use direct title.
- Strict **90% original-word/content preservation is NOT PROVEN**. A lexical overlap of salient POWER/LORE tokens is **not a semantic information-coverage measure** and shouldn't be presented as one. Machine QA catches omitted whole fields, not creative poor jokes or subtle unanchored inferences.
- The original Card source sometimes contains political/social assertions; in these derived lines they are **fictional card rhetoric** from the deck, not independently corroborated historical/medical claims. Reviewer may TUNE inaccurate implications without modifying original Cards.
- Original #53 LORE contains corrupted text `Optimism must bom backed backed by action wins.`. The Beat uses the Card's intact POWER `Optimism must be backed by calloused hands` and the LORE's intact `You cannot skip your turn`, without silently editing source.
- Original #56 LORE ends `Stay fluffy!`. We kept its mechanism/rewrite-rule content in the card Beat and reserved the exact **`Stay Fluffy!`** spoken end for the separately isolated Set outro, to avoid duplicated closing line.
- Audio Work v11 r5 current original pool `dfb5435bc0c913ea48f8f5558f801b293962fbc8` remains **unchanged**; this experimental source text is `EDITORIAL_CANDIDATE` only. It adds neither new canonical Card rules nor researched WorldView author endorsements.
- An actual author/audio/comedy acceptance is **OPEN**, including naturalness, pacing, correct semantic POWER/LORE relationship, delivery and source meaning.

### QA
All four original-part files were created on the existing Voice owner, exact branch head/file content read back after EACH actual GitHub write. Independent source/manifest replay checked all **56/56** original titles exactly once and at least one salient original POWER and LORE lexical match in every Beat. Four parts of 14, no dropped/repeated Card ID, original source blob pinned, PDF page+quadrant computed from current registry, plain-text blank-line boundaries. Master has one greeting and one outro. First automated metadata test returned 22/23 because it mistakenly checked `audioTimecodes` instead of `actualAudioTiming`; corrected pure QA field check 4/4 PASS with no manifest change. Product audio/billboard/creative tests **0**. Review the separate QA receipt below; **don't call 56/56 source-linked a 56/56 accepted Triplet result**.

**One next gate:** `KFB_PROTOPIA_56_STANDALONE_EDITORIAL_AND_HUMAN_VOICE_REVIEW_R1` — independent audit of representative source Cards/claims plus Georg's hearable DRY voice KEEP/TUNE/CUT on a small first Part, before admitting or integrating any of the 56 scripts into the productive v11 pool, Wireface, Canvas or World. Claude Code #355 remains separately on Theatre voice/provenance planning gate.
