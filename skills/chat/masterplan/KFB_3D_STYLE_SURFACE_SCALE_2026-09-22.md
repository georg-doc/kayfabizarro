# KFB 3D Art Direction · Surface, Scale and Environment Standard

Status: **CURRENT ADDITIVE ART-DIRECTION DECISION**  
Date: 2026-09-22  
Coordinator: Georg / KFB  
Runtime ownership: **unchanged**. This file coordinates visual rules across existing owners; it is not a renderer, game runtime, Asset Registry, World/OSM, Race, ToolBox or actor owner.

## CURRENT OVERRIDE · Hybrid Surface v2 implementation status

Draft PR #166 produced a real v2 candidate, but it is now **FROZEN FAILED** under the two-pass recovery rule.

Frozen runtime/code head:
`7cbad52b55fb9ec2300aa4b25ca92b0997ce448a`

Recovery:
`tools/KFB-ToolBox/_handover/HYBRID_SURFACE_V2_FAILURE_RECOVERY_2026-09-22/START_HERE.md`

The measured head-size scale result is retained as evidence, but v2 surface/seam/clay visual acceptance was not reached. The immediate next gate is only an actor material compile-census diagnostic. The Environment Style Lab remains downstream and must not start from this failed candidate.

## 1. Why this exists

The public Hybrid Surface Scene proof established that one shared surface field can be applied to exact KFB/KayKit source assets while retaining their original base colors/maps. Georg's visual review adds three production-critical corrections that must survive chat resets:

1. the surface needs more visible **materiality** than simple de-glossing;
2. mixed rig families must not be normalized to the same total body height;
3. the same KFB look must later extend from characters/props/rooms to OSM city, RaceTrack Cologne, terrain, vegetation and landmarks.

