# ATTEMPT LOG · Hybrid Surface v2

No post-hoc success rewrite. All browser-proof attempts remain visible.

| Run | Head / change | Expected | Actual | Decision |
|---|---|---|---|---|
| 1 · `35671624437` / job `106569164335` | Initial v2 candidate | Exact actor head proxies + v2 proof | FAIL: Legacy named head is an Object3D/group around multi-primitive geometry, not a Mesh node in the loader tree | Repair once: allow named Object3D head proxy |
| 2 · `35671823766` / job `106569756919` | head-proxy traversal fixed at `69dc5b21…` | Continue proof | Runtime/head measurements passed; proof then FAIL because `sourcePins` was not exposed in snapshot | Repair proof observability: expose pins |
| 3 · `35672017517` / job `106570357717` | snapshot pins added at `dcd51d13…` | Full proof | Reached material checks; FAIL at `visible actor shaders compiled`: 58 compiled vs 63 counted visible | Repair pass 1 on this gate: visibility census follows parent visibility |
| 4 · `35672227722` / job `106571025025` | ancestor visibility census at `7cbad52b…` | Resolve compile census | Same gate still FAIL: 58 compiled vs 63 effectively visible | **STOP / FREEZE** per two-pass rule |

## Important distinction

Runs 1 and 2 were different observability/source-measurement gates.

Runs 3 and 4 are the two failed repair passes on the **same** shader compile census gate. No third repair is permitted in this slice.
