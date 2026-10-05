# KFB Style Reference Library · R1 Site brief

Status: **R1 SITE PACKET · IMPLEMENTATION NOT STARTED**  
Date: 2026-10-05  
Owner: **KFB Asset Registry / Asset Librarian**  
Surface role: **ToolBox specialist view inside the existing Asset Librarian Site**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/style-reference-library-r1-surface-2026-10-05`  
Base: `chatgpt-web/surface-consolidation-2026-10-04@74ac0eea2b65872ccab3fb454d89e5d1ac5cc97a`

## Goal

Add a daily-use **Style References** mode to the existing private KFB Asset Librarian Site.

It must feel semantically native to the Asset Librarian:

**Find → Inspect → Collect → Use**

but the resource being curated is a **design/construction reference**, not a production asset.

The ToolBox gets a visible **Style Reference Library** entry, but that entry must resolve to the existing Asset Librarian owner/site. Do not create a second productive Site or a second Registry.

Existing host Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

Current ToolBox front door:
`https://kfb-toolbox.frizzlebob.chatgpt.site`

## Why this belongs beside Asset Librarian

The Asset Librarian already owns:
- discovery/search;
- preview/inspection;
- provenance;
- Saved Sets;
- candidate handoff;
- shared picker semantics;
- Intake boundary.

Style References need the same interaction grammar.

This also enables a useful bidirectional seam:

### Reference → production
A cloud/smoke/building/prop reference can point to:
- existing 2D assets;
- existing 3D assets;
- procedural-asset presets;
- Clay/Material references;
- VFX/SFX/presentation donors.

### Production → reference
A production/procedural asset can carry:
- `referenceIds`;
- construction/style inspiration;
- visual grammar references;
- source/provenance notes.

The reference corpus does **not** become production asset truth. The production Asset Registry does **not** become a copyright/reference archive.

## R1 product loop

### A · URL intake
Paste an official creator/tutorial URL.

The Site:
1. normalizes canonical page URL;
2. resolves creator/source metadata;
3. shows available page images/graphics where technically allowed;
4. lets Georg select one image or the page as the reference target;
5. creates a Reference Card;
6. suggests tags without auto-promoting them to canon;
7. saves into a Reference Set.

### B · private file/photo intake
For owned books or unavailable online material:
- attach PDF/photo/private file;
- keep source private;
- select page/crop;
- create the same Reference Card shape.

R1 may implement URL intake first. Private PDF/photo intake must remain schema-compatible and may follow as R1.1 if it would delay the useful URL-first product.

### C · browse
Search/filter by:
- creator/source;
- collection;
- subject;
- technique;
- use case;
- medium;
- rights/visibility;
- verification status.

### D · inspect
Inspector prioritizes the real reference:
- large preview;
- source title + creator;
- official page URL;
- exact image/page/crop locator;
- provenance/rights;
- Georg notes;
- derived construction principles;
- related production assets/references.

### E · Reference Sets
Same mental model as Asset Librarian Saved Sets.

Examples:
- KFB Cartoon Clouds
- Speech + Thought Bubbles
- Smoke / Dust / Impact
- Clay Building Shape Language
- Cartoon Foliage
- Billboard / Poster Composition
- Procedural Prop Silhouette Grammar

### F · consumer handoff
Export a `kfb.style-reference-pack/1` for:
- Claude Design;
- Claude/Cowork;
- ChatGPT/Web;
- Blender/3D briefing;
- procedural asset generation;
- WorldBuilder/environment design;
- Comic VFX / ChatterBox.

The consumer receives stable IDs and exact source locators, not a vague prompt such as “make this like Etherington”.

## Mandatory donor proof

A URL being stored is not proof that the visual donor was used.

Before an agent claims a reference informed a design:
1. resolve the exact source page/image/crop;
2. show/open that source object in isolation;
3. record `sourceInspectedInIsolation=true`;
4. only then integrate the principles;
5. retain the `referenceId` in the output/handoff.

## Source classes

R1 supports:

- `OFFICIAL_CREATOR_SOURCE`
- `OWNED_PRIVATE_SOURCE`
- `VERIFIED_THIRD_PARTY_SOURCE`
- `DISCOVERY_ONLY`

Priority:
`OFFICIAL_CREATOR_SOURCE > OWNED_PRIVATE_SOURCE > VERIFIED_THIRD_PARTY_SOURCE > DISCOVERY_ONLY`

Pinterest/reposts are discovery pointers when an official source can be resolved.

## Etherington canonical source

Creator:
**The Etherington Brothers**

Collection:
**How to Think When You Draw**

Canonical creator-hosted master source:
`https://theetheringtonbrothers.blogspot.com/p/every-how-to-think-when-you-draw.html`

Source class:
`OFFICIAL_CREATOR_SOURCE`

Permission/provenance context:
`USER_REPORTED_DIRECT_PERMISSION`

