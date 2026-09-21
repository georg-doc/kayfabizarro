# KFB ToolBox · KayKit Full Coverage + Frankensteining Concept

**Datum:** 15.09.2026  
**Status:** CONCEPT / PREFLIGHT BRIEF — not an implementation claim  
**Owner intent:** ToolBox rigging/composition authoring using existing Asset Registry, Rig/Session and consumer owners.

## 1 · User requirement

Two hard product requirements:

1. **Animation:** all current KayKit characters and rig families must be available/selectable in animation authoring.
2. **Rigging / Frankensteining:** all current KayKit characters and all technically usable character parts must be discoverable as potential donors for combining parts into a new rig/composition.

This must not become a manual per-character chat exercise.

## 2 · Recommended approach

Do **one automated coverage/preflight pass first**, then build the UI from that machine-readable result.

Do not manually wire dozens of characters or guess which parts exist.

The current Asset Librarian already proves broad dynamic KayKit discovery; the latest tested Live Registry view reported **79 KayKit character candidates** and measured rig-family filtering. Treat that count as evidence for the current Registry revision, not as a permanent hardcoded product count.

## 3 · Phase A · KayKit Coverage / Part Atlas

Build a scanner over every Registry-discovered KayKit character GLB/GLTF.

For each source actor record at least:

- source asset ID / path / pack / collection;
- character label;
- rig family if measured (`Rig_Small`, `Rig_Medium`, `Rig_Large`, other/unknown);
- skeleton signature / bone names;
- skinned meshes;
- rigid mesh nodes;
- node hierarchy;
- material slots / textures;
- visible bounds;
- candidate hand/head/body attachment anchors;
- sibling renderable props from the same collection;
- embedded animation names if present;
- local/shared animation sources already known by the Registry/Librarian.

### Part inventory

For each visible mesh/node, preserve the real source name and build a **candidate semantic role** only as UI metadata, for example:

- head / skull;
- hair / hat / helmet;
- face accessory;
- torso / body;
- arm left/right;
- hand/glove;
- leg left/right;
- foot/boot;
- cape/backpack/warpack;
- weapon/tool/prop;
- accessory/other.

Do not rewrite source assets or pretend uncertain classifications are canonical facts.

Output a machine-readable `KAYKIT_PART_ATLAS` / equivalent generated manifest plus a human summary.

## 4 · Why the atlas must precede the Frankensteiner UI

Not every KayKit character will be authored identically.

Potential cases:

### A · Separate rigid accessory
Easy candidate: attach/reparent to an existing bone/anchor with calibration.

### B · Separate skinned mesh using the same skeleton family
Potentially strong Frankensteining candidate, but must verify bind matrices, bone names and visual alignment before claiming generic interchangeability.

### C · Mesh exists but is fused/monolithic
Do not expose a fake `swap arm` control when the arm is not a separable source mesh. Mark it unavailable unless an explicit extraction pipeline is later added.

### D · Different skeleton/rig family
Cross-family part transfer may need rebinding or a dedicated graft adapter. Do not silently treat it as same-family swapping.

### E · Existing special owner
FrizzleBob head graft, CapsuleCarl face parts, EyeRig, mouth, brows, nose etc. already have specific owner contracts. Reuse them; do not replace proven special pipelines with a generic scanner because the UI wants uniformity.

## 5 · Compatibility classes

The atlas should calculate or record compact compatibility states such as:

- `DIRECT` — same compatible rig/skeleton and proven preview;
- `ATTACH` — rigid prop/accessory attachment;
- `CALIBRATE` — same broad family but needs transform/offset calibration;
- `GRAFT_ADAPTER` — requires existing/dedicated graft logic;
- `EXTRACT_REQUIRED` — desired part is not separately authored;
- `UNSUPPORTED` — no legitimate current path.

These are authoring facts. In the normal UI they should be shown minimally, not as permanent technical prose.

## 6 · Frankensteiner product model

The user should be able to:

