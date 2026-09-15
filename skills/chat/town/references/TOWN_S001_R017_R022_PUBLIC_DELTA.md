# KFB Town · S001 r017–r022 · Public project delta

**Date:** 2026-09-15  
**Status:** accepted Town design direction and project-only proposals. No runtime release.  
**Base:** public r016 Town documentation.  
**Purpose:** make the later S001 design work readable to Travel, ToolBox/Animation Lab, Asset Librarian, ChatterBox/Journey and other KFB consumers without copying private session material.

## 1 · Terrain and world growth

**DECISION:** the historical cutting-mat/table-ground idea is superseded for the active Town direction. KFB Town sits in naturally shaped stylized Travel terrain. Local work areas, roads and stage pads may be flattened where needed, but the world should retain hills, rock faces, vegetation and readable transitions.

KayKit Forest/Nature remains the default natural basis. Kenney City Commercial, Industrial and Suburban plus City Roads are candidates for an outer drivable City expansion. Scale and contact relationships must be checked with actual vehicles and KayKit characters rather than inferred from style similarity.

The Caveman can anchor an old cave/settlement layer. Mining, land use, construction and bank claims are possible social-conflict material, but exact roles and outcomes remain proposals.

## 2 · Current cast direction

**DECISION:** Paladin is the current body for King Kayfabian. The verified Paladin source includes helmet/no-helmet model variants and two source texture palettes. Crown fit and any recoloring belong to ToolBox/Rigging, not Town runtime.

**DIRECTION:** signature characters should have recognizable homes/territories instead of collapsing all antagonistic-looking figures into one dark quarter. Black Knight and Vampire therefore remain separate home candidates. Graveyard keeps the four Skeleton residents as a group. Farmer_A + Farmer_B form a farm ensemble with selected Cube-Pet inhabitants and farm props.

Black Knight's old fixed bodyguard assignment is no longer treated as final. A smaller royal guard can be assembled separately. Black Knight may instead be a recurring challenger/show antagonist while remaining socially part of the same world.

Werewolf Man/Wolf can be treated as two forms of one resident or, if later chosen, as competing identity counterparts. 4GTN/Forgotten and Animatronic Normal/Creepy are possible paired residents, not automatically the same person. Variants are not silently promoted into twins merely because files come in pairs.

## 3 · Farm, flora and outer habitats

Farm candidate: Farmer_A, Farmer_B, dirt plots, carrot/lettuce, pitchfork, wheelbarrows, fences and a Fantasy-Town windmill candidate. Selected Cube-Pets such as Cow and Pig can live there as equal-status Town inhabitants rather than passive livestock.

Plants may extend beyond normal forest assets through painted pots and selected Quaternius sci-fi flora. The alien vegetation should gradually increase toward an Area-51-like outer habitat rather than replacing the natural basis everywhere.

Area 51 is a future ground-station/landing-zone direction for Hunky and Dory, with a visible UFO/space landmark and a separately instanced underground research/archive space. Orbit/space travel, tractor-beam transitions and later moon routes remain backlog directions, not Town-runtime requirements.

## 4 · Small homes, open world, instanced interiors

Town should remain mainly an outdoor shared social world. Homes and signature sets can be compact exterior ensembles. Larger combat, rollercoaster, laboratory, voxel or dungeon experiences may sit behind recognizable entrances as separate instances.

A useful ensemble heuristic is roughly three meaningful resident/prop relationships per habitat, not a hard quota. Graveyard already has four Skeleton residents and therefore does not need to be forced into three.

## 5 · Cards, courier play and Fractal Almanac provenance

**DECISION:** all meaningful Cards the player encounters can become collected evidence/appetizers in the Fractal Almanac. Delivery, Stunt, Flight, Combat, Quest and Hidden Find are provenance events of the same source Card, not new card classes.

The player can act as a herald/reporter/courier of ideas rather than a conventional package-delivery character. A resident can ask the player to carry a Card, claim, question or reply to another resident. At the destination the player frames/presents it through a small curated choice. The receiving resident may answer, reinterpret, redirect or create a follow-up. This is a spatial conversation chain, not a generic fetch quest.

Monkey-Island-style curated choices remain preferable to a blank text field. The complete performance grammar remains Actor/POV -> SHOW IT -> SPIN IT -> SELL IT -> Quest/Closure when a large Kayfabulation is warranted. A small delivery does not have to invoke the whole ritual.

