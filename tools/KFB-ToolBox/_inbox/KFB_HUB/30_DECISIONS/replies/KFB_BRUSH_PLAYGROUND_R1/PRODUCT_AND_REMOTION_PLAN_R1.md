# KFB Brush Playground R1 · Browser Paint Editor + optional Comic (Re)Motion
2026-10-21 · DESIGN / OWNER INTAKE · NOT IMPLEMENTED · NOT PUBLIC

## Outcome and authority
Georg requests a usable browser paint editor, not just a promo gallery: visitors draw with his own Procreate brush simulations, then export art. Also design an interface to his 2,000+ brush library, e.g. Dropbox DEV BRUSHES, and a later optional Comic (Re)Motion bridge. Persist concept additively; this document does not grant public asset distribution, a new runtime owner, Site, deployment, canon change, or merge.
Existing KFB ToolBox / asset-authoring owner is planning receiver; WS0 routes to current responsible product/animation owner before implementation. Do not replace KFB animation/3D runtime or create a new KFB Cloud workspace.

## Fresh references and proven discoveries
- GitHub routing: skills/chat/START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md (main).
- External source: https://github.com/acamposuribe/p5.brush . MIT (LICENSE.md), npm 2.2.4 at review. Standalone `p5.brush/standalone` requires WebGL2 and no p5.js; HTMLCanvasElement/OffscreenCanvas supported; explicit render() at draw-pass end. Version/commit pin and retain license notice.
- Three uploaded examples (private, not committed): The_PASTEL.brush; The_ACRYLOID_dry_2.0.brush; The_CRAYONIC (1).brush. Initial archive inspection reported ZIP Brush.archive + embedded Shape.png; ACRYLOID additionally Grain.png; Procreate archived dynamics are not a public interoperable spec and rendering equivalence is unverified. Do not publish originals, embedded tips, thumbnails or derived stamp data.
- Dropbox connector checked user-supplied link https://www.dropbox.com/scl/fo/xwxda6ttrci43r393t4ke/AKDc6vGBLPK6mEoY-P0Xghg?rlkey=otl190n4ohbyqere1kc5mk37u&dl=0 . Link metadata: folder DEV BRUSHES, connected account path /dev brushes, public audience, allow_download=true, access_level=edit. This visibility is **not permission to syndicate or copy brush files into KFB public app**. list_folder('/DEV BRUSHES', nonrecursive, max_results=100) returned 100 entries, has_more=true; examples The_WATERLINSKY.brush, The_WATTERSON_2.0.brush, The_UDERZO_Letter_Pen_2.1.brush, The_ACRYLOID_INK_2.0.brush, The_DRY_BRUSHY_2.0.brush, BETA folder. TOTAL UNVERIFIED: do not assert 2,000 entries are present in that specific folder. No exhaustive pagination, no asset downloads.
- KFB WS1 game implementation uses R3F/Three/Rapier; do **not** import this runtime into a brush editor merely for UI.

## MVP · smallest coherent playable editor
1. Isolate each real original brush tip; validate stamp orientation, alpha, dynamic range and license before adapter integration. A downloaded file path alone is not donor parity.
2. Browser Pointer Events for mouse/touch/stylus, pressure where exposed, deterministic fallback where absent; adjustable color/size/opacity, brush switch, eraser, undo/redo, clear.
3. Drawing state separated from renderer; local-first storage and an explicit bounded stroke schema, with pressure/tilt/time, palette, seed, brush manifest version and coordinate basis. No account or telemetry required.
4. Exports: transparent/opaque PNG at selected resolution; preserve artwork even when source catalog entry changes; indicate fidelity as SIMULATION, never 'native Procreate renderer'.
5. Art-quality proof: compare three simulated strokes against human-created Procreate reference strokes for same brush/path/pressure; check dry media, grain, edges, transparency and speed/pressure; document fidelity gaps rather than fabricate 1:1 reproduction.
6. Browser checks: WebGL2 fallback, memory caps, responsiveness, Safari/iPad pencil behavior when hardware available, pointer/touch, accessible tool controls, export correctness and seed/replay stability.

