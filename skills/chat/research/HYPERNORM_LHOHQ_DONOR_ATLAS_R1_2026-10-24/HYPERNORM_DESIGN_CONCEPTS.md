# HyperNorm × LHOHQ — Creative mechanism atlas and implementation intake
Date: 2026-10-24. Every item: **ART DIRECTION PROPOSAL, NOT IMPLEMENTED**. Existing Billboard Media Residency/H13/Curator/Card/Audio owners retained.

## Guiding thesis
**Epistemic montage** = the audience discovers that a fragment's meaning depends on documented origin, framing, juxtaposition, repetition and the path taken through the material. A bewildering surface without a meaningful second read is decorative noise; a scripted propaganda-tunnel without room for player discovery is a linear slideshow.

The creative aim is NOT visual generic 'hacker mode' / infinite random links / imitation LHOHQ assets. Aim for curated strangeness that makes the player's interpretive choices consequential.

## Four experience registers
- **DIEGETIC_BILLBOARD**: an existing KFB physical clay billboard/screen hosts a short sequence within a world/biome, with its existing face and global single scheduler.
- **IMMERSIVE_SCREEN**: click the existing physical clay TV button to continue same cycle/timecode in full-screen; not a reload, not new clock.
- **RESEARCH_INSPECTOR**: Curator private provenance & rights review, no fiction represented as original source.
- **NARRATIVE_RABBIT_HOLE**: optional exploratory pathways authored from canonical Cards / approved quotes / provenanced media, separate layer on same timeline.

## Mechanic proposals, prioritized
| ID | Name | Visual-narrative mechanism | Data/output | First proof |
|---|---|---|---|---|
| M01 P0 | **Document / Performance Split** | A bureaucratically exact-looking source card overlays an authored satirical translation; player can flip to original metadata. No invented CIA/agency seal presented as actual document. | `sourceRef + displayType + annotationType + fictionalFrame` | one same-seed original/interpretation alternating 2×, provenance label visible |
| M02 P0 | **The Context Trap** | One verified sentence is shown in three legitimate, distinct frames: neutral context, competing interpretive analogy, deliberately fictional propaganda rewrite. Player discovers what was changed. | quote ID + three explicitly classified frames | 1 quote, 3 frames, correct source/fiction differentiation |
| M03 P0 | **Meaningful Recursive Return** | Symbol/card/image returns later in a changed connection; originally insignificant detail now has editorial weight. Store visit history in present playback session, not a new player state owner. | seeded motif ID + visitCount + relation reason | revisit visibly reframes and source remains consistent |
| M04 P0 | **Evidence / Claim / Speculation Ladder** | Select one link to see original source, someone else's interpretation and artistic fiction as different navigable layers; no false equivalence. | links to existing Research Atlas / approved Brain Food | 3 distinct source-state cards with correct claims |
| M05 P1 | **Rabbit-Hole Graph** | Each node has 2–4 meaningful typed exits, some cyclical; motifs are linked by research, conflict or satire rather than purely random color matching. | source ID, typed conceptual edges, seed, depth budget | reproducible 6–9 node exploration, loops controllable |
| M06 P1 | **Archival Pressure / Breathing Space** | Visually dense typeset fragments rhythmically yield to a single isolation shot; significance depends on sequence, not gratuitous flicker. | H13 shot grammar and text density envelope | annotated storyboard, controlled reading times |
| M07 P1 | **Unreliable Label / Reliable Source** | Typography and titles can theatrically change while provenance overlay remains accurate. Reveals rhetorical frame. | style label / stable source metadata | same source survives 3 title treatments |
| M08 P1 | **Synaptic Collage Cuts** | A precise common graphic form (eye, maze, diagram, headline) bridges incongruous but documented neighboring fields of sense. | typed WARBURG_NEIGHBOR (noncausal) | critic explains each transition without forcing causal link |
| M09 P1 | **The Unfinished Dossier** | An archival research card contains a real open question and a visible missing-original slot, not a fabricated solved mystery. | source ledger `unknowns` / next falsifier | source gaps survive export/replay without invented answers |
| M10 P2 | **Portal Between Media** | Diegetic billboard → immersive paper archive → audio quote → world object. Transport is a camera/texture/view switch controlled by current host, not nested runtimes. | timecode + camera mode + texture | no restart, no double AudioContext, no second rendering clock |
| M11 P2 | **Institutional-Voice Counterpoint** | Same content voiced sequentially through parody ad, documentary clip and skeptical FrizzleQuestion; audio remains KFB Audio consumer. | pre-approved voice/track refs + audio handoff | mute/ducking and subtitles remain correct |
| M12 P2 | **Artifact Scatter into Biomes** | Motif fragments spill into already-authored world objects/landmarks; the player can trace back to one source/Deck. Placement uses WorldBuilder semantics, not new terrain generator. | worldContext, cardRef, artifact pointer | one source-linked world artifact and route provenance |
| M13 P2 | **Cultural Time Spiral** | Explicitly juxtapose early net art, 2000s politics and 2026 bot feeds; label dates and artistic analogy rather than inventing a historical line of descent. | period-tagged media refs + temporal rule | 3 clear time strata with valid source labels |
| M14 P3 | **Found-Website Window** | Simulated 1990s browsing artifact inside an art-directed screen composition; original source link optional, sandboxed/static capture only. | cleared/sanitized bitmap plus caption | zero third-party scripts / 0 personal-data capture |

