# KFB Comic Performance Workshop · Work/Codex proposal R1
2026-10-20 · **DESIGN PROPOSAL FOR WS0 · NOT AN APPROVED SONG_SPEC CHANGE · NOT A NEW OWNER**

## Why
Georg wants a persistent Work/Code-instance workshop for many deck songs, not an expiring webchat writing sprint. His [Alice original performance](ALICE_USER_EXEMPLAR_2026-10-20.md) demonstrates a character-led, listener-addressed, multilayer satirical performance where card beats form an intelligible causal narrative and connect to printed Cut & Play cards, comics, game and later synchronized Comic Motion. **Alice is one example, never a fixed song template.** Character, mood, premise, intro, outro, musical structure, dramaturgy and card-order editing must differ by deck.

## Scope and owner
- Existing owner: `kfb-triplets` / Writer's Room (V-361, V-374, V-376), WSA songs authoring. **One production writer:** designated Work/Codex builder. WS0 owns song-spec adjudication and final track-card review; Georg owns artistic listening/selection; WSV/WS1/WS0 own downstream actual audio/Comic Motion/game runtime.
- Existing repo: `georg-doc/kayfabizarro`. Current **proposal branch** `wsa/songs-bestof-r1-2026-10-18`, with 20-deck planning inventory and existing **UNGATED** Biological Metropolis draft. Do not rewrite these artifacts automatically. Future approved song branches should obey current Writer's Room naming/return contract unless WS0 approves a batch manifest adjustment.
- No separate card database, song runtime, plugin, renderer, video pipeline, uploader, hub router, new Stage or Live route. This proposal has **no publication requirement**. No auto-merge.
- Preserve R2 standalone **spoken Triplets** and their exact checker unchanged; song mode is separately versioned.

## Operating principle: standardize the production handoff, not the art
**Hard structural/provenance checks** can enforce correct input refs, stable deck/card IDs, explicit song-to-card mappings, no fabricated image evidence, verified Best-of selection, valid artifacts, honest audio/critic statuses, and Suno text length <5000 if that output cap still applies. **Soft editorial prompts** inspect performer identity, originality, resonance, satirical insight, readable pacing, callbacks, motivated narrative transitions, relation to printed cards and later visual performance. The title must not be recited in every intro or card beat purely to satisfy a checker. A named performance role is allowed only after WS0 reconciles the old neutral narrator restriction. No blanket gate bypass by builder.

## Workflow — one deck at a time, resume-safe
### Phase 0 / WS0 rule alignment before productive writer scale-up
Read current `SONG_SPEC_R3.md`, `song_gate.py` R3.7, `TRIPLET_SET_SPEC_R2.md`, decisions V-361/362/374/376/411/424/528, prior Return, this blueprint, and `WSA_WRITERS_ROOM_JSON_FIRST_REALIGNMENT_FOR_WS0_2026-10-16.md`. WS0 chooses how to represent optional opening title, performer identity, musical/visual cue, freely sized editorial card beats, timing and source-motif provenance. Record exact new spec version and only then update shared gate, ideally with positive/negative regression fixtures. Do **not** let the builder silently patch the gate.
### Phase 1 / Source & performer proposal
Pin current `registry/assets/v1/decks/<deckId>.json`, joined `media/kfb/<real pdf name>.pdf.json`, source hashes, printed card IDs/page status and allowed actual visual motifs. Work from JSON source; separately mark descriptive `artworkPrompt` as metadata rather than visually viewed art; target original PDF only on named contradiction if WS0 approves existing JSON-first alignment request. Identify deck thesis/contradictions/social context and candidate source-backed performer (actual character sheet where applicable). Store `deck.dossier.md`, optional `character-performance.md` and short dramaturgic angle. No invented source claims.
### Phase 2 / Best-of & story composition
Choose full deck where artistically coherent and feasible, else `bestOf` according to **why each card contributes** (causality, contrast, reversal, escalation, landing). Preserve selected printed numbering and explicit omissions. Do not mechanically first-N shorten. Build the song as a distinct musical comic work: inspired opening act, performed cards with meaningful bridges, emotional/satirical turn, a relevant closing payoff. Don't use Alice's jury/court/electro-swing/gags by default. A plot need not use six named phases; experiment with different structures. Preserve original printed card source, version editorial `songLine`, separate invented connective framing, map every sung card and any merged beat back to exact card IDs.
### Phase 3 / Two music treatments + author revision
Generate two genuinely different musically described Suno STYLE alternatives (instrumentation, voice delivery, timbre, groove, tempo, production; no role/story stage directions in STYLE). Music and persona can be linked via editorial metadata, not decorative prose in the Suno STYLE prompt. Capture all versions and real Unicode char counts including newlines. Prefer intentional pauses, dynamic contrast, musical breathing room. Author revisions only by the Work/Codex builder. Version each lyric, style and selection.
### Phase 4 / mechanical & source checks
Use **the currently approved shared** repo-native song gate; retain exact command, exit status, failure detail, version/hash and source/corpus hashes in `gate.txt`. Future gate version may distinguish hard `FAIL` (source ID mismatch, missing cards, unsourced facts, file over cap) from warnings/editorial choices (title-first, fixed opener quota, rigid 80–95 per beat, universal 100–130 BPM) *only after WS0 authorization*. Test title-optional positive fixtures, known negatives, exact card mapping/Best-of, source provenance and correct separation from R2 spoken mode. Regress against diverse prior songs, not only one style Golden.
### Phase 5 / genuinely independent blinded artistic critic
Independent **separate context/process/model**, read-only, no Work transcript, draft history, builder self-scores or editing rights (independent execution guard). Input: exact candidate LYRICS + STYLE, neutral and source-faithful short deck synopsis, performer identity if necessary to assess consistency, and optionally canonical card mapping for truth inspection. Without source cards, a critic cannot certify fidelity; split a source-truth auditor and a blinded audience-level critic if needed. Reviewer judges original artistic merit and comprehension of the **musical comic performance**, not conformity to Alice or old title/opener ratios:
- Is this entertaining as music/performance rather than a card inventory or a rulebook?
- Is the performer distinct and the deck's particular satire/denkraeume intelligible to outsiders while insiders find details?
- Do transitions have causality/contradiction, varied rhythm and enough breathing space?
- Does the end earn or subvert its opening premise without a generic catchphrase?
- Do actual printed cards connect visibly and consistently, and does the audience sense the Cut & Play / comics / game relation **without inventing analog play mechanics**?
- Is there a distinct musical identity? Could this lyric be swapped onto another deck with no loss?
- Would meaningful visual mapping to existing card art/Comic Motion be possible?
Return critique, precise observations, independent agent/session identity and `REVISE`/`READY_FOR_WS0` editorial recommendation. Reviewer **does not write replacement lyrics**. Keep numeric scores only where compatibility with WS0 critic contract is required; avoid optimizing numerical score at the expense of the work. If no truly separate session available: `CRITIC_NOT_RUN`.
### Phase 6 / WS0 and Georg
Builder makes at most one coherent critic-driven rewrite, reruns official gates on exact new revision. WS0 reviews source authenticity, exceptions, stylistic diversity and the novel intro/character freedoms. No pretended green gate, critic approval or human acceptance. Georg chooses final treatment/Suno rendition based on hearing, not score. Estimate Suno credits but count actual spend only after provider confirmation; 20 draft tracks do not automatically equal 20 billed generations.
### Phase 7 / downstream only after actual audio
Record chosen audio + real Suno stems when available. **Do not fake timestamps.** Existing audio/performance owners generate alignments `deckId + cardNumber(s) + lyric/beat start/end + printed-source artwork reference + cue + performer`, speech/subtitles, billboard/scenelet choreography and `kfb.performance/1`. Never create a second mixer, ChatterBox runtime, card DB or visual stage. Stage/public tests only when receiving owner requests a meaningful public milestone.

