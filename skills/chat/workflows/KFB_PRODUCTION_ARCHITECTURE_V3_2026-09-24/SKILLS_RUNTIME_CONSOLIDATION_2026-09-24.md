# KFB Production Architecture v3 · Skills / Runtime Contracts Consolidation · 2026-09-24

Status: **P2 CONSOLIDATION PLAN · SOURCE CENSUS STARTED · NO LEGACY FILE MOVES / DELETIONS**
Owner: KFB Web Architecture lane
Parent: `START_HERE.md`

## Why this exists

The repository root `skills/` mixes several generations:

- current reusable runtime contracts;
- current documentation that still has old names;
- legacy app-specific embedding recipes;
- historical PetStudio / PatchStudio packages that still contain useful donors;
- superseded viewers/ink docs;
- asset files that are not really skills at all.

That creates a recurring failure mode:
a fresh chat finds an older complete-looking recipe and rebuilds a feature around it even though a newer runtime owner already exists.

The consolidation goal is therefore **routing, not deletion**:

```
old skill / historical app
→ classify
→ find live consumers
→ pin current owner
→ create current canonical entrypoint
→ add compatibility redirect / legacy banner
→ archive or move only when zero-consumer proof exists
```

Old applications must continue to boot while migration happens.

---

# 1 · First census findings

## 1.1 Actor embedding · old universal entrypoint is obsolete

### Legacy/general-purpose problem

`skills/EMBED_CUBE_PET_FULL_v2.2.md`
blob `9a22e423d5ba7e1783cbe73dfcdf8939d9435a1e`

is no longer a sufficient universal KFB actor-embedding instruction.

It remains relevant for the **24 canonical CubePets** and historical consumers that really use that stack.

It must not be the instruction used for:
- FrizzleBob Driver Graft;
- Goth Girl / native Rig_Medium face cleanup;
- Rig_Medium / Rig_Large / Rig_Legacy characters;
- CapsuleCarl / Wissens-Pilli;
- future vehicle/static FaceHost actors.

### Current non-CubePet embed owner already exists

`tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`
blob `5ac6d3ecb81cc2363b7eee8933e609266de77733`

already states that it supersedes the old Cube-Pet embed **for KayKit/Graft/CapsuleCarl actors**.

Current readers include:
- `mountGraft()` for the FrizzleBob Driver Graft;
- `mountCarl()` for CapsuleCarl / Wissens-Pilli;
- canonical EyeRig v6;
- current rich PetMouth/viseme owner;
- current face modules;
- material zones;
- source-face cleanup / texclean;
- one `update(dt)` lifecycle.

### CapsuleCarl / Wissens-Pilli current facts

`LIVING_RIGGING.md`
blob `fdb4fec02ff28f561883cf8721e2ae111e36f77d`

proves the current direction:
- KFB face system owns the visible mouth;
- source mouth cavity/geometry is flattened/hidden non-destructively;
- the painted original mouth region is texture-cleaned rather than left underneath;
- current mouth set = **`red`**;
- material/difficulty zones are already part of the actor config;
- texture swap per individual zone is still a real missing capability.

Therefore an embed that renders the old orange/preserved painted-mouth result is a regression.

### Goth Girl

Current GothGirl work uses the native Rig_Medium body/head plus source-head cleanup, FaceHost/EyeRig and explicit source-eye/mouth cleanup.

Do not route GothGirl through the old CubePet loader merely to obtain eyes/mouth.

### Target current actor skill

Create one **KFB Actor Embed / Actor Platform** entrypoint with explicit family dispatch:

```
CubePet
  → canonical kfb-pets.js / kfb-pets.json stack

Graft biped / FrizzleBob Driver
  → mountGraft + current actor/graft contract

CapsuleCarl / Wissens-Pilli
  → mountCarl + Carl/Wissens-Pilli actor contract

native Rig_Medium / Rig_Large / Rig_Legacy
  → existing FaceHost/EyeRig/actor-profile adapter

Goth Girl
  → native head cleanup + FaceHost/EyeRig profile

vehicle/static host where admitted
  → explicit host adapter + EyeRig/face owner
```

