# KFB Render R0 · Shared diagnostic + preset adapter

Status: `LOCAL PASS · HUMAN VISUAL REVIEW PENDING`  
Owner: shared Render Preset; first consumer World M2A  
Draft PR: <https://github.com/georg-doc/kayfabizarro/pull/273>

## Purpose

One binding render policy for KFB runtimes, starting with the real World M2A scene:

- contact shadows remain attached instead of producing bright/dark rims;
- fine clay relief does not crawl or form moiré during movement;
- Hero, World and Far surfaces receive proportional detail;
- existing World, movement, physics and asset owners remain unchanged.

## Exact implementation

- shared policy: `kfb-hub/shared/render/kfb-render-preset.v1.mjs`
- World consumer: `kfb-hub/stage/world/world-drive-interact-m2a/runtime/worldbuilder/world-integration-01/wi1-world.js`
- Clay consumer: `kfb-hub/stage/world/world-drive-interact-m2a/clay-world-m1.mjs`
- stage adapter/report: `kfb-hub/stage/world/world-drive-interact-m2a/render-preset-r0.mjs`
- browser proof: `kfb-hub/stage/world/world-drive-interact-m2a/render-proof-r0.mjs`

Implementation head: `eb15def4a6d1bab33685d4116896a5cad9947c2c`.

## Evidence

- 32/32 package PASS
- 48/48 browser PASS desktop + narrow
- 9/9 focused render PASS
- playability PASS
- p95 Idle/Walk/Drive 16.7/16.7/16.8 ms

## Gate

Do not publish or merge yet. Georg compares contact edges and clay crawling. If PASS, publish the exact candidate to the fixed Stage and repeat the public browser/render proof. If TUNE, change only the named shadow/detail value; do not reopen World or gameplay architecture.
