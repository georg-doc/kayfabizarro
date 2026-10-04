# KFB Billboard Quote Hypernormalisation · START HERE

Status: **PLANNING SSOT · QUEUED AFTER CURRENT MVP1 PLAYABLE DELIVERY**
Date: 2026-10-04
Owner: **KFB ToolBox / Billboard Media Residency**
Repository: `georg-doc/kayfabizarro`
Planning branch: `planning/billboard-quote-hypernorm-curator-2026-10-04`
Implementation: **NOT STARTED**
Public Stage: **NOT CREATED**
Live: **UNCHANGED**

## Outcome

Build one coherent KFB Billboard experience in which a canonical KFB Card/world context selects a curated quotation and turns it into an audiovisual Hypernormalisation sequence on the existing claymation Billboard.

Core loop:

`deck/card seed + biome/world seed → curated quote → timed read-along Hypernormalisation → attribution → FrizzleQuestion → optional player reflection / Brain Food`

The same sequence can be watched:
1. diegetically on the in-world Billboard;
2. through a physical claymation TV/screen button mounted below the Billboard, opening an immersive full-screen reading mode without restarting the sequence;
3. in a neutral 3D curator/test stage for authoring and QA.

## Current source truth

Do not rebuild any of these owners.

### Hypernormalisation visual owner

Current reference is **H13**, not H4:

`tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/KFB Billboard Kaleidoscope H13.dc.html`

Read:
- `00_ONBOARDING.md`
- `DOKU_H5-H13.md`
- `HANDOVER_WSA.md`

H13 already provides:
- H4 lineage: songform, seeded planning, unlikeness selection, typography treatments, camera and transition grammar;
- KFB Card material;
- Public Domain / LoC / archive layers;
- formulas, glyphs, fractals, hypno patterns;
- five palette sources including CARDS and BIOME;
- live music analysis driving camera, typography, hypno speed, fractal colour, grain and flashes;
- an existing full-screen/canvas mode.

H13 is frozen reference material. New runtime work must extract/reuse it or build an H14-class derivative; do not overwrite H13.

### Billboard physical/context owner

Reuse the existing Billboard Media Residency chain:
- B0/B1/B2a physical/body/front-rear semantics;
- PR #321 `BILLBOARD-CONTEXT-R11` for the H13 contextual media router;
- PR #324 for real Travel `WorldContext` card/biome/palette binding;
- PR #326 for physical K2 clay-body/world accent adaptation;
- later World Billboard Clay source for the 12 × 6 m body, CanvasTexture face and one `BillboardScheduler.tick()`.

No second renderer, camera owner, animation frame loop, billboard scheduler, palette mapper or Card database.

### Card/deck semantic owner

Canonical deck registry:
`media/kfb/index.json`

Verified on 2026-10-04: **130 deck records**.

Canonical semantic Card data comes from each registry deck's JSON. Preserve stable identity:
`packId + cardNumber`.

Reuse the existing Card Builder / Card format / ink owners. Do not create another Card renderer or transcription database.

### Audio owner

Reuse the accepted KFB audio contract and existing runtime owners:

`skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/`

Accepted shared role vocabulary:
`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`.

The Billboard/Hypernormalisation feature is an **audio consumer**, not a new mixer:
- one AudioContext per host;
- music/soundbed timeline continues during ducking;
- voice/read-along may request focus/ducking;
- existing audio catalog and Audio Site/Mixer remain source owners;
- H13 visualizer consumes timing/spectrum events from the host.

## Product behaviour

### In-world Billboard

The existing clay Billboard plays an ambient Hypernormalisation loop selected from the current Card/world context.

When a quote sequence begins:
1. source imagery/typography establishes the quote's visual context;
2. the quotation appears in semantic phrase/clause beats, not word-by-word karaoke;
3. read-along emphasis follows the master clock;
4. attribution resolves to author + work + source;
5. the terminal beat is one contextual FrizzleQuestion.

Example design fixture supplied by Georg:

`FrizzleBob asks you: At what point does a collection of cells become a someone rather than a something?`

Question rules:
- one question;
- specific to the quote;
- intellectually interesting;
- no trivia;
- no generic “What do you think?”;
- no moralising or intended-answer framing;
- short enough to read comfortably on the Billboard.

### Clay TV / full-screen button

Add one tactile claymation button/control below the Billboard face, visually belonging to the same physical object.

Interaction:
- click/tap while in interaction range;
- opens the current sequence as an immersive screen/full-screen presentation;
- **does not restart** quote, music or visualizer phase;
- same state/clock continues across diegetic ↔ full-screen transition;
- clear exit returns to the same in-world Billboard state;
- mute/unmute is available;
- optional captions/read-along state remains visible;
- Brain Food/source action appears after attribution/question, not as persistent chrome over the artwork.

