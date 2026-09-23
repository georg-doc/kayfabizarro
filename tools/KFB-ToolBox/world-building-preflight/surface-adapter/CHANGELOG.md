# WB1-P2 Surface Adapter · Additive Changelog

## 2026-09-23 · Initial implementation

- Created `kfb.surface-adapter/0.1-candidate` with FLAT / SPHERE / TORUS adapters.
- One immutable recipe: seven real KayKit Hex cells, one route, real `target.gltf`, accepted WB1-P1 Environment Profile reference, one radial Surface-FX event.
- Reused existing Hex `buildNetwork()` / `solveHexTile()`; no new solver.
- Added deterministic frame / round-trip / owner-boundary tests.
- Repository-native result: **8/8 PASS**, syntax **3/3 PASS**.
- Initial implementation checkpoint: `49cc790f60029066bdbcfa9ac8328aa9de7e26e1`.

## 2026-09-23 · Public-browser repair

- First public browser proof failed before source unlock with `TypeError: ch.cells is not iterable`.
- Diagnostic run `35814848578` proved Cloudflare transport, module loading and network were healthy; failure was the P2 harness call contract.
- Existing Hex owner expects chain objects `{ id, cells }`; P2 had passed a naked cells array.
- Repaired only the harness call to:
  `buildNetwork([{ id: 'wb1-p2-road', cells: chain }])`.
- Hex-owner source changed: **0 files**.
- Accepted repaired runtime: `0599cc04d2db72ed33c49fb98a30898290a00a68`.
- Repair static CI `35815116764`: **PASS**.

## 2026-09-23 · Exact Stage technical PASS

- Exact Stage:
  `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-building-preflight/`
- Public browser run `35815317560`: **PASS**.
- Real `target.gltf` rendered in isolation before surface controls unlocked.
- Same recipe fingerprint, cell identities, route, prop, Environment Profile reference and FX event verified on FLAT / SPHERE / TORUS.
- All center frames finite, normalized, orthogonal and right-handed.
- `consoleErrors=0`; page errors **0**; failed HTTP requests **0**.
- Screenshot artifact `10731296741`: 5 files.
- Georg human review: **PENDING**.
- WB1-P3 / Claude Design: **HOLD / not started**.

Exactly one next gate:

**Georg Human Review of WB1-P2 on the exact Stage.**
