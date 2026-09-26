# TEST REPORT · Billboard B2b-P1 · 2026-09-26

Status: **STATIC PASS · BROWSER 39/40 · FROZEN**

## Static
Final static runs on frozen candidate lineage:
- push static run 36205100402: SUCCESS;
- PR static run 36205125948: SUCCESS;
- protected B2a byte comparisons: PASS ×4;
- contract/provenance: 12/12 PASS;
- boundary scan: 4/4 PASS;
- JavaScript syntax: 2/2 PASS;
- deterministic scheduler/no-repeat: 124/124 PASS.

## Browser · initial
Run 36165090113 · FAIL.
- donor HTTP itself reached the page;
- missing copied B2a dependencies:
  - `wd-donors.js` 404;
  - `wd-registry.js` 404;
- report: 1/1 recorded check, 1 harness error, 2 HTTP errors;
- artifact 10877486385;
- artifact digest `sha256:373acd7890130f019a80fdbeebe4900cb43dc535f821bd3bf69d3854ef294c7f`.

Repair: restore the exact two B2a donor dependencies only.

## Browser · Repair 1
Head `8e3683174f166fcbd503c1b01bd5cc5409d6cee7`
Run 36165380783 · FAIL status after **37/37 functional checks**.
- 0 tracked HTTP errors;
- 10 observed runtime collage compositions;
- donor isolation, CARD/COVER/SLOGAN/VIDEO, rear cull, COLLAGE, treatments, seed variation and no-repeat checks all passed;
- failure was a 90 s harness timeout when reloading CARD Quarter after the completed collage checks;
- artifact 10876754940;
- digest `sha256:af8b886b5cf882e2e4cfbb6f6849d9752dc372786a7071d4770bfe4433f655ee`.

Repair: make the exit proof switch to already-local SLOGAN instead of repeating PDF Quarter loading.

## Browser · Repair 2 / stop
Head `2348c069a99b57149d6a2685496b5ce1b40ebe1a`
Run 36205100427 · **39/40**.
- 0 page errors;
- 0 HTTP errors;
- 11 observed collage compositions;
- final failed assertion only:
  `COLLAGE ticks stop on exit`;
- observed counters: before switch 725, immediately after switch 726, after 1.2 s still 726;
- `collageTimerActive=false` and `running=false` passed;
- artifact 10893632678;
- digest `sha256:3bca6f4ae496657de479df90e283ca2a50c7ce66a6ed060658cc58cd7874f11e`.

No Repair Pass 3.