Use the existing input/router owner. Do not add a parallel interaction runtime.

### Brain Food

Every published quote record must have verifiable provenance. The full-screen end state may expose:
- source/edition;
- a validated external source or further-reading link;
- optional QR representation of the same validated destination.

A QR code is presentation only. The canonical field is the validated URL/provenance record.

## Deterministic quote selection

Selection must be reproducible:

`quoteSelectionSeed = hash(packId, cardNumber?, cardSeed, biomeId, biomeSeed, quoteCycle)`

Filtering occurs before deterministic selection:
1. publication/right status;
2. language;
3. deck/card relevance;
4. biome/world affinity where present;
5. recent-repeat suppression.

Do not let a random LLM response select the runtime quote.

## 130-deck curation model

All 130 registry decks receive a `deckQuoteProfile` even if individual Cards do not yet have hand-curated quotes.

A deck profile contains:
- canonical `packId`;
- authored deck title;
- theme/concept tags derived from its canonical Card JSON;
- preferred author/research domains;
- excluded cliché/topic patterns;
- biome/world affinities;
- quote ids approved for the deck;
- optional Card-specific quote mappings.

Card-level mapping refines deck-level meaning through title/power/lore/artwork semantics; it never replaces the source Card JSON.

The pool is many-to-many:
- one quote may fit multiple decks/cards;
- one deck/card may point to several quotes;
- runtime weighting remains deterministic.

## Curator/admin GPT Site

Create a dedicated private GPT Site / app-like authoring surface, working title:

**KFB Hypernormalisation Curator**

It is a curator/control plane, not a second game runtime.

Required areas:
- Decks: all 130 canonical deck profiles and coverage status;
- Quotes: searchable/filterable quote pool;
- Quote Inspector: text, author, work, source, rights/provenance, tags, FrizzleQuestion, Brain Food;
- Mapping: deck/card ↔ quote relevance/weight;
- Audio: select existing Audio Site/Mixer track/soundbed references and visualizer recipe;
- 3D Test Stage: isolated Billboard + Hypernormalisation preview;
- Validation: missing provenance, rights, duplicate/near-duplicate, cliché, question quality, audio-link integrity;
- Export/commit: schema-valid JSON/JSONL data suitable for GitHub persistence.

The Site must not silently auto-publish researched quotes. Suggested/researched records remain DRAFT until validation/curation state permits use.

## Neutral 3D Test Stage

The curator Site must include a dedicated stage with no decorative palette/UI overlay over the preview.

Purpose: see the actual object and actual face cleanly.

Controls may live in a collapsible side panel. The 3D viewport itself stays unobstructed.

Required controls:
- available verified clay Billboard variant;
- deck / Card selection;
- Card seed;
- biome/world selection;
- biome seed;
- quote id or deterministic auto-select;
- palette source = canonical CARDS / BIOME / receiving WorldContext;
- audio recipe / track / soundbed from existing Audio owner;
- play/pause;
- mute;
- visualizer sync on/off for comparison;
- diegetic view ↔ full-screen view;
- restart same seed;
- next deterministic quote cycle.

Seed/palette behaviour:
- Card/biome/world context drives the **physical clay Billboard colour/material through the existing WorldLook owner**;
- the same context drives H13 palette inputs;
- there is no new local palette generator;
- debug swatches/values may exist in a diagnostics drawer but not over the preview.

## Audio ↔ Hypernormalisation interface

The Site/runtime shall expose one consumer-facing analysis frame from the existing host AudioContext, for example:

`kfb.audio-visualizer-frame.v1`

Minimum semantic payload:
- `trackId` / source reference;
- `audioRole` (SCORE, DIEGETIC_MUSIC, GLOBAL_BED, etc.);
- `bpm` when known/measured;
- `timeSec`;
- `beatPhase` 0..1;
- `barPhase` 0..1 when meter is known;
- `kick` 0..1;
- `bass` 0..1;
- `mid` 0..1;
- `high` 0..1;
- `rms` 0..1;
- `transient` 0..1;
- `isPlaying`;
- `muted`.

H13 adapter maps these semantics into its existing music-reactive controls. It must not own playback when embedded in the game/Site host.

Quote/read-along timing uses the same master timebase. Voice focus may duck music/bed through the existing audio contract without pausing playback.

## Quote data / research quality

Every publishable quote must record enough evidence to verify the wording and source:
- author;
- work;
- publication/year where available;
- exact quotation text;
- source URL and/or edition/page locator;
- verification status;
- rights/publication status with jurisdiction/context;
- source retrieval date;
- curator notes;
- semantic tags;
- deck/card mappings;
- FrizzleQuestion;
- Brain Food destination(s).

