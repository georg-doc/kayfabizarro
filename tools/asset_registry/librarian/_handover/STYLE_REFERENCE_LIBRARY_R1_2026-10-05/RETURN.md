# RETURN · KFB Style Reference Library R1 preparation

Status: **R1 SITE PACKET READY · NOT IMPLEMENTED / NOT PUBLISHED**  
Date: 2026-10-05  
Owner: **KFB Asset Registry / Asset Librarian**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/style-reference-library-r1-surface-2026-10-05`  
Draft PR: **#359**  
Stacked base: `chatgpt-web/surface-consolidation-2026-10-04@74ac0eea2b65872ccab3fb454d89e5d1ac5cc97a`

Verified execution head before this Return write:
`8e0ca606cd2e2e8e1620dad86f5de6935131db4c`

## Result

Style Reference Library is prepared as a ToolBox-visible specialist capability that **reuses the existing Asset Librarian Site**, not as a second Site/Registry.

Product semantics:
`Find → Inspect → Collect → Use`

Shared with Asset Librarian:
- Browse/search;
- Inspector;
- Saved/Reference Sets;
- Intake;
- provenance/rights;
- candidate handoff;
- shared picker semantics.

New reference-specific layer:
- official/public URL intake;
- private PDF/photo-compatible source model;
- Reference Cards;
- Reference Sets;
- `kfb.style-reference/1`;
- `kfb.style-reference-pack/1`;
- exact donor/source isolation proof;
- curated Reference ↔ production/procedural Asset links.

## ToolBox routing

Current ToolBox remains:
`https://kfb-toolbox.frizzlebob.chatgpt.site`

Prepared ToolBox entry:
**Style Reference Library**  
Owner: **Asset Librarian**  
Status: **R1 SITE PACKET READY**  
Deep-link: **not assigned until implementation**

Existing Asset Librarian remains the only target specialist Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

No second productive Site was created.

## Etherington R1 seed

Initial seed:
**13 official creator-hosted tutorial URLs**

Includes:
- Clouds;
- Smoke Effects;
- Small Explosions;
- Impact Debris / Destruction;
- Composition;
- Spacing in Composition;
- Conversations;
- Perspective Boxes;
- Drawing in 3D;
- Rock Formations;
- Tree Bark;
- Tree Roots;
- Rock Textures.

Canonical collection:
`https://theetheringtonbrothers.blogspot.com/p/every-how-to-think-when-you-draw.html`

Policy:
- `OFFICIAL_CREATOR_SOURCE` preferred;
- Georg-reported direct permission context retained as `USER_REPORTED_DIRECT_PERMISSION`;
- Pinterest/reposts = `DISCOVERY_ONLY`;
- URL verification does not equal visual inspection;
- all seed items start with `sourceInspectedInIsolation=false`;
- no remote source graphics are mirrored into GitHub.

## Asset ↔ Reference seam

The Site packet permits curated relationships:
- `STYLE_REFERENCE`
- `CONSTRUCTION_REFERENCE`
- `MATERIAL_REFERENCE`
- `PRESENTATION_REFERENCE`

This layer may link references to:
- 2D/3D assets;
- procedural assets/presets;
- Clay/material donors;
- world/environment assets;
- VFX/presentation donors.

It does **not** change canonical mechanical asset facts, rig facts, dimensions, dependencies, hashes or runtime suitability.

## Tests

Preparation validation:
**15/15 PASS**

See:
`TEST_REPORT.md`

No Site/browser/runtime/deployment PASS is claimed.

## Changed files

1. `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json`
2. `skills/chat/START_HERE.md`
3. `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/surface-config/CURRENT_BOARD.json`
4. `tools/KFB-ToolBox/CHANGELOG.md`
5. `tools/KFB-ToolBox/START_HERE.md`
6. `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json`
7. `tools/asset_registry/librarian/CHANGELOG.md`
8. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/START_HERE.md`
9. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/SITE_IMPLEMENTATION_PACKET.json`
10. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/ETHERINGTON_OFFICIAL_SEED_01.json`
11. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/TEST_REPORT.md`
12. this `RETURN.md`

## Hub / Site state

Hub data source is updated on this branch to show:
**Style Reference Library · P1 · BUILD R1**

The published Production Hub/ToolBox/Asset Librarian Sites were **not** updated in this planning slice.

Reserved optional downstream formal mirror:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/style-reference-library/`

Status:
**NOT DEPLOYED**

Private/reference imagery must not be published there.

## Unresolved / implementation work

R1 still must implement inside the existing Asset Librarian Site:
- URL resolver + real preview;
- Reference Card persistence;
- Reference Set persistence;
- Reference ↔ Asset UI;
- export/import;
- isolation-proof state;
- regression tests;
- exact Site update/publication.

Private PDF/photo intake may follow URL-first as R1.1 if needed; the schema is already prepared for it.

## Exactly one next gate

**BUILD STYLE REFERENCES R1 IN THE EXISTING ASSET LIBRARIAN SITE.**

The implementing Sites-capable executor reads:
`START_HERE.md`
and
`SITE_IMPLEMENTATION_PACKET.json`

then updates the existing Asset Librarian Site in place.

No merge. No Live promotion. No second Site.


---

## Implementation checkpoint · 2026-10-06 · pre-deployment

Status: **R1 ENGINEERING QA GREEN · PUBLISH PENDING**

The R1 implementation is now pushed to the existing Asset Librarian Sites source:

- Site project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- source commit: `492e01d02f5d93d49d9dd7caecbbf7dedff26ea9`
- target deep-link: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`
- separate Site created: **NO**

Implemented:
- Style References mode beside Assets, Motions, Saved Sets and Intake;
- 13 official Etherington seed sources with creator-hosted previews;
- URL-first intake with honest `DISCOVERY_ONLY` fallback for unverified URLs;
- Reference Cards/Sets, search, filters, notes and construction principles;
- source-isolation gate;
- curated Reference ↔ Asset candidate relationships;
- `kfb.style-reference-pack/1` export and reload persistence;
- restored visible 3D gallery previews;
- whole-card Inspector opening, image-overlay add button and removed Inspect row;
- redesigned five-icon mobile navigation.

Independent engineering gate:
- Tester: **PASS**
- Critic findings: **resolved and retested**
- Guard: **GO**

See the appended implementation section in `TEST_REPORT.md`.

The next gate is exact in-place Site deployment followed by ToolBox deep-link update and visible verification. No merge and no Live branch promotion are authorized.


## Final publication return · 2026-10-06

Status: **R1 PUBLISHED IN PLACE · TOOLBOX ROUTE LIVE**

Asset Librarian:
- project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- source: `492e01d02f5d93d49d9dd7caecbbf7dedff26ea9`
- version: `appgprj_6ac1afef08148191b62b95f184bf845e~appgver_e031f40ea0e48191992aa6217df5afaf`
- deployment: `appgdep_6ac508ef180081919d081ccea5fcab65`
- deep-link: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

KFB ToolBox:
- project: `appgprj_6ac2ba44282881919d1a49287a32054e`
- source: `f3f7c0d31c4c3afec9badc0526041e689935b7ec`
- version: `appgprj_6ac2ba44282881919d1a49287a32054e~appgver_271ece50c5d48191b7e7bffcfe9ff16a`
- deployment: `appgdep_6ac50a874c888191902109ddbbf8899a`
- URL: `https://kfb-toolbox.frizzlebob.chatgpt.site`

