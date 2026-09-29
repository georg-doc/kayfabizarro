# KFB Container Turbo-01 · Checkpoint B Test Report

Tested source head: `b4c7bb14cb51d6c5515613593b33c0ea0e183e89`
GitHub Actions run: `36548532308`
Artifact: `11023896755`
Digest: `sha256:c18e1193c79165efdd410337b521d309a646c48e831d9118e4acfeb2568132e0`

## Result
**29/29 browser checks PASS**
- runtime errors: 0
- page/console errors: 0

## Explore
- title boots;
- EXPLORE entry visible;
- one player kart;
- Race ItemSystem off;
- fixed-step drive displacement: **28.91 u**;
- forward speed after proof window: **33.23 u/s**;
- playable state remains EXPLORE.

## Race regression
- 8 karts;
- player present;
- countdown reaches RACING;
- player drive displacement: **22.51 u**;
- Race remains active.

## Ground consumer
- pinned ActionFigure source: `29c7500b39d20945f4f8e73fb02fef91a055b02c`;
- exact semantic clips:
  `Idle_A · Walking_A · Running_A · Jump_Start · Jump_Idle · Jump_Land`;
- Root/Hips world translation stripped;
- Walk moves and uses `Walking_A`;
- Run uses `Running_A`;
- measured Run consumer speed: **2.480274167... u/s**;
- Run returns to Walk;
- Stop returns to Idle;
- Jump sequence: `Jump_Start → Jump_Idle → Jump_Land`;
- landing returns to stable Ground state.

## Recovery note
Runs 5–7 were false-negative wall-clock/rAF checks. Their 0.04 u displacement corresponded to one 1/30 s simulation step. The tested head adds a deterministic `advanceBy(seconds)` QA seam; it does not retune Kart or Ground gameplay behavior.

## Human gate
Judge the **real integrated** motion/control feel in Stage:
- foot sliding;
- Walk/Run transition weight;
- facing/camera;
- jump/landing feel.

No proxy/lab gate is required.
