# KFB Environment Atlas Site 01 · Work execution brief

Status: **PREPARED FOR WORK · IMPLEMENTATION NOT STARTED · NO STAGE / NO LIVE CLAIM**
Date: 2026-10-04
Execution mode: **ONE_SHOT**
Workflow: `KFB-ENVIRONMENT-ATLAS-SITE-01`

## 0 · One named lane

- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/kfb-environment-atlas-site-prep-2026-10-04`
- Base when opened: `9c2fee62b815f19cf967867f54985bd22e3f222b`
- Runtime/data owner: existing `tools/world_atlas` — **do not create a second World/Environment/Hex owner**
- Asset truth owner: existing `registry/assets/v1` + Asset Librarian — **do not create a second asset library**
- Clay visual truth: current Clay Style SSOT on `work/clay-style-ssot-2026-10-01`
- Human Stage reserved: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/environment-atlas-site/`
- Existing `https://kayfabizarro.pages.dev/world-atlas/` remains unchanged until the new candidate passes the named human gate.
- Work continues **this branch and this PR**. Do not fork a second implementation branch.

## 1 · Outcome

Build a Site-native KFB Environment Atlas surface that makes the **full useful Claude Design project lineage** impossible to miss:

1. the complete verified Hex catalog, including all three KayKit Hex-capable families plus the separate Kenney Hex family;
2. KayKit + Kenney building families from the central Registry and exact repo-backed sources that are not yet registry-indexed;
3. the accepted/current clay-deformation standards as a **visual SSOT**;
4. exact connector/edge/rotation/provenance knowledge already measured in the Hex/World work;
5. the complete reusable Environment Atlas project corpus: S11/S12/S13.x, S14–S17 Bits/Space/Restaurant, S18/S19 Plant Prop + EyeRig, S20 Sample Atlas, S21 Room Study/Editor, S22 wall-node/postmortem line, plus earlier still-useful active donors;
6. a versioned map to current Environment/Generator/Recipe donors so later consumers reuse them rather than rediscovering them.

This is a **catalog + visual-standard + provenance surface**, not a new game runtime, city generator, WorldBuilder, Asset Librarian or universal deformer.

The Site should be available as a ChatGPT Site for cross-GPT work, while human acceptance remains the direct Cloudflare Stage route linked from KFB Hub. Record the real ChatGPT Site URL only after Work actually creates it. Never invent a Site URL.

## 2 · Read first, in this order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this brief + `SOURCE_MAP.json` + `PROJECT_CORPUS_AUDIT.md`
5. `FULL_PROJECT_EXPORT_REQUEST.md` so missing project runtime files are recovered rather than reconstructed
6. `tools/world_atlas/README.md`, `PROMOTION.md`, `docs/FEATURE_PARITY.md`, `docs/ARCHITECTURE.md`, `source/lib/hex-grid.js`
7. mandatory current project pages: `source/KayKit_Hex_Realm_S11.html`, `source/KayKit_Hex_Tile_Model_S12.html`, `source/KayKit_Dungeon_Generator_S13_2.html`
8. current R2C:
   `tools/KFB-ToolBox/_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01/START_HERE.md`
   and `docs/RETURN.md`
9. Clay:
   - `tools/KFB-ToolBox/docs/CLAY_BUILDING_FACADE_ROUTER.md`
   - `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`
   - `work/clay-style-ssot-2026-10-01:tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md`
   - `work/clay-style-ssot-2026-10-01:tools/KFB-ToolBox/docs/KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`
10. visible-source firewall:
   `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/MVP_VISIBLE_SOURCE_FIREWALL_2026-10-04.json`
11. measurement corpus:
   `tools/KFB-ToolBox/_inbox/KFB Hex Assets Worldbuilding (WIP Exporte WS1)/kfb-hex-worldbuilder-corpus_2026-09-22/PACK_TRUTH.md`
12. current later-project exports listed in `PROJECT_CORPUS_AUDIT.md`, especially Plant Prop S18/S19, S20/S21 and S22
13. failed 2026-09-20 Hex Atlas only as measurement/recovery evidence, **not** as a scene/UI design instruction.

## 3 · Source identity before UI

### 3.1 Hex families currently proven in GitHub

The user supplied the exact missing third KayKit source. The current Hex shelf is therefore:

