# SALVAGE MAP · WORLD-INTEGRATION-r2

| Part | Status | Why | Next owner |
|---|---|---|---|
| accepted WB2 terrain sculpt | REUSE_CANDIDATE | pre-existing human-pass owner, byte-identical | WorldBuilder PR #190 |
| shared edit-layer | REUSE_CANDIDATE | pre-existing shared owner, byte-identical | ToolBox shared editor |
| ToolBox locomotion profile seam | REUSE_CANDIDATE | immutable tested ToolBox pin resolves and binds | ToolBox Motion → World consumer |
| source-backed Running_B sprint | REUSE_CANDIDATE | comes from ToolBox profile, not local fake tier | ToolBox Motion |
| Hürth fixture/presenter | REUSE_CANDIDATE | boots; early world assertions pass | World/OSM presenter |
| Cologne fixture + Dom/Hbf integration | NEEDS_ISOLATED_TEST | not reached in final browser run because Hürth selftest aborts | World/OSM presenter |
| FACADE_RULE / FACE_NORMALS / support | NEEDS_ISOLATED_TEST | static/source present; later browser assertions blocked | World/OSM presenter |
| World controller/hysteresis | REUSE_CANDIDATE | movement owner remains World; no second controller in actor/profile | World/Travel |
| current selftest variant-label assertion | REJECTED_FOUNDATION | encodes stale local prose/variant contract | next test-only gate |
| current browser gate result | ARCHIVED_FAILED | repair budget exhausted | recovery only |
