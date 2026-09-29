# GROUND-WALK-PACE-TUNE-02 · Stage Test Report

Status: **PUBLIC VERIFIED · HUMAN TWO-GEAR FEEL OPEN**  
Date: 2026-09-29

## Exact tested source
- runtime head: `4475271b61e65fae95e5044925b83f2e39c18e6e`
- source handoff: `542eedb91f96b6f718df9e619fb3d3f746b79854`
- source run/job: `36588655547` / `109475640957`
- source artifact: `11043426976`
- source digest: `sha256:fd09e2adf33efb7c7b70950d3f0b789f40f563158ec84bc2be0177108127601f`

Source result:
- pace static: **8/8 PASS**
- integration static: **10/10 PASS**
- Ground+Orbit regression: **27/27 PASS**
- Travel two-gear: **16/16 PASS**
- runtime/page/console errors: **0**

## Travel two-gear
- W immediately = `Running_A / run`
- W target = **2.4802741670 u/s**
- W after 0.06 s = **1.5210503972 u/s**
- settled W = **2.4785986456 u/s**
- Shift immediately = `Running_B / sprint`
- Shift after 0.06 s = **2.8159216475 u/s**
- settled Shift = **3.0263315488 u/s**
- Shift release = `Running_A / run @ 2.5503960035 u/s`
- Orbit retained
- measured/no-query Walking_A remains regression/reference only

## Public Cloudflare proof
Direct Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

Publication source:
`cloudflare-live@92335555295ee84eecfd2c3cec9d01ead98533ab`

Public Chromium:
- run `36589579432`
- job `109478846810`
- **15/15 PASS**
- exact runtime marker `4475271b61e65fae95e5044925b83f2e39c18e6e` PASS
- W Running_A PASS
- Shift Running_B PASS
- Shift release Running_A PASS
- Orbit mounted PASS
- runtime/page/console errors: **0**
- Hub two-gear link PASS
- artifact `11043990368`
- digest `sha256:714159ee306220f12aba2443406e992cf11656b8427f06b15a013a19bd4e6707`
- screenshots: `stage.png`, `hub.png`

Exactly one human gate: Georg judges the two-gear W=Running_A / Shift=Running_B travel feel. No merge / Enter-Exit Kart before verdict.
