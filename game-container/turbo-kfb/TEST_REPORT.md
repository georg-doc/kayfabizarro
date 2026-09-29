# KFB Container Turbo-01 · Browser Test Report

Tested runtime head: `b4c7bb14cb51d6c5515613593b33c0ea0e183e89`
Run: `36548532308`
Artifact: `11023896755`
Digest: `sha256:c18e1193c79165efdd410337b521d309a646c48e831d9118e4acfeb2568132e0`

## Result
**29/29 PASS**
- runtime errors: 0
- page/console errors: 0

### EXPLORE
- title + entry + mode + one player kart PASS
- Race ItemSystem off PASS
- drive displacement 28.91 u PASS
- speed 33.23 u/s PASS

### Race regression
- 8 karts PASS
- countdown → racing PASS
- player drive displacement 22.51 u PASS

### Ground consumer
- pinned ActionFigure source PASS
- exact 6 clips PASS
- starts Idle_A PASS
- no Root/Hips world translation PASS
- Walk movement + Walking_A PASS
- Run + Running_A PASS
- measured Run consumer speed 2.480274167... PASS
- Run → Walk PASS
- Stop → Idle PASS
- Jump_Start → Jump_Idle → Jump_Land PASS

## QA recovery
The prior 0.04 u failures were caused by rAF throttling in the headless runner. Deterministic `advanceBy(seconds)` fixed the proof clock without retuning gameplay.

## Stage
`cloudflare-live@563d3c1f1c0ed89bf810ba7448db8e90bf0a30f3`
Cloudflare Pages: SUCCESS.
