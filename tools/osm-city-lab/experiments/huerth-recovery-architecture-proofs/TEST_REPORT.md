# TEST REPORT · Hürth Recovery Architecture Proofs A/B/C

Date: 2026-09-24
Branch: `chatgpt-web/huerth-architecture-proofs-2026-09-24`
Implementation head: `c36f97be48a6b5da5617aa000c921e4a51329f7f`

## Browser result

Run `35952588495`:
- **34/34 PASS**
- A / B / C WebGL2 = PASS
- page / console errors = 0
- artifact `10789206931`
- digest `sha256:91dda6180c8d2dc152d770e2844704a837e46279c9824c061a142c3a97a14881`

## ROAD-01

PASS assertions:
- one `BufferGeometry` surface owner;
- 3 material groups;
- road+curb partition error = **0**;
- road/curb overlap area = **0**;
- path/street overlap area = **0**;
- patch discs = **0**;
- overlay surface meshes = **0**.

Visual evidence:
`01-road-topology.png`

## HOUSE-01

PASS assertions:
- exact tested V2 donor shown separately;
- source = 2 meshes;
- candidate = **1 mesh**;
- shared wall/eave vertices = **20**;
- overhang = **0.58 m**;
- neutral material = true;
- shadows = **OFF**.

Visual evidence:
`02-house-shared-eave.png`

## FACADE-01

PASS assertions:
- six named patterns:
  `ABA / AAB / ABC / PAIR / BREAK / BALANCE`;
- independent random placement = **false**;
- block cadence = `A A B A C B`;
- hierarchy =
  `WALL_DOMINANT_ROOF_SECONDARY_DOOR_ACCENT_WINDOWS_SUBORDINATE`;
- Racer Cologne donor commit/blob verified;
- Story COMIC palette path also boots.

Visual evidence:
- `03-facade-rhythm.png`
- `04-facade-story-comic.png`

## Repair log

Run 1 failed in the QA HTTP server before app boot:
`ERR_HTTP_HEADERS_SENT`.

Repair 1 changed QA server error handling only.

Run 2 booted the page but timed out.
Diagnostic run proved one copied-donor relative import seam:
`experiments/src/style/cartoon-city.js` 404.

Final repair changed exactly that one copied-donor import path.
Verification proved donor source body unchanged except the import seam.

No third proof-architecture repair was needed.

## Human status

**PENDING**

Automated/browser PASS does not equal acceptance.

Exactly one next gate:
**Georg visual PASS/FAIL of A / B / C isolated proofs.**
