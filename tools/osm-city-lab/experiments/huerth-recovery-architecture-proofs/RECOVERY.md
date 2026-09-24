# RECOVERY CURRENT · Hürth Architecture Proofs A/B/C

Updated: **2026-09-24**
Status: **CURRENT ISOLATED PROOF CANDIDATE · 34/34 BROWSER PASS · HUMAN REVIEW PENDING**

## Current

- repo: `georg-doc/kayfabizarro`
- Draft PR: **#200** (stacked on frozen PR #194)
- branch: `chatgpt-web/huerth-architecture-proofs-2026-09-24`
- parent frozen R2 branch: `chatgpt-web/elastic-grotesque-clay-huerth01-2026-09-23`
- parent R2 remains **ARCHIVED_FAILED_CANDIDATE**
- tested proof implementation head:
  `c36f97be48a6b5da5617aa000c921e4a51329f7f`
- final browser run:
  `35952588495`
- result:
  **34/34 PASS · A/B/C WebGL2 PASS · 0 page/console errors**
- artifact:
  `10789206931`
- digest:
  `sha256:91dda6180c8d2dc152d770e2844704a837e46279c9824c061a142c3a97a14881`

## A · ROAD-01

- one surface mesh;
- 3 material regions;
- road/curb overlap = 0;
- path/street overlap = 0;
- partition error = 0;
- patch discs = 0;
- overlay surface meshes = 0;
- `clipper2-ts@2.0.1-18` is **evaluation only**, not yet adopted.

## B · HOUSE-01

- left = exact tested V2 donor shown separately;
- right = one-mesh candidate;
- 20 shared wall/eave vertices;
- 0.58 m proof overhang;
- neutral material;
- shadows OFF.

## C · FACADE-01

Six deterministic rhythm families:
`ABA / AAB / ABC / PAIR / BREAK / BALANCE`.

- no independent random placement;
- block cadence `A A B A C B`;
- wall dominant;
- roof secondary;
- door accent;
- windows subordinate;
- Racer Cologne harmonic palette donor and Story COMIC path both boot.

## Recovery after chat loss

Read:
1. this file;
2. `START_HERE.md`;
3. `RETURN.md`;
4. `TEST_REPORT.md`;
5. parent `skills/chat/workflows/KFB_ELASTIC_GROTESQUE_CLAY_V1_2026-09-23/FAILURE_RECOVERY_HUERTH01_R2_2026-09-24.md`.

Do not resume by patching frozen R2.

## Human review route

`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-architecture-proofs/`

Cloudflare wrapper pins the browser-tested app at:
`c36f97be48a6b5da5617aa000c921e4a51329f7f`

## Exactly one next gate

**GEORG HUMAN VISUAL REVIEW · PASS / FAIL A, B, C**

Only if all three pass:
open a fresh Hürth implementation candidate.