1. choose **any Registry-discovered KayKit base character**;
2. open a compact donor/parts palette;
3. choose semantic slot such as `Head`, `Hair`, `Body`, `Arms`, `Legs`, `Accessory`, `Prop`;
4. browse/search candidate parts across the **full KayKit population**;
5. preview the chosen donor part immediately on the stage;
6. adjust only necessary fit controls;
7. preserve/reuse the existing face/animation/voice systems where compatible;
8. save the result as a declarative composition/recipe referencing original assets rather than duplicating source meshes unnecessarily.

## 7 · UI direction · no new clutter

This concept must respect the current ToolBox UI reset direction.

Normal authoring surface:

- large stage;
- one compact actor/base selector;
- one compact part-slot selector;
- one searchable donor tray/palette;
- fit controls only when the selected donor actually needs them;
- immediate preview;
- Save / Revert.

Do **not** show permanent paragraphs about source, contracts, compatibility math or provenance in the working UI. Put detailed diagnostics behind an optional `Info/Debug` affordance.

## 8 · Contract strategy

Do not invent a new persistent super-schema before reading the current `kfb.pets/1`, session and composition owners.

Preferred direction:

- source references remain immutable;
- new Frankensteined actor stores **references + slot choices + transforms/material overrides**, not copied geometry;
- existing owners continue to own face, motion, voice and special graft behavior;
- if the current contract cannot represent arbitrary donor-slot composition cleanly, propose the smallest additive composition block or adjacent recipe contract and review it before implementation.

This is a contract decision, not something the UI designer should improvise.

## 9 · Animation relationship

The resulting composition must expose its real animation capability from the actual resulting rig/skeleton.

Animation UI must still show the full KayKit actor population and full performance/motion library; compatibility is evaluated on selection.

The same Coverage/Part Atlas can therefore feed:

- actor roster;
- rig family;
- animation compatibility;
- donor parts;
- same-collection props;
- performance suite.

Do not build separate hardcoded indexes for these surfaces.

## 10 · Suggested vertical slices

### Slice A · Coverage Atlas

- scan all Registry-discovered KayKit character sources;
- emit character/rig/part manifest;
- measure representative same-family and cross-family structures;
- no new authoring UI required beyond a small inspector/report.

### Slice B · Direct Frankensteining POC

Use 3–5 deliberately diverse actors and prove:

- one rigid accessory swap;
- one same-rig skinned-part swap where structurally valid;
- one existing Graft adapter reuse;
- one explicit unsupported/fused part case.

### Slice C · Full donor browser

Only after Slice B proves the mechanics:

- full population-driven base selector;
- semantic donor slots;
- search/filter;
- stage preview;
- save/revert;
- compact compatibility state.

This sequence avoids an architecture rabbit hole while still honoring the full-coverage requirement.

## 11 · Acceptance

Before claiming `ALL KayKit available`:

- roster count must be derived from current Registry, not hardcoded;
- every discovered KayKit character has a visible/selectable entry;
- every discovered character has rig/unknown status;
- every parseable visible part is represented in the atlas, even when marked non-swappable;
- search can find donors outside favourites/current Studio residents;
- unsupported parts remain visible as unavailable rather than silently disappearing;
- at least one real composition roundtrip survives reload/export-import using the chosen existing/additive contract path.

## 12 · Status

- **DECISION / USER DIRECTION:** all KayKit characters/rigs must be available for animation authoring.
- **DECISION / USER DIRECTION:** all KayKit characters and technically usable parts must be available as potential Frankensteining donors.
- **RECOMMENDATION:** solve this with an automated Coverage/Part Atlas, not manual per-character briefing/wiring.
- **SOURCE FACT:** current Librarian tested view reported 79 KayKit character candidates at its current Registry revision.
- **UNRESOLVED:** exact current contract representation for arbitrary donor-slot compositions.
- **IMPLEMENTATION:** none by this concept brief.
- **TESTED RESULT:** no universal part-swap claim yet.
