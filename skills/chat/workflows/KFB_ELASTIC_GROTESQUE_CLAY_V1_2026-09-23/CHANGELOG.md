# CHANGELOG · KFB Elastic Grotesque Clay v1

## 2026-09-23 · HÜRTH 01 · IMPLEMENTATION + BROWSER EVIDENCE

### ADDED
- bounded Hürth 01 experiment under the existing OSM City Lab;
- 22-source-building comparison fixture;
- exact current-Grotesque donor execution beside CLEAN;
- new continuous Elastic Grotesque Clay presentation shell;
- semantic roof caps and protected window/door details;
- per-building focus + source isolation;
- dedicated Playwright/WebGL2 evidence gate.

### UNCHANGED
- Hürth OSM source/cache;
- S2/collision/export geometry;
- Travel / Race / WorldBuilder movement and world owners;
- current City Lab default modes;
- landmark and vehicle owners.

### REPAIR
Initial browser run timed out without useful diagnostics.
Diagnostic run proved one literal `\\n` syntax seam introduced while adding evidence state.
Exactly one runtime repair replaced that token with a real newline.
No visual/deformation parameter was changed by the repair.
Browser rerun: **16/16 PASS**, zero page/console errors.

### HUMAN GATE
Georg visual review of CLEAN vs CURRENT GROTESQUE vs ELASTIC, with source isolation.
No public Stage and no Live promotion before that gate.


## 2026-09-23 · HÜRTH 01 V2 · GEORG BENCHMARK ACCEPTED + 3D TRANSLATION

### USER DECISION
- benchmark shape/detail/clay direction accepted;
- stronger cartoon palette requested;
- selected future enterable houses with source-backed KayKit doors recorded as DEFERRED.

### ADDED
- accepted benchmark JPEG pinned in GitHub;
- coherent low-frequency group warp;
- non-parallel warped roof plane;
- stronger rounded/bowed continuous volume;
- irregular 2–3 tall windows without bright frame;
- varied door size;
- continuous Catmull-Rom road / curb / path ribbons;
- systemic `KFB_WONKY_90S_CLAY_V1` palette;
- depth/layer handling intended to remove the prior bright road/ground overlap artifacts.

### TESTED RESULT
- v2 head `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`;
- run `35909757979`: **21/21 PASS**;
- 3/3 WebGL2;
- 0 page/console errors;
- artifact `10772592799`;
- digest `sha256:14033aea95c75d006d3333347809a1a147256ba31dd28bda5505570d6572aedf`.

### NEXT GATE
Georg visual review of the **actual v2 3D translation**. Blender-MCP generalization waits for that gate.


## 2026-09-24 · HÜRTH 01 V2 · LEAD ANTI-REGRESSION + SELF-CONTAINED CHAT REVIEW

### ROUTING
- added `LEAD_OVERRIDE_2026-09-24.md`;
- registered the slice in `skills/chat/REGISTRY.json` as `CURRENT_REFERENCE`;
- marked old City-Lab GROTESQUE as comparison evidence only;
- marked Hürth 01 V1 as superseded for continuation;
- retained V2 candidate `ELASTIC_GROUP_WARP_V2` / `KFB_WONKY_90S_CLAY_V1`.

### REVIEW TRANSPORT
- diagnosed the prior chat preview as an external iframe/source-chain wrapper;
- switched the chat-facing review contract to single-file/self-contained HTML;
- explicit rule: no iframe, CDN, runtime fetch or cross-origin module chain;
- canonical PR #194 V2 Three.js runtime remains unchanged.

### TESTED RUNTIME
- tested runtime/source head remains `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`;
- run `35909757979`: **21/21 PASS**;
- **3/3 WebGL2**;
- **0 page/console errors**.

### NEXT GATE
**Georg human visual review of the Hürth 01 V2 actual form language.**


## 2026-09-24 · HÜRTH 01 · CHAT MIRROR REGRESSION REJECTED

### USER DECISION
- simplified self-contained Canvas mirror rejected as visual authority;
- it visibly regressed building rendering / facade-detail placement / proportions versus the good V2 direction;
- do not tune or generalize from that mirror.

### ROUTING
- `CHAT_RECOVERY_CURRENT.md` added as the short current recovery cursor;
- Registry points this slice to that recovery file;
- Lead Override and START_HERE explicitly route to actual V2 truth.

### CURRENT
- canonical V2 Three.js runtime remains PR #194 / tested head `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`;
- 21/21 browser PASS · 3/3 WebGL2 · 0 page/console errors remain the last tested runtime evidence;
- no runtime/deformer parameter changed in this recovery update.

