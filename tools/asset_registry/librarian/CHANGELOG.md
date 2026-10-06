# Changelog · KFB Asset Librarian

## Etherington design-first Environment + Comic/VFX expansion · 2026-10-06

Status: **RESEARCH/DATA READY · 30 NEW OFFICIAL SOURCES · SITE UNCHANGED**

### Data
- Added `ETHERINGTON_OFFICIAL_SEED_02_ENVIRONMENT.json` with **17** official creator-hosted sources.
- Added `ETHERINGTON_OFFICIAL_SEED_03_COMIC_VFX.json` with **13** official creator-hosted sources.
- Combined with Seed 01, the curated Etherington inventory is now **43 unique official URLs**.

### Design routing
- Environment prioritizes terrain/world mass, vegetation, buildings, depth, water and surfaces.
- Comic/VFX prioritizes destruction, motion, elemental effects, action readability and graphic/framing references.
- Added `ETHERINGTON_DESIGN_FIRST_ENVIRONMENT_COMIC_VFX_2026-10-06.md` with small recommended 3–6-reference subsets for Claude Design rather than sending the whole corpus into one visual-analysis pass.

### Evidence
- **12/12 PASS** data validation.
- 0 duplicate IDs across all three seeds.
- 0 duplicate URLs across all three seeds.
- all new sources remain `sourceInspectedInIsolation=false`, `visualAnalysisStatus=PENDING`, `relationStatus=UNMAPPED_BY_DESIGN`.

### Boundary
No Asset Librarian Site source, ToolBox Site, deployment, Hub or runtime changed. No remote source images were mirrored into GitHub. This is additive research/data curation only.


## Style Reference Library R1 preparation · 2026-10-05

Status: **R1 SITE PACKET READY · EXISTING SITE OWNER RETAINED**

### Decision
- Add `Style References` as a mode of the existing Asset Librarian Site, not a new Registry/Site.
- Reuse Browse, Inspector, Saved Sets, Intake and provenance.
- Add URL-first reference intake plus schema-compatible private PDF/photo intake later.
- Add curated bidirectional `referenceIds` / `relatedAssetIds` links for production and procedural assets without changing canonical asset facts.
- Require exact source isolation before a consumer may claim a reference informed a design.

### Seed
- 13 official Etherington tutorial URLs are prepared as `URL_VERIFIED` candidates.
- Official creator source wins over Pinterest/reposts.
- Remote source images are not mirrored into GitHub/public exports.

### Prepared packet
- `_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/START_HERE.md`
- `_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/SITE_IMPLEMENTATION_PACKET.json`
- `_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/ETHERINGTON_OFFICIAL_SEED_01.json`

### Next
Build R1 in the existing Asset Librarian Site; then update that same Site in place and browser-verify the Etherington URL roundtrip.

## v1.6 Town Workbench · 2026-09-15

### Decision
- Add a KFB Town working view instead of creating a new asset database or semantic tagging system.
- Keep repository files and generated Registry facts authoritative; `Nature`, `Buildings`, `Space` and `Prop` remain UI/workbench groupings.
- Keep Animation Lab v2 as owner of final KayKit motion compatibility and attachment/runtime integration.
- Keep all Town outputs `candidate-only`.

### Implementation
- new `Town` production tab with Environment, KayKit Characters and Character Props lanes
- first-choice Nature ranking for KayKit Forest/Nature and Kenney Nature
- Buildings/Town and Space/Sci-fi working filters plus pack/source filtering
- repository-true Quaternius Space Kit handling (`scifi-ultimate-space-kit-quaternius`)
- Mystery Series prioritization and explicit `Rig_Small` / `Rig_Medium` / `Rig_Large` character filtering
- structural same-collection prop view in Town and character detail
- local Scene Plan with Environment + Character + Prop slots (`kfb.town-scene-candidate.v1`)
- direct local/shared KayKit motion selector in the selected character preview
- external source clip playback through the selected character's own Three.js mixer
- measured track-binding coverage; zero bindings fail closed
- v1.6 real-browser regression gate added without removing v1–v1.5 gates

### Tested result
Real Chrome 152 / WebGL 2, Live Registry:
- Town Nature view: 631 candidates; first page 18
- KayKit character view: 79 candidates; Mystery Series access including GothGirl PASS
- Buildings/Town filter: 1,003 candidates PASS
- Quaternius Space Kit view PASS
- GothGirl same-collection `GothGirl_Microphone` prop PASS
- 165 concrete local/shared motion preview choices exposed for GothGirl
- `Death_A` from local `Rig_Medium_General.glb`: **69 / 69 tracks bound and playback started**
- `kfb.town-scene-candidate.v1` remains candidate-only
- console errors: 0
- runtime exceptions: 0
- all prior browser regression gates v1 / v1.3 / v1.4 / v1.5 PASS

