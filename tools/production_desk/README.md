# KFB Production Desk · PD1 + PD2

Operational mirror beside the KFB Hub (does not replace it, is not a SSOT).
GitHub stays the truth; the Desk renders a generated registry.

## Pieces

| File | Role |
|---|---|
| `config.json` | Explicit lane list: plain-language title/what/yourAction/waitingFor, bucket, provider, repo/PR/branch, expected head, briefing path. The only place a human/chat edits status. |
| `build.py` | Deterministic registry builder. `--online` (Actions, `GITHUB_TOKEN`) or `--fixture` (offline/coworker snapshot/tests). |
| `render_desk.py` | Renders `desk/KFB_PRODUCTION_DESK_V0.html` with the registry embedded as fallback. |
| `desk/desk.template.html` | Desk UI (no dependencies). |
| `tests/test_build.py` | 13 builder tests. |
| `tests/desk_dom_test.mjs` | 28 behavioural jsdom assertions on the rendered Desk. |
| `snapshots/coworker-*.json` | Connector-refreshed fixture used for the committed canonical registry. |
| `../../.github/workflows/production-desk.yml` | Auto-sync workflow. |

Generated: `registry/production/v1/{manifest,lanes,briefings,reviews,standards,wsa,problems}.json`.

## Auto-sync (Asset Librarian pattern)

`schedule (30 min) / dispatch / main push` → `build.py --online` → validate → render → DOM test →
if `contentHash` changed or heartbeat (6 h) → force-push `bot/production-desk-update`.

Desk source order: LIVE (`bot/production-desk-update` raw) → CANONICAL (`main` raw) → embedded snapshot.
Polls every 75 s; switches source/reloads when `contentHash`/`checkedAt` changes. Stale banner after 8 h.

`schedule` only runs from the default branch → **the workflow must be merged to main once** before
the Desk updates itself. Until then the Desk shows the embedded snapshot, labelled as such.

## Freshness vocabulary

- `CURRENT` PR head equals the head recorded with the lane status.
- `MOVED` new commits since the status was recorded → description may be stale (shown as a tag).
- `LAST_KNOWN` external repo, never read by the workflow token (Travel, Racer).
- `UNVERIFIED` fetch failed → also listed under problems.
- `CLOSED` PR merged/closed → lane leaves the active buckets.

## Updating a lane (for chats)

Either edit `config.json` (bucket, texts, `expectedHead` = head the status refers to) or give the lane a
`statusFile` (JSON on the lane's branch with `bucket/what/yourAction/waitingFor/questions/recordedHead`);
the builder picks it up on the next run. Keep Georg-facing texts in plain German; PR/SHA stay in the drawer.

## Cross-repo (PD3, not built)

Travel/Racer need either a GitHub App / fine-grained token stored as an Actions secret, or a
`repository_dispatch` + `KFB_STATUS.json` from each owner repo. Until configured they stay `LAST_KNOWN`.
No credentials were created.