| Role | Source | Current count/status | Important evidence |
|---|---|---:|---|
| KayKit Hex A | `kaykit-medieval-hexagon-pack-1-0-free` | 240 Registry assets | current structural Registry; World Atlas S11/S12; R2C |
| KayKit Hex B / Builder | `kaykit-medieval-builder-pack-1-0` | 233 Registry assets | unpack receipt has 226 GLB; 128 Builder hex tiles measured 2 × 2.309 |
| KayKit Hex C / Snow | `media/3D_Assets/Kaykit_Medieval Snow Biome/` | Registry pending · source proven | pin `ab65e8c46ca3c07db4294214a63384975fb7d0d9`; 57 GLB = 42 Hex tiles + 15 objects; license identifies `Medieval Builder Pack Patreon Bonus (1.0)` |
| Kenney Hex | `glb-hexagon-kit` | 72 Registry assets | separate secondary family; `kenney_hexagon-kit` is a duplicate alias, not another pack |

**Correction:** the three KayKit Hex-capable families are now source-resolved. Kenney is additional, not the third KayKit family.

The Snow Biome has no current dedicated Registry shard. Work must reconcile/index this exact existing repository source through the normal Registry/Librarian mechanism, or expose it as `SOURCE_PROVEN / REGISTRY_PENDING` until that completes. No local second catalog.

### 3.2 Pack-qualified keys are mandatory

The same basename can exist in more than one pack. `hex_water` exists in both KayKit Hexagon and Builder families.

Use identity equivalent to:

`packId | assetId/path | source commit/blob`

Never key the catalog only by basename. The earlier basename-only approach silently overwrote one `hex_water`; that failure is already documented in `PACK_TRUTH.md`.

### 3.3 Geometry facts that must survive

- KayKit Medieval Hexagon grid: pointy-top, 2.0 × 2.309, tile top y = 0.
- Builder hex family: all 128 measured hex tiles use the same 2 × 2.309 module.
- `TILE_EDGES`, edge classes and rotation/solver truth come from the existing `hex-grid.js`; do not re-derive them from screenshots.
- Existing edge-atlas recovery evidence reports 32 tiles checked against `TILE_EDGES`, 99.5% edge accuracy / 96.9% tile accuracy in that bounded measurement, plus a 144-tile schema-v3 table with 126 full / 17 partial / 1 none coverage. Treat this as evidence with its stated limits, not as a blanket PASS for every newer pack.
- Hexagon vs Dungeon grammar remains distinct: Hex features sit on the tile; Dungeon walls/features can sit on the seam/fuge.

## 4 · Building catalog scope

The Site does not hard-code a closed hand-written list. It reads current Registry shards and exposes building-bearing KayKit/Kenney packs with exact paths/provenance.

Initial verified pack shelf must include at least:

### KayKit
- `kaykit-city-builder-bits-1-0-free` — 45 Registry assets; includes `building_A…H` and `*_withoutBase`.
- `kaykit-medieval-builder-pack-1-0` — 233 Registry assets.
- `kaykit-medieval-hexagon-pack-1-0-free` — 240 Registry assets, including coloured building families.
- KayKit Medieval Snow Biome / Builder Patreon Bonus — exact repo source, 15 object/building/nature GLBs plus 42 Hex tile GLBs; Registry reconciliation required.

### Kenney
- `kenney-building-kit` — 84
- `kenney-castle-kit` — 86
- `kenney-city-kit-commercial-2-1` — 48
- `kenney-city-kit-industrial-1-0` — 34
- `kenney-city-kit-suburban-20` — 49
- `kenney-factory-kit-3-0` — 148
- `kenney-fantasy-town-kit-2-0` — 168
- `kenney-modular-buildings` — 115
- `glb-hexagon-kit` — 72, including its building/unit family

Roads, cave/dungeon modules and environment-only pieces may appear under Connectors/Environment but must not be mislabelled as buildings.

Counts are discovery facts from the current Registry revision, not immutable product constants. The Site should render current Registry counts and source revision.

## 5 · Visual SSOT: deformation is evidence, not a slider preset

The Site must make the Clay Golden protocol visible and reusable.

For every deformation-capable building family use this evidence layout:

`UNCHANGED SOURCE | LOCKED GOLDEN | CURRENT CANDIDATE | CONTACT/EDGE CLOSE-UP | COST`

### Current building truth

- Master Golden: KayKit `building_A`.
- Golden support: KayKit `building_E`.
- Mixed real OSM group + one Kenney building: **PREPARED / NOT GOLDEN** in the current Golden matrix.
- New-stage implementation baseline: K2 `clay-material.v10.js`, `clay-relief.v4.js`, `clay-toolmix.v1.js`, shared `clay-profiles.v2.js`.
- Exact Golden reproduction remains K1/H0 v8 until v10 parity is visibly proven in the locked comparison.
- Fixed `building_A` gate: 6 m camera, 30° elevation, K1 light; soften `maxEdge 0.18`, max 3 stages, `maxTris 90000`; order soften → seed geometry → material; v8 `house` profile; Hand 0.5, tile 1.6, print 4.5 against real scale.
- No bend, mega-mesh merge or base-plate concealment before that gate passes.
- LOOK-TORSION is **architecture-pass only**: keep anchored base + cumulative height-dependent field + roof/body coherence. There is no globally accepted single twist/bend angle.