## Dropbox → curated brush catalog, NOT bulk import
- Connector-mediated metadata discovery with folders/pages/cursors and incremental indexing; preserve Dropbox file id/path, version or content hash where accessible, filename, category, source namespace, preview permission, brush format and availability. Do not invent permanent direct download URLs or embed shared-link tokens in published app/code.
- Private ingestion or local user-controlled import converts .brush ZIP → metadata/shape/grain diagnostics. Separate SOURCE / PRIVATE WORKING / PUBLIC LICENSED DEMO assets.
- Curate brush packs/tags/search/filter; use previews only after owner approval. Missing grain presets and vendor-specific settings are fidelity issues, not automatic fallback to generic brush without label.
- Release policy: explicit allowlist per brush/pack, perhaps a small public demo tier and non-reconstructive thumbnails. Preserve monetizable original commercial brush assets; browser-distributed texture data can be extracted by end users, so choose preview/render architecture and derivative licensing intentionally.
- Sync: detect new/changed/deleted Dropbox items via refreshed metadata, reconcile identities and versioned presets; no automatic public publishing or replacing active presets from folder changes. Catalog count reported as confirmed scanned and pagination status, not guessed 2,000.
- Runtime visitor app MUST NOT need user's private Dropbox connector or expose OAuth tokens; catalog built through authorized owner-side publishing workflow, then app consumes published approved manifest only.

## Deferred optional Comic (Re)Motion bridge · NOT an MVP blocker
- Capture ordered stroke events: brush version, XY, time, pressure/tilt when available, seed, colors; explicit fps-independent timebase.
- Deterministic frame render → alpha PNG frames / brush masks / WebP sequence; potential ink-reveal, restrained hatch boil, figure-motion-following gesture accents and transitions. Integration only via existing animation owner and source-authentic comic art; no recoloring or AI-replacing drawings.
- 'Comic (Re)Motion' is KFB's creative pipeline name; this **does not imply** existing code runs remotion.dev. Detect actual pipeline/owner before adding adapter.
- Test with real approved comic layer and reference animation: alpha pixel parity, stroke timing and frame-repeat determinism, resolution, memory/render budget, no popping, no replacement character motion runtime.

## Product phases & acceptance
A. Owner/source/fidelity inventory + isolate three approved brushes, inspect current ToolBox and comic animation modules (no new visible chrome).
B. Single-brush playable vertical slice: draw, undo, erase, png, deterministic sample; capture real browser proof.
C. Three-variant original sample brushes + approved catalog selection / Dropbox metadata pipeline; export and comparison suite.
D. Optional animation export and Comic (Re)Motion receiving-owner test after paint MVP.
Public delivery primary existing GPT Site if applicable; Cloudflare only if named formal Stage required, after integration and approval. No product URL is authorized in this design.

## Gates, risks, current test truth
CURRENT: design only. 0 production editor tests, 0 input device tests, 0 source-isolated rendered browser demos, 0 Comic (Re)Motion tests, 0 public Stage/Site validations. GitHub/Dropbox source discovery is documentary evidence only.
Unresolved: actual KFB brush-tool owner and animation owner paths, exact p5.brush fidelity against Procreate, ownership and accessibility of all 2,000+ assets, per-brush public distribution permissions, missing proprietary grain references, Apple Pencil platform behavior, real rendering performance.
One next gate: WS0 identify existing ToolBox brush authoring and Comic (Re)Motion owners and authorize one isolated CRAYONIC drawing/export vertical slice with **private source** and source-isolated visual proof, before any public asset or Site release.

## Additive R1.1 · 2026-10-21 · .brushset + older MegaPack source
Georg supplied `GvW_Comic_Ink_Brushes_02.brushset` (private chat file) and pointed to an older historical MegaPack Dropbox folder.

### Actual local brushset container check
- Source file name: `GvW_Comic_Ink_Brushes_02.brushset`; 21,637,576 bytes; valid ZIP.
- ZIP entries 213; 42 `Brush.archive` (21 active + 21 under `Reset/`), 21 active `Shape.png`, one active `Grain.png`, and `brushset.plist`. All 21 active archives begin with binary plist signature. Neither 42 archives nor 170 PNGs represent 42/170 unique brushes.
- Treat active vs Reset resources separately. Stable import ID should include source set identity, per-brush UUID, and archive content digest; avoid duplicate reset brush counts.
- Validation must safely reject zip-slip paths, compressed archive bombs, malformed plists, untrusted filenames/nested archives and huge textures; cap count, decompressed size and decoded pixels. Preserve group/order metadata when present.
- Reader API: `brushset → inspect bundle → 21 brush records → shape/grain asset-resolution + archived dynamics → normalized private registry → selected simulation variants`. Make importer compatible with single `.brush` and `.brushset`, without leaking brush binaries/shape textures into public bundles.

