# GROUND-WALK-PACE-TUNE-02 · Stage Test Report

Status: **SOURCE REAL-BROWSER PASS · PUBLIC PROOF PENDING**  
Date: 2026-09-29

## Exact tested source
- runtime head: `4475271b61e65fae95e5044925b83f2e39c18e6e`
- source handoff: `096f63a32963424d95330f24e5709003d4dd5278`
- run: `36588655547`
- job: `109475640957`
- artifact: `11043426976`
- digest: `sha256:fd09e2adf33efb7c7b70950d3f0b789f40f563158ec84bc2be0177108127601f`

## Source result
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
- settled Shift = **3.0263315488 u/s**
- Shift release = `Running_A / run`
- Orbit retained
- measured/no-query Walking_A profile retained as regression/reference only

## Public gate
Target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

Do not claim this new runtime PUBLIC_VERIFIED until the exact marker `4475271b61e65fae95e5044925b83f2e39c18e6e` and the refreshed W=Running_A / Shift=Running_B behavior pass public Chromium.
