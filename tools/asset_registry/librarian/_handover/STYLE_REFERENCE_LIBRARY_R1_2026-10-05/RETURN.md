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
