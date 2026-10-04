# KFB Asset Librarian · GPT Site / Shared Asset Picker

Status: **READY FOR WSA WORKSHOP · SITE PREP / UX CONTRACT ONLY**  
Date: 2026-10-04  
Owner: **KFB Asset Registry / Asset Librarian**  
Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/asset-librarian-gpt-site-prep-2026-10-04`  
Source baseline: `main@ffeb161d7c09c64436fbdf1dc83ce2b71e8f8a74`

## Goal

Re-home the human-facing Asset Librarian as a GPT Site and use the same discovery model later as the compact asset-picker/palette in God Mode / WorldBuilder.

This slice prepares the product contract and UI architecture. It does **not** create a second Registry, does not replace the current source/runtime owner, and does not publish or promote a Cloudflare replacement.

## Product outcome

A daily-use asset browser should feel like a normal modern library:

**Find → Inspect → Collect → Use**

The full Librarian and the compact WorldBuilder picker must share:
- query semantics;
- Family / Pack / Collection facets;
- type / rig / animation / format / dependency facets;
- preview behavior;
- selection / saved-set representation;
- provenance and source identity;
- candidate handoff semantics.

The WorldBuilder consumes the picker; it does not fork the Librarian or Registry.

## Current truth / protected owners

### Canonical asset truth
Tracked repository assets + generated Asset Registry under the existing Asset Registry owner remain authoritative.

### Librarian role
The Librarian owns discovery, preview, candidate collection and candidate handoff. It does not decide gameplay suitability, final rig/motion compatibility, consumer runtime behavior or authoring ownership.

### Animation boundary
Animation Lab / ToolBox remains final animation compatibility / authoring owner. Librarian motion preview is discovery evidence only.

### WorldBuilder boundary
WorldBuilder owns scene placement and world persistence. The picker returns a candidate/reference; it does not become a second scene runtime.

### Intake boundary
Newly uploaded/imported material may become immediately previewable as **INTAKE / UNREGISTERED**, but may not silently become canonical Registry truth. Promotion to Registry stays an explicit ingestion/provenance step.

## Verified donors to reuse

### Current main Librarian v1.7
Reuse:
- existing live/canonical Registry read path;
- global search;
- type/format/rig/animation/dependency/review filters;
- list/gallery result rendering;
- 3D/image/audio previews;
- detail/provenance drawer;
- persistent local Selection Tray;
- `kfb.asset-handoff.v1` candidate-only export;
- Actors / Rigs / Motions / FX resource-owner views.

Do not copy the current visual density as the Site UX.

### Frozen PR #304 · product-core donor only
Frozen implementation pin: `545853924c4c177b6e26af588020b7a59307bb71`.

Reuse only the green core:
- real Family → Pack → Collection browsing from existing Registry facts;
- KayKit as a true family facet rather than injected search text;
- animated Motion → real preview actor → existing binding/playback path.

Do **not** reuse or repair the stopped motion scrub/transport extension.

## Site UX direction

### 1. Primary surface: Browse
One dominant live-search field, with compact visible facets:
- Source Family;
- Pack;
- Collection;
- Asset Type;
- optional quick chips: Rigged, Animated, 3D, Image, Audio.

Additional technical filters live in a collapsible filter drawer, not in the default visual hierarchy.

Search should be live/debounced; no mandatory Search button.

### 2. Results
Default gallery cards:
- preview;
- human-readable name;
- Family / Pack;
- concise type/status chips;
- one-click Add to Set;
- one-click Inspect.

List view remains available for dense technical work.

### 3. Inspector
Right-side / full-height inspector:
- large preview first;
- identity + Family / Pack / Collection;
- useful compatibility facts;
- provenance;
- technical details collapsed by default;
- actions: Add to Set, Copy reference, Candidate Handoff.

### 4. Saved Sets instead of JSON-first workflow
User-facing concept: **Saved Sets**.

A Saved Set may contain assets, actors, motions and FX references plus optional notes/context.

The UI should support:
- New Set;
- rename;
- duplicate;
- add/remove;
- reorder;
- save/restore;
- export/import underlying machine JSON;
- Candidate Handoff to a named consumer.

The JSON schema remains available for agents/runtime interoperability, but normal daily use should not require manually creating/downloading JSON collections.

### 5. Compact Picker mode for God Mode / WorldBuilder
Same components, reduced chrome:
- one search line;
- compact facet row;
- tile palette;
- mini inspector;
- current scene selection/saved set;
- `Use in WorldBuilder` / `Place candidate` action exposed by the receiving owner.

No duplicated taxonomy, search engine or asset cache.

### 6. Intake lane
Provide an `Add asset` entry point with adapter boundaries:
- Dropbox/file source may be attached as an intake reference;
- preview as soon as the Site can resolve the file;
- status must visibly remain `INTAKE / UNREGISTERED` until existing Registry ingestion accepts it;
- record original source/path/provider and content identity when available;
- after Registry ingestion, the same item should resolve to its canonical Registry identity rather than becoming a duplicate.

Dropbox is an optional source/import channel, not the Registry.

## Information architecture

Primary Site navigation:
1. **Browse**
2. **Motions**
3. **Saved Sets**
4. **Intake**

Actors / Rigs / FX remain searchable resource scopes and may appear as chips/sub-filters rather than five equally weighted top tabs.

Reason: the current browser exposes too many technical lanes at once. The Site should privilege the most common human task: find something, see it, keep it, use it.

## Shared search contract

The full Site and embedded Picker must use one normalized query object, conceptually:

```json
{
  "query": "",
  "family": "",
  "pack": "",
  "collection": "",
  "assetTypes": [],
  "formats": [],
  "rigged": null,
  "animated": null,
  "clip": "",
  "joint": "",
  "dependencyStatus": "",
  "reviewStatus": "",
  "scope": "assets",
  "representation": "primary"
}
```

Presentation labels may evolve; this object must map to existing Registry facts rather than inventing a competing classification SSOT.

## LLM / next-generation consumer seam

Every visible result and Saved Set item should expose a stable machine-readable identity:
- Registry asset ID or production-resource ID;
- source repo/ref where applicable;
- canonical path;
- Family / Pack / Collection facts;
- preview/source references;
- provenance/rights facts when known;
- candidate-only consumer target when exported.

The Site should make the same result usable by a human and by an LLM without screen-scraping the UI.

## WSA Workshop build order

### Phase A · Site shell / browse
Build the Site-native Browse experience over the existing Registry read layer and prove:
- live search;
- Family → Pack → Collection;
- basic type facets;
- result gallery/list;
- inspector with 3D/image/audio preview;
- add/remove Saved Set.

### Phase B · consumer handoff
Add:
- Saved Set persistence;
- underlying `kfb.asset-handoff.v1` export/import;
- compact Picker component contract;
- WorldBuilder candidate action seam.

### Phase C · intake
Add a bounded intake lane after A/B work:
- Dropbox/file reference;
- immediate preview where technically supported;
- explicit UNREGISTERED state;
- Registry-reconciliation path.

Do not let Intake block the useful Browse/Picker Site.

## Done when

WSA returns one GPT Site that:
1. reads the existing Registry/Resource truth rather than copying it;
2. supports real Family → Pack → Collection browsing;
3. provides fast live search + compact useful filters;
4. previews assets cleanly;
5. lets Georg build/use Saved Sets without manually managing JSON;
6. preserves machine JSON/handoff underneath;
7. exposes the same picker contract for later WorldBuilder embedding;
8. clearly separates INTAKE from canonical Registry items;
9. preserves all owner boundaries above;
10. returns a direct GPT Site link and a concise implementation/source handoff.

## Not in this slice

- no Registry rewrite;
- no new semantic asset database;
- no automatic gameplay-suitability claims;
- no automatic animation compatibility promotion;
- no new WorldBuilder scene/runtime owner;
- no motion scrub repair;
- no Cloudflare Stage/Live replacement or retirement;
- no merge without Georg's named gate.

## Current publication state

The existing Cloudflare Librarian remains a compatibility/source surface during migration:
`https://kayfabizarro.pages.dev/asset-librarian/`

The new GPT Site is intended to become the primary human working surface after WSA implementation and Georg review. No Site exists yet in this preparation slice.

## Exactly one next gate

**WSA-ASSET-LIBRARIAN-GPT-SITE-01**

WSA Workshop builds Phase A + the minimum Saved Set seam from this brief, reusing main + the green PR #304 donors, and returns one reviewable GPT Site. No Cloudflare publication is required for that Site review.