The current Actor Platform design brief already states:
**one actor/face/mouth/eyes owner, many consumer roles**.

The skill must encode that instead of teaching each consumer to assemble face parts manually.

---

# 2 · PDF / Card Viewer · this should become a core runtime skill

## 2.1 Current CardBuilder owner

`skills/SSOT_KFB_CardBuilder_PDF.md`
blob `122f6923fe78a58d0f188a5a0331d9d6ed270f4d`

points to:
- `skills/kfb-card-builder.js` blob `88e1fb33f188648495e6bd8cc6450f19eaaea0cb`;
- `skills/kfb-card-format.js`;
- `skills/kfb-ink-canon.js`.

It already owns:
```
Deck registry
→ PDF page render
→ card crop
→ canonical card sheet
→ shared silhouette
→ canonical ink decal
→ THREE.Group
```

This is the correct **card rendering** owner.

## 2.2 Current performant PDF/viewer donor

The stronger viewer runtime lives separately under:
`KFB Comic Card Deck Viewer v4 (WS0)/`.

Current useful donor files:
- `KFB Deck Viewer v4.dc.html`
  blob `23437e5c2085df5224efdde4100760e5639c685f`;
- `deckviewer/kfb-corpus.js`
  blob `d2d4257f4288a699db3a2fa48c97af07f665da15`;
- current Housekeeping blob
  `11f101bb74b518b501e6197d9db4dd0f01c31faa`.

The corpus layer already provides:
- pdf.js loading;
- GitHub registry access;
- PDF page count / offset handling;
- IndexedDB page/contact-sheet cache;
- small document LRU;
- bounded parallel rendering;
- prefetch prioritization;
- page-image reuse.

Viewer v4 already has six editorial/presentation modes:
- Reader;
- Gallery;
- Stack;
- Coverflow;
- Full View;
- Deck.

This is much closer to the Almanac/Afterglow need than a new viewer.

## 2.3 Important correction to “blind quarter crop”

For standard KFB card PDFs the conceptual grid is 2×2 / four cards per page.

However the existing SSOT proves that a **blind exact page quarter is not reliable** across all decks:
- outer card grid can be inset;
- header bands can change vertical offset;
- inter-column foreign content/gaps exist.

Therefore the new viewer should not require Georg to manually measure on every use, but it also must not pretend every PDF is a perfect quarter.

Target behavior:

```
PDF / deck
→ registry metadata if known
→ auto/default grid resolver
→ optional measured deck override in registry
→ cached card canvases
```

Consumers should ask for:
- page;
- card;
- deck/contact sheet;
- current viewer mode;

not reimplement PDF crop math.

## 2.4 Target current Card/PDF skill

Create one current entrypoint with layers:

### PDF Corpus
Generic cached PDF/page service.

### KFB Card Grid Adapter
Resolves four-card pages using registry metadata/default/auto-detection.

### CardBuilder
Creates canonical KFB card surfaces and 3D cards.

### Card Viewer Presentation
Reuses the productive Viewer v4 modes/transitions.

### Consumer adapters
- Card Zone;
- CardRig / Storytelling Maps;
- Billboard Card;
- Fractal Almanac;
- Afterglow/reward view;
- ToolBox preview.

The Fractal Almanac adds Journey context, Hero-shot/replay refs, gifts, etc.
Those metadata do **not** move into the PDF renderer.

---

# 3 · Ink / outline · preserve one canon, add adapters

Current canonical card-ink source:

- `skills/SSOT_Card_Ink_Outline_v2.md`
  blob `94d15871a28422b081bfb05c1957ffc2755e209a`;
- `skills/kfb-ink-canon.js`
  blob `55ce6da2805386bd6373d81d064a37fc7e0efacb`.

## 3.1 Terminology warning: “BAND” vs “ring”

The current code names the card family **`band`**.

Technically it already implements the desired ring/ribbon behavior:
- one closed continuous contour;
- `brushLoop`;
- variable half-width / taper;
- `inkRibbon2D`;
- one combined `fill()`;
- shared contour for mask/decal/surface.

It is explicitly **not** independent line pieces and not the `stroke/chip` family.

Do not create a second “RING” implementation merely because the author-facing word “ring” is clearer.