**PROPOSAL:** Almanac provenance can appear as removable viewing layers. A delivered Card may show a postal stamp/postage layer; a stunt-found Card a Stunt/CCTV marker; a flight Card a realm/flight marker. The source Card remains untouched. Multiple memories may attach to one Card rather than overwriting each other.

Hero moments should use semantic event + replay/reconstruction data where the owning Stunt/Travel system supports it. Replay, evidence and dramatized re-enactment remain distinct and do not grant the Card/POP again.

## 6 · Shared showstage and Boxel-ring direction

The central open showstage near the King tower remains the common place for Speakers Corner, Card commentary, Kayfabulation, cinema/reaction, concerts and staged fights.

**PROPOSAL:** Boxel Blitz is a donor for a kinetic cube surface, not a second host to copy into Town. A common surface vocabulary can support a landscape-placed wrestling/speakers-corner ring, a later Avian-Swordsman voxel pyramid, music/show surface movement and later Minecraft-light/building experiments.

Passive building/terrain blocks and active bumper/face Boxels remain distinct roles even when they share the cube visual language.

Current ring sketch: rectangular Card-like surface, four corner bumper posts, elastic tube/rope boundaries, optional energy-field boundary, moving/active Boxel cells, safe entry/exit zones, and a floating Jumbotron/MediaSurface above. The ring may host simple punch/melee first and later paired wrestling choreography such as lift/slam/suplex. Pair moves require synchronized actor/target phases and rig/size testing in Animation Lab.

This does not transfer Combat Arena, melee, physics or animation ownership to Town.

## 7 · Roadside media and navigation

**DECISION / WORLD DIRECTION:** diegetic direction arrows, road signs, wooden signs, billboards and Hero media belong early in Town/City. The existing Stunt-Race roadside-media direction is the donor; Town should not create a second independent billboard/media architecture.

Billboards may show Cards, Triplets, Adbusting claims, video/broadcast or Jumbotron content. Only selected Hero signs need interaction; the majority can remain scenery/media. Quest navigation should be readable from the world before adding another GPS-style system.

## 8 · Speech-bubble attention budget

**DECISION:** one active NPC speech bubble is the normal visual state. Two simultaneous bubbles are the soft maximum in the player's current view. A third bubble is only a named exception for a clear reply/escalation moment, not a new steady-state budget.

This derives from the existing Overworld/ChatterBox attention principle: its runtime uses max two world bubbles and one per zone, with bounded exceptions for replies/escalation. Town adopts the perceptual rule, not the 2D zone implementation.

**Billboards, Jumbotron, road signs and other MediaSurfaces do not consume the NPC speech-bubble budget.** They are background/media layers. If an interactive billboard opens an actual NPC/chat bubble, that bubble counts normally.

## 9 · Current design probe

`skills/chat/town/artifacts/TOWN_R022_DESIGN_PROBE.html` is a non-runtime visual probe with one Card shown clean or with Delivery/Stunt/Flight provenance overlays, a schematic landscape Boxel ring with four bumpers/tubes/optional energy boundary/Jumbotron, and the 1-default / 2-soft-max bubble rule with billboard exception.

Dummy content only. No Three.js, physics, browser, rig, combat or reward PASS is claimed.

## 10 · Consumer handoff after the session cut

Travel Globe: offer current terrain/sky/weather source and a safe placement area without flattening the entire world.  
Asset Librarian / Town Workbench: produce an ensemble candidate for terrain + tower + showstage + cast/props, preserving exact asset refs.  
ToolBox / Animation Lab: crown/Paladin variant, minimal eye-rig experiments after scene viability, stage gestures, flight expression and later pair-wrestling choreography.  
ChatterBox/Journey/Almanac: confirm current bubble/attention hooks and current Card/event/save contract before provenance fields are implemented.  
Stunt/Combat: expose donor events/replay/physics only through their existing owners. No Town fork.

## 11 · Open cursor

After this cut, reduce the current Boxel-Blitz donor to the actually reusable surface/bumper/spring seams, verify Almanac/Journey provenance against the current save contract, and combine one Town-Workbench candidate with the current Travel terrain. Then build one real 3D ring placement and one Card-memory path rather than a new general framework.
