# KFB Island MVP · Integration Census · 2026-10-07

Status: **PLANNING CENSUS · ANTI-FEATURE-LOSS INPUT · NO RUNTIME OWNER CHANGE**
Current product owner: **KFB WorldBuilder / WB2 · Issue #360 · Draft PR #348**
Product status: **NO MVP**

Purpose: enumerate current reusable owners/donors/modules before freezing the bounded-Island One-Shot, so existing systems are not silently dropped or replaced by placeholders.

## Classification
- **MVP REQUIRED** — representative real integration must be present in the same candidate.
- **MVP STRONGLY INCLUDE** — high product value / low-to-moderate integration cost; include unless source audit proves it destabilizes the product.
- **MVP OPTIONAL PROOF** — useful vertical proof, not required for product acceptance unless promoted by Georg.
- **LATER** — explicitly outside first Island MVP.
- **DO NOT SUBSTITUTE** — existing real owner/consumer must not be replaced by placeholders or generic stand-ins.

## A · World / persistence foundation

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Bounded island document/runtime | WB2 / PR #348 | accepted direction; one-owner rule | **MVP REQUIRED** |
| Continuous Surface Truth | WB2 continuous terrain foundation | topology-independent foundation present; replay/contact still needs proof | **MVP REQUIRED** |
| Stable WorldObject identity | WB2 registry/current foundation | semantic IDs survive batching; authored visible/physical replay still open | **MVP REQUIRED** |
| Island-local physics frame | WB2 | gap exported in Island Foundation Return | **MVP REQUIRED** |
| PLAY / BUILD / GOD | existing WB2 authoring/editor path | receiving owner exists; must be reconciled to bounded island | **MVP REQUIRED** |
| Place / Move / Rotate / Scale / Surface Snap | WB2 + Asset Librarian source path | owner exists; final consumer proof required | **MVP REQUIRED** |
| Terrain Raise/Lower / Sculpt | WB2 sculpt donor | mechanism exists; ordered replay/policy still open | **MVP REQUIRED** |
| Save / fresh reload / import | WB2 Scene/Store | existing mechanisms; exact bounded-island reconstruction not yet proven | **MVP REQUIRED** |
| Generator/source revision pinning | island document proposal + WB2 store | gap | **MVP REQUIRED** |
| Bounded streaming / unload / reload isolation | WB2 | same-seed/document isolation gap | **MVP REQUIRED** |
| Near/Mid/Far island LOD + impostor seam | R2C/TinySkies-style donor idea | architecture input, not accepted runtime | **MVP REQUIRED for performance if needed; implementation can be minimal** |

## B · Player / movement / drive

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Ground controls | current Ground Controls Canon | binding keys/one movement writer | **MVP REQUIRED** |
| Locomotion clips/profile | Motion SSOT / PR #344 + locomotion-profiles donor | clips/measurements exist; current consumer feel NOT accepted | **MVP REQUIRED · P0** |
| Default Jog / faster Shift Sprint / deliberate Slow Walk | product decision | needs consumer tuning; no skating | **MVP REQUIRED · P0** |
| Backward movement | Motion/ground consumer | current feel too slow; stride/speed match required | **MVP REQUIRED · P0** |
| Cartoon Jump | Jump_Start / Jump_Idle / Jump_Land donor | timing/feel not accepted; actual ballistic/contact sync required | **MVP REQUIRED · P0** |
| Camera | single camera owner; Joyride J09/J10 donor + WB2 current | known failures in complex/close geometry; must pass normal-input critic | **MVP REQUIRED · P0** |
| Joyride playable shell | J16/J17 lineage | strongest current walk/drive/track donor; not world owner | **MVP REQUIRED as donor baseline** |
| Vehicle / Drive | Joyride k2b/k2 / current Drive owner | J16/J17 drivable; bounded-island consumer integration required | **MVP REQUIRED** |
| Enter / Exit vehicle | Joyride J14–J17 lineage | existing mechanism; Cabrio special body/seat animation may be omitted | **MVP REQUIRED, simple transition allowed** |
| Cabrio seat/ear/hand special kinetics | J17 | high-speed issues remain | **LATER / TUNE, not MVP blocker** |

