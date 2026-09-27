# SOURCE SNAPSHOT · PD-POOL-01

Status: ARCHIVED_FAILED_CANDIDATE
Date: 2026-09-27

## Owner / boundaries

- owner retained: Asset Librarian / Billboard Media;
- Asset Librarian remains the discovery/registry owner;
- Billboard runtime remains unchanged;
- no second asset registry;
- no Stage or Live surface;
- no merge requested.

## Authoritative inputs

- current KFB router at slice start: `skills/chat/START_HERE.md` on main;
- current Stage workflow: `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`;
- current fresh-chat protocol: `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`;
- PD brief: `tools/production_desk/briefings/PUBLIC_DOMAIN_POOL_PD01_2026-09-27.md` on HUB-CTRL PR #202;
- intake ZIP: `tools/KFB-ToolBox/_inbox/KFB Public Domain Pool claude design.zip`, blob `c741c75cdd73efed1159370040fcd535e7152efd`.

## Intake package inspection

ZIP payload:
1. `export_public_domain/media/public_domain/README.md`
2. `export_public_domain/tools/public_domain/fetch_pool.py`

Missing from the uploaded package:
- original selection UI;
- exported selected-hit `pool-manifest.jsonl`;
- the historical 84 free / 6 attribution / 40 rejected result list as machine-readable IDs.

This is a proven source-package limitation, not a search failure.

## Candidate smoke manifest

- Met object `86434` → `met/bathing-suit-1890-95`
- AIC artwork `24645` → `aic/great-wave-hokusai-1830-33`
- Commons `File:Silent film.svg` → `commons/silent-film`
- Internet Archive `TheGeneral1926`, **Item Tile only** → `ia/the-general-1926-item-tile`

The IA choice deliberately avoids downloading the full film to GitHub.

## Frozen source files

| File | Frozen blob |
|---|---|
| `tools/public_domain/fetch_pool.py` | `509a3458a815a71b2759bb2788b045a3256c4f00` |
| `tools/public_domain/pd01-smoke-manifest.jsonl` | `0e548640b2e8f1cfb6238a56aad02f6db741295d` |
| `tools/public_domain/PD01_PLAN.md` | `438855098cbf6647fa511339e6b257f02bdb097e` |
| `tools/public_domain/SOURCE_REVIEW_PD01.md` | `1e2b66796ac91606664fadf43c05bfa0695d1f81` |
| `media/public_domain/README.md` | `c67743e0a6cd06bf118585681d0715fdbab6b377` |
| `.github/workflows/public-domain-pool-pd01.yml` | `7c48c76ff4fe615fcd7a3b56b7e5794c8d55d09c` |

Last known compiling fetcher before AIC-header edits:
- implementation commit: `154e573b8defacd17e836de049b3853578291f94`;
- fetcher blob: `8aba09957d12b9d8182858a60b0360356fbeda80`.

## Generated assets

None are durable.

Run `36283860675` downloaded three source candidates into the ephemeral runner, then exited on AIC 403 before the persistence step. No generated PD asset file or sidecar was committed.