ToolBox now contains one visible **Style Reference Library** card owned by **Asset Librarian** and routes to the exact Asset Librarian deep-link. Both existing owner-only audiences were preserved.

Exactly one next gate: **Georg review of the published R1 surface.**

No merge. No Live branch promotion. No second Site.


## Claude Design bridge · 2026-10-06

Status: **PORTABLE REFERENCE-PACK BRIDGE READY**

Claude Design does not need access to the private Asset Librarian Site.

Canonical transport:
`Private Asset Librarian → curated Reference Set → portable Design Job Packet → public GitHub → Claude Design`

Prepared bridge contract:
`CLAUDE_DESIGN_REFERENCE_BRIDGE_2026-10-06.md`

Prepared working example:
`tools/asset_registry/librarian/reference-packs/claude-design/kfb-clouds-01/`

The Clouds job contains:
- `PACK.json` using `kfb.style-reference-pack/1`;
- `START_HERE.md` for Claude Design;
- 3 official Etherington references: Clouds, Smoke Effects and Spacing in Composition;
- exact source-isolation requirement;
- KFB clay/cartoon translation target;
- no embedded remote image binaries.

Bridge validation: **8/8 PASS**.

Private references remain metadata/opaque locator only and require the actual private crop/page to be attached directly to the Claude Design job. They are not published to GitHub.

Recommended next product improvement:
**add an “Export for Claude Design” action to Reference Sets that emits synchronized PACK.json + START_HERE.md.**

The Site itself should not receive GitHub write credentials. An authenticated ChatGPT Web/Work workflow may persist selected portable packs to GitHub when desired.

No Site deployment changed in this bridge checkpoint. No merge. No Live promotion.


## Etherington design-first source expansion · 2026-10-06

Status: **ENVIRONMENT + COMIC/VFX DATA READY · SITE UNCHANGED**

Verified data/evidence head before this Return update:
`fd1b9ac6889800e4718a2766caaecbe0abd30a5f`

Added:
- `ETHERINGTON_OFFICIAL_SEED_02_ENVIRONMENT.json` · **17** new official sources;
- `ETHERINGTON_OFFICIAL_SEED_03_COMIC_VFX.json` · **13** new official sources;
- `ETHERINGTON_DESIGN_FIRST_ENVIRONMENT_COMIC_VFX_2026-10-06.md` · design-first routing and recommended small subsets.

Combined curated Etherington inventory:
**43 unique official creator-hosted URLs** across Seeds 01–03.

Environment focus:
- water / reflections;
- mountains / caves / sand / lava;
- forests / overgrown vegetation / fields of grass / mushrooms;
- game buildings / junk houses / pod houses / brickwork / cityscapes;
- foreground / midground / background;
- pavements / urban surface language.

Comic/VFX focus:
- lightning/electricity;
- breaking glass;
- motion lines;
- pouring liquid;
- silhouette thumbnails;
- comic covers / contrast / establishing shots;
- car chases;
- shatter technique;
- battle damage;
- small/medium/large shape hierarchy;
- small flames.

Validation:
**12/12 PASS**
- 43/43 unique IDs;
- 43/43 unique URLs;
- all URLs use the official Etherington blog domain;
- all new records remain `sourceInspectedInIsolation=false`;
- all new visual-analysis states remain `PENDING`;
- all new design mappings remain `UNMAPPED_BY_DESIGN`.

Design-use rule:
Do not send the whole corpus into one Claude Design pass. Select **3–6 references per concrete design problem**, open the exact original sources in isolation, then derive KFB-specific construction rules.

Recommended next design subsets are documented for:
- KFB Environment mass / living world;
- KFB destruction / impact grammar;
- KFB procedural/world clouds (existing prepared pack).

No Site source, deployment, ToolBox route, Hub or runtime changed in this data slice.
No remote image binaries were mirrored into GitHub.
No merge. No Live promotion.

Exactly one next gate:
**FIRST_CLAUDE_DESIGN_JOB_FROM_CURATED_3_TO_6_REFERENCE_SUBSET**.


## Claude Design Environment + Comic/VFX jobs · 2026-10-06

Status: **GITHUB JOB PACKETS READY**

Claude Design can now work without private Asset Librarian Site access.

Umbrella brief:
`BRIEF_CLAUDE_DESIGN_ENVIRONMENT_COMIC_VFX_01_2026-10-06.md`

Prepared Job 1:
`tools/asset_registry/librarian/reference-packs/claude-design/kfb-destruction-impact-01/`

Contents:
- `PACK.json` · 6 official Etherington references;
- `START_HERE.md` · source-isolation + KFB design brief;
- existing Seed World Mech Destruction POC is pinned as functional mechanics donor only;
- target output = KFB Minigun/Rocket/breach/collapse/debris/smoke visual grammar.

Prepared Job 2:
`tools/asset_registry/librarian/reference-packs/claude-design/kfb-environment-mass-01/`

Contents:
- `PACK.json` · 6 official Etherington references;
- `START_HERE.md` · source-isolation + KFB design brief;
- current Open World integration remains protected/read-only;
- target output = terrain/forest/overgrowth/depth/rocks/roots grammar + Life-Tree/island-root rule.

Validation:
**12/12 PASS**

Run order:
1. Destruction / Impact VFX first;
2. Environment Mass / Living World second or separate session.

Claude Design may return an editable project/export instead of writing GitHub. A KFB integration chat can persist the returned output afterwards.

No Site/ToolBox/Hub/runtime/deployment change. No merge. No Live promotion.

Exactly one next gate:
**CLAUDE_DESIGN_JOB_01_DESTRUCTION_IMPACT**.


## Claude Design pixel-transport recovery · 2026-10-06

Status: **JOB 1 TRANSPORT REPAIRED · CLAUDE SOURCE INSPECTION NEXT**

Claude Design correctly reported that it could:
- read the GitHub brief/pack;
- open all six canonical Etherington blog pages;
- resolve their remote image links;

but could **not inspect the actual pixels** through its cross-domain image tool. It therefore correctly left all six `sourceInspectedInIsolation=false`.

The Job-1 packet is now repaired without exposing the private Asset Librarian or mirroring copyrighted images into GitHub.

### New visual transport per reference

Every one of the six Job-1 references now contains:

- canonical `canonicalPageUrl` on the Etherington blog;
- `visualTransport.officialCreatorMirrorPage` on the official **EtheringtonBrothers DeviantArt account**;
- `visualTransport.directVisualUrl` for direct pixel inspection;
- explicit fallback order;
- warning that direct image URLs may be tokenized/ephemeral;
- `inspectionRequiredByClaudeDesign=true`.

Transport alone does **not** promote inspection state.

### Functional donor correction

Claude Design also correctly reported that the destruction donor path did not exist at the Style-Reference commit.

The packet now pins the actual immutable donor Return at:

`97c891c006a65a2d8ebba17bfbe7baaa4384edf0`

The donor remains functional-mechanics evidence only; no runtime write is authorized.

### Validation

**10/10 PASS**

All six:
- retain canonical official blog identity;
- have official creator mirror pages;
- have direct visual URLs;
- remain `sourceInspectedInIsolation=false`.

