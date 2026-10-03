# KFB Current Active Branches · 2026-10-03

Purpose: one human-readable routing page so open Draft PRs do not look like equal current products.

## ACTIVE · Motion / Locomotion

### Current
PR #333 · **[CURRENT MOTION SSOT] clean current-main convergence**

Owner:
KFB ToolBox / Animation-Motion authoring.

Use for:
- semantic locomotion states;
- clip/profile truth;
- measured contacts/speeds/phases;
- central state machine;
- measurement reconciliation.

Parallel Blender measurement:
`coworker/locomotion-ladder-01-brief-2026-10-03`
→ expected output `LOCOMOTION_LADDER_01.json`.

### Donor/history
- PR #127 · Motion Lab v1 donor base.
- PR #294 · Ground locomotion profile consumer donor.

Do not start new consumer locomotion work from either donor.
Travel/Combat integrate only after the central neutral prototype receives Georg visual PASS.

---

## ACTIVE · World

### Current technical candidate
PR #332 · **[CURRENT WORLD CANDIDATE] Procedural Test World 01 · R2D in WB2**

Base:
current `main`.

Purpose:
- future default KFB movement/combat test world;
- R2D v0 source-derived island height/masks + Track Core road are now browser PASS inside WB2;
- no Travel Globe dependency;
- no card lifecycle;
- old `wi1-play` locomotion detached;
- stable WorldBuilder terrain/edit/presenter owners retained.

Source donor:
PR #327 · B3 stable WorldBuilder consumer PASS.

Design direction:
PR #328 · R2D continuous clay islands.

### World donor/history stack
Do not start fresh work from:
- #307 World Corridor stack base
- #311 P0 procedural props frozen proof
- #313 local procedural-props donor
- #316 procedural environment P2 donor
- #319 building B0
- #322 building B1
- #323 building B2

These remain evidence/donors only.
Their useful result is converged into #327 and now the clean current-main candidate #332.

### Rule going forward
After a short donor chain, cut a clean convergence branch from current `main`.
Do not keep extending 6–10 stacked Draft PRs as the product branch.

---

## ACTIVE · Residents

Parallel and independent:
- PR #330 · character appearance variants
- PR #315 · EyeRig Cleanup02 / consumer prep
- Coworker narrative recon branch:
  `coworker/kfb-narrative-core-recon-01-2026-10-02`

Resident/Narrative work does not wait for locomotion unless a feature directly consumes the final player locomotion owner.

Resident Chat PRs #305/#306/#308/#310 remain useful implementation/donor history; the Coworker recon governs the current narrative interpretation.

---

## LEGACY / FROZEN · Travel as test host

Travel Globe remains a donor for:
- Flight behavior;
- card/sky history;
- specific Travel mechanics.

It is **not** the default neutral locomotion test world anymore.

Relevant history:
- Travel PR #43 · large recovery host
- #44 · frozen Mobility Playground candidate
- #45 · frozen headless input probe

Why:
the old Travel host combines world, card presentation, Ground/Flight and multiple integration layers. Host changes repeatedly caused unrelated presentation regressions.

See:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/TRAVEL_REGRESSION_ANALYSIS.md`.

---

## Working rule

New implementation starts from one of:
1. current main, or
2. the explicitly named current candidate above.

Never start from an arbitrary older stacked PR because it happens to contain a donor.

Status words:
- **CURRENT** = start here.
- **DONOR/HISTORY** = read/reuse facts, do not continue product work here.
- **FROZEN** = recovery/evidence only.
- **DESIGN BRIEF** = direction, not runtime owner.

No automatic merge or Live promotion.
