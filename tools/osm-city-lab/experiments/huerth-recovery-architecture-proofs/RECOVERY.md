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

Publication:
- wrapper `e16dc4abead4e33a2fffa2b31f64f506ca7d9689`
- Hub `e49f9dc1cf61c92093d3e1d9ba45b9f39f8558b4`
- `PUBLIC_VERIFIED = UNKNOWN` from this chat environment; Georg's direct open is the public/human gate.

## Exactly one next gate

**GEORG HUMAN VISUAL REVIEW · PASS / FAIL A, B, C**

Only if all three pass:
open a fresh Hürth implementation candidate.

## Timeout recovery check · 2026-09-24

A chat/tool timeout occurred after the A/B/C proof slice had already advanced.

GitHub was re-read before any retry. Result:

- no implementation write was lost;
- no duplicate retry is needed;
- branch head observed before this recovery write:
  `a29010a28d613bcdf7389907de4a63817f3f3ffc`;
- Draft PR **#200** exists and is current for this slice;
- tested implementation head remains:
  `c36f97be48a6b5da5617aa000c921e4a51329f7f`;
- final proof browser run remains:
  `35952588495` → **34/34 PASS · A/B/C WebGL2 PASS · 0 errors**;
- evidence artifact remains:
  `10789206931`;
- current proof-branch documentation workflow:
  run `35953299737` → **SUCCESS** on `a29010a2…`;
- Cloudflare wrapper exists and still pins the exact tested multi-file app at `c36f97be…`;
- KFB Hub card points to PR #200 and the same direct review route;
- current `cloudflare-live` branch had advanced beyond the original wrapper/Hub commits, but the intended wrapper blob and Hub card were re-read and remain correct;
- `PUBLIC_VERIFIED` is still **UNKNOWN** from this chat environment; no false live claim.

### Current continuation rule

Do **not** resume implementation.

Do **not** patch frozen R2.

Do **not** open Hürth R3.

Current state is:
**A/B/C isolated proofs implemented + browser-tested + published for human review.**

### Exactly one next gate

**GEORG HUMAN VISUAL REVIEW · PASS / FAIL A, B, C**

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-architecture-proofs/`

Only if all three pass:
open a fresh Hürth implementation candidate.