Browser run: `34914515885`  
Evidence artifact SHA256: `aac14624e0dc0b3f72a3616f514e29d3cceb5b0b681f14d827387fd68dcdce00`

### Preserved
- asset-file source truth and generated Registry ownership
- Live / Canonical Registry modes
- existing Selection + `kfb.asset-handoff.v1`
- Actors / Rigs / Motions / FX resource owners
- ToolBox owner readers for existing custom rigs
- Animation Lab v2 final compatibility ownership
- no Registry, asset, roster or consumer-runtime write path added

## v1.2 Core · 2026-09-12

### Decision
- Daily-use static site first; no LLM dependency.
- Reuse canonical Registry and tested Three.js browser.

### Implementation
- collection + review queue filters
- list/card result views
- exact identity/provenance
- dependency navigation
- richer rig/skeleton facts
- 3D controls and clip selector
- image and audio previews
- persistent local Selection Tray
- candidate-only consumer handoff retained
- dedicated WSA six-task acceptance gate

### Tested result
- existing v1 Chrome/WebGL regression PASS
- v1.2 T1–T6 acceptance PASS in Chrome 152 / WebGL 2
- 0 console errors / 0 runtime exceptions
- six task screenshots + machine-readable `result.json` uploaded by CI

### Preserved
- Registry/indexer owners
- consumer profiles and owner boundaries
- v1 browser WebGL regression test
- v1.1 LLM/OpenAI code, untouched and not required

## PD-POOL-R2 · public-domain provenance registration · 2026-09-27

Status: **TESTED CANDIDATE · NOT MERGED · NOT PUBLISHED**

### Decision
- Register only the four PD-POOL-R1 proven smoke assets through the existing Asset Registry/Librarian owner.
- Add `media/public_domain` as a normal Registry source root; do not create a second media index.
- Pass through only explicit persisted `.license.json` evidence. The Registry does not infer copyright/license status.
- Reuse the existing Librarian provenance detail panel and candidate-only handoff contract.

### Implementation
- Registry builder verifies tracked sidecar, required facts, allowed stored tier, exact local path, byte count and fresh SHA-256 before accepting a public-domain asset.
- Catalog records carry `license`, `rightsEvidence`, tags and explicit-sidecar provenance.
- Librarian detail exposes stored rights provenance, tier, external provider/source ID/page, check timestamp, payload SHA-256 and sidecar path.
- CLI/handoff preserves the same evidence.
- Existing Registry workflow now watches `media/public_domain/**`.

### Tested result
Dedicated R2 run `36288195716` / job `108532932188` on `8c8b907c3526956a90e5ddbe2d6174eab2ee16da`:
- 46/46 unit/regression tests PASS;
- generated Registry build + validator PASS;
- 4/4 public-domain registrations PASS;
- 4/4 CLI discoverability PASS;
- Chrome 153: 4/4 search, detail, image preview and visible provenance PASS;
- 0 console errors; 0 runtime exceptions.

Existing PR owner regressions also PASS:
- Asset Registry run `36288282662`;
- Asset Librarian Browser Smoke run `36288282599`, all v1/v1.3–v1.7 gates green.

Dedicated browser evidence artifact: `10921660721` (`pd-pool-r2-asset-librarian`), including four screenshots.

### Boundary
The permanent Cloudflare Librarian has **not** been updated by this candidate. Merge/publication remains a separate Georg-gated step. Bulk pool population remains blocked by the missing historical selected-hit manifest.



## Claude Design GitHub briefs · Environment + Comic/VFX · 2026-10-06

Status: **READY FOR CLAUDE DESIGN · GITHUB TRANSPORT ONLY**

### Jobs
- `reference-packs/claude-design/kfb-destruction-impact-01/` · 6 curated official Etherington references + functional Mech/Minigun/Rocket destruction donor context.
- `reference-packs/claude-design/kfb-environment-mass-01/` · 6 curated official Etherington references for terrain mass, forest clustering, overgrowth, depth, rocks and roots.

### Briefing
- `_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/BRIEF_CLAUDE_DESIGN_ENVIRONMENT_COMIC_VFX_01_2026-10-06.md`
- private Asset Librarian Site access is explicitly not required;
- both jobs require source isolation against the official URLs before design claims;
- both return design grammar/recipes only, not runtime integration.

### Evidence
- **12/12 PASS** packet/route validation.

### Boundary
No Site/ToolBox/Hub/runtime/deployment change. No merge. No Live promotion.


## Graphic FX / Comic Language source expansion · 2026-10-06

Status: **RESEARCH/DATA READY · CLAUDE DESIGN NOT STARTED**

