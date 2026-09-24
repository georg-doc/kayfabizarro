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
