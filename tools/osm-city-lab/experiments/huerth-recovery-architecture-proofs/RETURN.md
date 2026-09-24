# RETURN · Hürth Recovery Architecture Proofs A/B/C

Date: 2026-09-24
Status: **ISOLATED PROOFS IMPLEMENTED · 34/34 BROWSER PASS · HUMAN REVIEW PENDING**
Owner: **OSM City Lab presentation / KFB ToolBox authoring**

## Why this exists

Frozen Hürth R2 is not being repaired again.

This new slice proves the three replacement foundations in isolation before any Hürth R3 exists.

## Git

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/huerth-architecture-proofs-2026-09-24`
- Draft PR: **#200**, stacked on frozen PR #194
- implementation head: `c36f97be48a6b5da5617aa000c921e4a51329f7f`
- parent failed R2 remains frozen
- no merge
- no Hürth city-block candidate created

## A · ROAD-01

The proof no longer renders road / curb / path as stacked ribbons plus patches.

Pipeline:
`open centerlines → offset/buffer → union/difference → non-overlapping regions → one shared BufferGeometry`.

Measured result:
- 1 surface mesh;
- 3 material groups;
- 0 overlap road/curb;
- 0 overlap path/street;
- 0 patch discs;
- 0 overlay surface meshes.

Clipper2 TypeScript is **evaluation only** until Georg accepts ROAD-01.

## B · HOUSE-01

Left:
exact tested V2 source donor in isolation.

Right:
candidate built from the same Elastic V2 deformation functions, but:
- one mesh owns wall + eave + roof;
- the existing final wall-top vertices are reused as the inner eave row;
- roof grows from that shared seam;
- neutral material;
- shadows OFF.

Measured:
- source 2 meshes;
- candidate 1 mesh;
- 20 shared eave vertices;
- 0.58 m isolated proof overhang.

This is an architecture proof, not the final roof design.

## C · FACADE-01

Six explicit composition families replace independent RNG:
- ABA;
- AAB;
- ABC progression;
- paired cluster;
- entrance break;
- quiet/active balance.

Across all six:
- one block cadence `A A B A C B`;
- wall = dominant;
- roof = secondary;
- door = accent;
- windows = subordinate.

Palette owners are reused:
- Racer Cologne harmonic `makePalette()`;
- card seed → deterministic palette seed seam;
- WorldContext Story palette owner;
- random harmonic palette remains available with an explicit seed.

## Browser proof

Run `35952588495`:
**34/34 PASS · 0 errors**

Artifact:
`10789206931`

Digest:
`sha256:91dda6180c8d2dc152d770e2844704a837e46279c9824c061a142c3a97a14881`

## What remains unchanged

- frozen R2 code;
- Hürth OSM source;
- Clean / Cartoon / Grotesque owners;
- LC-01 remains HOLD;
- no library adoption yet;
- no city-block integration.

## Human review publication

Direct route:
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-architecture-proofs/`

Publication model:
- exact tested multi-file app is not copied/rebuilt;
- Cloudflare wrapper uses a `<base>` pinned to `c36f97be…`;
- old `huerth-look` route remains failed R2 evidence.

Public verification is recorded separately after the exact URL is opened.

### Publication evidence

- review route: `https://kayfabizarro.pages.dev/kfb-hub/pruefen/huerth-architecture-proofs/`
- `cloudflare-live` wrapper commit: `e16dc4abead4e33a2fffa2b31f64f506ca7d9689`
- wrapper pins tested app: `c36f97be48a6b5da5617aa000c921e4a51329f7f`
- KFB Hub routing commit: `e49f9dc1cf61c92093d3e1d9ba45b9f39f8558b4`
- Hub card links the same direct review route.
- **PUBLIC_VERIFIED: UNKNOWN** — the current web tool cannot retrieve the `pages.dev` domain, so no live claim is made from this chat.

## Exactly one next gate

**GEORG HUMAN REVIEW OF A / B / C ISOLATED PROOFS.**

Only after A/B/C visual PASS:
open a fresh Hürth implementation candidate.
