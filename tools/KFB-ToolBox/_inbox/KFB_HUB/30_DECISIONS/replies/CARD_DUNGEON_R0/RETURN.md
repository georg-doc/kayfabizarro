# R28 · Website docking delivery

R28 source delivery complete. Portable dependency repair and opt-in R28b source delivered; R28b visual/performance acceptance remains open.

Private game-repo branch: `wsa/infiniterooms-r28-website-20261115`
Initial delivery SHA: `7ebd6d27c6e716920b6ded8904693711028cdc24`
Portable R27 baseline SHA: `defb92484b2580e9aa7e5c9cd0260f294572da81` (independent install, 154 tests and production build passed).
Current branch SHA with opt-in R28b: `fc1b9ad951e199fcd6fdcf564505ac26a3111ca4` (159 tests and production build passed).
Source: permitted R27 `c106d7cd74f1609426586439055c8f8b5a6e3b61` (contains R25 Escher circuit), copied as an isolated source project under `infiniterooms/`, with all 1226 required source/asset files. Main game paths unchanged; no merge. Generated dist, old evidence screenshots and Site hosting binding intentionally omitted. `npm ci && npm test && npm run build` inside `infiniterooms/`.

- [Source](https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms)
- [Source inventory](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/SOURCE.json)
- [Map JSON](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/site-map.json)
- [Map JPG, 76 KB](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/site-map.jpg)
- [Existing/missing interfaces](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/7ebd6d27c6e716920b6ded8904693711028cdc24/infiniterooms/handoff/r28/INTERFACES.md)

`setTime`, external `setCamera`, foreign-wall replacement, and Website hit subscriptions for both destruction hosts are missing. Exact current owners/internal functions and smallest proposed seams are described; none newly implemented. Patch/WebGPU and tunnel/Rapier remain distinct. Full source inventory was read back at the delivery SHA. The old R25/R27 commit identifiers were Site-local and not found in the game repo; this delivery gives them an actual game-repo branch/checkpoint.

Private Site remains on its newer source; R27 delivery does not downgrade it. Current Dungeon startframe investigation (R39) is separate. No new performance, R28b view quality or Remotion capture acceptance is claimed here.

## 2026-11-15 continuation: R28b and R39

- [R28b opt-in source and status](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/fc1b9ad951e199fcd6fdcf564505ac26a3111ca4/infiniterooms/handoff/r28b/STATUS.md)
- Same existing foyer cover wall and portal; Original / synthetic luminance Relief / Spark Gaussian view. Spark pinned to 2.4.0, MIT receipt included. This is synthetic depth, not reconstructed unseen 3D.
- Four angle controls, walking mode, camera-only recording and paired benchmark implemented. Benchmark uses a 1×1 RGBA readback completion gate, not rAF timing. No completed final A/B results claimed.
- Pending acceptance: 0/30/60/90-degree paired captures (at most two versions per image), three motion clips, final A/B measurements, portal walking and final live visual QA. Browser automation is unavailable in this session after restart; these checks were not replaced by source tests.
- [Private live study](https://kfb-infiniterooms.frizzlebob.chatgpt.site/?wallstudy=r28b&wallmode=original&perspective=off&look=cards&quality=standard)
- Exact Site source: `775b3ab8937e8aafb504836c94998261a2015e21`; private publication succeeded, deployment `appgdep_6af9bce20f708191802953cf94302267`. Site tests 188/188 and production build passed. No merge or audience change.
- R39 uses the native existing eye-visibility gate and one completed preparation frame behind loading. Latest earlier normal gentle sample: preparation 1075 ms; playable first 120 frames p95 21.8 / max 39.7 ms; no GL error. Heavy work is moved into loading; total ready-time or universal steady-state speedup is not established. Extended qa=1 GL-error samples remain invalid and tracked separately.

Private art/captures must remain in the private game repository; this public Hub return contains links and status only.
