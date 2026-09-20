# KFB Cologne Race · Option C · Stage onboarding

## Start

- Play: `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`
- Owner: `georg-doc/KFB-Stunt-Car-Race`
- Public mirror and briefing: `georg-doc/kayfabizarro`
- Source baseline: private Race `main@31d834218f0a79f193a44b054e57454d29c305c2`
- Public Stage branch: `wsa/cologne-option-c-stage-2026-09-20`

Read `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`, this file and `_handover/RETURN.md` before editing. GitHub wins over chat memory.

## What is already owned

- Route, movement, vehicle state, race loop: existing Option C / Race runtime.
- OSM buildings and Cologne anchors: current Cologne world module.
- Sky/light/water grammar: existing TinySkies/Travel donors already named in source.
- HUD, audio and input: the current Option C owners. Do not add a second `AudioContext`, keyboard controller or visible HUD shell.
- Palette: `lab-v9/option-c-style.v1.js`; editor contract: `lab-v9/color-map.v1.json`.

## One chat = one mini-sprint

1. `C-CAM` Camera/tunnel: drive CHASE through the tunnel and tight OSM passages. Compare route-corridor clamps and facade pulls; do not replace the camera owner.
2. `C-SUP` Structure supports: inspect only `structure-support` objects. Prove no support intersects the drive band; do not delete landmark, gate or tunnel cylinders by shape alone.
3. `C-COLOR` Color map: edit one existing role family, export JSON, reload/import and prove the same seed reproduces the same palette. No one-off material recolors.
4. `C-VEH` Vehicle/deformer: connect one verified Vehicle Lab animation to one existing vehicle. Driving physics remain Race-owned.
5. `C-WEATHER` Time/weather/audio: reuse one existing TinySkies/Travel state and the existing audio mixer. No second sky, light clock or audio runtime.
6. `C-TRAFFIC` Non-player traffic: one visual Donut-Drive vehicle follows the route without race ranking, collisions or new controls. Player loop stays unchanged.

For each slice use a new branch, touch only its named modules, publish to the same fixed Stage route, update additive changelog/Return, and stop at one human test question. A GitHub timeout is UNKNOWN: inspect the branch head before retrying.

## SP13KTRA benchmark boundary

`KilledByAPixel/SP13KTRA@166ad838` is All Rights Reserved. It may be inspected only as a behavioral benchmark. Its camera keeps the boom near the local route surface rather than colliding with the whole city. Option C implements that principle independently using its own route data; no source code, coordinates, geometry or palette are copied.

## Definition of done

- direct Cloudflare Stage URL opens and shows the intended revision;
- desktop and mobile boot without module/resource errors;
- one full tunnel pass in CHASE without camera leaving the corridor;
- road center is yellow and outer lines are orange-yellow;
- current color map can be exported and re-imported;
- exact branch, head, tests and remaining human gate are written to Return.
