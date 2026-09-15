# KFB Asset Librarian · Visual Scene Atlas Preflight · Visual Review Queue

**Date:** 2026-09-16  
**Status:** `GOVERNING QUEUE + SEPARATE WORLD_NOW OVERLAY`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Governing rule

The existing preflight `LIVING_STATUS.md` owns the canonical visual-review order. Preserve it exactly.

`WORLD_NOW_FAST_LANE.md` may surface production-relevant jobs earlier **without rewriting the canonical queue**.

This file therefore has two independent tracks:

1. **Canonical KayKit Visual Review Queue** — stable order for the Reference Lab.
2. **WORLD NOW Fast Lane** — an explicit production overlay that can be activated by Georg/Lead when current scene work needs it.

Do not silently convert Fast Lane order into the canonical queue.

## 1. Review contract

Every job must return separate fields for:

- `SOURCE FACT`
- `OBSERVED DEMO`
- `INFERENCE`
- `PROPOSAL`
- `TESTED RESULT` only when referencing an actual prior KFB test
- `UNRESOLVED`

And, where applicable:

- exact source candidate(s);
- source-path confidence;
- placement/transform confidence;
- camera/material/light/FX evidence;
- consumer relevance;
- evidence limits.

A demo showing A with B does not prove generic KFB compatibility.

## 2. Canonical KayKit Visual Review Queue — preserve exactly

### 1. Ultra Turbo Hero Man · weapon / grip / pose

Reference:

`Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`

Known source facts:

- semantic Series 7, Aug 2026;
- physical source family currently under historical `KayKit_Mystery_Series6/UltraTurboHeroMan/` parent;
- same-collection blaster + sword source assets exist;
- reference filename says `UltraHeroTurboMan`, source tree says `UltraTurboHeroMan`; preserve the discrepancy.

Visual target:

- exact demonstrated grip;
- hand involvement;
- weapon pivot/orientation;
- pose/aim direction;
- action transition if visible;
- camera/staging.

### 2. Goth Girl · demo/reference

Reference:

`GothGirl.gif`

Known source facts:

- semantic Series 7, Sep 2026;
- physical source family under historical parent;
- Rig_Medium source family;
- same-collection Microphone, Mic Stand, Speaker, Stool;
- prior Librarian/Birthday binding evidence exists and must stay narrowly scoped.

Visual target:

- staging/contact/scale/pose/performance composition;
- actual use of signature props if visible;
- seated/standing alignment;
- camera/look.

Do not re-prove generic binding/compatibility.

### 3. Demon Lord · demo/reference

Reference:

`July2026_DemonLord.gif`

Known source facts:

- semantic Series 7, Jul 2026;
- physical source family under historical parent;
- Rig_Large source fact from governing preflight;
- sibling DemonHeart + SummoningCircle source assets.

Visual target:

- actual scene staging;
- pose/action vocabulary;
- prop/FX relation if visible;
- scale/camera/material cues.

### 4. Orc Brute

Reference:

`August2025_OrcBrute.gif`

Target:

- body/rig presentation;
- movement/performance;
- props/contact if visible;
- scale/camera.

### 5. Lorekeeper

References:

- `LOREKEEPER SET 1.gif`
- `lorekeeper - demo - contents (3).png`
- `lorekeeper promo (4).png`

Target:

- character/set/prop relations;
- authored presentation;
- source asset mapping.

### 6. Remaining Series 6 monthly demos in chronological order

Preserve chronological semantic order from the existing Atlas:

- Sep 2025 Cleric
- Oct 2025 Monstrosity
- Nov 2025 Plant Warrior
- Dec 2025 Toy Soldier — source exists; demo availability must be checked, not assumed
- Jan 2026 4GTN / 4GTN_Forgotten — source exists; demo availability must be checked
- Feb 2026 Hoarder
- Mar 2026 Avian Swordsman
- Apr 2026 Marksman
- May 2026 Magical Girl
- Jun 2026 Farmers

Missing demo file does not mean missing asset.

### 7. Block Bits annotated/sample references

References:

- `Block_Bits_Overview.png`
- `Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png`

Target:

- distinct authored motifs;
- modular repetition/grid/stack rules;
- source-object mapping;
- relative scale/camera.

### 8. Board Game Bits overview/sample family

References:

- `BoardGame_Bits_Overview.png`
- `BoardGame_Bits_Overview_Extra.png`
- `BoardGame_Bits_Sample.png`
- `Boardgame_Artboard 1.png`

Target:

- board/token/card/die spatial grammar;
- reusable tabletop/world-space presentation;
- source-health issues kept separate from design intent.