### NEXT GATE
Recover/show the actual tested V2 output for Georg review. No new substitute renderer.

## 2026-09-24 · HÜRTH 01 · TUNE ONCE

### HUMAN INPUT
- unchanged V2 @`0c59e92d` reviewed in real Chrome;
- verdict: **TUNE ONCE**;
- four bounded targets: bowed-wall details, shadow banding, road-junction wedges, roof overhang.

### IMPLEMENTED
- facade details use final bowed-shell surface position + tangent/vertical/normal basis;
- Elastic shadow setup uses tight fit, `bias=0`, `normalBias=.04`;
- same-colour asphalt patches close real shared-OSM-node road seams;
- final wall-top ring receives a small bounded roof overhang.

### SELF-REVIEW REPAIR
First junction-patch integration also created pale curb/path discs. The QA image exposed that immediately; those discs were removed. Final candidate retains only asphalt junction patches.

### TESTED RESULT
- final head: `75b3c460ac37aac57cb5d9e96260517c5b4cf68d`;
- run: `35945185715`;
- **29/29 PASS**;
- **3/3 WebGL2**;
- **0 page/console errors**;
- artifact `10786850367`;
- digest `sha256:716bfcab9dc6f4ed0180e0fd148b7a1494efca796bbe49746de762b0f8a900b0`;
- CLEAN / CARTOON / GROTESQUE still boot unchanged.

### PUBLICATION
- wrapper on `cloudflare-live` pins `75b3c460…`;
- direct review route unchanged: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-look/`;
- public retrieval unavailable from current chat tool, so no false `PUBLIC_VERIFIED` claim.

### NEXT GATE
Georg reviews tuned V2 and returns **ACCEPT / REJECT**. LC-01 waits for ACCEPT.

## 2026-09-24 · HÜRTH 01 R2

### HUMAN RESULT
- R1 wall attachment accepted;
- still open: roof overhang, curb/path wedge, shadow banding proof;
- new: organic windows/doors on all visible facades;
- new: reuse existing Racer Cologne harmonic palette logic exactly.

### DONOR REUSE
- exact Race commit: `cc80f4a1c6c509db9668df79fd53b13cee093a9d`;
- exact file: `KFB Cologne Race Option C-3/lab-v9/cologne-palette.v1.js`;
- exact source/target blob: `38246785ec2c9089737b2a195673a3ad4c07bdf8`;
- companion `option-c-style.v1.js` exact blob `c39c163019ab16c602b32c70202880680f9173c7`;
- no replacement color system created.

### IMPLEMENTED
- explicit eave ring outside final wall-top outline;
- multi-facade organic detail generation, still bound to final bowed-shell frames;
- Racer Cologne OKLCH harmonic `makePalette()` applied to wall / roof / door / window zones;
- 4096 fitted Elastic shadow map; roofs cast but do not receive self-shadow map;
- path endpoints extend below asphalt at real shared OSM nodes;
- road junction asphalt patch covers the curb half-width to remove the remaining pale wedge.

### TESTED
- runtime head: `4cc496e79af80c7f8419ffb14f7f5d8daeb0b679`;
- run `35947303053`: **38/38 PASS**;
- **3/3 WebGL2**;
- **0 page/console errors**;
- artifact `10787192998`;
- digest `sha256:aa193dff031169bcfef73c9eb381b6d80a3b5099243818994b999a755073e0a0`;
- 193 Elastic facade details, 23 asphalt node patches, 10 path→road connectors;
- CLEAN / CARTOON / GROTESQUE boot unchanged.

### PUBLICATION
- same wrapper route, base pin changed only;
- `cloudflare-live` pins `4cc496e7…`;
- Hub card routes to R2 review;
- no bundle/substitute renderer.

### NEXT GATE
Georg: **ACCEPT / REJECT R2**. LC-01 remains HOLD until ACCEPT.

## 2026-09-24 · HÜRTH 01 R2 · HUMAN FAIL / FREEZE

### HUMAN RESULT
- R2 rejected in real Chrome;
- persistent shadow/light boundaries;
- patched road/path/curb junction appearance with new artefacts;
- roof/body still reads as separate lid + block;
- facade colour/detail rhythm still reads as random rather than designed.

### IMPORTANT
R2 had **38/38 automated PASS, 3/3 WebGL2, 0 errors**.
This is retained as technical evidence, not visual acceptance.

### DECISION
- R1 + R2 = two failed repair passes on the same visual gate;
- stop implementation;
- freeze current candidate;
- create full failure recovery;
- no R3 patch pass on the same foundation.

### RECOVERY
`FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`

### NEXT GATE
Research known design grammar + isolated topology/object proofs before any new Hürth block implementation.
