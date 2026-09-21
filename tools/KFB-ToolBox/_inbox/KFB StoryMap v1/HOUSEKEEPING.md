# SMA1 · Housekeeping

| Artifact | Status | Note |
|---|---|---|
| `KFB StoryMap v1.dc.html` | AKTIV | Entrypoint. |
| `KFB StoryMap v1.standalone.html` | ASSET | Self-contained bundle for offline handoff; local assets inlined, remote donor assets (CDN/GitHub/OpenPlanetData) still load over network. |
| `sma1-map-animator.js` | AKTIV | Shared runtime, imported by the DC. |
| `kfb-fluid-v2/card-zone-v2-fluid-source.js` | AKTIV | Source-locked real Card Zone Lab v2 donor. Current water shader. |
| `kfb-fluid-v1/` | DEAD | Deleted 2026-09-22 — identified as a diminished form of the real donor, not the source itself. |
| `kfb-voxel-world-v1/` | AKTIV (partial) | Donor reference for D6 height step + edge texture only; the procedural voxel field itself was not reused (see `docs/SMA1-GATE.md`). |
| `support.js` | ASSET | DC runtime. Never edit. |
| `docs/SMA1-GATE.md` | AKTIV | Canonical gate/decision ledger — living doc, keep appending. |
| `github.md` | AKTIV | Sync ledger against `georg-doc/kayfabizarro`. |
| `POSTMORTEM-2026-09-22.md` | AKTIV | This session's honest account. |
| `SPRINTPLAN.md` | AKTIV | Next-session TODOs, priority-ordered. |
| `CHANGELOG.md` | AKTIV | Additive — do not rewrite past entries. |

## Cleanup candidates (named, not executed)

None identified this session — `kfb-fluid-v1/` was deleted outright rather than marked
DEAD-in-place, since nothing else in the codebase referenced it after the rewire (grep-
confirmed before deletion).
