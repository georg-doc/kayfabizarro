# START HERE · Asset Librarian External 3D Search Federation R1

Status: **PREPARED · IMPLEMENTATION NOT STARTED**  
Date: 2026-10-07  
Owner: **KFB Asset Registry / Asset Librarian**  
Execution mode: **BOUNDED_SLICE**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/asset-librarian-external-3d-search-r1-2026-10-07`  
Base: `main@619c687fc736a129796c904b6523c630aee85fba`

## Goal

Extend the **existing Asset Librarian** with agent-ready external 3D-asset discovery without creating a second Asset Registry, second Site, second provenance owner or second consumer handoff contract.

Initial external discovery donor:

- source: `arielshad/3d-asset-server`
- inspected head: `c5c408d1eb524e3bf878bb63ff47bc928980bf76`
- software license: Apache-2.0
- hosted service: `https://3d.shep.bot/`
- current source count observed in repo/live service: **20 providers**
- interfaces: browser search, REST/OpenAPI 3.1, Streamable HTTP MCP, stdio MCP/CLI, agent docs/skill

This donor is an **external discovery/provider layer only**. KFB Registry remains the canonical asset truth.

## Current KFB owner truth

Read first:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/tool-nodes/asset-librarian.md`
5. `tools/asset_registry/librarian/README.md`
6. current Style Reference additive Return on Draft PR #359:
   `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/RETURN.md`

Current productive Asset Librarian Site remains:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

Style Reference deep-link remains:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

No new Site is authorized by this prep slice.

## Donor facts verified

`3d-asset-server` currently normalizes provider results into a common model with:

- stable external id `provider:nativeId`;
- title, description, tags/categories;
- asset type;
- source URL + thumbnail;
- author;
- provider-reported license metadata;
- price/free flag;
- formats/resolutions;
- poly count;
- animated / rigged flags;
- downloadable flag;
- direct file lists for supported sources.

Current asset types include:
`model · texture · material · hdri · sprite · ui · audio · font · pack · other`.

Current provider set includes Poly Haven, ambientCG, CGBookcase, ShareTextures, BlenderKit, Fab, Kenney, Poliigon, Quaternius, Polyfork, 3DAssets.dev, 3DTextures.me, 3DTexel, TextureCan, Textures.com, HDRMaps, HDRI Hub, CGTrader, TurboSquid and itch.io.

Its MCP surface currently exposes:

- `search_assets`
- `get_asset`
- `download_asset` only when local/trusted download is enabled
- `list_providers`

The public remote MCP does not write into the caller's filesystem by default; `get_asset` can return direct file URLs / a bundle URL instead.

## Binding architecture decision

### 1. Do not merge external results into Registry truth

External search hits are:

`EXTERNAL_DISCOVERY_CANDIDATE`

until a controlled KFB intake/import has happened.

They must not receive a canonical KFB `assetId` merely because the remote API returned them.

### 2. Preserve the current internal tool contract

The existing KFB Librarian already has provider-neutral read-only tools and an existing `search_assets` name.

Do **not** replace or silently broaden that tool.

Keep existing canonical tools stable and add an explicit external lane:

- `search_external_assets`
- `get_external_asset`
- `list_external_asset_providers`
- `prepare_external_asset_intake`

A later trusted writer/import workflow may consume the prepared intake. The public/private Librarian Site itself should remain read-only with respect to GitHub/Registry.

### 3. UI seam

Add one bounded lane/view inside the existing Asset Librarian shell:

**External Search**

Suggested visible flow:

`Search → Compare → Inspect Source → Add to Intake → KFB Import/Verify → normal Registry`

External cards may show:

- provider;
- title + thumbnail;
- provider-reported license;
- attribution required;
- free/paid;
- direct-download availability;
- formats/resolutions;
- poly count;
- animated/rigged;
- exact source page.

Do not claim consumer suitability from these facts.

### 4. Provenance / rights boundary

The donor's `license` object is useful discovery metadata but is **not automatically KFB rights evidence**.

Map it initially to:

- `sourceLicenseClaim`
- `sourceLicenseUrl`
- `sourceAttributionClaim`
- `externalProvider`
- `externalNativeId`
- `externalSourcePage`
- `retrievedAt`

Only after KFB intake/download may a file gain:

- exact payload SHA-256;
- stored byte count;
- controlled KFB source path;
- explicit source/rights evidence record;
- source-isolation evidence;
- Registry registration.

Unknown/custom/per-listing license stays explicit and may not be upgraded by inference.

### 5. Source-isolation gate

A remote thumbnail, loaded URL or successful API response is not donor proof.

Before an external 3D model becomes an accepted KFB asset:

1. fetch the exact chosen payload through a trusted workflow;
2. store source identity + retrieval facts;
3. compute exact hash/size;
4. open the actual model/asset in isolation;
5. verify expected geometry/material/animation content;
6. preserve license/attribution facts;
7. only then register it into the existing KFB Asset Registry;
8. only Registry assets may enter normal `kfb.asset-handoff.v1` consumer flow.

### 6. Fail-soft external dependency

External search must never block the existing Librarian.

If `3d.shep.bot` or one provider fails:

- internal Registry search remains fully usable;
- provider timeout/error/link-only status remains visible;
- no empty result is rewritten as "no asset exists";
- no cached external hit is promoted to canonical Registry truth.

### 7. No automatic browser-side import

The Site must not automatically ingest arbitrary remote GLB/ZIP content into KFB.

External preview may use safe thumbnails/source links first.

Actual payload import belongs to an authenticated/trusted agent or Work workflow that can validate size/content, hash it, persist provenance and write the existing Registry source tree.

## KFB-specific ranking policy

For external discovery only, ranking may prefer:

1. explicit query relevance;
2. free/CC0 where the user asks for reusable/free assets;
3. direct-download capable sources;
4. GLB/glTF for current Three.js/KFB use;
5. usable structural facts such as poly count / rigged / animated where relevant.

This ranking is a retrieval convenience, not a semantic or artistic suitability decision.

## Proposed intake packet

Schema name:

`kfb.external-asset-intake/1`

Minimum fields:

- `externalId`
- `provider`
- `nativeId`
- `title`
- `type`
- `sourcePage`
- `thumbnailUrl?`
- `author?`
- `sourceLicenseClaim?`
- `sourceLicenseUrl?`
- `attributionRequired?`
- `price/free?`
- `formats?`
- `resolutions?`
- `polyCount?`
- `rigged?`
- `animated?`
- `downloadable`
- `selectedFileUrls?`
- `retrievedAt`
- `status = EXTERNAL_DISCOVERY_CANDIDATE`

It intentionally contains **no canonical KFB assetId**.

## Implementation phases

### Phase A · adapter + contracts

- add a small external-provider adapter behind the existing Librarian owner;
- initial backend = `3d.shep.bot/v1`;
- keep upstream provider IDs intact;
- normalize search/detail/provider status into KFB external-candidate schema;
- do not touch Registry builder output.

### Phase B · Site view

- add External Search to the existing Librarian Site;
- preserve current Assets/Motions/Saved Sets/Intake/Style References;
- search/detail and source links only;
- Add to Intake exports/persists candidate metadata, not asset bytes.

### Phase C · trusted import bridge

- consume one prepared external intake;
- fetch one exact direct-download candidate;
- hash/store/source-isolate it;
- produce explicit provenance/rights evidence;
- register through the existing Registry pipeline;
- prove it appears in the ordinary Librarian after Registry refresh.

### Phase D · agent surface

Expose KFB-owned external discovery tools without breaking the existing canonical tool names.

Preferred first surface is read-only:
`search_external_assets → get_external_asset → prepare_external_asset_intake`.

Do not expose unrestricted download/write through the public Site/MCP surface.

## Acceptance matrix

Implementation is not complete until all are green:

1. existing internal Registry search unchanged;
2. current Style References view/regressions unchanged;
3. external search returns normalized candidates from multiple upstream providers;
4. provider-reported license/source facts visible and clearly labelled as external claims;
5. link-only source never claims direct download;
6. upstream provider timeout/error fails soft;
7. prepared intake has no canonical KFB assetId;
8. one CC0/direct-download sample is fetched by trusted workflow, hashed and shown in isolation;
9. imported sample enters the **existing** Registry, not a side index;
10. normal Librarian sees the imported Registry asset after refresh;
11. normal `kfb.asset-handoff.v1` is available only after registration;
12. agent tools preserve the internal/external truth boundary.

## Explicit non-goals

- no second Asset Registry;
- no second Asset Librarian Site;
- no fork of `3d-asset-server` unless an actual upstream gap is proven;
- no mirrored catalogue of all 20 providers inside GitHub;
- no license inference;
- no automatic suitability declaration;
- no auto-download/import from the browser;
- no Open World runtime integration in this slice;
- no Hub/ToolBox route change in preparation;
- no merge or Live promotion.

## Recommended executor

Next productive implementation executor:
**ChatGPT Work/WSA · Asset Librarian Integrator**

It should use the existing Asset Librarian Site/project, inspect current Site source before editing, and complete Phases A–D in one bounded additive implementation job with independent tester/critic/guard roles.

## One next gate

**IMPLEMENT_EXTERNAL_3D_SEARCH_FEDERATION_INSIDE_EXISTING_ASSET_LIBRARIAN**
