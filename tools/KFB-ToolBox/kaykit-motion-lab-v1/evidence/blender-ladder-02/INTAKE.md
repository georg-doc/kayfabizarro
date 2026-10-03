# Blender Locomotion Ladder 02 · Central Motion SSOT intake

Date: 2026-10-03
Owner: KFB ToolBox / Animation-Motion authoring
Source donor: Draft PR #336
Source head: `42c734eeaedcf1b8ed29f854b48c265e4eef4e13`

## Exact donor evidence

- `LOCOMOTION_LADDER_02.json` · blob `59f49e9952b0d266c7cd435e85de601bd9da94f1`
- `RETURN.md` · blob `839c2f68bfcf67d3cc3e036fb433d36b122a689d`
- `KFB_LOCOMOTION_LADDER_02_review_plan.json` · blob `b1eb3ae84521a7a717b00a064cd1cc2ca66818eb`
- `blender_ladder_review.py` · blob `23696665e048d965ea5fbdb4a447857e20334558`

The complete verified Motion Library v7 donor tree is adopted as one subtree:
- source tree `ca6218cc0d79f9e75f1ffccc2715f60cecf0e2bb`
- catalogue: `kfb.motion-catalog.v1`, version 2026-10-03, 395 clips
- Intake 07: +25 clips, 16 duplicates rejected

## Status

TECHNICAL EVIDENCE ADOPTED · HUMAN LOOK OPEN

Forward ladder is technically complete:
walk → jog → runEasy → run → sprint.

No visual preference is silently promoted. The open look choices remain:
- jog: jog_forward_a vs jogging_a
- run: medium_run_a vs running_d
- sprint: sprint_a vs fast_run_a

Known technical gaps remain explicit:
- no side jog;
- backward jog HOLD;
- left strafe run HOLD;
- running turns only right;
- run stop ends with ~45° turn.

PR #333 remains the sole current Motion SSOT owner. PR #336 is donor/evidence only after convergence.
