# TEST REPORT · WB-ZONE-CROP-PARITY-01 · 2026-09-27

Status: **PASS · EXACT 369/369 BUILDING IDS · DIAGNOSTIC ONLY**

## GitHub Actions

- tested implementation head: `3178163a4fad44139aa548fabd3c89bf5d2dbb54`
- run: **36323360087**
- job: **108631340758**
- conclusion: **SUCCESS**
- artifact: **10932773701** · `wb-zone-crop-parity-01-report`
- Node: **22**
- renderer/browser/Stage: **not used by design**

## Proven deterministic rule

Use the arithmetic mean of **every serialized footprint coordinate exactly as stored in the pinned normalized source, including the repeated closing coordinate**, then apply the existing inclusive crop bounds:

`x -620..180 · z -300..300`

This reproduces the frozen fixture's **exact 369-id set**, not merely its count.

The first failed WB-ZONE-SEAM attempt used `.slice(0,-1)` before averaging. Removing the repeated closing coordinate changes the boundary weighting and yields the historical **368** failure.

## Variant evidence

| Rule | Count | Missing from candidate vs fixture | Extra in candidate vs fixture |
|---|---:|---|---|
| serialized vertex mean · inclusive | **369** | 0 | 0 |
| serialized vertex mean · strict | **369** | 0 | 0 |
| de-duplicated closing vertex mean | **368** | `way/282677032`, `way/328265555` | `way/328262455` |
| polygon-area centroid | **370** | `way/282677032`, `way/328265555` | `way/236557601`, `way/328262455`, `way/328828242` |
| bbox centre | **370** | `way/282677032`, `way/328262451`, `way/328265555` | `way/236557601`, `way/328262455`, `way/328828242`, `way/32949873` |
| serialized mean rounded to 3 decimals | **369** | 0 | 0 |
| serialized mean · inclusive +1 mm expansion | **369** | 0 | 0 |
| serialized mean · strict 1 mm shrink | **369** | 0 | 0 |

Strict and inclusive bounds are observationally equivalent for this source because no serialized-mean centre lies exactly on an edge.

## Differing boundary buildings inspected

The action report records all centres, bboxes, edge distances and OSM building kind/name for exactly these seven diagnostic ids:

`way/236557601` · `way/282677032` · `way/328262451` · `way/328262455` · `way/328265555` · `way/328828242` · `way/32949873`.

Full durable machine-readable evidence is in `RESULT.json`.

## Gate result

**WB-ZONE-CROP-PARITY-01 PASS.**

No WorldBuilder runtime file, renderer, presenter, Stage route or human-review surface was changed.
