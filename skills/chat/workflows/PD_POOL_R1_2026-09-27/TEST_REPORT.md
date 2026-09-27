# TEST REPORT · PD-POOL-R1 · 2026-09-27

Status: **PASS · 4/4 SOURCES · IDEMPOTENT · PERSISTED**

Owner: **Asset Librarian / Billboard Media**  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/public-domain-pool-r1-2026-09-27`  
Draft PR: **#242**  
Tested workflow-definition head: `85c154eb796b7abd733b848249b0938045ec0ff2`  
Persistence head: `f3acaaeb98530dd9ffb7d200d61956891e738336`  
Workflow run/job: `36285925572` / `108526571635`

## Automated gate

| Check | Result |
|---|---|
| Python compile | 1/1 PASS |
| First provider run | 4/4 LOADED · 0 rejected |
| Provenance/license sidecars | 4/4 complete |
| Payload type sanity | 4/4 PASS |
| Second provider run | 4/4 UNCHANGED · 0 redownloaded |
| Stale partial-file injection | 1/1 removed; never registered |
| Payload + sidecar identity | 8/8 hash-identical across second run |
| Generated manifest | 4/4 rows |
| Credits generation | PASS · 0 attribution rows because all four resolved to free tier |
| Persistence | PASS · 12 files committed only after full gate |

## Persisted smoke assets

| Provider | Object | Bytes | SHA-256 | Recorded rights |
|---|---|---:|---|---|
| Met | Bathing suit · 86434 | 258,743 | `8d4696259a2fa664da351e6f619a8808ca129c1bd45e4d0f80e87381c151917c` | Public Domain · Met API `isPublicDomain=true` |
| AIC | Great Wave · 24645 | 238,585 | `e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56` | Public Domain · AIC API `is_public_domain=true` |
| Commons | `File:Silent film.svg` | 26,061 | `e55e5d25eb1c834816a10d4d15d9ef30fa8a467c92d853f7439556b5774aadc7` | Public domain |
| Internet Archive | `TheGeneral1926` Item Tile | 4,070 | `bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19` | Public Domain Mark 1.0 |

AIC additionally recorded API HTTP 200 and image HTTP 200.

## Manual Internet Archive check

**PASS.** The persisted Archive Item Tile visibly shows the silent-film copyright card “Copyright by Joseph M. Schenck”. AFI records Schenck as producer/copyright claimant for *The General* (1926), and the film transcription contains that exact card. See `MANUAL_REVIEW.md`.

## Scope boundary

This result proves only the fixed four-object smoke set.

It does **not** prove or authorize:
- reconstruction of the historical 84/6/40 selected-hit set;
- bulk population;
- automatic public reuse of arbitrary Archive/Commons objects;
- a second asset registry;
- Billboard runtime changes;
- Stage or Live publication.

## Exactly one next gate

**PD-POOL-R2 · register only this proven four-object smoke set in the existing Asset Librarian, then verify provenance/discoverability without starting bulk population.**