### Executor routing
- **ChatGPT Web Chat** owns current source research, deduplication, taxonomy and GitHub persistence.
- **Claude Design** is deferred until a concrete 3–6-reference visual job is selected.
- **Work/WSA** is not needed unless a later Site batch-import/UI change is requested.
- **Blender MCP** is a later consumer only for approved 3D reaction/Emanata presentation.

### Etherington Seed 04
Added **10** official sources covering:
- Sound Effects / Sound Words;
- Speech Bubbles;
- Caption Boxes;
- Angry Expressions;
- Happy Expressions;
- Eye Direction;
- Eyebrows;
- Comic Sense;
- Script → Page lettering integration;
- In-World Typography.

Combined Etherington inventory: **53 unique official URLs** across Seeds 01–04.

### Explicit Etherington gaps
No dedicated official Etherington source was located in this pass for:
- Emanata;
- Thought Bubbles;
- dedicated Reaction Symbols / Emphasis Marks.

These gaps are not silently filled by facial-expression proxies.

### Supplementary authoritative pool
Added **5** external professional/academic sources:
- Blambot · Comic Book Grammar & Tradition;
- Visual Language Lab · Manga Morphology;
- Comics Forum · Emanata terminology;
- Comicraft · Word and Thought Balloons;
- Comicraft · Comic Book Lettering The Comicraft Way.

Thought Bubbles, Emanata and Reaction Symbols now have supplementary source coverage while remaining explicitly non-Etherington.

### Evidence
**15/15 PASS** validation.

### Boundary
No Site, ToolBox, Hub, runtime or deployment change. No Claude Design job started. No merge / Live promotion.


## Expanded Librarian import + Browser/Viewer R2 prep · 2026-10-06

Status: **IMPORT BRIEF READY · VIEWER R2 LATER**

### Data import
Prepared a Work/WSA import brief for the existing private Asset Librarian Site. Target built-in corpus after import:
- 53 Etherington references;
- 5 supplementary professional/academic comic-language sources;
- **58 built-in reference/source records total**;
- Georg's existing browser-local discovery cards/sets remain preserved.

### KFB Emanata alignment
Added `GRAPHIC_FX_EMANATA_TARGET_TAXONOMY_2026-10-06.json`, aligned to the current Resident Affect/Emanata proposal on main. Current semantic slots: question, exclamation, sweat-drop, tear, anger-tick, heart, sparkle, gloom-cloud. Presentation-only; not runtime truth.

### Viewer R2
Recorded Georg's current Style Reference screenshot findings and a later three-step route:
1. Work/WSA exports current private Site UI/source/screenshot packet;
2. Claude Design redesigns the Browser/Viewer from that portable packet;
3. Work/WSA integrates accepted R2 back into the same Site.

### Evidence
**10/10 PASS** preparation validation.

### Boundary
No Site deployment changed in this prep. No redesign was mixed into the data-import brief. No second Site. No merge / Live promotion.


## Style Reference Browser/Viewer R2 · Work-only routing correction · 2026-10-06

### Georg decision
Do **not** spend Claude Design tokens on the current Style Reference UI repair.

The failure is sufficiently specified for direct **ChatGPT Work/WSA** implementation.

### Current route
- Work/WSA directly repairs the existing Asset Librarian Style References view.
- Preserve current Paper/Dark language, data model, 58 built-ins, local Cards/Sets/Notes and all non-Style-Reference modes.
- Main product outcome: complete tutorial/reference boards must be comfortably inspectable inside the Librarian.
- Gallery becomes chooser; Viewer becomes the primary inspection surface.
- Intake/filter chrome is demoted.
- Multi-board navigation + fit/zoom are required.
- Compare is optional/deferable if it threatens the core viewer.

Binding brief:
`_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/BRIEF_WORK_STYLE_REFERENCE_BROWSER_VIEWER_R2_DIRECT_REPAIR_2026-10-06.md`

Earlier R2A export-only + Claude Design R2 briefs are **SUPERSEDED / DO NOT RUN**.

No Site change in this routing checkpoint.


## Style Reference Browser/Viewer R2 · Georg acceptance · 2026-10-07

Status: **HUMAN ACCEPTED FOR CONTINUATION · USABLE, NOT OPTIMAL**

Georg accepted the published R2 viewer for continued use.

Accepted:
- complete tutorial boards can now be inspected inside the Librarian;
- multi-board navigation, fit/zoom and compact browse controls are sufficient for current production use;
- the Style Reference workflow no longer blocks curation or consumer-pack work.

Still deferred / non-blocking:
- Compare 2–4;
- further Browser/Viewer polish.

Published accepted Site:
- source `3ea2eab909f266889c8eaa4e5624ddf5970b7d89`
- version **4**
- deployment `appgdep_6ac5769bdae0819195ca516e9625d6ec`

No second Site. No merge. No Live promotion.
