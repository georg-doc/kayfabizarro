# RECOVERY · WB2 convergence + Golden corridor

Status: **CURRENT CANDIDATE · WORLD-CONVERGENCE-BASE-01**

Owner: KFB WorldBuilder / WB2
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`
Base main: `9a1f43b628126bb633ed95c99310288f0a5f1a7c`

## Why this branch exists

Old current-world PR #332 is materially diverged from main and is not a safe One-Shot base.
This branch starts from current main and re-homes only the proven WB2/R2D owner files and their test harness.

Do not merge PR #332 into this branch.
Do not copy its stale Hub/router/Motion metadata.

## Proven donor evidence

PR #332:
- donor head: `e58d0ea4b97debbf8d0053d710612033b7e52908`
- latest browser-proven runtime: `a18846cf8128e3e1facb0b51be0e6aff873d1244`
- browser workflow: `37092514335`
- browser job: `111115656852`
- artifact: `11263101899`
- reported: 0 console errors · 0 page errors · 0 QA problems
- seed 3 donor result: 1 B1/facade building · 14 windows · 1 door

## Current checkpoint

The source files are re-homed onto current main.
New-branch source/browser evidence is required before calling convergence PASS.

Exactly one next gate:
**run current-main source + real-browser regression.**
