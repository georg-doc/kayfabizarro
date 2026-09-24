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
