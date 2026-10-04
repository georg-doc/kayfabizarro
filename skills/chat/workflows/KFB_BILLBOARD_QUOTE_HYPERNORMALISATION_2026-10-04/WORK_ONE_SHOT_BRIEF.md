# WORK ONE-SHOT · KFB Hypernormalisation Curator + Quote Read-Along

Status: **READY AS FUTURE EXECUTION BRIEF · DO NOT START UNTIL CURRENT MVP1 HUMAN REVIEW GATE CLEARS**
Date: 2026-10-04
Owner: **KFB ToolBox / Billboard Media Residency**
Repo: `georg-doc/kayfabizarro`
Planning source: branch `planning/billboard-quote-hypernorm-curator-2026-10-04`
Public acceptance route: `https://kayfabizarro.pages.dev/kfb-hub/stage/billboard-hypernorm-curator/`
Live promotion: **NOT AUTHORIZED**

## Mission

Build one coherent curator/admin product plus one end-to-end Billboard vertical slice.

The product must let Georg curate verified quotes and FrizzleQuestions against the existing 130 KFB deck registry, choose a canonical Card + biome/world seed, choose existing KFB audio/soundbeds, and preview the exact resulting clay Billboard + H13 Hypernormalisation sequence in a clean 3D test stage.

The same proven sequence must be embeddable in the actual game Billboard, including a tactile clay TV/full-screen button that continues the same timeline in immersive view.

Do not stop after internal module proofs. Persist checkpoints and continue until the integrated candidate is ready for the named Stage route or a real stop condition is reached.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/START_HERE.md`
5. `QUOTE_POOL_SCHEMA.json`
6. `DECK_QUOTE_PROFILE_SEED.json`
7. `AUDIO_VISUALIZER_HANDOFF_SCHEMA.json`
8. H13:
   - `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/00_ONBOARDING.md`
   - `DOKU_H5-H13.md`
   - `HANDOVER_WSA.md`
   - `KFB Billboard Kaleidoscope H13.dc.html`
9. Billboard Context PR chain #321 → #324 → #326 and current receiving owner state.
10. `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`
11. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`

GitHub state at execution time overrides every head quoted in this planning packet.

## Non-negotiable source isolation

Before integrating, show and capture these actual donors independently:

1. H13 running in isolation with its current music-reactive layers.
2. Current clay Billboard physical object in isolation, including the face owner.
3. Current card/biome/world-context palette binding in isolation.
4. Current accepted Audio Calibration/audio owner in isolation.

A loaded module/URL is not source proof. Show the actual donor output.

## One runtime owner rule

Do not create:
- a second Billboard renderer;
- a second H13-style visual runtime;
- a second Card registry/renderer;
- a second biome palette mapper;
- a second AudioContext/mixer;
- a second animation-frame owner;
- a second player input owner.

Build adapters around existing owners.

## Product surface A · Curator/Admin Site

Working title: **KFB Hypernormalisation Curator**.

Required navigation, compact and utilitarian:
- **Decks**
- **Quotes**
- **Mappings**
- **Audio**
- **3D Stage**
- **Validation**

### Decks

Load all **130** canonical records from `media/kfb/index.json`.

For each deck show:
- packId / title;
- coverage status;
- Card count where resolvable;
- thematic profile;
- researched / curated / public-ready quote counts;
- unresolved source/rights count.

Do not manually hardcode a second 130-item list if the registry can be consumed directly. The checked-in `DECK_QUOTE_PROFILE_SEED.json` is a coverage seed, not a replacement registry.

### Quotes

Quote record editing follows `QUOTE_POOL_SCHEMA.json`.

Required curator actions:
- search/filter;
- create DRAFT;
- edit;
- map to deck(s);
- optional Card-specific map;
- author/work/source/provenance;
- rights/publication state;
- theme + biome tags;
- semantic timing segments;
- FrizzleQuestion;
- Brain Food destinations;
- audio recipe reference;
- mark REJECTED / CURATED / APPROVED_PRIVATE / APPROVED_PUBLIC.

