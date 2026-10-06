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
