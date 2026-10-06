# WORK BRIEF · Extend existing Asset Librarian with Style References R1

Status: **READY FOR CHATGPT WORK/WSA**
Date: 2026-10-06

## Executor

**ChatGPT Work/WSA**

This is substantial Site engineering inside an existing productive owner. It is not a new-Site job and not PUBLISH_ONLY until engineering + QA are complete.

## Outcome

Extend the **existing private KFB Asset Librarian Site** with a production-usable **Style References** mode and expose that mode through the existing KFB ToolBox router.

Required product loop:

`Find → Inspect → Collect → Use`

for visual/design/construction references, while keeping production assets and style references as distinct truth layers.

## Owner

**KFB Asset Registry / Asset Librarian**

Repository:
`georg-doc/kayfabizarro`

Implementation contract:
Draft PR **#359**

Branch:
`planning/style-reference-library-r1-surface-2026-10-05`

Current verified planning head before this brief:
`fada68d31129879538ecec079a93f1a5de330d9a`

Existing Asset Librarian Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

Known existing Site project:
`appgprj_6ac1afef08148191b62b95f184bf845e`

Existing ToolBox:
`https://kfb-toolbox.frizzlebob.chatgpt.site`

Known ToolBox project:
`appgprj_6ac2ba44282881919d1a49287a32054e`

**UPDATE EXISTING SITE ONLY. DO NOT CREATE A SECOND ASSET LIBRARIAN SITE.**

## Read first

Read the current GitHub versions in this order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`
5. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/START_HERE.md`
6. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/SITE_IMPLEMENTATION_PACKET.json`
7. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/ETHERINGTON_OFFICIAL_SEED_01.json`
8. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/TEST_REPORT.md`
9. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/RETURN.md`
10. current Asset Librarian Phase-A Return on PR #349:
    `tools/asset_registry/librarian/_handover/ASSET_LIBRARIAN_GPT_SITE_2026-10-04/RETURN_PHASE_A_SITE_2026-10-04.md`

Then inspect the **current actual Site project/version/source** with Sites tooling before modifying it. Do not assume the October 4 version is still the latest host state.

GitHub state overrides chat memory. Current Site state must be read before editing.

## Explicit Georg authority

Georg has now explicitly authorized proceeding with this R1 extension.

Therefore the older Phase-A Return statement:

`GEORG-REVIEW-GPT-SITE-PHASE-A`

must **not** block this R1 implementation.

Treat Georg's 2026-10-06 instruction as **PROCEED for the bounded Style References R1 extension**.

This does not authorize merge, Live promotion, unrelated Phase B/C work or redesign of Asset Librarian.

## Product architecture

Do not build a generic moodboard app.

Add **Style References** as a native mode of the existing Asset Librarian using the same interaction grammar:

- Browse/search;
- Inspector;
- Saved Sets / Reference Sets;
- Intake;
- provenance/rights;
- candidate handoff;
- shared picker semantics.

Target top-level modes:

1. Assets
2. Motions
3. Style References
4. Saved Sets
5. Intake

Preserve the existing Asset/Motion functionality and visual language. Extend it surgically.

## R1 core · URL-first reference intake

Implement a useful end-to-end URL workflow first.

User flow:

1. Georg pastes an official creator/tutorial URL.
2. Normalize/canonicalize the source page.
3. Resolve source metadata.
4. Resolve and visibly present the real page/image reference where technically allowed.
5. Let Georg select the relevant page/image.
6. Create a Reference Card.
7. Allow tags, notes and construction principles.
8. Add to a Reference Set.
9. Search/find the card again.
10. Relate it to existing Asset Librarian assets or procedural-asset references.
11. Export a `kfb.style-reference-pack/1`.
12. Reload and prove persistence.

Do not make manual JSON editing part of normal human use.

## Initial corpus

Use the existing 13-entry seed:

`ETHERINGTON_OFFICIAL_SEED_01.json`

Canonical collection:
`https://theetheringtonbrothers.blogspot.com/p/every-how-to-think-when-you-draw.html`

Source classification:
`OFFICIAL_CREATOR_SOURCE`

Permission/provenance context:
`USER_REPORTED_DIRECT_PERMISSION`

Georg reports that the Etherington Brothers directly supplied this blog link so he could use the online samples and spare the physical books. Preserve this as reported provenance; do not infer a blanket redistribution license.

Official creator sources win over Pinterest/reposts.