### Explicitly rejected / defer
- **Reject** unbounded stochastic shuffling of all texts/images/styles (H13 Engine v0 negative precedent); not narrative.
- **Reject** arbitrary root/URL crawling, hotlinking from lhohq.info, executing remote scripts, personal-record display or unlicensed GIF/audio mirroring.
- **Reject** generic green terminal/CRT/glitch aesthetics, fake system hacking, stock UFO/CIA stamps, or repetitive 'classified document' cosmetics.
- **Reject** changing Card/Quote/Audio/World/Renderer master owners to make the effect easier.
- **Defer** automatic AI 'true-connection' predictions: conceptual graph relations cannot silently become historical causation.
- **Defer** animated source-page simulation until isolated screenshots, design/right provenance and performance tests are real.

## One worked story: THE AGREEMENT ENGINE (illustrative fiction, not a verified documentary)
**45–75 s H13/H14 sequence** (beats relative, not a hard runtime specification):
1. 0–9s — An existing KFB Card about attention/consent or information selection appears as a single readable stage object. Establish the actual Card/quote ID, no invented source.
2. 9–20s — Layers of consent-language/product marketing/archive-looking type appear. Use curated fictional copy **visibly labelled SATIRE** and H13's existing music-synchronized typography; no lifted site copy.
3. 20–30s — One documentary claim is singled out, author/work/source credited with verified original link. Dense background yields to a minimal stable panel; allow reading.
4. 30–40s — Same documented sentence is presented in a different context; simple graphic form recurs; arrow labelled **ANALOGY**, not “evidence”.
5. 40–54s — Viewer may choose: `SOURCE` (document), `NEIGHBOR` (noncausal analogy), or `STORY` (fictional KFB world fragment). Continue with deterministically authored path.
6. 54–65s — Contradictory interpretive frames appear side by side. Provenance anchor remains persistent and correct.
7. 65–75s — Resolve to **one FrizzleQuestion** inviting the viewer to distinguish source fact from frame without coaching one political conclusion. Optional Brain Food, then resume same seeded cycle.

Timing design: editorial rhythm anchored to KFB Audio's real beat/timeline; optional interactions may hold/subdivide shots but must preserve selected scene seed and playback state. No fake audio measurement.

## Content / graph draft (illustrative, NOT a new schema owner)
```json
{
  "proposal": "hypernorm.semantic-neighbor.v0",
  "nodeId": "story-agreement-01",
  "sourceKind": "KFB_CARD_REFERENCE",
  "cardRef": { "packId": "EXISTING_VERIFIED_PACK_ID", "cardNumber": 1 },
  "motif": "consent",
  "branches": [
    { "type": "SOURCE", "target": "existing-provenance-id", "causality": false },
    { "type": "WARBURG_NEIGHBOR", "target": "approved-concept-id", "causality": false },
    { "type": "FICTIONAL_KFB_STORY", "target": "editorial-pitch-only", "causality": false }
  ],
  "seedPolicy": "existing quote selection + H13 cycle seed; no second random owner",
  "rightsState": "DRAFT_RIGHTS_UNKNOWN",
  "stage": "PROPOSAL_ONLY"
}
```
`EXISTING_VERIFIED_PACK_ID` is descriptive pseudocode **not a publishable placeholder**: receiving integrator must bind an actual approved Card from `media/kfb/index.json` before any runnable fixture.

## Minimum viable **research-to-prototype** track, not an authorization to build
1. **Donor isolation gate (mandatory):** actually show original H13 running alone; current KFB clay billboard body/face separately; one current Curator-approved quote/card mapping separately; KFB audio source alone. Capture screenshot/short clip per original, not merely loaded URLs.
2. **Select M01–M04** for one manually art-directed finite sequence, with authored storyboard and a fixed seeded path. Only approved existing media and quotes.
3. **Implementation seam (future executor):** add *semantic shot plan input* to existing H13/Curator pipeline; return shot descriptors to existing billboard scheduler and CanvasTexture. Avoid direct third-party live embeds and new WebGL contexts.
4. **Tests (future):** same-seed two-run exact shot order; 3 provenance/copyright/fiction flags; 3 meaningful transitions; one real FrizzleQuestion; no duplicate audio/render loops; no accidental source-personal-data export.
5. **Visible gate:** side-by-side baseline H13 vs H13 + semantic-context sequence, with same duration, same Card/quote/audio source. Judge: narrative legibility, originality, visual composition, source distinction, replay consistency and player curiosity.

## Measures that matter
- Independent critic can explain why every neighbor exists. 0 untyped causal associations.
- At each source/fiction beat, viewers can correctly identify status and return to the authentic source.
- At least 1 meaningful late recontextualization of an earlier motif.
- Exact same seed reproduces shot order and content/source selection.
- No increase in runtime owners. Frame-time/fps left UNKNOWN until target-device test.
- Rights checked per actual image/font/film/media, not blanket per domain.
- Contrast and read time are compositional requirements; strobing is not a design objective.

## Integration destinations only after acceptance
Curator data: references/metadata; existing QuotePool provenance + rights.
H13/H14: visual shot grammar, font/typography, transitions, music visualization.
Billboard Media Residency: texture face, 3D context, host timeline.
KFB Audio: soundtrack/voice mix and ducking.
KFB Cards/Almanac/World: only approved existing IDs and source-linked artifacts.
Research Atlas: documentary links and noncausal conceptual neighbors.
