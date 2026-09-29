# PlayCanvas Vehicle Physics Donor-01 · CHANGELOG

## 2026-09-29 · r0 · source selection
- Georg requested the actual fork/demo be put on board 1:1 before further KFB work.
- Rejected primitive/cube-first world building as product direction.
- Pinned user fork `KFB Joyride 01` project 1609943 / scene 2608057 / fork-from 643289.
- Located the actual public Vehicle Physics runtime at `playcanv.as/apps/BfRjx709/index.html`.

## 2026-09-29 · r1 · source probe
- Source public runtime boots with Car Physics and Follow Camera.
- W drive and R reset verified.
- Source probe run `36603881007` SUCCESS.
- No page or console errors.

## 2026-09-29 · r2 · exact runtime mirror
- Captured all 42 same-origin runtime files loaded by the actual donor.
- Total captured bytes: 22,054,130.
- Capture errors: 0.
- Added per-file source URL / bytes / SHA-256 manifest.
- Immutable mirrored-runtime commit: `8bcbaf1cf60696e12c32d75a12b4fed0a37dfebc`.
- Mirror workflow run `36603978546` SUCCESS.

## 2026-09-29 · r3 · self-host parity
- Added repository-native self-host proof.
- Run `36604195908` / job `109528909467`: **11/11 PASS**.
- Car Physics, Car Graphics, Follow Camera, Light, W drive and R reset work from the mirrored files.
- 0 page / console / request errors.

## 2026-09-29 · r4 · public KFB Stage
- Mirrored the exact donor blobs to `kfb-hub/stage/playcanvas-donor-01/`.
- Published with `cloudflare-live@db0fabff71b9bb8943184628b7c7d697ba48cd3b`.
- Repaired the malformed earlier primitive-bench Hub insertion and replaced its current Hub card with Donor-01.
- Public run `36604921730` / job `109531386518`: **11/11 PASS**.
- Public artifact `11051400015` · `sha256:7996aa46bcdadbd359667254a52df09b2d2277d64035393233f5b92bfe4d7f37`.
- Direct route PUBLIC_VERIFIED:
  `https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-donor-01/`

## Exactly one next gate
**PC-LOOK-01 · TEXTURE / MATERIAL ONLY**

Do not retune physics/camera/control/collision/geometry yet.
