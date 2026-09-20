# 3D Conspiracy Iceberg Explorer — start here (re-homed export)

Status: `UNVERIFIED` as a KFB project node — not yet in `skills/chat/REGISTRY.json`.

## What this is

A Claude-Design-authored Three.js iceberg explorer (KayfaBizarro-DS, Uncle FrizzleBob as
narrator). See `docs/DOKU.md` for the full feature inventory, `docs/ENGINE.md` for the
data → scene → DC-logic → atmo-engine architecture, `docs/cuts/` for session history.

## Read order for a fresh agent

1. This file.
2. `docs/DOKU.md` — what exists, file-by-file.
3. `docs/ENGINE.md` — architecture contract (view-agnostic layers, `goToAnchor`, atmo).
4. `docs/cuts/2026-07-05_session-cut.md` — most recent session, incl. the binding
   "no transform above a scroller" paint rule (costly, learn it once).
5. `CHANGELOG.md` — additive history, incl. this re-home event.
6. `HOUSEKEEPING.md` — artifact status + named (not executed) cleanup candidates.

## If this becomes a tracked KFB project

Sync via the central router at `georg-doc/kayfabizarro/skills/chat/` per
`SYNC_PROTOCOL.md`. This folder ships a `.kfb-sync.json` cursor stub — fill in
`lastSeenRouterCommit` once read against the router's actual HEAD, and register this
project's repository in `skills/chat/REGISTRY.json` (or ask the router owner to).

## Known open threads (from docs/cuts, not yet acted on here)

Map-View, theme.js + pack-format v2, 159-entry content enrichment, wobble fine-scatter,
11Labs Atmo track generation, `uploads/assets/` extras (logos/marginalia/divider — promote
or drop).
