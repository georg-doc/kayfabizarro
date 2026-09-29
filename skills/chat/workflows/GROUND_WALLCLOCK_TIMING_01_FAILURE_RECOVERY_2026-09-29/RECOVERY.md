# RECOVERY

Do not resume `9431a89c8b28c21579f61ae8cdb5e3be197706d5`.

Current human-facing route:
https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel

That route still serves the last public-verified Two-Gear runtime `4475271b...`, which Georg marked **TUNE** because traversal feels slow/ruckly.

Resume only through **GROUND-TRAVEL-PACE-TIMING-01**:
1. fresh branch from `542eedb91f96b6f718df9e619fb3d3f746b79854`;
2. scope wall-clock catch-up to `walkPace=travel` only;
3. keep W=Running_A / Shift=Running_B;
4. apply a **Travel-only 1.8× gameplay cadence multiplier to both world target speed and locomotion clip playback**, preserving foot/world synchronization;
5. expected forward targets: Running_A ≈ **4.46 u/s**, Running_B ≈ **5.45 u/s**;
6. keep Race, Explore and measured/no-query Ground timing/speeds untouched;
7. prove 15-FPS wall-clock parity, 1.8× cadence/world coupling and unchanged baseline regressions;
8. publish the same Pace-Tune Stage only after PASS.

No ZIP is attached: complete editable source is already Git-versioned at the frozen commit, and the connector exposes no archive-packaging action. `EXPORT_MANIFEST.json` indexes the exact source and evidence.
