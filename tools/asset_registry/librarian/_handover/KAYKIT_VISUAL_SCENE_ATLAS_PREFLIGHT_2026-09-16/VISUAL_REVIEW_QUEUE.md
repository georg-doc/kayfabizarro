# KFB Asset Librarian · Visual Scene Atlas Preflight · Visual Review Queue

**Date:** 2026-09-16  
**Status:** `PROPOSAL / EXECUTION QUEUE`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Purpose

Turn the existing KayKit Reference Atlas into a compact queue of **visual reconstruction jobs** for Claude Design.

This queue does not repeat the 2026-09-15 inventory. It asks a different question:

> What exact composition, placement, camera, material, lighting, FX, prop, character and motion relationships can be extracted from each high-value reference and expressed as a reusable Scene Recipe?

## 1. Review contract

Every job must return separate fields for:

1. `SOURCE FACT`
2. `OBSERVED DEMO`
3. `INFERENCE`
4. `PROPOSAL`
5. `UNRESOLVED`

And, where applicable:

6. exact source asset candidate(s)
7. source-path confidence
8. placement/transform confidence
9. consumer relevance
10. evidence limits

A demo showing A with B means only:

`OBSERVED DEMO: A and B are visibly used together in this source reference.`

It does **not** mean:

`TESTED RESULT: A and B are generically compatible in KFB runtime.`

## 2. Priority model

Priority is based on **current KFB production value**, not on completeness of the archive.

- `P0` — directly useful for Birthday / Town / Orbit 7 / Stunt world-building now
- `P1` — high-value modular scene grammar or performance relation
- `P2` — useful secondary character/performance evidence
- `P3` — opaque/generic reference archaeology; only after stronger anchors

## 3. P0 · WORLD NOW

### VR-001 · Birthday / Cozy Party Scene

**Priority:** P0  
**Reference basis:** existing `BIRTHDAY_STARTER_BUNDLE_REVIEW_2026-09-15.md`, Birthday/Elisa mockups where explicitly referenced by consumer work, KayKit world/prop sources  
**Consumers:** Town / Performance / ToolBox candidate discovery

Extract:

- smallest convincing cozy living-room / birthday-party scene vocabulary;
- furniture / table / seating / decor / sign / crate / cart / lamp / backdrop candidates;
- foreground / midground / background staging;
- character-safe open performance area;
- camera angle and readable silhouette zones;
- practical lighting/glow candidates;
- which source assets are exact matches vs nearest-family reuse.

Do not:

- invent a KayKit demo that does not exist;
- silently replace the Birthday starter-bundle contract;
- expand into a full interior architecture system.

**Expected output:** `VISUAL_JOB_PACKETS/VR-001_BIRTHDAY_COZY_PARTY.md` + one `SCENE_RECIPE` candidate.

---

### VR-002 · Orbit 7 / Seaside / Town-Road Composition

**Priority:** P0  
**Reference basis:** existing Orbit/Town/Stunt scene work + KayKit City Builder / Forest Nature / Medieval Hexagon / Space Base / road-ground reference families  
**Consumers:** Town / Travel / Stunt Race

Extract:

- road-to-ground transitions;
- town edge / streetscape rhythm;
- beach/water/coast edge treatment where references support it;
- building setback, prop density and negative-space rules;
- tree/rock integration with built environment;
- camera/readability rules for moving player/vehicle;
- what can be built from owned assets now versus reference-only gaps.

**Expected output:** `VISUAL_JOB_PACKETS/VR-002_ORBIT7_SEASIDE_TOWN_ROAD.md` + one or more scene-layout recipes.

---

### VR-003 · Block Bits Multi-Composition Sample

**Priority:** P0  
**Primary reference:** `Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png`  
**Secondary:** `Block_Bits_Overview.png`  
**Source:** `KayKit_BlockBits_1.0_FREE`  
**Consumers:** Stunt Race / Town / Combat / ToolBox

Extract separately for each visible motif:

- exact visible piece families;
- repetition/grid/stack rules;
- relative scale;
- floor/edge/corner logic;
- stage/ring/pyramid topology;
- color usage;
- camera/view;
- whether motifs mix non-BlockBits assets.

Filename descriptors `VOXEL PYRAMID`, `STAGE`, `WRESTLING RING FLOOR`, `BOXEL BLITZ` are source notes, not automatic visual findings.

**Expected output:** one packet with 1–4 sub-recipes, depending on what is actually visible.

---

### VR-004 · City Builder Streetscape

**Priority:** P0  
**Primary reference:** `Overview_Extra.png` already identified by prior Atlas as KayKit City Builder Bits v1.0  
**Source state:** owned archive / prior Atlas mapping  
**Consumers:** Town / Travel / Stunt Race

Extract:

- building/road/sidewalk/prop relationships;
- modular block size cues;
- corner/intersection grammar if visible;
- street furniture/sign placement;
- density and spacing;
- camera presentation versus actual reusable composition.

**Expected output:** City Builder scene grammar packet and source-match candidates.

---

### VR-005 · Resource Bits Scene Use

**Priority:** P0  
**References:** `Resource_Bits_Overview.png`, `Resource_Bits_Sample_Extra.png`  
**Source state:** archive present; Registry blind spot already documented  
**Consumers:** Town / Travel / Stunt Race

Extract:

- visible resource families;
- grouping and spacing;
- extraction/worksite/environment relationships;
- terrain/ground context;
- color/material variants;
- exact source mapping only where evidence exists.

**Stop condition:** do not unpack/index the archive as part of this job. If scene value is high, return a separate Registry-owner proposal.

---

## 4. P1 · MODULAR / PROP / PERFORMANCE

### VR-101 · BoardGame Bits Spatial Grammar

