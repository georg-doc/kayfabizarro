# Test Plan · S0–S2

## Automated S0

`tests/check-normalize.mjs`

- same fixture → byte-equivalent normalized object;
- OSM IDs preserved;
- missing building height produces finite documented fallback;
- road width finite;
- S2 export uses named existing owners.

`tests/check-snapshot.mjs` after cache build:

- cached Overpass → committed `normalized.json` exactly;
- normalized → committed consumer scene exactly;
- roads and buildings are non-empty;
- local frame is metres;
- attribution is ODbL;
- no NaN building heights.

The source-cache workflow also writes `evidence/ehrenfeld-v0-s0-report.json`.

## Browser S1

Human/browser gate:

1. TOP;
2. OBLIQUE;
3. STREET;
4. road/intersection continuity;
5. building-road gross overlap;
6. green/water placement;
7. palette/roof readability;
8. no runtime Overpass request.

No human PASS is inferred from static tests.

## Receiver S2

Use the named Free-Roam/Travel receiver and record separately:

- walk alignment;
- enter vehicle;
- forward/reverse neutral transition;
- three-point turn;
- parking;
- intersection;
- road↔Travel-terrain contact;
- stop and exit;
- save/reload only after the existing owner delta is implemented.

No S2 TESTED RESULT exists until that consumer loop runs.
