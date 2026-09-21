# Return · Ehrenfeld ↔ Hürth Corridor Consumer Export

Date: 2026-09-19  
Status: **IMPLEMENTATION + STATIC/CI TESTED · RACE CONSUMER / BROWSER OPEN**

## Repository / branch / PR

- Repository: `georg-doc/kayfabizarro`
- Branch: `osm-city/corridor-consumer-export-2026-09-19`
- PR: #82
- Base: current-detail PR #81 at `589bb802eb797373f91d977a36e322c4591cdba3`
- Generated consumer bot commit: `3db2c786152fd4d77ca33a63effd2a9db9c1d4c1`

## GOAL

Convert the fresh current OSM corridor source into one deterministic metre-frame City consumer scene while keeping movement, collision ownership, camera and gameplay outside City Lab.

## EXISTING OWNER

- OSM City Lab: source normalization / city geometry / consumer export.
- Race / Free Roam / Travel: movement/contact/camera receiver ownership unchanged.
- Landmark Group Rig / Living Toy World: donor only; this slice adds only a non-owning placement socket.

## EXACT SOURCES

Current narrow source:
- source bot commit `69645c04f8ca2b1ec979c6b046a4a7d551cd88df`
- source SHA-256 `a6a6479e540a9c89d73da86a34313708920e5b0e1f551c9ca4c61c59d06928f6`
- 117,750 OSM elements
- freshness gates PASS

Route evidence:
- route source/evidence commit `12bc1b03bf179e3d2b45b3a1cf4e56914690f506`
- 11,384.3 m
- 510 route nodes
- 220 m half-width selection band

## IMPLEMENTATION

Added:
- `scripts/build-ehrenfeld-huerth-corridor.mjs`
- `.github/workflows/osm-city-corridor-consumer.yml`

Shared hardening:
- `src/osm/normalize.js`
  - bounds reduction changed from spread-argument min/max to iterative reduction;
  - no geometry/style rule changed.

Generated:
- `data/ehrenfeld-huerth-corridor-v0/normalized.json`
- `scenes/ehrenfeld-huerth-corridor-v0.json`
- `evidence/ehrenfeld-huerth-corridor-v0-consumer.json`

Consumer behavior:
- one local ENU metre frame near route midpoint;
- road/water segments retained only when they intersect the ~220 m route band;
- source-exact building and landuse polygons retained when they intersect the route band;
- OSM ids/tags/provenance preserved;
- explicit Ehrenfeld/Hürth join anchors;
- non-owning landmark placement socket:
  - `osmIdentityOverride`
  - `authoredSurrealPlacement`.

No landmark deformation, bumper/contact force or runtime movement is implemented here.

## TESTED RESULT

GitHub Actions first implementation run:
- run `35412118048`
- job `105813628016`
- syntax PASS
- existing Ehrenfeld/Hürth normalization regression PASS
- corridor build PASS
- deterministic rebuild PASS
- final commit step initially failed because the regression build rewrote timestamped existing-city evidence files, leaving unstaged changes before `git pull --rebase`.

Delivery repair:
- restore only those regression evidence side-effects before commit;
- narrow workflow trigger so generated corridor outputs do not retrigger the workflow.

Second run:
- run `35412177342`
- job `105813800461`
- syntax PASS
- Ehrenfeld/Hürth regression PASS
- corridor build PASS
- deterministic rebuild PASS
- artifact commit PASS
- job PASS

Generated consumer evidence:
- source elements: **117,750**
- route nodes: **510**
- route physical length: **11,384.3 m**
- route half width: **220 m**

Feature counts before route-band selection:
- roads: 3,958
- buildings: 14,492
- landuse: 474
- water lines: 15

After selection:
- roads: **2,486**
- buildings: **7,420**
- landuse: **332**
- water lines: **2**

Consumer bounds:
- size X: **3,560.216 m**
- size Z: **9,735.554 m**

All recorded gates PASS:
- source fresh;
- source SHA matches;
- metre frame;
- route preserved;
- route band present;
- roads/buildings remain;
- retained road segments satisfy selection;
- OSM ids preserved;
- finite values;
- two endpoint joins;
- landmark socket;
- movement owner unchanged;
- deterministic output.

Hashes:
- normalized SHA-256: `e88450d51169f7293bdbfb87955826cf3328a25e00eb3c24e8a08c636e406e6f`
- scene SHA-256: `258c4d5a3872750bc9045d771646e85dbf36aab8a14243db98adc0d288edf07d`

## SIZE / PERFORMANCE BOUNDARY

Current files:
- `normalized.json`: **6,091,678 bytes**
- consumer scene: **10,206,808 bytes**

These are accepted as **Stage candidates only**.

No claim is made yet for:
- browser parse time;
- render time;
- mobile performance;
- streaming necessity;
- memory budget.

Do not build a streaming architecture before the first real C0 browser consumer test measures this candidate.

## PUBLIC DEPLOYMENT

No accepted public gameplay deployment from this slice.

Cloudflare branch-preview checks are build infrastructure evidence only, not a Race consumer PASS.

## GEORG ACCEPTANCE

Pending; there is no integrated visual/gameplay slice yet.

## OPEN

The City export is ready to hand to the existing Race C0 receiver.

## ONE NEXT GATE

**Mount the exact pinned corridor consumer scene into the existing OSM City Drive C0/C1 Stage branch, start at the Hürth join, and browser-test continuous driving toward Ehrenfeld without changing the C0 physics owner.**