### Next execution rule

Claude Design should now:

1. use the official creator mirror page;
2. if necessary open its direct visual URL;
3. only after genuinely seeing pixels create OBSERVED facts;
4. if that still fails, ask Georg for **one exact official combined visual per reference (maximum six files)**.

Do not do another broad web/image search and do not use Google/Pinterest substitutes.

No Site, ToolBox, Hub, Open World or Combat runtime changed.

Exactly one next gate:
**CLAUDE_DESIGN_JOB_01_SOURCE_ISOLATION_USING_OFFICIAL_CREATOR_MIRRORS**.


## Graphic FX / Comic Language source expansion · 2026-10-06

Status: **SOURCE CURATION READY · CLAUDE DESIGN DEFERRED**

Current executor:
**ChatGPT Web Chat**

This pass continues source collection; it is not a Claude Design task yet.

Added:
- `ETHERINGTON_OFFICIAL_SEED_04_GRAPHIC_FX_COMIC_LANGUAGE.json` · **10** new official Etherington sources;
- `GRAPHIC_FX_COMIC_LANGUAGE_SOURCE_ROUTING_2026-10-06.md` · semantic + executor routing;
- `SUPPLEMENTARY_COMIC_LANGUAGE_SOURCES_01.json` · **5** professional/academic supplementary sources.

Combined Etherington inventory:
**53 unique official URLs**.

Semantic placement:
- **Sound Effects / Sound Words** → Comic/VFX → Graphic FX;
- **Speech Bubbles / Caption Boxes** → Dialogue Carriers;
- **Angry / Happy / Eye Direction / Eyebrows** → Reaction / Performance support;
- **Comic Sense / Script-to-Page / In-World Typography** → Lettering Integration.

Etherington-specific source gaps remain explicit:
- Emanata · no dedicated Etherington source located;
- Thought Bubbles · no dedicated Etherington source located;
- Reaction Symbols / Emphasis Marks · no dedicated Etherington symbolic-effects source located.

Supplementary coverage now exists:
- Thought Bubbles → Blambot + Comicraft;
- Emanata → Visual Language Lab + Comics Forum terminology;
- Reaction Symbols → Visual Language Lab.

These supplementary references remain clearly distinguished from Etherington sources.

Validation:
**15/15 PASS**.

Next work owner:
**ChatGPT Web Chat** continues source harvesting / taxonomy until one concrete visual-design problem is ready.

Claude Design starts only after selecting a bounded **3–6 reference** packet.

No Site/ToolBox/Hub/runtime/deployment change. No merge. No Live promotion.

Exactly one next gate:
**WEB_CHAT_CONTINUE_SOURCE_HARVEST_OR_SELECT_FIRST_GRAPHIC_FX_DESIGN_JOB**.


## Expanded Librarian import + Browser/Viewer R2 prep · 2026-10-06

Status: **WORK IMPORT READY · VIEWER R2 DEFERRED AS SEPARATE DESIGN SLICE**

Georg requested that the newly curated Environment, Comic/VFX, Graphic FX, Bubble, Reaction and Emanata-related sources also become available in the existing Asset Librarian.

Prepared Work brief:
`BRIEF_WORK_IMPORT_EXPANDED_STYLE_REFERENCE_DATA_2026-10-06.md`

Inputs:
- Etherington Seeds 01–04 = **53** unique official sources;
- supplementary comic-language pool = **5** sources;
- expected built-in corpus = **58** records;
- existing browser-local user cards/sets must survive unchanged.

Added KFB semantic target map:
`GRAPHIC_FX_EMANATA_TARGET_TAXONOMY_2026-10-06.json`

It reuses the existing Resident Affect/Emanata proposal rather than inventing a second vocabulary. Current proposal slots:
`question · exclamation · sweat-drop · tear · anger-tick · heart · sparkle · gloom-cloud`.

### Current UI finding
Georg's screenshot confirms the Style Reference view works but is not yet an efficient daily browser/viewer: filters and intake dominate the first viewport, a raw Blogger image URL degrades into a large discovery-only card, the right Inspector shows a generic URL placeholder, the hero heading pushes actual browsing below the fold, and visual inspection is secondary to metadata/chrome.

This is recorded separately in:
`STYLE_REFERENCE_BROWSER_VIEWER_R2_UX_FINDINGS_2026-10-06.md`

### Future R2 owner sequence
1. **ChatGPT Work/WSA** · export the exact current private Site UI/source/screenshot packet;
2. **Claude Design** · redesign Browser/Viewer from the portable GitHub packet;
3. **ChatGPT Work/WSA** · integrate accepted R2 into the same existing Asset Librarian Site.

Do not ask Claude Design to access the private Site directly.

Validation:
**10/10 PASS**.

No Site/runtime/deployment change in this preparation checkpoint. No second Site. No merge / Live promotion.

Exactly one next gate:
**WORK_IMPORT_EXPANDED_STYLE_REFERENCE_DATA_IN_EXISTING_LIBRARIAN**.


---

## Expanded Style Reference corpus import · 2026-10-06 · pre-deployment checkpoint

Status: **58-BUILT-IN IMPORT QA GREEN · SITE VERSION 3 PENDING**