Georg reports that the creators directly supplied the blog link so he could use the online samples and spare the physical books. Preserve this as reported context, not as an inferred blanket redistribution license.

The official master collection and individual official tutorial pages are preferred over Pinterest/reposts.

## UI structure inside existing Asset Librarian

Top-level Asset Librarian modes after R1:

1. **Assets**
2. **Motions**
3. **Style References**
4. **Saved Sets**
5. **Intake**

Do not make a second navigation shell.

### Style References default view

Left/top:
- search;
- source;
- subject;
- technique;
- use case;
- media;
- rights/visibility.

Center:
- visual card gallery.

Right:
- Inspector.

Bottom/right drawer:
- active Reference Set.

### Card minimum

Each card shows:
- thumbnail/preview when available;
- concise human title;
- subject;
- creator/source;
- verification chip;
- Add to Set;
- Inspect.

Do not lead with raw URLs or JSON.

## Shared data model

Primary schemas:
- `kfb.style-reference/1`
- `kfb.style-reference-pack/1`

Reference Card identity is separate from source-document identity.

Recommended stable IDs:
- source: `style-source:<creator>:<collection>:<slug>`
- reference: `style-ref:<creator>:<subject>:<stable-id>`
- set: `style-set:<slug>:<stable-id>`

A reference may point at:
- canonical page URL;
- direct creator-hosted image URL when resolvable;
- private file/page/crop locator;
- related Registry asset IDs;
- related procedural preset IDs.

## URL storage policy

Default:
- store canonical page URL;
- store direct source image URL only when it belongs to the resolved source page/creator context and is technically stable;
- do not copy remote page images into GitHub;
- do not embed remote copyrighted images in public exports;
- private caches, if ever required for reliability, need an explicit private-storage policy and must not become public Site/Stage payloads.

## Initial Etherington seed

Use:
`ETHERINGTON_OFFICIAL_SEED_01.json`

Seed entries are **URL-verified source records**, not claims that the visual image has already been inspected in isolation.

R1 should import them into the Site as source/reference candidates and require actual visual resolution before `sourceInspectedInIsolation=true`.

## Asset-Librarian bridge

Add optional fields to reference/asset handoffs, not to canonical mechanical asset facts:

```json
{
  "referenceIds": ["style-ref:..."],
  "relatedAssetIds": ["asset:..."],
  "relationship": "STYLE_REFERENCE | CONSTRUCTION_REFERENCE | MATERIAL_REFERENCE | PRESENTATION_REFERENCE"
}
```

This relationship layer is curated/candidate-only.

It must not alter:
- model dimensions;
- rig facts;
- dependencies;
- asset SHA/path;
- runtime suitability;
- procedural generation truth.

## ToolBox routing

ToolBox displays one card:

**Style Reference Library**  
Subtitle: `Visual construction + style reference pool`

Owner badge:
`Asset Librarian`

Status for this planning slice:
`R1 SITE PACKET READY`

Action:
route to the existing Asset Librarian Site once the Style References mode is implemented.

Do not advertise a deep-link URL until that route is actually implemented and opened.

## R1 acceptance

Implementation is ready for human use when the existing Asset Librarian Site can:

1. open Style References without a second Site;
2. paste one official Etherington tutorial URL;
3. resolve and preview the real reference page/image;
4. create a Reference Card;
5. create/edit tags and notes;
6. search the card again;
7. add it to a Reference Set;
8. relate it to at least one existing Asset Librarian asset or procedural-asset reference;
9. export a valid `kfb.style-reference-pack/1`;
10. reload and retain the saved reference/set;
11. prove the exact reference can be shown in isolation before consumer handoff;
12. keep private/purchased material out of GitHub/public Stage;
13. preserve existing Asset Librarian Asset/Motion/Saved-Set behavior.

## Protected boundaries

- existing Asset Librarian Site is the only specialist Site owner;
- existing Asset Registry remains production asset truth;
- ToolBox remains navigation/router only;
- no second search engine;
- no second taxonomy SSOT;
- no automatic style imitation instruction;
- no automatic rights inference;
- no Pinterest bulk scraping;
- no remote copyrighted image mirroring into GitHub;
- no merge / Live promotion;
- no Cloudflare-first substitution.

## Execution mode

This is a **real Site engineering R1**, not a routine CSS/status update and not PUBLISH_ONLY.

A Sites-capable implementation executor may build it in the existing Asset Librarian Site project.

After implementation is QA-green, publication/update of the existing Site becomes **PUBLISH_ONLY** and should use the lowest-cost Sites-capable publisher.

## Exactly one next gate

**BUILD STYLE REFERENCES R1 IN THE EXISTING ASSET LIBRARIAN SITE.**

Return:
- exact existing Site project/version/deployment;
- source identity;
- changed Site files/components;
- actual browser tests;
- Etherington URL roundtrip proof;
- reference→asset relation proof;
- export/reload proof;
- no second Site;
- unresolved items;
- one next gate.
