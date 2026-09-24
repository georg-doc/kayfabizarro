## 2026-09-24 · Character / Resident production workflow

- added `CHARACTER_RESIDENT_PRODUCTION_WORKFLOW_2026-09-24.md`;
- made Resident Atlas / ToolBox the default everyday authoring surface for static pose, prop fit, scene composition and reusable Resident modules;
- restricted Blender MCP to genuine technical-boundary work: new time-based motion, retarget, multi-frame repair, skeleton/weights/topology, custom head/body derivatives and bake/export;
- defined a browser Pose → Blender handoff so Georg can author a target/contact pose in Resident Atlas and Blender only performs the missing time-based correction;
- confirmed Resident Atlas S7 already provides object G/R/S, Drop, bone rotation, puppet/IK handles, foot pinning, Studio patches and Resident-bundle import/export;
- protected the current 33-action Rig_Medium/Rig_Large Motion Library from needless per-Resident retarget duplication;
- converted the preferred KayfaBizarros product route into a baseplate-free Resident Performance Module with song/action/pose refs rather than a monolithic stage GLB;
- drummer route is now browser reference-pose first; automatic arm-to-drum solving remains rejected;
- generic “rerig Legacy” is rejected as a task because Rig_Legacy + native clips already exist; Blender only handles a concrete custom derivative/missing external motion/geometry repair;
- prepared a high-value future Blender Actor Family Factory for Frizzle-Orc Medium/Large/Legacy while preserving destination rigs;
- exact Frizzle-Orc 3 Rig-Warp, Musknacker and blank Legacy head/accessory sources remain honestly SOURCE_REQUIRED until pinned;
- added five copy-ready jobs:
  - `RESIDENT-BAND-MODULE-01` READY
  - `POSE-TO-BLENDER-01` READY
  - `BLENDER-ACTOR-FAMILY-01` HOLD
  - `BLENDER-MOTION-02` HOLD
  - `LEGACY-CUSTOM-ACTOR-01` HOLD
- catalog now **13 strands / 78 jobs / 35 READY / 43 HOLD**;
- architecture/source validation now **134/134 PASS**;
- current RKIT/track Blender authoring is explicitly not interrupted by this workflow;
- no runtime, public Hub, Cloudflare Live or merge state changed.

## 2026-09-24 · P2 Skills / Runtime Contracts census and consolidation route

- added `SKILLS_RUNTIME_CONSOLIDATION_2026-09-24.md` as the P2 donor-first census/plan for the mixed `skills/` tree;
- confirmed old `EMBED_CUBE_PET_FULL_v2.2.md` is no longer the universal actor-embed entrypoint; it remains valid for canonical 24-CubePet consumers;
- pinned `tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md` as current non-CubePet embedding donor for FrizzleBob Graft and CapsuleCarl/Wissens-Pilli; native KayKit/GothGirl remain routed through their FaceHost/EyeRig owners;
- preserved current Wissens-Pilli/Carl requirements: source mouth cleanup, current red mouth set, one face owner and material-zone config;
- separated the Card/PDF stack into reusable layers: Deck Viewer v4/`kfb-corpus.js` for performant PDF/cache/presentation, `kfb-card-builder.js` for canonical KFB card rendering/crop/ink, Almanac metadata above them;
- recorded that blind page-quarter cropping is not a universal KFB deck rule; registry/default/auto-resolver owns card-grid layout;
- clarified Ink terminology: current implementation `family:'band'` already is the continuous closed ring/ribbon with one fill + taper; no second “RING” canon is to be invented;
- prepared future 3D Ink adapters for surface ribbons, physical ropes and outer card silhouettes without per-triangle wireframe/double grids;
- recovered active legacy donors for Talk/Viseme/Bubbles and retained them as inputs to a current skill rather than declaring all PetStudio history dead;
- made ToolBox Production milestone explicitly include Mouth/Viseme/Talk, Voice/Bubbles, Material Zone Color/Texture Surface and Card/PDF viewing;
- confirmed current ToolBox UI brief already requires Hex Copy, validated Colorpicker and Material/Surface owner routing; universal per-zone texture assignment remains a real missing capability;
- flagged stale `skills/SOT_REGISTRY.md`, historical embed bundles and binary GLBs directly under `skills/` for census/import-scan before any move;
- added P2 jobs `SKILLS-CENSUS-01`, `SKILLS-CURRENT-01`, `SKILLS-ARCHIVE-01`, `CARD-VIEWER-CORE-01`, `INK-3D-ADAPTER-01`;
- only `SKILLS-CENSUS-01` is READY; P2 is hidden from Today/default priority while P0/P1 work exists;
- catalog now **13 strands / 73 jobs / 33 READY / 40 HOLD**;
- architecture/source validation now **117/117 PASS**;
- no runtime Skill file, old app, public Hub, Cloudflare Live or merge state was changed.