A later documentation pass may expose an author-facing alias such as **continuous ink ring/ribbon** while leaving the implementation contract `family:'band'` stable.

## 3.2 Known bad paths that must stay deprecated

- `academy-2026-07`: over-bowed “bend instead of ink” reference;
- `sky-2026-07`: wrong stroke family / diagonal jitter.

These exist for comparison, not authoring.

## 3.3 3D translation is an adapter, not another canon

Future consumers may need the same visual grammar as:

- card perimeter / flat 3D card edge;
- OSM shoreline / map boundary;
- road or Track return boundary;
- physical rope/tube such as wrestling-ring ropes;
- other world-space accent lines.

Create adapters from the same semantic contour/feather contract:

### Surface Ribbon / Decal
For map/road/card/surface boundaries.

### Tube / Rope Extrusion
For actual 3D physical line objects.

### Mesh-edge / silhouette adapter
For flat/extruded card bodies where outer silhouette edges should read but internal triangles must not create a double grid.

Rules:
- no screen-space wireframe as a substitute;
- no per-triangle outline;
- no duplicate front/back contour producing a black doubled grid;
- one semantic boundary, one visible ink result.

---

# 4 · Speech / thought bubbles, talk, visemes and idle behavior

The old PetStudio tree is not uniformly dead.

Useful active donors remain documented in its Housekeeping:

- `bubble-shaper.v2.js`;
- `bubbles.v4/v5.js`;
- `bubble-shapes.json`;
- PetMouth rich viseme implementation;
- `pet-puppet.v1.js` timeline/acting facade;
- EyeRig / Face / PetMotion pieces.

Current mouth facts:
- semantic visemes `closed/open/wide/round/smile`;
- current richer Studio copy supports mouth sets including **red**;
- `setViseme`, `setVisemeMap`, rest/talk behavior;
- timestamped viseme input is a valid future seam;
- current talk is not automatically phoneme-perfect lip sync.

Target current skill should separate:

### Actor talk/mouth owner
Current face/mouth modules and viseme vocabulary.

### Speech performance/timeline
Timestamped viseme/emote/gaze/idle events.

### Voice/media owner
TTS/audio voice ref and timing; it must drive the existing mouth owner rather than instantiate another mouth.

### Bubble presentation
Speech / thought / other admitted shapes through one reusable bubble module.

### Idle performance
Actor/Motion owner, referenced by the same actor profile; not implemented inside the bubble renderer.

New ToolBox production acceptance must retain:
**Motion & Talk + Voice + Speech/Thought Bubbles**, not only skeletal animation.

---

# 5 · Material zones, Color Picker and texture assignment

Current ToolBox UI rework already identified this as a real gap.

Pinned UI brief:
`tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/START_HERE.md`
blob `86c2a1e970bbf6c324daab446936b8f475ba4454`.

Existing requirements already include:
- current zone name;
- visible `#RRGGBB`;
- Copy Hex;
- editable validated Hex;
- Color Picker;
- reset/original;
- click-outside / Esc close;
- zone highlight;
- texture/surface selection only through the Material/Surface owner.

Current actor rigging proves zone color override + restoration.
Per-zone texture swap is not yet a completed universal capability.

Target Material Surface skill:

```
material zone id
→ original material/source
→ color override
→ texture-set ref
   diffuse/baseColor
   normal
   roughness
   other admitted maps
→ reset/original
→ provenance
```

Texture selection should use existing Asset Librarian / Texture Catalog source refs.

Do not:
- hardcode four color swatches as the main editing model;
- duplicate textures into actor contracts;
- create a ToolBox-only texture registry;
- let a material UI silently replace renderer/material ownership.

The same interface grammar can serve:
- jacket;
- trousers;
- face/material zones;
- props;
- vehicles;
- buildings;

when their current material owner exposes compatible zones.

---

# 6 · Registry / skills-root problems already confirmed

## Stale registry

`skills/SOT_REGISTRY.md`
blob `71cdf959cfef88b5ec280009c82160d45907516d`
is dated 2026-07-24 and is now materially stale.

Examples:
- still points general Pet embedding at the old Cube-Pet instruction;
- old Ink source naming predates the current v2/root canonical files;
- several Travel/Terrain lines no longer represent current owners.

