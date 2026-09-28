# RUN STATE · PD-POOL-C1 · 2026-09-28

Status: **IMPLEMENTATION CHECKPOINT · NEW CURATED DISCOVERY ROUND · NOT HISTORICAL RECONSTRUCTION**

- Slice: `PD-POOL-C1`
- Owner: **Asset Librarian / Billboard Media**
- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/public-domain-pool-c1-2026-09-28`
- Base main: `dbc7a6bc2414f3e870ff08053eb62fb67dc9202a`
- Stage review route: `https://kayfabizarro.pages.dev/asset-librarian/` (**existing permanent route; C1 is not published there yet**)
- Protected owners: Asset Librarian registry/discovery; Billboard runtime; existing four-object PD-POOL-R3 smoke set.

## Goal

Add one bounded new curated batch to the already proven public-domain pool using the recovered "Pool - 02" discovery seeds as a donor, but keeping the current hardened `fetch_pool.py` as the persistence/rights-recheck owner.

C1 is explicitly a **new dataset**. It must not be described as the lost historical `84 free / 6 attribution / 40 rejected` selection.

## Bound

- discovery maximum: **24 candidates total**;
- maximum: **6 candidates/provider** across The Met, AIC, Wikimedia Commons and Internet Archive;
- existing persisted provider/source IDs are skipped;
- acceptance floor: **12 newly accepted objects** and **at least 2/provider**;
- IA persists Item Tile only in this gate;
- Met/Commons use provider preview derivatives; AIC uses a bounded IIIF derivative;
- total newly stored C1 payload must remain <= 200 MB;
- no second registry, no Billboard runtime change, no merge, no Live promotion.

## Source chain

1. `tools/production_desk/briefings/PUBLIC_DOMAIN_POOL_PD01_2026-09-27.md`
2. `skills/chat/workflows/PD_POOL_R3_CLOSEOUT_2026-09-27/RETURN.md`
3. recovery PR #251 / `PD_POOL_MANIFEST_RECOVERY_2026-09-27`
4. donor package `tools/KFB-ToolBox/_inbox/KFB Public Domain Pool - 02/`
5. current hardened `tools/public_domain/fetch_pool.py`

## Completed phase

- Current main/head rechecked.
- Historical recovery is kept separate.
- New C1 branch created from current main.
- Discovery/fetch contract adapted additively; no existing smoke behavior is intentionally changed.

## Next operation

Run the dedicated C1 GitHub Actions gate:
1. compile + JSON checks;
2. re-run the existing 4-object smoke manifest as regression;
3. discover bounded new candidates;
4. recheck/download via current fetcher;
5. second-run idempotence;
6. persist only a passing C1 batch and machine-readable evidence.

## Stop condition

If the same C1 gate fails after two repair passes, freeze the candidate and export failure recovery. Do not broaden scope or fall back to blind bulk import.

## Quality audit after first green machine run

Workflow run `36469308353` proved transport/rights/idempotence, but the first selector allowed one broad query to fill an entire provider cap. That produced misleading discovery tags (for example non-silent IA items under `silent film 1920` and loosely related Met objects under `alchemy`).

That persisted batch is **TECHNICALLY_GREEN_BUT_NOT_REVIEW_READY** and is not the C1 acceptance candidate.

### Repair pass 1

- interleave categories round-robin per provider;
- accept at most one candidate per search phrase;
- reset only prior `c1-*` candidate payload/sidecars before re-running;
- preserve the original four verified smoke assets;
- correct workflow provenance so `sourceHead` records the actual GitHub SHA.

No scope expansion: caps, rights recheck, byte limits, single Asset Librarian owner and no-publication boundary remain unchanged.