## 2026-09-24 · Card Zones + Player Meta / Almanac / Adaptive Interface

- promoted **Card Zones / Card Objects** to a first-class primary strand instead of leaving Card Zone only as an adjacent Vertical/World module;
- pinned exact Card Zone Lab v2 source and CODE_MAP;
- pinned StoryMap's source-locked `kfb-fluid-v2/card-zone-v2-fluid-source.js` as the preferred reusable fluid-shader donor;
- explicitly demoted old `kfb-fluid-v1` extraction to historical/diminished evidence where not revalidated; StoryMap itself marks it DEAD;
- preserved Card Zone source capabilities: animated moat/river/pond water, Card Stack, unfold/reveal, Beam/projector, six-face Card Cube/FaceFocus and card-seeded zone parameters;
- added six Card Zone jobs from exact-fluid recovery through a complete WorldBuilder→card→Almanac collection loop;
- promoted **Player Meta / Fractal Almanac / Adaptive Interface** to a first-class primary strand;
- reused `overworld/overworld/journey.js` as the versioned import/export/migration donor without reviving the old Overworld runtime;
- separated authored WorldBuilder world saves from durable player Journey facts;
- defined one universal POP account under Player Journey; existing Travel `popScore` becomes presentation/event-adapter evidence only;
- recorded Georg's current **20 visible Backpack slots** direction honestly as user product direction; the exact historical old sketch/source remains unpinned rather than being falsely claimed;
- Fractal Almanac now explicitly spans collection, Diary, quest/memory, replay, progress/Journey archive and optional immersive chamber; it is not just Card Inventory;
- ordinary gameplay direction now keeps a real-card Almanac fan upper-right, while immersive Almanac suppresses ordinary HUD;
- adaptive HUD is provider-based: real Race route minimap / real world navigation / real mode instruments only; no fake universal minimap or filler instruments;
- current shared inline editor was measured at **28×28 px controls / 13 px glyphs**; added a bounded authoring-legibility job targeting context-local ~40–44 px hit areas, ~20–24 px recognizable icons, active states and shortcut tooltips without changing edit-layer behavior;
- Hub catalog now contains **13 strands / 68 jobs / 32 READY / 36 HOLD**;
- architecture/source validation increased to **96/96 PASS**;
- public Hub/HUB-CTRL, product runtimes, Cloudflare Live and merge state remain unchanged.

## 2026-09-24 · RKIT / OSM bake / Elastic torsion / Audio-VFX production decisions

- resolved RKIT-02 D1–D5 for the fast playable path:
  - Rapier becomes the stunt-dimensioning / airborne-contact basis (27 m/s, gravity magnitude 15 m/s² downward, proven physical ramp);
  - human-positive Track-Lab v0.8 remains handling-feel donor, not a second physics owner;
  - canonical width ladder remains 10.8 / 14.4 / 18.0 / 21.6 m; 28.8 m is special XL only;
  - keep a ~12 m base jump and add a ~30 m Hero step-down;
  - Race owns takeoff/air/landing and moving-support contact; RKIT owns reusable geometry + hinge/zone metadata.
- product route deliberately avoids a general track editor: first authored recipes are `TRACK_A_STUNT_8`, `TRACK_B_OVAL_EXIT`, `TRACK_C_FLOW_LOOP`, compiled/baked into reusable Track Modules.
- formalized OSM World Zone baking: fetch/normalize/compile once, then load versioned cached zones in WorldBuilder; Cologne first, Barcelona second portability proof.
- geographic OSM truth is separated from authored WorldBuilder composition, so e.g. Barcelona + Cologne Cathedral is a valid fictional composition without corrupting provenance.
- current Hürth R2 remains frozen; added an isolated Elastic Torsion/Landmark proof using existing GROTESQUE / BuildingElastic / LandmarkElastic donors rather than a third repair pass.
- added human-readable Sound Audition Library, song/Resident beat-bar Performance Timeline and source-backed VFX Audition Library.
- audio/VFX production loop is now inventory → audition → select → small semantic recipe batch → shared review scene → promotion; games consume semantic ids, not opaque filenames.
- added eight copy-ready jobs:
  - `RACE-TRACK-RECIPE-01`
  - `RACE-RKIT-03`
  - `WORLD-ZONE-BAKE-01`
  - `WORLD-ZONE-BAKE-02`
  - `LOOK-TORSION-01`
  - `AUDIO-AUDITION-01`
  - `MUSIC-PERF-01`
  - `VFX-AUDITION-01`
