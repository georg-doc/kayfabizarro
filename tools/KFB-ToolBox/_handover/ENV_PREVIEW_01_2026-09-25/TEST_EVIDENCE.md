# ENV-PREVIEW-01 · test/evidence checkpoint

Status: **IMPLEMENTED CANDIDATE · CONTRACT TEST ADDED · BROWSER/HUMAN OPEN**  
Date: 2026-09-25

Implementation checkpoint:
\`32e12c837d347368fc4ae0bac1fa880a191aa258\`

Scope:
- one shared adapter at \`tools/KFB-ToolBox/lib/environment-preview.v1.js\`;
- current Travel/World sky/light/fog source consumed by reference;
- Resident Atlas S40 host environment reuses the adapter;
- ToolBox Production-01 reuses the adapter;
- default = WORLD_MATCH;
- SOURCE_ISOLATION remains available;
- Evening/Night are source-backed consumer presets;
- current proofs use visible shared \`ground\` support only;
- \`terrainPatch\` / \`worldZone\` fail closed unless a real support provider is supplied.

Protected:
- host renderer / scene / camera;
- Resident ownership;
- ToolBox actor / pose / motion / mixer ownership;
- Travel terrain and biome truth;
- WorldBuilder terrain/support ownership.

Not claimed:
- no actual terrainPatch/worldZone consumer yet;
- no public Stage;
- no browser PASS yet;
- no Georg visual PASS yet.

CI contract checks are intentionally static/owner-focused. They do not replace browser review.
