# Tool Node · Asset Librarian

Status: CURRENT_TOOL
Source: `tools/asset_registry/librarian/`
Live: https://asset-librarian-v1-2-site-co.kayfabizarro.pages.dev/tools/asset_registry/librarian/

## Purpose

Discover and hand off KFB assets without forcing every production chat to crawl folders or rely on stale bootstrap asset dumps.

## Current reading order

1. registry manifest + pack/rig summary
2. search catalog only when needed
3. produce a compact consumer handoff

## Production rule

Prefer this current registry over legacy multi-megabyte `kfb-asset-library*.json` copies inside old bootstraps. Legacy files remain historical snapshots, not current asset SSOTs.
