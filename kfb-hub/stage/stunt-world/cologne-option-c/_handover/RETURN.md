# RETURN · KFB Cologne Race · Option C · public Stage candidate

Status: **SOURCE + LOCAL BROWSER PASS · PUBLIC CLOUDFLARE PROOF PENDING**  
Date: 2026-09-20  
Human gate: Georg camera/tunnel + road-marking + overall-feel review

## Exact state

- Source owner: private `georg-doc/KFB-Stunt-Car-Race`
- Source baseline: `main@31d834218f0a79f193a44b054e57454d29c305c2`
- Imported WIP commit in Race history: `88fd96efe9eecdfa720d10f5be581436cd5ababb`
- Public repo: `georg-doc/kayfabizarro`
- Branch: `wsa/cologne-option-c-stage-2026-09-20`
- First implementation checkpoint: `4bc52ef99d90cd9db216c9c1ff3071f4d5f03b86`
- Intended Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`
- Reproducible tunnel gate: `?start=tunnel&seed=camera-gate`

## What changed after the Claude Design WIP

- Extracted a thin public runtime instead of publishing the 145 MB inbox/archive.
- Added route-bound CHASE camera safety. The desired boom is clamped to the current route corridor and, inside a tunnel, below a local ceiling. Existing OSM occlusion pull remains the second guard.
- Restricted supports to explicit `STRUCTURE` segments, moved them outside the drive band and tagged them as `structure-support` for inspection.
- Center dashes are yellow; outer lines are orange-yellow; ambiguous inner lane bands are removed.
- Added three measured Option-C palette families. Start selection is seeded; `?seed=` and `?palette=` reproduce it. The current map can be exported/imported as `kfb.track-zone-color-map.v1`.
- Added one compact book icon. Inline docs are closed by default and route Claude Design or fresh chats to isolated mini-sprints.
- Added direct tunnel review start without creating gameplay teleport logic.

## Verified

- 18/18 repository checks PASS.
- All Stage JavaScript modules parse.
- Desktop browser boot PASS; Doku icon/panel PASS.
- Mobile 390×844 boot PASS; HUD remains visible; Doku panel fits without taking permanent FOV.
- Reproducible tunnel-start screenshot shows the camera inside the arch corridor.
- Browser console: 0 errors, 0 warnings in desktop/tunnel/mobile checks.

## Not claimed

- No full driven lap was completed in this handoff.
- Tunnel camera is locally and visually proven at the reproducible start, not yet Georg-accepted over a complete moving pass.
- Vehicle deformer, weather/time integration and non-player traffic are not implemented here; they are separate mini-sprints.
- This Stage is not Live and must not replace the current accepted Race state.

## One next gate

Drive the Stage once normally and once with `?start=tunnel&seed=camera-gate`. Check only:

1. Does CHASE stay legible through the tunnel and tight OSM passages?
2. Do yellow center and orange-yellow outer lines read immediately?
3. Are any round supports still visibly inside the drivable band?

If accepted, the next integration slice is one verified Vehicle Lab animation on one existing vehicle.