Pinterest/reposts remain:
`DISCOVERY_ONLY`

No Pinterest bulk scraping.

## Reference data model

Implement/preserve:

- `kfb.style-reference/1`
- `kfb.style-reference-pack/1`

Reference identity must be separate from source-document identity and from production Asset Registry identity.

Reference Cards need at minimum:

- reference ID;
- source ID;
- title;
- creator;
- collection;
- canonical page URL;
- direct source image URL when appropriate;
- optional private locator;
- subject tags;
- technique tags;
- use-case tags;
- media tags;
- rights/visibility;
- verification state;
- Georg notes;
- derived construction principles;
- `sourceInspectedInIsolation`;
- related asset IDs;
- related reference IDs.

## Mandatory donor/source isolation

A stored URL is **not proof** that the donor/reference was actually used.

Before a consumer handoff may claim a reference informed a design:

1. resolve the exact source page/image/crop;
2. display/open it in isolation;
3. persist `sourceInspectedInIsolation=true`;
4. retain the exact `referenceId`;
5. only then allow the handoff to describe it as an inspected design reference.

Do not mark the 13 seed entries inspected merely because their URLs load.

## Reference ↔ Asset bridge

Implement a curated relationship layer between references and production/procedural assets.

Allowed relationship values:

- `STYLE_REFERENCE`
- `CONSTRUCTION_REFERENCE`
- `MATERIAL_REFERENCE`
- `PRESENTATION_REFERENCE`

Support both directions:

- Reference → relevant existing 2D/3D/procedural/material/VFX assets.
- Asset → relevant `referenceIds`.

This relationship layer is curated/candidate-only.

It must **not** modify or reinterpret canonical mechanical Asset Registry facts such as:

- asset path/SHA;
- dimensions;
- rig facts;
- animation facts;
- dependencies;
- runtime suitability;
- procedural generation truth.

Do not create a second asset database or taxonomy owner.

## Private-source compatibility

R1 is URL-first.

Keep the data model compatible with later:

- owned physical-book photos;
- private PDFs;
- private page/crop references.

Do not let private PDF/photo intake delay the useful URL-first R1. It may remain R1.1 if necessary.

Private/purchased source pages must not be committed to GitHub or placed in public Stage payloads.

## Remote image policy

Do not mirror remote creator graphics into GitHub.

Prefer:

- canonical source page URL;
- direct creator-hosted image URL when stable/appropriate;
- authenticated/private cache only if truly necessary and explicitly private.

If browser CORS/hotlink restrictions prevent direct client-side resolution, use the Site's existing/backend-capable fetch path if available.

Do not solve CORS by creating a public image mirror.

If a specific optional preview path still cannot be resolved after two non-improving repairs, freeze that smallest seam and let the Guard classify it. Do not stop the entire R1 if a real source-isolation path still works.

## UX requirements

Style References must feel native to Asset Librarian, not bolted on.

Default view:

- search + useful facets;
- visual gallery;
- large Inspector;
- active Reference Set drawer.

Useful facets:

- source/creator;
- collection;
- subject;
- technique;
- use case;
- medium;
- rights/visibility;
- verification state.

Card minimum:

- visual preview;
- human-readable title;
- subject;
- creator/source;
- verification chip;
- Add to Set;
- Inspect.

Do not lead with raw URLs, IDs or JSON.

## ToolBox integration

After the Style References mode is implemented and its real deep-link/route is known:

1. update the **existing ToolBox** card `style-reference-library`;
2. route it to the actual verified Style References deep-link in the existing Asset Librarian Site;
3. preserve Asset Librarian as owner badge;
4. do not create another ToolBox front door;
5. do not invent the deep-link before it exists.

Update/publish the existing ToolBox Site only when this routing change is ready.

A Production Hub republish is **not required** merely because this P1 tool view changes, unless the current routing contract proves a material human-front-door change.

No Cloudflare Stage is required for R1 unless a later explicit formal public-mirror gate requests it.

## Protected boundary

Do not:

- create a new Asset Librarian Site;
- create a new Registry/search engine/taxonomy SSOT;
- replace existing Asset/Motion/Saved Set behavior;
- redesign unrelated Asset Librarian UI;
- alter canonical asset facts;
- bulk scrape Pinterest;
- mirror copyrighted reference graphics into GitHub/public Stage;
- auto-infer rights;
- turn reference use into “imitate artist style” prompts;
- merge PR #359;
- promote Live;
- touch WB2/Combat/other product runtimes;
- use Cloudflare as a substitute for Sites.

