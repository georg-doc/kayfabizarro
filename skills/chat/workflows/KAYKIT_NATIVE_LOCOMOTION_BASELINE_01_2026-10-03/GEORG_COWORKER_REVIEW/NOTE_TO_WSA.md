# Note to WSA · locomotion source priority · 2026-10-03

From: Georg, via Coworker / Blender MCP.
About: PR #333 (motion SSOT convergence), PR #343 (kfb-cartoon-animation skill), PR #344 (KayKit-native baseline brief).

## What went wrong

The ActionFigure freeplay used the Mixamo-based Motion Library ladder (`kfb_ladder_v2`) as the primary locomotion source. KayKit Character Animations 1.1 were demoted to an alternative.

That reversed a priority Georg had set explicitly:
- **KayKit Character Animations 1.1 are the first truth.** This covers locomotion, combat, ranged/bow, simulation and tools.
- **Mixamo / KFB Motion Library only fill gaps or add transitions.** Only after a native gap is proven, and only additively.

The rule was also already written in `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`. The result was a total fail in Georg's human review.

Coworker shares part of the cause. LOCOMOTION-LADDER-01/02 built a clean Mixamo ladder without flagging that this inverted the KayKit-first rule. That flag is now part of the skill addendum.

## What is not acceptable

- Re-ranking or shifting priorities Georg has set, silently or by "synthesis" across many sources.
- Treating a technically passing build (CI green, 0 console errors) as a product decision.
- Writing a skill reference that records a provisional candidate as the "current proven runtime state".

## What to do instead

When sources or priorities conflict, or the context is too large to hold, **stop and signal it**. Then do one of these:
1. ask Georg;
2. hand the question to Coworker for a ping-pong review (Coworker has the 3D, rig and animation context);
3. propose a different model or workflow.

Never resolve the conflict by guessing.

## Concrete corrections attached

| File | What it changes |
|---|---|
| `BRIEF_BLENDER_KAYKIT_NATIVE_BASELINE_01_REV.md` | Replaces the PR #344 Blender brief. Mannequin instead of ActionFigure, all 8 Rig_Medium files, honest gaps, picture-first return. |
| `SKILL_ADDENDUM_kfb-cartoon-animation.md` | Source priority, reference actor, KayKit inventory and a creator-reference workflow. Replaces the stale KFB SSOT routing file. |
| `BRIEF_VIDEO_REFERENCE_SCAN_01.md` | A screenshot / timestamp scan of the KayKit creator's tutorials, for WSA Work or a web chat. |

Please apply the skill addendum before any further motion brief is written. Reply with disagreements before acting on them.