## C · Roads / world construction / look

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Track Core | current Track Core owner / v0.12 lineage | route construction/contact owner | **MVP REQUIRED** |
| Joyride visible road language | J14/T4/J16/J17 lineage | proven design donor; prior MVP omitted it and failed | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Normal road + village sidewalk | Joyride/Lab donor over Track Core | donor patterns exist; source-backed consumer proof needed | **MVP REQUIRED** |
| Bridge / water crossing | Track Core + Surface Truth | representative seam required | **MVP REQUIRED** |
| Simple race/loop section | Joyride/Track Core | proven lineage; keep first slice simpler than 720° spiral | **MVP REQUIRED as one representative fun section** |
| Complex 720° spiral / Skydrive / large Race-Tube spectacle | J16 | stress-test/content donor; camera/perf risk | **LATER** |
| Settlements / city blocks | historical WB2/Coworker donors | long blocks not needed | **LATER / not required** |
| Sparse surreal Toy-World composition | current product direction | preferred over procedural suburbia | **MVP REQUIRED visual direction** |
| Signature Landmark | current signature/landmark seam | no mandatory Life Tree type | **MVP REQUIRED** |
| Life Tree | Island proposal | optional landmark family, not topology rule | **MVP OPTIONAL** |
| Water / river | Surface Truth + visual presentation | old hanging-ribbon water is explicit FAIL pattern | **MVP REQUIRED representative water seam; no ribbon placeholder** |

## D · Visual / material / environment

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| KFB Clay | K1/H0 Golden + K2/v10 routing | binding surface canon | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Claybound Compatibility Gate | design benchmark / current product rule | new content must plausibly belong to one coherent clay toy world | **MVP REQUIRED QA rule** |
| Source identity preservation | Asset/visual owners | source object must be shown in isolation before adaptation | **MVP REQUIRED** |
| Sky / Skydome / Environment | existing Sky owner | owner exists; no second sky runtime | **MVP REQUIRED** |
| Lighting / shadows / contact | current KFB canon | known world-scale bias/contact rules | **MVP REQUIRED** |
| Near/Mid/Far Clay complexity | K2/Lab donor | performance architecture input | **MVP REQUIRED if necessary for target FPS** |
| Boardgame/Paper/Fabric/custom forms | external/internal donor ideas | raw ideas only; must pass Claybound compatibility and reuse-first gate | **OPTIONAL** |

## E · Living world / character systems

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| One real Resident seam | Resident owner / Atlas | existing sources | **MVP REQUIRED** |
| ChatterBox | existing ChatterBox owner / PR #357 packet | planning/tooling ready; actual runtime consumer seam required | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Resident Life / POIs / Activities | Resident Life prep | proposal data; enough for representative activity loop | **MVP STRONGLY INCLUDE** |
| Resident Reaction / Encounter | current reaction matrix | prepared | **MVP STRONGLY INCLUDE** |
| Resident performance / choreography | #369 + current Motion/Atlas | reusable performance vocabulary in progress/ready input | **MVP STRONGLY INCLUDE where available** |
| Face/Eye/Emanata layers | EyeRig/face/performance owners | existing owners; reuse where low-risk | **MVP STRONGLY INCLUDE for visible Residents** |
| Fluff Work motions | PR #356 | source clips prepared; runtime consumer proof still next | **MVP OPTIONAL / useful if chosen activity uses Fluff** |

## F · Media / semantic content

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Clay Billboard / MediaSurface | existing Billboard owner | required by current product matrix | **MVP REQUIRED** |
| HyperNormalisation content loop | existing HyperNormalisation/Quote/Media owner | must use real consumer/content; placeholder graphics forbidden | **MVP REQUIRED · DO NOT SUBSTITUTE** |
| Card | current Card/deck source owner | canonical source/provenance required | **MVP REQUIRED representative seam** |
| Almanac | current Almanac owner | acquire/inspect/provenance chain | **MVP REQUIRED representative seam** |
| Deck → World/Card/Resident semantic chain | Deck-World pipeline | planning contract exists | **MVP STRONGLY INCLUDE as data relation** |

## G · Audio

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Shared Audio/Jukebox owner | Audio owner / PR #365 lineage | existing owner; no second AudioContext | **MVP REQUIRED** |
| Existing runtime-verified music families | current Audio handover | some families already runtime-verified | **MVP REQUIRED representative use** |
| M/N/O Island/Dusk/Discovery stem families | Audio handover | source-present, some runtime/listening QA still pending | **MVP STRONGLY INCLUDE if QA-cleared** |
| World-side duplicate BPM/stem tables | none | forbidden | **DO NOT BUILD** |
| One coherent biome/POI transition | Audio owner consumer | product integration proof needed | **MVP REQUIRED** |

