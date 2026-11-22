# KFB · Human Nature Book Processing Plant — Scenelet Concept R0

**Status:** PROPOSAL / SOURCE-RECON COMPLETE · NO IMPLEMENTATION · NO STAGE · NO HUMAN ACCEPTANCE  
**Date:** 2026-11-22  
**Bounded outcome:** Source-grounded creative/technical scenelet blueprint for presenting *Hilfe, ich bin ein Mensch!* as a readable physical book, destructible machine performance, and optional Cut&Play Card encounter.  
**Single receiving owner:** Existing KFB WorldBuilder / WB2 scenelet-placement and open-world runtime; existing Card/Deck Viewer owns PDF presentation and `media/kfb/index.json` owns deck data. Book-specific visuals are a proposed CONTENT/SCENELET, **not** a new World, Card, Audio or physics runtime owner.  
**Planning branch:** `planning/kfb-human-nature-book-processor-scenelet-r0-2026-11-22`  
**Stage:** NONE; concept-only, no public preview or route to register.  
**Protected state:** Island R4 STOP / NO MVP, no R5, no new geometry-authoring grant; no overwrite of existing book, deck, viewer, Card Builder, Ink, HUD, Sound or Style SSOT.

## 1. Source facts and provenance

### Book
- *Hilfe, ich bin ein Mensch!* by **Andreas von Westphalen and Georg von Westphalen**, Westend Verlag; published **2024-09-02**; publisher states **248 pages**, paperback, ISBN **9783864893759**. Publisher: https://westendverlag.de/Hilfe-ich-bin-ein-Mensch/1590
- Author's presentation: https://protopians.substack.com/p/hilfe-ich-bin-ein-mensch and https://protopians.substack.com/
- User states: book organized into **eight chapters**, and possesses complete print assets including foldout/cover artwork and a PDF of the book. Chapter-to-page mapping and exact physical fold/trim dimensions are **NOT VERIFIED** in checked repository sources; require source art inspection. Do not invent eight chapter headings.
- Never substitute a photographed book cover, reconstructed typography, or a rectangular wrap for the actual production print art. Front/spine/back/inside surfaces must preserve author art; page-edge geometry is separate.

### KFB deck sources — source-backed but identity requires confirmation
Canonical `media/kfb/index.json` currently includes:
- `help_i_am_a_human` — 56 cards, 15 PDF pages including cover; PDF `media/kfb/Help_I_Am_A_Human - ADD web ID.pdf`; semantic `media/kfb/Help_I_Am_A_Human_-_ADD_web.pdf.json`.
- `human_nature_uncut_hilfe_ich_bin_ein_mensch` — separate 56-card variant, different card names.
- `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` — related 36-card deck, not interchangeable with either 56-card pack.
- `registry/assets/v1/decks/help_i_am_a_human.json` has **56 entries but all inspected first entries have `mappingVerified: false` / `page: null`**. Until independently reconciled with source PDF / cardGrid, do NOT generate cropped cards or promise a stable deep link to a specific card. Safe full-PDF-page view permitted where source resolves.
- Existing PDF/Card presentation owner: `KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v5.dc.html` candidate; shared `deckviewer/kfb-corpus.js`; `skills/kfb-card-builder.js`, `skills/kfb-ink-canon.js`, `skills/kfb-card-format.js`. Preserve `deckId + cardNumber` when a real mapping is verified; no new renderer/DB.
- The 56-card deck is a **proposed** book-linked selection pending Georg/source confirmation; do not treat the related digital decks as proven exact print-book digest.

### Mechanical donor
- Adam Chernick, Codevember 2026 **06-orrery**, source https://github.com/acher249/codevember-2026/tree/main/06-orrery and public demo https://adamwebsite.com/codevember/06-orrery/
- Checked `06-orrery/README.md`, `train.ts`, `gears.ts`, root `LICENSE` / `package.json`. Mechanism: 26 interlinked gears in 13 meshed pairs; involute tooth outline, extruded teeth and spoke windows; proportional crank/shaft angles; optional Rapier breakup/reassembly. Repo marked MIT (retain copyright/license when copied); third-party constellation credits/licensing must be separately checked if used (not needed here).
- **Only MECHANISM is an approved research candidate.** The planetarium aesthetics, astronomy, night sky, labels and planetary content are not KFB product design. **Actual isolated visual/interactive donor proof: 0; integration: 0.** Open donor as a single source object, test interactions, screenshot it, then decide KEEP/ADAPT/REJECT by component. Source URL/compile is not design fidelity proof.
- Avoid importing Next.js/R3F/Rapier as a second owner merely to obtain gears. Prefer adapting minimal geometry/gear-ratio math into the existing receiving Three/WebGL stack after version/license/capability check. A fully simulated 26-gear train is optional, not mandatory for MVP.