Each catalog item must therefore expose a typed deformation record, for example:

- `deformationProfileId`
- implementation version
- Golden/source reference
- status: `GOLDEN | GOLDEN_SUPPORT | SOURCE_ONLY | TUNE | FAIL | NOT_TESTED`
- parameters actually used
- source object identity
- evidence view(s)
- performance facts if measured

Missing evidence must render as `NOT_TESTED` or `SOURCE_REQUIRED`, never as a generic deformation fallback.

## 6 · Required Site views

### A · Hex Catalog
- pack-first navigation;
- visual tiles/parts, exact source ID/path/ref;
- family/role tags;
- dimensions, top/support facts when measured;
- six-edge connector display and rotation;
- source object in isolation;
- aliases/dedup visible;
- filters for pack, role, edge class, connector count, full/partial/non-tile.

### B · Buildings
- creator → pack → family → asset;
- source object alone;
- SOURCE/GOLDEN/CANDIDATE comparison when a Golden/candidate exists;
- `withoutBase` variants surfaced explicitly;
- deformation status/profile;
- source-native details/anchors/connectors preserved.

### C · Standards
Human-readable cards for:
- Clay Style SSOT / Golden matrix;
- façade/deformation ownership;
- shadow/contact recipe;
- visible-source firewall;
- donor scope `MECHANISM/PRESENTATION/CONTENT/DATA`.

This view links to canonical source docs; it does not duplicate their bodies into a divergent local standard.

### D · Connectors
- `TILE_EDGES` and solver truth;
- rotations;
- pack-qualified identity;
- tile-vs-fuge grammar;
- explicit `UNSPECIFIED` where no connector is actually proven.

### E · Project Atlas / Slices
The Site must expose the project lineage as a first-class inventory, with status and exact source:

- S11 Hex Realm;
- S12 Hex Tile Model;
- S13 / S13.2 / later S13.x Dungeon model/generator/light/props;
- S14 Bits Model;
- S15 Space Base;
- S16 Restaurant/Furniture;
- S17 Restaurant placement grammar;
- S18/S19 Plant Prop Lab, including EyeRig adapter and LivingProp rig;
- S20 Sample Atlas;
- S21 Room Study + inline editor donor;
- S22 wall nodes, room study, failure/postmortem and editor-toolbox direction;
- earlier active/frozen donors S2–S10 according to current Housekeeping.

Each row/card must say `SOURCE_PRESENT | DOC_ONLY | RECOVERY_REQUIRED | FROZEN | SUPERSEDED | FAIL_HISTORY`. Do not flatten all of them to “current”.

### F · Recipes / Generators
V1 is an inventory/provenance view, not another generator owner. Surface and classify the existing work:
- World Atlas S11/S12 Hex;
- R2C Hex-Archipel catalog/recipe;
- general `HEX_TERRAIN_GENERATOR_V1_BRIEF.md`;
- Babel Hex Platform Generator recovery/brief;
- Dungeon Generator S13.2;
- S14 compatibility model, S15 Space Base and S16/S17 Restaurant builders when their actual source is recovered;
- Plant Prop S18/S19 recipe/rig/eye adapter;
- later R2D/environment recipe slices.

### G · Plant / Living Props
Plant Prop is a named reusable project family, not generic scenery.

Expose:
- recipe/inventory;
- pattern grammar;
- STATIC / AMBIENT / AWARE rig levels;
- `plant-eyes.js` dependency on existing KFB EyeRig v6;
- pot/crown/float FaceHost logic;
- current proofs, source refs and open risks.

Do not create another EyeRig owner.

No repository artifact named literally “Data Generator” was found during this preparation pass. The full-project capture now provides the correct place to map that phrase against S14–S22 and later environment-generator work. Resolve it by exact source identity before labelling it; do not invent a new generator.

## 7 · Asset Librarian relationship

Asset Librarian remains the broad source/discovery owner.

Environment Atlas Site is the environment-specific semantic/visual projection:

- Asset Librarian answers **what exact asset exists and where**.
- Environment Atlas answers **how environment/hex/building assets connect, which deformation standard applies, and which evidence is accepted**.

Consume Registry data directly or through a thin adapter. Do not copy 15k asset records into another hand-maintained catalog.

## 8 · Source-isolation gate — mandatory

A loaded asset URL is not donor proof.

Before integrating any family into the visual standard, show:

