# RETURN · Asset Librarian v1.2 Core

## Decision

v1.2 is a UI/product slice over the existing Registry, not a new Registry/indexer and not an LLM product.

## Implementation

The tested v1 browser is extended with daily-use search/browse/detail/preview/tray/review-queue capabilities while preserving exact Registry facts and consumer owner boundaries.

## Tested result

This section is completed by the real GitHub Actions acceptance run. The authoritative evidence is the uploaded `kfb-asset-librarian-browser-smoke` artifact and its `v1.2/result.json` plus T1–T6 screenshots.

## Not part of this slice

- OpenAI/Claude calls
- API keys
- authentication
- Registry writes
- asset edits
- consumer runtime writes
- semantic suitability decisions
- race gameplay/runtime integration

## Next

After T1–T6 PASS: Georg uses the site. Only then hand the same Registry/tasks to Claude Design for Phase 2 A/B comparison.
