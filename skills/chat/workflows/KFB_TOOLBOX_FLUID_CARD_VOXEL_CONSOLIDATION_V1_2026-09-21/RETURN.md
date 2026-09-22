# RETURN · KFB ToolBox Fluid / Card / Voxel · F1 source census refresh

**Date:** 2026-09-22  
**Status:** **F1 SOURCE CENSUS COMPLETE · NO MODULE PROMOTION**  
**Owner:** KFB ToolBox source/module packaging; receiving products retain runtime ownership  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `toolbox/fluid-card-voxel-f1-source-census-2026-09-22`  
**Start base:** `1ff35a63cbc6608d9d2f7a79ce5d6f0f17c55ac5`

## Outcome

F1 did not build another ToolBox runtime. It reconciled the new 2026-09-22 full sources against the older extraction attempts and current KFB owners.

The machine-readable result is [SOURCE_MATRIX.json](SOURCE_MATRIX.json):

- **28 decisions**
- **11 ADAPT**
- **10 KEEP_INTAKE**
- **7 REJECT_DUPLICATE**
- **0 PROMOTE**

Zero PROMOTE is deliberate. The census found existing owners and better source donors; promoting another copy would recreate the fragmentation this slice is meant to remove.

## Binding source decisions

### Card Zone

The current donor truth is:

`tools/KFB-ToolBox/_inbox/KFB Card Zone Lab v2/card-zone-lab-v2-full_2026-09-22/`

App blob: `e7bb09e49b2a885eb076e8c43c0ff561a9cebb72`.

The older `card-zone-lab-v3` app blob `43eea82f…` is historical, not a competing current source.

Named-method comparison old → current proves **29 source methods byte-identical**, including:

- `buildFluidSurface` / `layoutFluid`
- `buildProjection` / `updateProjection`
- `faceTexture` / `buildCardCube`
- `buildStack` / reveal/tick methods
- seed/baseline/signature/apply methods

The only named change in this audited set is `buildCard()`: the current source explicitly uses `media/kfb/kfb-index.json` first and `index.json` as fallback.

### Fluid

- old `kfb-fluid-v1`: **REJECT_DUPLICATE** as a promotion candidate; documented wrong shader path;
- repaired `v1.1`: **REJECT_DUPLICATE** as a current implementation candidate; retained as forensic history;
- StoryMap `kfb-fluid-v2/card-zone-v2-fluid-source.js`: **ADAPT**.

The important reason: F1 proves that the current 2026-09-22 Card Zone `buildFluidSurface/layoutFluid` source blocks are unchanged from the donor block that fluid-v2 copied. The seam remains useful, but its provenance metadata should be refreshed before any canonical ToolBox packaging.

### Three water jobs, not one shader

1. **Card Zone flow fluid** — `waterdudv.jpg + water.jpg`, ShaderMaterial, river/flow vectors, foam constructively off.
2. **Voxel Zone S2 shore water** — `water.jpg + waternormals.jpg`, MeshStandardMaterial + height DataTexture, active shoreline foam.
3. **Travel/TinySkies macro water** — ocean/coast/shallow/deep water + atmosphere; Travel remains runtime owner.

Do not collapse these into one universal water implementation.

### Voxel visual language

The old `kfb-voxel-world-v1` package is an exact mirror of the current Card Zone terrain blobs and is **REJECT_DUPLICATE** as a separate owner.

The more useful current visual donor is the exact 2026-09-22 **Voxel Zone S2** source:

`tools/KFB-ToolBox/_inbox/KFB Voxel Zone S2/voxel-zone-s2-full_2026-09-22/`

It is **KEEP_INTAKE** for a later isolated visual comparison with a real KayKit Hex tile. It does not own Hex layout, Travel terrain, character rigs or gameplay.

### Texture Browser

The exact 2026-09-22 browser stays **KEEP_INTAKE**:

`tools/KFB-ToolBox/_inbox/KFB Textur-Browser/texturbrowser-full_2026-09-22/`

Its 86-texture contact sheet, A/B voxel preview, rating state and JSON export are useful authoring behavior. Asset Registry/Librarian remains the source/provenance owner.

## Owners preserved

- Asset Registry/Librarian → asset identity/provenance.
- `skills/kfb-box-material.js` → existing KFB voxel/box material implementation.
- `skills/kfb-card-builder.js`, `skills/kfb-ink-canon.js`, `skills/kfb-card-format.js` → card content/ink/format.
- Storytelling Maps `CARD_RIG_V1.md` → current responsive rounded physical 3D CardRig.
- Travel `world-palettes.js` → named world palettes and macro world/terrain/water receiver.
- Card Zone / Voxel Zone / TinySkies remain donors for their specific visual jobs, not new global owners.

## Evidence

Static/source audit:

- **66/66 relevant assertions PASS**
- Git-blob identity checks include current Card Zone, old donor, fluid-v2, Texture Browser, Voxel S2, canonical card/material sources, CardRig contract, T2 donor, palette owner and Registry.
- Duplicate checks prove the canonical card/material files are byte-identical to their export copies.
- One branch-drift sentinel triggered during the audit; follow-up **3/3 PASS** proved current-main drift is Combat-only and does not touch F1 sources.

Browser/WebGL: **0 by F1 scope**.  
Runtime files changed: **0**.  
Stage/public files changed: **0**.

No new Cloudflare URL is claimed for F1. The existing ToolBox remains unchanged:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

## Dropbox

Read-only cross-check confirmed the current Card Zone, Texture Browser and Voxel Zone S2 exports by path and byte size. No copy, move, delete, rename or upload was performed.

## Exactly one next gate

**F1.5 · Card Zone v2 source-isolation proof**

Publish the **unmodified 2026-09-22 full Card Zone source** in one isolated ToolBox Stage candidate and prove, from the source object itself:

1. original DudV fluid path and no grey foam regression;
2. real CardStack + reveal;
3. real Sky Card/projector beam;
4. Card Cube + its existing HTML/canvas face source object.

Only after that source proof should module extraction/comparison resume.