## H · Entry / game presentation modules

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| Theatre Curtain r3 | Issue #372 / accepted donor packet | Georg PASS; checked into main; user now requests final KFB/Claybound claymation compatibility before integration | **MVP STRONGLY INCLUDE** |
| Curtain loading / Character Select / in-game reveal states | same module | seven-state modular use described in Return | **MVP STRONGLY INCLUDE** |
| Curtain clay/cartoon look tune | current visual owner / Claybound compatibility | still needs final style reconciliation per Georg | **MVP STRONGLY INCLUDE if bounded** |
| Minimal game HUD / Joyride HUD elements | Joyride lineage | proven donor; do not let UI dominate | **MVP STRONGLY INCLUDE** |
| Radio/Jukebox controls | Audio/Joyride UI donor | existing concept; consumer-driven only | **MVP STRONGLY INCLUDE if it exposes real Audio owner** |

## I · Shared world-event / transformation grammar

| Capability | Current owner / donor | Current state | MVP |
| --- | --- | --- | --- |
| UFO Tractor Beam Event Lab | current UFO Lab | PASS/TUNE donor ready | **MVP OPTIONAL PROOF** |
| Shared Clay materialize/dematerialize presentation | UFO + current architecture decision | candidate common visual grammar; state ownership remains separate | **MVP STRONGLY INCLUDE as reusable presentation seam if low-risk** |
| Build / Repair / Rebuild presentation | Resident/Fluff/Destruction donors | pieces exist; common presentation can be layered | **MVP OPTIONAL PROOF** |
| Destruction state | Seed World Mech donor | 2-bit damage donor only; Combat owner not current | **LATER / optional bounded proof** |
| Full Combat | archived failed candidate / future owner | explicitly non-blocking | **LATER** |

## J · Tools that should feed MVP but are not runtime features

| Tool | Role | MVP relation |
| --- | --- | --- |
| Asset Librarian | source isolation / real asset selection | **required production input, not second runtime** |
| Style Reference Library | Claybound/KFB comparison and design QA | **required QA/reference input** |
| Production Hub / MVP Living Doc | anti-feature-loss / status | **control surface only** |
| Prototype Graveyard | negative Goldens / salvage evidence | **QA/reference input only** |
| Blender MCP | rig/animation asset authoring where genuine gap exists | **specialist input, no runtime ownership** |

## K · Explicit first-MVP non-blockers / later scope

- full 130+ island universe;
- every Deck/Resident/Card/Billboard;
- full Combat Arena/platformer;
- full quest/economy;
- multiplayer/network backend;
- OSM as second planner input;
- complex Cabrio seat/ear/hand kinetics;
- 720° spirals / full Skydrive spectacle;
- full destruction sandbox;
- full Fluff economy;
- mandatory Life Tree on every island.

## L · Placeholder / shortcut firewall

The following never count as integration:
- fake Billboard texture in place of the real Billboard/HyperNormalisation consumer;
- placeholder Audio or a second AudioContext;
- generic UI replacing the accepted Curtain/HUD owner;
- technical Track Core geometry shown as final Joyride road presentation;
- fake/generic Residents instead of the current Resident/ChatterBox seam;
- copied Card artwork without canonical provenance/Almanac relation;
- default KayKit material used as final KFB Clay;
- a generic tree/river/landmark merely because a procedural generator can make one;
- custom prop/building that fails the Claybound Compatibility Gate;
- a loaded asset URL without source-isolation proof.

## M · Recommended first Island MVP content contract

One bounded, persistent island containing:
- strong Player locomotion (Jog/Sprint/Slow Walk/Backwards/Cartoon Jump);
- one simple Joyride road loop with sidewalk, bridge/water and modest race/fun segment;
- Drive + enter/exit;
- one strong signature Landmark (not necessarily a tree);
- 2 visually distinct zones / Scenelets;
- small authored POI cluster, not long city blocks;
- two Residents with at least one meaningful activity/reaction/dialogue interaction;
- one real Billboard/HyperNormalisation loop;
- one Card → Almanac interaction;
- one real Audio/Jukebox environmental/POI transition;
- current Sky/Environment;
- KFB Clay + Claybound compatibility;
- Curtain/game-entry module if integration remains bounded;
- PLAY/BUILD/GOD;
- place/edit/source-snap + sculpt;
- Save → complete unload → fresh reload/import → exact replay → return to PLAY;
- module critics + different whole-product critic;
- complete frozen MVP acceptance matrix remains the final product gate.

## Next action

Web Chat should now review this census with Georg and classify each row:
**KEEP IN MVP / STRONGLY INCLUDE / OPTIONAL / LATER / REMOVE**.

Only after that classification is frozen should Work/WSA receive the next Island One-Shot briefing.