Existing Site only:
- project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- currently published base version: **2**
- exact base source: `492e01d02f5d93d49d9dd7caecbbf7dedff26ea9`
- deep-link retained: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`
- separate Site created: **NO**

Imported built-in corpus:
- Etherington Seed 01: **13**
- Environment Seed 02: **17**
- Comic/VFX Seed 03: **13**
- Graphic FX / Comic Language Seed 04: **10**
- Supplementary Comic Language Pool: **5**
- total built-ins: **58**
- unique stable IDs: **58**

Provenance counts:
- `OFFICIAL_CREATOR_SOURCE`: **53**
- `AUTHORITATIVE_PROFESSIONAL_LETTERING_SOURCE`: **1**
- `AUTHORITATIVE_ACADEMIC_VISUAL_LANGUAGE_SOURCE`: **1**
- `ACADEMIC_TERMINOLOGY_SOURCE`: **1**
- `PROFESSIONAL_COMMERCIAL_LETTERING_REFERENCE`: **2**

Data behavior:
- built-ins refresh separately from browser-local records;
- local Notes, Principles, added tags, asset relations, inspection state, Cards and Sets are preserved;
- saved built-ins merge by stable ID;
- local discovery candidates remain separate and are never silently deleted;
- a deterministic discovery→curated match is offered without replacing the discovery card;
- all built-ins remain `sourceInspectedInIsolation=false` unless a local user state already records real inspection.

Search/metadata:
- Graphic FX / Sound Words
- Dialogue Carriers
- Reaction / Performance
- Emanata
- Lettering Integration
- Emanata targets: `question · exclamation · sweat-drop · tear · anger-tick · heart · sparkle · gloom-cloud`

Local verification:
- PASS · 58 unique built-ins
- PASS · 59 total when one existing discovery card is present
- PASS · two existing local cards and two-item Reference Set survive reload
- PASS · local Notes, Principles and custom tags survive curated refresh
- PASS · all five source-class counts
- PASS · five Comic Language lanes and eight Emanata targets searchable
- PASS · known expanded URL resolves as curated, not `DISCOVERY_ONLY`
- PASS · `kfb.style-reference-pack/1`, source-isolation gate, relation and reload persistence
- PASS · Assets, Motions, Saved Sets and Intake regressions
- PASS · real 3D gallery previews, full-card Inspector and overlay add control
- PASS · JavaScript syntax and diff validation
- browser page errors: **0**

Protected boundary:
- no Viewer/Browser redesign;
- no new Registry;
- no remote image mirroring;
- no localStorage clearing or destructive migration;
- no Open World/Resident/ChatterBox runtime write;
- no merge or Live promotion.

Exactly one next gate remains:
**publish this exact QA-green import to the existing private Asset Librarian and verify version/deployment.**


## Expanded corpus publication return · 2026-10-06

Status: **58 BUILT-INS PUBLISHED IN PLACE · VERSION 3 SUCCEEDED**

Asset Librarian:
- project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- source: `e0a3faa63d7024dbd7bb01cb7815db69f876a230`
- version: `appgprj_6ac1afef08148191b62b95f184bf845e~appgver_bfa3d670e48c81919a20f2a34b19759c`
- deployment: `appgdep_6ac5495ef32081919292089df6996954`
- deployment status: **SUCCEEDED**
- live URL: `https://kfb-asset-librarian.frizzlebob.chatgpt.site`
- exact Style References deep-link: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`
- audience: existing owner-only custom access preserved
- Site project count added: **0**

Published result:
- **58** unique built-in curated/supplementary records;
- **53** Etherington official creator sources;
- **5** supplementary professional/academic sources with distinct source classes;
- browser-local Cards, Sets, Notes, Principles, tags, relations and discovery candidates preserved;
- deterministic discovery→curated suggestion without deletion;
- five Graphic FX / Comic Language lanes searchable;
- eight KFB Emanata proposal targets searchable as metadata only;
- curated sources without a stored preview show a human-title/source fallback, not a raw encoded filename;
- no Viewer/Browser redesign included.

Verification:
- local browser import/persistence/provenance test: **PASS**
- full R1 + Assets/Motions/Saved Sets/Intake regression: **PASS**
- 3D gallery regression: **PASS**
- page errors: **0**
- exact published deep-link opened in the Codex Site browser for Georg review
- Sites source/version/deployment identity re-read and matched after publication

Protected boundary remains intact:
- no second Site;
- no new Registry;
- no remote image mirroring;
- no localStorage clearing;
- no runtime write;
- Draft PR remains unmerged;
- no Live promotion.

Exactly one next gate:
**STYLE_REFERENCE_BROWSER_VIEWER_R2_DESIGN_HANDOFF_PREP**


## Georg review · R1 Style Reference UX HUMAN FAIL · 2026-10-06

Status: **HUMAN FAIL · R2 BROWSER/VIEWER RECOVERY ACTIVE**

Georg reviewed the published 58-record Style Reference view and rejected the current UX as a usable reference browser/viewer.

Observed product failures:
- tutorial drawings are cropped and not inspectable at useful size;
- selected references still do not expose complete boards/images in the Inspector;
- Asset-style search/filter/card patterns were reused too literally for a visual-reference workflow;
- search/filter/intake chrome dominates the viewport;
- the actual reference image is not the primary object;
- the user cannot reliably judge what is inside the source without opening the original website.

This supersedes the previous passive “Viewer R2 later” status.

### R2 product direction

Retain:
- existing Asset Librarian Site;
- existing data model;
- 58 built-in curated/supplementary records;
- local Cards/Sets/Notes;
- source/provenance/isolation logic;
- Asset/Motion/Saved Set behavior.

Replace the Style References presentation with a dedicated visual-first browser/viewer:

**Browse collections → inspect complete boards → zoom → collect → compare/use**

Required R2 capabilities:
- large useful display of portrait/tall tutorial boards;
- full board/image visibility, not thumbnail crop;
- multi-board source navigation;
- fit width / fit page / 100% / zoom;
- next/previous reference;
- compact metadata/actions;
- Gallery / Viewer / optional Compare modes;
- intake moved behind a compact `+ Add reference` action;
- filters collapsed/chips/sidebar rather than occupying the first viewport.

### Execution route

R2A · **ChatGPT Work/WSA**
- export exact current private Site source relevant to Style References;
- export current desktop/mobile screenshots and state fixture;
- build a portable GitHub design handoff;
- no redesign.

R2B · **Claude Design**
- redesign Browser/Viewer from that portable GitHub packet;
- no private Site access required;
- no Site write.

R2C · **ChatGPT Work/WSA**
- integrate the accepted design into the same Site;
- run full regressions;
- no second Site.

Prepared briefs:
- `BRIEF_WORK_STYLE_REFERENCE_BROWSER_VIEWER_R2A_EXPORT_2026-10-06.md`
- `BRIEF_CLAUDE_DESIGN_STYLE_REFERENCE_BROWSER_VIEWER_R2_2026-10-06.md`

Exactly one next gate:
**R2A_EXPORT_CURRENT_SITE_SOURCE_AND_VISUALS_FOR_DESIGN**.

No merge. No Live promotion.


## Georg routing correction · R2 is Work-only · 2026-10-06

Status: **DIRECT WORK/WSA REPAIR READY**

Georg explicitly decided not to spend Claude Design tokens on the Style Reference Browser/Viewer UI repair.

The earlier route:

`Work export → Claude Design → Work integration`

is superseded.

Current route:

`ChatGPT Work/WSA → direct Browser/Viewer R2 repair → browser QA → update existing Site in place → Georg review`

Binding brief:
`BRIEF_WORK_STYLE_REFERENCE_BROWSER_VIEWER_R2_DIRECT_REPAIR_2026-10-06.md`

Superseded / do not run:
- `BRIEF_WORK_STYLE_REFERENCE_BROWSER_VIEWER_R2A_EXPORT_2026-10-06.md`
- `BRIEF_CLAUDE_DESIGN_STYLE_REFERENCE_BROWSER_VIEWER_R2_2026-10-06.md`

The target remains:
- same Asset Librarian Site;
- same 58 built-ins;
- same persistence/data contracts;
- same Paper/Dark/KFB family;
- visual-first complete-board inspection;
- multi-board navigation;
- fit/zoom;
- compact controls/metadata;
- optional Compare only if non-blocking.

Exactly one next gate:
**WORK_DIRECT_REPAIR_STYLE_REFERENCE_BROWSER_VIEWER_R2**.

No merge. No Live promotion. No second Site.


---

## Style Reference Browser / Viewer R2 · pre-deployment checkpoint · 2026-10-07

Status: **DIRECT WORK/WSA REPAIR QA GREEN · EXISTING SITE UPDATE PENDING**

Owner / boundary:
- repo: `georg-doc/kayfabizarro`
- branch: `planning/style-reference-library-r1-surface-2026-10-05`
- Draft PR: **#359**
- GitHub base head read before implementation: `5699f1372768dc6401afdae30b15c8b252a7755b`
- existing Site project only: `appgprj_6ac1afef08148191b62b95f184bf845e`
- current published base source: `e0a3faa63d7024dbd7bb01cb7815db69f876a230`
- no second Site; no merge; no Live promotion

Implemented locally in the existing Site source:
- dedicated three-zone Style Reference Gallery / Viewer / compact details workspace;
- actual tutorial board is the dominant object;
- presentation-only remote visual index for all **53 Etherington official sources**;
- **106 creator-hosted tutorial boards** linked without mirroring image binaries;
- multi-board navigation retains one canonical source identity;
- Fit width / Fit page / 100% / zoom in/out;
- previous/next reference and previous/next board;
- keyboard reference navigation and practical full-screen control;
- compact sticky search + Curated / Saved / Inspected quick filters;
- detailed filters collapsed by default;
- URL intake moved behind `+ Add reference` dialog;
- Add to Set and inspected state remain primary actions;
- notes, principles, relations and provenance remain available but visually secondary;
- mobile two-column gallery + full-screen board viewer;
- Paper/Dark/KFB language retained;
- Compare 2–4 deferred as non-blocking per brief.

Data / persistence:
- **58 unique built-ins retained**;
- 53 Etherington + 5 supplementary sources retained;
- existing local Cards, Sets, Notes, Principles, tags, relations, inspected state and discovery candidates keep the same storage keys and merge behavior;
- presentation visuals are not written into browser-local records and are not embedded in `kfb.style-reference-pack/1` exports;
- source isolation remains required before export.

Local browser verification:
- 58 unique built-ins: **PASS**
- 53 official sources with boards / 106 boards total: **PASS**
- one tall Clouds board shown completely: **PASS**
- Clouds Board 1 / Board 2 navigation: **PASS**
- Fit width / Fit page / 100% / zoom: **PASS**
- previous / next reference: **PASS**
- URL intake behind secondary action: **PASS**
- Cards / Sets / Notes / Principles after reload: **PASS**
- source-isolation export: **PASS**
- Assets / Motions / Saved Sets / Intake: **PASS**
- 3D gallery preview and whole-card inspector: **PASS**
- mobile gallery + full-screen viewer: **PASS**
- page errors: **0**

Evidence files in the Work output packet:
- `asset-librarian-style-viewer-r2-desktop.png`
- `asset-librarian-style-viewer-r2-mobile-gallery.png`
- `asset-librarian-style-viewer-r2-mobile-board.png`

Unresolved / deferred:
- lightweight Compare 2–4 References is deferred; it is explicitly non-blocking for the core Viewer repair.
- final published Site source/version/deployment identity is pending the next checkpoint.

Exactly one next gate:
**PUBLISH_AND_VERIFY_EXISTING_ASSET_LIBRARIAN_R2_IN_PLACE**


---

## Style Reference Browser / Viewer R2 · publication return · 2026-10-07

Status: **R2 PUBLISHED IN PLACE · VERSION 4 SUCCEEDED · GEORG REVIEW READY**

Owner / GitHub:
- repo: `georg-doc/kayfabizarro`
- branch: `planning/style-reference-library-r1-surface-2026-10-05`
- Draft PR: **#359**
- pre-publication checkpoint head: `12338237b67f8c7d644c2cb9c84efa4d95f6689e`
- Draft PR remains open and unmerged

Exact existing Site identity:
- project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- source: `3ea2eab909f266889c8eaa4e5624ddf5970b7d89`
- version number: **4**
- version: `appgprj_6ac1afef08148191b62b95f184bf845e~appgver_c47336c1293c819180272d3b7c6971a9`
- deployment: `appgdep_6ac5769bdae0819195ca516e9625d6ec`
- deployment status: **SUCCEEDED**
- live URL: `https://kfb-asset-librarian.frizzlebob.chatgpt.site`
- exact deep-link: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`
- audience: existing owner-only custom access preserved
- new Site created: **NO**

Changed Site files:
- `dist/app.js` · dedicated reference-mode shell and R2 API version;
- `dist/index.html` · compact browse controls, Gallery / Viewer / details zones, secondary intake dialog;
- `dist/styles.css` · desktop three-zone viewer and mobile full-screen viewer;
- `dist/style-references.js` · existing 58-record seed exported without changing its IDs;
- `dist/style-reference-browser.js` · R2 browse/view/zoom/board/persistence controller;
- `dist/style-reference-visuals.js` · presentation-only official remote visual index: 53 sources / 106 boards.

Published behavior:
- tutorial boards are visible completely in Fit page and inspectable at useful scale;
- multi-board sources expose each board separately;
- Fit width / Fit page / 100% / zoom and previous/next reference work;
- Gallery is the chooser; Viewer is the dominant inspection surface;
- compact search/quick filters; detailed filters collapsed;
- URL intake is behind `+ Add reference`;
- Add to Set and inspected state remain obvious;
- metadata, notes, principles, relations and provenance remain available but secondary;
- mobile uses a two-column gallery and full-screen reference viewer;
- Paper/Dark/KFB language retained.

Final verification against the exact source packaged for Version 4:
- 58 unique built-ins / 53 Etherington + 5 supplementary: **PASS**
- 53 official sources / 106 creator-hosted boards: **PASS**
- tall Clouds board shown completely: **PASS**
- board 1 / board 2 navigation: **PASS**
- fit / 100% / zoom / reference navigation: **PASS**
- Cards / Sets / Notes / Principles reload persistence: **PASS**
- source isolation and `kfb.style-reference-pack/1` export: **PASS**
- Assets / Motions / Saved Sets / Intake: **PASS**
- 3D previews and whole-card Inspector: **PASS**
- desktop + mobile browser QA: **PASS**
- page errors: **0**
- exact source/version/deployment re-read from Sites: **MATCH**

Evidence:
- before: Georg's R1 screenshots attached to the Work request;
- after desktop: `asset-librarian-style-viewer-r2-desktop.png`;
- after mobile gallery: `asset-librarian-style-viewer-r2-mobile-gallery.png`;
- after mobile complete board: `asset-librarian-style-viewer-r2-mobile-board.png`.

Deferred:
- Compare 2–4 References remains deferred; the binding brief marks it non-blocking and the core Viewer is complete.

Protected boundary:
- no second Site;
- no image binaries mirrored into GitHub;
- no localStorage clearing or destructive migration;
- no unrelated mode redesign;
- no merge;
- no Live promotion;
- no Claude Design round.

Exactly one next gate:
**GEORG_REVIEW_STYLE_REFERENCE_BROWSER_VIEWER_R2**

Human question:
> Can Georg now inspect the actual drawings comfortably inside the Librarian?


## Georg review · R2 HUMAN ACCEPTED · 2026-10-07

Status: **HUMAN ACCEPTED FOR CONTINUATION · USABLE, NOT OPTIMAL**

Georg reviewed the published Style Reference Browser / Viewer R2 and answered **YES** to the binding human question:

> Can Georg now inspect the actual drawings comfortably inside the Librarian?

This closes the R2 human gate.

Acceptance is intentionally qualified:
- the viewer is usable enough to continue;
- Georg explicitly notes that it is **not yet optimal**;
- Compare 2–4 remains deferred;
- future UI polish may continue opportunistically, but it is **not blocking** source curation, Reference Sets, Claude/consumer packs or other Asset Librarian work.

Accepted published Site identity:
- project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- source: `3ea2eab909f266889c8eaa4e5624ddf5970b7d89`
- version: **4**
- deployment: `appgdep_6ac5769bdae0819195ca516e9625d6ec`
- deep-link: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Protected boundary remains:
- no second Site;
- no merge;
- no Live promotion.

Exactly one next gate:
**RESUME_STYLE_REFERENCE_SOURCE_CURATION_AND_CONSUMER_PACKS**.


## Curated consumer packs · Sound Words / Bubble Grammar / Emanata · 2026-10-07

Status: **CURATION CONTINUES · THREE REUSABLE PACKS READY**

Current executor:
**ChatGPT Web Chat**

Added source mapping:
`EMANATA_SOURCE_MAPPING_01_2026-10-07.json`

The mapping ties authoritative visual-language morphology to the current KFB presentation-only semantic slots without changing Resident state ownership.

Prepared curated packets:

### KFB Sound Words / Graphic SFX 01
`tools/asset_registry/librarian/reference-packs/curated/kfb-sound-words-01/`

6 references spanning:
- Etherington Sound Effects;
- Comic Sense;
- Motion Lines;
- Small / Medium / Large;
- Impact Debris;
- Blambot lettering grammar.

### KFB Bubble / Caption Grammar 01
`tools/asset_registry/librarian/reference-packs/curated/kfb-bubble-grammar-01/`

5 references spanning:
- Etherington Speech Bubbles;
- Caption Boxes;
- Script → Page;
- Blambot professional balloon grammar;
- Comicraft Word and Thought Balloons.

### KFB Emanata / Reaction Symbols 01
`tools/asset_registry/librarian/reference-packs/curated/kfb-emanata-reaction-symbols-01/`

6 references spanning:
- Visual Language Lab Manga Morphology;
- Comics Forum Emanata terminology;
- Etherington Angry / Happy expressions;
- Eye Direction;
- Eyebrows.

All three packs:
- remain `sourceInspectedInIsolation=false`;
- require actual source isolation before visual claims;
- do not automatically start Claude Design;
- can later be routed to the correct consumer only when a concrete product problem exists.

Validation:
**10/10 PASS**.

No Site/runtime/deployment change.

Exactly one next gate:
**CONTINUE_REFERENCE_CURATION_OR_SELECT_ONE_CURATED_PACK_FOR_A_CONCRETE_CONSUMER**.


## Emanata visual morphology pool · 2026-10-07

Status: **CURATION CONTINUES · MORPHOLOGY SOURCE MAP READY**

Added:
`EMANATA_VISUAL_MORPHOLOGY_POOL_01_2026-10-07.json`

The pool captures **28** source-backed reaction/visual-language concepts and routes each to the appropriate presentation channel:

- primary Emanata;
- face-affix;
- EyeRig/eye channel;
- Graphic FX;
- background FX;
- whole-body/suppletion.

This prevents a future KFB implementation from treating every reaction device as the same kind of floating symbol.

Current eight semantic slots remain:
`question · exclamation · sweat-drop · tear · anger-tick · heart · sparkle · gloom-cloud`

Strongest expansion candidates:
`blush · breath · steam`

Related curated packs remain ready:
- `kfb-sound-words-01`
- `kfb-bubble-grammar-01`
- `kfb-emanata-reaction-symbols-01`

Validation:
**10/10 PASS**.

No Site/runtime/deployment change.

Exactly one next gate:
**CONTINUE_REFERENCE_CURATION_OR_SELECT_ONE_CURATED_PACK_FOR_A_CONCRETE_CONSUMER**.


## Etherington Seed 05 · Dialogue / Interaction · 2026-10-07

Status: **CURATION CONTINUES · 63-SOURCE REPO CORPUS READY**

Current executor:
**ChatGPT Web Chat**

Added:
`ETHERINGTON_OFFICIAL_SEED_05_DIALOGUE_INTERACTION.json`

Five official Etherington sources:
- Small Talk;
- Speech Patterns;
- Tics and Tells;
- Interrupt a Scene;
- Silence Is Golden.

These are classified under:
- Dialogue Rhythm;
- Character Voice;
- Nonverbal Behavior;
- Conversation Flow.

They are not VFX/Emanata references and are not Bubble-shape grammar.

Prepared consumer pack:
`tools/asset_registry/librarian/reference-packs/curated/kfb-dialogue-interaction-01/`

The pack contains six references, adding Speech Bubbles as presentation support while keeping ChatterBox as dialogue/content owner.

Repo curated corpus after Seed 05:
- **58** unique Etherington official sources;
- **5** supplementary professional/academic sources;
- **63** total curated records.

Current published Asset Librarian Version 4 remains at 58 built-ins. An incremental data-only Site sync is prepared in:
`BRIEF_WORK_IMPORT_SEED05_DIALOGUE_INTERACTION_2026-10-07.md`

This import must preserve the accepted R2 Viewer unchanged.

Validation:
**10/10 PASS**.

No Site/runtime/deployment change in this checkpoint.

Exactly one next gate:
**OPTIONAL_WORK_SYNC_SEED05_TO_ACCEPTED_LIBRARIAN_OR_CONTINUE_WEB_CHAT_CURATION**.


---

## Dialogue / Narration + NIE / Overworld curation · 2026-10-07

Status: **RESEARCH / AUTHORING PREP READY · SITE SYNC OPTIONAL · RUNTIME HOLD**

Verified evidence head before this Return checkpoint:
`99e7f614ab8763c51e37274f31c5520c2bd3e3f2`

### Delivered

Canonical new source seed:
- `ETHERINGTON_OFFICIAL_SEED_06_NARRATION_REACTION.json` · **6** new, non-duplicative official Etherington sources:
  - The 4th Wall
  - Failure
  - Excuses
  - The Group Dynamic
  - Local Colour
  - Memories

Current canonical source corpus:
- **64** Etherington official sources;
- **5** supplementary professional/academic sources;
- **69 total curated records**.

All 64 Etherington IDs and URLs are unique.

### Dialogue authoring integration

Prepared:
- `KFB_DIALOGUE_AUTHORING_RULES_ETHERINGTON_NIE_01_2026-10-07.md`
- `KFB_CHATTERBOX_AUTHORING_RULES_01.json`

The rules combine:
- Etherington Dialogue/Interaction sources;
- Narrative Intelligence Engine Writer's Room / dialogue grammar / South Park causality / character tools;
- historical KFB NIE→ChatterBox adapter principles;
- FrizzleBob KayfabeTips.

Core retained rules include:
- THEREFORE/BUT instead of AND THEN;
- SAID / MEANT / WANTED;
- every turn shifts knowledge/power/relationship/intention/possibility/tension/interpretation;
- interruption and repair reveal power;
- silence is a valid performance result;
- voice comes from worldview/sociolect rather than catchphrases;
- one concrete picture before abstraction;
- strange premise played straight;
- context budget: one bubble receives only the world its beat can pay for.

NIE remains authoring/upstream research, **not a runtime owner or required runtime dependency**.

### Historian / World-as-Toy donor audit

Prepared:
`KFB_HISTORIAN_WORLD_AS_TOY_NIE_OVERWORLD_DONOR_AUDIT_2026-10-07.md`

Recovered and classified:
- historical implemented `narrator-2d.js` Afterglow/caption donor;
- historical implemented `zone-story.js` narrator slot + NIE-content seam;
- historical OPEN “Erzähler als Figur” concept;
- historical explicit “Welt als Spielzeug” North Star;
- historical mob Eigenleben / purposeful activity / critter donors;
- historical NIE adapter role split;
- later Cartoon Studio narrator-as-observer donor.

Important correction:
historical implemented donors, historical OPEN concepts and current runtime truth remain separate.

### Curated consumer packs

Existing:
- `reference-packs/curated/kfb-dialogue-interaction-01/`

New:
- `reference-packs/curated/kfb-narration-reaction-01/`

The Narration/Reaction pack includes Caption Boxes by reference from canonical Seed 04 plus Seed 06 sources. Caption Boxes is **not duplicated** into Seed 06.

### Work/WSA planning

New combined Site-import brief:
`BRIEF_WORK_IMPORT_SEED05_06_DIALOGUE_NARRATION_2026-10-07.md`

If the accepted Asset Librarian Site is still Version 4 with 58 built-ins:
- import Seed 05 + Seed 06 together;
- add 11 records;
- expected final built-ins: **69**;
- preserve accepted R2 Viewer and all local Cards/Sets/Notes/Principles.

Updated:
`BRIEF_WORK_WSA_DIALOGUE_INTERACTION_HISTORIAN_CONSOLIDATION_2026-10-07.md`

The earlier Seed05-only import brief is superseded only when the Site is still at the last proven 58-record state. If an intermediate Site import has occurred, Work must inspect actual state and reconcile.

### Evidence

`DIALOGUE_NARRATION_CURATION_TEST_REPORT_2026-10-07.md`

Result:
**15/15 PASS**

Not claimed:
- visual inspection of every Etherington tutorial board;
- Seed05/06 Site import;
- current Open World event names;
- current player death/revival seam;
- current survival of historical Afterglow modules;
- Historian runtime implementation.

### Runtime boundary

No Open World / PR #348 write.
No ChatterBox runtime write.
No PR #357 product reactivation.
No second Site.
No Hub/router change.
No merge / Live promotion.

### Exactly one next gate

**Optional Work/WSA source sync of canonical Seeds 05 + 06 into the existing Asset Librarian R2 Site. Runtime Historian/ChatterBox consumption stays HOLD until exact Coworker intake + Architecture Freeze.**


---

## Dialogue / Narration authoring + Historian donor research · 2026-10-07

Status: **RESEARCH PREP COMPLETE · WSA PLAN CONSOLIDATED · SITE SYNC OPTIONAL**

Current verified research outputs:
- `ETHERINGTON_OFFICIAL_SEED_05_DIALOGUE_INTERACTION.json` · 5 official Etherington sources;
- `ETHERINGTON_OFFICIAL_SEED_06_NARRATION_REACTION.json` · 6 additional deduplicated official sources;
- `KFB_DIALOGUE_AUTHORING_RULES_ETHERINGTON_NIE_01_2026-10-07.md`;
- `KFB_CHATTERBOX_AUTHORING_RULES_01.json`;
- `KFB_HISTORIAN_WORLD_AS_TOY_NIE_OVERWORLD_DONOR_AUDIT_2026-10-07.md`;
- curated packs:
  - `reference-packs/curated/kfb-dialogue-interaction-01/`;
  - `reference-packs/curated/kfb-narration-reaction-01/`.

Research donors inspected:
- Etherington Dialogue/Interaction and Narration/Reaction tutorial pages/indexes;
- Narrative Intelligence Engine Writer's Room / South Park logic / dialogue grammar / character-development / style-compression sources in Dropbox;
- historical `KFB_ChatGPT_VoiceEngine_NIE+FrizzleBob.md`;
- historical Overworld `narrator-2d.js`, `zone-story.js`, `mob-ai.js`, Masterplan World-as-Toy / narrator-as-character concepts;
- Georg's current FrizzleBob KayfabeTips as compact authoring heuristics.

Key recovered Overworld findings:
- deterministic Afterglow narrator already existed historically;
- `zone-story.js` already supported a narrator speaker role with runtime/content separation and NIE as semantic upstream;
- Masterplan already contains an OPEN narrator-as-character concept: unanchored narrator box, graveyard/fog opening, voice → device → companion, dry/deadpan machine delivery, Meta-Closure rather than control explanation;
- "Die Welt als Spielzeug" is an explicit North Star: world speaks, breathes and reacts; immersion/POIs over combat depth;
- historical Mob Eigenleben and critter rules support purposeful activity and social consequence outside quest/combat progress.

Canonical authoring synthesis:
- Therefore/But;
- Yes-And during generation;
- people/wants before props;
- straight-face Kayfabe;
- concrete image before abstraction;
- SAID / MEANT / WANTED;
- adjacency pairs;
- interruption as characterization;
- silence as valid output;
- worldview/sociolect over catchphrases;
- context budget: a bubble gets only as much world as its beat can pay for.

Current repo curated corpus after Seeds 05 + 06:
**69 records total = 64 Etherington official + 5 supplementary professional/academic.**

Last proven published Asset Librarian R2 remains:
**Version 4 · 58 built-ins.**

For any new Site sync, use:
`BRIEF_WORK_IMPORT_SEED05_06_DIALOGUE_NARRATION_2026-10-07.md`

The earlier Seed-05-only import brief is superseded for new runs.

Runtime integration remains HOLD:
**exact Coworker/Open-World intake → Architecture Freeze → map current event/state seams → only then consume Historian/ChatterBox/Resident authoring contracts.**

No Open World runtime write.
No ChatterBox runtime write.
No second narrator/dialogue owner.
No Site deployment in this research checkpoint.
No Hub change.
No merge / Live promotion.

Exactly one next gate:
**OPTIONAL Work/WSA Asset Librarian 58→69 source sync; otherwise continue source/authoring curation while runtime consumption waits for Architecture Freeze.**


### Final research/evidence handoff · 2026-10-07

Verified evidence head before this Return write:
`766e9067e4c08687aea17e4701090d961c25c25a`

Validation:
**12/12 PASS**
- Seeds 01–06: 64/64 unique IDs;
- Seeds 01–06: 64/64 unique canonical URLs;
- Seed 06 overlap with Seeds 01–05: 0;
- Seed 05 count: 5;
- Seed 06 count: 6;
- authoring JSON schema valid;
- combined WSA import route: last proven Site 58 → expected 69;
- Seed-05-only brief superseded;
- canonical Historian donor audit present;
- duplicate audit removed.

Prepared Work/WSA route:
`BRIEF_WORK_WSA_DIALOGUE_INTERACTION_HISTORIAN_CONSOLIDATION_2026-10-07.md`

Prepared Site-sync route:
`BRIEF_WORK_IMPORT_SEED05_06_DIALOGUE_NARRATION_2026-10-07.md`

Unresolved by design:
- actual Asset Librarian Site still last proven at Version 4 / 58 built-ins;
- source visuals remain `sourceInspectedInIsolation=false` until actual board inspection;
- Historian persona/identity remains proposal;
- exact current Open World event/state seam waits for Coworker intake + Architecture Freeze.

One next gate:
**OPTIONAL Work/WSA source sync of Seeds 05 + 06 into the accepted Asset Librarian R2 Site; Open World consumption remains HOLD until Architecture Freeze.**


---

## Historian / Chronicler + Living-Toy expansion · 2026-10-07

Status: **RESEARCH / AUTHORING PREP COMPLETE · SITE-READY DELTA PREPARED · NO RUNTIME WRITE**

Georg decision:
- narrator role = **Historian**
- persona register = **Chronicler**
- working identity = **Historian / Chronicler**

New authoring contract:
`KFB_HISTORIAN_CHRONICLER_CONTRACT_01_2026-10-07.md`

New Living-Toy prep:
- `KFB_LIVING_TOY_EVENT_GRAMMAR_01_2026-10-07.md`
- `KFB_LIVING_TOY_EVENT_GRAMMAR_01_2026-10-07.json`
- `KFB_LIVING_TOY_ACTIVITY_POOL_01_2026-10-07.json`

Living-Toy event grammar:
- 13 scenario families;
- world behavior → Resident reaction → optional ChatterBox → rare Historian framing;
- one foreground text carrier by default;
- group witness selection instead of everyone speaking;
- silence remains valid;
- no historical event names promoted as current runtime API.

Activity pool:
- 30 candidate activities;
- includes work/repair, Fluff/resource flow, archive/card inspection, market/trade, social beats, performance, patrol/search, critter care, daily life, help/cleanup and graveyard witness behavior;
- `graveyard.keep-watch` is a specific donor for repeat death/revival witness logic;
- all activities remain proposal data until Architecture Freeze.

Site-ready persistence:
- `STYLE_REFERENCE_SITE_DELTA_DIALOGUE_NARRATION_2026-10-07.json`
- 11 idempotent upserts from Seeds 05 + 06;
- KFB research-derived Notes/Principles included;
- all source-inspection flags remain false;
- last proven Site = Version 4 / 58 built-ins;
- expected full post-import corpus = **69 built-ins**;
- existing accepted Asset Librarian Site/project must be updated in place.

Work/WSA routing updated:
- combined import brief consumes the Site delta payload;
- WSA consolidation brief includes Historian / Chronicler decision, 13 scenario families and 30-activity pool;
- Seed-05-only import remains superseded for new runs.

Validation:
**17/17 PASS**

No Site deployment occurred in this Web Chat because no Sites publisher is exposed here.
No Cloudflare substitute was created.
No Open World runtime write.
No ChatterBox runtime write.
No merge / Live promotion.

Exactly one next gate:
**Sites-capable Work/WSA may import the 11-record Site delta into the existing Asset Librarian; runtime consumption remains HOLD until exact Coworker intake + Architecture Freeze.**


## GitHub-live Style Reference data migration · 2026-10-07

Status: **ONE-TIME WORK MIGRATION READY**

Georg identified the remaining operational cost: every curated source update currently requires Work/Sites publication.

The Hub's proven live-data pattern is now adopted as the target for Style References.

Prepared:
- `STYLE_REFERENCE_LIVE_DATA_CONTRACT_2026-10-07.md`
- `BRIEF_WORK_STYLE_REFERENCE_LIVE_DATA_MIGRATION_2026-10-07.md`

Target architecture:
`Web Chat → main/tools/asset_registry/librarian/live/style-reference-live.json → refresh existing Site`

Stable Site shell owns behavior/viewer/local-state merging.
GitHub main JSON owns public/shareable curated Style Reference data.
A deployed local manifest remains fallback.

Current one-time Work migration must:
- reconcile current Site state;
- move current curated corpus to **69 built-ins**;
- create the live manifest on main;
- add the remote loader;
- preserve local Cards/Sets/Notes/Principles;
- prove one data-only main-JSON revision change appears after Site refresh with **no Site republish**.

Private PDFs/photos/scans and private storage locators remain excluded from the public live manifest.

After successful proof, routine public curated reference updates become **Web Chat GitHub-only**.

The previous Seed05+06 import-only brief is superseded for a new run while the Site remains at last-proven Version 4 / 58 built-ins.

Validation:
**8/8 PASS** contract/brief preparation.

Exactly one next gate:
**ONE_TIME_WORK_STYLE_REFERENCE_LIVE_DATA_MIGRATION**.

## 2026-10-07 · One-time GitHub-live data migration · COMPLETE

Status: **PUBLISHED IN PLACE · DATA-ONLY REFRESH PROVEN**

Executor: **ChatGPT Work/WSA**

### Existing Site retained

- URL: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`
- project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- source: `2003c9c3f06e8a3183bca84243904c7638455b2c`
- version: **6**
- version ID: `appgprj_6ac1afef08148191b62b95f184bf845e~appgver_9fe593b599e48191bdd09ef42596920d`
- deployment: `appgdep_6ac5cd25d34c8191aea4c5685168fc57`
- deployment status: **SUCCEEDED**
- access: existing owner-private/custom policy preserved

