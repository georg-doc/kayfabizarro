# KFB Protopia 56 · Standalone Spoken-Word Set R0.1 · Test & Source Report

Date: 2026-10-14
Status: **56/56 SOURCE-ANCHORED EDITORIAL TEXT DRAFT · STRUCTURAL QA PASS · HUMAN COMEDY/AUDIO QA NOT RUN**
Owner: `georg-doc/kayfabizarro` Voice/ChatterBox Draft PR #379 · `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.

## Current GitHub/WS1 status checked
- Composer/Wireface PR #355 existing branch `planning/frankenstein-composer-gpt-site-2026-10-04` at HEAD `6d881aa3663a473794d28f92e323bc80d83e03d9` during this check, matching previous handoff. Search of GitHub branch names for `ws1` / `wireface` returned no new dedicated branch; Claude Code may have unpushed local work, so **no inference that WS1 is idle or has finished**.
- Audio PR #365 branch head `9325a4af861d0a07e1986490f7ee42aa3f047819`, existing Audio Site Source `0.7.1` version `11`, two content hot reloads confirmed by prior Work evidence. No new Site or Audio update in this slice.
- Voice PR #379 pre-production head `d788e429c5fed1afa033cd69222edf6cf9470b7f`, current editorial r5 pool original blob `dfb5435bc0c913ea48f8f5558f801b293962fbc8` **unchanged** after this new separate draft.

## Deck selection grounded in exact source
Original registry `media/kfb/index.json` blob `af276a8b941a84a6b1856b9897dca196d1b7760a`:
- Chosen source `protopia_web` = `Propositum 2040: Forget Utopia, Ignore Dystopia, Embrace Protopia`, `media/kfb/Kayfabizarro_Protopia_WEB_v1_ID.pdf.json`, exact blob `8a8312db50cddf30212439b735d7595d797f793d`. All **56** cards have nonblank original title, POWER and LORE.
- Alternative `kayfabizarro_improv_comedy` 60 Cards (blob `30da6ffcdb465c4c7961e5f4b4469f3fa465613a`) has #5 source LORE degraded/OCR metadata and #57–59 **open writing/template cards**, so a 60/60 source-derived edited stand-up script cannot legitimately claim completed stories without new user source. Preserve that deck for modular improv/operator study, do not silently invent 4 blocks.
- Dystopia 56 includes #9 null Power/Lore; Shadow Politics 48 includes a blank template #47. Protopia chosen to avoid this source completeness gap, not because it is already comedy-accepted.
- Protopia #53 original LORE has `bom backed backed` corruption; the candidate spoken line uses its intact POWER "Optimism must be backed by calloused hands" and intact LORE closing. Original Card source unchanged.
- Original PDF source page/quadrant metadata is calculated via registry; **no actual image crop was visually/independently proven or rendered** in this text slice.

## Actual deliverables
- Four independent copy/paste Suno text files: 14 Cards each, one physical text line per Card and a blank line between. Each part includes `[Spoken Word]`, independent `Welcome, dear Fluffheads!`, **final spoken** `Stay Fluffy!`, then `[End]`. Source Card #56 itself says `Stay fluffy!`; this was removed from that one beat's spoken ending and represented by the separate one-time finale to avoid double greeting/catchphrase in Part 4.
- One 56-Card editorial master transcript with ONE intro and ONE outro, **9,397 characters**: intentionally NOT recommended as a single Suno Lyrics field; use the four <=2,469-character parts.
- Versioned JSON source/beat/optional opener/part index `data/KFB_PROTOPIA_56_STANDALONE_BEATS_SOURCE_CUE_MANIFEST_R0_1_2026-10-14.json`: all original source identifiers and code-independent one-line cut positions, `openerId` (DIRECT, HEARD_OF, DO_YOU_KNOW), source POWER/LORE salient matching, PDF page/quadrant, zero mandatory causal bridges, no claimed clip/crop/timing.
- Usage note `KFB_PROTOPIA_56_STANDALONE_SUNO_PERFORMANCE_R0_1_2026-10-14.md` gives exact per-Part file names and a separate proposed DRY vocal-only Suno Style field. This is an offline **script authoring deliverable**, not a direct Suno API call or generated audio.

