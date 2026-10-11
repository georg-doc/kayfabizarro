# Independent intermediate drivability result

Verdict: PASS for isolated original-controller traversal and native road geometry. Final scene obstacle/socket audit pending.

Candidate stream SHA256: `11a1096b2828f53a8f335ef4006d5da16a6de0a1da89f8d53b38bddebc47458f`. Track mesh SHA256: `8f1a826cc3ea6b9c47f637af691794968db4c95b817ffb517defe34a07954907`.

- Original Track Core: 11/11 checks pass, no failures; 741 samples, 369.813 m length, 14.4 m road width, zero grade.
- Byte-identical original inherited J17 K2B driver: 12/12 traversals complete at 30/60/120 Hz, forward/reverse, proxy width 2.16 m and all-vehicle width 4.1 m, default assist 0.8. No hits, rescue or takeoff events; no nonfinite states. Forward 9.933 s, reverse 40.633 s. Minimum conservative all-vehicle edge reserve 3.68343 m.
- Native actual road/body mesh: 7,410 rays, road lateral samples -5/-3/-2.05/0/2.05/3/5 m; no interior road misses, no 7 m overhead track-body obstructions. Maximum road/stream surface error 2.98e-8 m. Seven exact first-boundary misses resolved by explicit 1 mm inward retry and remain recorded.
- Original frame interpolator assumes uniform s/ds; observed maximum local deviation 0.0008813 m. No repair or rewritten controller introduced.

Limits: controller test drives prescribed route coordinates and does not exercise browser input, camera, terrain/props colliders or wheel contact. Native road/body mesh is independently checked, but complete island sockets and integrated scenery remain pending. The concept image cannot prove drivable geometry. No Golden or Merge authority is implied.