- Hub catalog now contains **11 strands / 53 jobs / 26 READY / 27 HOLD**.
- source/architecture contract validation increased to **73/73 PASS**.
- no product runtime, public Hub, Cloudflare Live or merge was changed.

## 2026-09-24 · gameplay/world expansion · Combat, Pets, Travel, Vertical, Town, Stage

- expanded v3 from 5 to **11 primary production strands** and from 19 to **45 copy-ready jobs**;
- added Combat / Duel Choreography as an NPC-vs-NPC + Arena + Hero-Shot + World Encounter strand, reusing Combat PR #5/#7/#10 and PR #6 choreography/spindle briefs;
- added explicit Combat Actor Family Matrix for Rig_Medium, Rig_Large, Rig_Legacy, CubePet/procedural and later 2D/2.5D/Block adapters;
- added autonomous Match Director, Card Tower Encounter and Open-World Combat adapter directions without moving damage/reward ownership out of Combat Arena;
- added Cube Pet / Actor Identity strand; canonical 24-pet stack retained; `cube-frizzlebob`, `legacy-arena-frizzlebob` and `frizzlebob-driver-graft` are now distinct technical identities;
- added Travel Modes / World Surfaces: topology and locomotion are orthogonal; FLAT/SPHERE/TORUS first, Ground/Flight/Drive/Boat/Air/Freefall modes with one active movement writer;
- recovered TinySkies inventory evidence for Carpet, Boat and Plane; Boat/Plane are source-recovery jobs, not falsely claimed as already ported;
- added Vertical/Babel/Card Tower strand; failed Platformer auto-jump source remains honestly `SOURCE_REQUIRED`;
- added Town/ChatterBox/NPC-Life strand using encounter beats, filtered Journey/card memory and typed gifts rather than a second dialogue/memory engine;
- added Shared Stage strand for Spindle, Theatre Curtain, Stage recipes and semantic VFX/SFX maps;
- routed adjacent 2D/2.5D, Storytelling Maps/CardRig, Dungeon, Card Zone, VFX/SFX, Tourbus/WaterBowser and other minigames into the primary strands as modules;
- Hub catalog schema v3 is strand-first: **11 strands / 45 jobs / 20 READY / 25 HOLD**, job cards collapsed by default;
- current source/architecture validation: **52/52 PASS**;
- no product runtime, public Hub, Cloudflare Live or merge was changed.

## 2026-09-24 · complete production strands + copy-ready jobs

- expanded v3 from four starter jobs to five visible strands and 19 Hub job cards;
- added `PRODUCTION_STRANDS.md` for ToolBox, Animation/Residents, WorldBuilder/God Mode and Racer→World;
- added `STRAND_BRIEFINGS.md` with copy-ready executor prompts for every prepared milestone;
- recovered and reused existing Resident Atlas object G/R/S + Bone-Posing as the Pose Studio donor;
- recovered Motion Lab / KCL phase-sync, speed→timeScale, hysteresis and richer locomotion-state research as the Animation Studio foundation;
- retained EyeRig v6 as sole eye runtime; Vehicle FaceHost path reused; independent left/right eye authoring recorded honestly as missing additive capability;
- reused Asset Librarian context-aware Resource Picker rather than creating another asset catalogue;
- pinned current EyeRig #104, creator/KCL #107, Motion Lab #127, ToolBox #185, shared editor #186, WB2 #190, Blender #192, Warband #195, Motion Library #197, WB-W0 #203 and Racer #33 heads;
- Hub catalog schema v2 now includes complete strands, current READY work and fully prebriefed dependency-gated HOLD jobs;
- architecture/source contract validation increased to **31/31 PASS**;
- no Cloudflare, Live, merge or product-runtime owner change.

# CHANGELOG · KFB Production Architecture v3

## 2026-09-24 · v3 candidate created

- established coherent usable capability as the normal unit of work;
- split PRODUCTION / REVIEW / RECOVERY modes;
- made direct real-source chat review the default for small visual questions;
- restricted Cloudflare to milestone/publication use;
- defined one-active-integration-PR-per-owner default;
- introduced GitHub Bridge so Claude Design / Blender MCP do not require repository write access;
- moved full codebase recovery/post-mortem exports out of normal successful iterations;
- added typed `sourceHead` / `prHead` / `deployHead` status model;
- created four self-service jobs:
  - Web Quick 3D Review;
  - ToolBox Coherent Integration 01;
  - Blender Resident Performance Batch 01;
  - WorldBuilder Capability R1;
- pinned current ToolBox, Blender, Motion Library, Warband, WB-W0, WB2 and shared-editor inputs;
- prepared a machine-readable Hub Briefing Catalog;
- top-level Chat router now points to this v3 candidate on PR #204;
- contract validation: 20/20 PASS;
- no product runtime, Cloudflare Live state or owner contract changed.
