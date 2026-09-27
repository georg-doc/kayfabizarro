# TRAVEL-MODES-01 · Stage test report

**Status:** PUBLIC_VERIFIED EVIDENCE · PROCEED PASS · HUMAN GATE CLOSED

## Final Travel branch

- Draft PR: `#39`
- final handoff head: `e3b966efec49e8859254cb48e4aed27fb8963d04`
- runtime/evidence head: `f5ea32f817403cda0e30a426e70f37db8ce03d66`

Final baseline CI `36287034124`, job `108529617196`:
- **133/133 PASS**
- 0 fail · 0 skipped
- build PASS · 197 files · `travel-b0-56d8ba57a8de3810`
- verify PASS · 108 runtime files · 87 local ESM closure · 9 remote specifiers · 0 missing · syntax PASS · JSON PASS
- artifact `10919999491`
- SHA-256 `27eba8e9d67d82665573ac61221a8cba81e782db2a8424338cc7ca941a8109f4`

## Exact Cloudflare browser

Route:
https://kayfabizarro.pages.dev/kfb-hub/stage/travel/travel-modes-01/

Public proof `36286920845`, job `108529307561`:
- **24/24 PASS**
- 0 page errors
- exact runtime marker `f5ea32f817403cda0e30a426e70f37db8ce03d66` visible on marker attempt 1
- Ground owner pair verified
- Flight owner pair verified after mode switch
- return to Ground verified
- Drive + Water unavailable before adapter and controls disabled
- Hub HTTP 200 + Travel router title + exact Stage URL verified
- screenshots: `travel-modes-01-flight.png`, `kfb-hub-travel-modes-01.png`
- report: `report.json`
- artifact `10919964594`
- SHA-256 `bc92e79c57e4d4dc4b52899c21ee5c915dafc4595687d8640673d840b70e1f1e`

The Stage review remains diagnostic-only: no movement, camera or physics is simulated there.

## Human gate

Closed by Georg **PROCEED PASS** on 2026-09-27. This contract-only page remains technical evidence and is not a current user task.

Next productive step: real WorldBuilder/Travel mobility integration. No merge or product Live promotion implied.
