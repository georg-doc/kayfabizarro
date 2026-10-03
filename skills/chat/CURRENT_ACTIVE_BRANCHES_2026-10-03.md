# KFB Current Active Branches · 2026-10-03

Purpose: one human-readable routing page so open Draft PRs do not look like equal current products.

## CURRENT · Motion / Locomotion

PR #333 · **[CURRENT MOTION SSOT] clean current-main convergence**

Owner:
KFB ToolBox / Animation-Motion authoring.

Use for:
- semantic locomotion states;
- source-backed clip/profile truth;
- measured contacts/speeds/phases;
- central motion state machine;
- KCL / Motion Library / Blender measurement reconciliation.

Parallel Blender measurement:
`coworker/locomotion-ladder-01-brief-2026-10-03`
→ expected output `LOCOMOTION_LADDER_01.json`.

Closed donor history:
#127, #294, #331.

Do not build a consumer-local locomotion state machine.

---

## CURRENT · World

PR #332 · **[CURRENT WORLD] Procedural Test World · R2D in WB2**

Base:
current main.

Current tested implementation:
`0335ade26741cf1df4920a723045c25de4fa2a82`

Browser-proven in one WB2 owner:
- R2D continuous island top;
- floating underside;
- Track Core road;
- pond;
- creek;
- waterfall;
- source-proven P1/P2 nature groups;
- no Travel/card host;
- no legacy player.

This is the future movement/Drive/Combat integration host after those owners are proven.

Closed World donor/history:
#307, #311, #313, #316, #319, #322, #323, #327.
R2D design brief #328 is closed as adopted direction.
Branches remain available as evidence.

Current next World task:
existing current building/facade family on R2D building pads.

---

## CURRENT · Residents

Parallel and independent:
- PR #330 · character appearance variants;
- PR #315 · EyeRig Cleanup02 / consumer prep;
- Coworker narrative recon:
  `coworker/kfb-narrative-core-recon-01-2026-10-02`.

Resident Chat implementation PRs #305/#306/#308/#310 are closed donor history.
Their code/evidence remains available.

Island World and Residents do not wait for Locomotion unless a specific feature directly consumes the final player motion owner.

---

## LEGACY / LATER CONSUMER · Travel Globe

Travel remains useful for:
- Flight behavior;
- card/sky history;
- named Travel mechanics.

It is **not** the neutral player test world.

Closed Travel recovery/history:
#39, #41, #43, #44, #45.

Reason:
the old host mixed world, cards, Ground, Flight and repeated integration changes. Parallel branch divergence plus host lifecycle changes caused visible presentation regressions even when the card-start module itself stayed unchanged.

Read:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/TRAVEL_REGRESSION_ANALYSIS.md`.

---

## HEX · asset/topology evidence only

Visible Hex-island reconstruction is not the current open-world route.

Closed but retained donor evidence:
#317, #318, #320.

Measured Hex/catalog facts remain reusable where useful.

---

## Working rule

New product implementation starts from:
1. current main, or
2. the explicitly named CURRENT candidate above.

After a short donor chain, cut a clean convergence from current main.

Do not extend long stacked Draft-PR chains as the product branch.

Status:
- CURRENT = continue here;
- DONOR/HISTORY = reuse facts/code, do not continue product work;
- FROZEN = recovery evidence only;
- DESIGN BRIEF = direction, not runtime owner.

No automatic merge or Live promotion.
