# SITE_HANDOFF · CLAY-CITY-MVP-01

For the owner of the existing **KFB Production Control Site / KFB Hub** (HUB-CTRL, #202). Coworker did not edit the Site or the generated Hub file. Ingest from GitHub; do not hand-edit generated output.

## What the Site should show (one card)

- **Title:** Knetstadt zum Spielen: Straße, Häuser, T4-Strecke, Himmel
- **Status chip:** `REVIEW_READY · HUMAN_PLAYTEST_PENDING`
- **One-line result:** from `HUB_UPDATE.json.result`
- **Primary link:** review page <https://kayfabizarro.pages.dev/kfb-hub/pruefen/clay-city-mvp-01/>
- **Secondary link:** same page with `?probe=1` (automatic play check, result in the browser console as `window.__clayCityProbe`)
- **Numbers (small):** play probe 6/7 · donors 13/13 · draw calls −45…−68 % vs R6 · triangles 213–240 k (target 200 k, open)
- **Next action (for Georg):** `HUB_UPDATE.json.nextAction`
- **Source:** branch `coworker/clay-city-mvp-01-2026-09-28`, runtime `d79d3110`, files under `kfb-hub/stage/world/clay-city-mvp-01/`

## Data source

`kfb-hub/stage/world/clay-city-mvp-01/HUB_UPDATE.json` on the branch above (schema `kfb.hub-update/1`). If the Hub builder reads a lane config, add this entry as lane **World**, replacing the R6 "road presentation blocked" item as the current World candidate; keep R6 as history.

## Keep-list for `cloudflare-live`

Add `kfb-hub/pruefen/clay-city-mvp-01/` (wrapper, 1 file). Do not overwrite it by hand; a new runtime head means a new wrapper commit with the new `<base>` pin.

## Not for the Site

No Live promotion, no fixed-Stage publication, no merge. Those wait for Georg's playtest verdict.