### Historical referent
- The U.S. 2025 `Bartz v. Anthropic` ruling documents destructive scanning of purchased print books: bindings stripped, pages cut and scanned, originals discarded. See original order, and accounts at https://arstechnica.com/ai/2025/06/anthropic-destroyed-millions-of-print-books-to-build-its-ai-models/ and https://www.wipo.int/wipolex/en/text/600719 ; 2026 reporting calls the program Project Panama. Distinguish **verified destructive scanning**, **specific unproven claims about rare/antiquarian cultural objects**, **legal holding** and **KFB satire/philosophical thesis**. Do not claim rare antiquarian books were proven destroyed.
- Philosophical premise is AUTHORIAL SATIRE: reduction of humans to indexed parts may fail to grasp meaning/context. This is not a scientifically demonstrated theorem that all physical explanation is false.

## 2. Experience: autonomous readable micro-story

**Creative core:** An absurd machine disassembles a human-nature book to discover what a human is. It successfully extracts more data but gives increasingly impoverished or contradictory explanations. Player can recombine the relationships that were cut away.

The scenelet is discoverable during free roam, not a compulsory commerce funnel; supports passively watching, intervening, and revisiting. One distinct landmark with causal relation to nearby library/salvage/workshop/education context; exact world location is PROPOSED, not authorised geography. Do not place it as an unexplained object at arbitrary coordinates (R4 failure).

**Cycle / state graph** (proposed deterministic clock with optional player overrides):
1. `IDLE_DISPLAY`: physically credible closed book floats or rests in a suspended clamp, slow yaw limited so cover remains readable. Machine breathes through idle gears.
2. `OPEN_BOOK`: front cover hinges with attached true cover art; visible spine/hinge/fore-edge; two realistic opposing facing pages, no arbitrary four-page claim beyond actual print construction. Optional unfold into full outer cover spread (back + spine + front) then inner-facing panels when available in print data.
3. `DISPLAY_SPREAD`: original double-spread appears physically large in world. A gently bent, subdivided leaf ripples; a direct look/inspect mode flattens the target page and gives readable zoom/pan without forced camera takeover.
4. `FEED`: one leaf or copied/projected page slips between rollers, held in a source-identifiable frame. Spine-cutter + rollers/stamp all act with grounded mechanical causality, not random particles.
5. `SCAN_AND_CLASSIFY`: lens reads panels; optical guides follow text, balloon, gutter, characters; eight proposed sorting stations may follow actual verified chapter labels when source supplied.
6. `MISINTERPRET`: machine reassembles fragments into a literalist absurd conclusion. The contradictions arise from lost adjacency, dialogue, narrative time, closure and lived context; not generic jokes.
7. `RESCUE_OR_RECOMPOSE`: player can interrupt one part, keep a verified Card, reconnect two panels, or pull the crank backwards. Optional visual consequence in the next cycle.
8. `RESET`: pieces return; source book never permanently vanishes. Player history/progression event flows through existing KFB collection/Almanac owner only.

**Interaction modes:**
- `WATCH`: observe one full autonomous loop from distance.
- `INSPECT`: focus a book surface, zoom/rotate/read at readable contrast; input remains compatible with walk/drive UI.
- `INTERVENE`: pull the crank, stop/counter-rotate a wheel, rescue the active Card, reorder two selected source-backed fragments.
- `LEAVE`: always safe to walk/drive away; reset and persistence through existing world/quest owners.
- **No forced lore lecture, mission lock, store gate, or permanent loss of source art.**

## 3. Art construction contract: a book, not a box

1. **SOURCE-FIRST ASSET INTAKE:** from exact print-ready cover, page PDF and fold design establish front/back/spine/inside/bleed/trim/hinges, material/surface IDs, print-order, right/left pages, page thickness; report missing surfaces instead of inventing art.
2. **CLOSED ASSET:** true physical proportions; modeled rounded corner radii and bevel on front/back board/cover, distinct spine curve, fore-edge page thickness with subtle stacked leaf lines, head/tail edges, slight cover overhang. Verify at front/side/back/three-quarter. Don't use one box textured across 6 sides.
3. **OPEN ASSET:** a separate 3D rig for hinge, cover bend and selected page sheets. Page count ≠ individual mesh count. Keep a lightweight block for unturned leaves; 2–4 source-authentic textured spreads and a handful of animated loose leaves at a time.
4. **PAPER MOTION:** small amplitude curved displacement (mesh bend bones or shader). Reading mode reduces deformation and stabilizes text. Pages wind-react in world but never jitter such that copy becomes unreadable.
5. **COVER PANORAMA:** if actual printer layout supports a flattenable full cover, animate full spread. A fabricated four-panel cover layout is forbidden until the provided print data proves it.
6. **FRAGMENT MODE:** panel and gutter extraction needs actual book PDF coordinates or user-authorized hand cutouts. No auto-cropping gutters from guesses; maintain source spread ID, panel ID, extraction order, authorship.
7. **STYLE:** exact book illustrations/textures remain book source; physical mount/machine follows current KFB claymation/quirky cartoon style. No generic brass steampunk skin forced over book identity; no generic UI chrome, paper-ink texture substitute, fake KFB branding. Brass/metal is a donor *mechanism* material option, not palette canon.
8. **PERFORMANCE:** reuse textures, mipmap readable pages, cap active leaves, instance appropriate repeated bolts, avoid one rigid body per page. Measure on target browser/hardware before any FPS claim.

