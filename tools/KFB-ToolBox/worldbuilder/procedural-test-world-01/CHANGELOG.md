# CHANGELOG · Procedural Test World 01

## 2026-10-04 · WORLD-MULTI-ISLAND-CORRIDOR-01 PASS

- four world nodes browser-proven: Town / Dystopia / Utopia / Protopia;
- three inter-island `ROAD_BRIDGE` connections browser-proven through Track Core;
- Golden-Journey spatial anchors and canonical deck/Card seed routing validated;
- existing R2D body/presentation, P1/P2 nature and B1/facade owners retained;
- source **9/9 PASS** · run 37166355940 / job 111329943298;
- Chromium/WebGL **PASS** · run 37166356027 / job 111329943523;
- artifact 11289583486 · sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472;
- Resource Registry **PASS** · run 37166355944 / job 111329943425;
- no Player, Drive, Residents, Stage or Live;
- exactly one next gate: KAYKIT-NATIVE-BLENDER-BASELINE-01.

## 2026-10-04 · four-island corridor candidate

- added `WORLD_RECIPES.json`: Town / Dystopia / Utopia / Protopia as data-driven world recipes;
- added `r2d-archipelago.v1.js`: pure translation/composition layer over the proven R2D core;
- three inter-island routes are compiled by the existing Track Core `CONNECT` piece and labeled `ROAD_BRIDGE`;
- added Golden-Journey anchors without mounting Residents;
- added canonical Dystopia/Utopia/Protopia deck + Card seed refs;
- reused R2C biome palettes;
- compressed the old R2C directional layout to an MVP-scale fixture; final distance tuning waits for native Motion;
- updated exact browser/source proof to the four-island world;
- no Player, Drive, Residents, Combat, Stage or Live.

## 2026-10-04 · WORLD-CONVERGENCE-BASE-01 PASS

- current-main source gate: **9/9 PASS** · run 37165910051 / job 111328623269;
- Chromium/WebGL: **PASS** · run 37165909990 / job 111328623037;
- browser artifact 11289562726 · sha256:d80721a3ab9f1856c3bbe4d3c79257747eef69a057fd5b29b265720782e5777d;
- Resource Registry: **PASS** · run 37165909954 / job 111328623053;
- clean current-main convergence gate closed;
- next gate: WORLD-MULTI-ISLAND-CORRIDOR-01;
- Motion / Player / Drive / Residents remain detached.

## 2026-10-04 · convergence repair pass 1

- current-main R2D browser proof PASS at `74fae51ac6736f630f7f0e5ce0cc1f84540c66f8` (run 37165723175 / job 111328087611);
- Resource Registry PASS at run 37165723168;
- source syntax PASS but source suite FAIL at run 37165723177 / job 111328087463;
- committed source/profile inspection exposes a guaranteed stale Nature mount-status assertion mismatch;
- browser proof now justifies the browser-verified status on this current branch;
- Repair Pass 1 changes only status/evidence metadata; runtime/world source unchanged;
- re-run both source and browser gates before corridor work.

## 2026-10-04 · current-main convergence

- started fresh from current main `9a1f43b628126bb633ed95c99310288f0a5f1a7c`;
- source donor remains PR #332, not merge base;
- re-homed only the proven WB2/R2D owner modules, facade fixture and regression harness;
- excluded stale PR #332 Hub/router/Motion metadata;
- corrected future Motion dock to current PR #344 / PREPARED FOR BLENDER / NOT RUN;
- old `wi1-world.js` syntax dependency removed from the convergence workflow; current source check targets `r2d-world.js`;
- no Player, Drive, Residents, Stage or Live work;
- current-branch regression is the next gate.

## Source history retained

The 2026-10-03 PR #332 donor already proved the single-island body/water/nature/building composition in Chromium.
That evidence is donor evidence only until reproduced on this current-main branch.