Current real-asset proof:
- Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-scene-lab/`
- ToolBox draft PR: **#164**
- exact donors in the proof: Legacy Orc A, ActionFigure/Rig_Medium, GothGirl/Rig_Medium, FrizzleBob Driver Graft, Black Knight/Rig_Large, and the World Atlas Dungeon promo room.
- public browser proof at the reviewed revision: **41/41 PASS**, zero failed resources, zero page/console errors.

This technical PASS is not final visual acceptance.

---

## 2. Surface standard · target is handmade material, not merely matte

### Accepted direction

Keep the hybrid principle:

- preserve the source asset's base color and texture/map identity;
- apply a common surface language across disparate packs;
- use broader, less repetitive macro variation than the first RGB demo;
- add a visible but restrained **clay / grain / handmade** micro-surface;
- reduce the sterile/plastic read;
- keep the effect readable on characters, props, rooms and later environment geometry.

The desired read is closer to:
- slightly raw clay / stop-motion material;
- painterly grime/wear;
- fine granular tooth;
- broad irregular surface variation;
- hand-shaped rather than factory-perfect plastic.

### Important correction: do not flatten every material into one roughness

The current Hybrid v1 proof made the cast visibly more matte. That is useful evidence, but Georg noted that existing shine can be desirable on Black Knight armour and GothGirl hair.

Therefore the default v2 rule is:

> **Preserve source roughness/specular character and modulate it; do not globally clamp all materials to the same matte value.**

This avoids a complicated hand-authored material exception table while preserving useful source distinctions automatically.

Special material tuning may be added later only when a real consumer proves it is needed. It is not the starting architecture.

### Seam gate

A visible surface/projection seam was seen in the current proof.

Persist this as a blocking visual criterion:

> **The shared surface treatment must not read as an obvious projection seam.**

The next shader/material pass must explicitly compare seam visibility on:
- modular Dungeon floor/wall joins;
- curved character surfaces;
- actor material/mesh boundaries;
- large continuous surfaces.

A technical shader compile PASS is not enough if the seam remains conspicuous.

---

## 3. Cross-rig character scale standard · head-size first

The current mixed-cast proof scaled Legacy Orc A to approximately the same total height as the Medium actors. Georg rejected that relationship.

### Persisted rule

> **Mixed-rig cast scaling is calibrated primarily by head size, not total body height.**

Consequences:

- Legacy must not be enlarged merely to match Rig_Medium total height.
- Legacy and Medium should be compared via measured source head size; if their heads are intended to read as the same cartoon scale, normalize the heads and let Legacy remain shorter overall.
- Rig_Large remains a large body class. Do not shrink the whole body to Medium height; compare its head against the same reference and preserve the intended larger body mass.
- Use measured source geometry or an accepted head proxy. Do not eyeball full-body height.
- Persist the resulting family factors once measured so every future mixed scene does not invent a new scale.

This rule is additive to the existing Resident Atlas finding that Rig_Large and Rig_Medium are distinct skeleton-size families and that Large equipment follows the Large family. It does not replace those rig/equipment rules.

### Required evidence for the scale gate

For each representative family:
- source head measurement / proxy definition;
- resulting scale factor;
- total resulting character height;
- one side-by-side cast view.

Minimum current reference cast:
- Legacy Orc A · Rig_Legacy
- ActionFigure · Rig_Medium
- GothGirl · Rig_Medium
- FrizzleBob Driver Graft · Rig_Medium
- Black Knight · Rig_Large

---

## 4. KFB 3D modelling language · cartoon anatomy is a standard, not decoration

The surface shader alone is not enough. Georg's environment/landmark work has repeatedly shown that raw low-poly geometry becomes too angular, faceted and visually busy beside KayKit/K-Kit characters and props.

Persist this modelling target across characters, props, architecture, landmarks and generated environment presentation:

### Shape language

Prefer:
- rounded and bowed silhouettes;
- gentle bends and lean;
- taper and controlled twist;
- broad readable masses;
- softened transitions;
- fewer small hard corners;
- fewer tiny faceted segments;
- deliberate asymmetry where it improves cartoon readability;
- curved arches/supports instead of wedge-like segmented approximations where the source allows;
- cartoon proportion/anatomy over literal engineering miniaturization.

Avoid as the default visible presentation:
- many tiny angular facets;
- boxy micro-detail;
- raw extrusions that read as placeholder geometry;
- excessive hard edges and repeated little wedges;
- landmark simplifications that become a collection of sharp sticks/triangles rather than one readable cartoon silhouette.

Reference language: the rounded cartoon logic already visible in KayKit/K-Kit and TinyTweaks-style props. Exact source donor paths must still be pinned per implementation; this document does not invent or replace asset ownership.

### Existing OSM alignment

Current `tools/osm-city-lab/docs/PRESENTATION_S1C.md` already establishes a compatible City Lab CARTOON mode:

`OSM footprint → moderate bend + lean + taper + twist + small stacked-ring offsets`

and explicitly keeps source footprint/S2 collision unchanged.

The new rule does not replace that work. It strengthens the presentation target:
- source/collision truth remains stable;
- visible geometry may become more rounded, curved and cartoon-proportioned;
- the same visual grammar should eventually match KFB characters and props.

---

## 5. Environment continuation is REQUIRED, not optional polish

After Character / Prop / Room surface validation, the same visual system must be tested on real environment owners.

### E1 · OSM City / corridor

Targets:
- Hürth
- Ehrenfeld
- Köln / existing Cologne OSM work
- the existing Hürth ↔ Ehrenfeld corridor
- existing source-backed vegetation/tree placements
- the user-referenced “Twigs” environment work: **name retained from Georg; exact repository donor/path is unresolved and must be identified before implementation. Do not invent a replacement.**

Required checks:
- road and landuse surfaces;
- building masses;
- walls/bridges/supports;
- trees/vegetation;
- street props;
- world-space continuity of the surface treatment;
- seam/repetition at city scale.

### E2 · RaceTrack Cologne / Cologne Option C

Use the current Race/OSM owner and its existing newer color-map/palette contract as source truth. Georg considers that newer color scheme a better fit with K-Kit/KayKit character colors.

The environment material experiment may consume that palette; it must not fork the Race runtime, camera, physics, OSM source, or color-map owner.

Required questions:
- does clay/grain materiality reduce the plastic/base-model read?
- can road/curb/barrier/bridge/building colors remain intact?
- does the newer color scheme and the KFB surface treatment read as one world?
- are bridge arches/supports visibly rounded enough, or do geometry-shape fixes remain necessary?

### E3 · Wreckman proof-of-concept

Georg identifies the Wreckman POC as another case suffering from shiny/plastic base-model appearance.

Repository search at this decision point did **not** resolve an exact `Wreckman` owner/path. Therefore:
- persist Wreckman as a named future consumer target;
- locate and pin its current owner before any code change;
- do not substitute the separate `WhackMan` project merely because its name is similar.

### E4 · landmarks

Landmarks such as the Eiffel-Tower-type work and other city hero objects need the same cartoon anatomy standard:
- fewer sharp micro-facets;
- broader curved/bowed masses;
- controlled exaggeration;
- silhouette first;
- compatible surface/color language.

Existing landmark work from other chats is donor evidence to recover and reuse; do not rebuild from memory.

---

## 6. Required sequence

### Gate A · Hybrid Surface Scene Lab v2
Same exact real cast + real Dungeon room.

Change only:
1. stronger macro surface readability;
2. clay/grain micro-surface;
3. seam reduction;
4. preserve useful source gloss instead of globally flattening roughness;
5. head-size-based mixed-rig scale calibration.

Human gate: Georg accepts/rejects the real-asset Original ↔ v2 comparison.

### Gate B · props / room confirmation
Only if Gate A needs one additional bounded confirmation on larger props/room surfaces. Do not create an endless material-tuning loop.

### Gate C · Environment Style Lab
Take the accepted surface/shape rules to one exact real environment slice:
- OSM Hürth/Ehrenfeld/Köln **or**
- RaceTrack Cologne / Cologne Option C.

No second World/Race runtime. This is a presentation/material/geometry compatibility proof.

### Gate D · landmark cartoon-anatomy proof
Use one existing real landmark donor first, shown in isolation before integration. Then prove the rounded modelling grammar on the environment.

---

## 7. Ownership boundaries

This standard does not move ownership:

- ToolBox owns the material/style compatibility experiment only.
- World Atlas/Dungeon keeps Dungeon/environment source ownership.
- OSM City Lab keeps OSM presentation/source/collision contracts.
- Race keeps race runtime, route, camera, physics and color-map ownership.
- Actor/rig owners remain unchanged.
- Asset Registry remains read-only truth.
- Wreckman remains unresolved until its exact current owner is found.

No consumer promotion follows automatically from a successful material lab.

---

## 8. One next gate

**Hybrid Surface Scene Lab v2** on the exact current cast and Dungeon donor: clay/grain + seam reduction + source-gloss preservation + measured head-size scaling.

Environment work is the named gate immediately after the character/prop/room look is accepted.