**References:** BoardGame overview/sample/extra/artboard  
**Source:** owned/indexed; prior Registry snapshot records 35 missing model dependencies

Questions:

- physical board / tile / card / token / die relations;
- marker/badge/card-holder staging;
- reusable world-space UI or tabletop grammar;
- color/team/state language;
- which visible objects are affected by source dependency gaps.

Do not conflate design intent with source readiness.

---

### VR-102 · RPG Tools Workstation / Prop Grammar

**References:** RPG Tools overview/sample  
**Source:** owned/indexed; source pack structurally strong

Questions:

- handheld vs placed objects;
- workstation clusters;
- anvil/workbench/blueprint/tool associations;
- scale and orientation;
- prop-on-character relations if actually demonstrated.

---

### VR-103 · Holiday / Gingerbread / Glow Scene

**References:** Holiday sample + extra + saved release page  
**Source state:** prior Atlas says core free pack missing from repo; EXTRA ownership unresolved

Questions:

- modular gingerbread construction;
- platforming/house assembly logic;
- decor clusters;
- emissive `holiday_glow` use;
- lighting contrast;
- which useful scene ideas are reference-only because source assets are absent.

---

### VR-104 · Goth Girl Performance Set

**Reference:** `GothGirl.gif`  
**Source:** source-mapped Series 7 semantic character under historical parent; microphone / mic stand / speaker / stool siblings known

Questions:

- actions actually shown;
- microphone / stand / stool / speaker use if visible;
- standing/seated alignment;
- stage/camera framing;
- prop transforms/hand relation;
- lighting/material staging;
- what is demo evidence versus prior Librarian bind/playback test.

Prior `Death_A` 69/69 bind/playback remains a separate narrow `TESTED RESULT` only.

---

### VR-105 · Ultra Turbo Hero Man · Blaster / Grip / Pose

**Reference:** `Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`  
**Source:** character family + `UltraTurboHeroMan_Blaster` source sibling confirmed

Questions:

- exact hand/grip;
- blaster orientation/pivot;
- one- vs two-hand involvement;
- pose/aim direction;
- idle/action transition if visible;
- source-name discrepancy `UltraHeroTurboMan` in reference filename versus `UltraTurboHeroMan` in source tree.

**Rule:** preserve discrepancy explicitly; do not normalize silently.

---

## 5. P2 · CHARACTER / PERFORMANCE SECOND WAVE

### VR-201 · Cleric

Reference: `September2025_Cleric.gif`

Extract equipment, pose, action loop, FX/light cues, camera.

### VR-202 · Marksman

Reference: `April2026_Marksman.gif`

Extract ranged weapon grip, aim, recoil/pose, stance, camera.

### VR-203 · Magical Girl

Reference: `May2026_MagicalGirl.gif`

Extract FX, glow/material, action loop, performance staging.

### VR-204 · Farmers

Reference: `June2026_Farmers.gif`

Extract multi-character staging, tool use, work loop, spacing.

### VR-205 · Lorekeeper

References: `LOREKEEPER SET 1.gif`, Lorekeeper promo/content images

Extract character/set/prop relations and authored presentation.

### VR-206 · Orc Brute / Monstrosity / Plant Warrior / Hoarder / Avian Swordsman / Demon Lord

Review as separate subjobs only after P0/P1. Focus on nonstandard bodies, props, action vocabulary and FX; do not turn this into universal rig compatibility work.

## 6. P3 · REFERENCE ARCHAEOLOGY

### VR-301 · Generic promo sequence

`promo.png`, `promo (1).png` … `promo (11).png`

Only identify when a visual/source-page/source-artwork match is strong.

### VR-302 · Generic contents sequence

`contents.png`, `contents_alt.png`, `contents (1).png` … `contents (11).png`

Same rule: no sequence-order mapping.

### VR-303 · Opaque hash/screenshots/Discord bucket

Review only where a high-value unknown remains after named sources are exhausted.

## 7. Per-job return template

Each visual agent return should contain:

```text
JOB ID:
SOURCE CAPTURE(S):
SOURCE STATUS:

SOURCE FACT:
- ...

OBSERVED DEMO:
- ...

INFERENCE:
- ...

SOURCE-ASSET MATCHES:
- asset/path — confidence — evidence

COMPOSITION:
- ground/tile/road/building/props
- relative placement
- scale relations
- camera
- lighting/material/glow/FX
- character/prop/motion relation

PROPOSED KFB USE:
- consumer
- smallest useful slice

UNRESOLVED:
- ...

DO NOT PROMOTE:
- unsupported compatibility/runtime claims
```

## 8. Execution order

Current recommended order:

1. `VR-001` Birthday / Cozy Party
2. `VR-002` Orbit 7 / Seaside / Town-Road
3. `VR-003` Block Bits
4. `VR-004` City Builder
5. `VR-005` Resource Bits
6. `VR-101` BoardGame Bits
7. `VR-102` RPG Tools
8. `VR-103` Holiday
9. `VR-104` Goth Girl
10. `VR-105` Ultra Turbo Hero Man
11. P2 character wave
12. P3 archaeology only if still valuable

## 9. Stop conditions

Pause a job and return `UNRESOLVED` instead of guessing when:

- pixels/frames cannot actually be inspected;
- source identity is ambiguous;
- exact asset mapping would require unsupported filename similarity;
- compatibility would require measurement/runtime testing;
- a job starts drifting into ToolBox implementation;
- the same information already exists in the 2026-09-15 Atlas and no reconstruction delta is being added.

## 10. Next checkpoint

Create `WORLD_NOW_FAST_LANE.md` tying `VR-001`–`VR-005` to the existing Birthday starter evidence, current owned pack coverage, and concrete scene-recipe outputs.