No quote enters public/runtime rotation unless its state and rights state permit it.

### Research intake

Allow import of batch candidate JSON/JSONL from a Quote Curator Worker.

Validation must reject:
- unknown `packId`;
- unknown Card ref;
- duplicate quote ids;
- exact duplicate texts;
- missing author/work;
- missing provenance for curated/public states;
- missing FrizzleQuestion;
- public state with rights still unknown;
- broken Brain Food URL syntax;
- second copied Card truth instead of stable refs.

Near-duplicate detection should surface candidates, not silently delete them.

## Product surface B · Neutral 3D Test Stage

This is a first-class acceptance surface inside the product.

### Visual rule

The viewport is clean:
- no palette swatches over the Billboard;
- no debug labels over the artwork;
- no HUD covering the face;
- control panel collapses completely.

### Scene

Use a simple neutral stage/light environment so the selected clay Billboard can be read in 3D without unrelated world clutter.

Allow:
- orbit;
- front;
- 3/4;
- back;
- full-screen face;
- return to 3D without restarting playback.

### Inputs

- verified clay Billboard variant;
- deck;
- Card;
- Card seed;
- biome/world;
- biome seed;
- quote id or AUTO;
- quote cycle;
- palette source through the existing owner;
- audio track/soundbed recipe from existing Audio owner;
- visualizer sync ON/OFF;
- mute;
- play/pause;
- voice/read-along ON/OFF where available.

### Seed truth

Given the same:
- deck/Card ref;
- Card seed;
- biome/world ref;
- biome seed;
- quote cycle;
- quote-pool revision;

the same quote selection and deterministic non-audio visual planning must reproduce after reload.

The Audio visualizer may of course vary with the real source signal, but the selected audio recipe/reference must reproduce.

## Product surface C · Quote Read-Along runtime

### Sequence

1. opening visual establishment;
2. quote appears as semantic phrase/clause beats;
3. active phrase gets the current read-along emphasis;
4. H13 layers remain art-directed, not reduced to subtitles;
5. quote resolves;
6. author + work + source attribution;
7. one FrizzleQuestion;
8. optional Brain Food source/further-reading affordance;
9. return/continue to next deterministic cycle.

Do not use karaoke-per-word highlighting unless a specific quote timing calls for it.

### FrizzleQuestion

Exactly one terminal question.

Quality test:
- tied to the quote's conceptual tension;
- player-facing;
- not trivia;
- not an answer disguised as a question;
- not generic motivational coaching;
- not generic AI whimsy;
- concise enough for the Billboard.

Design fixture:
`FrizzleBob asks you: At what point does a collection of cells become a someone rather than a something?`

## Product surface D · Clay TV/full-screen control

Use a physical claymation control beneath/in the existing Billboard body, styled like a tactile old television control rather than generic web chrome.

Activation:
- only through existing interaction/input ownership;
- continues the same quote/audio/visualizer clock;
- opens immersive screen/full-screen;
- allows mute;
- allows clean exit;
- returns to the same in-world state.

Do not create a duplicate quote player for full-screen.

## Product surface E · Audio integration / Music Visualizer

### Source

Use the existing Audio Site/Mixer/catalog/host owner.

The Curator may select references to tracks/soundbeds, but does not copy the audio catalog.

### Handoff

Implement/read `kfb.audio-visualizer-handoff.v1`.

Hypernormalisation consumes:
- measured/known BPM;
- master time;
- beat/bar phase when available;
- kick;
- bass;
- mid;
- high;
- RMS;
- transient;
- playing/mute/voice-focus state.

Map these into the existing H13 music-reactive dimensions rather than inventing a new visualization engine.

### Clock

One master timeline owns:
- quote segment timing;
- narration/read-along;
- H13 songform/section clock;
- visualizer response;
- full-screen transition continuity.

Entering full-screen must not resync from zero.

### Mute and ducking

