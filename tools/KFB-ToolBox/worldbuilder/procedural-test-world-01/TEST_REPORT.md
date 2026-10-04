# TEST REPORT · WORLD-MULTI-ISLAND-CORRIDOR-01

Status: **PASS**

Tested implementation head:
`0841b89ae8274118687e946318458201b402c5b5`

| Gate | Evidence | Result |
|---|---|---|
| source/syntax | run 37166355940 · job 111329943298 | **9/9 PASS** |
| Chromium/WebGL | run 37166356027 · job 111329943523 | **PASS** |
| browser evidence | artifact 11289583486 · sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472 | **PRESENT** |
| Resource Registry | run 37166355944 · job 111329943425 | **PASS** |

The browser gate explicitly rejects the candidate unless it has:
- 4 stable world nodes;
- 3 `ROAD_BRIDGE` connections owned by Track Core;
- Dystopia/Utopia/Protopia deck routing;
- Golden-Journey anchor IDs;
- four visible island groups;
- four reused building-owner reports with `kfb-facade-rule-v1`;
- one WB2 canvas;
- no legacy `wi1-play`, Travel Globe or card-start resource;
- no page/console error gate.

No Player/Drive/Resident behavior is claimed by this test.
