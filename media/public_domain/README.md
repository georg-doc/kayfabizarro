# media/public_domain · freier Asset-Pool

This folder is a provenance-tracked production pool. Rights are rechecked per object at retrieval time and persisted in a .license.json sidecar.

## Tiers

- free · CC0 / Public Domain / Public Domain Mark. Attribution not required by the recorded copyright license.
- fallback-attribution · plain CC BY only. Use only when a free alternative is unavailable; CREDITS.md is generated from stored evidence.
- reject · everything else stays out.

## Layout

- met/
- aic/
- commons/
- ia/
- manifest.jsonl
- CREDITS.md
- PD01_TEST_REPORT.json
- PD01_RETURN.md

## PD-POOL-01 safety contract

The source package from tools/KFB-ToolBox/_inbox/KFB Public Domain Pool claude design.zip supplied the provider recheck/downloader concept. PD-POOL-01 adds atomic downloads, SHA-256 evidence, byte caps and an idempotent second run before the folder can be registered in Asset Librarian.

The runtime never decides rights and must consume only persisted local/registry facts.

## Known rights boundary

Copyright status does not automatically clear trademarks, logos, privacy/publicity/personality rights, or rights in later restorations/translations/music. Internet Archive and Commons metadata can originate from uploaders; source/object identity remains a human review concern before public-facing reuse.

## Bulk-import boundary

Do not run a blind bulk import. The 2026-09-26 intake ZIP does not contain the original exported selection manifest. A later bulk fill must start from a recovered/exported selection list or a separately reviewed discovery brief.

## PD-POOL-R1 verified smoke set

Status: **PASS · 4/4 SOURCES · IDEMPOTENT · PERSISTED · NO BULK IMPORT**  
Date: 2026-09-27  
Draft PR: **#242**  
Persistence commit: `f3acaaeb98530dd9ffb7d200d61956891e738336`

The fixed smoke set is now durably present:
- Met object 86434 · Bathing suit;
- AIC artwork 24645 · Hokusai, Great Wave;
- Wikimedia Commons · `File:Silent film.svg`;
- Internet Archive · `TheGeneral1926`, Item Tile only.

Each object has a stored provenance/rights sidecar, retrieval timestamp, byte count and SHA-256. The second execution returned 4/4 unchanged, an injected stale `.part` file was removed, and all eight provider payload/sidecar files remained hash-identical. `manifest.jsonl`, `CREDITS.md`, `PD_R1_TEST_REPORT.json` and `PD_R1_RETURN.md` are generated from the persisted evidence.

The Internet Archive Item Tile also passed the required manual source/object review; see `skills/chat/workflows/PD_POOL_R1_2026-09-27/MANUAL_REVIEW.md`.

This is **not** the historical full pool and must not be described as such. The original selected-hit manifest remains missing.

Exactly one next gate: **PD-POOL-R2 · register only these four proven objects in the existing Asset Librarian and verify provenance/discoverability.**