- mute may silence playback while visual sequence can continue according to the chosen host policy;
- voice focus uses the accepted audio ducking seam;
- music/soundbeds keep their timeline while ducked;
- never stop/restart the track for narration.

## Pool build · 130 deck coverage

Do not attempt “one random famous quote per deck.”

Create useful thematic coverage.

### Phase 1 coverage

For every canonical deck:
- non-empty theme profile derived from its Card JSON;
- preferred research domains;
- anti-cliché patterns;
- at least one research direction.

### Phase 2 quote pool

Curate quote candidates in reviewable batches.

Target for first meaningful pool:
- enough quotes to demonstrate diversity across KFB / philosophy / medicine / science / politics / culture / history groups;
- at least the named Huxley design fixture in private/test state;
- at least 10 deck profiles with ≥3 curated quote candidates each;
- all 130 deck profiles present even if some remain `SEEDED`.

Do not fake completeness. Coverage UI must make gaps visible.

### Phase 3 expansion

Continue batches until the desired 130-deck depth is reached. The data pipeline must scale without runtime code changes.

## Provenance / rights

Public-ready records require explicit evidence.

Track:
- exact wording;
- author;
- work;
- year where known;
- edition/page/locator where available;
- source URL;
- retrieval date;
- verification status;
- rights/publication status and jurisdiction context;
- curator notes.

If wording/source is uncertain, keep DRAFT.
If rights are uncertain, keep out of public/runtime rotation.

## Brain Food

The end state may expose:
- canonical source;
- edition/archive page;
- carefully chosen further reading.

In full-screen these should be clickable.
In-game 3D presentation may optionally render a QR code for the same validated URL.

No invented destination URLs.

## Persistence

Use GitHub as authoritative curated-data persistence.

Recommended files:
- one schema;
- deck profiles;
- quote pool JSONL or sharded JSON;
- source/provenance audit;
- additive changelog.

The GPT Site is an editor/control plane, not the authority by itself.

Any write path must:
- validate before commit;
- preserve additive history;
- report exact commit;
- avoid whole-file overwrites when concurrent curation would be unsafe.

## Validation / tests

Must include:

### Data
- 130/130 registry deck refs resolve;
- profile IDs unique;
- quote IDs unique;
- mapped deck/Card refs resolve;
- schema validation;
- public records satisfy provenance + rights requirements;
- deterministic selector repeatability.

### Browser / 3D
- donor source isolation captures;
- Billboard body/front/back;
- contextual physical palette;
- H13 face;
- 3D → full-screen → 3D continuity;
- same sequence/time after return;
- mute;
- clean viewport mode;
- mobile/touch smoke;
- no second renderer/rAF/AudioContext.

### Audio
- accepted host source decodes/plays;
- one AudioContext;
- analysis handoff updates;
- kick/bass/mid/high visibly influence named H13 layers;
- sync comparison ON/OFF;
- narration/voice duck does not pause music;
- full-screen does not reset audio time;
- mute behaves consistently.

### User-visible
- one quote runs end-to-end;
- attribution readable;
- FrizzleQuestion readable;
- Brain Food opens correct validated destination;
- same seed reloads same quote/plan;
- coverage browser visibly contains all 130 decks.

## Stage

Only after the integrated milestone is coherent, publish to:

`https://kayfabizarro.pages.dev/kfb-hub/stage/billboard-hypernorm-curator/`

Update KFB Hub in the same publication batch.
Open the exact Cloudflare URL and visibly verify the intended revision.
Do not claim live from CI/deploy status alone.

## Return

Return:
- exact repo / branch / PR / head;
- changed files;
- retained source owners;
- actual test counts;
- donor-isolation screenshots;
- clean 3D stage screenshots;
- one full-screen quote/FrizzleQuestion screenshot;
- audio sync evidence;
- exact Stage URL;
- quote/deck coverage counts;
- unresolved rights/source items;
- exactly one next gate.

No auto-merge and no Live promotion.
