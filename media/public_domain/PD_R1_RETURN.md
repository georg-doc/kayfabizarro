# RETURN · PD-POOL-R1 · four-source smoke

Status: **PASS · 4/4 SOURCES · IDEMPOTENT · PERSISTENCE GATE GREEN · NO BULK IMPORT**
Tested source head: `85c154eb796b7abd733b848249b0938045ec0ff2`

## Persisted bounded smoke assets

| Provider | Title | Local path | Bytes | SHA-256 | Rights |
|---|---|---|---:|---|---|
| met | Bathing suit | `met/bathing-suit-1890-95.jpg` | 258743 | `8d4696259a2fa664da351e6f619a8808ca129c1bd45e4d0f80e87381c151917c` | Public Domain · The Met Open Access (API isPublicDomain=true) |
| aic | Under the Wave off Kanagawa (Kanagawa oki nami ura), also known as The Great Wave, from the series "Thirty-Six Views of Mount Fuji (Fugaku sanjūrokkei)" | `aic/great-wave-hokusai-1830-33.jpg` | 238585 | `e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56` | Public Domain · Art Institute of Chicago (API is_public_domain=true) |
| commons | File:Silent film.svg | `commons/silent-film.svg` | 26061 | `e55e5d25eb1c834816a10d4d15d9ef30fa8a467c92d853f7439556b5774aadc7` | Public domain |
| ia | The General 1926 | `ia/the-general-1926-item-tile.jpg` | 4070 | `bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19` | http://creativecommons.org/publicdomain/mark/1.0/ |

## Actual checks

- Python compile: 1/1 PASS
- First provider gate: 4/4 LOADED; 0 rejected
- Source/license sidecars: 4/4 complete
- Payload type sanity: 4/4 PASS
- Second run: 4/4 UNCHANGED; 0 redownloaded
- Stale partial-file injection: 1/1 removed; never registered
- Provider payload + sidecar hash identity: 8/8 files unchanged across second run
- Generated manifest: 4/4 rows
- Credits: generated from stored sidecars; 0 attribution rows because all four are free tier

## Protected boundary

- Asset Librarian remains the registry/discovery owner.
- Billboard runtime unchanged.
- These four files are a bounded smoke set, not a curated bulk pool.
- No Stage or Live publication.
- Original historical selected-hit manifest is still missing.

## Exactly one next gate

**PD-POOL-R2 · register only this proven four-object smoke set in the existing Asset Librarian, then verify discoverability/provenance without starting bulk population.**
