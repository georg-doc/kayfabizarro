# RETURN · KFB WorldBuilder v1 · WB1-P2 Surface Adapter · 2026-09-23

Status: **TECHNICAL PASS · PUBLIC BROWSER PASS · HUMAN REVIEW PENDING · P3 HOLD**

## Repository / branch / PR

- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/world-builder-p2-surface-adapter-2026-09-23`
- Draft PR: **#180 · WorldBuilder v1 · WB1-P2 Surface Adapter candidate**
- Current reconciled main for the repair gate: `852f9d2cd1be228898316b205063855c95308c9a`
- Initial P2 implementation checkpoint: `49cc790f60029066bdbcfa9ac8328aa9de7e26e1`
- Accepted repaired review runtime: `0599cc04d2db72ed33c49fb98a30898290a00a68`
- Static repair CI: `35815116764` → PASS
- Public browser proof: `35815317560` → PASS

## Outcome

WB1-P2 proves one immutable logical recipe on exactly three orientable surfaces:

- FLAT
- SPHERE
- TORUS

The same recipe contains:
- seven real KayKit Hex cells;
- one route data set;
- real KayKit `target.gltf`;
- the accepted WB1-P1 Environment Profile reference;
- one StoryMap/Travel-derived radial Surface-FX event.

The browser proof verifies the same recipe fingerprint, cell identities, route, prop, Environment reference and FX event across all three surfaces.

## Existing owners preserved

P2 did not create or replace:
- Travel/TinySkies terrain/world ownership;
- Race movement/contact/route/camera ownership;
- Hex grid/edge/rotation/solver truth;
- OSM semantic/geographic truth;
- P1 Environment Profile ownership.

The seven-cell road uses the existing Hex owner:
`buildNetwork()` + `solveHexTile()`.

Resolved road:
- west: `hex_road_M @ 180°`
- center: `hex_road_A @ 0°`
- east: `hex_road_M @ 0°`

## One bounded repair

Initial public browser boot exposed a harness-only owner-contract error:

`TypeError: ch.cells is not iterable`

Cause:
P2 called existing `buildNetwork()` with a naked cells array. The owner requires a chain object.

Repair:
`buildNetwork([{ id: 'wb1-p2-road', cells: chain }])`

No Hex-owner code changed.

## Tests actually run

Repository-native:
- deterministic tests: **8/8 PASS**
- module syntax: **3/3 PASS**

Public Cloudflare browser:
- source object first: PASS
- FLAT: PASS
- SPHERE: PASS
- TORUS: PASS
- same recipe fingerprint: PASS
- 7 cell identities unchanged: PASS
- route unchanged: PASS
- prop unchanged: PASS
- Environment Profile reference unchanged: PASS
- Surface FX unchanged: PASS
- finite / normalized / orthogonal / right-handed center frame on each surface: PASS
- application `consoleErrors=0`
- page errors: **0**
- failed HTTP requests: **0**

Evidence artifact:
- `wb1-p2-stage-evidence`
- artifact ID `10731296741`
- 5 screenshots
- digest `sha256:93f1325571fe7896945116422ce50a8b161ae3695034e6a30500940a9cd8633e`

## Human review

Direct Stage:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/world-building-preflight/`

Review order:
1. real `target.gltf` alone first;
2. marker `SOURCE OBJECT RENDERED · SURFACE PROOF UNLOCKED`;
3. FLAT;
4. SPHERE;
5. TORUS;
6. FX ripple on each;
7. inspect for floating cells/prop, flipped orientation or global-Y leakage.

This is not a visual-style or final-world-lighting gate. It proves the Surface Adapter seam only.

## Publication boundary

- exact Cloudflare Stage: technically verified
- Georg visual acceptance: **PENDING**
- PR merge: **not performed**
- Live product promotion: **not performed**
- WB1-P3 / Claude Design: **not started**

## Exactly one next gate

**Georg Human Review of WB1-P2 on the exact Stage URL.**

After PASS: update evidence/Return only, then STOP. Do not start WB1-P3 in the same gate.
