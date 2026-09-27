# RETURN · PD-POOL-R1 · 2026-09-27

Status: **PASS · 4/4 SOURCES · IDEMPOTENT · PERSISTED · HANDOFF COMPLETE**

## Exact slice

- repository: `georg-doc/kayfabizarro`
- owner: **Asset Librarian / Billboard Media**
- branch: `chatgpt-web/public-domain-pool-r1-2026-09-27`
- Draft PR: **#242**
- base main: `6fb02674ea4344169778c0ae9e76b2543f1d78f9`
- source F1 handoff: Draft PR #240 / `db88a9978bbd2a47fa22f2578d506def120d7c60`
- tested workflow-definition head: `85c154eb796b7abd733b848249b0938045ec0ff2`
- Actions run/job: `36285925572` / `108526571635`
- persistence head: `f3acaaeb98530dd9ffb7d200d61956891e738336`
- Stage: **NONE · NOT APPLICABLE**
- Live promotion: **NO**
- merge: **NO**

The final handoff head is the PR #242 branch head containing this Return; verify the branch ref rather than inferring it from the tested workflow or persistence head.

## Actual result

The original bounded four-provider smoke contract is now green.

Automated:
- Python compile: **1/1 PASS**;
- first run: **4/4 LOADED · 0 rejected**;
- source/license sidecars: **4/4 complete**;
- payload type sanity: **4/4 PASS**;
- second run: **4/4 UNCHANGED · 0 redownloaded**;
- stale partial injection: **1/1 removed · never registered**;
- provider payload + sidecar identity: **8/8 hash-identical** across the second run;
- generated manifest: **4/4 rows**;
- Credits: **PASS**, 0 attribution rows because all four objects resolved to the free tier;
- persistence: **12 files committed only after full gate**.

Manual:
- Internet Archive Item Tile: **PASS · source/object correspondence**;
- visible card: “Copyright by Joseph M. Schenck”;
- cross-check matches *The General* (1926) producer/copyright evidence.

## Persisted bounded smoke assets

| Provider | Local path | Bytes | SHA-256 |
|---|---|---:|---|
| Met | `media/public_domain/met/bathing-suit-1890-95.jpg` | 258,743 | `8d4696259a2fa664da351e6f619a8808ca129c1bd45e4d0f80e87381c151917c` |
| AIC | `media/public_domain/aic/great-wave-hokusai-1830-33.jpg` | 238,585 | `e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56` |
| Commons | `media/public_domain/commons/silent-film.svg` | 26,061 | `e55e5d25eb1c834816a10d4d15d9ef30fa8a467c92d853f7439556b5774aadc7` |
| Internet Archive | `media/public_domain/ia/the-general-1926-item-tile.jpg` | 4,070 | `bbc1321e8ca53998e8bb2761a199d0130dc6230de589087ea62eddaf7888ee19` |

Each payload has a neighboring `.license.json` sidecar. Generated pool evidence:
- `media/public_domain/manifest.jsonl`;
- `media/public_domain/CREDITS.md`;
- `media/public_domain/PD_R1_TEST_REPORT.json`;
- `media/public_domain/PD_R1_RETURN.md`.

## R1-specific implementation/evidence files

- `.github/workflows/public-domain-pool-r1.yml`;
- persisted `media/public_domain/` four-object set + sidecars + generated evidence;
- `skills/chat/workflows/PD_POOL_R1_2026-09-27/SOURCE.json`;
- `skills/chat/workflows/PD_POOL_R1_2026-09-27/TEST_REPORT.md`;
- `skills/chat/workflows/PD_POOL_R1_2026-09-27/MANUAL_REVIEW.md`;
- `skills/chat/workflows/PD_POOL_R1_2026-09-27/RETURN.md`;
- `media/public_domain/README.md`;
- `skills/chat/START_HERE.md`;
- `skills/chat/CHANGELOG.md`.

The PR also inherits the preceding bounded PD01/F1 harness and evidence because R1 deliberately starts from the successful F1 handoff.

## Retained boundaries / unresolved

- Asset Librarian remains the only discovery/registry owner.
- Billboard runtime unchanged.
- No second media registry.
- These four objects are a **smoke set**, not the historical curated pool.
- The original selected-hit manifest/UI export remains missing.
- No bulk population was attempted.
- No Stage/public-browser route is required for this nonvisual source/persistence gate.
- No merge or Live promotion.

## Exactly one next gate

**PD-POOL-R2 · register only these four proven objects in the existing Asset Librarian and verify that each is discoverable with its persisted provenance/rights facts.**

Do not start bulk population in R2.