## 4. Machine dramaturgy (proposed, not scripted canon)

- Machine has identifiable *functions*, not a huge prop blender: clamp, feed, strip, scan, cut, sort, assemble, reject.
- Show each causally: clamp visibly grips actual book → blade releases leaves → feed rollers take one real leaf → scanner maps visible motifs → sorter rotates to chapter chute → a machine-printed abstraction emerges.
- Sample satire directions (NOT final dialogue): `Love = glandular expenditure`; `Cooperation = suboptimal competition`; `Free will = user input accepted`. The audience should see the machine's specific data and why its interpretation is too narrow. Avoid repetitive "AI says X" commentary.
- Comic-specific mechanics: a page's **gutter** causes machine to lose the transition between events; a speech balloon without its speaker is reclassified as its own authority; two adjacent characters are scanned separately, erasing their interaction. Player reconnecting fragments is the game mechanic, not just a cutscene.
- 8 chapter stations are an attractive spatial structure **only if original chapter titles and source mapping are confirmed**. No factual chapter taxonomy improvised from generic psychology topics.
- Anthropic/Project Panama can be a discoverable secondary sign/label inside the satire; first encounter functions without proper-name exposition. Don't pretend its stated rare/antiquarian book impact has been independently demonstrated.

## 5. Existing-owner data seam

Proposed light event adapter, **not** a second state owner:
- `bookSourceId` (new content ref to exact licensed print art; asset registry owns truth)
- `spreadId`, `panelId` (only where hand-authored and source-verified)
- `deckId='help_i_am_a_human'` only after Georg confirms source relationship; `cardNumber` only after true card/page mapping
- `worldAnchorId` / `sceneletInstanceId` from current WB2; attach without modifying terrain/roads/camera/physics
- `interaction`: observed, inspected, rewound, rescuedCard, recomposed
- `existingAlmanacEvent` / `existingQuestReward`: consume and persist through existing owners; avoid duplicate reward payout.

Audio is a consumer: layered mechanical ticks, page flutter, blade, scan chirp, offbeat classification, restorative rewinding via existing KFB audio mix/ducking. Not a new AudioContext.

## 6. Narrow next prototype — single real source object first

**Gate S0: authoritative source and visual fidelity.**
1. Collect actual book cover print atlas + physical dimensions/spine width and **one** illustrative double-spread in the PDF (authorized source).
2. Isolated KFB 3D book: closed and open, 4 camera angles, readable cover and true front/spine/back. Show actual source art not substitute text.
3. Separately isolate *unaltered* Orrery original (gear/hand-crank/breakup) in browser, screenshot source; classify minimal mechanisms for adaptation and license attribution.
4. Build no KFB machinery/world placement before 2+3 source proofs; first compact candidate later should animate `CLOSED → OPEN → ONE SPREAD → ONE PAGE FED → RESET` around a single gear assembly.
5. Then in a separately authorised bounded implementation step attach **one** world encounter, **one** source-backed safely viewable page, **one** verified Card or full-page fallback, and **one** rescue event to existing KFB World/Deck/Almanac seams.

**Acceptance target for first visual candidate:** recognizable original book at first sight; correct spine/cover/art in 4 angles; smooth physically causal open; readable page; original isolated donor identified; no cut-off/cropping, no fake placeholder UI; input release + reversibility. Runtime acceptance requires playthrough/screenshots + actual perf measurement. These remain NOT TESTED.

**Explicit DEFER:** full 248-page browsing in 3D, procedural panel segmentation, eight full themed stations, true all-gear physics, eight-chapter narratives, NPC commentary, dynamic rewards, all 56 mapped cards, deep player-authored remix, machine-wide destruction VFX.

## 7. One next gate / routing

**Next gate: SOURCE-PROVEN BOOK ASSET + ORRERY ISOLATION, VISUAL-ONLY.** Georg's print-ready cover/fold spread and one representative double-page are the key missing author assets; the existing KFB World/Book asset recipient should inspect these before any geometry work. Runtime / world placement is not authorized by this concept.

**Project pointers:** `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`, `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`, `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`.

**Delivery:** No deployment, no Stage route, no KFB Hub card or main-router change for a proposal-only slice; keep existing router/Hub unchanged. No auto-merge or Live promotion.