## Actual source and structure QA
A first total QA pass reported **22/23** due solely to the test checker using the wrong JSON key `audioTimecodes` rather than the actual `actualAudioTiming`; the four individual missing-media invariants then passed **4/4** without any source/manifest correction. A complete follow-up executed against the exact GitHub source, four actual stored parts, 56-beat manifest, master and protected pool: **28/28 source/format/rights-status assertions PASS**:
- Original deck/registry/56 distinct IDs pinned and in order, all three original source fields nonblank; all **56** titles audibly present exactly once in their text.
- Each original POWER and original LORE has at least **one source-matching meaningful lexical anchor** in every derivative beat; explicit one-line/blank-line boundaries; exact 14/14/14/14 records and unique IDs; source page/quadrant calculated.
- Four true file byte lengths: **2,427 / 2,469 / 2,394 / 2,293** characters (each below the chosen internal **5,000-character** target; this is not a claim about Suno's current actual UI/plan limits). Master true source text length 9,397 characters.
- Opener distribution: DIRECT **38**, HEARD_OF **9**, DO_YOU_KNOW **9**, all from existing familiar source-neutral opener patterns; no unreviewed new research patterns or fake first-person performer anecdotes activated.
- The important source-use caveat: when comparing distinct salient word **types** shared between the *original field* and derived script, POWER overlap **322/471 ≈68%**, LORE overlap **289/499 ≈58%**. This is not exact original-token-position retention, not independently validated meaning coverage and **does not satisfy/prove the hoped-for ≥90% original information retention**. Every candidate still needs an editorial comparison with the original Card; do not pass this as a quality Golden.
- The active `KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json` protected original Git blob `dfb5435bc0c913ea48f8f5558f801b293962fbc8` remained unchanged. No media or World/Composer files modified.
- No actual audio clips, true waveform timecodes, legal voice identities, Suno songs, verified card image crop or human comedic ratings exist for these 56 lines. `VoiceClips:[]`, `actualAudioTiming:null`, `exactCardCropStatus:NOT_RENDERED_OR_VERIFIED` are explicit throughout manifest.

## Quality/rights and consumer boundary
Stand-up language uses original named Card mechanics and Lore rhetoric, sometimes paraphrased. Some source Cards assert political, health or social theories; they are **claims made by the fictional game deck, NOT independent verified factual claims or claims by any named real author**. No extra detailed factual invention authorized. Candidate beats do not become `ACCEPTED` merely because they have title+Power+Lore lexical overlap.
- These drafts are **not** in current v11 protected `kfb.voice.triplet-opener-pool/1` remote pool and are **not** a validated editor-package import; use the existing Site's Deck/PDF selector and source-grounded local manual authoring, or first adapt into the current expected schema after human review via ordinary Chat+GitHub export/reload.
- Playback source/media ownership stays in Audio PR #365; Composer/Wireface #355 remains plan-first read-only of content until real approved voice/crop.
- No Suno generation, voice model/provider/rights, source audio mixing, clip slicing, Site browser hearing, KFB native/wireface face visuals, React Canvas or Cloudflare Stage. No merge or Live.

## Exactly one next gate
`KFB_PROTOPIA_56_STANDALONE_EDITORIAL_AND_HUMAN_VOICE_REVIEW_R1`: human and independent source critic review **first four representative Beats** (one each from Cards #1/#14/#29/#56 or another representative sample), compare short spoken source retention and overall stand-up naturalness to original Card title/POWER/LORE, give KEEP/TUNE/CUT. Then audition a clear **DRY** voice (through existing Audio v11 or Suno voice-only attempt with no-music caveat), finally translate accepted Beat records into active v11 editorial pool WITHOUT a WSA redeploy. Do not preempt WS1 Claude Code branch or infer that the active Player/Card performer is already wired.