### 9. Resource Bits overview/sample family

References:

- `Resource_Bits_Overview.png`
- `Resource_Bits_Sample_Extra.png`

Target:

- resource cluster grammar;
- environment/worksite relation;
- archive/indexing gap preserved.

### 10. Holiday overview/sample family

References:

- `Holiday_Bits_Sample.png`
- `Holiday_Bits_Sample_Extra.png`
- saved Holiday release page

Target:

- gingerbread/platforming composition;
- seasonal decor;
- `holiday_glow` source/material relation;
- source ownership gap preserved.

### 11. Remaining monthly-character references

Any monthly characters outside the semantic Series 6 pass are reviewed after the above anchors, while preserving source-series/date evidence.

### 12. Cryptic host-named images last

Includes:

- generic `promo*.png`;
- generic `contents*.png`;
- opaque hash-like PNG/JPGs;
- Discord captures;
- generic screenshots.

Rule: identify only through direct visual/source-page/source-artwork corroboration. Never map by sequence order alone.

## 3. WORLD NOW Fast Lane — separate overlay, not queue replacement

These jobs are already prepared because current production can benefit from them. They may be executed early only when Georg/Lead explicitly activates WORLD NOW or a receiving consumer asks for them.

### WN-001 · Birthday / Cozy Party

Packet:

`VISUAL_JOB_PACKETS/VR-001_BIRTHDAY_COZY_PARTY.md`

Purpose:

smallest convincing authored Birthday scene around the existing tested hero setup.

### WN-002 · Orbit 7 / Seaside / Town-Road

Packet:

`VISUAL_JOB_PACKETS/VR-002_ORBIT7_SEASIDE_TOWN_ROAD.md`

Purpose:

built-world / road / dressing grammar on top of the existing Travel/TinySkies world substrate.

### WN-003 · Block Bits

Packet:

`VISUAL_JOB_PACKETS/VR-003_BLOCK_BITS_MULTI_COMPOSITION.md`

This job is also canonical queue item 7. Fast Lane may surface it earlier without changing its canonical position.

### WN-004 · City Builder

Packet:

`VISUAL_JOB_PACKETS/VR-004_CITY_BUILDER_STREETSCAPE.md`

Purpose:

streetscape grammar for Town/Travel/Stunt.

### WN-005 · Resource Bits

Packet:

`VISUAL_JOB_PACKETS/VR-005_RESOURCE_BITS_SCENE_USE.md`

This job is also canonical queue item 9. Fast Lane may surface it earlier without changing its canonical position.

## 4. Canonical job-packet naming

For canonical queue items 1–3, use explicit `CQ` packets:

- `CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`
- `CQ-002_GOTH_GIRL_DEMO.md`
- `CQ-003_DEMON_LORD_DEMO.md`

WORLD NOW packets retain their current `VR-00x` names as prepared fast-lane jobs.

## 5. Generic return template

```text
JOB ID:
SOURCE CAPTURE(S):
INSPECTION STATE:
SOURCE STATUS:

SOURCE FACT:
- ...

OBSERVED DEMO:
- ...

INFERENCE:
- ...

SOURCE-ASSET MATCHES:
- asset/path — exact/family/unresolved — confidence — evidence

COMPOSITION:
- environment / props / character
- relative placement
- scale relations
- camera
- lighting/material/glow/FX
- character/prop/motion relations

PROPOSED KFB USE:
- receiving consumer
- smallest useful slice

TESTED RESULT REFERENCES:
- only prior tests, with exact scope

UNRESOLVED:
- ...
```

## 6. Stop conditions

Pause and return `UNRESOLVED` rather than guessing when:

- pixels/frames cannot actually be inspected;
- source identity is ambiguous;
- exact source mapping would require guessed filenames;
- compatibility would require measurement/runtime testing;
- the job drifts into ToolBox/consumer implementation;
- source/ownership work already exists in the Sep-15 Atlas and no visual reconstruction delta is being added.

## 7. Execution decision rule

### Default Reference Lab run

Start with canonical queue item 1: Ultra Turbo Hero Man.

### Explicit WORLD NOW run

If Georg/Lead says to prioritize current world production, start with the requested WN packet without modifying the canonical queue.

### Batch rule

Do not silently switch tracks. Every return must state:

`TRACK: CANONICAL` or `TRACK: WORLD_NOW`.

## 8. Next prep action

Prepare canonical packets CQ-001 through CQ-003 so Claude Design can start either the default Reference Lab queue or the separate WORLD NOW fast lane without further provenance research.