1. exact real source object/group unchanged;
2. same source with clay adaptation, if applicable;
3. close roof/façade/base or connector view;
4. integrated environment view only after 1–3 are proven.

Every source card must show exact repository path + pinned source revision/blob where available.

## 9 · Legacy/OSM contamination firewall

The current MVP postmortem is binding.

Default-denied visible paths:
- `fixtures/huerth-b1-siblings-v0.json`
- `tools/osm-city-lab/`
- `elastic-grotesque-clay-huerth01`

Their mechanisms may be referenced only where the donor scope explicitly allows MECHANISM reuse. They must never silently become preview buildings, default fixtures, samples or fallback content for this Site.

**No fallback-to-legacy rule:** if a requested source is missing, render `SOURCE_REQUIRED` / `NOT AVAILABLE`. Do not substitute an older OSM/Hürth asset or generic box.

## 10 · UI / presentation

Reuse the existing KFB ToolBox / Asset Librarian / World Atlas visual language and components where verified.

Do not introduce:
- generic SaaS dashboard chrome;
- replacement branding;
- fake thumbnails;
- placeholder meshes;
- a second asset-search implementation when the Librarian/Registry already supplies it;
- a second 3D world runtime.

The key interaction is inspection and comparison, not card-wall decoration.

## 11 · Acceptance contract

### Source/catalog
- all three KayKit Hex-capable families resolve from exact source; Snow may be `REGISTRY_PENDING` until central indexing completes;
- Kenney Hex is presented as a separate fourth/secondary Hex family;
- no duplicate `kenney_hexagon-kit` / `GLB_hexagon_kit` presentation as two packs;
- S11, S12 and S13.2 are explicit mandatory project modules, not buried source links;
- S14–S17 actual source is recovered from the full project export or explicitly remains `RECOVERY_REQUIRED` — never reconstructed from prose;
- every rendered model card has exact pack + path + source revision;
- no basename collision can overwrite another pack.

### Visual SSOT
- `building_A` shows unchanged SOURCE and locked Golden before candidate;
- `building_E` Golden-support path is discoverable;
- at least one real Kenney building is shown unchanged in isolation;
- no Kenney result is labelled GOLDEN without Georg's explicit promotion;
- contact/shadow close-up follows shared recipe;
- no universal torsion number is presented as accepted KFB truth.

### Firewall
- automated scan/test proves banned Hürth/OSM visible source patterns are not loaded by the Site candidate;
- missing source never falls back to legacy/generic content.

### Project completeness
- `PROJECT_CORPUS_AUDIT.md` is rendered/represented as project inventory;
- Plant Prop S18/S19 including EyeRig is discoverable as a named reusable family;
- S20/S21/S22 are represented with their current source/status;
- a fresh Full Project Export is reconciled before final completeness if S14–S17 source remains missing.

### Browser
Return actual counts, not “looks fine”:
- data/index tests;
- identity/dedup tests;
- source-isolation render tests;
- Chromium/WebGL route checks;
- console/page error count;
- desktop + narrow viewport proof.

### Site/Stage
- create the actual ChatGPT Site and record its real URL/revision;
- publish the candidate to the reserved Cloudflare Stage route;
- link that direct Stage route from KFB Hub;
- open the exact Cloudflare Stage URL and visibly confirm the expected revision before `PUBLIC_VERIFIED`;
- do not replace the existing `/world-atlas/` route or promote Live before Georg's named gate.

## 12 · Git checkpoints

Use the same branch/PR throughout.

1. **Implementation checkpoint**
   - Site source, Registry adapter, Hex/Building views, comparison renderer.
   - Fetch exact branch head + intended files after the write.
2. **Tests/evidence checkpoint**
   - source audit, dedup/identity tests, visual/browser proof, screenshots.
   - Fetch exact branch head + intended files.
3. **Return/metadata checkpoint**
   - project Return, additive changelog, central router, KFB Hub, Production Control Return.
   - Fetch exact branch head + intended files.

A timeout is `UNKNOWN`, not success. Inspect ref/file/workflow before retry.

## 13 · Stop rules

Stop and preserve the candidate only for:
- real source/owner contradiction;
- missing source that blocks the required unchanged-source proof;
- two failed repairs on the same acceptance gate;
- Georg-only visual promotion decision.

Do **not** stop after every internal module. This is one Site outcome.

## 14 · Required Return

Return exactly:
- repo;
- branch;
- Draft PR;
- exact head;
- changed files;
- actual test counts;
- screenshots/browser proof;
- actual ChatGPT Site URL if created;
- direct Cloudflare Stage URL;
- unresolved source identities;
- one next gate: **GEORG VISUAL / CATALOG REVIEW**.

No auto-merge. No Live promotion.
