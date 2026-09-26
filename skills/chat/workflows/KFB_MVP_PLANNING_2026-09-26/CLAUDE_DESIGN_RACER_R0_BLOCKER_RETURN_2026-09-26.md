# Claude Design Racer R0 · blocker intake / routing correction · 2026-09-26

Status: **EXPECTED SOURCE_REQUIRED · NO BUILD · CORRECT STOP**

## Report received

Claude Design searched `main` and could not find:
- `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md`;
- `RUNTIME_BASE.json`;
- `MODULE_CATALOG.json`;
- `PLAYABLE_TRACK_R0.recipe.json`;
- `OSM_SEAM_CONTRACT.md`;
- package `SOURCE.json`;
- isolated donor evidence for RKIT base, S/chicane, hairpin, grade/bridge, CITY_STREET, street↔track, switch/bypass and LOOP_REAL.

It correctly refused to substitute unpinned `KFB_P3_STUNT_MODULES_v0_1/*.recipe.json`.

## Recon result

The brief is not absent from GitHub. It exists on **kayfabizarro PR #216**, current observed branch:
`chat/cologne-route-01-plan-2026-09-25`.

PR #216 changed files include:
`skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md`.

However, pointing Claude Design at #216 now would still be premature.

Current Track-Core PR #219 explicitly puts Playable Track R0 **after**:
- G0 authoritative language decision;
- W0 census/contracts/reference;
- Blender oracle/proof sprints;
- Web authoritative runtime/contact parity;
- Claude Design transition visual grammar;
- Web Playable-R0 preparation package.

Therefore the missing R0 package files are not a transport accident to patch around; they are prerequisites that have not yet been produced.

## Decision

- Do **not** copy the R0 brief to `main` as an execution signal.
- Do **not** invent the missing package.
- Do **not** use the unpinned P3 recipes as replacements.
- Keep Claude Design R0 on HOLD.
- Route current work to Track-Core G0/W0.
- Later, Web `PLAYABLE_TRACK_R0_PREP` must emit a closed source package and update the Claude Design brief with exact branch/ref/source evidence.

## Acceptance of this blocker

Claude Design behavior is accepted as correct:
**SOURCE_REQUIRED → stop without building.**

No failed implementation attempt occurred, so the two-repair failure rule is not consumed.

## Exactly one next Racer gate

**Track-Core G0 (JS decision) → W0.**
