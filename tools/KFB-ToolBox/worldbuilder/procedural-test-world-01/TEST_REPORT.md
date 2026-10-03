# TEST REPORT · Procedural Test World 01

Date: 2026-10-03
Repo: georg-doc/kayfabizarro
Draft PR: #332

## Current tested implementation

Head:
`0335ade26741cf1df4920a723045c25de4fa2a82`

### Source suite
Workflow: Procedural Test World 01
Run/job: `37087496100 / 111100703113`
Result: **7/7 PASS · 0 FAIL**

### Resource Registry
Run/job: `37087496086 / 111100703115`
Result: **PASS**

### Real browser
Workflow: Procedural Test World R2D Browser
Run/job: `37087496103 / 111100703199`
Result: **SUCCESS**

Artifact:
- id `11261420332`
- size 118,363 bytes
- digest `sha256:9cef3575443ff99ca7b1144f9cc59e2c3af8ad5db238b81f93749b7ff9a8d9e0`

Browser state:
- provider `kfb.r2d-worldbuilder-adapter/1`;
- world `r2d3`;
- zone `r2d-island-3`;
- support terrain 66,049 vertices;
- visible R2D body 14,400 vertices;
- body depth 25.4;
- Track Core road present;
- continuous island top present;
- floating underside present;
- pond present;
- creek present;
- waterfall present;
- P1/P2 nature group present;
- 3 cluster centres;
- 6 trees;
- 6 bushes;
- 3 boulders;
- 5 edge rocks;
- 4 P2 detail groups;
- one WB2 renderer/canvas;
- legacy play = null;
- `wi1-play.js` absent;
- Travel Globe absent;
- card-start absent;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

## Repair history for this gate

Implementation head `03c30c2e...` already passed the real browser proof.
The separate source test had a test-only `ReferenceError: adapter is not defined`.

Repair 1 did not change runtime and failed to repair the test because a local variable with the same name fooled the guard.
Repair 2 introduced a unique top-level `adapterSource` in the test only.

No runtime/world code changed after the first browser-PASS implementation.
Final source + browser proof is green on `0335ade2...`.

## Not claimed

- no public Stage;
- no Georg visual acceptance;
- no Player locomotion;
- no Drive;
- no Combat;
- final building/facade presentation remains open;
- final Clay/material adoption remains open;
- waterfall particle/droplet polish is deferred.

## Next

Current building/facade presentation on R2D pads, same WB2 owner.