### Second Dropbox source · historical MegaPack
- User shared https://www.dropbox.com/scl/fo/hf1uvd0swkncvbfp2uvo6/AHObs4VfBv3yMoObF36AauI?rlkey=5unj3mgsqzcykyhe3f5bnsnfx&dl=0
- Connected Dropbox shared-link lookup resolves to folder `Georg's Procreate MEGAPACK Brushes & Swatches  In Order`, path `/georg's procreate megapack brushes & swatches  in order`, audience public, download allowed, access_level edit. No contents scan, asset download or exact item count done; older release version per Georg.
- Catalog must support multiple source roots and historical lineage: sourceRoot, packVersion, setId, brushId, slug, original title, hash, canonical/superseded status, format, provenance, effective license/public-demo approval.
- Resolve duplicates by real identity/content hashes, NOT only names. Distinguish same-named revised presets and older variants. Swatch files are palette sources, not brushes. Never automatically overwrite a newer brush with old MegaPack data.
- Protect public site from edit-capable Dropbox link/token leakage, and do not embed original commercial brush or derived stamp files without Georg's explicit distribution policy.

### Extended gate
This is a source-inspection and design-only increment, not a production import. Keep the original single next gate: WS0 owner routing + private source-isolated CRAYONIC draw/undo/PNG vertical slice. .brushset batch parser and multi-root catalog are immediate successor phases, Comic (Re)Motion remains optional after working paint export.

## Additive R1.2 · Notion editorial catalog / georgbrush.club · 2026-10-21
User confirms georgbrush.club is built using Notion, with pack descriptions and brush metadata. Existing public site remains authoritative brand/product surface: **do not replace or publish a duplicate site**.

Notion connector source read:
- Knowledge Base https://app.notion.com/p/3fa0bb06e5ee4f22b2b4cd3730097530 (content largely historical, including 2020 product figures/prices; NOT proof of current sales claims).
- Individual brush DB https://app.notion.com/p/9945d77ecf5c42219d4c65d399403f97 ; data source `collection://f7480942-36ad-4689-8d94-10f8515d082a`. Schema includes relation `.brushset` to Sets, Tags (Ink, Marker, Pastel, Watercolour, Acrylic, etc.), Link, Rank and Size; source detail pages may contain strokes, screenshots, videos, cheat sheets, reference art.
- Sets DB https://app.notion.com/p/4b0ccd5869fe456fa491ebc046ae5f09 ; data source `collection://41acd22c-8d19-4a53-9582-563ca557e8c9`. Includes Brush Set, Brushes count, relation Brushes Ref., MegaPack Version, Status, File List (PDF), Stand-alone set and Event/Update.
- Swatches DB https://app.notion.com/p/498009d4f6e847c79b2c6a84c231da8f ; data source `collection://89e752ed-bea8-4a80-a263-057ed3dbdf5e`, with Color Palette, Tags, Size, Update.
- Notion history describes 1800+, 50+ sets and 160+ swatches in earlier editions; these are *historical labels*, not a verified current 2000+ count.

**Ownership/data split**: Notion = editorial product story, taxonomy, brush→set relations, previews and demo evidence; Dropbox/.brush/.brushset = private binary source/provenance; exported approved manifest = only browser-consumable catalog; georgbrush.club = existing public brand and primary commercial destination. Never expose Notion credentials, private property fields, Dropbox tokens/edit links, or copyrighted brush tip assets in public bundle by default. Reconcile metadata by stable Notion page IDs, source file IDs/hashes, brushset membership, releases, not filename alone. Match missing/ambiguous brushes via reviewed mapping rather than guessing; preserve old historical entries. Curated demo may link back to exact existing Notion page and current verified sales link rather than publish stale $15 claims.

**Pilot success criterion extension**: isolated CRAYONIC visual parity + draw/undo/PNG remains first runtime gate; add Notion read-only lookup of one real brush and owning set during intake to prove semantic metadata → source archive mapping, no complete 2k sync yet. Optional later Comic (Re)Motion channel unchanged.
