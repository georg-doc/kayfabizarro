# IMPLEMENTATION RETURN · Asset Librarian External 3D Search Federation R1

Status: **IMPLEMENTATION PARTIAL · NO MAIN MERGE ALLOWED, SO THE PROVEN CC0 ASSET CANNOT YET ENTER THE LIVE REGISTRY**  
Date: 2026-10-08  
Owner: **KFB Asset Registry / Asset Librarian**  
Repository: `georg-doc/kayfabizarro`  
Review branch: `planning/asset-librarian-external-3d-search-r1-2026-10-07`

## Outcome

The existing owner-private KFB Asset Librarian now has an additive **External 3D** lane. It searches the current `3d.shep.bot` service directly and keeps every result visibly outside the canonical Registry.

The implemented flow is:

`Search → Compare up to 4 → Inspect source → optional 3D preview → Add to Intake`

The browser prepares metadata only. It does not download or register arbitrary remote files.

## Existing Site updated in place

- Site project: `appgprj_6ac1afef08148191b62b95f184bf845e`
- Site URL: `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=external-search`
- Site source commit: `d7ab24e16d6da8a5c541a112a0f8ba4e08c1b80c`
- Site version: **9**
- Deployment: `appgdep_6ac80f0659b08191ba527326295e5a75`
- Audience: unchanged, owner-only custom access

## Implemented browser contract

- current provider-backed search through `GET /v1/search`;
- provider list through `GET /v1/providers`;
- provider/title/author/source page;
- provider license claim and attribution claim;
- free/paid and downloadable/link-only state;
- formats, resolutions, polycount, rigged and animated claims;
- 2–4 candidate comparison surface;
- explicit source inspection;
- explicit, user-triggered GLB/glTF preview only;
- browser-local `kfb.external-asset-intake/1` queue;
- `measuredHeight` and `scaleHint` fields;
- five-minute session cache;
- fail-soft behavior that leaves Registry browse and local data untouched.

## Agent/tool contract

The existing KFB `search_assets` tool remains canonical and unchanged in meaning. Four separate external tools were added:

- `search_external_assets`
- `get_external_asset`
- `list_external_asset_providers`
- `prepare_external_asset_intake`

`prepare_external_asset_intake` returns metadata only and marks the next gate as:

`trusted-download-hash-source-isolation-3d-proof-registry-build`

## Proven real candidate

- External ID: `threedassets:stylized-trees-and-rocks-kit-pine-columnar-55ce0610`
- Title: `Stylized Pine Tree Tall (Stylized Trees and Rocks Kit)`
- Source page: `https://3dassets.dev/assets/stylized-trees-and-rocks-kit-pine-columnar-55ce0610`
- Provider license: `CC0 1.0 Universal`
- Download: one self-contained GLB, **26,580 bytes**
- SHA-256: `c8c072ea3ab67c066713f5e6b21cb6eca79f46346e6e4f2da17aaad47bb70d04`
- Stored review path: `media/public_domain/threedassets/stylized-pine-tree-tall.glb`
- Sidecar: `media/public_domain/threedassets/stylized-pine-tree-tall.glb.license.json`
- Verified dimensions: `2.300 × 4.454 × 2.187 m`
- Geometry facts: `161 triangles · 447 vertices · 2 meshes · 2 materials · 1 embedded texture`
- Rig/animation: none reported and none required for this static prop
- Scale direction: source uses metres; start at scale `1.0` for metre-based K2 scenes, with a target height of `4.454 m`, then validate against the receiving scene.

The isolated file loaded successfully in the Site's real 3D preview. A minimal Registry build registered exactly one `model-3d` record with embedded dependencies and explicit-sidecar rights evidence. The normal `search_assets` path found it by title.

## Preserved behavior

Browser QA proved that the External 3D lane leaves these existing browser-local records byte-for-byte unchanged:

- Asset Saved Set and notes;
- Style Reference cards;
- Style Reference set and notes;
- saved principles/tags in the Style Reference record.

Existing Registry browse, 3D thumbnails, Assets, Motions, Saved Sets, Intake and Style References remain available. The Site still has one project and one owner.

## One remaining blocker

The review branch contains the real CC0 GLB and its validated sidecar, but the binding handover forbids a merge to `main` without Georg. Therefore the generated `bot/asset-registry-update` branch cannot yet include this new file, and the production Site cannot yet prove **ordinary Live Registry search + handoff** for the imported copy.

Everything before that gate is proven. No second Registry, Site, Cloudflare surface or browser write path was introduced.

## Planned next slice · private audio intake bridge

Draft PR #380 remains the prepared next job. Do not fold it into this external-search review.

Execution order after Georg closes the External Search gate:

1. reuse the existing authenticated KFB Production Inbox;
2. implement the shared `kfb.asset-intake.v1` contract;
3. add a public-safe metadata-only private projection;
4. merge public Registry records with the private projection in Librarian Live;
5. add audio metadata and authorized preview resolution;
6. prove `upload song → registry refresh → Live Librarian` without a Site redeploy;
7. repeat once with image/texture or ZIP to prove the contract is not audio-only.

No new Site, Registry or Inbox backend is planned.

## Exactly one next gate

**GEORG REVIEW → OPTIONAL MAIN MERGE → LIVE REGISTRY REFRESH → VERIFY THE PROVEN PINE THROUGH ORDINARY LIBRARIAN SEARCH/HANDOFF**