## Implementation sequence

### Phase 1 · recover + source isolation
- read current GitHub + Site state;
- identify current Site source/components;
- show the existing Asset Librarian source/UI in isolation;
- show one Etherington source reference in isolation before integration;
- define the smallest additive component/data seams.

Persist one coherent implementation checkpoint after the extension works locally/in candidate form.

### Phase 2 · integrate + test
Implement the R1 loop and test:

- Style References navigation;
- Etherington URL resolution;
- real visual/source preview;
- Reference Card create/edit/search;
- Reference Set add/remove/persistence;
- Reference ↔ Asset relation;
- pack export;
- reload/import/persistence;
- source-isolation state;
- existing Asset/Motion/Saved Set regressions.

Use deterministic/browser evidence where possible.

Persist one material evidence checkpoint.

### Phase 3 · update existing Sites
When engineering is QA-green:

- update the **existing Asset Librarian Site project in place**;
- open the exact private Site URL and verify the expected R1 revision visibly;
- record project/version/deployment/source identity;
- then update the existing ToolBox card/deep-link and verify that route;
- do not create new Sites.

Once source is frozen and only host publication remains, treat that host operation as **PUBLISH_ONLY**.

Persist final Return/handoff.

## R1 acceptance

Done when all are true:

1. Style References opens inside the existing Asset Librarian Site.
2. One official Etherington tutorial URL completes the full intake roundtrip.
3. The real source/reference is visibly inspectable.
4. A Reference Card can be created, edited and found again.
5. Tags/notes/principles persist.
6. A Reference Set can add/remove/persist references.
7. At least one reference can be related to a real existing Asset Librarian asset or procedural-asset reference.
8. A valid `kfb.style-reference-pack/1` exports.
9. Reload proves persistence.
10. Source isolation can be proven before consumer handoff.
11. Existing Asset/Motion/Saved Set behavior still passes regression.
12. No private source page is committed to GitHub/public Stage.
13. No second Asset Librarian Site exists.
14. Existing Asset Librarian Site is updated and visibly verified.
15. Existing ToolBox routes to the real Style References view and is visibly verified.

Do not convert automated PASS into Georg product acceptance.

## INDEPENDENT EXECUTION

Outcome: existing Asset Librarian Site extended with usable Style References R1 + verified ToolBox route  
Builder: ChatGPT Work/WSA main implementation agent  
Tester: read-only integration/browser tester within the run  
Critic: short read-only proportional critic against this brief and visible candidate  
Guard: read-only Production Guard  
Only writer: Builder  
STOP authority: Guard only  
Human gate: Georg reviews the finished Style References experience after Site verification; no intermediate Georg gate unless a genuine product/rights/destructive decision is required

Apply:
`skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`

## Repair rule

After two non-improving repairs on the same seam:

- preserve the smallest failing seam + evidence;
- Guard classifies impact;
- non-outcome-critical → quarantine/defer and continue;
- outcome-critical → stop only that outcome path.

Do not globally stop R1 because one optional preview adapter fails.

## GitHub / checkpoint rules

Use PR #359 as the durable R1 contract/handoff owner.

At phase boundaries:
1. implementation milestone;
2. evidence milestone;
3. final Return/handoff.

After every actual GitHub write:
- fetch exact branch head;
- fetch intended file;
- verify write.

Timeout = `UNKNOWN`; inspect before retry.

Do not merge or promote Live.

## Final Return must include

- repo;
- branch;
- PR;
- exact final GitHub head;
- exact changed files;
- retained owners;
- actual test counts;
- browser evidence/screenshots;
- tested Etherington URL(s);
- source-isolation proof;
- Reference ↔ Asset proof;
- export/reload proof;
- exact Asset Librarian Site project/version/deployment/source identity;
- exact verified Asset Librarian URL/deep-link;
- exact ToolBox project/version/deployment/source identity if ToolBox was republished;
- exact verified ToolBox route;
- unresolved/deferred items;
- one next gate;
- explicit statement: **no second Site, no merge, no Live promotion**.

## Exactly one next gate

**IMPLEMENT STYLE REFERENCES R1 BY EXTENDING THE EXISTING ASSET LIBRARIAN SITE, THEN VERIFY THE EXISTING TOOLBOX ROUTE.**
