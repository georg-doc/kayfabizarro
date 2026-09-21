# Legacy RPG Rigging Lab · TEST REPORT

Date: 2026-09-21

## Source/static suite

Latest run before freeze: `35548588227`.

**26/26 PASS**

Validated:
- four body sources;
- 17 head choices;
- 24 weapons;
- 10 gear/props;
- 30 motion names;
- exact source-family counts;
- semantic combat mappings;
- isolated localStorage;
- existing EyeRig-v6 import;
- Legacy core-bone contract;
- inverse-bind placement;
- rigid-arm paw anchor;
- LegacyFaceHost `body` contract;
- source-isolation/no-placeholder UI;
- module syntax.

## Browser run 35543850991

Initial HTTP/WebGL/catalog checks passed.

Failure: stale expectation for transient `30 native legacy clips` UI text.

Classification: test synchronization.

## Browser run 35548588227

Passed before failure:
- HTTP;
- boot READY;
- source mode;
- Barbarian source isolate;
- WebGL;
- all source catalog counts;
- semantic attack/bow;
- Barbarian RIG_LEGACY;
- Barbarian ASSEMBLED;
- Barbarian source identity;
- Barbarian native motion;
- Barbarian 30-clip report;
- Barbarian core-part placement;
- Knight RIG_LEGACY;
- Knight ASSEMBLED.

Failure:
Knight identity assertion observed the previous Barbarian identity because readiness checks remained true during async actor replacement.

No public browser test was run.

## Environment

`GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`

## Gate

No additional repair pass in this slice. Resume only with KLR-SYNC-01.
