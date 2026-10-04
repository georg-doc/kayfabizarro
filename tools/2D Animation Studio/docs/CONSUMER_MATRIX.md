# 2D Animation Studio · Consumer Matrix

Updated: 2026-09-20  
Status: **CURRENT PREPARATION · named consumers, no runtime promotion**

The Studio is an authoring/presentation owner. It does not become a world, collision, camera, quest or persistence owner.

## Shared actor contract

Candidate contract:

`contracts/kfb-2d-actor-module.v0.1-candidate.json`

Lifecycle:

`mount → root → update(dt) → setState(...) → dispose`

World/root motion remains consumer-owned.

## Consumer matrix

| Consumer | Intended use | Studio owns | Consumer still owns | Current status |
|---|---|---|---|---|
| DocCheck Project Island | Eumel as grounded 2.5D host/guide inside a KayKit 3D project island | source-exact Eumel art, local cutout rig, eye/face, local clips | island geometry, KayKit environment, collision, camera, interaction, project content | PREPARED CANDIDATE |
| KFB Resident Atlas | Eumel as a non-KayKit resident class with a thin mount/update/dispose seam | actor presentation and resident-local activity | Atlas recipe/habitat evidence; receiving game support/collision | PREPARED CANDIDATE |
| KFB Free Roam / Platformer | reusable resident/NPC on consumer-owned platform/island | presentation only | movement, floor/contact, portals, save, camera | NOT INTEGRATED |
| Travel / Town | resident/presenter on a named world anchor | presentation only | world coordinate truth, movement, persistence | NOT INTEGRATED |
| Combat / mini-games | NPC, referee, medic/presenter or reaction actor | presentation and reactions | game rules, target/damage/combat state | NOT INTEGRATED |
| 2D ToolBox | authoring, rig calibration, preview, clip tests and export | full authoring surface | n/a | CURRENT TOOL |
| DocCheck Doccy | future quadruped cutout actor using the same source-first rig grammar | topology template + shared eye protocol | final Doccy source art/identity, consumer runtime | TEMPLATE ONLY |

## 2.5D resident presentation

Default candidate for Eumel in a 3D environment:

`upright-yaw-billboard`

This means:

- actor remains grounded and upright;
- only yaw follows the viewing direction when the consumer chooses billboard mode;
- source cutout layers keep a tiny depth separation;
- shadow/support stays in world space;
- all movement across the island remains consumer-owned;
- the consumer may choose `world-facing-upright` instead when camera-facing behavior is undesirable.

Do not use full-screen CSS overlays as the resident runtime. The 3D consumer needs one world-space actor root.

## Resident Atlas rule

A 2.5D actor is a new **presentation class**, not a new Resident runtime.

Recommended resident binding:

```text
Resident recipe / scene module
        ↓
consumer-owned world anchor
        ↓
2D actor module mount()
        ↓
local animation/update only
```

No resident module creates its own collision island.

## Environment rule for the DocCheck Project Island

Georg's direction is a DocCheck project island using KayKit 3D scenery.

The exact KayKit pack/environment is **not selected by this document**. Resolve it through the Asset Registry/Resident or Game Dev Studio source path and pin the exact assets before implementation.

No generic “medical island” kit should be invented as a fallback.

## Doccy / quadruped direction

Doccy is the first planned quadruped class.

Template:

`templates/DOCCY_QUADRUPED_RIG_TEMPLATE.v0.1.json`

The template reuses:

- source-exact part decomposition;
- explicit anchor bones;
- neutral bind pose;
- optional small bend/stretch/squash deformers;
- shared `kfb.eye-rig.protocol/1`;
- actor/consumer ownership boundary.

It does **not** invent Doccy's actual artwork, limb proportions or face geometry.
