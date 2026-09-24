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


---

## KLR-SYNC-01 · recovery proof

Source head:
`5b2fa78220ec4127c1b761c4d7f7a8304dfb11e9`

### Dedicated deterministic actor switching

- workflow `35550320886`
- job `106183720310`
- **41/41 PASS**
- sequence: Barbarian → Knight → Mage → Rogue
- 0 failed HTTP/resources
- 0 page/console errors
- artifact `10618176287`
- digest `sha256:d35fad324879c8e6c373a6ae8cda1ac9a447607523a0133403cb8c27783051d0`

### Full candidate browser/WebGL

- workflow `35550320883`
- job `106183719887`
- **44/44 PASS**
- 4/4 body assembly
- native Legacy attack audition
- held weapon selection
- LegacyFaceHost measured
- EyeRig v6 mounted
- expression/blink controls
- 0 failed HTTP/resources
- 0 page/console errors
- artifact `10617178796`
- digest `sha256:e7b1d7076f0665e50db6c03902fc2e439494e08e0a54275ec1c76e439c180f9e`

The prior two failed runs remain useful regression history, not current gate status.

Public Cloudflare proof:
**NOT RUN / NOT PUBLIC_VERIFIED**.


---

## KLR-KIT-01 · frozen browser integration

Frozen head:
`e3a06e3451637a8b447192113cab43f3ece84cd8`

### Pure/static

Run `35551084074` contract phase:

- **33/33 PASS** static/source;
- **16/16 PASS** ActorRecipe deterministic contract;
- syntax PASS.

### Browser attempt 1

Run `35550795805`:
- HTTP PASS;
- READY PASS;
- randomizer UI PASS;
- WebGL PASS;
- first recipe did not reach Ready.

### Browser attempt 2

Run `35551084074`:
- HTTP PASS;
- READY PASS;
- randomizer UI PASS;
- WebGL PASS;
- initial source isolate settled PASS;
- first isolated alternate-head/no-weapon recipe failed with:
  `$(...).forEach is not a function`.

Root cause is the accidentally collapsed `$$` collection selector in `syncModeButtons()`.

No third repair pass is run in this slice.