Do not rely on quote-aggregation websites as sole proof when a primary/edition source is available.

Long passages require explicit rights clearance/status appropriate to the publication surface. The system must support `DRAFT_RIGHTS_UNKNOWN` and keep such records out of public/runtime rotation.

## Curator Worker

A separate research Worker/Web chat may populate the pool in batches.

Per batch:
1. load canonical deck + Card JSONs;
2. derive a compact research brief from authored semantics;
3. research non-cliché quotes and primary/edition sources;
4. validate wording/provenance;
5. propose one FrizzleQuestion per quote;
6. map quotes to deck and optional Card refs;
7. flag rights/publication status;
8. commit only schema-valid candidate data;
9. leave uncertain records as DRAFT, never fabricate missing citation/page data.

The Worker may suggest authors from Card references/lore, but must not assume an author reference means any famous quote by that author is relevant.

## Future reflection seam

A player response to a FrizzleQuestion may later write a compact event/reference into Lean Memory / Fractal Almanac.

That is a future receiving-owner integration. This planning contract does **not** create a new memory owner and does not require player-response persistence for the first Billboard/Curator implementation.

## Stage / acceptance route

When implementation begins, reserve the meaningful integrated review route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/billboard-hypernorm-curator/`

Formal KFB acceptance uses the direct Cloudflare route linked from KFB Hub.

The private GPT Site may be the authoring/admin product, but it does not replace the required Cloudflare Stage proof for browser/3D acceptance.

## First implementation outcome

One One-Shot should deliver a meaningful vertical slice rather than a chain of micro-gates:

- current H13 shown in isolation first;
- current clay Billboard/context owner shown in isolation first;
- current accepted Audio Calibration/Audio owner demonstrated as source;
- one quote fixture end-to-end;
- one verified deck/Card + biome seed;
- physical Billboard with contextual palette;
- read-along sequence;
- attribution;
- FrizzleQuestion;
- audio/soundbed + H13 visualizer sync;
- clay TV/full-screen button preserving timeline;
- mute;
- Brain Food/source link;
- neutral 3D curator stage;
- schema-backed editable pool;
- coverage browser for all 130 deck profiles;
- deterministic reload producing the same result.

No merge or Live promotion without Georg's named gate.


## Operating model · who does what

### 1. Quote Curator Worker / research chat

This is the pool-filling executor.

It does NOT change H13, Billboard runtime, Audio runtime or the curator Site UI.

For each batch it:
1. reads the canonical deck registry and the selected decks' Card JSON;
2. derives a compact thematic research brief from cardName / power / lore / artworkPrompt;
3. searches for non-cliché quotations relevant to those themes;
4. verifies exact wording against a primary source, reliable edition, archive or equivalent strong source;
5. records provenance and publication/rights status;
6. writes one strong FrizzleQuestion per quote;
7. maps the quote to one or more deckIds and, where justified, specific Card refs;
8. adds Brain Food links;
9. validates against QUOTE_POOL_SCHEMA.json;
10. writes candidate data to the quote-pool branch / PR.

Recommended batch size: 10 decks at a time, targeting 3–5 genuinely useful quote candidates per deck. Do not pad a deck with weak famous quotes merely to hit a count.

### 2. Georg / Curator Site

Georg is the editorial gate, not the data-entry worker.

Use the private KFB Hypernormalisation Curator Site to:
- browse all 130 decks;
- inspect candidate quotes and mappings;
- edit wording/tags/question where useful;
- reject cliché or weak material;
- approve/private/public-status candidates where provenance and rights allow;
- audition later audio/visualizer recipes and 3D Billboard results.

The Site is the review/control surface. GitHub remains authoritative persistence.

### 3. Work / WSA implementation

Work/WSA consumes the approved/curated pool and builds the product integration:
- H13 read-along adapter;
- deterministic Card/Biome selector;
- clay Billboard + full-screen control;
- Audio visualizer handoff;
- neutral 3D stage;
- game integration;
- Cloudflare Stage proof.

Work/WSA must not become the quote researcher except for a tiny fixture needed to prove the runtime.

## Pool-fill cadence

Use an additive batch loop:

`10 decks → 30–50 candidate quotes → schema/provenance check → Curator review → accepted/rejected states → next 10 decks`

Continue until all 130 deck profiles have meaningful coverage.

Coverage target is quality-first:
- baseline: at least 3 strong curated quotes per deck where the source material supports it;
- richer decks may have more;
- individual quotes may map to several decks/cards;
- Card-specific mappings are added only when the fit is actually specific.

Do not fake completion. A deck may remain SEEDED/RESEARCHING until enough good material exists.