It should not continue to route fresh agents unchanged.

## Historical bundles

Both:
- `skills/kfb-embed-bundle/`;
- `skills/kfb-embed-bundle v3/`

need consumer/reference classification before being advertised as current skill bundles.

## Misplaced assets

Several binary GLBs sit directly in `skills/`.

These are not documentation/runtime skills.
They must be classified against Asset Librarian/media owners before any move:
- House;
- Palm Tree variants;
- Panda;
- Skeleton;
- Tentacle;
- Zombie.

Do not delete/move them during the census; first find exact consumers and duplicate/canonical asset paths.

---

# 7 · Classification vocabulary for the agent census

Every top-level skill/doc/bundle receives exactly one primary status:

- `CURRENT_CANON`
- `CURRENT_RUNTIME_ENTRY`
- `CURRENT_COMPAT_ADAPTER`
- `LEGACY_COMPAT_REQUIRED`
- `SUPERSEDED_REDIRECT`
- `HISTORICAL_REFERENCE`
- `MISPLACED_ASSET`
- `SOURCE_REQUIRED`

And these fields:

```json
{
  "path": "...",
  "status": "...",
  "currentOwner": "...",
  "currentEntry": "...",
  "consumers": [],
  "imports": [],
  "supersedes": [],
  "supersededBy": [],
  "safeToMove": false,
  "safeToDelete": false,
  "notes": []
}
```

No `safeToMove:true` without an import/reference scan.

---

# 8 · Migration strategy

## Phase 1 · Census only

Repository-native agent scans:
- top-level `skills/`;
- embed bundles;
- imports/links from active tools/apps;
- current ToolBox/World/Card/Actor owners.

Outputs:
- `SKILLS_RUNTIME_CENSUS.json`;
- `SKILLS_MIGRATION_MAP.md`;
- `SKILLS_CONSUMER_IMPORT_SCAN.json`.

**No source move, delete or rename.**

## Phase 2 · Current entrypoints

Create/update a small current skills shelf:

1. **KFB Actor Embed / Actor Platform**
2. **KFB PDF / Card Corpus + Viewer**
3. **KFB CardBuilder**
4. **KFB Ink Canon + adapters**
5. **KFB Talk / Viseme / Bubble**
6. **KFB Material Surface**
7. current Motion / Animation skill
8. current production/session skills

Update `SOT_REGISTRY` or replace it with a versioned current runtime/skill registry.

Old entrypoints receive concise supersession headers/redirects where safe.

## Phase 3 · Compatibility/archive

For every old path:

### Has active old consumer
Leave path in place.
Mark `LEGACY_COMPAT_REQUIRED`.
Point docs at current replacement for new work.

### Zero consumers, useful history
Move/archive only with source-preserving Git history and a redirect where useful.

### Duplicate/misplaced binary asset
Reconcile with Asset Librarian/media canonical path before moving.

### Dead and useless
Deletion is a separate explicit cleanup gate, never an automatic census action.

---

# 9 · Product requirements this audit must feed back into ToolBox

The final ToolBox Production milestone must not stop at Move/Rotate/EyeRig/Animation.

It must preserve or provide current paths for:

- complete Actor Platform family dispatch;
- Face / EyeRig;
- Mouth / Viseme / Talk;
- Voice request/media seam;
- Speech Bubble + Thought Bubble;
- Idle/performance behavior;
- material-zone Color Picker + Hex Copy/Paste;
- Surface/Texture selection via current asset/material owners;
- actor/prop/building compatible material zones;
- current Resource Picker;
- current Motion/Animation;
- current Card/PDF viewer as a reusable consumer tool where card content is involved.

These are coherent authoring capabilities, not separate new app runtimes.

---

# 10 · Priority

This is **P2**.

It should not block current Race, WorldBuilder, Combat, ToolBox or Card-Zone product execution unless a current job is about to import a superseded skill.

Recommended next action:
run the repository-native **SKILLS-CENSUS-01** agent job in parallel.

The census is valuable precisely because it is cheap:
it reads/import-scans and classifies; it does not create another Work/Cloudflare integration loop.
