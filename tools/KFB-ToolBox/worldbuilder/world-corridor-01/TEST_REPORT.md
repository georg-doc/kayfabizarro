# World Corridor 01 · Intake Test Report

Status: **SOURCE INTAKE PASS · RUNTIME NOT STARTED**
Date: 2026-10-01

This report verifies source identity and owner routing only. It is not a browser/GPU integration PASS.

## Static/source checks

**13/13 PASS**

1. current intake commit contains both named Claude cuts;
2. R2C `START_HERE.md` exists and names R2C as current source object;
3. R2C active HTML exists;
4. `hex-archipel.r2c.js` is real source code (~84 kB), not an empty placeholder;
5. R2C Return is present and explicitly marks GPU performance unproven;
6. SKY3 `START_HERE.md` exists;
7. SKY3 manifest exists with source blob inventory;
8. `env-host.v3.js` exists at the manifest blob;
9. `cloud-family.v3.js` exists and remains TUNE;
10. `spindle-sky.v5.js` exists as the 0.3-candidate source;
11. accepted WB2 source object resolves at exact pin `8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e`;
12. current Track Core owner review resolves at head `3232a1070686896833d6b7942fcd631b9fa8cda6`, with a verified main-side `kfb.track-core/0.12` snapshot;
13. current Billboard cut exposes `BillboardScheduler` from the existing frame owner and the baked/static-provider boundary.

## Decisions proven by source

- WorldBuilder remains receiving host.
- R2C is island/layout intake, not a replacement WorldBuilder.
- Track Core remains frame/slot/check owner; R2C does not become a second track core.
- EnvironmentHost v3 must be ticked from the receiving host loop; no second renderer/timer/fog owner.
- Billboard updates are scheduler-owned and corridor content begins with baked/static images; no runtime PDF rendering.
- SKY3 cloud cost must be measured again inside the full corridor; isolated preview numbers are not accepted as product performance.

## Not run / not claimed

- no R2C GPU benchmark on Georg's machine;
- no R2C → Track Core adapter;
- no vehicle;
- no billboard integration;
- no SKY3 integration;
- no WorldBuilder rehome/parity run;
- no streaming test;
- no Stage/public browser test.

## Next gate

**WC1-BASELINE:** exact R2C source rehome under the WorldBuilder owner + tiny performance probe + parity/baseline proof only.