No second Site was created. No Viewer R2 redesign was made.

### Live manifest

- path on `main`: `tools/asset_registry/librarian/live/style-reference-live.json`
- schema: `kfb.style-reference-live/1`
- final revision: `2026-10-07.3`
- final `main` manifest commit: `c681608bcaa27bdc8e1d9ef0073fb5e13a0267e9`
- initial manifest commit: `f83e7217c9e84e8049c6d093fe949994f3b3bb24`
- corpus: **64 Etherington official + 5 supplementary = 69 built-ins**
- pre/post Site count: **58 → 69**
- visual coverage carried forward: **53 references / 106 boards**
- public boundary: no private PDFs/photos/scans, private storage locators, Dropbox paths or credentials

The Site resolves the current public `main` commit, loads the immutable raw manifest for that commit with `cache: no-store`, validates schema/identity/URLs, and keeps the exact raw-`main` URL as fallback. The deployed local revision `2026-10-07.2` remains the 69-record fail-closed fallback.

### Mandatory data-only proof

After Site Version 6 was deployed:

1. the published private Site loaded live revision `2026-10-07.2`;
2. only `main/tools/asset_registry/librarian/live/style-reference-live.json` changed;
3. no Site source, version or deployment was created between the two checks;
4. the same browser refreshed the same published Site and loaded revision `2026-10-07.3`;
5. the comparison from the initial manifest commit to the final proof commit reports exactly one changed file: the live manifest.

Result: **PASS · future public reference-data updates no longer require Work/Sites publication.**

### Browser-local state proof

The published-Site proof kept byte-identical localStorage payloads across the live-data refresh and verified the merged result for:

- a local user Card;
- Reference Set name, notes and two memberships;
- built-in reference Notes and Principles;
- custom tag;
- asset/reference relation;
- inspected state.

Result: **PASS · local Cards/Sets/Notes/Principles/Tags/Relations/Inspection State preserved.**

### Regressions

- Viewer R2 tall-board rendering: PASS
- multi-board navigation: PASS
- Fit width / Fit page / 100% / zoom: PASS
- Previous/Next Reference: PASS
- source-isolation export: PASS
- URL intake: PASS
- Assets: PASS
- Motions: PASS
- Saved Sets: PASS
- 3D previews: PASS
- mobile gallery/viewer: PASS
- GitHub unavailable → deployed 69-record fallback: PASS
- page errors: **0**

### Unresolved / non-blocking

- 16 of the 69 records are currently source-link-only and do not yet have curated board URLs. They remain usable through the exact source link and can receive board metadata through the new data-only path.

### Exactly one next gate

**WEB_CHAT_DATA_ONLY_STYLE_REFERENCE_UPDATES**
