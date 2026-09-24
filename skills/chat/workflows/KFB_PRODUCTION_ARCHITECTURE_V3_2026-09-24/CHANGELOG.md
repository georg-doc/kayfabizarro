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