## Resumability / data contract, not new product
Retain current GitHub branch & per-deck song files under existing song owner; a minimal batch index `batch-status.json` can record a queue and exact pointers, **not copy card truth**. Per deck store source refs/hashes; bestOf/omitted rationale; performanceRole/source; angle; `cards.json`, `songlines.json`, lyric/style versions; current character count; gate logs; critic-only payload/result; revision diff; `RETURN.md`, status and one next gate. Statuses distinguish `SOURCE_READY`, `DRAFT_UNGATED`, `GATE_PASS`, `CRITIC_PENDING`, `CRITIC_REVIEWED`, `WS0_APPROVED`, `Suno_SELECTED`, `STEMS_READY`, `MOTION_MAPPED`, `PUBLIC_VERIFIED`; labels require corresponding evidence.
After each real GitHub write fetch exact branch head + intended files, treating timeout as UNKNOWN. At coherent phase boundaries save implementation/writing → factual QA → Return. Hub track card is a downstream WS0-owned output with STYLE + LYRICS only when truthfully qualified.

## Rollout / protect credits and originality
- **Pilot three contrasting actual batch decks**: The Biological Metropolis (existing ungated author draft, no rewrite until spec alignment), Big Bad Brain Wrestling (showmanship/rivalry), Embrace Protopia (optimistic but critically intelligent small-step change). The Alice user composition is a **distinct reference**, not a required pilot copy or generic Golden.
- Evaluate each with a separate art critique and comparative *batch-level* editor review for non-repeated voices, openings, tempos, genres and comedy techniques; compare diversity between tracks only at editor stage, not by contaminating the individual blind critic.
- After WS0 confirms the new gate/critic arrangement, resume remaining Batch 1 inventory in small repeatable groups rather than demanding 20 simultaneous final artistic acceptances. Generate Suno only for versions actually chosen by Georg. Keep ≈60 credits as an unverified budget estimate; don't prespend.
- Scale beyond 20 by adding queued decks to the existing batch owner; no webchat-context dependence or manual re-pasting.

## Explicit independent execution
Outcome: persistent owner-native authoring, critique and handoff of **artistically distinct**, source-mapped songs.
Builder: one Work/Codex writer in the existing KFB Triplets/WSA owner.
Tester: repository-native checker + separate factual audit, evidence only.
Critic: fresh external/model session, read-only, no builder history, not the writer.
Guard: read-only routing per `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`, only STOP authority.
Only writer: Builder.
Human gate: WS0 explicit C9/performance-source-cue spec alignment first; Georg approves music only by actual audition later.
After two non-improving fixes on a seam, preserve/quarantine that seam; proceed on unrelated deck work unless outcome-critical and Guard STOP.

## Exact WS0 decision needed
See [rule reconciliation request](WS0_SONG_WORKSHOP_RULE_RECONCILIATION_REQUEST_R1.md). **Do not run a 20-song Work batch against literal current R3.7 in a way that deletes individual artistic performances to satisfy a title/80-character formula.**

**Single next gate:** WS0 ACK/TUNE/OBJECT on the minimum revised SONG_SPEC/gate/reviewer interface while retaining existing R2 spoken mode and printed card truth.
