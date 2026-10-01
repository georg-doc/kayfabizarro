# WC1 Procedural Props P0B · Repair Pass 1

Status: **PROVEN IMPORT DEFECT REPAIRED · RETEST REQUIRED**
Date: 2026-10-01
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-props-p0-2026-10-01`
Draft PR: #311

## Failed integration run

- tested head: `eaf1fdce77d0119efb7ea9c614452d228f2882a0`
- diagnostic harness head: `5b1af3456977164cc73099710a0963123f05c51a`
- run: `36909483362`
- job: `110528274255`
- P0 isolation: PASS
- P0B soft-form isolation: PASS
- WC1 integration: FAIL before boot completion

## Proven cause

The integration page loaded its own source and Three.js modules successfully, then failed on:

`tools/KFB-ToolBox/worldbuilder/world-corridor-01/clay-perf/clay-profiles.v2.js` → HTTP 404.

The diagnostic Clay derivative had retained the original sibling import:

`./clay-profiles.v2.js`

but in the WC1 rehome the source profile remains at:

`../baseline-source/lab-clay/clay-profiles.v2.js`

No procedural prop geometry or material compile error was observed because module resolution stopped first.

## Repair

Commit `5722f502b8ac3ffbda516accac16bcee6d5ed57e` changes only that import path in the diagnostic Clay derivative.

No geometry retune.
No material parameter retune.
No new runtime/renderer.
No owner change.

## Gate

Repeat the exact P0 / P0B / WC1+Clay002 browser workflow on the repaired head.
