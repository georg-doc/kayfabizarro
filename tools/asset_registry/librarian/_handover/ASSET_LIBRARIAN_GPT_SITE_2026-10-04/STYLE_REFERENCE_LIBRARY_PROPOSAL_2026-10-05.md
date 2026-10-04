# KFB Asset Librarian · Style Reference Library proposal

Status: **PROPOSAL · PLANNING ONLY · NO RUNTIME / SITE CHANGE**  
Date: 2026-10-05  
Workflow: `KFB-ASSET-LIBRARIAN-STYLE-REFERENCES-01`  
Owner: **KFB Asset Registry / Asset Librarian**  
Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/asset-librarian-gpt-site-prep-2026-10-04`  
Draft PR: **#349**

Primary product surface remains the existing private Asset Librarian Site:

`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

ToolBox role: expose **Style References** as a dedicated entry/view inside the existing Asset Librarian owner.  
Do **not** create a second Asset Registry, second Librarian owner or parallel productive Site.

Reserved downstream Cloudflare review route, only if a formal KFB-Hub mirror is later required:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/style-reference-library/`

Status of that route: **RESERVED · NOT DEPLOYED**.  
Private PDF/page content must never be published there.

## 1 · Product idea

Add a private, administrable visual-reference corpus for drawing/design sources such as purchased comic-drawing PDFs, private books/exports, owned scans, public-domain references and future KFB style sheets.

The immediate motivating source is Georg's private `How to Think When You Draw`-style material (likely the Etherington Brothers series), including high-value visual lessons such as:
- cartoon clouds;
- speech / thought bubble construction;
- smoke, weather and atmosphere;
- foliage, rocks and environment shorthand;
- perspective, silhouettes and shape language;
- hands, faces, poses and expression;
- panel / composition devices.

The objective is not to copy a source style into KFB. The objective is to make real, inspectable design references findable and reusable in design rounds without repeated Google searching.

## 2 · Core user loop

**Upload / attach → inspect PDF → mark useful page/crop → tag → save as Reference Card → collect in Reference Set → send a reference pack to Claude/Design/LLM consumer.**

Normal human use should not require editing JSON.

Machine interoperability remains JSON-first underneath.

## 3 · Reuse current Asset Librarian

Reuse the current Site's proven concepts:
- Browse / live search;
- Inspector;
- Saved Sets;
- Intake boundary;
- provenance;
- stable IDs;
- candidate handoff;
- shared picker pattern.

New resource scope:
`style_reference`

This is a new *resource type*, not a new asset-truth owner.

The existing production Asset Registry under `registry/assets/v1/**` remains authoritative for production assets and must not be polluted with private book PDFs merely to make them searchable.

## 4 · Private source storage

The original PDF/file is a **private source object**.

Store it behind a provider-neutral private reference:
- Production Control / Production Inbox file ID when suitable;
- private Dropbox/file adapter when available;
- another authenticated private storage adapter later.

Do not encode a public URL as the source-of-truth requirement.

The logical document record stores:
- stable `documentId`;
- source provider/type;
- private file reference;
- SHA-256;
- filename;
- title / creator / edition;
- page count;
- rights / visibility facts;
- version.

Replacing a PDF should create a new document version while retaining the logical `documentId` and prior SHA/version history.

## 5 · Rights / privacy boundary

For purchased/private copyrighted references:

- original PDF: **PRIVATE_INTERNAL**;
- page renders/crops: **PRIVATE_INTERNAL**;
- no PDF or page image in GitHub;
- no source page in public Cloudflare Stage;
- no page image embedded into portable JSON exports by default;
- no redistribution claim;
- machine exports may carry reference IDs, page locators, tags and Georg-authored/agent-authored summaries of principles.

If an individual source has explicit public-domain / redistribution rights, that status may be stored as provenance; never infer it from the filename or creator.

## 6 · Reference Card

A Reference Card is the atomic design object.

It points to one real source object and a precise location:
- document ID + version;
- page or page range;
- optional normalized crop box;
- optional source section / lesson title;
- visual subject tags;
- technique / construction tags;
- use-case tags;
- Georg notes;
- concise design principles;
- things to avoid / anti-patterns;
- rights/visibility state.

Examples:
- `clouds / p. 118 / cloud mass + edge rhythm`
- `speech bubbles / pp. 42–43 / tail direction + proportional positioning`
- `smoke / p. 201 / layered volume breakup`

## 7 · Mandatory donor-isolation rule

A resolved reference ID is not proof that the actual donor design was examined.

Before an agent claims a Reference Card was used:
1. resolve the exact source object;
2. open/show the exact page or crop **in isolation**;
3. only then integrate principles into the new design;
4. record the `referenceId` in the design-round handoff.

This directly follows the KFB donor rule: a loaded URL or available asset is not proof that the donor design was used.

## 8 · Site information architecture

Add a **Style References** area to the existing Asset Librarian Site.

Suggested navigation inside that area:

### Browse
Grid/list of Reference Cards with live search.

Primary facets:
- Source / creator;
- document / volume;
- subject;
- technique;
- use case;
- media type;
- rights/visibility.

### PDF Viewer
Private PDF viewer with:
- page strip;
- zoom;
- page number;
- crop/region selection;
- `Create Reference Card`;
- existing cards visible on the page.

### Reference Sets
Saved Sets specialized for design rounds.

Examples:
- `KFB Cartoon Clouds`
- `Speech + Thought Bubble Construction`
- `Claymation Smoke / Dust / Impact Shapes`
- `Billboard / Poster Composition`

### Compare
2–4 cards side by side for visual comparison before a design round.

### Intake / Admin
- add PDF/file;
- edit metadata;
- replace version;
- archive/deactivate;
- reconcile page locators after replacement;
- import/export metadata JSON;
- never silently promote a private reference into the public production Asset Registry.

## 9 · Machine handoff

Two proposed schemas:

- `kfb.style-reference/1` — one atomic Reference Card;
- `kfb.style-reference-pack/1` — a selected set for one design task.

A design pack should carry:
- pack ID/title;
- design intent;
- selected `referenceId` values;
- source document IDs + page/crop locators;
- concise principles;
- explicit rights/visibility;
- consumer target;
- instruction that the consumer must resolve/show the source in isolation before claiming use.

Do not embed private page images in a portable pack unless an authenticated private consumer explicitly requests them.

## 10 · Agent / Claude seam

Future read-only actions can mirror the existing Librarian model:

- `search_style_references`
- `get_style_reference`
- `get_reference_document`
- `get_reference_page`
- `export_style_reference_pack`

The agent may:
- find;
- compare;
- summarize principles;
- assemble a pack;
- explain why a reference is relevant.

The agent must not:
- invent source facts;
- claim a page was inspected when it was not;
- publish private source pages;
- silently turn stylistic reference into final KFB canon.

Claude/Claude Design access should use the existing KFB service-access direction when available, not a new standalone credential system owned by this feature.

## 11 · Example design-round flow

Task: design KFB cartoon clouds.

1. Search `clouds`.
2. Site returns real Reference Cards with page locators.
3. Georg selects 2–4 useful cards.
4. Open each source page/crop in isolation.
5. Export `KFB Cartoon Clouds` reference pack.
6. Claude/Design receives stable IDs + exact source locators + principles.
7. New KFB cloud design is created from the principles and KFB palette/material rules.
8. Result records which reference IDs informed it.

No Google image search is required for known recurring design problems.

## 12 · Suggested implementation order

### R0 · planning / contract
This document + machine schema. No Site changes.

### R1 · private document intake + manual Reference Cards
Smallest useful product:
- attach/upload a private PDF;
- render it privately;
- make page/crop cards;
- tag/search cards;
- build a Reference Set;
- export JSON.

### R2 · consumer pack + Claude/Design bridge
- resolver actions;
- reference pack import/export;
- donor-isolation proof;
- design-round provenance.

### R3 · assisted indexing
Optional later:
- TOC/page-title import;
- suggested tags;
- visual similarity;
- page-level semantic search.

Manual curation remains authoritative; do not let automatic indexing block R1.

## 13 · Protected boundaries

- existing Asset Registry remains the production-asset truth;
- existing Asset Librarian Site remains the Site owner;
- existing ToolBox remains the one tool router;
- current PR #349 Phase-A human review remains open and is not overwritten by this proposal;
- no public redistribution of private PDFs/pages;
- no new Site;
- no new Registry;
- no new Claude auth owner;
- no merge / Live promotion.

## 14 · Done criterion for a future R1 slice

A future implementation slice is done when Georg can, inside the existing private Asset Librarian Site:

1. attach one real private PDF;
2. open it;
3. create at least three real page/crop Reference Cards;
4. search them by subject;
5. collect them into one Reference Set;
6. export a valid `kfb.style-reference-pack/1`;
7. reopen the same saved reference data after reload;
8. prove that private source pages are not present in GitHub/public Stage;
9. preserve the existing Asset Librarian Browse/Saved Set behavior.

No Stage publication is required to prove the private source workflow. If a downstream KFB-Hub mirror is later required, it must use the reserved pages.dev route and rights-safe metadata/UI only.

## Exactly one next gate

**GEORG REVIEW OF CONCEPT ONLY.**

This proposal does not start R1 and does not change the current PR #349 Phase-A product gate.  
If Georg approves the concept, the next implementation brief should be a bounded R1 extension of the existing Asset Librarian Site, reusing its Intake + Saved Set + Inspector seams.
