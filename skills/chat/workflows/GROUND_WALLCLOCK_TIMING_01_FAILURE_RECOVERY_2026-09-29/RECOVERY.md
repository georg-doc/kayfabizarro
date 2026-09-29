# RECOVERY

Do not resume `9431a89c8b28c21579f61ae8cdb5e3be197706d5`.

Current human-facing route:
https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel

That route still serves the last public-verified Two-Gear runtime `4475271b...`, which Georg marked **TUNE** because traversal feels slow/ruckly.

Resume only through **GROUND-WALLCLOCK-TRAVEL-ONLY-01**:
1. fresh branch from `542eedb91f96b6f718df9e619fb3d3f746b79854`;
2. scope catch-up to `walkPace=travel` only;
3. do not change W=Running_A / Shift=Running_B or speed constants;
4. keep old baseline timing untouched;
5. prove 15-FPS wall-clock parity and baseline regressions;
6. publish only after PASS.

No ZIP is attached: complete editable source is already Git-versioned at the frozen commit, and the connector exposes no archive-packaging action. `EXPORT_MANIFEST.json` indexes the exact source and evidence.
