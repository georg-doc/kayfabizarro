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
