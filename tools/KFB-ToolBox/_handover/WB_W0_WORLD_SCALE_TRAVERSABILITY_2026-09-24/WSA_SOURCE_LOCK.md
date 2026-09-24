# WSA source lock · WB-W0 · 2026-09-24

Status: **SOURCE LOCKED · HUMAN REVIEW OPEN**

GitHub: `georg-doc/kayfabizarro` · PR #203 · branch `work/worldbuilder-w0-source-lock-2026-09-24` · source-lock head `148f22e776a0bd26c74123652471249f39dd47aa`  
Public review: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/worldbuilder-w0/` · `cloudflare-live@c2c3c2a679cbc5f28b5a0bbe93878180ca52df51` · PUBLIC_VERIFIED

The complete Claude Design session export is preserved in this folder. The active candidate is `WB-W0_2026-09-24`; `WORLDBUILDER_V1_2026-09-24_FROZEN` is rejected evidence and must not be patched or promoted.

## WSA review

WB-W0 corrects the failed foundation in the right order:

1. real source measurements;
2. semantic Racer route;
3. walkable corridor and pads;
4. terrain shaped around movement;
5. only then props, lighting, ink and globe presentation.

The local HTTP browser run completed all ten built-in gates. This is a valid foundation candidate, not yet a production WorldBuilder.

## Locked facts

- 1 world unit = 1 metre in the local ENU region.
- Globe is an overview scale; approach hands off to a local region rather than pretending a tiny planet is Earth scale.
- GothGirl measures 2.211 m in the source rig.
- KayKit door measures 2.80 m.
- The preserved route is 18.0 m wide. Current KFB vocabulary calls this `WIDE`; the source log's `STANDARD` label is a documented donor mismatch.
- Traversability limit is 25° because the unchanged controller begins auto-hopping at 30°.
- Props remain outside the protected route/spawn/door areas.

## Do not fold into this lock

- no tree-material repair;
- no animation blending;
- no new ink implementation;
- no OSM expansion;
- no vehicles, weather, editor or building grammar;
- no further patching of the frozen v1 foundation.

## One next gate

Georg reviews the stable public WB-W0 route and returns `PASS`, `TUNE`, or `REJECT` for the measured world foundation. Only after that may a bounded WB-W0-R1 address accepted visual HOLDs.
